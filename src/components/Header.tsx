import LanguageToggle from '@/src/components/LanguageToggle';
import { useTranslation } from '@/src/hooks';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

interface LocalizedHeaderProps {
    title: string;
    options?: React.ComponentProps<typeof Stack.Screen>['options'];
}

export default function useLocalizedHeader() {
    const { isRTL } = useTranslation();

    return ({ title, options = {} }: LocalizedHeaderProps): React.ComponentProps<typeof Stack.Screen>['options'] => {

        return {
            title,
            headerShown: true,
            headerTitleAlign: 'center' as const, // Keeps title locked in the center

            // Render the toggle on the Left for Arabic (RTL) or Right for English (LTR)
            headerLeft: isRTL ? () => <View className="pl-4"><LanguageToggle /></View> : undefined,
            headerRight: !isRTL ? () => <View className="pr-4"><LanguageToggle /></View> : undefined,

            ...options, // Keeps external layout option overrides working perfectly
        };
    };
}
