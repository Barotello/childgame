import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LOCALES, translations, type Locale, type TranslationKey } from '@/constants/translations';

const STORAGE_KEY = 'kelime-bulmaca:locale:v1';
const DEFAULT_LOCALE: Locale = 'tr';

// Only expose languages whose complete vocabulary has passed an editorial
// review. Other UI translations remain in the bundle for future rollout.
const AVAILABLE_LOCALES: Locale[] = LOCALES.filter(
  (locale) => locale === 'tr' || locale === 'en',
);

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
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && AVAILABLE_LOCALES.includes(saved as Locale)) {
          setLocaleState(saved as Locale);
        }
      } catch {
        // ignore storage read failures
      }
    })();
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // ignore storage write failures
    });
  };

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      setLocale,
      t: (key, vars) => interpolate(translations[locale][key], vars),
      availableLocales: AVAILABLE_LOCALES,
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
