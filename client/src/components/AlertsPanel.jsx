import { severityColors, theme } from '../theme.js';

// Formats an alert timestamp into a short local time string.
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString();
}

// Renders the live alert feed with a colored severity badge per entry.
export default function AlertsPanel({ alerts }) {
  return (
    <div className="card alerts-panel">
      <h3>Live alerts</h3>
      <ul className="alert-list">
        {alerts.map((alert, i) => (
          <li key={`${alert.timestamp}-${i}`} className="alert-item">
            <span className="badge" style={{ background: severityColors[alert.severity] || theme.muted }}>
              {alert.severity}
            </span>
            <span className="alert-type">{alert.type}</span>
            <span className="alert-detail" style={{ color: theme.muted }}>{alert.message}</span>
            <span className="alert-time" style={{ color: theme.muted }}>{formatTime(alert.timestamp)}</span>
          </li>
        ))}
        {alerts.length === 0 && <li style={{ color: theme.muted }}>No alerts yet</li>}
      </ul>
    </div>
  );
}
