# GeoIP database

Place a MaxMind `GeoLite2-City.mmdb` file in this folder to enable alert
geolocation. Download it (free account required) from MaxMind, then set
`GEOIP_DB_PATH` in `server/.env` to point at the file. When the database is
absent, geolocation is silently disabled and alerts are emitted without a
`geo` field.

The `.mmdb` file is git-ignored and must never be committed.
