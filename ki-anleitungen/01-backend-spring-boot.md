# KI-Anweisung: Backend (Spring Boot)

> **Anweisung an die KI:** Erstelle ein Spring-Boot-Backend gemäß dieser Spezifikation.
> Lies zuerst `00-projekt-uebersicht.md` für den Gesamtkontext.
> Arbeite Schritt für Schritt und stelle nach jedem Meilenstein sicher, dass das Projekt kompiliert und die Tests laufen.

## Ziel

REST-API für den "Ewigen Speiseplan" als **eigenes Repository/Verzeichnis** (`speiseplan-backend`),
getrennt vom Angular-Frontend.

## Rahmenbedingungen

- Spring Boot 3.x, Java 21, Maven.
- Abhängigkeiten: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`,
  `spring-boot-starter-security`, `spring-boot-starter-validation`,
  `jjwt` (io.jsonwebtoken), `postgresql`, `h2` (nur scope test/dev), `lombok` (optional).
- Package-Struktur: `de.roman.speiseplan` mit Sub-Packages `auth`, `plan`, `dish`, `shoppinglist`, `config`.
- Profile: `dev` (H2 in-memory ODER lokales Docker-Postgres, siehe `02-datenbank.md`), `prod` (Postgres via Env Vars).
- Port über `PORT`-Env-Variable konfigurierbar (Railway/Render setzen diese): `server.port=${PORT:8080}`.

## Schritt 1: Entities & Repositories

Implementiere exakt dieses Modell (JPA):

| Entity | Felder |
|---|---|
| `AppUser` | id, email (unique), passwordHash, displayName, createdAt |
| `MealPlan` | id, owner (ManyToOne AppUser), name, isPublic (boolean), currentPosition (int, default 0), createdAt |
| `PlanEntry` | id, plan (ManyToOne), dish (ManyToOne), sortOrder (int) |
| `Dish` | id, owner (ManyToOne AppUser), name, isPublic (boolean), notes (nullable) |
| `Ingredient` | id, name (unique, case-insensitive normalisiert) |
| `DishIngredient` | id, dish (ManyToOne), ingredient (ManyToOne), amount (BigDecimal), unit (Enum: G, KG, ML, L, PIECE, TBSP, TSP, PINCH) |
| `ShoppingList` | id, owner (ManyToOne), name, createdAt |
| `ShoppingListItem` | id, list (ManyToOne), ingredientName (String, Snapshot!), amount, unit, checked (boolean) |

Wichtig: `ShoppingListItem` speichert den **Zutatennamen als String** (Snapshot), keine FK auf `Ingredient`.

## Schritt 2: Auth (JWT)

- `POST /api/auth/register` `{ email, password, displayName }` → 201, Passwort mit BCrypt.
- `POST /api/auth/login` `{ email, password }` → `{ token, displayName }`. JWT-Gültigkeit 7 Tage, Secret aus Env `JWT_SECRET`.
- Security-Config: `/api/auth/**` offen, alles andere authentifiziert. Stateless, JWT-Filter.
- CORS: erlaubte Origins aus Env `CORS_ORIGINS` (kommagetrennt), Default `http://localhost:4200`.

## Schritt 3: Fachliche Endpoints

Implementiere den API-Vertrag aus `00-projekt-uebersicht.md`. Besondere Logik:

### `POST /api/plans/{id}/copy`
- Quelle muss `isPublic=true` sein ODER dem aufrufenden User gehören, sonst 403.
- Deep Copy: neue `MealPlan` (owner = Aufrufer, name = "Kopie von …", currentPosition = 0)
  + Kopie aller `PlanEntry`s. `Dish`es werden nur referenziert.

### `POST /api/plans/{id}/shopping-list?count=N`
- N: Query-Param, Default 3, min 1, max Plangröße.
- Nimm die Entries an Positionen `currentPosition … currentPosition+N-1` (modulo Anzahl Entries).
- Aggregiere alle `DishIngredient`s: Gruppierung nach (ingredient, unit), Mengen addieren.
- Erzeuge `ShoppingList` + Items (checked=false), gib sie als DTO zurück.
- Zeiger NICHT verschieben.

### `POST /api/plans/{id}/advance?steps=N`
- `currentPosition = (currentPosition + N) % entryCount`, Default steps=1.

### Autorisierung
- Jeder Endpoint prüft Ownership (Plan/Liste/Dish gehört dem JWT-User), sonst 403.
- Öffentliche Pläne/Dishes sind für alle lesbar (GET), aber nur vom Owner änderbar.

## Schritt 4: DTOs & Fehlerbehandlung

- Niemals Entities direkt serialisieren — DTO-Records pro Endpoint.
- `@RestControllerAdvice` mit einheitlichem Fehlerformat: `{ "status", "message", "timestamp" }`.
- Validierung mit `@Valid` + Bean Validation (z.B. Menge > 0, Name nicht leer).

## Schritt 5: Tests & Seed-Daten

- Mindestens: Integrationstest für Aggregationslogik der Einkaufsliste (zyklischer Überlauf!)
  und für Plan-Copy (Ownership-Check).
- `data.sql` oder `CommandLineRunner` (nur Profil `dev`): 1 Demo-User, 6 Gerichte mit Zutaten, 1 Plan.

## Akzeptanzkriterien

- [ ] `mvn verify` läuft grün.
- [ ] App startet mit Profil `dev` ohne externe DB.
- [ ] Alle Endpoints per `curl`/HTTP-File dokumentiert (lege `requests.http` an).
- [ ] Kein Secret im Code; `application-prod.yml` liest ausschließlich Env Vars
      (`DATABASE_URL` bzw. `SPRING_DATASOURCE_*`, `JWT_SECRET`, `CORS_ORIGINS`, `PORT`).
- [ ] Dockerfile vorhanden (Multi-Stage: Maven-Build → `eclipse-temurin:21-jre`), für Railway/Render nutzbar.
