# Sample logs

Anonymized example logs used to exercise the ingestion pipeline without a real
server. All IP addresses use documentation ranges (`192.0.2.0/24`,
`198.51.100.0/24`, `203.0.113.0/24`) or public scanner ranges; no real user data
is included.

| File               | Source type | Purpose                                  |
| ------------------ | ----------- | ---------------------------------------- |
| `nginx-access.log` | `nginx`     | Access log with 404 scans and 5xx spikes |
| `auth.log`         | `ssh`       | SSH auth log with brute-force bursts     |
| `app.log`          | `app`       | Custom application log (level + message) |
