import React, { createContext, useContext, useMemo } from 'react';
import { LOCALES, translations, type Locale, type TranslationKey } from '@/constants/translations';

const DEFAULT_LOCALE: Locale = 'en';
const AVAILABLE_LOCALES: Locale[] = [...LOCALES];

function interpolate(text: string, vars?: Record<string, string | number>) {
  if (!vars) return text;
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, text);
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  availableLocales: Locale[];
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<I18nContextValue>(() => {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key, vars) => interpolate(translations[DEFAULT_LOCALE][key], vars),
      availableLocales: AVAILABLE_LOCALES,
    };
  }, []);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
