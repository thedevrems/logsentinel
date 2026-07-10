import { sshBruteForce } from './rules/sshBruteForce.js';
import { urlScan } from './rules/urlScan.js';
import { errorSpike } from './rules/errorSpike.js';
import { shouldFire } from './cooldown.js';
import { logger } from '../lib/logger.js';

const RULES = [sshBruteForce, urlScan, errorSpike];
const COOLDOWN_SEC = 60;

// Runs one rule and emits its alert once past the per-entity cooldown.
async function runRule(rule, log, ctx, alertBus) {
  const alert = await rule(log, ctx);
  if (!alert) return;
  if (await shouldFire(alert.type, alert.ip, COOLDOWN_SEC)) await alertBus.emit(alert);
}

// Builds the per-log detection hook evaluating every rule against a record.
export function createDetectionHook({ alertBus }) {
  return async function detect(log) {
    const ctx = { now: log.timestamp?.getTime?.() || Date.now() };
    for (const rule of RULES) {
      try {
        await runRule(rule, log, ctx, alertBus);
      } catch (err) {
        logger.warn('Detection rule failed', { rule: rule.name, message: err.message });
      }
    }
  };
}
