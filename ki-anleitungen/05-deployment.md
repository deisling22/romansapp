# KI-Anweisung: Deployment (derzeit gesperrt)

> Lies zuerst `00-projekt-uebersicht.md`. Bis zur ausdruecklichen Aufhebung der
> Minimal-Use-Case-Anweisung wird kein Cloud-Deployment, keine GitHub Action und
> keine produktive Bildspeicherung eingerichtet.

## Aktive Ausfuehrung

Der Minimal-Use-Case wird lokal ausgefuehrt:

1. PostgreSQL mit `docker compose up -d` im Backend-Repository starten.
2. Spring Boot mit Profil `dev` auf Port 8080 starten.
3. Angular mit `npm run start` auf Port 4200 starten.
4. Die Anwendung im Browser oder ueber ein Smartphone im selben lokalen Netzwerk testen.

Fuer einen Test vom Smartphone muss der Angular-Dev-Server auf einer erreichbaren Adresse
laufen und das Backend CORS fuer die konkrete lokale Frontend-Origin erlauben. Das ist ein
Entwicklungszugang, kein Deployment.

## Nach Aufhebung der Sperre

Dann erst entscheiden und einrichten:

- Angular/PWA auf GitHub Pages mit korrekt gesetztem `base-href` und SPA-Fallback.
- Spring Boot auf Railway (kostenpflichtig nach Trial) oder Render Free.
- PostgreSQL auf Railway oder Neon.
- Objekt-Storage fuer hochgeladene Bilder (nicht lokales Dateisystem auf einem ephemeren Host).
- Produktive Umgebungsvariablen, CORS, HTTPS und Deployment-Smoketests.

## Aktuelles Akzeptanzkriterium

- [ ] Der lokale Durchstich funktioniert, ohne dass ein Cloud-Konto oder Deployment-Dateien
  angelegt werden muessen.
