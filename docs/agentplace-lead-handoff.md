# Agentplace lead handoff (NOT ACTIVE)

This feature is isolated from the existing `/api/contact` route. The public endpoint is deliberately inaccessible without a private bearer token and D1 schema.

## Cloudflare setup
1. In Cloudflare D1 `celercrea-agent-leads`, run `db/agent-leads.sql` in the **Console** (or via Wrangler). The database exists but currently has no tables.
2. Confirm the Pages production binding `AGENT_LEADS_DB` points at `celercrea-agent-leads`. For preview testing, add a preview binding/database separately if desired.
3. Set `AGENTPLACE_API_TOKEN` as a secret in the Pages environment. Generate a long random value outside chat; never commit, log, or paste it. Store the same token in the Agentplace **server-only** tool configuration.
4. Existing `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL` secrets are reused. Confirm these in the correct Cloudflare environment.
5. Deploy only after explicit owner approval. A Pages redeploy may be required for bindings to take effect.

## POST /api/agent-lead
Server-side only (Agentplace custom server tool), HTTPS, JSON. Headers:
- `Authorization: Bearer <secret>`
- `Idempotency-Key: <opaque 16-128 character alphanumeric/_/- token>`

Request body:
```json
{
  "name":"Example Visitor",
  "email":"visitor@example.com",
  "businessName":"Example Business",
  "type":"Workflow automation",
  "message":"Optional note",
  "phone":"",
  "timeline":"Within two months",
  "projectSummary":{
    "businessGoal":"...","whatWeDiscovered":"...",
    "recommendedDirection":"...","solutionType":"...",
    "whyThisFits":"...","suggestedNextStep":"..."
  }
}
```

**Important:** `company` is the legacy website's honeypot field. Do not use it for business name. Omit it or use `""`.

Returns `{ok:true,accepted:true,receiptId:"..."}` on Resend acceptance (not inbox delivery). Replays with same key + identical normalized payload return the same receipt; changed data with same key returns 409. Processing/uncertain results are locked and require human reconciliation before retrying. Submit a new key only for a new, explicitly approved customer request, never to bypass a timeout.

## Safety and limitations
- Only the D1 claim owner performs a Resend call; concurrent duplicates are rejected.
- D1 contains minimal delivery metadata, no copied contact payload. This is **at-most-once attempting**, not exactly-once guaranteed mail delivery.
- A failed Resend response is conservatively marked uncertain; this can need manual resolution.
- The receipt is the Resend API ID, not confirmation of actual inbox delivery.
- Endpoint authentication controls application access; consider edge rate limiting/WAF and token rotation before public launch.
- It has **not** been integration-tested against a live Agentplace or Cloudflare deployment. Test with a staging binding and mock Resend first; obtain explicit approval before any real send.
