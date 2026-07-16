# KI-Anweisung: Frontend (Angular, Minimal-Use-Case)

> Lies zuerst `00-projekt-uebersicht.md`. Baue im bestehenden Angular-Projekt
> `romansapp` nur den aktiven Minimal-Use-Case. Spaetere Ansichten und Funktionen
> bleiben unberuehrt.

## Ziel

Mobile-first UI fuer den kompletten Durchstich: Planliste laden, Plan oeffnen,
Gerichte des Plans laden, neues Gericht mit Text und Smartphone-Foto erstellen.

## Struktur

Lege nur die notwendigen Bereiche unter `src/app/` an:

```
core/             # API-Basis-URL und TypeScript-Models
features/plans/   # Planliste und Plan-Detail mit Gerichtsliste
features/dishes/  # Formular zum Anlegen eines Gerichts
```

Keine Auth-Guard-, Dashboard-, Einkaufslisten-, Profil- oder Offline-Features erstellen.
Die vorhandenen Auth-Dateien muessen nicht entfernt oder umgebaut werden.

## Routen und API

- `/plans`: laedt `GET /api/plans`; jede Planzeile fuehrt zu `/plans/:planId`.
- `/plans/:planId`: laedt `GET /api/plans/{planId}/dishes` und zeigt Name und Bild jedes
  Gerichts als mobile Kartenliste. Der Button "Gericht hinzufuegen" fuehrt zu
  `/plans/:planId/dishes/new`.
- `/plans/:planId/dishes/new`: reaktives Formular mit Feld "Name" und Pflicht-Bildfeld.
  Das Bild ueber `<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment">`
  aufnehmen oder aus der Galerie waehlen. Vor dem Absenden lokale Bildvorschau zeigen.
- Submit per `FormData` (`name`, `image`) an `POST /api/plans/{planId}/dishes`.
  Bei `201` zurueck zum Plan navigieren und das neue Gericht sichtbar anzeigen.

`environment.ts` enthaelt `apiUrl: 'http://localhost:8080/api'`. Das Bild-`src` wird aus
der Backend-Origin plus der relativen `imageUrl` gebildet; niemals eine lokale Dateipfad-URL
in HTML verwenden.

## UX-Vorgaben

- Sichtbare UI-Texte auf Deutsch, Code auf Englisch.
- Mobile-first ab 375 px, grosse Touch-Ziele (mindestens 44 px).
- Lade-, Leer- und Fehlerzustand fuer Plan- und Gerichtsliste darstellen.
- Waehrend Upload: Submit deaktivieren und Fortschritts-/Ladetext zeigen.
- Fehlermeldungen des Backends nahe am Formular anzeigen, ohne die Eingabe zu verlieren.
- Kein Instagram-Feed, Suche, Filter, Galerie, Zubereitung, Timer oder Dashboard in dieser Phase.

## Akzeptanzkriterien

- [ ] `npm run start` zeigt unter `/plans` die Daten des Backends.
- [ ] Ein Plan oeffnet seine Gerichtsliste samt Bildern.
- [ ] Auf einem Smartphone kann ein Foto aufgenommen, mit Namen abgesendet und danach
  in der Gerichtsliste gesehen werden.
- [ ] `ng build` laeuft fehlerfrei.
