import { getRedis } from './client.js';

let seq = 0;

// Records one timestamped event in a sorted-set sliding window.
export async function record(key, now = Date.now(), ttlSec = 3600) {
  const member = `${now}-${seq++}`;
  const redis = getRedis();
  await redis.zadd(key, now, member);
  await redis.expire(key, ttlSec);
}

// Counts events remaining in the window after pruning expired members.
export async function countWindow(key, windowMs, now = Date.now()) {
  const redis = getRedis();
  const min = now - windowMs;
  await redis.zremrangebyscore(key, 0, min);
  return redis.zcount(key, min, now);
}

// Returns the raw scores of events currently inside the window.
export async function windowScores(key, windowMs, now = Date.now()) {
  const redis = getRedis();
  const min = now - windowMs;
  return redis.zrangebyscore(key, min, now, 'WITHSCORES');
}
