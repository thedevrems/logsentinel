import http from 'node:http';
import { config } from './config/env.js';
import { logger } from './lib/logger.js';
import { createApp } from './http/app.js';
import { createWsHub } from './websocket/wsHub.js';

// Boots the HTTP server, attaches the WebSocket hub and starts listening.
async function bootstrap() {
  const server = http.createServer();
  const wsHub = createWsHub(server);
  const app = createApp({ wsHub });
  server.on('request', app);
  server.listen(config.port, config.host, () => {
    logger.info('logsentinel server listening', { port: config.port, host: config.host });
  });
  return { server, wsHub };
}

bootstrap().catch((err) => {
  logger.error('Fatal startup error', { message: err.message });
  process.exit(1);
});
