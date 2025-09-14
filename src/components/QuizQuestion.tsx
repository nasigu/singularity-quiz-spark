import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export type QuestionType = 'single' | 'multiple' | 'text' | 'textarea';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface QuizQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onNext: (answer: string | string[]) => void;
  onPrev: () => void;
  canGoBack: boolean;
  initialAnswer?: string | string[];
}

const QuizQuestion = ({ 
  question, 
  currentQuestion, 
  totalQuestions, 
  onNext, 
  onPrev, 
  canGoBack,
  initialAnswer
}: QuizQuestionProps) => {
  const [singleAnswer, setSingleAnswer] = useState<string>('');
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  // Функции валидации
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return null; // Пустой email проверится через required
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Введите корректный email адрес';
    }
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) return null; // Пустой телефон может быть optional
    const phoneRegex = /^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Введите корректный номер телефона';
    }
    return null;
  };

  const validateTextInput = (value: string): string | null => {
    if (question.id === 'contact_email') {
      return validateEmail(value);
    }
    if (question.id === 'contact_phone') {
      return validatePhone(value);
    }
    return null;
  };

  // Инициализируем состояние при смене вопроса или начального ответа
  useEffect(() => {
    // Очищаем ошибку валидации при смене вопроса
    setValidationError('');
    
    if (initialAnswer) {
      // Восстанавливаем сохраненный ответ
      if (question.type === 'single') {
        setSingleAnswer(initialAnswer as string);
        setMultipleAnswers([]);
        setTextAnswer('');
      } else if (question.type === 'multiple') {
        setSingleAnswer('');
        setMultipleAnswers(initialAnswer as string[]);
        setTextAnswer('');
      } else if (question.type === 'text' || question.type === 'textarea') {
        setSingleAnswer('');
        setMultipleAnswers([]);
        // Для телефона форматируем сохраненное значение
        if (question.id === 'contact_phone' && initialAnswer) {
          setTextAnswer(formatPhone(initialAnswer as string));
        } else {
          setTextAnswer(initialAnswer as string);
        }
      }
    } else {
      // Очищаем все состояния для нового вопроса
      setSingleAnswer('');
      setMultipleAnswers([]);
      // Для поля телефона устанавливаем +7 по умолчанию
      if (question.id === 'contact_phone') {
        setTextAnswer('+7');
      } else {
        setTextAnswer('');
      }
    }
  }, [question.id, initialAnswer, question.type]);

  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  const handleSingleSelect = (value: string) => {
    setSingleAnswer(value);
  };

  const handleMultipleSelect = (value: string) => {
    setMultipleAnswers(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleNext = () => {
    let answer: string | string[];
    
    switch (question.type) {
      case 'single':
        answer = singleAnswer;
        break;
      case 'multiple':
        answer = multipleAnswers;
        break;
      case 'text':
      case 'textarea':
        // Для телефона сохраняем "чистое" значение без форматирования
        if (question.id === 'contact_phone') {
          answer = textAnswer.replace(/[^\d+]/g, '');
        } else {
          answer = textAnswer;
        }
        
        // Проверяем валидацию для текстовых полей
        const validationError = validateTextInput(textAnswer);
        if (validationError) {
          setValidationError(validationError);
          return;
        }
        setValidationError('');
        break;
      default:
        answer = '';
    }

    if (question.required && (!answer || (Array.isArray(answer) && answer.length === 0))) {
      return;
    }

    onNext(answer);
  };

  const canProceed = () => {
    if (!question.required) {
      // Для необязательных полей проверяем только валидацию если поле заполнено
      if ((question.type === 'text' || question.type === 'textarea') && textAnswer.trim()) {
        const validationError = validateTextInput(textAnswer);
        return !validationError;
      }
      return true;
    }
    
    switch (question.type) {
      case 'single':
        return singleAnswer.length > 0;
      case 'multiple':
        return multipleAnswers.length > 0;
      case 'text':
      case 'textarea':
        if (textAnswer.trim().length === 0) return false;
        // Проверяем валидацию для текстовых полей
        const validationError = validateTextInput(textAnswer);
        return !validationError;
      default:
        return true;
    }
  };

  // Обработчик изменения текстового поля с валидацией в реальном времени
  const handleTextChange = (value: string) => {
    // Специальная обработка для поля телефона
    if (question.id === 'contact_phone') {
      // Не позволяем удалить символ "+"
      if (!value.startsWith('+')) {
        return; // Игнорируем изменение
      }
      
      // Применяем форматирование
      const formatted = formatPhone(value);
      setTextAnswer(formatted);
    } else {
      setTextAnswer(value);
    }
    
    // Очищаем ошибку при начале ввода
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="w-full bg-muted h-1">
        <div 
          className="progress-bar transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          {/* Question header */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="text-sm text-muted-foreground mb-2">
              Вопрос {currentQuestion} из {totalQuestions}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {question.title}
            </h2>
            {question.description && (
              <p className="text-muted-foreground text-lg">
                {question.description}
              </p>
            )}
          </div>

          {/* Question content */}
          <div className="bg-card rounded-2xl p-8 shadow-lg quiz-card animate-slide-in">
            {question.type === 'single' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`quiz-option ${singleAnswer === option ? 'selected' : ''}`}
                    onClick={() => handleSingleSelect(option)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center">
                        {singleAnswer === option && (
                          <div className="w-3 h-3 rounded-full bg-infinity"></div>
                        )}
                      </div>
                      <Label className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'multiple' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`quiz-option ${multipleAnswers.includes(option) ? 'selected' : ''}`}
                    onClick={() => handleMultipleSelect(option)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded border-2 border-border flex items-center justify-center">
                        {multipleAnswers.includes(option) && (
                          <Check className="w-3 h-3 text-primary" />
                        )}
                      </div>
                      <Label className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <div>
                <Input
                  value={textAnswer}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={question.placeholder || 'Введите ваш ответ...'}
                  className={`quiz-input text-base p-4 h-14 ${validationError ? 'border-red-500' : ''}`}
                />
                {validationError && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            )}

            {question.type === 'textarea' && (
              <div>
                <Textarea
                  value={textAnswer}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={question.placeholder || 'Введите ваш ответ...'}
                  className={`quiz-input text-base p-4 min-h-32 resize-none ${validationError ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {validationError && (
                  <div className="flex items-center mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              disabled={!canGoBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn-infinity flex items-center space-x-2"
            >
              <span>{currentQuestion === totalQuestions ? 'Завершить' : 'Далее'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;