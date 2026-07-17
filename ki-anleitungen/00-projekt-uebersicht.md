# Projekt-Uebersicht: Ewiger Speiseplan (KI-Kontextdatei)

> Die Minimal-Use-Case-Sperre wurde aufgehoben. Alle in dieser Datei
> beschriebenen Funktionen sind aktiv umzusetzen bzw. bereits umgesetzt.

## Ueberblick

Ziel ist eine mobile-first Web-App fuer wiederkehrende Speiseplaene:

1. Die Angular-App zeigt ein Dashboard mit Tageskalorien, Eiweissfortschritt und
   dem naechsten zu kochenden Gericht.
2. Plaene koennen erstellt, kopiert, geloescht und geoeffnet werden; jeder Plan
   zeigt seine Gerichtsliste.
3. Auf einem Smartphone kann ein Gericht mit Textnamen und Foto neu erstellt und
   einem Plan hinzugefuegt werden.
4. Ein Gerichtskatalog erlaubt Suche und Filter ueber alle Gerichte inklusive
   Bildergalerie, Zutaten mit Naehrwerten und Zubereitungsschritten mit Timern.
5. Aus einem Plan laesst sich eine Einkaufsliste generieren und abhaken.
6. Einstellungen speichern Standard-Portionsgroesse, Koerpergewicht und
   Koerpergroesse.
7. Die App ist als PWA installierbar und funktioniert fuer bereits geladene
   Daten sowie fuer das Abhaken der Einkaufsliste offline.
8. Die Daten fliessen durch Angular -> Spring Boot -> PostgreSQL.

Die App enthaelt weiterhin **keine** Benutzerkonten oder Authentifizierung; die
Einstellungen gelten global fuer die eine Instanz der App (kein Mehrbenutzer-Login).

## Tech-Stack

| Schicht | Technologie |
|---|---|
| Frontend | Bestehendes Angular-16-Projekt `romansapp`, Tailwind CSS, Angular Service Worker (PWA) |
| Backend | Spring Boot 3.x, Java 21, REST-API |
| Datenbank | PostgreSQL, lokal via Docker Compose |
| Bildspeicher | Lokales Dateisystem des Backends |
| Offline-Speicher (Frontend) | IndexedDB via Dexie, Outbox-Pattern fuer Einkaufsliste |
| Bereitstellung | GitHub Pages (Frontend), Render (Backend) |

## Domaenenmodell

```
MealPlan 1---n PlanEntry n---1 Dish
Dish     1---n DishIngredient n---1 Ingredient
Dish     1---n DishImage
Dish     1---n PrepStep
MealPlan 1---n ShoppingListItem
UserProfile (Singleton)
```

| Entity | Felder |
|---|---|
| `MealPlan` | id, name, createdAt |
| `Dish` | id, name, imageUrl, description, prepMinutes, servings, tags, createdAt |
| `PlanEntry` | id, plan, dish, sortOrder, cooked, cookedAt |
| `Ingredient` | id, name, kcalPer100, proteinPer100, unit |
| `DishIngredient` | id, dish, ingredient, quantityGrams |
| `DishImage` | id, dish, imageUrl, sortOrder |
| `PrepStep` | id, dish, stepOrder, text, timerSeconds |
| `ShoppingListItem` | id, plan, ingredientName, quantity, unit, checked |
| `UserProfile` | id (immer 1), defaultPortionSize, bodyWeightKg, bodyHeightCm |

Naehrwerte pro Portion eines Gerichts ergeben sich aus der Summe der
`DishIngredient`-Mengen multipliziert mit den `Ingredient`-Werten pro 100 g,
geteilt durch `Dish.servings`. Beim Abhaken eines Gerichts als "gekocht" wird
`caloriesPerServing`/`proteinPerServing` multipliziert mit
`UserProfile.defaultPortionSize` den Tageswerten zugerechnet. Das Eiweissziel
betraegt $2\,g \times \text{Koerpergewicht in kg}$ pro Tag.

## API-Vertrag

```
GET    /api/plans
POST   /api/plans
DELETE /api/plans/{planId}
POST   /api/plans/{planId}/copy
GET    /api/plans/{planId}/dishes
POST   /api/plans/{planId}/dishes            multipart/form-data: name, image
PATCH  /api/plan-entries/{entryId}/cook

GET    /api/dishes?search=&tag=
GET    /api/dishes/{dishId}
POST   /api/dishes/{dishId}/images           multipart/form-data: image
POST   /api/dishes/{dishId}/steps
POST   /api/dishes/{dishId}/ingredients

GET    /api/ingredients
POST   /api/ingredients

GET    /api/dashboard

GET    /api/profile
PUT    /api/profile

GET    /api/plans/{planId}/shopping-list
POST   /api/plans/{planId}/shopping-list/generate
PATCH  /api/shopping-list/{itemId}

GET    /uploads/{filename}
```

Die POST-Antworten fuer Gerichte liefern DTOs mit einer vom Frontend direkt
nutzbaren `imageUrl`.

## Konventionen fuer alle KI-Sessions

- Code, Klassen, Variablen und Endpoints auf Englisch; sichtbare UI-Texte auf Deutsch.
- Keine Authentifizierung; keine Entities direkt serialisieren, DTOs verwenden.
- Bilder im Browser ueber `accept="image/*"` und `capture="environment"` aufnehmen;
  das Ergebnis als `multipart/form-data` senden.

## Bereitstellung

- Frontend auf GitHub Pages
- Backend auf Render
- Commits loesen automatisch neue Deployments aus
