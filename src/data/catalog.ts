import type { Attempt, Course, CourseCategory, LeaderboardEntry, Progress, User } from '../types'
import { buildLessonsFromContent, subjectCourses } from './courseData'

type Locale = 'en' | 'ru' | 'uz'

type Localized<T> = Record<Locale, T>

type CourseSeed = {
  id: string
  category: CourseCategory
  level: Localized<string>
  title: Localized<string>
  description: Localized<string>
  tags: Localized<string[]>
}

type Template = {
  lessonTitle: string
  summary: string
  theory: string[]
  examples: string[]
  exercises: {
    prompt1: string
    hint1: string
    prompt2: string
    hint2: string
    prompt3: string
    hint3: string
  }
  quizTitle: string
  quiz: {
    q1Prompt: string
    q1Options: string[]
    q1Explanation: string
    q2Prompt: string
    q2Options: string[]
    q2Explanation: string
    q3Prompt: string
    q3Options: string[]
    q3Explanation: string
  }
  exam: {
    title: string
    typeLabel: Record<'mid-course' | 'final', string>
    q1Prompt: string
    q1Options: string[]
    q1Explanation: string
    q2Prompt: string
    q2Options: string[]
    q2Explanation: string
  }
}

const sourcePool = [
  'MDN Web Docs',
  'Khan Academy',
  'MIT OpenCourseWare',
  'Wikipedia (API)',
  'FreeCodeCamp',
]

const lessonThemes: Record<CourseCategory, Localized<string[]>> = {
  Programming: {
    en: [
      'Foundations & tooling',
      'Core syntax patterns',
      'Data structures & flow',
      'Working with real data',
      'Mini project walkthrough',
    ],
    ru: [
      'Основы и инструменты',
      'Ключевые синтаксические шаблоны',
      'Структуры данных и поток',
      'Работа с реальными данными',
      'Мини-проект: разбор',
    ],
    uz: [
      'Asoslar va vositalar',
      'Asosiy sintaksis andozalari',
      'Ma\'lumot tuzilmalari va oqim',
      'Haqiqiy ma\'lumotlar bilan ishlash',
      'Mini-loyiha tahlili',
    ],
  },
  Languages: {
    en: [
      'Sounds & essential phrases',
      'Everyday conversations',
      'Grammar building blocks',
      'Listening and reading practice',
      'Speaking confidence drills',
    ],
    ru: [
      'Звуки и базовые фразы',
      'Повседневные разговоры',
      'Грамматические основы',
      'Практика аудирования и чтения',
      'Тренировка уверенной речи',
    ],
    uz: [
      'Tovushlar va asosiy iboralar',
      'Kundalik suhbatlar',
      'Grammatika asoslari',
      'Tinglash va o\'qish amaliyoti',
      'Gapirish ishonchini oshirish mashqlari',
    ],
  },
  'School subjects': {
    en: [
      'Conceptual overview',
      'Key formulas & facts',
      'Worked examples',
      'Practice set',
      'Checkpoint review',
    ],
    ru: [
      'Концептуальный обзор',
      'Ключевые формулы и факты',
      'Разобранные примеры',
      'Практический набор',
      'Контрольный обзор',
    ],
    uz: [
      'Tushunchaviy ko\'rib chiqish',
      'Asosiy formulalar va faktlar',
      'Ishlangan misollar',
      'Amaliy mashqlar to\'plami',
      'Nazorat qayta ko\'rib chiqish',
    ],
  },
}

const courseSeeds: CourseSeed[] = [
  {
    id: 'python-basics',
    category: 'Programming',
    level: { en: 'Beginner', ru: 'Начальный', uz: "Boshlang'ich" },
    title: { en: 'Python basics', ru: 'Основы Python', uz: 'Python asoslari' },
    description: {
      en: 'Learn Python syntax, data types, and the building blocks for automation and data work.',
      ru: 'Изучите синтаксис Python, типы данных и базовые блоки для автоматизации и работы с данными.',
      uz: "Python sintaksisi, ma'lumot turlari va avtomatlashtirish hamda ma'lumotlar bilan ishlashning asosiy bloklarini o'rganing.",
    },
    tags: {
      en: ['Python', 'Beginner', 'Automation'],
      ru: ['Python', 'Начальный', 'Автоматизация'],
      uz: ['Python', "Boshlang'ich", 'Avtomatlashtirish'],
    },
  },
  {
    id: 'sql-basics',
    category: 'Programming',
    level: { en: 'Beginner', ru: 'Начальный', uz: "Boshlang'ich" },
    title: { en: 'SQL basics', ru: 'Основы SQL', uz: 'SQL asoslari' },
    description: {
      en: 'Write queries, filter data, and understand relational database thinking.',
      ru: 'Пишите запросы, фильтруйте данные и понимайте реляционное мышление.',
      uz: "So'rovlar yozing, ma'lumotlarni filtrlashni va relatsion fikrlashni tushuning.",
    },
    tags: {
      en: ['SQL', 'Data', 'Databases'],
      ru: ['SQL', 'Данные', 'Базы данных'],
      uz: ['SQL', "Ma'lumotlar", "Ma'lumotlar bazalari"],
    },
  },
  {
    id: 'postgresql',
    category: 'Programming',
    level: { en: 'Intermediate', ru: 'Средний', uz: "O'rta" },
    title: { en: 'PostgreSQL', ru: 'PostgreSQL', uz: 'PostgreSQL' },
    description: {
      en: 'Model data, optimize queries, and explore PostgreSQL features used in production.',
      ru: 'Моделируйте данные, оптимизируйте запросы и изучайте возможности PostgreSQL в продакшене.',
      uz: "Ma'lumotlarni modellashtiring, so'rovlarni optimallashtiring va ishlab chiqarishda qo'llaniladigan PostgreSQL imkoniyatlarini o'rganing.",
    },
    tags: {
      en: ['PostgreSQL', 'Indexes', 'Performance'],
      ru: ['PostgreSQL', 'Индексы', 'Производительность'],
      uz: ['PostgreSQL', 'Indekslar', 'Unumdorlik'],
    },
  },
  {
    id: 'django-web-apps',
    category: 'Programming',
    level: { en: 'Intermediate', ru: 'Средний', uz: "O'rta" },
    title: { en: 'Django web apps', ru: 'Веб-приложения Django', uz: 'Django veb ilovalari' },
    description: {
      en: 'Build full-stack Django applications with models, views, templates, and REST APIs.',
      ru: 'Создавайте full-stack приложения Django с моделями, представлениями, шаблонами и REST API.',
      uz: "Modellar, ko'rinishlar, shablonlar va REST API bilan to'liq Django ilovalarini yarating.",
    },
    tags: {
      en: ['Django', 'Web', 'Backend'],
      ru: ['Django', 'Веб', 'Бэкенд'],
      uz: ['Django', 'Veb', 'Backend'],
    },
  },
  {
    id: 'html-css',
    category: 'Programming',
    level: { en: 'Beginner', ru: 'Начальный', uz: "Boshlang'ich" },
    title: { en: 'HTML/CSS', ru: 'HTML/CSS', uz: 'HTML/CSS' },
    description: {
      en: 'Craft accessible layouts, responsive pages, and modern styling foundations.',
      ru: 'Создавайте доступные макеты, адаптивные страницы и современные основы стилизации.',
      uz: "Moslashuvchan sahifalar, qulay maketlar va zamonaviy uslublash asoslarini yarating.",
    },
    tags: {
      en: ['HTML', 'CSS', 'Responsive'],
      ru: ['HTML', 'CSS', 'Адаптивность'],
      uz: ['HTML', 'CSS', 'Moslashuvchan'],
    },
  },
  {
    id: 'bootstrap',
    category: 'Programming',
    level: { en: 'Beginner', ru: 'Начальный', uz: "Boshlang'ich" },
    title: { en: 'Bootstrap', ru: 'Bootstrap', uz: 'Bootstrap' },
    description: {
      en: 'Rapidly prototype interfaces using Bootstrap utility classes and components.',
      ru: 'Быстро прототипируйте интерфейсы с утилитами и компонентами Bootstrap.',
      uz: 'Bootstrap utilitalari va komponentlari yordamida interfeyslarni tez prototiplang.',
    },
    tags: {
      en: ['Bootstrap', 'UI', 'Components'],
      ru: ['Bootstrap', 'UI', 'Компоненты'],
      uz: ['Bootstrap', 'UI', 'Komponentlar'],
    },
  },
  {
    id: 'javascript',
    category: 'Programming',
    level: { en: 'Beginner', ru: 'Начальный', uz: "Boshlang'ich" },
    title: { en: 'JavaScript', ru: 'JavaScript', uz: 'JavaScript' },
    description: {
      en: 'Understand JavaScript fundamentals, the DOM, and async programming.',
      ru: 'Освойте основы JavaScript, DOM и асинхронное программирование.',
      uz: 'JavaScript asoslari, DOM va asinxron dasturlashni tushuning.',
    },
    tags: {
      en: ['JavaScript', 'Frontend', 'DOM'],
      ru: ['JavaScript', 'Фронтенд', 'DOM'],
      uz: ['JavaScript', 'Frontend', 'DOM'],
    },
  },
  {
    id: 'react',
    category: 'Programming',
    level: { en: 'Intermediate', ru: 'Средний', uz: "O'rta" },
    title: { en: 'React', ru: 'React', uz: 'React' },
    description: {
      en: 'Build component-driven interfaces with state, effects, and modern React patterns.',
      ru: 'Создавайте интерфейсы на компонентах со state, эффектами и современными паттернами React.',
      uz: 'State, effectlar va zamonaviy React uslublari bilan komponentga asoslangan interfeyslar yarating.',
    },
    tags: {
      en: ['React', 'Components', 'Hooks'],
      ru: ['React', 'Компоненты', 'Hooks'],
      uz: ['React', 'Komponentlar', 'Hooks'],
    },
  },
  {
    id: 'english-a1-b2',
    category: 'Languages',
    level: { en: 'Beginner to Intermediate', ru: 'Начальный–средний', uz: "Boshlang'ich–o'rta" },
    title: { en: 'English A1–B2', ru: 'Английский A1–B2', uz: 'Ingliz tili A1–B2' },
    description: {
      en: 'Structured English learning path from fundamentals to independent communication.',
      ru: 'Структурированный путь изучения английского от основ до самостоятельного общения.',
      uz: "Ingliz tilini asoslardan mustaqil muloqotgacha bosqichma-bosqich o'rganish.",
    },
    tags: {
      en: ['English', 'A1', 'B2'],
      ru: ['Английский', 'A1', 'B2'],
      uz: ['Ingliz tili', 'A1', 'B2'],
    },
  },
  {
    id: 'russian-beginner',
    category: 'Languages',
    level: { en: 'Beginner', ru: 'Начальный', uz: "Boshlang'ich" },
    title: { en: 'Russian beginner', ru: 'Русский: начальный', uz: "Rus tili: boshlang'ich" },
    description: {
      en: 'Learn Cyrillic, survival phrases, and essential grammar for Russian learners.',
      ru: 'Изучите кириллицу, базовые фразы и ключевую грамматику.',
      uz: "Rus tili o'rganuvchilar uchun kirill alifbosi, omon qolish iboralari va asosiy grammatika.",
    },
    tags: {
      en: ['Russian', 'Beginner', 'Grammar'],
      ru: ['Русский', 'Начальный', 'Грамматика'],
      uz: ['Rus tili', "Boshlang'ich", 'Grammatika'],
    },
  },
  {
    id: 'russian-intermediate',
    category: 'Languages',
    level: { en: 'Intermediate', ru: 'Средний', uz: "O'rta" },
    title: { en: 'Russian intermediate', ru: 'Русский: средний', uz: "Rus tili: o'rta" },
    description: {
      en: 'Expand fluency with complex grammar, reading comprehension, and speaking drills.',
      ru: 'Развивайте беглость с продвинутой грамматикой, чтением и разговорной практикой.',
      uz: "Murakkab grammatika, matnni tushunish va gapirish mashqlari bilan ravonlikni oshiring.",
    },
    tags: {
      en: ['Russian', 'Intermediate', 'Fluency'],
      ru: ['Русский', 'Средний', 'Беглость'],
      uz: ['Rus tili', "O'rta", 'Ravonlik'],
    },
  },
]

const templates: Record<Locale, Template> = {
  en: {
    lessonTitle: '{courseTitle}: {theme}',
    summary: 'A structured walkthrough of {themeLower} for {courseTitle}.',
    theory: [
      'Learning focus: {themeLower} in the context of {courseTitle}.',
      'We introduce the key terms, then connect them to real-world practice.',
      'Use the short checks to ensure you can explain concepts in your own words.',
      'Think about how this topic appears in daily tasks, projects, or tests.',
      'This lesson is adapted from neutral educational references like {source}.',
    ],
    examples: [
      'Worked example 1: A guided scenario tailored for {courseTitle}.',
      'Worked example 2: A common pitfall and how to resolve it.',
      'Worked example 3: Translating the concept into a practical task.',
    ],
    exercises: {
      prompt1: 'Summarize the key idea from {themeLower} in 2 sentences.',
      hint1: 'Use the lesson summary as your outline.',
      prompt2: 'List three real-life scenarios where {courseTitle} matters.',
      hint2: 'Think projects, exams, or workplace tasks.',
      prompt3: 'Solve a practice prompt related to {themeLower}.',
      hint3: 'Follow the worked examples from this lesson.',
    },
    quizTitle: '{courseTitle} quick check',
    quiz: {
      q1Prompt: 'Which statement best captures the focus of {themeLower}?',
      q1Options: [
        'It is mainly about memorization only.',
        'It connects core concepts to practical usage.',
        'It avoids real-world examples.',
        'It is optional for mastering the course.',
      ],
      q1Explanation: 'The theme connects foundational ideas with practical usage.',
      q2Prompt: 'What is a productive next step after this lesson?',
      q2Options: [
        'Skip practice tasks.',
        'Complete at least one exercise and review feedback.',
        'Wait until the final exam.',
        'Ignore the examples.',
      ],
      q2Explanation: 'Practice cements the concepts and reveals gaps early.',
      q3Prompt: 'Which resource style supports this lesson?',
      q3Options: [
        'Short, structured explanations with practice.',
        'Only long-form lectures.',
        'Only memorization drills.',
        'No external references.',
      ],
      q3Explanation: 'The lesson blends structured explanations and practice.',
    },
    exam: {
      title: '{courseTitle} {examType} exam',
      typeLabel: {
        'mid-course': 'mid-course',
        final: 'final',
      },
      q1Prompt: 'What is the main outcome expected by the {examType} exam?',
      q1Options: [
        'Recall isolated facts only.',
        'Demonstrate structured understanding and applied skills.',
        'Skip practice and rely on guessing.',
        'Avoid reviewing earlier lessons.',
      ],
      q1Explanation: 'Exams measure both understanding and the ability to apply skills.',
      q2Prompt: 'Which preparation strategy best supports success?',
      q2Options: [
        'Review lesson summaries and complete practice tasks.',
        'Ignore feedback and move forward quickly.',
        'Avoid quizzes to save time.',
        'Study only the last lesson.',
      ],
      q2Explanation: 'Steady review and practice deliver the strongest results.',
    },
  },
  ru: {
    lessonTitle: '{courseTitle}: {theme}',
    summary: 'Структурированный разбор {themeLower} для {courseTitle}.',
    theory: [
      'Фокус обучения: {themeLower} в контексте {courseTitle}.',
      'Сначала вводим ключевые термины, затем связываем их с практикой.',
      'Используйте короткие проверки, чтобы объяснять идеи своими словами.',
      'Подумайте, как эта тема проявляется в ежедневных задачах, проектах или тестах.',
      'Этот урок адаптирован из нейтральных источников вроде {source}.',
    ],
    examples: [
      'Пример 1: направленный сценарий, адаптированный под {courseTitle}.',
      'Пример 2: типичная ошибка и способ её исправления.',
      'Пример 3: перевод концепции в практическую задачу.',
    ],
    exercises: {
      prompt1: 'Сформулируйте ключевую идею {themeLower} в 2 предложениях.',
      hint1: 'Используйте резюме урока как план.',
      prompt2: 'Назовите три жизненных ситуации, где важен {courseTitle}.',
      hint2: 'Подумайте о проектах, экзаменах или рабочих задачах.',
      prompt3: 'Решите практическое задание по теме {themeLower}.',
      hint3: 'Опирайтесь на разобранные примеры из урока.',
    },
    quizTitle: '{courseTitle}: быстрая проверка',
    quiz: {
      q1Prompt: 'Какое утверждение лучше всего отражает фокус {themeLower}?',
      q1Options: [
        'Речь в основном только о запоминании.',
        'Связывает ключевые понятия с практическим применением.',
        'Избегает примеров из реальной жизни.',
        'Это необязательно для освоения курса.',
      ],
      q1Explanation: 'Тема связывает базовые идеи с практическим применением.',
      q2Prompt: 'Какой следующий шаг после урока наиболее продуктивен?',
      q2Options: [
        'Пропустить практические задания.',
        'Выполнить хотя бы одно упражнение и просмотреть обратную связь.',
        'Подождать до итогового экзамена.',
        'Игнорировать примеры.',
      ],
      q2Explanation: 'Практика закрепляет понятия и рано выявляет пробелы.',
      q3Prompt: 'Какой формат ресурсов лучше поддерживает этот урок?',
      q3Options: [
        'Короткие структурированные объяснения с практикой.',
        'Только длинные лекции.',
        'Только упражнения на запоминание.',
        'Без внешних источников.',
      ],
      q3Explanation: 'Урок сочетает структурированные объяснения и практику.',
    },
    exam: {
      title: '{courseTitle} {examType} экзамен',
      typeLabel: {
        'mid-course': 'промежуточный',
        final: 'итоговый',
      },
      q1Prompt: 'Какой основной результат ожидается от {examType} экзамена?',
      q1Options: [
        'Вспомнить только отдельные факты.',
        'Показать структурированное понимание и прикладные навыки.',
        'Пропустить практику и полагаться на угадывание.',
        'Не пересматривать предыдущие уроки.',
      ],
      q1Explanation: 'Экзамены измеряют и понимание, и умение применять знания.',
      q2Prompt: 'Какая стратегия подготовки лучше всего помогает добиться успеха?',
      q2Options: [
        'Просмотреть резюме уроков и выполнить практические задания.',
        'Игнорировать обратную связь и двигаться дальше.',
        'Пропускать тесты, чтобы сэкономить время.',
        'Учить только последний урок.',
      ],
      q2Explanation: 'Регулярный обзор и практика дают лучшие результаты.',
    },
  },
  uz: {
    lessonTitle: '{courseTitle}: {theme}',
    summary: "{courseTitle} uchun {themeLower} bo'yicha tuzilgan dars.",
    theory: [
      "O'rganish maqsadi: {courseTitle} doirasida {themeLower}.",
      "Avval asosiy atamalarni tanishtiramiz, keyin ularni amaliyot bilan bog'laymiz.",
      "Qisqa tekshiruvlardan foydalanib, tushunchalarni o'z so'zlaringiz bilan izohlashga harakat qiling.",
      "Mavzu kundalik vazifalar, loyihalar yoki testlarda qanday ko'rinishini o'ylab ko'ring.",
      "Bu dars {source} kabi neytral ta'lim manbalaridan moslashtirilgan.",
    ],
    examples: [
      "1-misol: {courseTitle} uchun moslashtirilgan yo'naltirilgan ssenariy.",
      "2-misol: Keng uchraydigan xato va uni tuzatish yo'li.",
      "3-misol: Tushunchani amaliy vazifaga aylantirish.",
    ],
    exercises: {
      prompt1: "{themeLower} bo'yicha asosiy g'oyani 2 ta gapda jamlang.",
      hint1: 'Dars xulosasini reja sifatida foydalaning.',
      prompt2: "{courseTitle} kerak bo'ladigan uchta real hayotiy holatni sanab bering.",
      hint2: 'Loyiha, imtihon yoki ishdagi vazifalarni o\'ylang.',
      prompt3: "{themeLower} bo'yicha amaliy savolni bajaring.",
      hint3: 'Darsdagi ishlangan misollarga tayaning.',
    },
    quizTitle: "{courseTitle} bo'yicha tezkor tekshiruv",
    quiz: {
      q1Prompt: "{themeLower}ning asosiy yo'nalishini qaysi gap eng yaxshi ifodalaydi?",
      q1Options: [
        'Asosan faqat yodlashga qaratilgan.',
        'Asosiy tushunchalarni amaliyot bilan bog\'laydi.',
        'Haqiqiy hayotiy misollardan qochadi.',
        'Kursni o\'zlashtirish uchun shart emas.',
      ],
      q1Explanation: 'Mavzu asosiy g\'oyalarni amaliy qo\'llash bilan bog\'laydi.',
      q2Prompt: 'Bu darsdan keyin eng foydali keyingi qadam qaysi?',
      q2Options: [
        'Amaliy topshiriqlarni o\'tkazib yuborish.',
        'Kamida bitta mashqni bajarib, fikr-mulohazani ko\'rib chiqish.',
        'Yakuniy imtihongacha kutish.',
        'Misollarni e\'tiborsiz qoldirish.',
      ],
      q2Explanation: 'Amaliyot tushunchalarni mustahkamlaydi va bo\'shliqlarni erta ko\'rsatadi.',
      q3Prompt: 'Bu darsni qaysi resurs uslubi qo\'llab-quvvatlaydi?',
      q3Options: [
        'Qisqa, tuzilgan tushuntirishlar va amaliyot.',
        'Faqat uzun ma\'ruzalar.',
        'Faqat yodlash mashqlari.',
        'Tashqi manbalar umuman yo\'q.',
      ],
      q3Explanation: 'Dars tuzilgan tushuntirishlar va amaliyotni birlashtiradi.',
    },
    exam: {
      title: '{courseTitle} {examType} imtihon',
      typeLabel: {
        'mid-course': 'oraliq',
        final: 'yakuniy',
      },
      q1Prompt: '{examType} imtihondan kutiladigan asosiy natija nima?',
      q1Options: [
        'Faqat alohida faktlarni eslab qolish.',
        "Tuzilgan tushuncha va amaliy ko'nikmalarni namoyish etish.",
        'Amaliyotni o\'tkazib yuborib, taxmin qilish.',
        'Oldingi darslarni qayta ko\'rmaslik.',
      ],
      q1Explanation: 'Imtihonlar tushunishni ham, qo\'llash ko\'nikmalarini ham o\'lchaydi.',
      q2Prompt: 'Qaysi tayyorgarlik strategiyasi muvaffaqiyatni eng yaxshi ta\'minlaydi?',
      q2Options: [
        'Dars xulosalarini ko\'rib chiqib, amaliy topshiriqlarni bajarish.',
        'Fikr-mulohazani e\'tiborsiz qoldirib, tez davom etish.',
        'Vaqt tejash uchun testlarni o\'tkazib yuborish.',
        'Faqat oxirgi darsni o\'rganish.',
      ],
      q2Explanation: 'Barqaror takrorlash va amaliyot eng yaxshi natija beradi.',
    },
  },
}

const localeFromLanguage = (lang?: string): Locale => {
  if (!lang) return 'en'
  const normalized = lang.toLowerCase()
  if (normalized.startsWith('ru')) return 'ru'
  if (normalized.startsWith('uz')) return 'uz'
  return 'en'
}

const pick = <T,>(value: Localized<T>, locale: Locale) => value[locale] ?? value.en

const formatTemplate = (template: string, vars: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_match, key) => vars[key] ?? '')

const buildLesson = (
  courseId: string,
  courseTitle: string,
  theme: string,
  index: number,
  locale: Locale,
) => {
  const lessonId = `${courseId}-lesson-${index + 1}`
  const source = sourcePool[index % sourcePool.length]
  const text = templates[locale]
  const vars = {
    courseTitle,
    theme,
    themeLower: theme.toLowerCase(),
    source,
  }

  return {
    id: lessonId,
    courseId,
    title: formatTemplate(text.lessonTitle, vars),
    summary: formatTemplate(text.summary, vars),
    durationMinutes: 18 + index * 4,
    theory: text.theory.map((line) => formatTemplate(line, vars)),
    examples: text.examples.map((line) => formatTemplate(line, vars)),
    exercises: [
      {
        id: `${lessonId}-ex-1`,
        prompt: formatTemplate(text.exercises.prompt1, vars),
        type: 'short-answer' as const,
        hint: formatTemplate(text.exercises.hint1, vars),
      },
      {
        id: `${lessonId}-ex-2`,
        prompt: formatTemplate(text.exercises.prompt2, vars),
        type: 'short-answer' as const,
        hint: formatTemplate(text.exercises.hint2, vars),
      },
      {
        id: `${lessonId}-ex-3`,
        prompt: formatTemplate(text.exercises.prompt3, vars),
        type: 'practice' as const,
        hint: formatTemplate(text.exercises.hint3, vars),
      },
    ],
    quiz: {
      id: `${lessonId}-quiz`,
      title: formatTemplate(text.quizTitle, vars),
      type: 'lesson-review' as const,
      questions: [
        {
          id: `${lessonId}-q1`,
          prompt: formatTemplate(text.quiz.q1Prompt, vars),
          options: text.quiz.q1Options.map((option) => formatTemplate(option, vars)),
          answerIndex: 1,
          explanation: formatTemplate(text.quiz.q1Explanation, vars),
        },
        {
          id: `${lessonId}-q2`,
          prompt: formatTemplate(text.quiz.q2Prompt, vars),
          options: text.quiz.q2Options.map((option) => formatTemplate(option, vars)),
          answerIndex: 1,
          explanation: formatTemplate(text.quiz.q2Explanation, vars),
        },
        {
          id: `${lessonId}-q3`,
          prompt: formatTemplate(text.quiz.q3Prompt, vars),
          options: text.quiz.q3Options.map((option) => formatTemplate(option, vars)),
          answerIndex: 0,
          explanation: formatTemplate(text.quiz.q3Explanation, vars),
        },
      ],
    },
    sources: [source, sourcePool[(index + 2) % sourcePool.length]],
  }
}

const buildExam = (
  courseId: string,
  courseTitle: string,
  type: 'mid-course' | 'final',
  locale: Locale,
) => {
  const text = templates[locale].exam
  const examType = text.typeLabel[type]
  const vars = {
    courseTitle,
    examType,
  }

  return {
    id: `${courseId}-${type}-exam`,
    title: formatTemplate(text.title, vars),
    type,
    questions: [
      {
        id: `${courseId}-${type}-q1`,
        prompt: formatTemplate(text.q1Prompt, vars),
        options: text.q1Options.map((option) => formatTemplate(option, vars)),
        answerIndex: 1,
        explanation: formatTemplate(text.q1Explanation, vars),
      },
      {
        id: `${courseId}-${type}-q2`,
        prompt: formatTemplate(text.q2Prompt, vars),
        options: text.q2Options.map((option) => formatTemplate(option, vars)),
        answerIndex: 0,
        explanation: formatTemplate(text.q2Explanation, vars),
      },
    ],
  }
}

export const buildCatalog = (lang?: string) => {
  const locale = localeFromLanguage(lang)

  const richCourseIds = new Set(subjectCourses.map((course) => course.id))

  const generatedCourses: Course[] = courseSeeds
    .filter((course) => !richCourseIds.has(course.id))
    .map((course) => {
      const courseTitle = pick(course.title, locale)
      const lessons = lessonThemes[course.category][locale].map((theme, index) =>
        buildLesson(course.id, courseTitle, theme, index, locale),
      )

      return {
        id: course.id,
        title: courseTitle,
        category: course.category,
        level: pick(course.level, locale),
        description: pick(course.description, locale),
        tags: pick(course.tags, locale),
        lessons,
        midCourseExam: buildExam(course.id, courseTitle, 'mid-course', locale),
        finalExam: buildExam(course.id, courseTitle, 'final', locale),
        totalLessons: lessons.length,
        estimatedHours: Math.round(lessons.reduce((sum, l) => sum + l.durationMinutes, 0) / 60),
      }
    })

  const richCourses: Course[] = subjectCourses.map((subject) => {
    const lessons = buildLessonsFromContent(subject.id, subject.lessons)

    return {
      id: subject.id,
      title: subject.title,
      category: subject.category,
      level: subject.level,
      description: subject.description,
      tags: subject.tags,
      lessons,
      // For now, reuse the generic exam builder so the dashboard
      // and existing progress cards keep working consistently.
      midCourseExam: buildExam(subject.id, subject.title, 'mid-course', locale),
      finalExam: buildExam(subject.id, subject.title, 'final', locale),
      totalLessons: lessons.length,
      estimatedHours: Math.round(lessons.reduce((sum, l) => sum + l.durationMinutes, 0) / 60),
    }
  })

  const courses: Course[] = [...richCourses, ...generatedCourses]

  const featuredCourses = courses.slice(0, 6)

  const user: User = {
    id: 'user-001',
    name: 'Abubakr Hassan',
    email: 'abubakr@skynetic.ai',
    role: 'Learner',
    enrolledCourseIds: courses.slice(0, 6).map((course) => course.id),
    badges: ['Consistency Builder', 'Fast Starter', 'Curious Mind'],
    rank: 0,
    streakDays: 12,
    avatarColor: '#0F766E',
  }

  const progressRecords: Progress[] = user.enrolledCourseIds.map((courseId, index) => {
    const course = courses.find((item) => item.id === courseId)
    const completedLessons = course ? course.lessons.slice(0, 2 + (index % 3)).map((l) => l.id) : []

    return {
      id: `progress-${courseId}`,
      userId: user.id,
      courseId,
      completedLessonIds: completedLessons,
      averageScore: 78 + (index % 4) * 4,
      nextLessonId: course?.lessons[completedLessons.length]?.id ?? course?.lessons[0].id ?? '',
      lastStudiedAt: '2026-02-08',
      examResults: {
        lessonReview: 82 + (index % 3) * 3,
        midCourse: 74 + (index % 3) * 4,
        final: 88 - (index % 2) * 5,
      },
    }
  })

  const attempts: Attempt[] = progressRecords.flatMap((progress) =>
    [
      {
        id: `${progress.id}-lesson-review`,
        quizId: `${progress.courseId}-lesson-review`,
        score: progress.examResults.lessonReview,
        maxScore: 100,
        completedAt: '2026-02-07',
      },
      {
        id: `${progress.id}-mid-course`,
        quizId: `${progress.courseId}-mid-course`,
        score: progress.examResults.midCourse,
        maxScore: 100,
        completedAt: '2026-02-08',
      },
      {
        id: `${progress.id}-final-exam`,
        quizId: `${progress.courseId}-final`,
        score: progress.examResults.final,
        maxScore: 100,
        completedAt: '2026-02-09',
      },
    ],
  )

  const leaderboard: LeaderboardEntry[] = []

  return {
    courses,
    featuredCourses,
    user,
    progressRecords,
    attempts,
    leaderboard,
  }
}

export type Catalog = ReturnType<typeof buildCatalog>

export const getCatalog = (lang?: string): Catalog => buildCatalog(lang)
