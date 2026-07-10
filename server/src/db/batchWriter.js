import { insertLogs } from './logRepository.js';
import { logger } from '../lib/logger.js';

// Buffers normalized logs and flushes them to Postgres by size or interval.
export function createBatchWriter({ batchSize, batchIntervalMs }) {
  let buffer = [];
  let timer = null;

  // Persists the current buffer and resets it, logging any failure.
  async function flush() {
    if (!buffer.length) return;
    const batch = buffer;
    buffer = [];
    try {
      await insertLogs(batch);
    } catch (err) {
      logger.error('Batch insert failed', { message: err.message, size: batch.length });
    }
  }

  // Queues a record and triggers a flush once the size threshold is reached.
  function add(log) {
    buffer.push(log);
    if (buffer.length >= batchSize) flush();
  }

  timer = setInterval(flush, batchIntervalMs);
  return { add, flush, stop: () => clearInterval(timer) };
}
