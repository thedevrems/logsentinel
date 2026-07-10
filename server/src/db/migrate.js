import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query, closePool } from './pool.js';
import { logger } from '../lib/logger.js';

const SCHEMA_PATH = path.resolve(fileURLToPath(import.meta.url), '../schema.sql');

// Applies the SQL schema to the configured database and exits.
async function migrate() {
  const sql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  await query(sql);
  logger.info('Database schema applied');
  await closePool();
}

migrate().catch((err) => {
  logger.error('Migration failed', { message: err.message });
  process.exit(1);
});
