import { Router } from 'express';
import { collectReportData } from '../reports/reportData.js';
import { renderReport } from '../reports/pdfReport.js';
import { logger } from '../lib/logger.js';

const PERIODS = new Set(['daily', 'weekly']);

// Builds the router streaming generated PDF security reports on demand.
export function createReportsRouter(alertBus) {
  const router = Router();
  router.get('/reports/:period', async (req, res) => {
    const period = PERIODS.has(req.params.period) ? req.params.period : 'daily';
    try {
      const data = await collectReportData(period, alertBus);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="logsentinel-${period}.pdf"`);
      renderReport(data).pipe(res);
    } catch (err) {
      logger.error('Report generation failed', { message: err.message });
      res.status(500).json({ error: 'report generation failed' });
    }
  });
  return router;
}
