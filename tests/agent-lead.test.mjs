import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { onRequestPost } from '../functions/api/agent-lead.js';
globalThis.crypto ??= webcrypto;
const sample = () => ({
 name:'Test Visitor',email:'visitor@example.com',businessName:'Example Co',type:'Automation',
 message:'Please contact me',projectSummary:{
 businessGoal:'Improve operations',whatWeDiscovered:'Manual work',
 recommendedDirection:'Automate intake',solutionType:'Integration',
 whyThisFits:'Less retyping',suggestedNextStep:'Consultation'}
});
function db() {
 const rows=new Map();
 return {rows,prepare(sql){let vals=[];return {
   bind(...a){vals=a;return this},
   async run(){
     if(sql.startsWith('INSERT')){
       if(rows.has(vals[0])) return {meta:{changes:0}};
       rows.set(vals[0],{payload_digest:vals[1],state:'processing',receipt_id:null});
       return {meta:{changes:1}};
     }
     if(sql.startsWith('UPDATE')){
       const row=rows.get(vals.at(-1));
       if(sql.includes("state='accepted'")){row.state='accepted';row.receipt_id=vals[0]}
       else row.state='uncertain';
       return {meta:{changes:1}};
     }
     throw Error('Unexpected SQL: '+sql);
   },
   async first(){return rows.get(vals[0])||null}
 }}; } };
}
function setup(send = async()=>Response.json({id:'mail_receipt_1'})) {
 const database=db(), calls=[];
 globalThis.fetch=async (url,opts)=>{calls.push({url,opts});return send(url,opts)};
 const env={AGENTPLACE_API_TOKEN:'test-secret-not-real',RESEND_API_KEY:'fake',FROM_EMAIL:'sender@example.com',TO_EMAIL:'team@example.com',AGENT_LEADS_DB:database};
 async function request(body=sample(),key='a'.repeat(32),token='test-secret-not-real') {
   const r=new Request('https://example.test/api/agent-lead',{method:'POST',
     headers:{Authorization:'Bearer '+token,'Idempotency-Key':key,'Content-Type':'application/json'},
     body:typeof body==='string'?body:JSON.stringify(body)});
   const response=await onRequestPost({request:r,env});
   return {status:response.status,body:await response.json()};
 }
 return {request,calls,database,env};
}
test('authenticated valid inquiry accepted once; repeat returns original receipt',async()=>{
 const s=setup();
 assert.equal((await s.request()).status,200);
 const replay=await s.request();
 assert.equal(replay.status,200);
 assert.equal(replay.body.receiptId,'mail_receipt_1');
 assert.equal(s.calls.length,1);
 assert.equal(s.database.rows.size,1);
});
test('invalid token cannot write or send',async()=>{
 const s=setup();
 assert.equal((await s.request(sample(),'b'.repeat(32),'incorrect')).status,401);
 assert.equal(s.calls.length,0);
 assert.equal(s.database.rows.size,0);
});
test('malformed and missing fields rejected',async()=>{
 const s=setup();
 assert.equal((await s.request('{broken','c'.repeat(32))).status,422);
 const bad=sample();delete bad.email;
 assert.equal((await s.request(bad,'d'.repeat(32))).status,422);
 assert.equal(s.calls.length,0);
});
test('business name is separate from legacy honeypot',async()=>{
 const s=setup();const bad=sample();bad.company='Example Co';
 assert.equal((await s.request(bad,'e'.repeat(32))).status,422);
 assert.equal(s.calls.length,0);
});
test('key reuse for different payload rejected',async()=>{
 const s=setup(),key='f'.repeat(32);
 assert.equal((await s.request(sample(),key)).status,200);
 const changed=sample();changed.message='Changed';
 assert.equal((await s.request(changed,key)).status,409);
 assert.equal(s.calls.length,1);
});
test('concurrent submissions trigger only one provider call',async()=>{
 let release;
 const gate=new Promise(r=>release=r);
 const s=setup(async()=>{await gate;return Response.json({id:'mail_receipt_2'})});
 const key='g'.repeat(32);
 const first=s.request(sample(),key);
 const second=await s.request(sample(),key);
 assert.equal(second.status,409);
 release();
 assert.equal((await first).status,200);
 assert.equal(s.calls.length,1);
});
test('provider failure locks key instead of resending',async()=>{
 const s=setup(async()=>{throw Error('Simulated timeout')});
 const key='h'.repeat(32);
 assert.equal((await s.request(sample(),key)).status,503);
 assert.equal((await s.request(sample(),key)).status,409);
 assert.equal(s.calls.length,1);
});
test('provider accepts but ledger update fails: no automatic resend',async()=>{
 const s=setup(),key='i'.repeat(32);
 const original=s.database.prepare.bind(s.database);
 s.database.prepare=(sql)=>{
   if(sql.includes("state='accepted'"))return {bind(){return {run:async()=>{throw Error('Simulated write failure')}}}};
   return original(sql);
 };
 assert.equal((await s.request(sample(),key)).status,503);
 assert.equal((await s.request(sample(),key)).status,409);
 assert.equal(s.calls.length,1);
});
