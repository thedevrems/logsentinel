// Central Redis key builders so every module shares one naming scheme.
export const keys = {
  requests: () => 'metrics:requests',
  statusClass: (klass) => `metrics:status:${klass}`,
  ipHits: (ip) => `metrics:ip:${ip}`,
  activeIps: () => 'metrics:ips:active',
  sshFail: (ip) => `metrics:ssh:fail:${ip}`,
  activeSshIps: () => 'metrics:ssh:active',
  url404: (ip) => `metrics:url404:${ip}`,
  serverErrors: () => 'metrics:errors:5xx',
  alertsRecent: () => 'alerts:recent',
  alertsChannel: () => 'alerts:channel',
};

// Maps an HTTP status code to its class bucket label (2xx..5xx).
export function statusClassOf(status) {
  return `${Math.floor(status / 100)}xx`;
}
