# KI-Anweisung: Mobilitaet, PWA und Offline (derzeit gesperrt)

> Lies zuerst `00-projekt-uebersicht.md`. Diese Datei ist absichtlich keine aktive
> Umsetzungsanweisung: Bis zur expliziten Aufhebung des Minimal-Use-Cases darf weder
> PWA noch Offline-Speicherung implementiert werden.

## Aktueller Umgang mit Smartphone-Fotos

Der Minimal-Use-Case nutzt den nativen Dateiauswahldialog des mobilen Browsers:

```html
<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment">
```

Das erlaubt auf vielen Android- und iOS-Geraeten Kamera oder Galerie. Die Funktion muss
auch ohne installierbare PWA im mobilen Browser funktionieren.

## Nach Aufhebung der Sperre

Dann erst umsetzen:

- `ng add @angular/pwa`, Manifest, iOS-Metadaten und Service Worker.
- Cache-Strategie fuer statische App-Ressourcen und lesbare API-Daten.
- IndexedDB/Dexie mit Outbox-Pattern fuer offline abhakbare Einkaufslisten.
- Offline-Indikator und Update-Hinweis via `SwUpdate`.
- Installation auf Android und iOS auf echten Geraeten testen.

## Aktuelles Akzeptanzkriterium

- [ ] Es existiert keine PWA-, Service-Worker-, Dexie- oder Offline-Sync-Implementierung,
  die den Minimal-Use-Case unnoetig vergroessert.
