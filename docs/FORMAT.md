# Format für Kirchengeschichte (Ereignisse und Personen)

Ein Eintrag in `data/content.json` unter `history.timeline` (Ereignisse) oder `history.persons` (Personen) folgt diesem Aufbau. Jedes Textfeld hat `de` und `en`.

## Pflichtfelder
- `id`, `year` (Ereignisse) bzw. `dates` (Personen), `title` bzw. `name`
- `summary`: 1–2 Sätze, die auch allein stehen können (oben auf der Seite)
- `details`: 1–2 Sätze, die Einordnung
- `status`: immer `"review"` bis zur theologischen Prüfung
- `sources`: mindestens zwei Quellen, `{title, url}`. Bevorzugt Quellen, die tatsächlich abgerufen wurden.

## Abschnitte (`sections`)
Reihenfolge verbindlich:
1. **Hintergrund** (`text`, 2–4 Sätze): Warum geschah es?
2. **Ablauf** (`items`, Liste mit Datum voran): Was geschah, in Reihenfolge.
3. **Ergebnis** (`items`): Was wurde festgelegt oder bewirkt.
4. **Bedeutung heute** (`text`, 2–3 Sätze): Warum ist es wichtig? Umstrittene Deutungen als solche kennzeichnen.
5. Optional, eingeklappt (`deep: true`): Vertiefung, z. B. „Wer war dabei“, „Die Begriffe der Debatte“, „Die Beschlüsse im Einzelnen“, „Zitate aus der Quelle“.

Jeder Abschnitt hat `heading` (de/en) und entweder `text` oder `items`.

## Wörter (`glossary`)
- 4 bis 9 schwere Begriffe, die im Text vorkommen.
- Jeweils `term` (de/en) und `text` (de/en), ein Satz, allgemein verständlich.
- Wird rechts (breiter Bildschirm) bzw. unten (Handy) angezeigt.

## Bilder
- `image` (Pfad) und `imageCredit` (de/en) für Personen. Ohne bestätigte Lizenz kein Bild.
- Zweites Bild: `extraImage: {image, imageCredit}`.

## Sprache
- Ein Satz pro Gedanke, keine Verschachtelungen über drei Nebensätze.
- Bibelstellen als „Apostelgeschichte 2,1“ schreiben.
- Zahlen mit Quelle nennen, wo sie umstritten sind.
- Englisch ist eine echte Übersetzung, keine Kurzfassung.

## Prüfung
`node scripts/check-content.mjs de en` prüft Übersetzungen und meldet Einträge, die dem Format noch nicht folgen.
