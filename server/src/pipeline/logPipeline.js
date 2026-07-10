import { parseItem } from '../parsers/parserRegistry.js';
import { recordMetrics } from '../metrics/metricsRecorder.js';
import { logger } from '../lib/logger.js';

// Parses a raw item, persists it, updates metrics and runs detection hooks.
async function processItem(item, batchWriter, onLog) {
  const log = parseItem(item);
  batchWriter.add(log);
  await recordMetrics(log);
  if (onLog) await onLog(log);
}

// Creates the pipeline draining the ingestion queue through every stage.
export function createLogPipeline({ queue, batchWriter, onLog }) {
  let draining = false;
  // Processes queued items sequentially until the queue is empty.
  async function drain() {
    if (draining) return;
    draining = true;
    let item = queue.shift();
    while (item) {
      try {
        await processItem(item, batchWriter, onLog);
      } catch (err) {
        logger.error('Pipeline processing error', { message: err.message });
      }
      item = queue.shift();
    }
    draining = false;
  }
  queue.on('data', drain);
  return { drain };
}
