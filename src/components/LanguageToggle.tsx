import { useTranslation } from '@/src/hooks';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LanguageToggle() {
    const { language, setLanguage } = useTranslation();

    return (
        <View className="flex-row gap-2">
            {/* English Button */}
            <TouchableOpacity
                onPress={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg ${language === 'en' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
            >
                <Text
                    className={`font-semibold ${language === 'en' ? 'text-white' : 'text-gray-700'
                        }`}
                >
                    EN
                </Text>
            </TouchableOpacity>

            {/* Arabic Button */}
            <TouchableOpacity
                onPress={() => setLanguage('ar')}
                className={`px-4 py-2 rounded-lg ${language === 'ar' ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
            >
                <Text
                    className={`font-semibold ${language === 'ar' ? 'text-white' : 'text-gray-700'
                        }`}
                >
                    العربية
                </Text>
            </TouchableOpacity>
        </View>
    );
}