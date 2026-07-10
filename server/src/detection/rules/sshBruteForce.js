import { countWindow } from '../../redis/slidingWindow.js';
import { keys } from '../../redis/keys.js';
import { buildAlert, SEVERITY } from '../../alerts/alertSchema.js';
import { thresholds } from '../thresholds.js';

// Flags SSH brute-force when one IP exceeds the failed-login threshold.
export async function sshBruteForce(log, ctx) {
  if (log.source !== 'ssh' || log.fields.outcome === 'accepted' || !log.ip) return null;
  const { count, windowSec } = thresholds.sshBruteForce;
  const observed = await countWindow(keys.sshFail(log.ip), windowSec * 1000, ctx.now);
  if (observed < count) return null;
  return buildAlert({
    severity: SEVERITY.CRITICAL,
    type: 'ssh_brute_force',
    ip: log.ip,
    message: `${observed} SSH auth failures from ${log.ip} in ${windowSec}s`,
    details: { observed, windowSec, threshold: count },
  });
}
