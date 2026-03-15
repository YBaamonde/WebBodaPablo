// Uso: node scripts/remove-tildes.js
import { readFileSync, writeFileSync } from 'fs';

const INPUT  = './index.html';
const OUTPUT = './index.html'; // sobreescribe el mismo archivo

const REPLACEMENTS = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
    'ü': 'u', 'Ü': 'U',
    'ñ': 'n', 'Ñ': 'N',
    '¿': '', '¡': '',
};

let content = readFileSync(INPUT, 'utf8');

for (const [from, to] of Object.entries(REPLACEMENTS)) {
    content = content.replaceAll(from, to);
}

writeFileSync(OUTPUT, content);
console.log('✓ Tildes eliminadas de index.html');