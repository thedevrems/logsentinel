import { getRedis } from '../redis/client.js';
import { keys } from '../redis/keys.js';
import { locate } from '../geo/geolocation.js';
import { logger } from '../lib/logger.js';

const MAX_RECENT = 100;

// Attaches geolocation to an alert when its source IP resolves locally.
function enrich(alert) {
  const geo = alert.ip ? locate(alert.ip) : null;
  return geo ? { ...alert, geo } : alert;
}

// Persists an alert to the bounded recent-alerts list in Redis.
async function persist(alert) {
  const redis = getRedis();
  await redis.lpush(keys.alertsRecent(), JSON.stringify(alert));
  await redis.ltrim(keys.alertsRecent(), 0, MAX_RECENT - 1);
}

// Creates the alert bus that stores, broadcasts and exposes recent alerts.
export function createAlertBus(wsHub) {
  const subscribers = [];
  // Dispatches an alert to storage, the websocket channel and local listeners.
  async function emit(rawAlert) {
    const alert = enrich(rawAlert);
    await persist(alert);
    wsHub.emit('alerts', 'alert', alert);
    for (const fn of subscribers) fn(alert);
    logger.info('Alert raised', { type: alert.type, severity: alert.severity, ip: alert.ip });
  }
  // Reads the most recent alerts from Redis, newest first.
  async function recent(limit = 50) {
    const raw = await getRedis().lrange(keys.alertsRecent(), 0, limit - 1);
    return raw.map((item) => JSON.parse(item));
  }
  return { emit, recent, onAlert: (fn) => subscribers.push(fn) };
}
