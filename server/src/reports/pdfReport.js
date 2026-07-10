import PDFDocument from 'pdfkit';
import { heading, keyValues, rankRows } from './pdfSections.js';

// Writes the report title block with the period and generation timestamp.
function writeHeader(doc, data) {
  doc.fontSize(20).fillColor('#0f1420').text('LogSentinel Security Report');
  doc.fontSize(10).fillColor('#666')
    .text(`Period: ${data.period}  |  Since: ${data.since.toISOString()}`)
    .text(`Generated: ${data.generatedAt.toISOString()}`);
}

// Writes the aggregate metrics and per-source volume sections.
function writeMetrics(doc, data) {
  heading(doc, 'Key metrics');
  keyValues(doc, [
    ['Total logs', data.total],
    ['Errors', data.levels.error || 0],
    ['Warnings', data.levels.warn || 0],
  ]);
  heading(doc, 'Volume by source');
  rankRows(doc, data.sources, ['source', 'count']);
}

// Writes the top attackers and recent alerts sections.
function writeThreats(doc, data) {
  heading(doc, 'Top attackers');
  rankRows(doc, data.attackers, ['ip', 'count']);
  heading(doc, 'Recent alerts');
  const alertRows = data.alerts.map((a) => ({ label: `${a.severity} ${a.type}`, value: a.ip || '-' }));
  rankRows(doc, alertRows, ['label', 'value']);
}

// Renders the full report into a PDFKit document stream.
export function renderReport(data) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  writeHeader(doc, data);
  writeMetrics(doc, data);
  writeThreats(doc, data);
  doc.end();
  return doc;
}
