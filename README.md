> 🇫🇷 [Lire en français](README.fr.md)

# LogSentinel

LogSentinel is a miniature SIEM: a streaming log analyzer that ingests server
logs, parses them into a common schema, indexes them for search, computes
real-time metrics and raises alerts on suspicious behavior — all shown on a
live dashboard.

## Features

- **Streaming ingestion** of Nginx, SSH (`auth.log`) and custom application
  logs, in static (read once) or `tail -f` (follow) mode.
- **Multi-format parsing** with one parser per source and a shared normalized
  log schema.
- **Searchable storage** in PostgreSQL with full-text search (`tsvector`) and
  JSONB for source-specific fields.
- **Real-time metrics** in Redis using sliding windows (request rate, HTTP
  status classes, top IPs, SSH failures).
- **Rule-based detection**: SSH brute-force, URL/port scanning, 5xx error
  spikes.
- **Adaptive thresholds** using moving average and standard deviation.
- **Live dashboard** (React + Recharts) fed over WebSocket.
- **Alerting** over a dedicated WebSocket channel, with IP geolocation, PDF
  reports and optional Discord/Slack notifications.

## Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Front-end  | React, Recharts, Vite                   |
| Back-end   | Node.js, Express, native streams, `ws`  |
| Storage    | PostgreSQL (full-text search + JSONB)   |
| Real-time  | Redis (sliding windows, recent alerts)  |
| Geo        | MaxMind GeoLite2 (local database)       |
| Orchestration | Docker Compose (Postgres + Redis)    |

See [docs/architecture.md](docs/architecture.md) for the full data-flow diagram.

## Getting started

### 1. Start the datastores

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the server

```bash
cp server/.env.example server/.env
```

Adjust `LOG_SOURCES`, `INGEST_MODE`, `DATABASE_URL` and `REDIS_URL` as needed.

### 4. Create the database schema

```bash
npm --workspace server run migrate
```

### 5. Run everything

```bash
npm run dev
```

The API and WebSocket server listen on `http://localhost:4000`; the dashboard
runs on `http://localhost:5173`.

## Using real VPS logs

LogSentinel is designed to read the real Nginx and SSH logs of an Ubuntu VPS
running Fail2ban/UFW. Point the server at the log files and switch to follow
mode:

```env
LOG_SOURCES=nginx:/var/log/nginx/access.log,ssh:/var/log/auth.log
INGEST_MODE=tail
```

The process must have read access to those files (add its user to the `adm`
group or run with appropriate permissions). Sample anonymized logs live in
[sample-logs/](sample-logs/) for testing without a server.

## API

| Endpoint                     | Description                          |
| ---------------------------- | ------------------------------------ |
| `GET /api/health`            | Health check                         |
| `GET /api/logs/search?q=`    | Full-text search over stored logs    |
| `GET /api/alerts/recent`     | Most recent alerts                   |
| `GET /api/reports/:period`   | Download a `daily` or `weekly` PDF   |
| `WS  /ws`                    | Subscribe to `metrics` / `alerts`    |

## License

MIT.
