import { useTranslation } from '@/src/hooks';
import { Text, TouchableOpacity } from 'react-native';

/**
 * Language toggle button that switches between English and Arabic.
 *
 * Uses global translation context to:
 * - read current language
 * - update language dynamically
 *
 * Behavior:
 * - If current language is Arabic → switches to English
 * - If current language is English → switches to Arabic
 *
 * UI:
 * - Displays the *next language* the user will switch to
 * - Simple button with visual feedback styling
 */
export default function LanguageToggle() {
    const { language, setLanguage } = useTranslation();

    const isArabic = language === 'ar';

    const handleToggle = () => {
        // If current is Arabic, switch to English. Otherwise, switch to Arabic.
        const nextLanguage = isArabic ? 'en' : 'ar';
        setLanguage(nextLanguage);
    };

    return (
        <TouchableOpacity
            onPress={handleToggle}
            className="px-5 h-10 bg-gray-100 border border-gray-200 rounded-full active:bg-gray-200 justify-center items-center"
        >
            <Text className="text-blue-600 font-bold text-md">
                {/* Show the target language they will switch to upon clicking */}
                {isArabic ? 'English' : 'العربية'}
            </Text>
        </TouchableOpacity>
    );
}
