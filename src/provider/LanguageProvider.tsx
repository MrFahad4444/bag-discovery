import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nManager, View } from 'react-native';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

type LanguageType = 'en' | 'ar';

type TranslationKeys = keyof typeof en;

interface LanguageContextProps {
  lang: LanguageType;
  isRTL: boolean;
  t: (key: TranslationKeys) => string;
  changeLanguage: (newLang: LanguageType) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations = { en, ar };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<LanguageType>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // 1. Check AsyncStorage first
        const savedLang = await AsyncStorage.getItem('appLanguage');

        if (savedLang === 'en' || savedLang === 'ar') {
          setLang(savedLang);
          applyRTL(savedLang);
        } else {
          // 2. Fallback to system/device locale
          const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';
          const fallback: LanguageType = deviceLang === 'ar' ? 'ar' : 'en';
          setLang(fallback);
          applyRTL(fallback);
        }
      } catch (e) {
        console.error('Failed to load language', e);
      } finally {
        setIsReady(true);
      }
    };

    bootstrapAsync();
  }, []);

  const t = (key: TranslationKeys): string => {
    const currentJson = translations[lang];
    // Looks up the key directly, falls back to the key string if missing
    return currentJson?.[key] || key;
  };

  const applyRTL = (newLang: LanguageType) => {
    const needsRTL = newLang === 'ar';
    I18nManager.allowRTL(needsRTL);
    I18nManager.forceRTL(needsRTL);
  };

  const changeLanguage = async (newLang: LanguageType) => {
    setLang(newLang);
    await AsyncStorage.setItem('appLanguage', newLang);
    applyRTL(newLang);
  };

  if (!isReady) return null; // Or return a splash screen

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isRTL,
        t,
        changeLanguage,
      }}
    >
      {/* 🌟 Every child screen rendered inside here inherits this direction layout */}
      <View style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}>
        {children}
      </View>
    </LanguageContext.Provider>
  );
};


export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within a LanguageProvider');
  return context;
};