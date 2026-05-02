import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Исходники (не в git): скопируйте сюда PNG/JPEG с теми же базовыми именами, что в `SITE_IMAGES` и портретах команды. */
const INPUT_DIR = path.join(__dirname, "../raw_photos/static");
const OUTPUT_DIR = path.join(__dirname, "../public/images");

const STATIC_MAX_WIDTH = 1280;
const PORTRAIT_MAX_WIDTH = 640;
const PORTRAIT_BASE_RE = /^(elena_|irina_|artem_)/i;
const WEBP_QUALITY = 80;

async function processOne(inputPath, baseName) {
  const maxW = PORTRAIT_BASE_RE.test(baseName)
    ? PORTRAIT_MAX_WIDTH
    : STATIC_MAX_WIDTH;
  const outPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

  await sharp(inputPath)
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);

  console.log(`OK: ${baseName}.webp (max ${maxW}px)`);
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    fs.mkdirSync(INPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INPUT_DIR);
  const valid = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  if (!valid.length) {
    console.log(`\nПапка пуста: ${INPUT_DIR}`);
    console.log(
      "Положите сюда исходники (jpg/png/webp) с именами как у картинок на сайте, например:",
    );
    console.log(
      "  brezhneva, mechvarium, sea, creative, team, base_1…base_4, fallback_1…fallback_5, elena_b, elena_t, irina_l, artem_t",
    );
    console.log("Затем снова: npm run optimize:static\n");
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const file of valid) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = file.replace(/\.[^/.]+$/, "");
    try {
      await processOne(inputPath, baseName);
    } catch (err) {
      console.error(`Ошибка: ${file}`, err);
    }
  }

  console.log(`\nГотово. Файлы: ${OUTPUT_DIR} (*.webp)\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
