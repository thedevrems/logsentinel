// Writes a section heading with consistent spacing and styling.
export function heading(doc, text) {
  doc.moveDown(0.8).fontSize(14).fillColor('#1a2130').text(text);
  doc.moveTo(doc.x, doc.y).lineTo(555, doc.y).strokeColor('#cfd6e4').stroke();
  doc.moveDown(0.4).fontSize(10).fillColor('#333');
}

// Writes a list of label/value pairs, one per line.
export function keyValues(doc, pairs) {
  for (const [label, value] of pairs) doc.text(`${label}: ${value}`);
}

// Writes a simple two-column ranked table from row objects.
export function rankRows(doc, rows, columns) {
  if (!rows.length) {
    doc.fillColor('#888').text('No data for this period').fillColor('#333');
    return;
  }
  for (const row of rows) doc.text(`${row[columns[0]]}  —  ${row[columns[1]]}`);
}
