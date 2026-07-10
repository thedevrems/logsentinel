import { countWindow } from '../../redis/slidingWindow.js';
import { keys } from '../../redis/keys.js';
import { buildAlert, SEVERITY } from '../../alerts/alertSchema.js';
import { thresholds } from '../thresholds.js';

// Flags a 5xx error spike when server errors exceed the global threshold.
export async function errorSpike(log, ctx) {
  if (log.source !== 'nginx' || (log.fields.status || 0) < 500) return null;
  const { count, windowSec } = thresholds.errorSpike;
  const observed = await countWindow(keys.serverErrors(), windowSec * 1000, ctx.now);
  if (observed < count) return null;
  return buildAlert({
    severity: SEVERITY.CRITICAL,
    type: 'error_spike_5xx',
    message: `${observed} 5xx responses in ${windowSec}s`,
    details: { observed, windowSec, threshold: count },
  });
}
