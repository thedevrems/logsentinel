// Formats a structured log line with an ISO timestamp and level tag.
function format(level, message, meta) {
  const base = `${new Date().toISOString()} ${level} ${message}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

export const logger = {
  info: (message, meta) => console.log(format('INFO', message, meta)),
  warn: (message, meta) => console.warn(format('WARN', message, meta)),
  error: (message, meta) => console.error(format('ERROR', message, meta)),
};
