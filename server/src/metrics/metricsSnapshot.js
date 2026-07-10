import { requestRate, statusBreakdown, topIps, topSshOffenders } from './metricsReader.js';

// Assembles the full realtime metrics snapshot pushed to the dashboard.
export async function buildSnapshot(windowSec) {
  const windowMs = windowSec * 1000;
  const now = Date.now();
  const [requests, statuses, ips, ssh] = await Promise.all([
    requestRate(windowMs, now),
    statusBreakdown(windowMs, now),
    topIps(windowMs, now),
    topSshOffenders(windowMs, now),
  ]);
  return {
    windowSec,
    at: now,
    requests,
    statuses,
    topIps: ips,
    sshOffenders: ssh,
  };
}
