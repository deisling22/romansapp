# KI-Anweisung: Mobilitaet, PWA und Offline

> Lies zuerst `00-projekt-uebersicht.md`. Die Sperre wurde aufgehoben; PWA und
> Offline-Speicherung fuer die Einkaufsliste sind aktiv umzusetzen.

## Umgang mit Smartphone-Fotos

Der Minimal-Use-Case nutzt den nativen Dateiauswahldialog des mobilen Browsers:

```html
<input type="file" accept="image/jpeg,image/png,image/webp" capture="environment">
```

Das erlaubt auf vielen Android- und iOS-Geraeten Kamera oder Galerie. Die Funktion muss
auch ohne installierbare PWA im mobilen Browser funktionieren.

## Umsetzung

- `ng add @angular/pwa`: Manifest, iOS-Metadaten und Service Worker.
- Cache-Strategie fuer statische App-Ressourcen und lesbare API-Daten (`ngsw-config.json`).
- IndexedDB/Dexie mit Outbox-Pattern fuer offline abhakbare Einkaufslisten-Eintraege;
  beim Wiederverbinden werden ausstehende Aenderungen an das Backend gesendet.
- Offline-Indikator in der App-Leiste und Update-Hinweis via `SwUpdate`.
- Installation auf Android und iOS auf echten Geraeten testen.

## Akzeptanzkriterien

- [ ] Die App laesst sich als PWA installieren (Manifest + Service Worker aktiv).
- [ ] Bereits geladene Plaene, Gerichte und Einkaufslisten sind offline sichtbar.
- [ ] Ein Abhaken der Einkaufsliste offline wird per Outbox nachtraeglich synchronisiert.
- [ ] Ein Offline-Indikator und ein Update-Hinweis sind sichtbar.
