# Spätere Ausbaustufe: Push-Benachrichtigungen

## Ziel

Benachrichtigungen sollen angemeldete Benutzer auch erreichen, wenn die Web-App oder
die native iOS-App nicht geöffnet ist. Die erste Ausbaustufe mit In-App-Toasts und
laufzeitgebundenen Erinnerungen bleibt als sofortiges Feedback erhalten.

## Fachliche Voraussetzungen

- Benutzer dauerhaft in einer eigenen Backend-Tabelle speichern.
- Google-Login anhand der stabilen Provider-ID einem Benutzer zuordnen.
- Erstregistrierung und erneute Anmeldung serverseitig unterscheiden.
- Benachrichtigungseinstellungen pro Benutzer speichern.
- Erinnerungen mit Typ, Fälligkeitszeit, Status und Benutzer-ID persistieren.
- Beim Checkout oder Zurücknehmen eines Artikels offene Erinnerungen stornieren.

## PWA und Web Push

- `SwPush` aus `@angular/service-worker` verwenden.
- Berechtigung erst nach einer erklärten, freiwilligen Benutzeraktion anfragen.
- VAPID-Schlüsselpaar erzeugen; privaten Schlüssel ausschließlich im Backend halten.
- Push-Abonnements mit Endpoint und Browser-Schlüsseln einem Benutzer zuordnen.
- Abgelaufene Abonnements bei HTTP 404 oder 410 aus dem Backend entfernen.
- Push-Nutzlast mit Titel, Text und Zielroute an den Angular Service Worker senden.
- Benachrichtigungsklick zur passenden Route, etwa `/#/shopping-list`, führen.

## Native iOS-App

- Capacitor-Plugin `@capacitor/push-notifications` ergänzen und iOS synchronisieren.
- Push Notifications Capability und APNs-Entitlement im Xcode-Projekt aktivieren.
- APNs-Schlüssel im Apple Developer Account erzeugen und sicher im Versanddienst hinterlegen.
- Gerätetoken pro Benutzer und Installation im Backend speichern und aktualisieren.
- Vordergrund-, Hintergrund- und Klickverhalten auf einem echten iPhone testen.

## Backend und Versand

- Endpunkte zum Registrieren, Aktualisieren und Löschen von Push-Abonnements anbieten.
- Fällige Erinnerungen mit einem persistenten Scheduler verarbeiten; keine In-Memory-Timer verwenden.
- Für Web Push eine VAPID-fähige Java-Bibliothek oder einen Push-Dienst einsetzen.
- Für Web Push und APNs möglichst einen gemeinsamen Versanddienst mit getrennten Adaptern verwenden.
- Versand idempotent gestalten, Wiederholungen begrenzen und Ergebnisse protokollieren.
- Render-Ruhezustände berücksichtigen: zeitkritische Jobs benötigen einen dauerhaft laufenden Worker
  oder einen externen Scheduler, der einen geschützten Backend-Endpunkt aufruft.

## Datenschutz und Sicherheit

- Keine sensiblen Inhalte auf dem Sperrbildschirm anzeigen.
- Abonnements nur für den authentifizierten Benutzer verwalten.
- Abmeldung, Widerruf und Löschen aller Gerätetoken anbieten.
- Einwilligungszeitpunkt und Benachrichtigungskategorien dokumentieren.
- Rate Limits und Schutz gegen fremde Ziel-Endpoints vorsehen.

## Empfohlene Reihenfolge

1. Persistente Benutzer und eindeutige Erstregistrierung einführen.
2. Benachrichtigungseinstellungen und persistente Erinnerungen modellieren.
3. PWA Web Push mit VAPID implementieren und auf Android sowie Desktop testen.
4. APNs über Capacitor für iOS ergänzen.
5. Zustellung, Widerruf, Offline-Fälle und Checkout-Stornierung Ende-zu-Ende testen.