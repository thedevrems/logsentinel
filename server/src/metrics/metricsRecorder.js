import { getRedis } from '../redis/client.js';
import { record } from '../redis/slidingWindow.js';
import { keys, statusClassOf } from '../redis/keys.js';

// Records one HTTP request event in the global request-rate window.
async function recordRequest(now) {
  await record(keys.requests(), now);
}

// Records an HTTP status code in its class window and per-code counter.
async function recordStatus(status, now) {
  await record(keys.statusClass(statusClassOf(status)), now);
  if (status >= 500) await record(keys.serverErrors(), now);
}

// Records a hit from an IP and marks it active for top-IP ranking.
async function recordIpHit(ip, now) {
  if (!ip) return;
  await record(keys.ipHits(ip), now);
  await getRedis().sadd(keys.activeIps(), ip);
}

// Records a failed or invalid SSH authentication attempt per source IP.
async function recordSshFailure(ip, now) {
  if (!ip) return;
  await record(keys.sshFail(ip), now);
  await getRedis().sadd(keys.activeSshIps(), ip);
}

// Records a 404 response per source IP for URL-scan detection.
async function recordNotFound(ip, now) {
  if (!ip) return;
  await record(keys.url404(ip), now);
}

// Updates every relevant realtime metric for a single normalized log.
export async function recordMetrics(log) {
  const now = log.timestamp?.getTime?.() || Date.now();
  if (log.source === 'nginx' && log.eventType === 'http_request') {
    await recordRequest(now);
    await recordStatus(log.fields.status, now);
    await recordIpHit(log.ip, now);
    if (log.fields.status === 404) await recordNotFound(log.ip, now);
  }
  if (log.source === 'ssh' && log.fields.outcome !== 'accepted') {
    await recordSshFailure(log.ip, now);
  }
}
