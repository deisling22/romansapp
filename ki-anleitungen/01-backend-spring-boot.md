# KI-Anweisung: Backend (Spring Boot, Minimal-Use-Case)

> Lies zuerst `00-projekt-uebersicht.md`. Die Minimal-Use-Case-Sperre ist
> verbindlich. Implementiere nur den dort beschriebenen Durchstich.

## Ziel

Erstelle ein separates Spring-Boot-Backend in `speiseplan-backend`. Es muss Plaene
laden, die Gerichte eines Plans laden und ein Gericht mit Name und Bild hochladen
sowie dem Plan zuordnen koennen.

## Rahmenbedingungen

- Spring Boot 3.x, Java 21, Maven.
- Dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`,
  `spring-boot-starter-validation`, `postgresql`, `flyway-core`,
  `flyway-database-postgresql` und `spring-boot-starter-test`.
- Keine Spring Security-, JWT-, Benutzer-, Zutaten- oder Einkaufslisten-Abhaengigkeit.
- Package: `de.roman.speiseplan` mit `plan`, `dish`, `storage`, `config`.
- `server.port=${PORT:8080}`. CORS erlaubt standardmaessig `http://localhost:4200`.

## Persistenzmodell

Implementiere JPA-Entities und Repositories:

| Entity | Felder |
|---|---|
| `MealPlan` | id, name, createdAt |
| `Dish` | id, name, imageUrl, createdAt |
| `PlanEntry` | id, plan (`ManyToOne`), dish (`ManyToOne`), sortOrder |

- `PlanEntry.plan` wird beim Loeschen eines Plans per FK `ON DELETE CASCADE` entfernt.
- `sortOrder` startet bei 0 und wird beim Hinzufuegen eines Gerichts auf den naechsten
  freien Wert gesetzt.

## Endpoints

### Plaene und Gerichte lesen

- `GET /api/plans` -> `200` und `PlanSummaryDto[]` (`id`, `name`, `dishCount`).
- `GET /api/plans/{planId}/dishes` -> `200` und `DishDto[]` (`id`, `name`, `imageUrl`,
  `sortOrder`). Sortierung aufsteigend nach `sortOrder`.
- Nicht vorhandener Plan -> `404` mit `{ "status", "message", "timestamp" }`.

### Gericht mit Foto hinzufuegen

`POST /api/plans/{planId}/dishes` akzeptiert `multipart/form-data`:

- `name`: Pflichtfeld, 1 bis 120 Zeichen.
- `image`: Pflichtfeld, Bilddatei (`image/jpeg`, `image/png` oder `image/webp`), maximal 10 MB.

Speichere die Datei unter `uploads/` im Backend-Arbeitsverzeichnis mit einem zufaelligen
Dateinamen. Keine vom Client uebernommenen Dateinamen verwenden. Lege `Dish` und
`PlanEntry` in einer Transaktion an und gib `201` mit `DishDto` zurueck.

Stelle `uploads/` unter `GET /uploads/**` als statische Ressource bereit. Das Feld
`imageUrl` muss eine relative URL wie `/uploads/<uuid>.jpg` enthalten.

## Initialdaten und Tests

- Dev-Seed: zwei Plaene, einer davon mit mindestens einem Gericht samt Testbild oder
  platzhalterhafter Bild-URL. Damit die UI direkt einen Ladezustand zeigen kann.
- Teste mit MockMvc mindestens: Plaene laden, Gerichte eines Plans laden und erfolgreichen
  Multipart-Upload inklusive PlanEntry-Anlage.
- Teste ungueltigen MIME-Type und unbekannte `planId`.

## Akzeptanzkriterien

- [ ] `mvn verify` ist gruen.
- [ ] `GET /api/plans` sowie `GET /api/plans/{id}/dishes` geben Seed-Daten zurueck.
- [ ] Ein `curl -F name=... -F image=@...` erzeugt ein Gericht und liefert dessen Bild-URL.
- [ ] Das gespeicherte Bild ist anschliessend ueber `/uploads/...` abrufbar.
- [ ] Kein Code ausserhalb dieses Minimal-Use-Cases wird eingefuehrt.
