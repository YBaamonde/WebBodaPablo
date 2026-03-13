// Uso: node scripts/rename-images.js
import { readdirSync, renameSync, readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';

const FOLDER     = './media/Imagenes';
const IMAGES_JS  = './js/images.js';
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Lee el images.js actual para conservar position y zoom
const current = readFileSync(IMAGES_JS, 'utf8');
const oldEntries = eval(current.replace('export const IMAGES =', '').replace(';', '').trim());

// Construye un mapa de nombre original → { position, zoom }
const metaMap = {};
oldEntries.forEach(entry => {
    if (typeof entry === 'object') {
        metaMap[entry.file] = {
            position: entry.position,
            zoom:     entry.zoom,
        };
    }
});

// Lee y ordena los archivos de la carpeta
const files = readdirSync(FOLDER)
    .filter(f => EXTENSIONS.includes(extname(f).toLowerCase()))
    .sort();

// Renombra y construye el nuevo array
const newEntries = files.map((oldName, i) => {
    const ext     = extname(oldName).toLowerCase();
    const newName = `foto-${String(i + 1).padStart(2, '0')}${ext}`;

    if (oldName !== newName) {
        renameSync(`${FOLDER}/${oldName}`, `${FOLDER}/${newName}`);
        console.log(`  ${oldName}  →  ${newName}`);
    }

    const meta = metaMap[oldName] ?? {};
    if (meta.position || meta.zoom) {
        return {
            file:     newName,
            ...(meta.position && { position: meta.position }),
            ...(meta.zoom     && { zoom:     meta.zoom }),
        };
    }
    return newName;
});

// Escribe el nuevo images.js
const content = `// Generado automáticamente — no editar a mano
export const IMAGES = ${JSON.stringify(newEntries, null, 2)};
`;

writeFileSync(IMAGES_JS, content);
console.log(`\n✓ ${files.length} imágenes renombradas y images.js actualizado`);