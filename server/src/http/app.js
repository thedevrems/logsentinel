import express from 'express';
import { createHealthRouter } from '../routes/health.js';
import { createLogsRouter } from '../routes/logs.js';
import { createAlertsRouter } from '../routes/alerts.js';

// Assembles the Express application with shared middleware and routers.
export function createApp(deps) {
  const app = express();
  app.use(express.json());
  app.use('/api', createHealthRouter(deps));
  app.use('/api', createLogsRouter());
  app.use('/api', createAlertsRouter(deps.alertBus));
  app.get('/', (_req, res) => res.json({ name: 'logsentinel', version: '0.1.0' }));
  return app;
}
