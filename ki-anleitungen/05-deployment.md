# KI-Anweisung: Deployment (GitHub Pages + Render)

> Lies zuerst `00-projekt-uebersicht.md`. Diese Datei beschreibt jetzt die aktive
> Deployment-Strecke fuer den Minimal-Use-Case.

## Ziel

Der Minimal-Use-Case soll nach jedem Commit automatisch aktualisiert werden:

- Frontend: GitHub Pages
- Backend: Render Free

## Frontend

1. GitHub Pages wird ueber `.github/workflows/deploy-frontend.yml` deployed.
2. Die Angular-Prod-Builds verwenden `src/environments/environment.prod.ts`.
3. Das Projekt liegt als GitHub-Pages-Site unter `https://deisling22.github.io/romansapp/`.
4. SPA-Routing funktioniert ueber `404.html` als Fallback.

## Backend

1. Render importiert `render.yaml` aus dem Repository.
2. Der Backend-Service baut per Dockerfile im `backend/`-Verzeichnis.
3. `autoDeploy: true` sorgt dafür, dass jeder Commit automatisch neu deployed wird.
4. CORS ist fuer die GitHub-Pages-Origin freigeschaltet.

## Wichtige Umgebungswerte

- Frontend-API-URL: `https://speiseplan-backend.onrender.com/api`
- Backend-Origin fuer CORS: `https://deisling22.github.io/romansapp`
- Upload-Verzeichnis im Render-Container: `/opt/render/project/src/uploads`

## Manuelle Einrichtungs-Schritte ausserhalb des Repos

1. In GitHub Pages die Quelle auf GitHub Actions setzen.
2. In Render das Repository verbinden und das Blueprint aus `render.yaml` importieren.
3. Das erste Deploy einmal ausfuehren; danach laufen Commits automatisch durch.

## Akzeptanzkriterien

- [ ] Commit auf `master` oder `main` aktualisiert das Frontend automatisch auf GitHub Pages.
- [ ] Commit auf `master` oder `main` aktualisiert das Backend automatisch auf Render.
- [ ] Die App ist von aussen unter einer stabilen HTTPS-URL erreichbar.
