# Monetarisierung: Affiliate-Provisionen mit Creator-Beteiligung

Stand: 24. August 2026

## 1. Ausgangsidee

Die App bleibt fuer Nutzer vollstaendig kostenlos und ohne Anmeldezwang nutzbar
(inklusive Offline-Einkaufsliste). Wenn ein Nutzer ueberzeugt ist, bestellt er
die Zutaten eines Plans ueber einen Partner-Onlinesupermarkt (z. B. REWE).
Romansapp erhaelt dafuer eine Affiliate-Provision und gibt einen Teil davon
(Idee: 1-2 %) an den Creator weiter, dessen Gericht/Plan im Einkauf enthalten
war. Ziel: Creator, die gute Plaene erstellen, verdienen wiederkehrend Geld,
je oefter ihre Gerichte nachgekocht und nachbestellt werden.

Dieses Dokument prueft die Idee gegen aktuelle, live nachgeschaute Fakten und
ergaenzt `06-haendler-affiliate.txt` um eine konkrete Wirtschaftlichkeits- und
Risikobetrachtung.

## 2. Aktuell gepruefte Provisionsdaten (REWE)

REWE betreibt sein Affiliate-Programm ueber das Awin-Netzwerk (Merchant-ID
11652). Oeffentlich sichtbare Standard-Provisionsstufen fuer Abhol- und
Lieferservice (live im Awin-Merchant-Profil eingesehen, nicht nur die
REWE-Marketingseite):

| Kundentyp | Provision |
|---|---|
| Neukunde | 8 % |
| Neukunde mit Gutschein | 4 % |
| Bestandskunde | 4 % |
| Bestandskunde mit Gutschein | 2 % |

- Cookie-Laufzeit (Attributionszeitraum): 30 Tage.
- Sales-Validierung erfolgt monatlich.
- REWE bewirbt dies selbst als "hoechste Provisionen im Branchenvergleich" -
  vermutlich also eher der guenstige Fall als ein Ausreisser nach unten.
- Handzettel/Prospekte duerfen laut Programmbedingungen nicht zur Bewerbung
  verwendet werden.

Die urspruengliche Annahme "ca. 5 % Provision" ist damit ueberholt: Es gibt
keinen festen Satz, sondern eine Staffel von 8 % (Neukunde) bis 2 %
(Bestandskunde mit Gutschein). Diese Zahlen koennen sich aendern und muessen
vor jeder Umsetzung erneut im Awin-Merchant-Profil geprueft werden.

**Wichtigste Erkenntnis fuer das Geschaeftsmodell:** Ein wiederkehrender
Kunde, der ueber Zeit "ueberzeugt" wurde (genau die Zielgruppe dieser Idee),
zaehlt bei REWE als Bestandskunde und bringt nur noch 4 % statt 8 %, bei
zusaetzlicher Gutscheinnutzung nur noch 2 %. Der eigene Erfolg (treue,
wiederkehrende Koch:innen) senkt also tendenziell die Provision pro Kopf,
statt sie zu erhoehen. Das Versprechen an Creator ("immer wieder Geld
verdienen") steht damit in einem strukturellen Spannungsverhaeltnis zum
Rabattmodell des Handelspartners.

Fuer EDEKA, Knuspr und Picnic ist laut `06-haendler-affiliate.txt` weiterhin
keine vergleichbar offene, selbst registrierbare Provisionsuebersicht
belegt - dort bleibt nur die individuelle Anfrage.

## 3. Realitaetscheck der drei Kernannahmen

1. **"Artikel landen automatisch im Warenkorb beim Partner"**
   Es ist keine oeffentlich nutzbare Warenkorb-/Checkout-API fuer REWE oder
   EDEKA belegt. Self-Service ueber Awin liefert nur einen Tracking-Link zur
   REWE-Seite; der Nutzer sucht und legt Produkte dort selbst in den
   Warenkorb. Ein echter "Plan-zu-Warenkorb"-Transfer braucht eine direkte
   B2B-Vereinbarung mit REWE (Vertriebsprozess, kein Self-Service, siehe
   Abschnitt 6).
2. **"Provisionen fliessen zuverlaessig pro Gericht"**
   Die Attribution laeuft ueber ein 30-Tage-Cookie nach dem Last-Click-Prinzip.
   Nutzt der Kunde vor dem Kauf noch eine Cashback-/Gutscheinseite oder die
   REWE-App direkt, geht die Provision an den letzten Klick - nicht an
   Romansapp. Das betrifft gerade treue Bestandskunden besonders haeufig.
3. **"Jedes Gericht wird eindeutig einem User zugeordnet"**
   Ein realer Wocheneinkauf enthaelt typischerweise Zutaten mehrerer Gerichte
   und moeglicherweise mehrerer Creator in einer einzigen Bestellung. Es
   fehlt heute eine auditierbare Regel, wie eine Provision auf mehrere
   beitragende Creator aufgeteilt wird (z. B. proportional nach
   Zutaten-/Mengenanteil am Einkauf).

## 4. Beispielrechnung (illustrativ, keine Prognose)

Annahme: durchschnittlicher Wocheneinkauf 70 EUR, realistischer Kundenmix
(ueberwiegend Bestandskunden, Gutscheine in Deutschland bei Lebensmitteln
verbreitet):

- 10 % Neukunde (8 %): 5,60 EUR
- 60 % Bestandskunde ohne Gutschein (4 %): 2,80 EUR
- 30 % Bestandskunde mit Gutschein (2 %): 1,40 EUR
- Gewichteter Schnitt: ca. **2,66 EUR Provision pro abgeschlossener Bestellung**

Bei einem Creator-Anteil von 25 % der erhaltenen Provision (nicht 25 % vom
Warenwert): ca. 0,67 EUR an den Creator, ca. 2,00 EUR netto fuer Romansapp
vor Zahlungsabwicklungs-/Infrastrukturkosten.

Fuer 2.000 EUR/Monat Netto-Einnahme waeren demnach ca. **1.000 abgeschlossene,
attribuierte Bestellungen pro Monat** noetig. Das setzt eine mehrstellige
Zahl aktiver, tatsaechlich kaufender Nutzer voraus - realistisch erst ab
einigen tausend monatlich aktiven Nutzern bei branchenueblichen
Klick-zu-Kauf-Raten.

## 5. Risiken und Gegenargumente

- **Henne-Ei-Problem:** Ohne Traffic lohnt sich das Programm fuer Creator
  nicht; ohne attraktive Creator-Plaene kommt kein Traffic.
- **Betrugs-/Missbrauchsrisiko:** Sobald Auszahlung an "mein Gericht wurde
  gekauft" haengt, sind Fake-Accounts oder Bestellungen im Familien-/
  Freundeskreis ein Anreiz, um Provisionen zu erzeugen. Braucht
  Mindestauszahlungsgrenzen, manuelle Pruefung und ggf. Identitaetspruefung
  vor Auszahlung.
- **Attributionsverlust:** Cashback-Portale, Gutscheinseiten und die native
  REWE-App koennen die eigene Provision "abfangen" (siehe Abschnitt 3.2).
- **Ein-Partner-Abhaengigkeit:** Aendert oder kuendigt REWE die Konditionen,
  bricht der komplette Umsatzstrang ohne Fallback weg.
- **Organisatorischer Zusatzaufwand:** Auszahlungen an Dritte erfordern ein
  Payout-System (z. B. Stripe Connect), Mindestbetraege, Waehrungs-/
  Steuerhandling und klare, nachvollziehbare Berechnungslogik.
- **EDEKA/Knuspr/Picnic** bleiben ohne belegte Self-Service-API vorerst nicht
  kurzfristig planbar (siehe `06-haendler-affiliate.txt`).

## 6. Rechtliche und organisatorische Aspekte (keine Rechts-/Steuerberatung)

- Affiliate-Links muessen sichtbar als Werbung/Affiliate-Link gekennzeichnet
  werden (UWG).
- Tracking-Cookies (Awin) brauchen eine Einwilligung nach DSGVO/TTDSG, also
  ein Cookie-Consent-Konzept fuer die App.
- Ein Creator-Vertrag/AGB-Zusatz sollte Berechnungslogik, Aufteilung bei
  Mehrfach-Attribution, Ruecknahmerecht bei Betrugsverdacht und
  Aenderungsvorbehalt regeln.
- Auszahlungen an Creator sind vermutlich gewerblich relevant (Gewerbeanmeldung
  pruefen, sobald real ausgezahlt wird); Creator sind selbst fuer ihre eigene
  Versteuerung verantwortlich, sollten dies aber vertraglich bestaetigen.
- Vor dem ersten echten Payout: Ruecksprache mit echter Rechts-/
  Steuerberatung, wie bereits in `06-haendler-affiliate.txt` festgehalten.

## 7. Alternative/ergaenzende Geschaeftsmodelle

1. **Freemium-Abo:** Kernfunktionen bleiben kostenlos, ein bezahlter Tier
   schaltet z. B. erweiterte Naehrwertanalyse, unbegrenzte KI-Zutatenscans
   oder Mehrfach-Haushaltsprofile frei. Planbare, wiederkehrende Einnahmen
   ohne Abhaengigkeit von fremder Checkout-Attribution.
2. **Gesponserte Platzierung/Native Advertising:** Marken zahlen fuer
   sichtbare, klar gekennzeichnete Platzierung (z. B. "Zutat der Woche").
   Abrechnung nach Sichtbarkeit/Impressions statt nach fremdem Tracking -
   deutlich kontrollierbarer als Affiliate-Provisionen.
3. **Creator-Marktplatz-Gebuehr:** Creator verkaufen eigene Premium-Plaene
   direkt an Nutzer, Romansapp behaelt eine Vermittlungsgebuehr. Einnahmen
   haengen nicht vom Ueberleben eines fremden Tracking-Cookies ab.
4. **B2B-Lizenzierung:** Die Planungs-/Empfehlungs-Engine als lizenziertes
   Modul an einen Haendler (bereits als Idee in `06-haendler-affiliate.txt`
   vermerkt). Groessere Deal-Groessen, aber langer Vertriebszyklus.
5. **Empfohlen: Hybrid-Modell.** Freemium und/oder Sponsoring als verlaessliche
   Basis, Affiliate-Provisionen als zusaetzlicher Bonus-Ertrag obendrauf -
   nicht als alleintragende Saeule.

## 8. Empfohlenes Vorgehen (Reihenfolge)

1. Vorab schriftlich festlegen: Creator-Anteil als Prozentsatz von der
   *erhaltenen* Provision (empfohlen, transparent und auditierbar) statt vom
   Warenwert; ebenso die Aufteilungsregel bei mehreren Creator-Gerichten pro
   Bestellung.
2. Awin-Publisher-Account anlegen und bei REWE bewerben (self-service);
   parallel EDEKA direkt anschreiben und nach Produktfeed-/Cart-Zugang fragen
   (siehe `06-haendler-affiliate.txt`, Abschnitt 6).
3. MVP wie in `06-haendler-affiliate.txt` beschrieben umsetzen: ein klar
   gekennzeichneter "Beim Partner einkaufen"-Button pro Einkaufsliste, ohne
   einen automatischen Warenkorb vorzutaeuschen, der technisch nicht existiert.
4. Klick- und Conversion-Tracking (Awin-Reports) sauber anbinden, inklusive
   manueller Pruefung/Mindestschwelle, bevor die erste Creator-Auszahlung
   erfolgt.
5. Rechtliches nachziehen: Affiliate-Kennzeichnung, Cookie-Consent,
   Creator-AGB, Klaerung Gewerbeanmeldung/Steuer mit echter Beratung.
6. Parallel mindestens einen zweiten, von REWE unabhaengigen Erloesstrom
   (Freemium oder Sponsoring) aufbauen.
7. Erst mit echten Conversion-Zahlen aus einem kleinen Testkreis die
   Wirtschaftlichkeitsrechnung aus Abschnitt 4 mit echten Daten validieren,
   bevor Creator eine feste Einnahmeerwartung versprochen wird.

## 9. Offene Entscheidungen

- Creator-Anteil: Prozentsatz von der Provision oder vom Warenwert? (Empfehlung: von der Provision)
- Aufteilungsregel bei mehreren Creator-Gerichten in einer Bestellung.
- Mindestauszahlungsbetrag und Auszahlungsintervall fuer Creator.
- Auszahlungsweg/Anbieter (z. B. Stripe Connect, PayPal Payouts).
- Zeitpunkt fuer die direkte B2B-Anfrage bei REWE/EDEKA bezueglich echter
  Produktfeed-/Warenkorb-Integration (vs. reinem Affiliate-Link im MVP).
