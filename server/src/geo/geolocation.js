import fs from 'node:fs';
import { Reader } from '@maxmind/geoip2-node';
import { config } from '../config/env.js';
import { logger } from '../lib/logger.js';

let reader = null;
let loaded = false;

// Lazily loads the local GeoLite2 database reader, tolerating its absence.
function ensureReader() {
  if (loaded) return reader;
  loaded = true;
  if (!config.geoipDbPath || !fs.existsSync(config.geoipDbPath)) {
    logger.warn('GeoIP database not found, geolocation disabled', { path: config.geoipDbPath });
    return null;
  }
  reader = Reader.openBuffer(fs.readFileSync(config.geoipDbPath));
  return reader;
}

// Resolves an IP to a country/city record using the local database only.
export function locate(ip) {
  const db = ensureReader();
  if (!db || !ip) return null;
  try {
    const r = db.city(ip);
    return { country: r.country?.isoCode || null, city: r.city?.names?.en || null, lat: r.location?.latitude ?? null, lon: r.location?.longitude ?? null };
  } catch {
    return null;
  }
}
