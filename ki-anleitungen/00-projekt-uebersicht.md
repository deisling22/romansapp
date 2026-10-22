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
9. Koch- und Einkaufs-Workflow ("Als Naechstes"): aus allen aktiven Plaenen werden die
   naechsten Tage automatisch befuellt; Gerichte lassen sich mit wenigen Klicks kochen,
   tauschen, verschieben oder ersetzen, fehlende Zutaten landen per Klick auf der Liste.

> **Hinweis Pro-Plan:** Die Funktionen des Koch- und Einkaufs-Workflows (aktive Plaene,
> Rotation, Heute/Morgen-Ansicht mit Zutaten-Ampel, Tauschen/Ersetzen/Spaeter,
> Mahlzeiten-Slots und Reste, Einkaufsliste fuer die naechsten Tage, Grundbedarf,
> Vorbereitungs-Hinweise und Erinnerungen) sind aktuell fuer **alle** Nutzer freigeschaltet.
> Sie sollen zukuenftig in einen kostenpflichtigen **Pro-Plan** wandern. Bis dahin gibt es
> bewusst keine Feature-Flags oder Bezahlschranken im Code.

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
CookLog n---1 Dish            (Kochprotokoll, ueberlebt Plan-Rotation)
StapleItem                    (Grundbedarf)
UserProfile (Singleton)
```

| Entity | Felder |
|---|---|
| `MealPlan` | id, name, createdAt, active, leftoversForLunch |
| `Dish` | id, name, imageUrl, description, prepMinutes, servings, tags, advancePrepNote, createdAt |
| `PlanEntry` | id, plan, dish, sortOrder, mealSlot (BREAKFAST/LUNCH/DINNER), cooked, cookedAt |
| `Ingredient` | id, name, kcalPer100, proteinPer100, unit |
| `DishIngredient` | id, dish, ingredient, quantityGrams |
| `DishImage` | id, dish, imageUrl, sortOrder |
| `PrepStep` | id, dish, stepOrder, text, timerSeconds |
| `ShoppingListItem` | id, plan, ingredientName, quantity, unit, checked |
| `CookLog` | id, planEntryId, planId, dish, mealSlot, leftovers, cookedAt |
| `StapleItem` | id, ingredientName, quantity, unit |
| `UserProfile` | id (immer 1), defaultPortionSize, bodyWeightKg, bodyHeightCm, householdSize, shoppingTripsPerWeek |

Naehrwerte pro Portion eines Gerichts ergeben sich aus der Summe der
`DishIngredient`-Mengen multipliziert mit den `Ingredient`-Werten pro 100 g,
geteilt durch `Dish.servings`. Beim Abhaken eines Gerichts als "gekocht" wird
`caloriesPerServing`/`proteinPerServing` multipliziert mit
`UserProfile.defaultPortionSize` den Tageswerten zugerechnet. Das Eiweissziel
betraegt $2\,g \times \text{Koerpergewicht in kg}$ pro Tag.

## Koch- und Einkaufs-Workflow

- **Aktive Plaene:** Mehrere Plaene koennen gleichzeitig aktiv sein. Ist keiner aktiv,
  gilt der aelteste Plan mit Gerichten (frueheres Verhalten). Es gibt bewusst **keine
  festen Wochentage**; die Tage werden automatisch aus der Reihenfolge befuellt.
- **Rotation ("ewig"):** Pro Plan und Mahlzeit laeuft die Reihenfolge endlos: erst offene
  Eintraege nach `sortOrder`, danach die bereits gekochten (naechste Runde). Kocht man
  einen Eintrag, obwohl alle der Mahlzeit schon gekocht sind, beginnt die naechste Runde.
  Doppeltes Antippen am selben Tag bleibt wirkungslos.
- **Mehrere Plaene je Mahlzeit** wechseln sich ab; der Plan, der am laengsten nicht dran
  war (`CookLog`), beginnt.
- **Mahlzeiten-Slots:** Jeder Planeintrag hat einen Slot (Standard Abendessen). Ein Slot
  erscheint nur, wenn ein aktiver Plan Eintraege dafuer hat.
- **Reste:** `MealPlan.leftoversForLunch` kocht Abendessen doppelt; am Folgetag erscheint
  das Gericht als Mittagessen mit Status `LEFTOVERS` und verbraucht keinen Mittags-Eintrag.
- **Portionen:** gekochte Portionen = `householdSize x defaultPortionSize` (x2 bei Resten);
  Rezeptmengen werden mit `Portionen / Dish.servings` skaliert – fuer Einkaufsliste,
  Vorratsverbrauch und Zutaten-Ampel gleichermassen. Naehrwerte im Dashboard bleiben
  pro Person (`defaultPortionSize`) und kommen aus dem `CookLog`.
- **Zutaten-Ampel:** Vorrat wird chronologisch auf die anstehenden Gerichte verteilt,
  danach die Einkaufsliste: `AVAILABLE` (alles im Vorrat), `ON_LIST` (Rest steht auf der
  Liste), `MISSING`, `UNKNOWN` (keine Zutaten hinterlegt).
- **Einkaufsfenster:** `ceil(7 / shoppingTripsPerWeek)` Tage (Standard 2 Einkaeufe/Woche ->
  4 Tage). Die Liste ergaenzt nur, was weder im Vorrat noch auf der Liste ist (idempotent),
  plus Grundbedarf (`StapleItem`). Stueck-Einheiten werden auf ganze Stueck aufgerundet.
- **Tauschen** tauscht die Gerichte zweier Eintraege (Positionen bleiben), **Spaeter**
  schiebt einen Eintrag ans Ende seines Plans, **Ersetzen** setzt ein Katalog-Gericht
  ausserhalb der aktiven Plaene ein (sortiert nach Vorratsabdeckung).
- **Erinnerungen:** Bis echte Push-Nachrichten (siehe `07-push-benachrichtigungen.md`)
  umgesetzt sind, zeigt das Dashboard einmal pro Tag einen In-App-Hinweis zu
  Vorbereitungen fuer morgen (`Dish.advancePrepNote`) und fehlenden Zutaten.

## API-Vertrag

```
GET    /api/plans
POST   /api/plans
DELETE /api/plans/{planId}
POST   /api/plans/{planId}/copy
PUT    /api/plans/{planId}/settings          { active?, leftoversForLunch? }
GET    /api/plans/{planId}/dishes
POST   /api/plans/{planId}/dishes            multipart/form-data: name, image
PATCH  /api/plan-entries/{entryId}/cook
POST   /api/plan-entries/{entryId}/swap      { otherEntryId }
POST   /api/plan-entries/{entryId}/skip
PUT    /api/plan-entries/{entryId}/dish      { dishId }
PUT    /api/plan-entries/{entryId}/meal-slot { mealSlot }
GET    /api/plan-entries/{entryId}/replacement-suggestions
POST   /api/plan-entries/{entryId}/missing-to-shopping-list

GET    /api/schedule?days=7                  (max. 14)
POST   /api/schedule/shopping-list?days=     (Standard: Einkaufsfenster)

GET    /api/staples
POST   /api/staples
DELETE /api/staples/{stapleId}

GET    /api/dishes?search=&tag=
GET    /api/dishes/{dishId}
POST   /api/dishes/{dishId}/images           multipart/form-data: image
POST   /api/dishes/{dishId}/steps
POST   /api/dishes/{dishId}/ingredients
PUT    /api/dishes/{dishId}/advance-prep     { note }

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
