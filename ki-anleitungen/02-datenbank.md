# KI-Anweisung: Datenbank (PostgreSQL)

> Lies zuerst `00-projekt-uebersicht.md`. Die Sperre wurde aufgehoben; das Schema
> deckt das vollstaendige Domaenenmodell ab.

## Ziel

Lokal reproduzierbares PostgreSQL-Schema fuer Plaene, Gerichte, Zutaten, Bildergalerie,
Zubereitungsschritte, Einkaufslisten und das Nutzerprofil.

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

- Das Profil `dev` verbindet auf `jdbc:postgresql://localhost:5432/speiseplan`.

## Schema-Verwaltung

- Dependency `flyway-core` + `flyway-database-postgresql` ins Backend.
- `spring.jpa.hibernate.ddl-auto=validate`.
- Migrationen unter `src/main/resources/db/migration`:
  - `V1__minimal_use_case.sql` mit `meal_plan`, `dish` und `plan_entry`.
  - `V2__folgephase.sql` erweitert `dish` und `plan_entry` und legt `ingredient`,
    `dish_ingredient`, `dish_image`, `prep_step`, `shopping_list_item` und
    `user_profile` an, siehe `00-projekt-uebersicht.md`.
  - `plan_entry` hat FKs auf Plan und Gericht; der Plan-FK nutzt `ON DELETE CASCADE`.
  - Unique-Index auf `(plan_id, sort_order)`, damit eine Planreihenfolge eindeutig bleibt.
- Seed-Daten ausschliesslich ueber einen `dev`-Profil-Runner anlegen.

## Akzeptanzkriterien

- [ ] `docker compose up -d` + Backend-Start im Profil `dev` funktioniert.
- [ ] Flyway legt Schema bei leerem Volume vollständig an (`flyway_schema_history` vorhanden).
- [ ] `ddl-auto=validate` meldet keine Abweichungen zwischen Entities und Migration.
- [ ] Das Schema bildet das vollstaendige Domaenenmodell aus `00-projekt-uebersicht.md` ab.
