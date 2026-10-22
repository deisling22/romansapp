# KI-Anweisung: Frontend (Angular)

> Lies zuerst `00-projekt-uebersicht.md`. Die Sperre wurde aufgehoben; das
> Frontend deckt Dashboard, Planverwaltung, Gerichtskatalog, Einkaufsliste,
> Einstellungen und PWA-Offline ab.

## Ziel

Mobile-first UI fuer den kompletten Funktionsumfang: Dashboard, Planliste (inkl.
Erstellen/Kopieren/Loeschen), Plan-Detail mit Gerichtsliste und "gekocht"-Status,
Gerichtskatalog mit Suche/Filter/Galerie/Zutaten/Zubereitungsschritten mit Timer,
Einkaufsliste je Plan und Einstellungen.

## Struktur

Bereiche unter `src/app/`:

```
core/                  # API-Basis-URL, TypeScript-Models, API-Services
features/dashboard/    # Tageswerte, naechstes Gericht
features/plans/        # Planliste, Plan-Detail mit Gerichtsliste
features/dishes/       # Anlegen, Katalog, Detail mit Galerie/Zutaten/Schritten
features/shopping-list/# Einkaufsliste je Plan
features/settings/     # Profil-Einstellungen
```

Keine Auth-Guard-Features erstellen; die vorhandenen leeren Auth-Dateien bleiben
unveraendert.

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

## Designsystem (Stand 22.10.2026, angelehnt an iOS 27)

- Vorbilder: Apple-Design-Award-2026-Apps (Tide Guide: klare Datendarstellung,
  Moonlitt: native Bedienelemente, Structured: scanbarer Tagesablauf, Guitar Wiz:
  Dynamic Type/Kontrast/nicht nur Farbe, The Outsiders: Fortschrittsringe) und
  Apple-Systemapps (Erinnerungen, Einstellungen, Health).
- iOS 27 erlaubt Liquid Glass "voll eingefaerbt": wir nutzen **nur opake Flaechen**,
  keine Transparenz/Blur. Tab-Bar, Menues und Toasts sind immer voll sichtbar.
- Tokens in `src/styles.scss` (Farben, Schriftstufen, Radien, Schatten) mit Hell-/Dunkel-
  und Hochkontrast-Varianten; wiederverwendbare Mixins in `src/styles/_ios.scss`
  (`card`, `grouped-list`, `grouped-row`, `button-filled|tinted|gray|small|plain`, `chip`).
  Komponenten nutzen `@use '../../../styles/ios';` und nur `var(--...)`-Farben,
  keine Hex-Werte ausser bewusst feste Farben (z. B. Icon-Kacheln, Reels).
- Schrift: Systemschrift (`-apple-system`/SF Pro), Groessen in rem nach iOS-Textstilen
  (Large Title 34, Title 1-3, Headline/Body 17, Subhead 15, Footnote 13, Caption 12).
- Akzentfarbe "Basilikum" `#1a7a43` (dunkel `#30d158`), Status immer mit Text/Symbol
  zusaetzlich zur Farbe (✓, ≡, !, ↺).
- Navigation: schwebende, opake Tab-Bar (Heute, Plaene, Gerichte, Einkauf) plus runder
  Aktionsknopf fuer Scannen und weitere Bereiche. Schalter (`input.switch`) statt Checkboxen
  fuer Einstellungen, abgerundete Abhak-Kreise in der Einkaufsliste.
- Globale Formularstile stehen in `:where(...)` (Spezifitaet 0), damit Komponenten sie
  ohne `!important` ueberschreiben koennen.
## Akzeptanzkriterien

- [ ] `npm run start` zeigt das Dashboard sowie unter `/plans` die Daten des Backends.
- [ ] Ein Plan oeffnet seine Gerichtsliste samt Bildern und kann Gerichte als gekocht markieren.
- [ ] Auf einem Smartphone kann ein Foto aufgenommen, mit Namen abgesendet und danach
  in der Gerichtsliste gesehen werden.
- [ ] Der Gerichtskatalog unterstuetzt Suche/Filter und zeigt Galerie, Zutaten und
  Zubereitungsschritte mit Timer.
- [ ] Die Einkaufsliste eines Plans laesst sich generieren und abhaken.
- [ ] `ng build` laeuft fehlerfrei.
