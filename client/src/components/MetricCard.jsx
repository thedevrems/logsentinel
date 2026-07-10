import { theme } from '../theme.js';

// Renders a single labelled KPI tile with an emphasized value.
export default function MetricCard({ label, value, accent }) {
  return (
    <div className="card metric-card">
      <span className="metric-label" style={{ color: theme.muted }}>{label}</span>
      <span className="metric-value" style={{ color: accent || theme.text }}>{value}</span>
    </div>
  );
}
