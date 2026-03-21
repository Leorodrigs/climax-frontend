import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcImage = resolve(root, "public", "logo.png");
const outDir = resolve(root, "public", "icons");

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const sizes = [
  { file: "icon-192.png", size: 192, maskable: false },
  { file: "icon-512.png", size: 512, maskable: false },
  { file: "icon-512-maskable.png", size: 512, maskable: true },
];

for (const { file, size, maskable } of sizes) {
  const outPath = resolve(outDir, file);

  if (maskable) {
    const iconSize = Math.round(size * 0.8);
    const padding = Math.round(size * 0.1);
    const resized = await sharp(srcImage)
      .resize(iconSize, iconSize, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 12, g: 26, b: 46, alpha: 1 },
      },
    })
      .composite([{ input: resized, top: padding, left: padding }])
      .png()
      .toFile(outPath);
  } else {
    await sharp(srcImage)
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(outPath);
  }

  console.log("Gerado: public/icons/" + file);
}

console.log("Icones PWA gerados com sucesso!");
