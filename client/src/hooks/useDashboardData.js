import { useCallback, useRef, useState } from 'react';
import { useWebSocket } from './useWebSocket.js';

const MAX_POINTS = 60;
const MAX_ALERTS = 50;

// Appends a request-rate sample to a bounded rolling time series.
function appendPoint(series, snapshot) {
  const point = { t: new Date(snapshot.at).toLocaleTimeString(), requests: snapshot.requests };
  const next = [...series, point];
  return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next;
}

// Maintains realtime dashboard state fed by the metrics and alerts channels.
export function useDashboardData() {
  const [snapshot, setSnapshot] = useState(null);
  const [series, setSeries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const seriesRef = useRef([]);

  const onMessage = useCallback((msg) => {
    if (msg.channel === 'metrics' && msg.type === 'snapshot') {
      setSnapshot(msg.payload);
      seriesRef.current = appendPoint(seriesRef.current, msg.payload);
      setSeries(seriesRef.current);
    }
    if (msg.channel === 'alerts' && msg.type === 'alert') {
      setAlerts((prev) => [msg.payload, ...prev].slice(0, MAX_ALERTS));
    }
  }, []);

  const { connected } = useWebSocket(['metrics', 'alerts'], onMessage);
  return { connected, snapshot, series, alerts };
}
