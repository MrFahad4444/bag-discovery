import { Header, LanguageToggle } from '@/src/components';
import { useTranslation } from '@/src/hooks'; // 🌟 Added localization hook import
import { LanguageProvider } from '@/src/provider/LanguageProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import '../global.css';

import '@/src/utils/utilNotification';

const queryClient = new QueryClient();

/**
 * Main navigation stack for the application.
 *
 * Handles:
 * - Screen registration (tabs, bag details, confirmation)
 * - Dynamic localization for headers and titles
 * - Global header configuration
 */
function AppNavigator() {
    const { t } = useTranslation();
    const header = Header();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerBackTitle: t('back'), // Translates the native system back text dynamically
                headerTintColor: '#000000',
                headerTitleStyle: {
                    fontWeight: '900',
                },
            }}
        >
            {/* Bottom tab navigator (main app entry) */}
            <Stack.Screen
                name="tabs"
                options={header({ title: t('bagDiscovery') })}
            />

            {/* Bag detail screen */}
            <Stack.Screen
                name="bag"
                options={{
                    title: t('bagDetails'),
                    headerRight: () => <LanguageToggle />,
                }}
            />

            {/* Confirmation screen after actions */}
            <Stack.Screen
                name="confirmation"
                options={{
                    title: t('confirmation'),
                    headerRight: () => <LanguageToggle />,
                }}
            />
        </Stack>
    );
}

/**
 * Root layout of the application.
 *
 * Wraps the entire app with:
 * - React Query (server state management)
 * - Language Provider (i18n + RTL/LTR handling)
 * - Navigation system (Expo Router stack)
 */
export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                {/* 🌟 Nest the translated navigator block clean inside the provider shell */}
                <AppNavigator />
            </LanguageProvider>
        </QueryClientProvider>
    );
}
