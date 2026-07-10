import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { theme } from '../theme.js';

// Plots the rolling request-rate time series as a filled area chart.
export default function RequestRateChart({ series }) {
  return (
    <div className="card">
      <h3>Requests in window</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="req" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.accent} stopOpacity={0.5} />
              <stop offset="100%" stopColor={theme.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={theme.grid} vertical={false} />
          <XAxis dataKey="t" stroke={theme.muted} tick={{ fontSize: 11 }} minTickGap={40} />
          <YAxis stroke={theme.muted} tick={{ fontSize: 11 }} allowDecimals={false} width={36} />
          <Tooltip contentStyle={{ background: theme.panel, border: `1px solid ${theme.border}`, color: theme.text }} />
          <Area type="monotone" dataKey="requests" stroke={theme.accent} strokeWidth={2} fill="url(#req)" isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
