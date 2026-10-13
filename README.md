# Christian Faith

Eine moderne, mehrsprachige Web-App zum Lernen und Praktizieren des christlichen Glaubens.
Start mit dem orthodoxen Teil, später folgt der katholische Teil.

Die App ist eine statische Website (HTML, CSS, JavaScript ohne Framework) und lässt sich
als PWA auf dem Handy installieren und offline nutzen.

## Starten

Einfach den Ordner entpacken und die Datei `index.html` mit einem Doppelklick im Browser öffnen.
Es ist kein Server, keine Installation und kein Terminal nötig.

Die Offline-Nutzung und die Installation als App auf dem Handy brauchen eine Online-Adresse
(siehe „Veröffentlichen“ unten).

## Inhalte ändern

1. Inhalte in `data/content.json` bearbeiten.
2. Einmal `node scripts/build-content.mjs` ausführen, damit `js/content.js` aktualisiert wird.
   Alternativ `js/content.js` nach dem Ändern neu erzeugen lassen. Das Skript prüft die JSON-Datei dabei gleich.

## Prüfen der Inhalte

```bash
node scripts/check-content.mjs            # Deutsch und Englisch
node scripts/check-content.mjs de en ru   # zusätzlich Russisch prüfen
```

Das Skript zeigt fehlende Übersetzungen und wie viele Einträge noch nicht freigegeben sind.
Dafür muss Node.js installiert sein (https://nodejs.org).

## Struktur

```
christian-faith/
├── index.html              Einstiegsseite
├── css/style.css           Design (hell/dunkel, responsiv)
├── js/i18n.js              Oberflächentexte je Sprache und Liste der Sprachen
├── js/app.js               Navigation, Ansichten, Theme, Sprachwechsel
├── data/content.json       Alle Inhalte (Bibel, Gebete, Geschichte)
├── scripts/check-content.mjs   Prüfung der Inhalte auf Vollständigkeit
├── sw.js                   Service Worker (Offline-Nutzung)
├── manifest.webmanifest    PWA-Einstellungen
└── icon.svg                App-Symbol
```

## Eine Sprache hinzufügen (z. B. Russisch)

1. In `js/i18n.js` einen Eintrag `{ code: 'ru', label: 'Русский', locale: 'ru-RU' }` in `LANGS` ergänzen
   und einen Block `ru: { … }` in `UI` mit denselben Schlüsseln wie `de` anlegen.
2. In `data/content.json` bei jedem Eintrag das Feld `"ru"` ergänzen (z. B. `"title": { "de": "…", "en": "…", "ru": "…" }`).
3. `node scripts/check-content.mjs de en ru` ausführen, bis keine Fehlzeile mehr erscheint.

Fehlt eine Übersetzung, fällt die App auf Englisch und dann auf Deutsch zurück.

## Inhalte und Prüfung

- Es werden nur kanonisierte Schriften und Texte veröffentlicht.
- Jeder Eintrag hat `"status": "review"` bis ein Theologe ihn freigibt. Danach `"approved"` setzen.
- Die Felder `review.reviewed_by` und `review.reviewed_on` in `meta` dokumentieren die Freigabe.
- Bibelübersetzungen: Lutherbibel 1912 und King James Version sind gemeinfrei. Für neuere Übersetzungen
  vorab die Nutzungsrechte klären.
- Der orthodoxe Psalmentext folgt der Septuaginta-Zählung (Psalm 22 = Psalm 23 in der üblichen Zählung).

## Roadmap

- [x] Bibel (Auszüge), Gebete, Kirchengeschichte, Kalender (Gregorianisch/Julianisch), Info
- [x] Deutsch und Englisch, hell/dunkel, PWA mit Offline-Nutzung
- [ ] Russisch, Bulgarisch, Griechisch
- [ ] Festordnung und Lesungen des Tages (Kirchenkalender)
- [ ] Gesänge mit Audio
- [ ] Gebetsregel mit Erinnerungen, Fastenplaner, Gewissenserforschung
- [ ] Glossar (Liturgie und Ikonographie)
- [ ] Katholischer Teil als eigene Inhaltsebene

## Veröffentlichen

Da es sich um statische Dateien handelt, eignen sich GitHub Pages, Netlify oder Cloudflare Pages.
HTTPS ist für die PWA-Funktionen (Installation und Offline-Nutzung) nötig; diese Dienste bieten es standardmäßig.

## Bibel (Altes Testament, Brenton-Septuaginta)

- Quelle: Brenton English Septuagint (1851), gemeinfrei. PDF von dbs.org, Textdaten in `data/bible/brenton-ot.json`.
- Nach Änderungen an `data/bible/brenton-ot.json` einmal `node scripts/build-bible.mjs` ausführen. Das erzeugt `js/bible-ot.js`.
- Kapitel mit `"status": "review"` haben noch Lücken in der Versnummerierung und werden in der App mit einem Hinweis angezeigt.
- Psalmen sind noch nicht vollständig nach Versen gegliedert.
- Die deuterokanonischen Bücher (Tobit, Judit, Sirach, Makkabäer u. a.) fehlen noch.
- Die deutsche Übersetzung folgt später; bis dahin zeigt die App deutsch die Auszüge aus `content.json`.
