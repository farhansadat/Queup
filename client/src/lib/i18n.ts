import { createContext, useContext } from 'react';
import translations from '../../../shared/translations.json';

export type Language = 'en' | 'de';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found in fallback
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function getStoreTypeLabels(language: Language, storeType: string) {
  const labels = getTranslation(language, `business_labels.${storeType}`) as any;
  
  if (typeof labels === 'object') {
    return {
      staffLabel: labels.staff || getTranslation(language, 'business_labels.other.staff'),
      customerLabel: labels.customer || getTranslation(language, 'business_labels.other.customer'),
      queueLabel: labels.queue || getTranslation(language, 'business_labels.other.queue'),
      waitLabel: labels.wait || getTranslation(language, 'business_labels.other.wait'),
      servedLabel: labels.served || getTranslation(language, 'business_labels.other.served')
    };
  }
  
  // Fallback to 'other' labels
  const fallbackLabels = getTranslation(language, 'business_labels.other') as any;
  return {
    staffLabel: fallbackLabels.staff,
    customerLabel: fallbackLabels.customer,
    queueLabel: fallbackLabels.queue,
    waitLabel: fallbackLabels.wait,
    servedLabel: fallbackLabels.served
  };
}