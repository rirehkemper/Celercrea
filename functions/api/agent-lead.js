// Cloudflare Pages Function: POST /api/agent-lead
// Server-to-server only. Apply db/agent-leads.sql first.
// Secrets: AGENTPLACE_API_TOKEN, RESEND_API_KEY, FROM_EMAIL, TO_EMAIL
// Binding: AGENT_LEADS_DB. Unknown mail outcomes are locked for manual review.
const respond = (body, status = 200) => Response.json(body, {status, headers:{'Cache-Control':'no-store'}});
const hash = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,'0')).join('');
const safe = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function parse(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const required = (v,max) => typeof v === 'string' && v.trim().length > 0 && v.length <= max ? v.trim() : null;
  const optional = (v,max) => v == null || v === '' ? '' : required(v,max);
  const lead = {
    name:required(data.name,120), email:required(data.email,254),
    businessName:required(data.businessName,180), type:required(data.type,160),
    message:optional(data.message,2500), phone:optional(data.phone,60),
    timeline:optional(data.timeline,160)
  };
  if (Object.values(lead).some(v=>v===null) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return null;
  if (data.company !== undefined && data.company !== '') return null; // company is website honeypot
  if (!data.projectSummary || typeof data.projectSummary !== 'object' || Array.isArray(data.projectSummary)) return null;
  const summary = {};
  for (const k of ['businessGoal','whatWeDiscovered','recommendedDirection','solutionType','whyThisFits','suggestedNextStep']) {
    summary[k] = required(data.projectSummary[k],1600);
    if (summary[k]===null) return null;
  }
  return {...lead,projectSummary:summary};
}
export async function onRequestPost({request,env}) {
  const token = env.AGENTPLACE_API_TOKEN;
  const auth = request.headers.get('Authorization') || '';
  if (!token || !auth.startsWith('Bearer ') || (await hash(auth.slice(7))) !== (await hash(token)))
    return respond({ok:false,error:'Unauthorized'},401);
  if (!env.AGENT_LEADS_DB || !env.RESEND_API_KEY || !env.FROM_EMAIL || !env.TO_EMAIL)
    return respond({ok:false,error:'Server configuration incomplete'},503);
  const key = request.headers.get('Idempotency-Key') || '';
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(key)) return respond({ok:false,error:'Invalid idempotency key'},400);
  let raw;
  try { raw = await request.text(); } catch { return respond({ok:false,error:'Unreadable request'},400); }
  if (new TextEncoder().encode(raw).length > 24000) return respond({ok:false,error:'Payload too large'},413);
  let data;
  try { data = parse(JSON.parse(raw)); } catch { data = null; }
  if (!data) return respond({ok:false,error:'Invalid lead'},422);
  const digest = await hash(JSON.stringify(data));
  const db = env.AGENT_LEADS_DB;
  let owned;
  try {
    const result = await db.prepare("INSERT OR IGNORE INTO agent_lead_submissions (request_key,payload_digest,state) VALUES (?,?,'processing')").bind(key,digest).run();
    owned = result.meta?.changes === 1;
    if (!owned) {
      const found = await db.prepare('SELECT payload_digest,state,receipt_id FROM agent_lead_submissions WHERE request_key=?').bind(key).first();
      if (!found) return respond({ok:false,error:'Cannot resolve request status'},503);
      if (found.payload_digest !== digest) return respond({ok:false,error:'Idempotency key conflict'},409);
      if (found.state === 'accepted') return respond({ok:true,accepted:true,receiptId:found.receipt_id});
      return respond({ok:false,accepted:false,error:'Already processing or outcome uncertain; contact CelerCrea before retrying'},409);
    }
  } catch(e) {
    console.error('D1 claim failed',e?.name);
    return respond({ok:false,error:'Submission temporarily unavailable'},503);
  }
  const lines = [
    'CelerCrea Discovery Lab inquiry','Reference: '+key,
    'Name: '+data.name,'Email: '+data.email,'Business: '+data.businessName,
    'Type: '+data.type,'Phone: '+(data.phone||'Not supplied'),
    'Timeline: '+(data.timeline||'Not supplied'),'Note: '+(data.message||'Not supplied'),
    ...Object.entries(data.projectSummary).map(([k,v])=>k+': '+v)
  ];
  const content = lines.join('\n\n');
  let response, payload;
  try {
    response = await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({
        from:env.FROM_EMAIL,to:[env.TO_EMAIL],reply_to:data.email,
        subject:'Discovery Lab inquiry — '+data.name,
        text:content,html:'<pre style="white-space:pre-wrap">'+safe(content)+'</pre>'
      })
    });
    payload = await response.json().catch(()=>null);
  } catch(e) {
    // Email may have been accepted before a network failure. Never resend automatically.
    console.error('Resend outcome uncertain',e?.name);
    await db.prepare("UPDATE agent_lead_submissions SET state='uncertain',updated_at=CURRENT_TIMESTAMP WHERE request_key=?").bind(key).run().catch(()=>{});
    return respond({ok:false,accepted:false,error:'Delivery outcome uncertain; contact CelerCrea',receiptId:key},503);
  }
  if (!response.ok || !payload?.id) {
    await db.prepare("UPDATE agent_lead_submissions SET state='uncertain',updated_at=CURRENT_TIMESTAMP WHERE request_key=?").bind(key).run().catch(()=>{});
    return respond({ok:false,accepted:false,error:'Mail provider did not confirm acceptance; manual review required',receiptId:key},502);
  }
  try {
    await db.prepare("UPDATE agent_lead_submissions SET state='accepted',receipt_id=?,updated_at=CURRENT_TIMESTAMP WHERE request_key=?").bind(payload.id,key).run();
  } catch(e) {
    console.error('Resend accepted but D1 receipt update failed',e?.name);
    return respond({ok:false,accepted:false,error:'Delivery accepted upstream but receipt could not be recorded; manual review required',receiptId:key},503);
  }
  return respond({ok:true,accepted:true,receiptId:payload.id});
}
