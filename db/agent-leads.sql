CREATE TABLE IF NOT EXISTS agent_lead_submissions (
  request_key TEXT PRIMARY KEY,
  payload_digest TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('processing','accepted','uncertain')),
  receipt_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
