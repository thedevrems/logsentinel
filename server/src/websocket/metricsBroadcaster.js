import { buildSnapshot } from '../metrics/metricsSnapshot.js';
import { logger } from '../lib/logger.js';

// Emits a fresh metrics snapshot to the metrics channel on a fixed interval.
export function startMetricsBroadcaster(wsHub, windowSec, intervalMs = 1000) {
  // Builds and broadcasts one snapshot, swallowing transient Redis errors.
  async function tick() {
    try {
      const snapshot = await buildSnapshot(windowSec);
      wsHub.emit('metrics', 'snapshot', snapshot);
    } catch (err) {
      logger.warn('Metrics broadcast skipped', { message: err.message });
    }
  }
  const timer = setInterval(tick, intervalMs);
  return () => clearInterval(timer);
}
