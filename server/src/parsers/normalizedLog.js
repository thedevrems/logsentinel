// Builds the shared normalized log record produced by every source parser.
export function normalizedLog({ source, timestamp, ip, level, eventType, message, fields, raw }) {
  return {
    source,
    timestamp: timestamp instanceof Date ? timestamp : new Date(timestamp),
    ip: ip || null,
    level: level || 'info',
    eventType: eventType || 'generic',
    message: message || '',
    fields: fields || {},
    raw,
  };
}

// Returns a normalized record flagged as unparsable for a given source line.
export function unparsedLog(source, raw) {
  return normalizedLog({ source, timestamp: new Date(), level: 'info', eventType: 'unparsed', message: raw, raw });
}
