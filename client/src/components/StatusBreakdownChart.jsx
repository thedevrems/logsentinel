import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { statusColors, theme } from '../theme.js';

// Transforms the status map into an ordered array for the bar chart.
function toData(statuses) {
  return ['2xx', '3xx', '4xx', '5xx'].map((klass) => ({ klass, count: statuses?.[klass] || 0 }));
}

// Renders HTTP status-class distribution as a color-coded bar chart.
export default function StatusBreakdownChart({ statuses }) {
  const data = toData(statuses);
  return (
    <div className="card">
      <h3>HTTP status classes</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="klass" stroke={theme.muted} tick={{ fontSize: 12 }} />
          <YAxis stroke={theme.muted} tick={{ fontSize: 11 }} allowDecimals={false} width={36} />
          <Tooltip cursor={{ fill: theme.grid }} contentStyle={{ background: theme.panel, border: `1px solid ${theme.border}`, color: theme.text }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.klass} fill={statusColors[entry.klass]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
