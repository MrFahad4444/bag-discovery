import { useLang } from '@/src/provider/LanguageProvider';

/**
 * Lightweight translation hook built on top of
 * the global language context.
 *
 * Provides:
 * - translation helper
 * - current language
 * - RTL state
 * - language switching
 *
 * This wrapper simplifies imports across screens
 * and components by exposing cleaner naming.
 */
function useTranslation() {
    const {
        lang,
        changeLanguage,
        isRTL,
        t,
    } = useLang();

    return {
        t,
        language: lang,
        setLanguage: changeLanguage,
        isRTL,
    };
}

export { useTranslation };
