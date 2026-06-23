import { Stack } from 'expo-router';

export default function BagLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Bag Details',
                    headerShown: true,
                    headerBackTitle: 'Back',
                    headerTintColor: '#3B82F6',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}
            />
        </Stack>
    );
}