// Uso: node scripts/generate-images.js
import { readdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

const FOLDER     = './media/Imagenes';
const OUTPUT     = './js/images.js';
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const files = readdirSync(FOLDER)
    .filter(f => EXTENSIONS.includes(extname(f).toLowerCase()))
    .sort();

const content = `// Generado automáticamente — no editar a mano
// Para actualizar: node scripts/generate-images.js
export const IMAGES = ${JSON.stringify(files, null, 2)};
`;

writeFileSync(OUTPUT, content);
console.log(`✓ ${files.length} imágenes escritas en ${OUTPUT}`);