# Projekt-Übersicht: Ewiger Speiseplan (KI-Kontextdatei)

> **Zweck dieser Datei:** Diese Datei wird jeder KI-Session als Kontext mitgegeben.
> Sie beschreibt das Gesamtprojekt, damit die KI bei jeder Teilaufgabe konsistente
> Entscheidungen trifft. Die Detail-Anweisungen pro Komponente stehen in den
> Dateien `01`–`05` in diesem Ordner.

## Produktidee

Eine Web-App ("Ewiger Speiseplan"), die auch auf iOS/Android läuft (als PWA):

- Nutzer haben einen oder mehrere **ewige Speisepläne** (zyklische Liste von Gerichten).
- Ein Plan hat einen **Zeiger** auf das nächste anstehende Gericht.
- Per Klick werden die **Zutaten der nächsten N Gerichte** (N einstellbar, Default 3)
  zu einer **Einkaufsliste** aggregiert (gleiche Zutaten werden mengenmäßig addiert).
- Beim Einkaufen (auch **offline**) hakt man Artikel ab.
- Alternativ: Liste als Text **teilen** (Web Share API) für Online-Supermärkte wie Rewe
  (keine echte Rewe-API-Integration im Prototyp).
- Pläne anderer Nutzer(-profile) können **kopiert/übernommen** werden (Deep Copy).
- Im eigenen Plan können Gerichte **entfernt oder hinzugefügt** werden.

## Tech-Stack (verbindlich)

| Schicht | Technologie |
|---|---|
| Frontend | Angular 16+ (bestehendes Projekt `romansapp`), Tailwind CSS, PWA (`@angular/pwa`) |
| Offline-Speicher | IndexedDB (Dexie.js) für die Einkaufsliste |
| Backend | Spring Boot 3.x (Java 21), REST-API, Spring Security + JWT |
| Datenbank | PostgreSQL (Prod: Neon.tech oder Railway-Postgres; lokal: Docker oder H2) |
| Frontend-Hosting | GitHub Pages (via GitHub Action) |
| Backend-Hosting | Railway (primär) oder Render Free (Fallback, komplett kostenlos) |

## Domänenmodell (verbindlich)

```
User      1──n MealPlan
MealPlan  1──n PlanEntry (sortOrder, dishId)      // Plan = geordnete, zyklische Liste
MealPlan       hat currentPosition (Zeiger)
Dish      1──n DishIngredient ──1 Ingredient      // Menge + Einheit pro Gericht
Dish           hat ownerId + isPublic
User      1──n ShoppingList 1──n ShoppingListItem // item: name, menge, einheit, checked
```

Regeln:
- **Plan kopieren** = neue `MealPlan` + neue `PlanEntry`s; `Dish`es werden referenziert, nicht kopiert.
- **Einkaufsliste erzeugen** = Aggregation der `DishIngredient`s der nächsten N `PlanEntry`s
  ab `currentPosition` (zyklisch, modulo Plangröße). Gleiche `Ingredient` + gleiche Einheit
  → Mengen addieren. Der Zeiger wird dabei NICHT automatisch verschoben (eigener Endpoint).
- Die Einkaufsliste ist nach Erzeugung ein **Snapshot** (eigene Items mit Namen/Menge),
  unabhängig von späteren Änderungen an Gerichten.

## API-Vertrag (Basis, Details in 01-backend)

```
POST   /api/auth/register | /api/auth/login        → JWT
GET    /api/plans                                   → eigene + öffentliche Pläne
POST   /api/plans / GET|PUT|DELETE /api/plans/{id}
POST   /api/plans/{id}/copy
POST   /api/plans/{id}/entries        DELETE /api/plans/{id}/entries/{entryId}
POST   /api/plans/{id}/advance?steps=N
POST   /api/plans/{id}/shopping-list?count=N       → erzeugt ShoppingList
GET    /api/shopping-lists / GET /api/shopping-lists/{id}
PATCH  /api/shopping-lists/{id}/items/{itemId}     → { "checked": true }
CRUD   /api/dishes, /api/ingredients
```

## Konventionen für alle KI-Sessions

- Sprache im Code: **Englisch** (Klassen, Variablen, Endpoints). UI-Texte: **Deutsch**.
- Kein Over-Engineering: Prototyp-Qualität, aber sauber. Kein NgRx, kein Microservice-Split.
- Jede Komponente soll **isoliert lauffähig** sein (Frontend mit Mock/ohne Backend startbar).
- Secrets niemals ins Repo — Umgebungsvariablen (Railway/Render Env Vars, `environment.ts` nur mit URLs).
- CORS: Backend erlaubt nur die GitHub-Pages-Origin + `http://localhost:4200`.

## Reihenfolge der Umsetzung

1. `01-backend-spring-boot.md` — Datenmodell + REST-API
2. `02-datenbank.md` — Postgres-Setup (lokal + Cloud)
3. `03-frontend-angular.md` — UI + Kernflow
4. `04-pwa-offline.md` — PWA + Offline-Einkaufsliste
5. `05-deployment.md` — GitHub Pages + Railway/Render
