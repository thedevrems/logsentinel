import { useDashboardData } from './hooks/useDashboardData.js';
import MetricCard from './components/MetricCard.jsx';
import RequestRateChart from './components/RequestRateChart.jsx';
import StatusBreakdownChart from './components/StatusBreakdownChart.jsx';
import RankTable from './components/RankTable.jsx';
import AlertsPanel from './components/AlertsPanel.jsx';
import { severityColors, statusColors } from './theme.js';

// Sums SSH failure counts across the ranked offender list.
function sshTotal(offenders) {
  return (offenders || []).reduce((acc, o) => acc + o.count, 0);
}

// Renders the full realtime SIEM dashboard from live WebSocket data.
export default function App() {
  const { connected, snapshot, series, alerts } = useDashboardData();
  const s = snapshot || { requests: 0, statuses: {}, topIps: [], sshOffenders: [] };
  return (
    <div className="app">
      <header className="app-header">
        <h1>LogSentinel</h1>
        <span className={`status-dot ${connected ? 'online' : 'offline'}`}>
          {connected ? 'live' : 'disconnected'}
        </span>
      </header>
      <section className="kpi-row">
        <MetricCard label="Requests / window" value={s.requests} />
        <MetricCard label="5xx errors" value={s.statuses['5xx'] || 0} accent={statusColors['5xx']} />
        <MetricCard label="4xx errors" value={s.statuses['4xx'] || 0} accent={statusColors['4xx']} />
        <MetricCard label="SSH failures" value={sshTotal(s.sshOffenders)} accent={severityColors.warning} />
        <MetricCard label="Active alerts" value={alerts.length} accent={severityColors.critical} />
      </section>
      <section className="chart-row">
        <RequestRateChart series={series} />
        <StatusBreakdownChart statuses={s.statuses} />
      </section>
      <section className="chart-row">
        <RankTable title="Top requesting IPs" rows={s.topIps} countLabel="Requests" />
        <RankTable title="Top SSH offenders" rows={s.sshOffenders} countLabel="Failures" />
      </section>
      <AlertsPanel alerts={alerts} />
    </div>
  );
}
