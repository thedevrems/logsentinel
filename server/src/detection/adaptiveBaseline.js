import { getRedis } from '../redis/client.js';

const MAX_SAMPLES = 120;

// Pushes a metric sample into its capped rolling baseline list in Redis.
export async function pushSample(metric, value) {
  const redis = getRedis();
  const key = `baseline:${metric}`;
  await redis.rpush(key, String(value));
  await redis.ltrim(key, -MAX_SAMPLES, -1);
}

// Reads the current numeric baseline samples for a metric, oldest first.
export async function readSamples(metric) {
  const raw = await getRedis().lrange(`baseline:${metric}`, 0, -1);
  return raw.map(Number).filter((n) => Number.isFinite(n));
}
