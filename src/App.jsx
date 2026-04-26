import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Train, MapPin, Quote, Users, Brain, Mic, 
  Settings, Palette, Ship, Clock, CheckCircle2, ChevronDown, 
  X, HeartPulse, Sparkles, Star, CalendarDays, Phone, Menu,
  MessageCircle, Navigation, ChevronLeft, ChevronRight, Crown, ZoomIn
} from 'lucide-react';

// ==========================================
// 1. КОНФИГУРАЦИЯ ССЫЛОК НА ФОТОГРАФИИ
// ==========================================
const SITE_IMAGES = {
  hero: "/images/hero.webp",
  manifesto: "/images/brezhneva.png",
  leisure: {
    engineering: "/images/mechvarium.png",
    sea: "/images/sea.png",
    creative: "/images/creative.png",
    team: "/images/team.png"
  },
  comfortGallery: [
    "/images/base_1.png", 
    "/images/base_2.png", 
    "/images/base_3.png", 
    "/images/base_4.png"  
  ],
  photoGalleryFallback: [
    "/images/fallback_1.png",
    "/images/fallback_2.png",
    "/images/fallback_3.png",
    "/images/fallback_4.png",
    "/images/fallback_5.png"
  ]
};

// ==========================================
// 1.1 ГЛОБАЛЬНЫЕ НАСТРОЙКИ (МАГИЧЕСКИЕ КОНСТАНТЫ)
// ==========================================
const SITE_SETTINGS = {
  camp: {
    dates: "25 июля — 10 августа",
    ages: "12–17 лет",
    locationShort: "г. Новороссийск, пос. Широкая Балка",
    price: "115 000 ₽",
    spotsLeft: "4" // Количество оставшихся мест
  },
  contact: {
    phoneDisplay: "+7 (916) 601-41-18",
    phoneClean: "+79166014118",
    telegramUrl: "https://t.me/+79166014118"
  },
  ui: {
    colorTransitionDelay: "delay-[300ms]", 
    photoZoomScale: "hover:scale-125",     
    stickyNavThreshold: 50,                
    formSubmitTimeout: 1500                
  },
  // Настройки для отправки формы в Telegram
  api: {
    telegramBotToken: "8606617925:AAHD2-UjJ4eyBa9YLIxm_GJvEj99FZdJKrg", // Замените на токен от BotFather
    telegramChatId: "146327272"       // Замените на ваш ID или ID группы
  }
};

// ==========================================
// 1.2 НАВИГАЦИЯ ПО САЙТУ
// ==========================================
const NAV_LINKS = [
  { name: "Программа", href: "#program" },
  { name: "Локация", href: "#location" },
  { name: "Команда", href: "#team" },
  { name: "Отзывы", href: "#reviews" },
  { name: "Тариф", href: "#pricing" },
  { name: "FAQ", href: "#faq" }
];

// ==========================================
// 2. БАЗА ДАННЫХ (CONTENT LAYER)
// ==========================================
const SITE_CONTENT = {
  architecture: [
    { icon: Brain, title: "Работа над собой", desc: "В тренингах идет глубокая работа со страхами. Ребята учатся принимать себя, формируют экологичные личные границы, работают с доверием и понимают баланс «брать-давать».", highlight: false },
    { icon: Crown, title: "Лидерская школа", desc: "Ключевой фокус смены. Мы не читаем лекции, мы даем практиковать. Ежедневно ребята принимают решения, участвуют в командных играх, отстаивают точку зрения и извлекают пользу из провалов.", highlight: true },
    { icon: Mic, title: "Ораторское мастерство", desc: "Тренируем навыки публичности. Участники сами придумывают творческие вечера и ведут экскурсии, обучаясь привлекать и удерживать внимание сверстников!", highlight: false }
  ],
  leisure: [
    { icon: Settings, title: "Для инженеров — «Мехвариум»", desc: "Уникальный арт-квест от BrainMaster. Паяем, работаем с механикой. Каждый заберет домой уникального шагающего робо-монстра!" },
    { icon: Palette, title: "Для творцов — Арт-мастерские", desc: "Заземляемся через искусство. Танцевальные батлы, лепка, свечи и роспись по камню." },
    { icon: Ship, title: "Для исследователей — Экскурсии", desc: "Включена обзорная экскурсия по г. Новороссийск и увлекательная морская прогулка на катере!" }
  ],
  timeline: [
    { date: "25 июля", title: "Старт!", desc: "Садимся в наш собственный вагон. В пути горячее питание, а тренинги на знакомство начнутся прямо в купе!" },
    { date: "26 июля", title: "Прибытие", desc: "В 12:30 мы в Новороссийске. В 14:00 — вкусный горячий обед в пансионате." },
    { date: "27–31 июля", title: "Блок «Дружба»", desc: "Создаем надежную команду, стартуем в «Мехвариуме» и арт-студиях." },
    { date: "1–4 авг", title: "Блок «Выбор и Лидерство»", desc: "Экскурсия по городу, катание на катере, креативим на шоу." },
    { date: "5 авг", title: "Экватор и День стирки", desc: "Централизованно стираем все вещи в машинках — чемодан может быть легким!" },
    { date: "9 авг", title: "Гранд-финал", desc: "Вручение трофеев, прощальный костер на берегу и искренние слезы расставания." },
    { date: "10 авг", title: "Возвращение", desc: "Возвращение на Казанский вокзал. Встреча с повзрослевшим, уверенным в себе человеком!" },
    { date: "Середина сентября", title: "Арбузник", desc: "Долгожданная встреча после экспедиции в Москве. Вспоминаем лучшие моменты, делимся успехами и едим арбузы!" }
  ],
  schedule: [
    { time: "08:30 – 09:30", act: "Мягкий подъем (будят не вожатые с рупором, а бережная дежурная бригада из ребят)." },
    { time: "09:30 – 11:30", act: "Море! С заботой о каждом: уставшие от солнца уходят в 11:00, остальные в 11:30." },
    { time: "11:30 – 13:30", act: "Командные тренинги с наставником-психологом." },
    { time: "14:00 – 15:30", act: "Сиеста. Мягкая (настолки) или Глубокая (сон). Мы уважаем биоритмы каждого ребенка." },
    { time: "16:00 – 19:00", act: "Актив-досуг: Мехвариум, мастер-классы, спорт или подготовка к выступлениям." },
    { time: "19:00 – 21:00", act: "Ужин (забираем полдник: сок, выпечку) и Совет Бригадиров." },
    { time: "21:00 – 22:30", act: "Вечерний вайб: поэзия, театр, дискотека или гитара." },
    { time: "22:30", act: "Жесткий отбой (свет выключен, все в комнатах)." }
  ],
  features: [
    { title: "Наш собственный этаж", desc: "Мы выкупаем весь этаж. Никаких посторонних. Раздельные крылья для мальчиков и девочек." },
    { title: "Домашний быт", desc: "Комнаты 2-4 чел. Только одноярусные кровати! Свои тумбочки, общий шкаф. Белье меняется раз в неделю." },
    { title: "Свежие удобства", desc: "Раздельные санузлы и душевые для мальчиков и девочек расположены прямо на этаже. Поддерживаем идеальную чистоту — уборка проводится дважды в день." },
    { title: "Кухня и Чайхана 24/7", desc: "4-разовое питание (со свежими фруктами). В холле круглосуточно работает уютная «чайхана»." },
    { title: "Безопасность на воде", desc: "Свой галечный пляж. Купаемся группами по 10 чел. Инструкторы работают живыми «ограничителями глубины»." },
    { title: "Медицина 24/7", desc: "Дежурный врач 24/7. Все инструкторы обучены первой помощи, аптечки всегда под рукой." }
  ],
  // Легкое добавление новых руководителей: просто добавьте новый объект в массив
  team: [
    { 
      name: "Елена Брежнева", 
      role: "Директор и основатель центра", 
      img: "/images/elena_b.png", 
      desc: "Опыт работы более 15 лет. Квалифицированный психолог, психотерапевт в области системной семейной терапии, автор методики «Круги судьбы», ведущая тренингов. Логопед, олигофренопедагог, педагог." 
    },
    { 
      name: "Елена Ткаченко", 
      role: "Руководитель и инструктор", 
      img: "/images/elena_t.png", 
      desc: "Опыт работы с детьми более 25 лет. Организатор подросткового сегмента тренингов центра «Солнечный круг». Психолог, психотерапевт в области системной семейной терапии, опытная ведущая тренинговых программ." 
    },
    { 
      name: "Ирина Локтеева", 
      role: "Руководитель подросткового тренинга", 
      img: "/images/irina_l.png", 
      desc: "Опыт работы более 5 лет. Руководитель программ «Чудо-Остров» и «Экспедиция». Ведущая тренинговых групп в центре «Пазл» и куратор «Школы Юного Психолога»." 
    },
    { 
      name: "Артём Ткаченко", 
      role: "Руководитель в проекте «Экспедиция»", 
      img: "/images/artem_t.png", 
      desc: "Опыт работы более 10 лет. Основатель команды BrainMaster и «Школы Молодого IT-Инженера». Выступает в роли тренера ИТ-инженерной сборной по подготовке к техническим Олимпиадам." 
    }
  ],
  reviews: [
    { name: "Маргарита Маликова", role: "Мама подростка", text: "Я хочу выразить огромную благодарность организаторам и руководителям... Экспедиция не просто предоставила ему шанс отдохнуть и повеселиться, но также позволила обрести самостоятельность, прокачать навык лидерства, общению и работе в команде. Сын смог лучше понять себя и свои границы... появилась спокойная уверенность в себе." },
    { name: "Галина Р.", role: "Мама", text: "Идеальное место для подростка, где ему помогут разобраться со своими маленькими, ну и возможно большими проблемами, которые не всегда можно обсудить с родителями. Ну и конечно летние экспедиции — эмоции не отпускают и через полгода после поездки." },
    { name: "Екатерина", role: "Участник, 14 лет", text: "Для меня экспедиция - это что-то невероятно крутое... В экспе я смогла отдохнуть от ссор с семьёй, токсичного окружения, учёбы... и погрузится в дружескую, тёплую, совсем другую атмосферу. Я смогла научиться работать в команде, отстаивать свои границы, правильно проявлять себя, уважать и лучше понимать других." },
    { name: "Лина", role: "Участник, 17 лет", text: "Экспедиция - это не только путешествие к морю и теплу, но также путешествие внутрь себя... В экспедиции ты можешь чувствовать себя свободно и не бояться падения, потому что всегда найдется человек, который тебя поддержит и поможет собраться с силами. Это пространство, где я была самой собой, не опасаясь осуждения." },
    { name: "Никита Бакиров", role: "Участник, 16 лет", text: "Интересные и глубокие тренинги помогли мне лучше понять себя и других, а также задуматься о важных вещах. Для меня важнейшая часть экспедиции - это люди. В этом месте я познакомился и укрепил связи со многими своими друзьями... Экспедиция - это место, откуда не хочется возвращаться." },
    { name: "Анна Новикова", role: "Участница", text: "Экспедиция для меня - это чувство жизни, нигде так я её не чувствую. Важны для меня глубокие психологические игры - иногда они срывают пласт защит, видишь себя и других в более подлинном свете. Экспедиция - это не просто новые друзья, это совсем другая глубина отношений... Невероятно красиво видеть, как проявляется каждая личность." },
    { name: "Илья Власов", role: "Участник", text: "Экспедиция — это не просто поездка на море, это классные люди с которыми приятно общаться, это очень глубокие тренинги, каждую экспедицию я очень сильно жду и очень люблю ее." },
    { name: "Майя Курбанова", role: "Участник, 14 лет", text: "Для меня экспедиция - место, где не нужно переживать из-за разных мелочей, ведь ты полностью погружен в различные тренинги и работу над собой. От экспедиции у меня остались лишь самые теплые и душевные чувства, и я буду ездить со всеми каждое лето." },
    { name: "Юлия Яброва", role: "Участница", text: "Было классно, когда мы ходили на море каждое утро и играли в мафию, были классные дискотеки, тренинги. Я очень хочу снова поехать в экспедицию и ощутить те же эмоции, что и в прошлый раз)" },
    { name: "Александр", role: "Выпускник, 20 лет", text: "Невероятное место, наверное, лучшее где мне доводилось быть. Я отлично провел время в кругу друзей, новых знакомых и конечно же прекрасных руководителей! Программа не давала скучать... и все это приправлено замечательной атмосферой))" }
  ],
  pricingIncludes: [
    "ЖД трансфер: Билеты туда-обратно в нашем собственном вагоне (с горячим питанием от РЖД).",
    "Проживание и быт: 16 дней на базе, 4-разовое питание + «чайхана», централизованная стирка вещей.",
    "Программа: Глубокие тренинги, экскурсии по городу и на катере.",
    "Материалы: Работа с качественными ЧПУ-деталями в «Мехвариуме» и расходники для арт-мастерских."
  ]
};

// ==========================================
// 3. КАСТОМНЫЕ ХУКИ (LOGIC LAYER)
// ==========================================
const useHorizontalScroll = (desktopScrollAmount, mobileScrollAmount) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? desktopScrollAmount : mobileScrollAmount;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };
  return { scrollRef, scroll };
};

const useStickyNavbar = (threshold) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);
  return isScrolled;
};

// ==========================================
// 4. ПЕРЕИСПОЛЬЗУЕМЫЕ UI КОМПОНЕНТЫ (UI LAYER)
// ==========================================

// 🚀 УМНАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ С ПОДДЕРЖКОЙ LQIP
const ProgressiveImage = ({ src, lowResSrc, alt, containerClassName = "", imgClassName = "", children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-800 ${containerClassName}`}>
      {/* Если есть LQIP - показываем размытую миниатюру. Иначе серый скелетон */}
      {!isLoaded && lowResSrc && (
        <img src={lowResSrc} alt="" className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 z-0" />
      )}
      {!isLoaded && !lowResSrc && (
        <div className="absolute inset-0 bg-slate-700 animate-pulse z-0" />
      )}
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-700 z-10 relative ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
      {children && <div className="absolute inset-0 z-20 pointer-events-none">{children}</div>}
    </div>
  );
};

// 🌟 МОДАЛЬНОЕ ОКНО ЛАЙТБОКСА (Просмотр фото)
const Lightbox = ({ photos, initialIndex, onClose }) => {
  const [idx, setIdx] = useState(initialIndex);

  // Блокируем скролл страницы, пока открыт Лайтбокс, и слушаем клавиатуру
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((prev) => (prev + 1) % photos.length);
      if (e.key === 'ArrowLeft') setIdx((prev) => (prev - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photos.length, onClose]);

  const currentPhoto = photos[idx];
  const hdSrc = typeof currentPhoto === 'string' ? currentPhoto : currentPhoto.hd;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white z-50 p-2 transition">
        <X className="w-8 h-8"/>
      </button>
      
      <button onClick={(e) => { e.stopPropagation(); setIdx((prev) => (prev - 1 + photos.length) % photos.length); }} className="absolute left-2 md:left-8 text-white/50 hover:text-white z-50 p-2 transition">
        <ChevronLeft className="w-10 h-10"/>
      </button>
      
      <button onClick={(e) => { e.stopPropagation(); setIdx((prev) => (prev + 1) % photos.length); }} className="absolute right-2 md:right-8 text-white/50 hover:text-white z-50 p-2 transition">
        <ChevronRight className="w-10 h-10"/>
      </button>

      {/* Свайп-изображение (Framer Motion) */}
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={hdSrc}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x < -50) setIdx((prev) => (prev + 1) % photos.length);
            else if (offset.x > 50) setIdx((prev) => (prev - 1 + photos.length) % photos.length);
          }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-[90vw] max-h-[85vh] object-contain cursor-grab active:cursor-grabbing shadow-2xl"
        />
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-medium tracking-widest text-sm">
        {idx + 1} / {photos.length}
      </div>
    </div>
  );
};

const SliderControls = ({ onScrollLeft, onScrollRight, darkTheme = false }) => {
  const baseClasses = "p-3 rounded-full transition shadow-md border";
  const lightClasses = "bg-slate-50 text-slate-600 hover:bg-orange-100 hover:text-orange-600 border-slate-200";
  const darkClasses = "bg-slate-800 text-slate-300 hover:bg-orange-500 hover:text-white border-slate-700 shadow-lg";
  
  return (
    <div className="hidden md:flex gap-3 absolute right-0 bottom-0 z-10">
      <button onClick={onScrollLeft} className={`${baseClasses} ${darkTheme ? darkClasses : lightClasses}`} aria-label="Прокрутить влево">
          <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={onScrollRight} className={`${baseClasses} ${darkTheme ? darkClasses : lightClasses}`} aria-label="Прокрутить вправо">
          <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

const FloatingButtons = () => {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { phoneDisplay, phoneClean, telegramUrl } = SITE_SETTINGS.contact;

  const handlePhoneClick = (e) => {
    if (window.innerWidth > 768) {
      e.preventDefault();
      setShowPhoneModal(true);
    }
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(phoneDisplay);
    } catch (e) {
      const textArea = document.createElement("textarea");
      textArea.value = phoneDisplay;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setShowPhoneModal(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        <a href={telegramUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#27A5E7] hover:bg-[#1f87c0] text-white p-3 md:px-5 md:py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <MessageCircle className="w-6 h-6" />
          <span className="hidden md:inline font-medium text-sm">Написать в Telegram</span>
        </a>
        <a href={`tel:${phoneClean}`} onClick={handlePhoneClick} className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-3 md:px-5 md:py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <Phone className="w-6 h-6" />
          <span className="hidden md:inline font-medium text-sm">Позвонить организатору</span>
        </a>
      </div>

      <AnimatePresence>
        {showPhoneModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPhoneModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative p-8 text-center"
            >
              <button onClick={() => setShowPhoneModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1 transition" aria-label="Закрыть">
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-['Montserrat']">Связаться с нами</h3>
              <p className="text-slate-500 mb-6 text-sm">Сохраните номер организатора, чтобы задать вопросы в любое удобное время.</p>
              
              <div className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight bg-slate-50 py-4 rounded-2xl border border-slate-100">
                {phoneDisplay}
              </div>
              
              <button 
                onClick={copyToClipboard} 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                Скопировать номер
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================
// 5. СЕКЦИИ СТРАНИЦЫ
// ==========================================
const Hero = ({ onOpenModal }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-slate-900">
    <div className="absolute inset-0 z-0">
      <ProgressiveImage 
        src={SITE_IMAGES.hero} 
        alt="Подростки у костра" 
        containerClassName="w-full h-full bg-slate-900" 
        imgClassName="w-full h-full object-cover" 
      />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center h-full">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl flex flex-col items-center">
        <p className="text-orange-400 font-medium tracking-wide uppercase mb-4 text-sm md:text-base mt-8 md:mt-0">
          Психологический центр «Солнечный круг» и школа «BrainMaster» представляют
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-4 font-['Montserrat'] tracking-tight">
          ЭКСПЕДИЦИЯ <span className="text-orange-400 font-light">2026</span>
        </h1>
        <h2 className="text-xl md:text-3xl font-medium text-slate-200 mb-8 font-['Montserrat'] max-w-4xl mx-auto">
          Шаг в самостоятельность и территория твоих людей
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 rounded-full text-white text-sm md:text-base font-bold shadow-lg shadow-orange-500/30 transform hover:scale-105 transition cursor-default">
            <Crown className="w-5 h-5" /> Лидерская школа
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full text-slate-100 text-sm md:text-base font-medium shadow-sm">
            <CalendarDays className="w-5 h-5 text-orange-400" /> {SITE_SETTINGS.camp.dates}
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-slate-200 text-sm md:text-base font-medium shadow-sm">
            <Users className="w-5 h-5 text-orange-400" /> {SITE_SETTINGS.camp.ages}
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-slate-200 text-sm md:text-base font-medium shadow-sm">
            <MapPin className="w-5 h-5 text-orange-400" /> {SITE_SETTINGS.camp.locationShort}
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-slate-200 text-sm md:text-base font-medium shadow-sm">
            <Train className="w-5 h-5 text-orange-400" /> Выезд из Москвы
          </div>
        </div>

        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed">
          Уникальное летнее приключение, где подростки отдыхают от гаджетов, находят настоящих друзей и учатся самостоятельности. Бережная атмосфера, поддержка опытных наставников и продуманный до мелочей отдых.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onOpenModal}
          className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg overflow-hidden group"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
          <span className="relative">Хочу в Экспедицию!</span>
          <span className="absolute flex h-full w-full inset-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-20"></span>
          </span>
        </motion.button>
        <p className="mt-4 text-sm text-slate-400 italic mb-16 md:mb-24">
          * Места строго ограничены площадью нашего этажа
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto mt-auto">
          {[
            { icon: Star, text: "20 лет истории проекта" },
            { icon: Train, text: "Наш вагон в прямом поезде из Москвы!" },
            { icon: ShieldCheck, text: "Весь этаж корпуса у моря — только наш!" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-4 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md border border-white/10 p-5 rounded-2xl text-left">
              <item.icon className="w-10 h-10 text-orange-400 flex-shrink-0" />
              <span className="text-white text-sm md:text-base font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

const Manifesto = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-['Montserrat']">Слово создателя</h2>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-12">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full md:w-5/12">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-200 rounded-2xl transform translate-x-4 translate-y-4"></div>
            <ProgressiveImage 
              src={SITE_IMAGES.manifesto} 
              alt="Елена Брежнева" 
              containerClassName="relative rounded-2xl shadow-xl w-full aspect-[4/5]" 
              imgClassName="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} className="w-full md:w-7/12">
          <Quote className="w-16 h-16 text-orange-400/30 mb-6" />
          <p className="text-xl text-slate-700 leading-relaxed italic mb-8">
            «Что такое "Экспедиция"? Это шаг в самостоятельность. Детская республика. Школа лидеров. Дружная команда. Здесь новые знакомства, экскурсии и отдых гармонично сочетаются с глубокими психологическими тренингами. "Экспедиция" — это место, где каждый ребенок становится частью чего-то большего, искреннего и настоящего».
          </p>
          <div>
            <p className="font-bold text-slate-900 text-lg">Елена Брежнева</p>
            <p className="text-slate-500">Директор и основатель центра «Солнечный круг»</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ProgramArchitecture = () => (
  <section id="program" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-['Montserrat']">Архитектура программы</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Обучение основано на индивидуальном подходе. Вся смена — это выверенный психологический маршрут, который делится на тематические блоки.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {SITE_CONTENT.architecture.map((card, idx) => (
          <motion.div
            key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} whileHover={{ y: -10 }}
            className={`p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border ${card.highlight ? 'bg-gradient-to-br from-orange-500 to-amber-500 border-orange-400 text-white md:-translate-y-4 shadow-orange-500/20' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${card.highlight ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-500'}`}>
              <card.icon className="w-8 h-8" />
            </div>
            <h3 className={`text-xl font-bold mb-4 ${card.highlight ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
            <p className={`leading-relaxed ${card.highlight ? 'text-orange-50' : 'text-slate-600'}`}>{card.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Leisure = () => (
  <section className="py-20 bg-slate-900 text-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat']">Активный досуг и «Мехвариум»</h2>
        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
          Глубокие психологические тренинги требуют качественной разрядки. Чтобы мозг отдохнул, мы продумали досуг на любой вкус!
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2">
          <div className="space-y-6">
            {SITE_CONTENT.leisure.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 bg-white/10 p-3 rounded-full h-fit"><item.icon className="w-6 h-6 text-orange-400" /></div>
                <div><h4 className="text-xl font-bold mb-2">{item.title}</h4><p className="text-slate-400">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="w-full lg:w-1/2 grid grid-cols-2 gap-4 relative">
          <div className="space-y-4">
            <ProgressiveImage 
              src={SITE_IMAGES.leisure.engineering} 
              alt="Инженерия" 
              containerClassName="rounded-2xl h-48 w-full group" 
              imgClassName="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            >
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-400 pointer-events-auto">#Инженерия</div>
            </ProgressiveImage>
            <ProgressiveImage 
              src={SITE_IMAGES.leisure.sea} 
              alt="Море" 
              containerClassName="rounded-2xl h-64 w-full group" 
              imgClassName="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            >
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-400 pointer-events-auto">#Море</div>
            </ProgressiveImage>
          </div>
          <div className="space-y-4 pt-8">
            <ProgressiveImage 
              src={SITE_IMAGES.leisure.creative} 
              alt="Творчество" 
              containerClassName="rounded-2xl h-64 w-full group" 
              imgClassName="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            >
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-400 pointer-events-auto">#Творчество</div>
            </ProgressiveImage>
            <ProgressiveImage 
              src={SITE_IMAGES.leisure.team} 
              alt="Дружба" 
              containerClassName="rounded-2xl h-48 w-full group" 
              imgClassName="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            >
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-400 pointer-events-auto">#Команда</div>
            </ProgressiveImage>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Timeline = () => (
  <section className="py-20 bg-slate-50">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16 font-['Montserrat']">Программа по дням</h2>
      <div className="relative ml-4 md:ml-12">
        <div className="absolute top-2 bottom-0 left-0 border-l-2 border-orange-200 z-0"></div>
        {SITE_CONTENT.timeline.map((ev, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="mb-8 pl-8 relative">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm z-10" />
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <span className="text-orange-500 font-bold text-sm mb-2 block">{ev.date}</span>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{ev.title}</h4>
              <p className="text-slate-600">{ev.desc}</p>
            </div>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="pl-8 relative mt-12 opacity-60">
          <div className="absolute left-0 -top-8 bottom-[10px] border-l-2 border-dashed border-orange-300 z-0"></div>
          <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-slate-300 border-2 border-white shadow-sm z-10" />
          <div className="pt-1"><p className="text-slate-500 font-medium italic">Лето 2027... Начало новой экспедиции</p></div>
        </motion.div>
      </div>
    </div>
  </section>
);

const DailyRoutine = () => (
  <section className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Clock className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-['Montserrat']">Режим дня</h2>
      </div>
      <div className="space-y-4">
        {SITE_CONTENT.schedule.map((item, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50 p-4 rounded-xl">
            <div className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-lg whitespace-nowrap min-w-[140px] text-center">{item.time}</div>
            <p className="text-slate-700 leading-relaxed">{item.act}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const LocationAndComfort = () => {
  return (
    <section id="location" className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat']">Локация и безопасность</h2>
          <p className="text-slate-300 max-w-2xl mx-auto flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-orange-400" /> {SITE_SETTINGS.camp.locationShort}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 shadow-sm mb-16">
          <div className="w-full lg:w-2/3 h-72 md:h-[400px] rounded-2xl overflow-hidden relative bg-slate-800">
            <iframe src="https://yandex.ru/map-widget/v1/?mode=search&text=Пансионат%20имени%20А.И.%20Майстренко%20Широкая%20Балка" className="w-full h-full border-0" loading="lazy" allowFullScreen={true} title="Карта базы"></iframe>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-3 text-white">ФГБУЗ "Пансионат им. А.И. Майстренко"</h3>
            <div className="inline-flex items-center gap-3 bg-blue-500/20 text-blue-200 p-4 rounded-xl mb-6 border border-blue-500/30 w-max">
              <Navigation className="w-5 h-5 text-blue-400" /> <span className="font-bold">Всего 181 метр до Чёрного моря</span>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
              <h4 className="font-bold mb-2 text-white flex items-center gap-2"><Train className="w-5 h-5 text-orange-500" /> Как добраться?</h4>
              <p className="text-sm text-slate-300 leading-relaxed">Трансфер (с горячим питанием от РЖД) из Москвы и обратно уже входит в стоимость путевки. Едем организованной группой в собственном вагоне!</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {SITE_CONTENT.features.map((feat, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
              <h4 className="text-xl font-bold mb-2">{feat.title}</h4>
              <p className="text-slate-400 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Галерея базы с 3D-поп-ап увеличением */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
          {SITE_IMAGES.comfortGallery.map((imgUrl, idx) => (
            <div 
              key={idx} 
              // Использование настройки zoom из SITE_SETTINGS
              className={`relative rounded-2xl h-48 w-full transition-all duration-500 z-10 hover:z-50 ${SITE_SETTINGS.ui.photoZoomScale} cursor-crosshair`}
            >
              <ProgressiveImage 
                src={imgUrl} 
                alt={`Фото базы ${idx + 1}`} 
                containerClassName="w-full h-full rounded-2xl shadow-sm hover:shadow-2xl transition-shadow duration-500" 
                imgClassName="w-full h-full object-cover rounded-2xl" 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Team = () => {
  const { scrollRef, scroll } = useHorizontalScroll(400, 300);

  return (
    <section id="team" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 flex justify-center items-center">
          <div className="text-center w-full max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-['Montserrat']">Команда наставников</h2>
            <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-900 px-6 py-3 rounded-full font-bold shadow-sm mb-4">
              <HeartPulse className="w-6 h-6 text-orange-500" /> Строго: 1 профессиональный наставник на 10 детей
            </div>
            <p className="text-slate-500 hidden md:block">Свайпайте или используйте стрелки для просмотра &rarr;</p>
          </div>
          <SliderControls onScrollLeft={() => scroll('left')} onScrollRight={() => scroll('right')} />
        </div>

        <div ref={scrollRef} className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {SITE_CONTENT.team.map((member, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="snap-start flex-none w-[85vw] sm:w-[350px] bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col">
              <ProgressiveImage 
                src={member.img} 
                alt={member.name} 
                containerClassName="h-64 flex-shrink-0" 
                // Подставляем задержку цвета из SITE_SETTINGS
                imgClassName={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 ${SITE_SETTINGS.ui.colorTransitionDelay}`} 
              />
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h4>
                <p className="text-slate-500 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-200 pt-3 flex-grow">{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 🌟 ДИНАМИЧЕСКАЯ ГАЛЕРЕЯ С СОХРАНЕНИЕМ ПРОПОРЦИЙ И ЛАЙТБОКСОМ
const PhotoGallery = () => {
  const { scrollRef, scroll } = useHorizontalScroll(600, 300);
  const [photos, setPhotos] = useState(SITE_IMAGES.photoGalleryFallback);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    fetch('/photos.json')
      .then(res => {
        if (!res.ok) throw new Error("JSON не найден");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPhotos(data);
        }
      })
      .catch(err => {
        console.log("ℹ️ Динамическая галерея не найдена, используем базовые фотографии.");
      });
  }, []);

  return (
    <>
      <section className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-12 flex justify-center items-center">
            <div className="text-center w-full max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat']">Атмосфера Экспедиции</h2>
              <p className="text-slate-400">Нажмите на фото, чтобы открыть на весь экран</p>
            </div>
            <SliderControls darkTheme onScrollLeft={() => scroll('left')} onScrollRight={() => scroll('right')} />
          </div>
          
          <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {photos.map((img, idx) => {
              const hdSrc = typeof img === 'string' ? img : img.hd;
              const lqSrc = typeof img === 'string' ? null : img.lqip;
              
              return (
                <div 
                  key={idx} 
                  className="snap-center flex-none h-[300px] md:h-[400px] w-auto relative rounded-2xl overflow-hidden cursor-pointer group border border-white/10"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <ProgressiveImage 
                    src={hdSrc} 
                    lowResSrc={lqSrc}
                    alt={`Атмосфера ${idx + 1}`} 
                    containerClassName="h-full w-full flex bg-slate-950" 
                    imgClassName="h-full w-auto max-w-none object-contain transform group-hover:scale-[1.03] transition duration-700"
                  >
                    {/* Иконка "увеличить" при наведении */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition duration-300 flex items-center justify-center pointer-events-none">
                      <div className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-md rounded-full p-4 transition duration-300 transform scale-50 group-hover:scale-100">
                        <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </ProgressiveImage>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Модальное окно просмотра (Lightbox) */}
      {lightboxIndex !== null && (
        <Lightbox 
          photos={photos} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </>
  );
};

const Reviews = () => {
  const { scrollRef, scroll } = useHorizontalScroll(420, 300);

  return (
    <section id="reviews" className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 flex justify-center items-center">
          <div className="text-center w-full max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-['Montserrat']">Отзывы участников и родителей</h2>
            <p className="text-slate-500">Голос наших клиентов — лучшее доказательство качества</p>
          </div>
          <SliderControls onScrollLeft={() => scroll('left')} onScrollRight={() => scroll('right')} />
        </div>
        
        <div ref={scrollRef} className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {SITE_CONTENT.reviews.map((rev, idx) => (
            <div key={idx} className="snap-start flex-none w-[85vw] sm:w-[400px] flex flex-col h-full py-4">
              <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-orange-200 flex flex-col h-full relative overflow-hidden group">
                <Quote className="absolute -top-4 -right-4 w-32 h-32 text-slate-50 transform rotate-12 group-hover:text-orange-50/50 transition-colors duration-500 z-0 pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <Quote className="w-10 h-10 text-orange-400 mb-6 flex-shrink-0 drop-shadow-sm" />
                  <p className="text-slate-700 italic leading-relaxed mb-8 flex-grow md:text-lg font-medium">«{rev.text}»</p>
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100 group-hover:border-orange-100 transition-colors">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                      {rev.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">{rev.name}</h4>
                      <p className="text-sm text-slate-500 font-medium">{rev.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onOpenModal }) => (
  <section id="pricing" className="py-20 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-['Montserrat']">Тариф участия</h2>
        <p className="text-slate-400">Лучшая инвестиция в развитие</p>
      </div>
      
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-5/12 text-center md:text-left">
          <div className="text-5xl font-extrabold text-orange-400 mb-8">{SITE_SETTINGS.camp.price}</div>
          <button onClick={onOpenModal} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-full transition duration-300 shadow-lg hover:shadow-orange-500/50 transform hover:-translate-y-1 mb-4">
            Оставить заявку
          </button>
          <p className="text-sm text-slate-400 animate-pulse text-center">Осталось {SITE_SETTINGS.camp.spotsLeft} места</p>
        </div>

        <div className="w-full md:w-7/12">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Sparkles className="text-orange-400" /> Уже включено в стоимость:</h3>
          <ul className="space-y-4">
            {SITE_CONTENT.pricingIncludes.map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-6 italic">* Оплачивается отдельно (по желанию): карманные деньги на буфет и аппаратная медицина пансионата (массаж, криосауна).</p>
        </div>
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    { 
      q: "Какие документы понадобятся?", 
      a: (
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Оригинал паспорта / свидетельства о рождении</li>
          <li>Ксерокопия полиса ОМС (с двух сторон)</li>
          <li>Справка из школы (необходима для получения скидки РЖД)</li>
          <li>Медицинская справка по форме 079/у</li>
          <li>Справка из СЭС об отсутствии контактов с инфекционными больными (берется строго за 3 дня до выезда)</li>
        </ul>
      ) 
    },
    { q: "Забираете ли вы телефоны?", a: "Жизнь настолько насыщена, что ребятам некогда сидеть в гаджетах. Вечером мы буквально напоминаем им: «Позвоните родителям!». Это естественный цифровой детокс." },
    { q: "А если мой ребенок аллергик?", a: "Повара готовят по-домашнему и предложат альтернативу (исключат аллергены)." },
    { q: "Как узнать, что всё хорошо?", a: "Для родителей работает закрытый чат с ежедневными фото-отчетами с пляжа, тренингов и вечерних шоу. Вы увидите, как счастлив ваш ребенок!" },
    { q: "Можно ли оплатить частями?", a: "Да, место бронируется после внесения аванса, а остаток можно выплатить комфортными частями до отъезда." }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12 font-['Montserrat']">Ответы на частые вопросы</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none" aria-expanded={openIdx === idx}>
                <span className="font-bold text-slate-900 text-lg pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-6 pb-4 text-slate-600 border-t border-slate-100 pt-4">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 6. ГЛАВНЫЙ КОМПОНЕНТ APP
// ==========================================
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formState, setFormState] = useState('idle'); // idle, loading, success, error
  
  // Состояние для хранения данных формы
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    childName: '',
    childAge: ''
  });

  const isScrolled = useStickyNavbar(SITE_SETTINGS.ui.stickyNavThreshold);

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Логика отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');

    const { telegramBotToken, telegramChatId } = SITE_SETTINGS.api;

    // Если токены не настроены, просто симулируем успешную отправку (для тестов)
    if (telegramBotToken === "ВАШ_ТОКЕН_БОТА" || telegramChatId === "ВАШ_CHAT_ID") {
      console.warn("⚠️ Токены Telegram не настроены. Имитация отправки.");
      setTimeout(() => setFormState('success'), SITE_SETTINGS.ui.formSubmitTimeout);
      return;
    }

    // Формируем красивое сообщение для Telegram
    const message = `
🔥 <b>Новая заявка на Экспедицию!</b>
    
👤 <b>Родитель:</b> ${formData.parentName}
📞 <b>Телефон:</b> ${formData.phone}
👦 <b>Ребенок:</b> ${formData.childName} (${formData.childAge} лет)
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'HTML' // Позволяет использовать жирный текст
        })
      });

      if (response.ok) {
        setFormState('success');
        // Очищаем форму после успешной отправки
        setFormData({ parentName: '', phone: '', childName: '', childAge: '' });
      } else {
        setFormState('error');
      }
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setFormState('error');
    }
  };

  return (
    <div className="font-sans text-slate-900 antialiased selection:bg-orange-200">
      
      {/* Навигационная панель */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          <a href="#hero" className="text-white font-black text-xl tracking-wider font-['Montserrat'] flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">Э</span>
            ЭКСПЕДИЦИЯ <span className="text-orange-400 font-light">2026</span>
          </a>

          {/* Десктопное меню */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/90">
            {NAV_LINKS.map(link => (
              <a key={link.name} href={link.href} className="hover:text-orange-400 transition-colors">
                {link.name}
              </a>
            ))}
          </nav>

          <button onClick={() => setIsModalOpen(true)} className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full font-medium transition backdrop-blur-sm border border-white/10">
            Забронировать путевку
          </button>
          
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white p-2" aria-label="Открыть меню">
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Мобильное полноэкранное меню */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-lg flex flex-col justify-center items-center gap-8"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white p-2">
              <X className="w-10 h-10" />
            </button>
            {NAV_LINKS.map(link => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-3xl font-bold text-white hover:text-orange-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }}
              className="mt-8 bg-orange-500 text-white text-xl font-bold py-4 px-10 rounded-full"
            >
              Оставить заявку
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingButtons />

      <main>
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <Manifesto />
        <ProgramArchitecture />
        <Leisure />
        <Timeline />
        <DailyRoutine />
        <LocationAndComfort />
        <Team />
        <PhotoGallery />
        <Reviews />
        <Pricing onOpenModal={() => setIsModalOpen(true)} />
        <FAQ />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-white text-2xl font-bold mb-6 font-['Montserrat']">ЭКСПЕДИЦИЯ 2026</h2>
          <div className="flex justify-center gap-6 mb-8">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {SITE_SETTINGS.contact.phoneDisplay}</span>
          </div>
          <p className="text-sm">© 2026 Центр «Солнечный круг» & Школа «BrainMaster». Все права защищены.</p>
        </div>
      </footer>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
              <button onClick={() => { setIsModalOpen(false); setFormState('idle'); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1 transition" aria-label="Закрыть">
                <X className="w-5 h-5" />
              </button>
              <div className="p-8">
                {formState === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-8 h-8" /></div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка принята!</h3>
                    <p className="text-slate-600 mb-6">Мы свяжемся с вами в ближайшее время. А пока приглашаем в наш Telegram-канал.</p>
                    <a href={SITE_SETTINGS.contact.telegramUrl} target="_blank" rel="noreferrer" className="block w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition text-center">
                      Перейти в Telegram
                    </a>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 font-['Montserrat']">Оставить заявку</h3>
                    <p className="text-slate-500 mb-6 text-sm">Забронируйте место в лагере для вашего ребенка.</p>
                    
                    {formState === 'error' && (
                      <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ваше имя</label>
                        <input 
                          required 
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          type="text" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" 
                          placeholder="Иван Иванов" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                        <input 
                          required 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          type="tel" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" 
                          placeholder="+7 (___) ___-__-__" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Имя ребенка</label>
                          <input 
                            required 
                            name="childName"
                            value={formData.childName}
                            onChange={handleChange}
                            type="text" 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition" 
                            placeholder="Алексей" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Возраст</label>
                          <select 
                            required 
                            name="childAge"
                            value={formData.childAge}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition appearance-none"
                          >
                            <option value="">Выберите</option>
                            {[12,13,14,15,16,17].map(age => <option key={age} value={age}>{age} лет</option>)}
                          </select>
                        </div>
                      </div>
                      <button type="submit" disabled={formState === 'loading'} className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-400 transition mt-4 flex justify-center items-center gap-2">
                        {formState === 'loading' ? (
                          <span className="flex items-center gap-2">Отправка... <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>
                        ) : "Забронировать путевку"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}