> 🇬🇧 [Read in English](README.md)

# LogSentinel

LogSentinel est un SIEM miniature : un analyseur de logs en streaming qui
ingère les logs serveur, les parse dans un schéma commun, les indexe pour la
recherche, calcule des métriques temps réel et lève des alertes sur les
comportements suspects — le tout affiché sur un dashboard temps réel.

## Fonctionnalités

- **Ingestion en streaming** des logs Nginx, SSH (`auth.log`) et applicatifs
  custom, en mode statique (lecture unique) ou `tail -f` (suivi continu).
- **Parsing multi-format** avec un parser par source et un schéma de log
  normalisé partagé.
- **Stockage requêtable** dans PostgreSQL avec recherche full-text (`tsvector`)
  et JSONB pour les champs spécifiques à chaque source.
- **Métriques temps réel** dans Redis via des fenêtres glissantes (débit de
  requêtes, classes de codes HTTP, top IPs, échecs SSH).
- **Détection par règles** : brute-force SSH, scan d'URLs/ports, pics d'erreurs
  5xx.
- **Seuils adaptatifs** basés sur moyenne mobile et écart-type.
- **Dashboard temps réel** (React + Recharts) alimenté par WebSocket.
- **Alertes** sur un canal WebSocket dédié, avec géolocalisation IP, rapports
  PDF et notifications Discord/Slack optionnelles.

## Stack

| Couche        | Technologie                             |
| ------------- | --------------------------------------- |
| Front-end     | React, Recharts, Vite                   |
| Back-end      | Node.js, Express, streams natifs, `ws`  |
| Stockage      | PostgreSQL (recherche full-text + JSONB)|
| Temps réel    | Redis (fenêtres glissantes, alertes)    |
| Géo           | MaxMind GeoLite2 (base locale)          |
| Orchestration | Docker Compose (Postgres + Redis)       |

Voir [docs/architecture.md](docs/architecture.md) pour le schéma de flux complet.

## Démarrage

### 1. Lancer les bases de données

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer le serveur

```bash
cp server/.env.example server/.env
```

Ajuste `LOG_SOURCES`, `INGEST_MODE`, `DATABASE_URL` et `REDIS_URL` selon ton
environnement.

### 4. Créer le schéma de base de données

```bash
npm --workspace server run migrate
```

### 5. Tout lancer

```bash
npm run dev
```

L'API et le serveur WebSocket écoutent sur `http://localhost:4000` ; le
dashboard tourne sur `http://localhost:5173`.

## Utiliser de vrais logs de VPS

LogSentinel est conçu pour lire les vrais logs Nginx et SSH d'un VPS Ubuntu
équipé de Fail2ban/UFW. Pointe le serveur sur les fichiers de logs et bascule
en mode suivi :

```env
LOG_SOURCES=nginx:/var/log/nginx/access.log,ssh:/var/log/auth.log
INGEST_MODE=tail
```

Le processus doit avoir accès en lecture à ces fichiers (ajouter son
utilisateur au groupe `adm` ou lancer avec les permissions adéquates). Des logs
d'exemple anonymisés se trouvent dans [sample-logs/](sample-logs/) pour tester
sans serveur.

## API

| Endpoint                     | Description                             |
| ---------------------------- | --------------------------------------- |
| `GET /api/health`            | Vérification de santé                   |
| `GET /api/logs/search?q=`    | Recherche full-text dans les logs       |
| `GET /api/alerts/recent`     | Dernières alertes                       |
| `GET /api/reports/:period`   | Télécharger un PDF `daily` ou `weekly`  |
| `WS  /ws`                    | S'abonner aux canaux `metrics`/`alerts` |

## Licence

MIT.
