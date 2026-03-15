import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';
import { extname, join, basename } from 'path';

const FOLDERS = [
    { input: './media/Imagenes', output: './media/Imagenes/compressed', width: 1920 },
    { input: './media/Dibujos',  output: './media/Dibujos/compressed',  width: 800  },
];

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

for (const { input, output, width } of FOLDERS) {
    mkdirSync(output, { recursive: true });

    const files = readdirSync(input)
        .filter(f => EXTENSIONS.includes(extname(f).toLowerCase()));

    for (const file of files) {
        const name    = basename(file, extname(file));
        const outPath = join(output, `${name}.webp`);

        await sharp(join(input, file))
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(outPath);

        console.log(`✓ ${file}`);
    }
}

console.log('\nListo. Archivos en media/*/compressed/');