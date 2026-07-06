# KI-Anweisung: PWA & Offline-Fähigkeit

> **Anweisung an die KI:** Mache das Angular-Frontend zur installierbaren PWA und
> die Einkaufsliste vollständig offline-fähig. Voraussetzung: `03-frontend-angular.md`
> ist umgesetzt (insbesondere der `ShoppingListStore`). Lies `00-projekt-uebersicht.md`.

## Ziel

- App auf iOS & Android über „Zum Home-Bildschirm hinzufügen“ installierbar (kein App Store).
- Einkaufsliste offline ansehen und abhaken; Änderungen syncen bei Reconnect.

## Schritt 1: PWA-Grundgerüst

- `ng add @angular/pwa` ausführen (erzeugt `ngsw-config.json`, `manifest.webmanifest`, Icons).
- `manifest.webmanifest` anpassen: `name`/`short_name` („Speiseplan“), `theme_color`,
  `background_color`, `display: "standalone"`, `start_url` relativ (`./` — wichtig für
  GitHub-Pages-Unterpfad!).
- Eigene Icons (mind. 192/512 px, plus `maskable`) unter `src/assets/icons/`.
- iOS-Extras in `index.html`: `apple-touch-icon`, `apple-mobile-web-app-capable`.
- Service Worker ist nur im Prod-Build aktiv — Test via `ng build` + `npx http-server dist/…`.

## Schritt 2: Caching-Strategie (`ngsw-config.json`)

- `assetGroups`: App-Shell `prefetch` (Default belassen).
- `dataGroups`:
  - `GET /api/plans**`, `GET /api/dishes**`: Strategie `freshness`,
    Timeout 5 s, Fallback auf Cache, `maxAge 1d`.
  - Einkaufslisten NICHT über den SW cachen — die laufen über IndexedDB (Schritt 3),
    damit Schreibzugriffe offline funktionieren.

## Schritt 3: Offline-Einkaufsliste mit Dexie (IndexedDB)

- `npm install dexie`.
- DB-Schema:

```ts
// tables: lists, items, pendingOps
lists:      'id, name, createdAt'
items:      'id, listId, ingredientName, amount, unit, checked'
pendingOps: '++id, type, payload, createdAt'   // Outbox-Pattern
```

- **`ShoppingListStore` umbauen (Offline-first):**
  1. Lesen: immer zuerst aus IndexedDB rendern, parallel Backend fetchen,
     bei Erfolg IndexedDB aktualisieren und neu emittieren.
  2. Abhaken: sofort in IndexedDB schreiben (Optimistic UI) + `pendingOp`
     `{ type: 'TOGGLE_ITEM', itemId, checked }` in die Outbox.
  3. Sync: bei `navigator.onLine`-Event und App-Start Outbox abarbeiten
     (FIFO, `PATCH` ans Backend, bei Erfolg Op löschen; bei 4xx Op verwerfen
     und Serverstand übernehmen — Server gewinnt bei Konflikt).
- Offline-Indikator in der UI (kleines Banner „Offline — Änderungen werden synchronisiert“).

## Schritt 4: Update-Handling

- `SwUpdate.versionUpdates` abonnieren → Snackbar „Neue Version verfügbar — Neu laden“.

## Test-Checkliste (manuell, Chrome DevTools + echtes Gerät)

1. Prod-Build lokal serven, Lighthouse-PWA-Audit: installierbar = ja.
2. DevTools → Network „Offline“: Einkaufsliste öffnen, Items abhaken → kein Fehler.
3. Wieder online: `PATCH`-Requests gehen raus, Backend-Stand stimmt.
4. Android Chrome: „App installieren“-Prompt erscheint; iOS Safari: über Teilen-Menü
   installierbar, startet im Standalone-Modus.

## Akzeptanzkriterien

- [ ] Lighthouse: PWA installierbar, kein Manifest-/SW-Fehler.
- [ ] Abhaken offline funktioniert und synct verlustfrei bei Reconnect.
- [ ] App-Shell lädt offline (Flugmodus, App aus Home-Screen öffnen).
- [ ] Update-Hinweis bei neuem Deployment erscheint.

## Ausblick (NICHT jetzt umsetzen)

Falls später App-Store-Präsenz gewünscht: Capacitor (`npx cap add ios/android`)
über dasselbe Angular-Projekt — keine Architekturänderung nötig.
