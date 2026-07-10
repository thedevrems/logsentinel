import Redis from 'ioredis';
import { config } from '../config/env.js';

let client;
let subscriber;

// Returns the shared Redis command client, creating it on first use.
export function getRedis() {
  if (!client) client = new Redis(config.redisUrl, { lazyConnect: false });
  return client;
}

// Returns a dedicated Redis connection for pub/sub subscriptions.
export function getSubscriber() {
  if (!subscriber) subscriber = new Redis(config.redisUrl, { lazyConnect: false });
  return subscriber;
}

// Closes every Redis connection during graceful shutdown.
export async function closeRedis() {
  if (client) await client.quit();
  if (subscriber) await subscriber.quit();
  client = undefined;
  subscriber = undefined;
}
