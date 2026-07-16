# Projekt-Uebersicht: Ewiger Speiseplan (KI-Kontextdatei)

> **Verbindliche Arbeitsregel:** Bis der Nutzer ausdruecklich sagt
> **"Anweisung fuer den Minimal-Use-Case entfernen"**, darf ausschliesslich der
> folgende Minimal-Use-Case umgesetzt werden. Alle Anforderungen unter
> "Folgephase" sind Kontext, aber gesperrt und duerfen weder implementiert noch
> als Voraussetzung eingefuehrt werden.

## Aktive Phase: Minimal-Use-Case

Ziel ist ein sichtbarer, mobiler End-to-End-Durchstich:

1. Die Angular-App zeigt eine Liste vorhandener Plaene.
2. Beim Oeffnen eines Plans zeigt sie dessen Gerichtsliste.
3. Auf einem Smartphone kann ein Gericht mit einem Textnamen und einem Foto neu
   erstellt und direkt dem gewaehlten Plan hinzugefuegt werden.
4. Die Daten fliessen durch Angular -> Spring Boot -> PostgreSQL und erscheinen
   nach dem Speichern in der Gerichtsliste.

Der Minimal-Use-Case enthaelt bewusst **keine** Benutzerkonten, Authentifizierung,
Suche, Filter, Zutaten, Kalorien, Tracking, Einkaufslisten, Timer, PWA-Offline-Sync,
Plan-Kopien oder Deployment-Automatisierung.

## Tech-Stack

| Schicht | Technologie |
|---|---|
| Frontend | Bestehendes Angular-16-Projekt `romansapp`, Tailwind CSS |
| Backend | Spring Boot 3.x, Java 21, REST-API |
| Datenbank | PostgreSQL, lokal via Docker Compose |
| Bildspeicher (Minimal-Use-Case) | Lokales Dateisystem des Backends, nur Entwicklung |
| Spaetere Bereitstellung | GitHub Pages, Railway oder Render |

## Aktives Domänenmodell

```
MealPlan 1---n PlanEntry n---1 Dish
Dish     hat name, imageUrl und createdAt
```

| Entity | Felder |
|---|---|
| `MealPlan` | id, name, createdAt |
| `Dish` | id, name, imageUrl, createdAt |
| `PlanEntry` | id, plan, dish, sortOrder |

`Dish` gehoert im Minimal-Use-Case immer genau zu dem Plan, dem es beim Erstellen
hinzugefuegt wird. Die `PlanEntry`-Tabelle bleibt trotzdem bestehen, damit die
spaetere geordnete Planlogik ohne Datenmodellbruch erweitert werden kann.

## Aktiver API-Vertrag

```
GET  /api/plans
GET  /api/plans/{planId}/dishes
POST /api/plans/{planId}/dishes  multipart/form-data: name, image
GET  /uploads/{filename}
```

Die POST-Antwort liefert das gespeicherte Gericht als DTO mit einer vom Frontend
direkt nutzbaren `imageUrl`.

## Konventionen fuer alle KI-Sessions

- Code, Klassen, Variablen und Endpoints auf Englisch; sichtbare UI-Texte auf Deutsch.
- Keine Authentifizierung und kein Mocking fuer den aktiven Durchstich.
- Keine Entities direkt serialisieren; DTOs verwenden.
- Bilder im Browser ueber `accept="image/*"` und `capture="environment"` aufnehmen;
  das Ergebnis als `multipart/form-data` senden.
- Secrets und produktive Bildspeicher sind erst in der Folgephase relevant.

## Folgephase: Gesperrte Produktanforderungen

Erst nach Aufhebung der Minimal-Use-Case-Anweisung implementieren:

- Einstellungen fuer Standard-Portionsgroesse sowie Koerpergewicht und Koerpergroesse.
- Zutaten mit Naehrwerten; Tageskalorien und Eiweiss auf dem Dashboard. Das Eiweissziel
  betraegt $2\,g \times \text{Koerpergewicht in kg}$ pro Tag und wird prozentual angezeigt.
- Dashboard mit Kalorien-Card, Eiweiss-Card/Diagramm und naechstem zu kochenden Gericht;
  Gericht kann als gekocht abgehakt oder zur Zubereitung geoeffnet werden.
- Plan-Erstellung und Planverwaltung.
- Gerichtskatalog im Feed-Stil mit Suche, Filtern, Bildergalerie, Zubereitungsdaten,
  Zubereitungsschritten und Schritt-Timern.
- Einkaufslisten, Plan-Kopien, Benutzerprofile und PWA-Offline-Faehigkeit.

## Aktive Bereitstellung

Der aktive Minimal-Use-Case wird jetzt uebers Internet bereitgestellt:

- Frontend auf GitHub Pages
- Backend auf Render
- Commits loesen automatisch neue Deployments aus
