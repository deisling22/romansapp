# KI-Anweisung: Deployment (GitHub Pages + Railway / Render)

> **Anweisung an die KI:** Richte das Deployment gemäß dieser Spezifikation ein.
> Lies zuerst `00-projekt-uebersicht.md`. Frontend und Backend werden getrennt deployt.

## Übersicht

| Komponente | Ziel | Kosten |
|---|---|---|
| Frontend (Angular PWA) | GitHub Pages via GitHub Action | kostenlos |
| Backend (Spring Boot) | **Railway** (primär) | Trial-Guthaben ~5 $, danach ab 5 $/Monat |
| Backend (Fallback) | **Render Free** | dauerhaft kostenlos, Cold Start ~50 s |
| Datenbank | Railway-Postgres ODER Neon.tech | siehe `02-datenbank.md` |

> Entscheidungshilfe: „Komplett kostenlos für immer“ → Render + Neon.
> „Komfortabel ohne Cold Start, kleines Budget ok“ → Railway.

## Teil A: Frontend auf GitHub Pages

1. GitHub Action anlegen (`.github/workflows/deploy-frontend.yml`):
   - Trigger: Push auf `main`.
   - Steps: Checkout → Node 20 → `npm ci` →
     `npx ng build --configuration production --base-href /<REPO-NAME>/` →
     `dist/romansapp` nach `index.html` → Kopie als `404.html` (SPA-Fallback) →
     Deploy mit `actions/deploy-pages` (oder `peaceiris/actions-gh-pages`).
2. Repo-Settings → Pages: Source „GitHub Actions“.
3. `environment.prod.ts`: `apiUrl` auf die Backend-URL setzen (Railway/Render, s.u.).
4. PWA-Hinweis: `start_url` und `scope` im Manifest müssen zum Unterpfad passen
   (relativ `./`, siehe `04-pwa-offline.md`). Service Worker funktioniert auf
   GitHub Pages, da HTTPS.

Stolperfallen:
- Falscher `--base-href` = weiße Seite (Assets 404).
- SPA-Routing: `404.html`-Kopie zwingend, sonst 404 bei Deep Links/Reload.

## Teil B1: Backend auf Railway (primär)

1. Backend-Repo auf GitHub pushen (eigenes Repo).
2. railway.app → „New Project“ → „Deploy from GitHub repo“.
3. Build: Railway erkennt Maven automatisch (Nixpacks). Zuverlässiger ist das
   **Dockerfile** aus der Backend-Anleitung — liegt eins im Repo, nutzt Railway es automatisch.
4. PostgreSQL-Service im selben Projekt hinzufügen (siehe `02-datenbank.md`, Option A).
5. Env Vars am Backend-Service setzen:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}`
   - `SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}`, `SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}`
   - `JWT_SECRET=<langer Zufallswert>` (z.B. `openssl rand -base64 48`)
   - `CORS_ORIGINS=https://<username>.github.io`
6. Settings → Networking → „Generate Domain“ → öffentliche URL
   (`https://….up.railway.app`) → in `environment.prod.ts` eintragen.
7. Railway respektiert die `PORT`-Variable automatisch (Backend liest `${PORT:8080}`).

Kosten im Blick behalten: Railway-Dashboard → Usage. Wenn das Trial-Guthaben
aufgebraucht ist: auf Teil B2 (Render) umziehen — dank Dockerfile + Env Vars trivial.

## Teil B2: Backend auf Render (Fallback, 100 % kostenlos)

1. render.com → „New Web Service“ → GitHub-Repo → Runtime „Docker“.
2. Instance Type: **Free**.
3. Gleiche Env Vars wie oben, aber `SPRING_DATASOURCE_URL` auf **Neon** zeigen lassen
   (`02-datenbank.md`, Option B) — Render-Postgres ist nur 30 Tage kostenlos!
4. Cold Start ~50 s ist normal → das Frontend zeigt dafür das
   „Server wacht auf“-Overlay (siehe `03-frontend-angular.md`).

## Teil C: Verkabelung & Smoke-Test

1. `CORS_ORIGINS` exakt prüfen: `https://<username>.github.io` (ohne Pfad, ohne Slash).
2. `environment.prod.ts` → Backend-URL mit `/api`-Suffix.
3. Smoke-Test nach jedem Deployment:
   - `GET https://<backend>/api/plans` ohne Token → 401 (Security aktiv).
   - Registrieren + Login über die GitHub-Pages-App → Plan anlegen →
     „Nächste 3 einkaufen“ → Item abhaken.
   - Browser-Konsole: keine CORS-Fehler.
4. PWA-Installation vom echten Smartphone testen (Android + iOS).

## Akzeptanzkriterien

- [ ] Push auf `main` deployt das Frontend automatisch auf GitHub Pages.
- [ ] Backend erreichbar unter öffentlicher URL, Flyway-Migrationen gelaufen.
- [ ] Kompletter Kernflow funktioniert von der veröffentlichten URL aus, auch am Handy.
- [ ] Keine Secrets im Repo; alle Secrets als Env Vars beim Hoster.
- [ ] Wechsel Railway ↔ Render ist ohne Codeänderung möglich (nur Env Vars + URL im Frontend).
