import { normalizedLog, unparsedLog } from './normalizedLog.js';
import { parseNginxTime } from './timeParse.js';

const ACCESS_RE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+)[^"]*" (\d{3}) (\S+) "([^"]*)" "([^"]*)"/;
const ERROR_RE = /^(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\] .*?client: (\S+?),/;

// Maps an HTTP status code to a coarse severity level for downstream metrics.
function statusLevel(status) {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'info';
}

// Parses an nginx access log line into the shared normalized record.
function parseAccess(match, raw) {
  const [, ip, ts, method, url, statusStr, bytes, referer, userAgent] = match;
  const status = Number(statusStr);
  return normalizedLog({
    source: 'nginx',
    timestamp: parseNginxTime(ts),
    ip,
    level: statusLevel(status),
    eventType: 'http_request',
    message: `${method} ${url} ${status}`,
    fields: { method, url, status, bytes: Number(bytes) || 0, referer, userAgent },
    raw,
  });
}

// Parses an nginx error log line into the shared normalized record.
function parseError(match, raw) {
  const [, ts, level, ip] = match;
  return normalizedLog({
    source: 'nginx',
    timestamp: new Date(ts.replace(/\//g, '-').replace(' ', 'T')),
    ip,
    level: level === 'error' ? 'error' : 'warn',
    eventType: 'http_error',
    message: raw,
    fields: { level },
    raw,
  });
}

// Parses any nginx line, dispatching between access and error log formats.
export function parse(line) {
  const access = ACCESS_RE.exec(line);
  if (access) return parseAccess(access, line);
  const error = ERROR_RE.exec(line);
  if (error) return parseError(error, line);
  return unparsedLog('nginx', line);
}
