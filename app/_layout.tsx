import { Header, LanguageToggle } from '@/src/components';
import { useTranslation } from '@/src/hooks'; // 🌟 Added localization hook import
import { LanguageProvider } from '@/src/provider/LanguageProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import '../global.css';

const queryClient = new QueryClient();

// 🌟 Inner navigator component created to consume Context translation functions safely
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
            <Stack.Screen
                name="tabs"
                options={header({ title: t('bagDiscovery') })}
            />

            <Stack.Screen
                name="bag"
                options={{
                    title: t('bagDetails'),
                    headerRight: () => <LanguageToggle />,
                }}
            />

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
