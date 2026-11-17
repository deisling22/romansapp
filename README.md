# Romansapp

## Google login on Render

The protected `Konto & Anmeldung` menu entry uses Google OAuth2. The Google
credentials are deliberately not stored in this repository.

Create an OAuth 2.0 Web application client in Google Cloud and add this
authorized redirect URI:

```
https://speiseplan-backend-ye17.onrender.com/login/oauth2/code/google
```

Then add these environment variables in the Render dashboard for
`speiseplan-backend`:

```
GOOGLE_OAUTH_ENABLED=true
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID=<Google client ID>
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=<Google client secret>
```

The `render.yaml` file configures these keys as secrets for new Blueprint
deployments. For an existing Render service, add their values manually and
redeploy the service. Keep `SESSION_COOKIE_SAME_SITE=none` and
`SESSION_COOKIE_SECURE=true` so the GitHub Pages frontend can use the secure
backend session.

This project uses [Angular CLI](https://angular.dev) version 22.

## Production responsiveness

The Render free backend sleeps after 15 minutes without requests; waking it takes
about 100 seconds (measured; 3.6 minutes before the Docker image was optimized).
An always-on instance is needed to avoid this infrastructure delay; until then
the app bridges it:

- every screen paints its last known state from local storage first and
  refreshes in the background ("Wird aktualisiert ...");
- reads are repeated after a timeout (90 s) or gateway error, writes never;
- a banner explains the wait once a request takes longer than five seconds;
- list actions (add, tick, remove, complete purchase, mark as cooked) take
  effect immediately and are rolled back or queued if the server fails.

The start screen needs two requests (`GET /api/home`, `GET /api/recommendations`).
Measurements and the reasons for the JVM/Docker settings are documented in
`ki-anleitungen/05-deployment.md`.

## Development server

In the shopping list, ticking an item only means “in the cart”. Nothing is booked
until “Einkauf abschließen” is tapped; that single request moves the cart into the
pantry and is queued offline and replayed automatically. Leaving the page never
books anything. Items are removed with a left swipe or the “×” button.

Recipes, shopping list and pantry compare ingredients through a canonical key
(`IngredientMatcher`), so spelling, plural and units (“Tomate 3 Stk.” vs.
“Tomaten 300 g”) do not matter.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Kassenbon und Einkauf importieren

Im Plus-Menü öffnet **Kassenbon importieren** den Vorratsimport. Unterstützt
werden Kamerafotos, Bilder, PDFs (auch gescannte Seiten) und Textdateien.
Dateien dürfen höchstens 20 MB groß sein, PDFs höchstens 10 Seiten haben.
PDF-Text und OCR werden auf dem Gerät verarbeitet; die OCR lädt bei Bedarf
ihre Engine und das deutsche Sprachmodell herunter. Nur die bestätigten
Artikel werden an die bestehende Vorrats-API gesendet.

Vor dem Import können Namen, Mengen und Einheiten korrigiert und einzelne
Positionen abgewählt werden. Explizite Gewichte werden in Gramm umgerechnet;
ohne Mengenangabe wird 1 Stück vorgeschlagen. Flüssigkeiten behalten l/ml.
Kassenbon-Abkürzungen und fehlende Packungsgrößen können nicht zuverlässig
aufgelöst werden. Preise werden nicht als Gewicht interpretiert. Der Import
erzeugt keine Rezepte und bucht keine Ausgaben; **Beleg erfassen** bleibt dafür
unverändert verfügbar.

Text lässt sich einfügen, Text/Bilder/PDFs lassen sich auf der Importseite
ablegen. Der bestehende GET-Web-Share-Target nimmt jetzt auch Einkaufstexte
entgegen, sofern Browser und installierte PWA dies unterstützen (typisch
Android/Chromium). Rezeptlinks bleiben weiterhin mit dem Rezeptimport verbunden.
Geteilte Einkaufslinks ohne Artikeldaten werden nicht automatisch abgerufen.
Datei-Sharing über das Betriebssystem wird dadurch noch nicht unterstützt.

**Zukünftiges natives Teilen:** Damit die iOS-App wie Tesla in „Teilen“ erscheint,
ist ein eigener Share-Extension-Target mit App Group und Übergabe an Capacitor
nötig. Dieser ist noch nicht implementiert. Die spätere Anbindung soll Text,
Bilder und PDFs an denselben Prüf-/Importablauf übergeben; keine automatische
Vorratsbuchung ohne Bestätigung. Ob Netto & Co. vollständige Artikeldaten teilen,
hängt von der jeweiligen Quell-App ab.

## Native iOS app

Prerequisites:

- Install Xcode from the Mac App Store and open it once.
- Select Xcode with `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`.
- Connect the iPhone by cable and enable Developer Mode on the device.

Build and open the native project:

```bash
npm run build:ios
npm run ios:open
```

In Xcode, select the `App` target, choose a personal Apple Developer team under
Signing & Capabilities, select the connected iPhone, and press Run. The bundle
identifier is `de.roman.speiseplan`.

After frontend changes, run `npm run build:ios` again before starting the app
from Xcode.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
