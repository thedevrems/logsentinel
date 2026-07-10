import * as nginxParser from './nginxParser.js';
import * as sshAuthParser from './sshAuthParser.js';
import * as customAppParser from './customAppParser.js';
import { unparsedLog } from './normalizedLog.js';

const PARSERS = {
  nginx: nginxParser.parse,
  ssh: sshAuthParser.parse,
  app: customAppParser.parse,
};

// Returns the parse function registered for a given source type.
export function getParser(type) {
  return PARSERS[type];
}

// Parses a raw ingestion item using the parser matching its source type.
export function parseItem(item) {
  const parser = PARSERS[item.type];
  return parser ? parser(item.line) : unparsedLog(item.type, item.line);
}
