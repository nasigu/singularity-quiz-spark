import { useState } from 'react';
import QuizWelcome from '@/components/QuizWelcome';
import QuizComplete from '@/components/QuizComplete';
import QuizEngine from '@/quiz/QuizEngine';

type QuizStep = 'welcome' | 'questions' | 'complete';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');

  console.log('Index component rendered, currentStep:', currentStep);

  const handleStart = () => {
    console.log('handleStart called');
    setCurrentStep('questions');
  };

  const handleComplete = () => {
    setCurrentStep('complete');
  };

  const handleRestart = () => {
    // Очищаем состояние квиза
    if (window.localStorage) {
      window.localStorage.removeItem('singularity-quiz-result');
    }
    setCurrentStep('welcome');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentStep === 'welcome' && (
        <QuizWelcome onStart={handleStart} />
      )}

      {currentStep === 'questions' && (
        <QuizEngine onComplete={handleComplete} />
      )}

      {currentStep === 'complete' && (
        <QuizComplete onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Index;
