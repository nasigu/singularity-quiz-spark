import { useState, useEffect } from 'react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import { quizStore } from '@/quiz/store';
import QuizWelcome from '@/components/QuizWelcome';
import QuizComplete from '@/components/QuizComplete';
import QuizEngine from '@/quiz/QuizEngine';

type QuizStep = 'welcome' | 'questions' | 'complete';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const { isTelegram, userInfo, isReady } = useTelegramContext();

  // Сохраняем данные пользователя Telegram при инициализации
  useEffect(() => {
    if (isReady && isTelegram && userInfo) {
      quizStore.setTelegramUser(userInfo);
      console.log('Telegram user data saved:', userInfo);
    }
  }, [isReady, isTelegram, userInfo]);

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
