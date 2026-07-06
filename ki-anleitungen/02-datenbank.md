# KI-Anweisung: Datenbank (PostgreSQL)

> **Anweisung an die KI:** Richte die Datenbank-Umgebung gemäß dieser Spezifikation ein.
> Lies zuerst `00-projekt-uebersicht.md`. Diese Datei betrifft lokale Entwicklung UND Cloud.

## Ziel

PostgreSQL für lokale Entwicklung und Produktion, ohne Kosten, mit sauberer Schema-Verwaltung.

## Lokale Entwicklung

Lege im Backend-Repo eine `docker-compose.yml` an:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: speiseplan
      POSTGRES_USER: speiseplan
      POSTGRES_PASSWORD: localdev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

- Spring-Profil `dev` verbindet auf `jdbc:postgresql://localhost:5432/speiseplan`.
- Alternativ (ohne Docker): H2 in-memory im Profil `dev` — aber Aggregations-/Query-Verhalten
  vor dem Deployment einmal gegen echtes Postgres testen.

## Schema-Verwaltung: Flyway

- Dependency `flyway-core` + `flyway-database-postgresql` ins Backend.
- `spring.jpa.hibernate.ddl-auto=validate` (NIE `update` in prod).
- Migrationen unter `src/main/resources/db/migration`:
  - `V1__init.sql` — alle Tabellen aus dem Domänenmodell (siehe `00-projekt-uebersicht.md`),
    mit FKs, `ON DELETE CASCADE` für PlanEntry→MealPlan und ShoppingListItem→ShoppingList,
    Unique-Index auf `LOWER(ingredient.name)` und `app_user.email`.
  - Seed-Daten NICHT per Flyway, sondern per `dev`-Profil-Runner (siehe Backend-Anleitung).

## Cloud-Datenbank (kostenlos)

Zwei Optionen — wähle abhängig vom Backend-Hosting:

### Option A: Railway-Postgres (wenn Backend auf Railway läuft)
- Im Railway-Projekt "PostgreSQL" als Service hinzufügen.
- Railway stellt `DATABASE_URL` automatisch als Referenz-Variable bereit.
- Achtung: Railway-`DATABASE_URL` ist im Format `postgresql://user:pass@host:port/db` —
  Spring braucht `jdbc:postgresql://…`. Lösung: im Backend eine kleine
  `DataSource`-Konfiguration, die die URL umschreibt, ODER auf Railway die Variablen
  `SPRING_DATASOURCE_URL` (mit `jdbc:`-Präfix, manuell zusammengesetzt aus Referenzen),
  `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` setzen. Bevorzuge Letzteres.
- Kostenhinweis: zählt gegen das Railway-Guthaben (kein dauerhafter Free Tier).

### Option B: Neon.tech (dauerhaft kostenlos, empfohlen bei Render)
- Kostenloses Konto auf neon.tech, Projekt anlegen, Region EU.
- Connection String kopieren (Pooler-Variante) → als `SPRING_DATASOURCE_URL`
  (mit `jdbc:`-Präfix und `?sslmode=require`) beim Backend-Host hinterlegen.
- Neon suspendiert bei Inaktivität, wacht in <1 s auf — unkritisch.

## Akzeptanzkriterien

- [ ] `docker compose up -d` + Backend-Start im Profil `dev` funktioniert.
- [ ] Flyway legt Schema bei leerem Volume vollständig an (`flyway_schema_history` vorhanden).
- [ ] `ddl-auto=validate` meldet keine Abweichungen zwischen Entities und Migration.
- [ ] Prod-Verbindung ausschließlich über Env Vars, SSL aktiv (`sslmode=require` bei Neon).
- [ ] Kein Passwort/Connection-String im Repo.
