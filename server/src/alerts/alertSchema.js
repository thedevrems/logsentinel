import { randomUUID } from 'node:crypto';

export const SEVERITY = { INFO: 'info', WARNING: 'warning', CRITICAL: 'critical' };

// Builds a normalized alert record shared by every detection rule.
export function buildAlert({ severity, type, source, ip, message, details }) {
  return {
    id: randomUUID(),
    severity: severity || SEVERITY.WARNING,
    type,
    source: source || 'detection',
    ip: ip || null,
    message: message || '',
    details: details || {},
    timestamp: new Date().toISOString(),
  };
}
