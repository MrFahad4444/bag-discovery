import { MaterialIcons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import '../global.css';


function ReservationsButton() {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push('/reservations')}
            className="mr-4"
        >
            <MaterialIcons name="bookmark" size={24} color="#3B82F6" />
        </TouchableOpacity>
    );
}

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
                        headerRight: () => <ReservationsButton />,
                    }}
                />
                <Stack.Screen
                    name="bag"
                    options={{
                        title: 'Bag Details',
                    }}
                />
                <Stack.Screen
                    name="reservations"
                    options={{
                        title: 'My Reservations',
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