import { useState } from 'react';
import { useTelegramContext } from '@/providers/TelegramProvider';
import QuizWelcome from '@/components/QuizWelcome';
import QuizComplete from '@/components/QuizComplete';
import QuizEngine from '@/quiz/QuizEngine';

type QuizStep = 'welcome' | 'questions' | 'complete';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>('welcome');
  const { isTelegram, user, isReady } = useTelegramContext();

  console.log('Index component rendered, currentStep:', currentStep);
  console.log('Telegram environment:', { isTelegram, user, isReady });

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
      {/* Индикатор среды выполнения */}
      {isReady && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isTelegram 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            {isTelegram ? (
              <span>📱 Telegram Mini App{user ? ` • ${user.first_name}` : ''}</span>
            ) : (
              <span>🌐 Web Browser</span>
            )}
          </div>
        </div>
      )}

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
