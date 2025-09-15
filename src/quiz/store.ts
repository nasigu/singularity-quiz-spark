// Хранилище состояния квиза
export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  timestamp: Date;
}

export interface TelegramUserInfo {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  user_link?: string;
}

export interface QuizResult {
  answers: QuizAnswer[];
  startTime: Date;
  endTime?: Date;
  currentSection: string;
  currentQuestionIndex: number;
  completed: boolean;
  telegramUser?: TelegramUserInfo;
}

class QuizStore {
  private storageKey = 'singularity-quiz-result';
  
  // Текущее состояние квиза
  private result: QuizResult = {
    answers: [],
    startTime: new Date(),
    currentSection: 'profile',
    currentQuestionIndex: 0,
    completed: false
  };

  // Инициализация - загрузка из localStorage если есть
  init(): QuizResult {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Восстанавливаем даты
        parsed.startTime = new Date(parsed.startTime);
        if (parsed.endTime) {
          parsed.endTime = new Date(parsed.endTime);
        }
        parsed.answers = parsed.answers.map((answer: any) => ({
          ...answer,
          timestamp: new Date(answer.timestamp)
        }));
        this.result = parsed;
      } catch (e) {
        console.error('Error loading quiz state:', e);
        this.reset();
      }
    }
    return this.result;
  }

  // Получить текущее состояние
  getState(): QuizResult {
    return { ...this.result };
  }

  // Сохранить ответ
  saveAnswer(questionId: string, answer: string | string[]): void {
    // Удаляем предыдущий ответ на этот вопрос если есть
    this.result.answers = this.result.answers.filter(a => a.questionId !== questionId);
    
    // Добавляем новый ответ
    this.result.answers.push({
      questionId,
      answer,
      timestamp: new Date()
    });

    this.saveToLocalStorage();
  }

  // Обновить текущую позицию
  updatePosition(sectionId: string, questionIndex: number): void {
    this.result.currentSection = sectionId;
    this.result.currentQuestionIndex = questionIndex;
    this.saveToLocalStorage();
  }

  // Установить данные пользователя Telegram
  setTelegramUser(userInfo: TelegramUserInfo): void {
    this.result.telegramUser = userInfo;
    this.saveToLocalStorage();
  }

  // Завершить квиз
  complete(): void {
    this.result.completed = true;
    this.result.endTime = new Date();
    this.saveToLocalStorage();
  }

  // Получить ответ на конкретный вопрос
  getAnswer(questionId: string): QuizAnswer | undefined {
    return this.result.answers.find(a => a.questionId === questionId);
  }

  // Получить все ответы как объект
  getAnswersObject(): Record<string, string | string[]> {
    const obj: Record<string, string | string[]> = {};
    this.result.answers.forEach(answer => {
      obj[answer.questionId] = answer.answer;
    });
    return obj;
  }

  // Проверить выполнено ли условие для показа вопроса/секции
  checkCondition(condition: { questionId: string; values: string[] }): boolean {
    const answer = this.getAnswer(condition.questionId);
    if (!answer) return false;

    if (Array.isArray(answer.answer)) {
      // Для множественных ответов - проверяем пересечение
      return condition.values.some(value => answer.answer.includes(value));
    } else {
      // Для одиночных ответов - проверяем включение
      return condition.values.includes(answer.answer as string);
    }
  }

  // Сохранить в localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.result));
    } catch (e) {
      console.error('Error saving quiz state:', e);
    }
  }

  // Очистить состояние
  reset(): void {
    this.result = {
      answers: [],
      startTime: new Date(),
      currentSection: 'profile',
      currentQuestionIndex: 0,
      completed: false
    };
    localStorage.removeItem(this.storageKey);
  }

  // Экспорт результата для отправки
  exportResult() {
    return {
      ...this.result,
      // Добавляем метаданные
      userAgent: navigator.userAgent,
      quizVersion: '1.0',
      exportTime: new Date()
    };
  }

  // Отправка результатов на webhook
  async sendToWebhook(): Promise<boolean> {
    const webhookUrl = 'https://n8n-nasigu.amvera.io/webhook/quiz-results';
    
    try {
      const data = this.exportResult();
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Quiz results sent successfully to webhook');
        return true;
      } else {
        console.error('Failed to send quiz results:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error sending quiz results to webhook:', error);
      return false;
    }
  }
}

// Синглтон
export const quizStore = new QuizStore();
