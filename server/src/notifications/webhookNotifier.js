import { config } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { meetsSeverity, formatPayload } from './webhookFormat.js';

// Posts a formatted alert payload to the configured chat webhook.
async function post(url, alert) {
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formatPayload(url, alert)),
  });
}

// Creates a throttled webhook notifier subscribed to critical alerts.
export function createWebhookNotifier(cfg = config) {
  let lastSentAt = 0;
  // Sends the alert unless it is below severity or inside the throttle window.
  return async function notify(alert) {
    if (!cfg.alertWebhookUrl || !meetsSeverity(alert.severity, cfg.alertWebhookMinSeverity)) return;
    const now = Date.now();
    if (now - lastSentAt < cfg.alertWebhookThrottleMs) return;
    lastSentAt = now;
    try {
      await post(cfg.alertWebhookUrl, alert);
    } catch (err) {
      logger.warn('Webhook notification failed', { message: err.message });
    }
  };
}
