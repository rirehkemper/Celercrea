// /functions/api/contact.js
export async function onRequestPost(context) {
  const { request, env } = context;

  // ---- Basic CORS (adjust origin if you want strict) ----
  const origin = request.headers.get("Origin") || "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };

  // Preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Only allow POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(JSON.stringify({ ok: false, error: "Expected JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await request.json();

    // Honeypot (add an invisible field on frontend named "company")
    if (data.company && String(data.company).trim().length > 0) {
      // Pretend success; silently drop bots
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const type = (data.type || "").trim();
    const msg = (data.msg || "").trim();

    // Basic validation
    if (!name || !email) {
      return new Response(JSON.stringify({ ok: false, error: "Name and email are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email format." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date().toISOString();

    const subject = `CelerCrea Inquiry — ${type || "Project request"} — ${name}`;
    const textBody =
`New inquiry received (${now})

Name: ${name}
Email: ${email}
Need: ${type || "(not specified)"}

Details:
${msg || "(none provided)"}
`;

    // ---- Send email via Resend ----
    // env.RESEND_API_KEY is set in Cloudflare Pages settings
    // env.TO_EMAIL should be "hello@celercrea.com" (or your real inbox)
    // env.FROM_EMAIL must be a verified sender in Resend (e.g. "CelerCrea <no-reply@celercrea.com>")
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: env.TO_EMAIL,
        reply_to: email, // so you can hit "Reply" and it goes to the client
        subject,
        text: textBody,
      }),
    });

    if (!resendResp.ok) {
      const errText = await resendResp.text().catch(() => "");
      return new Response(JSON.stringify({ ok: false, error: "Email send failed", detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}
