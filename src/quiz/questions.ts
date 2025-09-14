// Структура вопросов квиза по разделам A-G
export type QuestionType = 'single' | 'multiple' | 'text' | 'textarea' | 'conditional';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  // Условия для показа вопроса (для ветвлений)
  condition?: {
    questionId: string;
    values: string[];
  };
  // Следующий вопрос/раздел
  nextQuestion?: string;
}

export interface QuizSection {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  // Условие показа секции
  condition?: {
    questionId: string;
    values: string[];
  };
}

// Структура всего квиза
export const quizSections: QuizSection[] = [
  {
    id: 'profile',
    title: 'Раздел A: Профиль компании',
    description: 'Основная информация о вашем бизнесе',
    questions: [
      {
        id: 'industry',
        type: 'single',
        title: 'В какой отрасли работает ваша компания?',
        options: [
          'E-commerce / Интернет-торговля',
          'Финансы и банковские услуги',
          'IT и разработка',
          'Производство',
          'Розничная торговля',
          'Услуги и консалтинг',
          'Здравоохранение',
          'Образование',
          'Логистика и транспорт',
          'Недвижимость',
          'Другое'
        ],
        required: true
      },
      {
        id: 'business_model',
        type: 'single',
        title: 'Какая у вас бизнес-модель?',
        description: 'Это важно для понимания специфики автоматизации',
        options: [
          'B2B (работаем с другими компаниями)',
          'B2C (работаем с конечными потребителями)',
          'B2B2C (смешанная модель)',
          'Marketplace (площадка)',
          'SaaS (программное обеспечение как услуга)',
          'Другое'
        ],
        required: true
      },
      {
        id: 'geography',
        type: 'multiple',
        title: 'География работы',
        description: 'Где ваша компания ведет деятельность?',
        options: [
          'Россия',
          'СНГ',
          'Европа',
          'Северная Америка',
          'Азия',
          'Другие регионы'
        ],
        required: true
      },
      {
        id: 'revenue',
        type: 'single',
        title: 'Годовой оборот компании',
        options: [
          'До 10 млн руб.',
          '10-50 млн руб.',
          '50-200 млн руб.',
          '200 млн - 1 млрд руб.',
          'Более 1 млрд руб.',
          'Предпочитаю не указывать'
        ],
        required: true
      },
      {
        id: 'employees',
        type: 'single',
        title: 'Количество сотрудников',
        options: [
          '1-10 человек',
          '11-50 человек',
          '51-200 человек',
          '201-1000 человек',
          'Более 1000 человек'
        ],
        required: true
      },
      {
        id: 'role',
        type: 'single',
        title: 'Ваша роль в принятии решений об автоматизации',
        options: [
          'Окончательно принимаю решения',
          'Участвую в принятии решений',
          'Готовлю рекомендации для руководства',
          'Изучаю возможности по поручению',
          'Другое'
        ],
        required: true
      },
      {
        id: 'data_sensitivity',
        type: 'multiple',
        title: 'С какими типами данных работает компания?',
        description: 'Важно для понимания требований к безопасности',
        options: [
          'Персональные данные клиентов',
          'Финансовая информация',
          'Коммерческая тайна',
          'Медицинские данные',
          'Государственная тайна',
          'Обычная корпоративная информация'
        ],
        required: true
      }
    ]
  },
  {
    id: 'commerce',
    title: 'Раздел B: Коммерция и воронка',
    description: 'Как работает ваша система продаж',
    questions: [
      {
        id: 'leads_source',
        type: 'multiple',
        title: 'Откуда приходят ваши клиенты/лиды?',
        options: [
          'Сайт компании',
          'Социальные сети',
          'Контекстная реклама (Яндекс.Директ, Google Ads)',
          'Таргетированная реклама (Facebook, VK)',
          'Email-рассылки',
          'Холодные звонки/письма',
          'Рекомендации существующих клиентов',
          'Партнерская программа',
          'Выставки и мероприятия',
          'Другое'
        ],
        required: true
      },
      {
        id: 'leads_volume',
        type: 'single',
        title: 'Сколько лидов получаете в месяц?',
        options: [
          'До 50',
          '51-200',
          '201-500',
          '501-1000',
          'Более 1000'
        ],
        required: true
      }
      // Здесь будут добавлены условные вопросы для B2B/B2C
    ]
  },
  {
    id: 'operations',
    title: 'Раздел C: Операции и процессы',
    description: 'Текущие бизнес-процессы и их объемы',
    questions: [
      {
        id: 'main_processes',
        type: 'multiple',
        title: 'Какие процессы занимают больше всего времени?',
        options: [
          'Обработка заказов/заявок',
          'Ведение клиентской базы (CRM)',
          'Финансовый учет и отчетность',
          'Управление складом/товарами',
          'HR-процессы (найм, документооборот)',
          'Маркетинговые кампании',
          'Техническая поддержка клиентов',
          'Планирование и аналитика',
          'Другое'
        ],
        required: true
      }
    ]
  },
  {
    id: 'stack',
    title: 'Раздел D: Стек и зрелость ИИ',
    description: 'Текущие системы и опыт с ИИ',
    questions: [
      {
        id: 'current_systems',
        type: 'multiple',
        title: 'Какие системы уже используете?',
        options: [
          'CRM (Bitrix24, AmoCRM, Salesforce)',
          'ERP (1С, SAP, другие)',
          'Системы складского учета (WMS)',
          'Системы документооборота (СЭДО)',
          'Email-маркетинг (Mailchimp, UniSender)',
          'Аналитические системы (Google Analytics, Яндекс.Метрика)',
          'Чат-боты',
          'Собственные разработки',
          'Другое'
        ],
        required: true
      },
      {
        id: 'ai_experience',
        type: 'single',
        title: 'Опыт использования ИИ в бизнесе',
        options: [
          'Активно используем различные ИИ-решения',
          'Тестируем несколько ИИ-инструментов',
          'Используем базовые ИИ-функции (ChatGPT, автоответы)',
          'Только планируем внедрение',
          'Нет опыта с ИИ'
        ],
        required: true
      }
    ]
  },
  {
    id: 'pilot',
    title: 'Раздел E: Приоритеты и пилот',
    description: 'Планы по автоматизации',
    questions: [
      {
        id: 'automation_priority',
        type: 'single',
        title: 'Главный приоритет в автоматизации',
        options: [
          'Увеличение продаж и конверсии',
          'Снижение операционных затрат',
          'Улучшение качества обслуживания клиентов',
          'Ускорение внутренних процессов',
          'Получение лучшей аналитики для принятия решений',
          'Масштабирование бизнеса',
          'Другое'
        ],
        required: true
      },
      {
        id: 'pilot_readiness',
        type: 'single',
        title: 'Готовность к запуску пилотного проекта',
        options: [
          'Готов начать в течение месяца',
          'Готов начать в течение 2-3 месяцев',
          'Планирую в следующем квартале',
          'Пока изучаю возможности',
          'Не готов к реализации в ближайшее время'
        ],
        required: true
      }
    ]
  },
  {
    id: 'legal',
    title: 'Раздел F: Юридические требования и риски',
    description: 'Требования к безопасности и compliance',
    condition: {
      questionId: 'data_sensitivity',
      values: ['Персональные данные клиентов', 'Финансовая информация', 'Медицинские данные', 'Государственная тайна']
    },
    questions: [
      {
        id: 'compliance_requirements',
        type: 'multiple',
        title: 'Каким требованиям должны соответствовать решения?',
        options: [
          '152-ФЗ (О персональных данных)',
          'ПБК (Положение Банка России)',
          'Требования Роскомнадзора',
          'Отраслевые стандарты безопасности',
          'Международные стандарты (GDPR, ISO)',
          'Корпоративные политики безопасности',
          'Не знаю/нужна консультация'
        ],
        required: true
      }
    ]
  },
  {
    id: 'contacts',
    title: 'Раздел G: Контактная информация',
    description: 'Для связи и отправки результатов',
    questions: [
      {
        id: 'contact_name',
        type: 'text',
        title: 'Имя для связи',
        placeholder: 'Введите ваше имя',
        required: true
      },
      {
        id: 'contact_email',
        type: 'text',
        title: 'Email',
        placeholder: 'example@company.com',
        required: true
      },
      {
        id: 'contact_phone',
        type: 'text',
        title: 'Телефон (необязательно)',
        placeholder: '+7 (xxx) xxx-xx-xx',
        required: false
      },
      {
        id: 'company_name',
        type: 'text',
        title: 'Название компании',
        placeholder: 'ООО "Название"',
        required: true
      },
      {
        id: 'consent',
        type: 'single',
        title: 'Согласие на обработку персональных данных',
        options: [
          'Согласен на обработку персональных данных и получение коммерческих предложений'
        ],
        required: true
      }
    ]
  }
];

// Дополнительные вопросы для B2B (добавляются к разделу Commerce)
export const b2bQuestions: QuizQuestion[] = [
  {
    id: 'deal_duration_b2b',
    type: 'single',
    title: 'Средняя длительность сделки (B2B)',
    condition: {
      questionId: 'business_model',
      values: ['B2B (работаем с другими компаниями)', 'B2B2C (смешанная модель)']
    },
    options: [
      'До 1 недели',
      '1-4 недели',
      '1-3 месяца',
      '3-6 месяцев',
      'Более 6 месяцев'
    ],
    required: true
  },
  {
    id: 'decision_makers_b2b',
    type: 'single',
    title: 'Количество лиц, принимающих решение на стороне клиента',
    condition: {
      questionId: 'business_model',
      values: ['B2B (работаем с другими компаниями)', 'B2B2C (смешанная модель)']
    },
    options: [
      '1 человек',
      '2-3 человека',
      '4-5 человек',
      'Более 5 человек',
      'Зависит от сделки'
    ],
    required: true
  },
  {
    id: 'outbound_sales_b2b',
    type: 'single',
    title: 'Используете ли исходящий поиск клиентов?',
    condition: {
      questionId: 'business_model',
      values: ['B2B (работаем с другими компаниями)', 'B2B2C (смешанная модель)']
    },
    options: [
      'Да, активно занимаемся холодными продажами',
      'Иногда, по необходимости',
      'Нет, работаем только с входящими лидами',
      'Планируем запустить'
    ],
    required: true
  }
];

// Дополнительные вопросы для B2C
export const b2cQuestions: QuizQuestion[] = [
  {
    id: 'customer_channels_b2c',
    type: 'multiple',
    title: 'Основные каналы взаимодействия с клиентами (B2C)',
    condition: {
      questionId: 'business_model',
      values: ['B2C (работаем с конечными потребителями)', 'B2B2C (смешанная модель)']
    },
    options: [
      'Веб-сайт',
      'Мобильное приложение',
      'Социальные сети',
      'Мессенджеры (WhatsApp, Telegram)',
      'Телефон/колл-центр',
      'Email',
      'Офлайн точки продаж'
    ],
    required: true
  },
  {
    id: 'customer_retention_b2c',
    type: 'single',
    title: 'Работа с удержанием клиентов',
    condition: {
      questionId: 'business_model',
      values: ['B2C (работаем с конечными потребителями)', 'B2B2C (смешанная модель)']
    },
    options: [
      'Активно работаем с базой, есть программы лояльности',
      'Периодически отправляем предложения',
      'Работаем в основном с новыми клиентами',
      'Планируем развивать это направление'
    ],
    required: true
  },
  {
    id: 'customer_support_b2c',
    type: 'multiple',
    title: 'Как организована поддержка клиентов?',
    condition: {
      questionId: 'business_model',
      values: ['B2C (работаем с конечными потребителями)', 'B2B2C (смешанная модель)']
    },
    options: [
      'Телефонная поддержка',
      'Онлайн-чат на сайте',
      'Email-поддержка',
      'Поддержка в социальных сетях',
      'Чат-боты',
      'FAQ/База знаний',
      'Поддержки пока нет'
    ],
    required: true
  }
];
