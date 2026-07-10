import { requestRate } from '../metrics/metricsReader.js';
import { countWindow } from '../redis/slidingWindow.js';
import { keys } from '../redis/keys.js';
import { pushSample, readSamples } from './adaptiveBaseline.js';
import { zScore } from './statistics.js';
import { buildAlert, SEVERITY } from '../alerts/alertSchema.js';
import { logger } from '../lib/logger.js';

// Samplers returning the current value of each adaptively monitored metric.
const SAMPLERS = {
  requests: (windowMs, now) => requestRate(windowMs, now),
  errors5xx: (windowMs, now) => countWindow(keys.serverErrors(), windowMs, now),
};

// Emits an adaptive alert when a sample deviates beyond the sigma threshold.
async function evaluateMetric(metric, sampler, cfg, alertBus, now) {
  const value = await sampler(cfg.adaptiveIntervalMs, now);
  const samples = await readSamples(metric);
  if (samples.length >= cfg.adaptiveMinSamples && zScore(value, samples) >= cfg.adaptiveSigma) {
    await alertBus.emit(buildAlert({
      severity: SEVERITY.WARNING,
      type: `adaptive_${metric}`,
      message: `${metric} value ${value} exceeds baseline by ${cfg.adaptiveSigma}σ`,
      details: { value, sigma: cfg.adaptiveSigma, samples: samples.length },
    }));
  }
  await pushSample(metric, value);
}

// Starts the periodic adaptive-threshold monitor over all sampled metrics.
export function startAdaptiveMonitor(alertBus, cfg) {
  if (!cfg.adaptiveEnabled) return () => {};
  // Runs one evaluation pass across every configured metric sampler.
  async function tick() {
    const now = Date.now();
    for (const [metric, sampler] of Object.entries(SAMPLERS)) {
      try {
        await evaluateMetric(metric, sampler, cfg, alertBus, now);
      } catch (err) {
        logger.warn('Adaptive monitor error', { metric, message: err.message });
      }
    }
  }
  const timer = setInterval(tick, cfg.adaptiveIntervalMs);
  return () => clearInterval(timer);
}
