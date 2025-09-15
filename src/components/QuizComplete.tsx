import { Button } from '@/components/ui/button';
import { CheckCircle2, Download, Calendar, Phone } from 'lucide-react';
import { quizStore } from '@/quiz/store';

interface QuizCompleteProps {
  onRestart: () => void;
}

const QuizComplete = ({ onRestart }: QuizCompleteProps) => {
  const handleDownloadJSON = () => {
    const result = quizStore.exportResult();
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // Формируем имя файла с датой и временем
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const userInfo = result.telegramUser;
    const userStr = userInfo ? `_${userInfo.username || userInfo.id}` : '';
    
    link.download = `quiz_result_${dateStr}${userStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center max-w-3xl mx-auto">
        {/* Success icon */}
        <div className="mb-8 animate-fade-up">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-infinity rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Диагностика завершена!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Спасибо за ваши ответы. Мы проанализируем информацию и подготовим персональные рекомендации.
          </p>
        </div>

        {/* Results info */}
        <div className="bg-card rounded-2xl p-8 shadow-lg mb-8 animate-slide-in">
          <h3 className="text-2xl font-semibold mb-6 text-foreground">Что дальше?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold mb-2">Анализ результатов</h4>
                <p className="text-muted-foreground text-sm">
                  В течение 24 часов мы подготовим детальный отчет с рекомендациями по автоматизации
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold mb-2">Консультация</h4>
                <p className="text-muted-foreground text-sm">
                  Бесплатная 30-минутная встреча для обсуждения возможностей улучшения
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-card rounded-xl p-6 border border-border mb-8 animate-fade-up">
          <div className="flex items-center justify-center space-x-4 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span className="text-sm">Мы свяжемся с вами в ближайшее время</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
          <Button 
            onClick={onRestart}
            variant="outline"
            size="lg"
            className="px-6"
          >
            Пройти еще раз
          </Button>
          
          <Button 
            onClick={handleDownloadJSON}
            variant="outline"
            size="lg"
            className="px-6"
          >
            <Download className="w-4 h-4 mr-2" />
            Скачать JSON
          </Button>
          
          <Button 
            className="btn-infinity px-6"
            size="lg"
            onClick={() => window.open('https://t.me/singularityagency', '_blank')}
          >
            Связаться с нами
          </Button>
        </div>

        {/* Company info */}
        <div className="mt-12 animate-fade-up">
          <div className="text-3xl mb-2 font-bold text-primary">∞</div>
          <p className="text-muted-foreground text-sm">
            <span className="font-semibold text-foreground">Singularity Agency</span> — 
            автоматизация бизнес-процессов для роста вашей компании
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizComplete;