import { query } from './pool.js';

const COLUMNS = ['source', 'event_type', 'level', 'ip', 'ts', 'message', 'fields', 'raw'];

// Flattens a normalized record into an ordered column value array.
function toRow(log) {
  return [log.source, log.eventType, log.level, log.ip, log.timestamp, log.message, JSON.stringify(log.fields), log.raw];
}

// Builds the "($1,$2,...)" placeholder groups for a multi-row insert.
function buildPlaceholders(rowCount, colCount) {
  const groups = [];
  for (let r = 0; r < rowCount; r += 1) {
    const base = r * colCount;
    const cells = Array.from({ length: colCount }, (_, c) => `$${base + c + 1}`);
    groups.push(`(${cells.join(',')})`);
  }
  return groups.join(',');
}

// Inserts a batch of normalized logs in a single multi-row statement.
export async function insertLogs(logs) {
  if (!logs.length) return 0;
  const values = logs.flatMap(toRow);
  const placeholders = buildPlaceholders(logs.length, COLUMNS.length);
  const sql = `INSERT INTO logs (${COLUMNS.join(',')}) VALUES ${placeholders}`;
  await query(sql, values);
  return logs.length;
}

// Runs a full-text search over log messages ordered by recency.
export async function searchLogs(term, limit = 100) {
  const sql = `SELECT id, source, event_type, level, ip, ts, message FROM logs
    WHERE search @@ plainto_tsquery('english', $1) ORDER BY ts DESC LIMIT $2`;
  const result = await query(sql, [term, limit]);
  return result.rows;
}
