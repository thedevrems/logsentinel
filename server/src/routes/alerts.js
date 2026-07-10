import { Router } from 'express';

// Builds the router returning the most recent stored alerts for bootstrap.
export function createAlertsRouter(alertBus) {
  const router = Router();
  router.get('/alerts/recent', async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const alerts = await alertBus.recent(limit);
    res.json({ count: alerts.length, alerts });
  });
  return router;
}
