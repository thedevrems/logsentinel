import { query } from './pool.js';

// Returns aggregate log counts by severity level since a start time.
export async function levelTotals(since) {
  const sql = `SELECT level, count(*)::int AS count FROM logs WHERE ts >= $1 GROUP BY level`;
  const { rows } = await query(sql, [since]);
  return Object.fromEntries(rows.map((r) => [r.level, r.count]));
}

// Returns per-source log volume since a start time.
export async function sourceTotals(since) {
  const sql = `SELECT source, count(*)::int AS count FROM logs WHERE ts >= $1 GROUP BY source ORDER BY count DESC`;
  const { rows } = await query(sql, [since]);
  return rows;
}

// Returns the top offending IPs by suspicious event volume since a start time.
export async function topAttackers(since, limit = 10) {
  const sql = `SELECT ip::text AS ip, count(*)::int AS count FROM logs
    WHERE ts >= $1 AND ip IS NOT NULL
      AND (level IN ('warn', 'error') OR event_type = 'ssh_auth')
    GROUP BY ip ORDER BY count DESC LIMIT $2`;
  const { rows } = await query(sql, [since, limit]);
  return rows;
}

// Returns the total number of stored logs since a start time.
export async function totalLogs(since) {
  const { rows } = await query(`SELECT count(*)::int AS count FROM logs WHERE ts >= $1`, [since]);
  return rows[0].count;
}
