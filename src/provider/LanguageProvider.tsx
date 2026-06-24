import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { I18nManager, View } from 'react-native';

import ar from '@/src/locales/ar.json';
import en from '@/src/locales/en.json';
import { Language } from '@/src/types';

/**
 * Translation key type generated from the English locale file.
 *
 * This ensures:
 * - translation key autocomplete
 * - compile-time safety
 * - prevention of invalid translation keys
 */
type TranslationKeys = keyof typeof en;

/**
 * Language context contract shared across the application.
 */
interface LanguageContextProps {
  lang: Language;
  isRTL: boolean;

  /**
   * Translation helper function.
   *
   * @param key - Translation key from locale JSON
   *
   * @returns Localized translated string
   */
  t: (key: TranslationKeys) => string;

  /**
   * Updates the current application language.
   *
   * @param newLang - New language to apply
   */
  changeLanguage: (
    newLang: Language
  ) => Promise<void>;
}

/**
 * Global language context used for:
 * - translations
 * - RTL/LTR layout handling
 * - language persistence
 */
const LanguageContext = createContext<
  LanguageContextProps | undefined
>(undefined);

/**
 * Static translation resources.
 */
const translations = {
  en,
  ar,
};

/**
 * Global language provider responsible for:
 * - language persistence
 * - device language detection
 * - RTL/LTR layout switching
 * - translation handling
 *
 * Unlike traditional RTL implementations that require
 * app reloads/restarts, this provider dynamically
 * switches layout direction using a parent container.
 *
 * Benefits of this approach:
 * - avoids unnecessary app reloads
 * - prevents re-fetching remote data
 * - preserves app state/navigation
 * - enables smooth language switch animations
 * - improves overall user experience
 */
function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Current active application language.
   */
  const [lang, setLang] =
    useState<Language>('en');

  /**
   * Prevents rendering until language initialization
   * completes from storage or device locale.
   */
  const [isReady, setIsReady] = useState(false);

  /**
   * Bootstrap application language on startup.
   *
   * Priority:
   * 1. Saved user preference from AsyncStorage
   * 2. Device/system locale
   * 3. English fallback
   */
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        /**
         * Load previously selected language
         * from local device storage.
         */
        const savedLang =
          await AsyncStorage.getItem(
            'appLanguage'
          );

        if (
          savedLang === 'en' ||
          savedLang === 'ar'
        ) {
          setLang(savedLang);

          applyRTL(savedLang);
        } else {
          /**
           * Fallback to device language
           * when no saved preference exists.
           */
          const deviceLang =
            Localization.getLocales()[0]
              ?.languageCode || 'en';

          const fallback: Language =
            deviceLang === 'ar'
              ? 'ar'
              : 'en';

          setLang(fallback);

          applyRTL(fallback);
        }
      } catch (error) {
        console.error(
          'Failed to initialize language:',
          error
        );
      } finally {
        setIsReady(true);
      }
    };

    bootstrapAsync();
  }, []);

  /**
   * Translation helper used throughout the application.
   *
   * Falls back to the translation key itself if
   * the requested translation is missing.
   */
  const t = (key: TranslationKeys): string => {
    const currentTranslations =
      translations[lang];

    return currentTranslations?.[key] || key;
  };

  /**
   * Applies RTL/LTR layout configuration.
   *
   * This updates React Native's internal RTL handling
   * while layout direction itself is controlled using
   * the parent container View below.
   */
  const applyRTL = (
    newLang: Language
  ) => {
    const needsRTL = newLang === 'ar';

    I18nManager.allowRTL(needsRTL);

    I18nManager.forceRTL(needsRTL);
  };

  /**
   * Changes application language dynamically.
   *
   * The selected language is persisted locally
   * to restore user preference on next launch.
   */
  const changeLanguage = async (
    newLang: Language
  ) => {
    setLang(newLang);

    await AsyncStorage.setItem(
      'appLanguage',
      newLang
    );

    applyRTL(newLang);
  };

  /**
   * Avoid rendering the application until
   * language initialization is completed.
   */
  if (!isReady) {
    return null;
  }

  /**
   * Current layout direction state.
   */
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
      {/**
             * Root directional wrapper.
             *
             * Instead of forcing a full application reload
             * during language switching, direction is updated
             * dynamically here using RTL/LTR styles.
             *
             * This approach:
             * - keeps app state alive
             * - prevents unnecessary API refetches
             * - enables smoother UX transitions
             * - allows animated language switching
             */}
      <View
        style={{
          flex: 1,
          direction: isRTL
            ? 'rtl'
            : 'ltr',
        }}
      >
        {children}
      </View>
    </LanguageContext.Provider>
  );
}

/**
 * Language context hook.
 *
 * Provides access to:
 * - current language
 * - translations
 * - RTL state
 * - language switching
 */
function useLang() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLang must be used within a LanguageProvider'
    );
  }

  return context;
}

export {
  LanguageProvider,
  useLang
};

export type {
  LanguageContext
};

