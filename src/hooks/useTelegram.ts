import { useEffect, useState } from 'react';

// Типы для Telegram WebApp API
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    hint_color?: string;
    bg_color?: string;
    text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: any) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

// Расширяем window для TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramUserInfo {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  user_link?: string; // @username или ссылка на профиль
}

export interface UseTelegramReturn {
  isTelegram: boolean;
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  userInfo: TelegramUserInfo | null;
  initData: string;
  isReady: boolean;
}

export const useTelegram = (): UseTelegramReturn => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [userInfo, setUserInfo] = useState<TelegramUserInfo | null>(null);
  const [initData, setInitData] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Проверяем, запущено ли приложение в Telegram
    const checkTelegram = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        setIsTelegram(true);
        setWebApp(tg);
        setInitData(tg.initData);
        
        // Получаем данные пользователя
        if (tg.initDataUnsafe.user) {
          const userData = tg.initDataUnsafe.user;
          setUser(userData);
          
          // Формируем userInfo с user_link
          const userLink = userData.username 
            ? `@${userData.username}` 
            : `tg://user?id=${userData.id}`;
          
          setUserInfo({
            ...userData,
            user_link: userLink
          });
        }
        
        // Инициализируем WebApp
        tg.ready();
        setIsReady(true);
        
        // Расширяем viewport для лучшего отображения
        tg.expand();
        
        console.log('Telegram WebApp initialized:', {
          version: tg.version,
          platform: tg.platform,
          user: tg.initDataUnsafe.user,
          theme: tg.colorScheme
        });
      } else {
        console.log('Not running in Telegram WebApp');
        setIsReady(true);
      }
    };

    checkTelegram();
  }, []);

  return {
    isTelegram,
    webApp,
    user,
    userInfo,
    initData,
    isReady
  };
};
