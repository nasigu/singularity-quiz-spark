import { useState, useEffect } from 'react';
import { quizSections, b2bQuestions, b2cQuestions, type QuizQuestion, type QuizSection } from './questions';
import { quizStore } from './store';
import QuizQuestionComponent from '@/components/QuizQuestion';

interface QuizEngineProps {
  onComplete: () => void;
}

export interface ExtendedQuestion extends QuizQuestion {
  sectionId: string;
  sectionTitle: string;
}

const QuizEngine = ({ onComplete }: QuizEngineProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allQuestions, setAllQuestions] = useState<ExtendedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Инициализация
  useEffect(() => {
    const state = quizStore.init();
    setAnswers(quizStore.getAnswersObject());
    
    // Построение списка вопросов с учетом условий
    buildQuestionsList();
  }, []);

  // Пересборка списка вопросов при изменении ответов
  useEffect(() => {
    buildQuestionsList();
  }, [answers]);

  // Построение полного списка вопросов с учетом условий и ветвлений
  const buildQuestionsList = () => {
    const questions: ExtendedQuestion[] = [];

    quizSections.forEach(section => {
      // Проверяем условие показа секции
      if (section.condition && !quizStore.checkCondition(section.condition)) {
        return; // Пропускаем секцию
      }

      // Добавляем основные вопросы секции
      section.questions.forEach(question => {
        // Проверяем условие показа вопроса
        if (question.condition && !quizStore.checkCondition(question.condition)) {
          return; // Пропускаем вопрос
        }

        questions.push({
          ...question,
          sectionId: section.id,
          sectionTitle: section.title
        });
      });

      // Добавляем условные вопросы для B2B/B2C в секции commerce
      if (section.id === 'commerce') {
        // B2B вопросы
        b2bQuestions.forEach(question => {
          if (question.condition && quizStore.checkCondition(question.condition)) {
            questions.push({
              ...question,
              sectionId: section.id,
              sectionTitle: section.title
            });
          }
        });

        // B2C вопросы  
        b2cQuestions.forEach(question => {
          if (question.condition && quizStore.checkCondition(question.condition)) {
            questions.push({
              ...question,
              sectionId: section.id,
              sectionTitle: section.title
            });
          }
        });
      }
    });

    setAllQuestions(questions);

    // Восстанавливаем позицию если есть сохраненное состояние
    const state = quizStore.getState();
    if (state.answers.length > 0 && !state.completed) {
      // Находим позицию последнего отвеченного вопроса
      const lastAnsweredIndex = questions.findIndex(q => 
        !quizStore.getAnswer(q.id)
      );
      if (lastAnsweredIndex >= 0) {
        setCurrentQuestionIndex(lastAnsweredIndex);
      } else {
        setCurrentQuestionIndex(Math.min(state.currentQuestionIndex, questions.length - 1));
      }
    }
  };

  const handleNext = (answer: string | string[]) => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    // Сохраняем ответ
    quizStore.saveAnswer(currentQuestion.id, answer);
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    // Переходим к следующему вопросу
    if (currentQuestionIndex < allQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      quizStore.updatePosition(allQuestions[nextIndex].sectionId, nextIndex);
    } else {
      // Завершаем квиз
      quizStore.complete();
      
      // Отправляем результаты на webhook
      (quizStore as any).sendToWebhook().catch((error: any) => {
        console.error('Failed to send quiz results:', error);
      });
      
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      quizStore.updatePosition(allQuestions[prevIndex].sectionId, prevIndex);
    }
  };

  // Если еще строим список вопросов
  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Подготовка вопросов...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Ошибка: вопрос не найден</p>
      </div>
    );
  }

  // Преобразуем в формат компонента QuizQuestion
  const questionForComponent = {
    id: currentQuestion.id,
    type: currentQuestion.type as 'single' | 'multiple' | 'text' | 'textarea',
    title: currentQuestion.title,
    description: currentQuestion.description,
    options: currentQuestion.options,
    placeholder: currentQuestion.placeholder,
    required: currentQuestion.required
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Индикатор текущей секции */}
      <div className="bg-card border-b px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground">
            {currentQuestion.sectionTitle} • Вопрос {currentQuestionIndex + 1} из {allQuestions.length}
          </p>
        </div>
      </div>

      <QuizQuestionComponent
        question={questionForComponent}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={allQuestions.length}
        onNext={handleNext}
        onPrev={handlePrev}
        canGoBack={currentQuestionIndex > 0}
        initialAnswer={answers[currentQuestion.id]}
      />
    </div>
  );
};

export default QuizEngine;
