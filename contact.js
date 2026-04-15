// /functions/api/contact.js
export async function onRequest(context) {
  const { request, env } = context;

  // ---- CORS (restrict to your domain if possible) ----
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = [
    "https://celercrea.com",
    "https://www.celercrea.com",
    // add your Pages preview domain if you test there:
    // "https://YOUR-PAGES-SUBDOMAIN.pages.dev",
  ];

  const corsOrigin = allowedOrigins.includes(origin) ? origin : "https://celercrea.com";

  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
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
    // ---- Env sanity checks ----
    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!env.TO_EMAIL) {
      return new Response(JSON.stringify({ ok: false, error: "Missing TO_EMAIL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!env.FROM_EMAIL) {
      return new Response(JSON.stringify({ ok: false, error: "Missing FROM_EMAIL" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return new Response(JSON.stringify({ ok: false, error: "Expected JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await request.json();

    // Honeypot (frontend adds hidden field named "company")
    if (data.company && String(data.company).trim().length > 0) {
      // Pretend success; silently drop bots
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const type = String(data.type || "").trim();
    const msg = String(data.msg || "").trim();

    // Basic validation
    if (!name || !email) {
      return new Response(JSON.stringify({ ok: false, error: "Name and email are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lightweight email regex (good enough for forms)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email format." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional: require some message content
    if (!msg && !type) {
      return new Response(JSON.stringify({ ok: false, error: "Please include a project type or some details." }), {
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
    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,               // must be a verified sender in Resend
        to: [env.TO_EMAIL],                 // safest as array
        subject,
        text: textBody,
        // Resend API is picky depending on route; sending both avoids "why isn't reply-to working?"
        reply_to: email,
        replyTo: email,
      }),
    });

    if (!resendResp.ok) {
      const errText = await resendResp.text().catch(() => "");
      return new Response(JSON.stringify({
        ok: false,
        error: "Email send failed",
        detail: errText || "Unknown Resend error",
      }), {
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
