import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerBackTitle: 'Back',
                    headerTintColor: '#3B82F6',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Bags',
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="bag/[id]"
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