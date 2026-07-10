import pg from 'pg';
import { config } from '../config/env.js';

let pool;

// Returns a lazily created shared PostgreSQL connection pool.
export function getPool() {
  if (!pool) pool = new pg.Pool({ connectionString: config.databaseUrl, max: 10 });
  return pool;
}

// Executes a parameterized query against the shared pool.
export function query(text, params) {
  return getPool().query(text, params);
}

// Closes the shared pool during graceful shutdown.
export async function closePool() {
  if (pool) await pool.end();
  pool = undefined;
}
