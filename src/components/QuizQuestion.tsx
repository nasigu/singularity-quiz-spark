import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

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
}

const QuizQuestion = ({ 
  question, 
  currentQuestion, 
  totalQuestions, 
  onNext, 
  onPrev, 
  canGoBack 
}: QuizQuestionProps) => {
  const [singleAnswer, setSingleAnswer] = useState<string>('');
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState<string>('');

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
        answer = textAnswer;
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
    if (!question.required) return true;
    
    switch (question.type) {
      case 'single':
        return singleAnswer.length > 0;
      case 'multiple':
        return multipleAnswers.length > 0;
      case 'text':
      case 'textarea':
        return textAnswer.trim().length > 0;
      default:
        return true;
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
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder={question.placeholder || 'Введите ваш ответ...'}
                  className="quiz-input text-base p-4 h-14"
                />
              </div>
            )}

            {question.type === 'textarea' && (
              <div>
                <Textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder={question.placeholder || 'Введите ваш ответ...'}
                  className="quiz-input text-base p-4 min-h-32 resize-none"
                  rows={4}
                />
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