// src/hooks/useTranslation.ts
import { useLang } from '@/src/provider/LanguageProvider';

function useTranslation() {
    const { lang, changeLanguage, isRTL, t } = useLang();

    return {
        t,
        language: lang,
        setLanguage: changeLanguage,
        isRTL,
    };
}

export { useTranslation };

