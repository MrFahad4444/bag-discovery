import LanguageToggle from '@/src/components/LanguageToggle';
import { useTranslation } from '@/src/hooks';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

/**
 * Custom Component that generates localized Stack screen headers
 * with built-in RTL/LTR support and language toggle integration.
 *
 * Designed for Expo Router Stack screens to:
 * - automatically align header based on language direction
 * - place LanguageToggle on correct side (RTL/LTR aware)
 * - allow external override of default header options
 *
 * @returns Function that builds Stack.Screen header options
 *
 * @param title - Screen title displayed in the header
 * @param options - Optional overrides for Stack.Screen header configuration
 */
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
            headerLeft: isRTL ? () => <View ><LanguageToggle /></View> : undefined,
            headerRight: !isRTL ? () => <View ><LanguageToggle /></View> : undefined,

            ...options, // Keeps external layout option overrides working perfectly
        };
    };
}
