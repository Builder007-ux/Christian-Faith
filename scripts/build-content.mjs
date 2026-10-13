// Schreibt data/content.json in js/content.js, damit die Seite auch per Doppelklick
// auf index.html funktioniert (ohne Webserver).
// Aufruf nach jeder Änderung an data/content.json: node scripts/build-content.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const json = readFileSync(join(root, 'data', 'content.json'), 'utf8');
JSON.parse(json); // bricht ab, wenn die JSON-Datei kaputt ist

const out = `// Automatisch erzeugt aus data/content.json – bitte dort bearbeiten.\nwindow.CONTENT_DATA = ${json.trim()};\n`;
writeFileSync(join(root, 'js', 'content.js'), out, 'utf8');
console.log('js/content.js geschrieben.');
