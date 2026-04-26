import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================================================
// НАСТРОЙКИ СКРИПТА
// ============================================================================
// Установите true, если хотите перемешивать фотографии в случайном порядке.
// Установите false, если нужен строгий порядок (например, по алфавиту или номерам файлов).
const SHUFFLE_PHOTOS = true; 

// Настройки обложки (Hero)
const PROCESS_HERO = true; // Искать hero.jpg в корне папки raw_photos и обрабатывать его
const HERO_DARKEN_PERCENT = 70; // Процент затемнения (0 - без затемнения, 100 - полностью черное)
// ============================================================================

// В современных ES-модулях нет встроенной переменной __dirname, 
// поэтому мы создаем ее вручную для правильной работы путей:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Папка с тяжелыми исходниками ТОЛЬКО для галереи
const INPUT_DIR = path.join(__dirname, '../raw_photos/gallery');

// Папки для готовых легких фото и JSON файла (публичные)
const OUTPUT_DIR = path.join(__dirname, '../public/gallery');
const JSON_OUTPUT_FILE = path.join(__dirname, '../public/photos.json');

// 1. ПОДГОТОВКА: Создаем исходную папку, если ее еще нет
if (!fs.existsSync(INPUT_DIR)) {
  fs.mkdirSync(INPUT_DIR, { recursive: true });
  console.log(`📁 Создана папка ${INPUT_DIR}. Положите туда фото для галереи!`);
}

// 2. УМНАЯ ОЧИСТКА: Удаляем старую собранную галерею
// Это гарантирует, что удаленные из исходников фото пропадут и с сайта
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Функция для перемешивания массива (Алгоритм Фишера-Йетса)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function processImages() {
  const files = fs.readdirSync(INPUT_DIR);
  let count = 0;
  let galleryData = []; // Собираем массив объектов: { hd, lqip }

  // Фильтруем только картинки
  const validFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|webp|heic)$/i));
  console.log(`\n📸 Найдено фотографий для галереи: ${validFiles.length}\n`);

  for (const file of validFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    // Убираем старое расширение файла
    const baseFilename = file.replace(/\.[^/.]+$/, "");
    
    // Имена для новых файлов
    const hdFilename = baseFilename + '.webp';
    const lqipFilename = baseFilename + '-lqip.webp'; // Микро-копия для слабого интернета

    try {
      // ШАГ А: Создаем основную HD версию
      await sharp(inputPath)
        .resize({ width: 1400, withoutEnlargement: true }) // Большой размер для Lightbox, но не растягиваем мелкие
        .webp({ quality: 80 }) // Оптимальное качество для веба
        .toFile(path.join(OUTPUT_DIR, hdFilename));

      // ШАГ Б: Создаем LQIP (Крошечная размытая копия для слабого интернета)
      await sharp(inputPath)
        .resize({ width: 40 }) // Сжимаем до микроскопических 40 пикселей!
        .blur(4) // Сильно размываем
        .webp({ quality: 20 }) // Качество неважно, все равно размыто
        .toFile(path.join(OUTPUT_DIR, lqipFilename));
      
      console.log(`✅ Обработано: ${file}`);
      
      // Добавляем пути в массив для React (относительно папки public)
      galleryData.push({
        hd: `/gallery/${hdFilename}`,
        lqip: `/gallery/${lqipFilename}`
      });
      count++;
    } catch (error) {
      console.error(`❌ Ошибка при обработке файла ${file}:`, error);
    }
  }

  // Применяем перемешивание, если флаг включен
  if (SHUFFLE_PHOTOS) {
    galleryData = shuffleArray(galleryData);
    console.log(`\n🔀 Фотографии успешно перемешаны.`);
  }

  // 3. ГЕНЕРАЦИЯ JSON ДЛЯ REACT
  fs.writeFileSync(JSON_OUTPUT_FILE, JSON.stringify(galleryData, null, 2));

  // 4. ОБРАБОТКА И ЗАТЕМНЕНИЕ ОБЛОЖКИ (HERO)
  if (PROCESS_HERO) {
    const rawRootDir = path.join(__dirname, '../raw_photos');
    if (fs.existsSync(rawRootDir)) {
      const rawRootFiles = fs.readdirSync(rawRootDir);
      // Ищем файл, который начинается с "hero." (hero.jpg, hero.png и т.д.)
      const heroFile = rawRootFiles.find(file => file.match(/^hero\.(jpg|jpeg|png|webp)$/i));
      
      if (heroFile) {
        const heroInputPath = path.join(rawRootDir, heroFile);
        const heroOutputDir = path.join(__dirname, '../public/images');
        const heroOutputPath = path.join(heroOutputDir, 'hero.webp');
        
        if (!fs.existsSync(heroOutputDir)) {
          fs.mkdirSync(heroOutputDir, { recursive: true });
        }

        // Переводим проценты в множитель (50% затемнения = 0.5 яркости)
        const multiplier = Math.max(1 - (HERO_DARKEN_PERCENT / 100), 0);

        try {
          await sharp(heroInputPath)
            .resize({ width: 1920, withoutEnlargement: true })
            // Используем .linear() для честного математического затемнения пикселей
            .linear(multiplier)
            .webp({ quality: 85 })
            .toFile(heroOutputPath);
          
          console.log(`\n🌌 Обложка (${heroFile}) затемнена на ${HERO_DARKEN_PERCENT}% и сохранена как /images/hero.webp`);
        } catch (error) {
          console.error(`\n❌ Ошибка при обработке обложки:`, error);
        }
      } else {
        console.log(`\n⚠️ Файл обложки (например, hero.jpg) не найден в папке raw_photos.`);
      }
    }
  }

  console.log(`\n🎉 Сборка завершена!`);
  console.log(`📦 Обработано фотографий для галереи: ${count} (созданы HD и LQIP версии).`);
  console.log(`🔗 Файл photos.json успешно обновлен. Можно запускать сайт!`);
}

processImages();