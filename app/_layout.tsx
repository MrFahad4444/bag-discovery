import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerBackTitle: 'Back',
                    headerTintColor: '#000000',
                    headerTitleStyle: {
                        fontWeight: '900',
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Bag Discovery',
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="bag"
                    options={{
                        title: 'Bag Details',
                    }}
                />
                <Stack.Screen
                    name="confirmation"
                    options={{
                        title: 'Confirmation',
                    }}
                />
            </Stack>
        </QueryClientProvider>
    );
}