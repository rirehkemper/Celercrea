/**
 * Cloudflare Pages Function – POST /api/contact
 *
 * Sends a contact-form email via the Resend API and returns JSON.
 *
 * Required environment variables (set in Cloudflare dashboard):
 *   RESEND_API_KEY  – your Resend API key (re_xxxxxxxx)
 *   FROM_EMAIL      – verified sender, e.g. hello@celercrea.com
 *   TO_EMAIL        – destination,    e.g. hello@celercrea.com
 */

const ALLOWED_ORIGINS = [
  "https://celercrea.com",
  "https://www.celercrea.com",
];

function getAllowedOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

export async function onRequestPost(context) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": getAllowedOrigin(context.request),
  };

  try {
    /* ── 1. Parse body ─────────────────────────────────────── */
    let body;
    try {
      body = await context.request.json();
    } catch {
      return Response.json(
        { ok: false, error: "Bad request", detail: "Body must be valid JSON." },
        { status: 400, headers }
      );
    }

    const { name, email, type, message, company } = body;

    /* ── 2. Honeypot check ─────────────────────────────────── */
    if (company) {
      // Bots fill the hidden field → silently accept but don't send
      return Response.json({ ok: true }, { status: 200, headers });
    }

    /* ── 3. Basic validation ───────────────────────────────── */
    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "Missing fields", detail: "Name, email, and message are required." },
        { status: 422, headers }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { ok: false, error: "Invalid email", detail: "Please provide a valid email address." },
        { status: 422, headers }
      );
    }

    /* ── 4. Read env vars ──────────────────────────────────── */
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    const FROM_EMAIL     = context.env.FROM_EMAIL;
    const TO_EMAIL       = context.env.TO_EMAIL;

    if (!RESEND_API_KEY || !FROM_EMAIL || !TO_EMAIL) {
      console.error("Missing environment variables – check RESEND_API_KEY, FROM_EMAIL, TO_EMAIL");
      return Response.json(
        { ok: false, error: "Server config error", detail: "Mail service is not configured." },
        { status: 500, headers }
      );
    }

    /* ── 5. Build email ────────────────────────────────────── */
    const subject = `New inquiry from ${name}${type ? ` — ${type}` : ""}`;

    const textBody = [
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Type:    ${type || "(not specified)"}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    const htmlBody = `
      <h2>New CelerCrea Inquiry</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Type</td><td>${escapeHtml(type || "(not specified)")}</td></tr>
      </table>
      <h3>Message</h3>
      <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
    `;

    /* ── 6. Send via Resend ────────────────────────────────── */
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Resend API error:", res.status, detail);
      return Response.json(
        { ok: false, error: "Email provider error", detail: `Status ${res.status}` },
        { status: 502, headers }
      );
    }

    return Response.json({ ok: true }, { status: 200, headers });

  } catch (err) {
    console.error("Unhandled error in /api/contact:", err);
    return Response.json(
      { ok: false, error: "Internal error", detail: err.message || "Unknown error" },
      { status: 500, headers }
    );
  }
}

/* Handle preflight for CORS */
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": getAllowedOrigin(context.request),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/* ── Helpers ───────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
