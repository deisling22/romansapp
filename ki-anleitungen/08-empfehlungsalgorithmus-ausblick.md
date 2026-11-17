# Spätere Ausbaustufe: Empfehlungsalgorithmus

## Ziel

Die erste Ausbaustufe liefert bereits ein funktionierendes "Für dich"-Feed für Gerichte,
Creator und Pläne, gespeist aus persönlicher Geschmacksaffinität und einem
nutzerübergreifenden Trend-Score. Dieses Dokument sammelt die bewusst zurückgestellten
Erweiterungen, damit sie bei Bedarf gezielt nachgezogen werden können.

## Aktueller Stand (v1)

- `ContentTrendScore` (`backend/.../recommendation/`): nutzerübergreifender,
  zeitverfallender Engagement-Score je Gericht/Creator/Plan (Halbwertszeit 96 Stunden).
- `RecommendationService`: persönliches Geschmacksprofil aus bereits vorhandenen Daten
  (Koch-/Bewertungs-Events, Favoriten, Sternebewertungen), gewichtet nach Tags, mit
  30-Tage-Verfall.
- Trend-Hooks beim Ansehen der Detailseite, Bewerten, Favorisieren, Kochen, Abonnieren
  und Plan-Kopieren.
- `GET /api/recommendations`: optional authentifiziert, anonyme Nutzer bekommen den
  reinen Trending-Fallback.
- Frontend: drei "Für dich"-Streifen (Gerichte, Creator, Pläne) auf dem Dashboard.

## Aktueller Stand (v2, 17.11.2026)

- **Geschmack ohne Konto** (`TasteService`): Das Profil gilt je Haushalt und speist sich aus
  den in der Einrichtung gewählten Tags (`GET/PUT /api/taste`, Gewicht 8), aus "Weniger
  davon" (Abzug 3 je Tag) und – ohne Anmeldung – aus dem Kochprotokoll des Haushalts
  (Gewicht 4, Halbwertszeit 30 Tage). Angemeldete Nutzer behalten zusätzlich ihr
  persönliches Profil.
- **"Weniger davon"** (`POST /api/recommendations/dishes/{id}/less`): blendet das Gericht
  für den Haushalt aus allen Vorschlägen aus und senkt das Gewicht seiner Tags. Getrennt
  von der Sternebewertung.
- **"Bald verbrauchen"** (`UseSoonService`, `GET /api/pantry/use-soon`): eine gemeinsame
  Wertung statt zweier getrennter Listen:
  `Wert = Dringlichkeit × (0,5 + 0,5 × Vorratsabdeckung) × (1 + 0,5 × tanh(Geschmack / 8))`.
  - Dringlichkeit je ablaufender Zutat: `1 / (1 + Resttage)`, abgelaufen 1,2; Summe über
    alle passenden Zutaten des Gerichts.
  - Vorratsabdeckung: Anteil der Zutaten, die für die Haushaltsportionen vollständig da sind.
  - Bestand, den der Plan bis zum Ablauftag verbraucht, zählt als "eingeplant" und löst
    keinen Vorschlag aus (Zuordnung in Ablaufreihenfolge, wie beim Abbuchen).
  - Ausgeschlossen: ausgeblendete Gerichte, Gerichte mit ≤ 2 Sternen des Nutzers, Gerichte
    der nächsten Plantage; gleichnamige Kopien erscheinen einmal.
  - Jede Empfehlung liefert ihre Begründung (passende Zutaten, fehlende Zutaten,
    Geschmackstreffer) und den Planeintrag, den sie übernehmen kann (`todayEntry`).
- Zutatenabgleich überall über `IngredientMatcher` (Schreibweise, Plural, Einheiten).

## Explizites Sichtbarkeits-Signal (Impressions)

- Aktuell zählt nur das Öffnen der Detailseite als Signal; ein Gericht, das in der
  Katalog- oder Empfehlungsliste nur angezeigt, aber ignoriert wurde, hinterlässt keine Spur.
- Eine leichte "Impression"-Erfassung ergänzen (z. B. IntersectionObserver im Frontend,
  gebündelter Sammel-Request statt eines Aufrufs pro Karte), um echtes
  "gesehen, aber nicht angeklickt" von "nie gesehen" zu unterscheiden.
- Darauf aufbauend eine Klickrate pro Gericht/Creator berechnen und als zusätzlichen
  Trend-Faktor einbeziehen.

## Kollaboratives Filtern

- v1 ist rein inhaltsbasiert (Tag-Überlappung). Es gibt noch kein "Nutzer mit ähnlichem
  Geschmack mochten auch …".
- Einfacher erster Schritt: Item-Item-Co-Occurrence auf Basis von `GamificationEvent`
  (welche Gerichte werden von denselben Nutzern in zeitlicher Nähe gekocht/bewertet),
  periodisch vorberechnet statt live pro Anfrage.
- Später optional: Matrixfaktorisierung oder Embedding-basierte Ähnlichkeit, wenn die
  Datenmenge das rechtfertigt.

## Explizite Negativ-Signale

- Umgesetzt für Gerichte ("Weniger davon", siehe v2). Offen: dieselbe Aktion für Creator
  und Pläne sowie eine Möglichkeit, ausgeblendete Gerichte wieder einzublenden.

## Erklärbarkeit ("Warum wird mir das gezeigt?")

- Einen kurzen Hinweistext je Empfehlung ergänzen, z. B. "Weil du oft Pasta-Gerichte kochst"
  oder "Gerade beliebt bei anderen Nutzern".
- Dafür muss `RecommendationService` den dominanten Score-Anteil (persönlich vs. Trend)
  pro Ergebnis mitliefern, nicht nur die finale Zahl.

## Explore/Exploit-Steuerung

- Der aktuelle Zufallsanteil ist ein fester kleiner Jitter. Ein echter Multi-Armed-Bandit
  (z. B. Epsilon-Greedy oder Thompson Sampling) würde neue/unbekannte Inhalte gezielter
  und nachvollziehbarer testen als reiner Zufall.
- Voraussetzung: die oben genannte Impression-/Klick-Erfassung, um Erfolg messen zu können.

## Zeit- und Kontextsensitivität

- Empfehlungen sind aktuell zeitunabhängig. Sinnvolle Erweiterung: Tageszeit
  (Frühstück/Mittag/Abend) und Saison (siehe bereits vorhandene Gamification-Saison-Challenge)
  als zusätzliche Gewichtung einbeziehen.
- Kurzfristige Absicht aus der aktuellen Sitzung (z. B. gerade benutzte Suchbegriffe/Tags)
  stärker gewichten als das langfristige Geschmacksprofil.

## Haushalts- und Familienprofile

- Passt zum bereits geplanten Gamification-Haushaltsziel: ein gemeinsames Profil, das die
  Geschmacksprofile mehrerer verknüpfter Nutzer sinnvoll mischt (z. B. Durchschnitt oder
  Vereinigung der Tag-Affinitäten), statt nur einzelne Konten zu betrachten.
- Erfordert zunächst ein Datenmodell für Haushalte/Verknüpfungen zwischen Konten, das es
  heute noch nicht gibt.

## Skalierung und Performance

- `RecommendationService` lädt aktuell bei jeder Anfrage alle Gerichte/Creator/Pläne und
  berechnet die Scores live. Das ist für die heutige Datenmenge unproblematisch, sollte bei
  deutlichem Wachstum aber durch vorberechnete Kandidatenlisten (periodischer Batch-Job,
  z. B. stündlich) und Pagination ersetzt werden.
- `ContentTrendScore`-Zerfall wird lazy beim Lesen berechnet; bei sehr hoher Anfragefrequenz
  auf einen geplanten Recompute-Job umstellen, um wiederholte Gleitkommaberechnungen zu sparen.

## Vielfalt und Deduplizierung

- Es gibt noch keine Regel gegen zu ähnliche Ergebnisse in derselben Liste (z. B. fünf
  Nudelgerichte hintereinander). Eine einfache Tag-Diversitätsregel beim finalen Zuschneiden
  auf die Ergebnisliste ergänzen (z. B. maximal zwei Treffer pro dominantem Tag in den Top 12).

## Cold-Start-Onboarding

- Umgesetzt: Die Einrichtung beim ersten Start fragt "Was schmeckt dir?" und belegt das
  Haushaltsprofil mit den gewählten Tags vor. Offen: die Auswahl später in den
  Einstellungen ändern.

## Weitere Oberflächen

- Aktuell nur auf dem Dashboard sichtbar. Sinnvolle nächste Plätze: ein "Entdecken"-Bereich
  oben im Gerichtkatalog, eine nach Empfehlungs-Score sortierte Reihenfolge im
  Creator-Reel-Feed, sowie ein optionaler wöchentlicher Empfehlungs-Hinweis über den
  bestehenden Benachrichtigungskanal.

## Empfohlene Reihenfolge

1. Impression-/Klick-Erfassung ergänzen (Grundlage für alles Weitere).
2. Erklärbarkeits-Hinweis auch im "Für dich"-Feed ergänzen ("Bald verbrauchen" hat ihn schon).
3. Item-Item-Co-Occurrence als einfaches kollaboratives Signal einführen.
4. Vielfaltsregel beim Zuschneiden der Ergebnislisten ergänzen.
5. Zeit-/Saison-Kontext einbeziehen, sobald Nutzungsdaten über mehrere Monate vorliegen.
6. Haushaltsprofile erst nach Einführung eines Haushalts-Datenmodells angehen.
7. Batch-Vorberechnung und Multi-Armed-Bandit erst bei spürbarem Nutzerwachstum umsetzen.
