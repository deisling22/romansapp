# KI-Anweisung: Frontend (Angular)

> **Anweisung an die KI:** Baue das Frontend im bestehenden Angular-Projekt `romansapp` aus.
> Lies zuerst `00-projekt-uebersicht.md`. Nutze das vorhandene Setup (Angular 16, Tailwind,
> vorhandener `auth.interceptor.ts`). UI-Texte auf Deutsch, Code auf Englisch.

## Ziel

Mobile-first UI für den Kernflow: **Plan ansehen → „Nächste N einkaufen“ → Liste abhaken**,
plus Plan-Verwaltung (kopieren, Gerichte hinzufügen/entfernen) und Login.

## Struktur

Feature-Ordner unter `src/app/`:

```
core/            # ApiService, AuthService, Interceptor, Guards, Models (Interfaces)
features/
  auth/          # Login-/Registrierungsseite
  plans/         # Planliste, Plandetail (Gerichte in Reihenfolge, Zeiger sichtbar)
  dishes/        # Gericht anlegen/bearbeiten inkl. Zutaten (dynamisches FormArray)
  shopping/      # Einkaufslisten-Übersicht + Abhak-Ansicht
shared/          # Buttons, Spinner, Confirm-Dialog, Empty-States
```

- Lazy-loaded Routen pro Feature. Kein NgRx — Services mit Signals (oder BehaviorSubject).
- Models als TypeScript-Interfaces spiegeln die Backend-DTOs (`MealPlan`, `PlanEntry`,
  `Dish`, `ShoppingList`, `ShoppingListItem`).

## Kern-Screens & Verhalten

### 1. Plan-Detail (wichtigster Screen)
- Geordnete Gerichtliste; das Gericht an `currentPosition` ist visuell markiert („Als Nächstes“).
- Sticky-Button unten: **„Nächste [N] Gerichte einkaufen“**.
  - N per Stepper (1–7) einstellbar, Wert in `localStorage` merken.
  - Klick → `POST /api/plans/{id}/shopping-list?count=N` → Navigation zur neuen Liste.
- Aktionen pro Eintrag: entfernen (mit Bestätigung); FAB/Button: Gericht hinzufügen
  (Auswahl aus eigenen + öffentlichen Gerichten oder neues Gericht anlegen).
- Aktion „Weiterschieben“: `POST …/advance` (z.B. nach dem Kochen).

### 2. Einkaufsliste (Abhak-Ansicht)
- Große Touch-Targets (min. 44 px), Checkbox + durchgestrichener Text bei `checked`.
- Abgehakte Items rutschen ans Ende. Fortschritt („5/12 erledigt“) im Header.
- **Teilen-Button:** Web Share API (`navigator.share`) mit der Liste als Plaintext
  (`- 500 g Nudeln`), Fallback: in Zwischenablage kopieren. (Für Rewe & Co.)
- Diese Ansicht muss offline funktionieren → Details in `04-pwa-offline.md`;
  baue jetzt schon einen `ShoppingListStore`-Service als einzige Datenquelle
  der Komponente (Backend-Sync dahinter gekapselt).

### 3. Planübersicht
- Tabs/Segmente: „Meine Pläne“ / „Öffentliche Pläne“.
- Auf öffentlichen Plänen: Button **„Plan übernehmen“** → `POST /api/plans/{id}/copy`.

### 4. Auth
- Login + Registrierung; Token in `localStorage`; vorhandenen `auth.interceptor.ts`
  so anpassen, dass er das JWT als `Authorization: Bearer` anhängt und bei 401
  zum Login navigiert. Route-Guard für alle Feature-Routen außer Auth.

## API-Anbindung

- `environment.ts`: `apiUrl: 'http://localhost:8080/api'`;
  `environment.prod.ts`: Railway-/Render-URL.
- Ein generischer `ApiService` (typisierte Methoden pro Ressource genügt, kein Overkill).
- **Cold-Start-Handling (Render):** globaler HTTP-Interceptor: dauert eine Antwort > 3 s,
  Overlay „Server wacht auf, einen Moment…“ anzeigen. Timeout erst nach 90 s.

## UX-Vorgaben

- Mobile-first (Basis 375 px), Tailwind, Bottom-Navigation (Pläne | Einkaufen | Profil).
- Loading-Skeletons statt Spinner auf Listen; Empty-States mit Call-to-Action.
- Optimistic UI beim Abhaken (sofort togglen, bei Fehler zurückrollen).

## Aufräumarbeiten im Bestand

- `package.json`: Build-Script `"build": "plew"` → `"build": "ng build"` korrigieren.
- Prüfe `auth.config.ts`, ob es zum JWT-Ansatz passt; sonst ersetzen.

## Akzeptanzkriterien

- [ ] Kernflow klickbar: Login → Plan → „Nächste 3 einkaufen“ → Liste abhaken → teilen.
- [ ] Plan kopieren, Gericht hinzufügen/entfernen, Zeiger weiterschieben funktionieren.
- [ ] App startet ohne Backend mit sinnvoller Fehlermeldung (kein weißer Screen).
- [ ] `ng build` läuft fehlerfrei; keine Konsolen-Errors im Happy Path.
- [ ] Alle Screens auf 375 px Breite nutzbar.
