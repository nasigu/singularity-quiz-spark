import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Target, Rocket } from 'lucide-react';

interface QuizWelcomeProps {
  onStart: () => void;
}

const QuizWelcome = ({ onStart }: QuizWelcomeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1200);
    const timer3 = setTimeout(() => setCurrentStep(3), 1800);
    const timer4 = setTimeout(() => setShowButton(true), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-gradient-infinity blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-accent blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo and company name */}
        <div className={`mb-8 transition-all duration-800 ${currentStep >= 0 ? 'animate-fade-up opacity-100' : 'opacity-0'}`}>
          <div className="infinity-logo text-6xl mb-4">∞</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            <span className="text-gradient">Singularity Agency</span>
          </h1>
          <p className="text-xl text-muted-foreground">Автоматизация бизнес-процессов</p>
        </div>

        {/* Welcome message */}
        <div className={`mb-12 transition-all duration-800 delay-200 ${currentStep >= 1 ? 'animate-fade-up opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-foreground">
            Добро пожаловать в диагностику вашего бизнеса
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Пройдите короткий опрос, чтобы мы поняли, как лучше автоматизировать 
            ваши процессы и увеличить эффективность компании
          </p>
        </div>

        {/* Features */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-800 delay-400 ${currentStep >= 2 ? 'animate-slide-in opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 quiz-card">
            <div className="w-12 h-12 rounded-full bg-gradient-infinity flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Быстро</h3>
            <p className="text-muted-foreground text-center text-sm">
              Всего 5-7 минут вашего времени
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 quiz-card">
            <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Точно</h3>
            <p className="text-muted-foreground text-center text-sm">
              Персональные рекомендации для вашего бизнеса
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 quiz-card">
            <div className="w-12 h-12 rounded-full bg-gradient-infinity flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Эффективно</h3>
            <p className="text-muted-foreground text-center text-sm">
              Конкретный план действий
            </p>
          </div>
        </div>

        {/* Start button */}
        <div className={`transition-all duration-800 delay-600 ${showButton ? 'animate-fade-up opacity-100' : 'opacity-0'}`}>
          <Button 
            onClick={onStart}
            size="lg"
            className="btn-infinity px-8 py-4 text-lg font-semibold group"
          >
            Начать диагностику
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizWelcome;