const RANK = { info: 0, warning: 1, critical: 2 };

// Reports whether an alert severity meets the configured minimum level.
export function meetsSeverity(severity, minSeverity) {
  return (RANK[severity] ?? 0) >= (RANK[minSeverity] ?? 2);
}

// Builds a one-line human summary of an alert for chat platforms.
function summarize(alert) {
  const geo = alert.geo?.country ? ` (${alert.geo.country})` : '';
  return `[${alert.severity.toUpperCase()}] ${alert.type} — ${alert.message}${geo}`;
}

// Formats the webhook JSON body for Discord or Slack based on the URL.
export function formatPayload(url, alert) {
  const text = summarize(alert);
  if (url.includes('slack')) return { text };
  return { content: text };
}
