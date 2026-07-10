import { theme } from '../theme.js';

// Renders a ranked IP/count table shared by traffic and SSH panels.
export default function RankTable({ title, rows, countLabel }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <table className="rank-table">
        <thead>
          <tr><th>IP</th><th>{countLabel}</th></tr>
        </thead>
        <tbody>
          {(rows || []).map((row) => (
            <tr key={row.ip}>
              <td>{row.ip}</td>
              <td style={{ color: theme.accent }}>{row.count}</td>
            </tr>
          ))}
          {(!rows || rows.length === 0) && (
            <tr><td colSpan={2} style={{ color: theme.muted }}>No data yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
