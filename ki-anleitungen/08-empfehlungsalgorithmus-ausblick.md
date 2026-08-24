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

- Aktuell wirkt eine schlechte Bewertung (≤ 2 Sterne) leicht dämpfend, es gibt aber keine
  direkte "Nicht interessiert"-Aktion für Nutzer.
- Einen kompakten Button/Swipe "Weniger davon" auf Empfehlungskarten ergänzen, der einen
  stark negativen Gewichtungs-Event auslöst und den Inhalt sofort aus dem aktuellen Feed entfernt.
- Getrennt vom regulären Bewertungssystem behandeln, damit Rezept-Bewertungen und
  Feed-Feedback nicht vermischt werden.

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

- Neue Nutzer ohne jede Interaktion sehen ausschließlich den Trending-Fallback.
- Ein kurzer, optionaler Onboarding-Schritt ("Welche Küchen magst du?") könnte das
  Geschmacksprofil sofort mit ein paar Tags vorbelegen, statt erst nach mehreren Aktionen
  zu personalisieren.

## Weitere Oberflächen

- Aktuell nur auf dem Dashboard sichtbar. Sinnvolle nächste Plätze: ein "Entdecken"-Bereich
  oben im Gerichtkatalog, eine nach Empfehlungs-Score sortierte Reihenfolge im
  Creator-Reel-Feed, sowie ein optionaler wöchentlicher Empfehlungs-Hinweis über den
  bestehenden Benachrichtigungskanal.

## Empfohlene Reihenfolge

1. Impression-/Klick-Erfassung ergänzen (Grundlage für alles Weitere).
2. Explizites "Weniger davon"-Signal und Erklärbarkeits-Hinweis ergänzen.
3. Item-Item-Co-Occurrence als einfaches kollaboratives Signal einführen.
4. Vielfaltsregel beim Zuschneiden der Ergebnislisten ergänzen.
5. Zeit-/Saison-Kontext einbeziehen, sobald Nutzungsdaten über mehrere Monate vorliegen.
6. Haushaltsprofile erst nach Einführung eines Haushalts-Datenmodells angehen.
7. Batch-Vorberechnung und Multi-Armed-Bandit erst bei spürbarem Nutzerwachstum umsetzen.
