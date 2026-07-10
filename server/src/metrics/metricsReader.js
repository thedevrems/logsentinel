import { getRedis } from '../redis/client.js';
import { countWindow } from '../redis/slidingWindow.js';
import { keys } from '../redis/keys.js';

const CLASSES = ['2xx', '3xx', '4xx', '5xx'];

// Counts HTTP requests observed within the sliding window.
export function requestRate(windowMs, now = Date.now()) {
  return countWindow(keys.requests(), windowMs, now);
}

// Returns per-class HTTP status counts within the window.
export async function statusBreakdown(windowMs, now = Date.now()) {
  const counts = await Promise.all(CLASSES.map((k) => countWindow(keys.statusClass(k), windowMs, now)));
  return Object.fromEntries(CLASSES.map((k, i) => [k, counts[i]]));
}

// Ranks active IPs by request count, pruning IPs that fell out of the window.
async function rankActive(setKey, keyFor, windowMs, now, limit) {
  const redis = getRedis();
  const members = await redis.smembers(setKey);
  const counted = await Promise.all(members.map(async (ip) => ({ ip, count: await countWindow(keyFor(ip), windowMs, now) })));
  const stale = counted.filter((e) => e.count === 0).map((e) => e.ip);
  if (stale.length) await redis.srem(setKey, ...stale);
  return counted.filter((e) => e.count > 0).sort((a, b) => b.count - a.count).slice(0, limit);
}

// Returns the top requesting IPs within the window.
export function topIps(windowMs, now = Date.now(), limit = 10) {
  return rankActive(keys.activeIps(), keys.ipHits, windowMs, now, limit);
}

// Returns the top SSH-failure source IPs within the window.
export function topSshOffenders(windowMs, now = Date.now(), limit = 10) {
  return rankActive(keys.activeSshIps(), keys.sshFail, windowMs, now, limit);
}
