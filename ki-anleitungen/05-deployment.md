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

- Frontend-API-URL: `https://speiseplan-backend-ye17.onrender.com/api`
- Backend-Origin fuer CORS: `https://deisling22.github.io/romansapp`
- Upload-Verzeichnis im Render-Container: `/opt/render/project/src/uploads`

## Kaltstart und Antwortzeiten (Messung 17.11.2026)

Die Free-Instanz hat 0,1 CPU, schlaeft nach 15 Minuten ohne Anfragen ein und verliert dabei
die H2-Daten (Neustart = frisch geseedete Datenbank).

- **Aufwachen:** gemessen 215-221 s bis zur ersten Antwort vor der Docker-Optimierung,
  danach ca. 100 s. Die App ueberbrueckt das: letzter Stand nach ca. 1 s sichtbar, lesende
  Requests werden wiederholt, Hinweis "Der Server startet gerade ..." nach 5 s, keine
  Fehlermeldung (siehe `03-frontend-angular.md`).
- **Docker-Image:** entpacktes Jar-Layout (`-Djarmode=tools ... extract`) statt Fat-Jar und
  `-XX:TieredStopAtLevel=1`. Lokal als CPU-Sekunden bis zur ersten Antwort gemessen:
  12,9 s -> 5,5 s; CPU je Request in den ersten Minuten 12,5 ms -> 5,4 ms. Diese
  Einstellungen nicht ohne neue Messung aendern.
- **Netzwerk:** jeder Roundtrip kostet ca. 0,28 s, auch fuer `/` ohne Datenbank (Render
  legt Free-Services standardmaessig in Oregon an). `region: frankfurt` in `render.yaml`
  wirkt nur beim Neuanlegen des Services und wuerde diesen Sockel fast entfernen.
- **CORS:** `Access-Control-Max-Age: 7200`, sonst schickt der Browser vor fast jedem
  schreibenden Request einen Preflight (ein zusaetzlicher Roundtrip).
- **Antwortzeiten warm (Browser, inkl. Netzwerk):** `GET /api/home` 0,4-0,8 s, einfache
  Listen 0,3 s, Schreibzugriffe 0,5-0,8 s.

## Manuelle Einrichtungs-Schritte ausserhalb des Repos

1. In GitHub Pages die Quelle auf GitHub Actions setzen.
2. In Render das Repository verbinden und das Blueprint aus `render.yaml` importieren.
3. Das erste Deploy einmal ausfuehren; danach laufen Commits automatisch durch.

## Akzeptanzkriterien

- [ ] Commit auf `master` oder `main` aktualisiert das Frontend automatisch auf GitHub Pages.
- [ ] Commit auf `master` oder `main` aktualisiert das Backend automatisch auf Render.
- [ ] Die App ist von aussen unter einer stabilen HTTPS-URL erreichbar.
