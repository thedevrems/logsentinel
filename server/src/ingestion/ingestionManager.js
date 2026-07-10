import { LineQueue } from './lineQueue.js';
import { readStaticFile } from './staticFileReader.js';
import { tailFile } from './tailFile.js';
import { logger } from '../lib/logger.js';

// Reads every configured source once and pushes their lines into the queue.
async function startStatic(sources, queue) {
  for (const source of sources) {
    const count = await readStaticFile(source, (item) => queue.push(item));
    logger.info('Ingested static source', { path: source.path, lines: count });
  }
}

// Follows every configured source continuously, pushing appended lines.
function startTail(sources, queue) {
  return sources.map((source) => {
    logger.info('Tailing source', { path: source.path });
    return tailFile(source, (item) => queue.push(item));
  });
}

// Builds the ingestion manager exposing the shared queue and a start hook.
export function createIngestionManager(config) {
  const queue = new LineQueue();
  async function start() {
    if (config.ingestMode === 'tail') return startTail(config.logSources, queue);
    await startStatic(config.logSources, queue);
    return [];
  }
  return { queue, start };
}
