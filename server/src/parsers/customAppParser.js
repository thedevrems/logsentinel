import { normalizedLog, unparsedLog } from './normalizedLog.js';
import { loadAppLogConfig } from './appLogConfig.js';

const config = loadAppLogConfig();
const PATTERN = new RegExp(config.pattern);
const KV_RE = /(\w+)=([^\s]+)/g;

// Extracts key=value pairs from a free-form message into a fields object.
function extractKeyValues(message) {
  const fields = {};
  for (const match of message.matchAll(KV_RE)) fields[match[1]] = match[2];
  return fields;
}

// Normalizes a parsed level token into the shared severity vocabulary.
function normalizeLevel(level) {
  const lower = (level || '').toLowerCase();
  if (lower === 'error' || lower === 'fatal') return 'error';
  if (lower === 'warn' || lower === 'warning') return 'warn';
  return 'info';
}

// Parses a custom application log line using the configured named-group regex.
export function parse(line) {
  const match = PATTERN.exec(line);
  if (!match || !match.groups) return unparsedLog('app', line);
  const g = match.groups;
  const message = g[config.messageField] || line;
  const kv = config.extractKeyValues ? extractKeyValues(message) : {};
  return normalizedLog({
    source: 'app',
    timestamp: new Date(g[config.timestampField]),
    ip: kv.ip || null,
    level: normalizeLevel(g[config.levelField]),
    eventType: 'app_log',
    message,
    fields: { logger: g.logger || null, ...kv },
    raw: line,
  });
}
