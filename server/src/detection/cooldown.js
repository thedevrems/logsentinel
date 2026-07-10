import { getRedis } from '../redis/client.js';

// Returns true once per cooldown window for a rule/entity, suppressing repeats.
export async function shouldFire(ruleKey, entity, cooldownSec) {
  const key = `alert:cooldown:${ruleKey}:${entity || 'global'}`;
  const set = await getRedis().set(key, '1', 'EX', cooldownSec, 'NX');
  return set === 'OK';
}
