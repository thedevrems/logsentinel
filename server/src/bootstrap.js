import http from 'node:http';
import { config } from './config/env.js';
import { logger } from './lib/logger.js';
import { createApp } from './http/app.js';
import { createWsHub } from './websocket/wsHub.js';
import { createAlertBus } from './alerts/alertBus.js';
import { createBatchWriter } from './db/batchWriter.js';
import { createIngestionManager } from './ingestion/ingestionManager.js';
import { createLogPipeline } from './pipeline/logPipeline.js';
import { startMetricsBroadcaster } from './websocket/metricsBroadcaster.js';

// Wires ingestion, pipeline, metrics broadcasting and starts reading sources.
async function startDataPlane(wsHub, onLog) {
  const batchWriter = createBatchWriter(config);
  const ingestion = createIngestionManager(config);
  const pipeline = createLogPipeline({ queue: ingestion.queue, batchWriter, onLog });
  startMetricsBroadcaster(wsHub, config.metricsWindowSec);
  await ingestion.start();
  await pipeline.drain();
  return { batchWriter };
}

// Boots the HTTP/WebSocket server and the full data-processing plane.
export async function bootstrap({ buildOnLog } = {}) {
  const server = http.createServer();
  const wsHub = createWsHub(server);
  const alertBus = createAlertBus(wsHub);
  const app = createApp({ wsHub, alertBus });
  server.on('request', app);
  const onLog = buildOnLog ? buildOnLog({ alertBus }) : undefined;
  server.listen(config.port, config.host, () => {
    logger.info('logsentinel server listening', { port: config.port, host: config.host });
  });
  await startDataPlane(wsHub, onLog);
  return { server, wsHub, alertBus };
}
