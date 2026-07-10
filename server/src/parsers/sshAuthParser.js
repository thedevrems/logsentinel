import { normalizedLog, unparsedLog } from './normalizedLog.js';
import { parseSyslogTime } from './timeParse.js';

const TS_RE = /^(\w{3}\s+\d{1,2} \d{2}:\d{2}:\d{2}) \S+ sshd\[\d+\]: (.*)$/;
const AUTH_RE = /^(Accepted|Failed) (\w+) for (?:invalid user )?(\S+) from (\S+) port (\d+)/;
const INVALID_RE = /^Invalid user (\S+) from (\S+) port (\d+)/;

// Builds a normalized SSH authentication record from extracted fields.
function authRecord({ ts, raw, outcome, username, ip, method, invalid }) {
  return normalizedLog({
    source: 'ssh',
    timestamp: ts,
    ip,
    level: outcome === 'accepted' ? 'info' : 'warn',
    eventType: 'ssh_auth',
    message: raw,
    fields: { outcome, username, method: method || null, invalidUser: Boolean(invalid) },
    raw,
  });
}

// Parses the sshd message body, distinguishing auth results from probes.
function parseBody(ts, body, raw) {
  const auth = AUTH_RE.exec(body);
  if (auth) {
    const [, result, method, username, ip] = auth;
    const invalid = /invalid user/.test(body);
    return authRecord({ ts, raw, outcome: result.toLowerCase(), username, ip, method, invalid });
  }
  const invalid = INVALID_RE.exec(body);
  if (invalid) {
    const [, username, ip] = invalid;
    return authRecord({ ts, raw, outcome: 'invalid', username, ip, invalid: true });
  }
  return null;
}

// Parses an auth.log line into the shared normalized SSH record.
export function parse(line) {
  const head = TS_RE.exec(line);
  if (!head) return unparsedLog('ssh', line);
  const ts = parseSyslogTime(head[1]);
  return parseBody(ts, head[2], line) || unparsedLog('ssh', line);
}
