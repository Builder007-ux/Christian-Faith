// Schreibt data/bible/brenton-ot.json in js/bible-ot.js, damit der Bibeltext
// auch per Doppelklick auf index.html geladen werden kann.
// Aufruf nach jeder Änderung an data/bible/brenton-ot.json: node scripts/build-bible.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = readFileSync(join(root, 'data', 'bible', 'brenton-ot.json'), 'utf8');
JSON.parse(json); // bricht ab, wenn die Datei kaputt ist

const out = `// Automatisch erzeugt aus data/bible/brenton-ot.json – bitte dort bearbeiten.\nwindow.BIBLE_OT = ${json.trim()};\n`;
writeFileSync(join(root, 'js', 'bible-ot.js'), out, 'utf8');
console.log('js/bible-ot.js geschrieben.');
