# Restaurant Management Backend — Projet DevOps

API REST de gestion de restaurant (Node.js / Express + MySQL) intégrant une chaîne DevOps complète : tests automatisés en matrice, conteneurisation sécurisée, intégration continue (CI), livraison et déploiement automatisés sur tag (CD sur GHCR), protection de branche et procédure de rollback.

---

## Démarrage rapide (en une commande)

```bash
cp .env.example .env && docker compose up -d --build
```

Vérifier ensuite l'état de santé de l'application et de la base de données :

```bash
./scripts/check_health.sh http://localhost:3000/health
```

---

## Stack technique

- **Backend :** Node.js 22 (Express, MySQL2)
- **Base de données :** MySQL 8.0 (initialisée via `database/init.sql`, volume persistant `mysql_data`)
- **Tests :** Jest, Supertest, export de rapport `junit.xml`
- **Conteneurisation :** Docker (image Alpine légère, utilisateur non-root `node`, `HEALTHCHECK`) et Docker Compose
- **CI/CD & Registre :** GitHub Actions et GitHub Container Registry (`ghcr.io`)

---

## Structure du projet

- `backend/` : Code source Express (`app.js`, `server.js`), tests unitaires (`tests/api.test.js`), `Dockerfile`
- `database/init.sql` : Script d'initialisation de la base de données MySQL
- `scripts/check_health.sh` : Script Bash de contrôle de santé HTTP (`/health`)
- `docker-compose.yml` : Environnement local (build depuis les sources)
- `docker-compose.prod.yml` : Environnement de production (images versionnées depuis GHCR)
- `.github/workflows/ci.yml` : Pipeline CI (matrice Node 20/22, artefact JUnit, build Docker et vérification non-root)
- `.github/workflows/release.yml` : Pipeline CD (publication sur `ghcr.io`, déploiement et contrôle de santé automatisés sur tag `v*`)

---

## Tests unitaires en local

```bash
cd backend
npm ci
npm test
```

---

## Pipeline CI/CD & Sécurité

- **Intégration Continue (`ci.yml`) :** Exécutée sur chaque `push` et `pull_request` vers `main`. Lance les tests en **matrice sur Node.js 20 et Node.js 22**, publie les rapports JUnit en artefacts, puis vérifie le build Docker et l'exécution sous l'utilisateur non-root `node`.
- **Protection de `main` :** La branche `main` est protégée ; toute Pull Request dont les checks CI échouent est automatiquement bloquée à la fusion.
- **Livraison & Déploiement sur tag (`release.yml`) :** Chaque tag sémantique `v*` (`v1.0.0`, `v1.0.1`, `v1.0.2`) déclenche la publication de l'image sur `ghcr.io/ayoub-lassoued/restaurant-backend`, son déploiement via `docker-compose.prod.yml` et sa validation par `./scripts/check_health.sh`.

---

## Déploiement versionné & Rollback (Production)

### Déployer une version spécifique publiée sur GHCR

```bash
APP_VERSION=v1.0.1 docker compose -f docker-compose.prod.yml up -d
sleep 3
docker inspect --format='{{.Config.Image}}' restaurant-backend
./scripts/check_health.sh http://localhost:3000/health
```

### Revenir à la version stable précédente (Rollback)

Le retour arrière recrée uniquement le conteneur `restaurant-backend` sans perte de données grâce au volume persistant `mysql_data` :

```bash
APP_VERSION=v1.0.0 docker compose -f docker-compose.prod.yml up -d
sleep 3
docker inspect --format='{{.Config.Image}}' restaurant-backend
./scripts/check_health.sh http://localhost:3000/health
```