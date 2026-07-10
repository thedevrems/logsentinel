import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_PATH = path.resolve(fileURLToPath(import.meta.url), '../../../config/app-log-format.json');

const DEFAULT_CONFIG = {
  pattern: '^(?<timestamp>\\S+) (?<level>\\w+) (?<logger>\\S+) (?<message>.*)$',
  levelField: 'level',
  timestampField: 'timestamp',
  messageField: 'message',
  extractKeyValues: true,
};

// Loads the custom application log format from JSON, falling back to defaults.
export function loadAppLogConfig(configPath = DEFAULT_PATH) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}
