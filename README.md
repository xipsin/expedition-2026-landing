# Expedition 2026 Landing



Лендинг смены "Экспедиция 2026" на React + Vite.



## Отправка заявок (статический хостинг, без Node)



Форма отправляет **POST напрямую** в URL веб-приложения **Google Apps Script** (удобно для Timeweb Apps и любого статического хостинга).



В теле JSON передаются поля формы плюс `source` и `submittedAt`. Поле **`leadSecret`** уходит только если задано **`VITE_LEADS_SECRET`** (тогда его можно сверять в скрипте со свойством проекта).



### 1) Переменные окружения для Vite



Скопируйте `.env.example` в `.env` и задайте как минимум:



```bash

VITE_LEADS_WEBHOOK_URL=https://script.google.com/macros/s/ВАШ_ID/exec

```



По желанию:



```bash

VITE_LEADS_SECRET=ваш-секрет

```



Переменные с префиксом `VITE_` попадают в клиентский бандл при `npm run dev` и `npm run build`. **Не коммитьте** реальные значения в git.



На **Timeweb Apps** (только статика) добавьте те же переменные в настройках сборки/окружения CI так, чтобы они были доступны на шаге `npm run build`.



### 2) Google Apps Script: таблица и минимальный код



1. Привяжите проект к **Google Таблице**, создайте лист (например `Заявки`).

2. Задеплойте как **Веб-приложение** (выполнять от имени владельца, доступ **Все** или **Все, у кого есть ссылка**), скопируйте URL с `/exec` в `VITE_LEADS_WEBHOOK_URL`.

3. После каждого изменения кода сделайте **новое развёртывание** веб-приложения, если строки в таблице не появляются.



**Минимальный сценарий** (запись строки без проверки секрета, плюс `doOptions` для preflight с прод-домена и `doGet`, чтобы открытие ссылки в браузере не показывало «doGet not found»):



```javascript

function corsOutput(jsonText) {

  return ContentService.createTextOutput(jsonText).setMimeType(

    ContentService.MimeType.JSON,

  );

}



function doGet() {

  return ContentService.createTextOutput("OK").setMimeType(

    ContentService.MimeType.TEXT,

  );

}



function doOptions() {

  return ContentService.createTextOutput("").setMimeType(

    ContentService.MimeType.TEXT,

  );

}



function doPost(e) {

  try {

    if (!e || !e.postData || !e.postData.contents) {

      throw new Error("Пустое тело запроса");

    }

    var data = JSON.parse(e.postData.contents);



    var doc = SpreadsheetApp.getActiveSpreadsheet();

    var sheet = doc.getSheetByName("Заявки") || doc.getSheets()[0];

    sheet.appendRow([

      data.submittedAt || new Date().toISOString(),

      data.parentName || "",

      data.phone || "",

      data.childName || "",

      data.childAge || "",

      data.source || "",

    ]);



    return corsOutput(

      JSON.stringify({ status: "success", message: "OK" }),

    );

  } catch (err) {

    return corsOutput(

      JSON.stringify({ status: "error", message: String(err) }),

    );

  }

}

```



Открытие URL веб-приложения **в браузере одной строкой** — это запрос **GET**; без `doGet` Google покажет ошибку вида «doGet not found». На **POST из формы** это не влияет. Проверяйте заявку через форму или `Invoke-RestMethod` / `curl.exe` с `-Method Post`.



На **`npm run build`** браузер ходит **напрямую** на `script.google.com`; для `Content-Type: application/json` часто уходит **OPTIONS** (preflight). Обработчик **`doOptions`** в скрипте нужен, чтобы такой запрос не обрывался на проде. Если preflight всё равно падает, смотрите вкладку Network в DevTools (OPTIONS/POST и тело ответа).



#### Опционально: проверка секрета



Если задали `VITE_LEADS_SECRET` в `.env`: в редакторе GAS откройте **Проект → Настройки → свойства скрипта**, добавьте ключ `LEADS_SECRET` с тем же значением. В начале `doPost` после `JSON.parse`:



```javascript

var expected = PropertiesService.getScriptProperties().getProperty("LEADS_SECRET");

if (!expected || data.leadSecret !== expected) {

  return corsOutput(

    JSON.stringify({ status: "error", message: "Неверный секрет" }),

  );

}

```



### 3) Локальный запуск



```bash

npm install

npm run dev

```



После изменения `.env` перезапустите dev-сервер.



В режиме **`npm run dev`** запрос к Google уходит через прокси Vite на путь **`/api/leads-gas`** (см. [`vite.config.js`](vite.config.js)), чтобы обойти **CORS** с `localhost`. В **`npm run build`** форма обращается напрямую к `VITE_LEADS_WEBHOOK_URL`.



Сборка статики:



```bash

npm run build

```



Каталог `dist/` загружайте на хостинг.



## Изображения и вес страницы

### Статические картинки (`public/images`)

В коде указаны пути на **WebP** (`/images/*.webp`). Исходники кладите в **`raw_photos/static/`** (каталог в `.gitignore`, в репозиторий не попадает).

1. Скопируйте в `raw_photos/static/` файлы с теми же базовыми именами, что на сайте: `brezhneva`, `mechvarium`, `sea`, `creative`, `team`, `base_1`…`base_4`, `fallback_1`…`fallback_5`, `elena_b`, `elena_t`, `irina_l`, `artem_t` (расширение `.png` или `.jpg`).
2. Выполните `npm run optimize:static` — в `public/images/` появятся соответствующие `.webp` (портреты команды до **640px** по ширине, остальные до **1280px**).
3. Проверьте лендинг, закоммитьте обновлённые `public/images/*.webp`. Старые тяжёлые PNG в репозитории можно удалить.

**Обложка hero:** положите `hero.jpg` или `hero.png` в корень **`raw_photos/`** и запустите `npm run optimize:gallery` — скрипт галереи при включённом `PROCESS_HERO` в [`scripts/compress.js`](scripts/compress.js) обновит `public/images/hero.webp`.

### Галерея (`public/gallery`, `public/photos.json`)

Оригиналы фото — в **`raw_photos/gallery/`**. Параметры выхода (ширина HD, качество WebP, LQIP) задаются константами в начале [`scripts/compress.js`](scripts/compress.js). После изменения констант или состава фото выполните:

```bash
npm run optimize:gallery
```

и закоммитьте обновлённые `public/gallery/*` и `public/photos.json`.



## Опционально: Node (`server.mjs`) или `/api/lead`



Если когда-нибудь понадобится **не светить** webhook в бандле, можно поднять [`server.mjs`](server.mjs) (переменные `LEADS_WEBHOOK_URL` / `LEADS_FALLBACK_WEBHOOK_URL`) или serverless-обработчик [`api/lead.js`](api/lead.js) — логика вынесена в [`lib/lead-core.js`](lib/lead-core.js). Для чисто статического Timeweb Apps это не требуется.



## Проверка сценариев



### Успех



- Заполнить форму валидными данными.

- В таблице появилась новая строка, в ответе GAS `status: "success"`.



### Секрет (если включён)



- Временно испортить `VITE_LEADS_SECRET` или значение в свойствах скрипта — форма должна показать ошибку (ответ GAS с `status: "error"`).



### Неверный телефон / возраст



- Клиентская проверка до отправки; при ошибке форма не уходит в GAS.



## После смены скрипта или URL развёртывания



1. Обновите код в редакторе Apps Script и создайте **новое развёртывание** веб-приложения при необходимости.

2. Пропишите актуальный URL `/exec` в `VITE_LEADS_WEBHOOK_URL` в `.env` и в CI хостинга.

3. Выполните `npm run build` заново, чтобы в бандл попал новый адрес.

