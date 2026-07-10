// Shared color tokens keeping every chart and panel visually consistent.
export const theme = {
  bg: '#0f1420',
  panel: '#1a2130',
  border: '#2a3348',
  text: '#e6ebf5',
  muted: '#8a94a8',
  accent: '#5b8def',
  grid: '#232c40',
};

// Categorical colors mapped to HTTP status classes for status charts.
export const statusColors = {
  '2xx': '#3fb950',
  '3xx': '#58a6ff',
  '4xx': '#d29922',
  '5xx': '#f85149',
};

// Severity colors reused by the alerts panel and notification badges.
export const severityColors = {
  info: '#58a6ff',
  warning: '#d29922',
  critical: '#f85149',
};
