import { levelTotals, sourceTotals, topAttackers, totalLogs } from '../db/reportRepository.js';

const PERIODS = { daily: 24 * 3600 * 1000, weekly: 7 * 24 * 3600 * 1000 };

// Resolves a period name into its start Date, defaulting to daily.
function periodStart(period) {
  const span = PERIODS[period] || PERIODS.daily;
  return new Date(Date.now() - span);
}

// Aggregates all report sections for a period from Postgres and Redis.
export async function collectReportData(period, alertBus) {
  const since = periodStart(period);
  const [total, levels, sources, attackers, alerts] = await Promise.all([
    totalLogs(since),
    levelTotals(since),
    sourceTotals(since),
    topAttackers(since),
    alertBus.recent(50),
  ]);
  return { period, since, generatedAt: new Date(), total, levels, sources, attackers, alerts };
}
