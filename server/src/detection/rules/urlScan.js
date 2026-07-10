import { countWindow } from '../../redis/slidingWindow.js';
import { keys } from '../../redis/keys.js';
import { buildAlert, SEVERITY } from '../../alerts/alertSchema.js';
import { thresholds } from '../thresholds.js';

// Flags URL/port scanning when one IP produces too many 404s in the window.
export async function urlScan(log, ctx) {
  if (log.source !== 'nginx' || log.fields.status !== 404 || !log.ip) return null;
  const { count, windowSec } = thresholds.urlScan;
  const observed = await countWindow(keys.url404(log.ip), windowSec * 1000, ctx.now);
  if (observed < count) return null;
  return buildAlert({
    severity: SEVERITY.WARNING,
    type: 'url_scan',
    ip: log.ip,
    message: `${observed} 404 responses from ${log.ip} in ${windowSec}s`,
    details: { observed, windowSec, threshold: count },
  });
}
