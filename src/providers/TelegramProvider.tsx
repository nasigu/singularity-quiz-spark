import React, { createContext, useContext, ReactNode } from 'react';
import { useTelegram, UseTelegramReturn } from '@/hooks/useTelegram';

interface TelegramContextType extends UseTelegramReturn {}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  const telegramData = useTelegram();

  return (
    <TelegramContext.Provider value={telegramData}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegramContext = (): TelegramContextType => {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegramContext must be used within a TelegramProvider');
  }
  return context;
};
