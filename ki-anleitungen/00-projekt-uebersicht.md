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
10. Der Kreislauf Plan -> Einkaufsliste -> Vorrat -> Kochen ist an jeder Stelle geschlossen
    (siehe "Leitlinien fuer den Kreislauf").

## Leitlinien fuer den Kreislauf

Diese Regeln gelten fuer jede neue Funktion; sie sind aus dem Workflow-Review entstanden.

1. **Erst der Plan, dann die Zahlen.** "Heute" beantwortet zuerst "Was koche ich und habe ich
   alles?". Naehrwerte und Kosten stehen darunter.
2. **Eine Hauptaktion pro Karte.** Mahlzeit-Karten zeigen "Jetzt kochen" (plus "Fehlende auf
   Liste", wenn etwas fehlt); alles Weitere liegt hinter "Mehr".
3. **Keine Sackgassen.** Jedes Gericht laesst sich von seiner Detailseite kochen
   (`POST /api/dishes/{id}/cook`) und in einen Plan uebernehmen
   (`POST /api/plans/{id}/entries`). Der Kochmodus endet mit "Fertig – gekocht" und bucht ab.
4. **Zutaten werden ueber einen kanonischen Schluessel verglichen**, nie ueber exakten Namen
   und Einheit (`IngredientMatcher`): Plural, Schreibweise, Synonyme und Einheiten
   (g/kg/ml/l, Stueck ueber typisches Stueckgewicht, Packung ueber Packungsgroesse) fuehren
   zum selben Bestand. "Tomate 3 Stk." deckt "Tomaten 300 g".
5. **Der Vorrat bildet ab, was zu Hause liegt.** Ein Einkauf bucht verpackte Ware als ganze
   Packung (120 g Butter auf der Liste = 250 g im Vorrat). Der Vorrat ist von Hand
   ergaenzbar und korrigierbar; "Aufgebraucht" und "Weggeworfen" werden unterschieden.
6. **Abhaken heisst nur "im Wagen".** Gebucht wird ausschliesslich ueber "Einkauf
   abschliessen" – ein Request mit den Artikel-IDs, offline vorgemerkt und automatisch
   nachgeholt. Das Verlassen der Seite loest nichts aus; es gibt keine Erinnerungs-Toasts.
7. **Vorschlaege sind begruendet und sofort ausfuehrbar.** "Bald verbrauchen" kombiniert
   Dringlichkeit, Vorratsabdeckung und Geschmack und bietet "Heute einplanen" und
   "Fehlendes auf Liste" direkt an (siehe `08-empfehlungsalgorithmus-ausblick.md`).
8. **Sofort reagieren.** Listenaktionen wirken optimistisch; jeder Screen zeigt zuerst den
   letzten bekannten Stand (`SnapshotCacheService`) und aktualisiert im Hintergrund, weil
   das Backend im Free-Tier nach einer Pause mehrere Minuten zum Aufwachen braucht.
9. **Sparsam mit Requests und Queries.** Die Produktionsinstanz hat 0,1 CPU: Der Startscreen
   laedt alles ueber `GET /api/home` (ein Request, eine Plan-Berechnung), Listen werden mit
   Batch-Fetching geladen (`hibernate.default_batch_fetch_size`), neue Endpunkte duerfen
   keine Abfrage pro Zeile ausloesen.

> **Hinweis Pro-Plan:** Die Funktionen des Koch- und Einkaufs-Workflows (aktive Plaene,
> Rotation, Heute/Morgen-Ansicht mit Zutaten-Ampel, Tauschen/Ersetzen/Spaeter,
> Mahlzeiten-Slots und Reste, Einkaufsliste fuer die naechsten Tage, Grundbedarf,
> Vorbereitungs-Hinweise und Erinnerungen) sind aktuell fuer **alle** Nutzer freigeschaltet.
> Sie sollen zukuenftig in einen kostenpflichtigen **Pro-Plan** wandern. Bis dahin gibt es
> bewusst keine Feature-Flags oder Bezahlschranken im Code.

Die App funktioniert ohne Konto (anonymer Standard-Haushalt). Optional meldet man sich
mit Google an; Plaene, Einkaufsliste, Vorrat, Kochprotokoll, Geschmack und Profil gehoeren
dann zu einem **Haushalt**, den mehrere Konten teilen koennen (Hibernate-Filter
`householdFilter`, siehe `household/`).

## Tech-Stack

| Schicht | Technologie |
|---|---|
| Frontend | Angular 22 (Standalone-Komponenten), SCSS-Designsystem, Angular Service Worker (PWA), Capacitor (iOS) |
| Backend | Spring Boot 4.x, Java 25, REST-API |
| Datenbank | PostgreSQL (Flyway); ohne `SPRING_DATASOURCE_URL` H2 im Speicher (lokal, Tests, Render Free) |
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
CookLog n---1 Dish            (Kochprotokoll, ueberlebt Plan-Rotation; ohne Plan = spontan gekocht)
StapleItem                    (Grundbedarf)
PantryItem                    (Vorrat mit Ablaufdatum)
PantryRemoval                 (aufgebraucht / weggeworfen)
TastePreference, DishFeedback (Geschmack des Haushalts, "Weniger davon")
UserProfile (je Haushalt)
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
| `CookLog` | id, planEntryId?, planId?, dish, mealSlot, leftovers, cookedAt |
| `StapleItem` | id, ingredientName, quantity, unit |
| `PantryItem` | id, ingredientName, quantity, unit, purchasedAt, expiresOn |
| `PantryRemoval` | id, ingredientName, quantity, unit, reason (USED/WASTED), removedAt |
| `TastePreference` | id, tag, liked, penalty |
| `DishFeedback` | id, dishId, createdAt |
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
  Liste), `MISSING`, `UNKNOWN` (keine Zutaten hinterlegt). Verglichen wird ueber den
  kanonischen Zutatenschluessel (Leitlinie 4), Mengen bleiben in der Rezepteinheit sichtbar.
- **Kochen:** `PATCH /api/plan-entries/{id}/cook` hakt einen Planeintrag ab.
  `POST /api/dishes/{id}/cook` kocht ein Gericht von ueberall: steht es in den naechsten
  7 Tagen im Plan, wird dieser Eintrag abgehakt; sonst entsteht ein `CookLog` ohne Plan
  (Standard-Slot Abendessen) und der heutige Plan rueckt einen Tag weiter. In beiden
  Faellen wird der Vorrat reduziert – zuerst der Bestand, der am fruehesten ablaeuft.
- **Einkauf abschliessen:** `POST /api/shopping-list/checkout { itemIds }` bucht genau diese
  Artikel in einer Transaktion in den Vorrat; verpackte Ware wird auf ganze Packungen
  aufgerundet, frische Lebensmittel bekommen ein geschaetztes Ablaufdatum (`ShelfLife`).
- **Warengruppen:** Jeder Listeneintrag traegt `category` (Obst & Gemuese, Brot & Backwaren,
  Kuehlregal, Fleisch & Fisch, Vorrat & Konserven, Tiefkuehl, Getraenke, Sonstiges); die
  Liste ist in Laufreihenfolge gruppiert.
- **Bald verbrauchen:** Bestand, der in hoechstens 3 Tagen ablaeuft. Was der Plan rechtzeitig
  verbraucht, gilt als "eingeplant" und braucht keinen Vorschlag.
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
POST   /api/plans/{planId}/entries           { dishId, mealSlot? }   (Katalog-Gericht uebernehmen)
PATCH  /api/plan-entries/{entryId}/cook      (?view=home: Antwort ist der frische Startscreen-Zustand)
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
GET    /api/dishes/{dishId}/availability?servings=
POST   /api/dishes/{dishId}/missing-to-shopping-list?servings=
POST   /api/dishes/{dishId}/cook             { servings?, mealSlot? }

GET    /api/ingredients
POST   /api/ingredients

GET    /api/home?days=7                      (Startscreen: dashboard + schedule + useSoon + week in einem Request)
GET    /api/dashboard

GET    /api/profile
PUT    /api/profile

GET    /api/plans/{planId}/shopping-list
POST   /api/plans/{planId}/shopping-list/generate
GET    /api/shopping-list
POST   /api/shopping-list                    { ingredientName, quantity, unit }
PATCH  /api/shopping-list/{itemId}           { checked }
DELETE /api/shopping-list/{itemId}
DELETE /api/shopping-list                    (Liste leeren)
POST   /api/shopping-list/checkout           { itemIds }

GET    /api/pantry
POST   /api/pantry/batches                   { items: [{ ingredientName, quantity, unit, expiresOn? }] }
PUT    /api/pantry/{itemId}/quantity         { quantity }
PUT    /api/pantry/{itemId}/expiry           { expiresOn }
DELETE /api/pantry/{itemId}?reason=USED|WASTED
GET    /api/pantry/use-soon

GET    /api/recommendations
POST   /api/recommendations/dishes/{dishId}/less
GET    /api/taste
PUT    /api/taste                            { likedTags }

GET    /uploads/{filename}
```

Die POST-Antworten fuer Gerichte liefern DTOs mit einer vom Frontend direkt
nutzbaren `imageUrl`.

## Konventionen fuer alle KI-Sessions

- Code, Klassen, Variablen und Endpoints auf Englisch; sichtbare UI-Texte auf Deutsch.
- Alle Kernfunktionen muessen ohne Anmeldung nutzbar bleiben; keine Entities direkt
  serialisieren, DTOs verwenden.
- Zutaten nie per Namens-/Einheitenvergleich abgleichen, sondern ueber `IngredientMatcher`.
- Bilder im Browser ueber `accept="image/*"` und `capture="environment"` aufnehmen;
  das Ergebnis als `multipart/form-data` senden.

## Bereitstellung

- Frontend auf GitHub Pages
- Backend auf Render
- Commits loesen automatisch neue Deployments aus
