import { useState } from 'react';
import QuizWelcome from '@/components/QuizWelcome';
import QuizQuestion, { Question } from '@/components/QuizQuestion';
import QuizComplete from '@/components/QuizComplete';

// Sample questions for demonstration
const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'single',
    title: 'Какой размер вашей компании?',
    description: 'Выберите наиболее подходящий вариант',
    options: [
      'Стартап (до 10 сотрудников)',
      'Малый бизнес (10-50 сотрудников)', 
      'Средний бизнес (50-250 сотрудников)',
      'Крупная компания (более 250 сотрудников)'
    ],
    required: true
  },
  {
    id: '2',
    type: 'multiple',
    title: 'Какие процессы хотите автоматизировать?',
    description: 'Можете выбрать несколько вариантов',
    options: [
      'Продажи и CRM',
      'Маркетинг и реклама',
      'Финансы и отчетность',
      'HR и управление персоналом',
      'Производство и логистика',
      'Документооборот'
    ],
    required: true
  },
  {
    id: '3',
    type: 'text',
    title: 'В какой сфере работает ваша компания?',
    placeholder: 'Например: интернет-магазин, производство, услуги...',
    required: true
  },
  {
    id: '4',
    type: 'textarea',
    title: 'Опишите главную проблему в работе',
    description: 'Что занимает больше всего времени или вызывает сложности?',
    placeholder: 'Расскажите подробнее о ваших вызовах...',
    required: false
  }
];

type QuizStep = 'welcome' | 'questions' | 'complete';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  console.log('Index component rendered, currentStep:', currentStep);

  const handleStart = () => {
    console.log('handleStart called');
    setCurrentStep('questions');
    setCurrentQuestion(0);
  };

  const handleAnswerNext = (answer: string | string[]) => {
    const question = sampleQuestions[currentQuestion];
    setAnswers(prev => ({ ...prev, [question.id]: answer }));

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setCurrentStep('complete');
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep('welcome');
    setCurrentQuestion(0);
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStep === 'welcome' && (
        <QuizWelcome onStart={handleStart} />
      )}

      {currentStep === 'questions' && (
        <QuizQuestion
          question={sampleQuestions[currentQuestion]}
          currentQuestion={currentQuestion + 1}
          totalQuestions={sampleQuestions.length}
          onNext={handleAnswerNext}
          onPrev={handlePrev}
          canGoBack={currentQuestion > 0}
        />
      )}

      {currentStep === 'complete' && (
        <QuizComplete onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Index;
