import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const productsDir = path.join(rootDir, "public", "productos");
const dataFile = path.join(rootDir, "src", "data", "productos.js");

const exts = new Set([".png", ".jpg", ".jpeg", ".jfif", ".avif", ".webp"]);

const files = fs.readdirSync(productsDir);

let converted = 0;
for (const file of files) {
  const fullPath = path.join(productsDir, file);
  const stat = fs.statSync(fullPath);
  if (!stat.isFile()) continue;

  const ext = path.extname(file).toLowerCase();
  if (!exts.has(ext) || ext === ".webp") continue;

  const baseName = file.slice(0, -ext.length);
  const outPath = path.join(productsDir, `${baseName}.webp`);

  await sharp(fullPath)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 68, effort: 5 })
    .toFile(outPath);

  converted += 1;
}

let data = fs.readFileSync(dataFile, "utf8");

// Replace only final non-webp extensions in product image paths.
data = data.replace(
  /(imagen:\s*"\/productos\/[^"\n]+)\.(png|jpg|jpeg|jfif|avif)(")/gi,
  "$1.webp$3"
);

fs.writeFileSync(dataFile, data, "utf8");

console.log(`Converted images: ${converted}`);
console.log("Updated src/data/productos.js to use .webp");
