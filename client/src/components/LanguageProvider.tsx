import React, { useState, useEffect, ReactNode } from 'react';
import { LanguageContext, Language, getTranslation } from '../lib/i18n';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to German (main market)
    const saved = localStorage.getItem('queueup-language');
    return (saved as Language) || 'de';
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem('queueup-language', language);
    
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => getTranslation(language, key);

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}