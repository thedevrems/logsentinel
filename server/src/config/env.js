import dotenv from 'dotenv';

dotenv.config();

// Parses a "type:path,type:path" source list into structured descriptors.
function parseSources(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [type, ...rest] = entry.split(':');
      return { type: type.trim(), path: rest.join(':').trim() };
    });
}

// Reads an integer environment variable with a fallback default.
function intEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(value) ? value : fallback;
}

export const config = {
  port: intEnv('PORT', 4000),
  host: process.env.HOST || '0.0.0.0',
  databaseUrl: process.env.DATABASE_URL || 'postgres://logsentinel:logsentinel@localhost:5432/logsentinel',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  logSources: parseSources(process.env.LOG_SOURCES),
  ingestMode: process.env.INGEST_MODE || 'static',
  batchSize: intEnv('BATCH_SIZE', 200),
  batchIntervalMs: intEnv('BATCH_INTERVAL_MS', 1000),
  metricsWindowSec: intEnv('METRICS_WINDOW_SEC', 60),
  adaptiveEnabled: (process.env.ADAPTIVE_ENABLED || 'true') !== 'false',
  adaptiveSigma: Number(process.env.ADAPTIVE_SIGMA || 3),
  adaptiveMinSamples: intEnv('ADAPTIVE_MIN_SAMPLES', 20),
  adaptiveIntervalMs: intEnv('ADAPTIVE_INTERVAL_MS', 10000),
  geoipDbPath: process.env.GEOIP_DB_PATH || '',
  alertWebhookUrl: process.env.ALERT_WEBHOOK_URL || '',
  alertWebhookMinSeverity: process.env.ALERT_WEBHOOK_MIN_SEVERITY || 'critical',
  alertWebhookThrottleMs: intEnv('ALERT_WEBHOOK_THROTTLE_MS', 60000),
};
