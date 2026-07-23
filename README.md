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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

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
