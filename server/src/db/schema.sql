CREATE TABLE IF NOT EXISTS logs (
  id          BIGSERIAL PRIMARY KEY,
  source      TEXT        NOT NULL,
  event_type  TEXT        NOT NULL,
  level       TEXT        NOT NULL,
  ip          INET,
  ts          TIMESTAMPTZ NOT NULL,
  message     TEXT        NOT NULL,
  fields      JSONB       NOT NULL DEFAULT '{}'::jsonb,
  raw         TEXT        NOT NULL,
  search      TSVECTOR    GENERATED ALWAYS AS (to_tsvector('english', message)) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS logs_ts_idx ON logs (ts DESC);
CREATE INDEX IF NOT EXISTS logs_source_idx ON logs (source);
CREATE INDEX IF NOT EXISTS logs_ip_idx ON logs (ip);
CREATE INDEX IF NOT EXISTS logs_event_type_idx ON logs (event_type);
CREATE INDEX IF NOT EXISTS logs_search_idx ON logs USING GIN (search);
CREATE INDEX IF NOT EXISTS logs_fields_idx ON logs USING GIN (fields);
