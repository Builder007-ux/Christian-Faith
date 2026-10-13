// Prüft data/content.json: Struktur, fehlende Sprachen und Prüfstatus.
// Aufruf: node scripts/check-content.mjs [sprache ...]
// Beispiel für später: node scripts/check-content.mjs de en ru bg el

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(here, '..', 'data', 'content.json'), 'utf8'));

const langs = process.argv.slice(2).length ? process.argv.slice(2) : ['de', 'en'];
let problems = 0;
let total = 0;
let unreviewed = 0;

function check(path, obj) {
  if (!obj || typeof obj !== 'object') return;
  total++;
  if (obj.status && obj.status !== 'approved') unreviewed++;
  if (obj.title || obj.name || obj.text) {
    for (const field of ['title', 'name', 'text', 'ref', 'translation', 'dates']) {
      const value = obj[field];
      if (value === undefined) continue;
      if (typeof value === 'string') continue;
      for (const l of langs) {
        if (!value[l]) {
          problems++;
          console.log(`fehlt: ${l} bei ${path}.${field}`);
        }
      }
    }
  }
}

function walk(path, node) {
  if (Array.isArray(node)) node.forEach((n, i) => walk(`${path}[${i}]`, n));
  else if (node && typeof node === 'object') {
    check(path, node);
    for (const [k, v] of Object.entries(node)) {
      if (k !== 'meta') walk(path ? `${path}.${k}` : k, v);
    }
  }
}

walk('', data);

console.log(`\nGeprüfte Einträge: ${total}`);
console.log(`Noch nicht freigegeben (status != approved): ${unreviewed}`);
console.log(`Fehlende Übersetzungen für [${langs.join(', ')}]: ${problems}`);
process.exitCode = problems ? 1 : 0;
