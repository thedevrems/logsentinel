import { Router } from 'express';
import { searchLogs } from '../db/logRepository.js';

// Builds the router exposing full-text log search over stored records.
export function createLogsRouter() {
  const router = Router();
  router.get('/logs/search', async (req, res) => {
    const term = String(req.query.q || '').trim();
    if (!term) return res.status(400).json({ error: 'missing query parameter q' });
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const rows = await searchLogs(term, limit);
    res.json({ term, count: rows.length, results: rows });
  });
  return router;
}
