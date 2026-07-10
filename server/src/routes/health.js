import { Router } from 'express';

// Builds the health-check router reporting process and dependency status.
export function createHealthRouter(deps) {
  const router = Router();
  router.get('/health', async (_req, res) => {
    res.json({
      status: 'ok',
      uptime: process.uptime(),
      clients: deps.wsHub ? deps.wsHub.clientCount() : 0,
      time: new Date().toISOString(),
    });
  });
  return router;
}
