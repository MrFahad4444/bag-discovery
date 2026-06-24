import { LanguageToggle } from '@/src/components';
import { Stack } from 'expo-router';

/**
 * Layout configuration for the Bag feature routes.
 *
 * This stack handles all bag-related screens,
 * currently focused on the dynamic [id] detail screen.
 */
export default function BagLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="[id]"
                options={{
                    title: 'Bag Details',
                    headerShown: false,
                    headerBackTitle: 'Back',
                    headerTintColor: '#3B82F6',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    // Language switch stays available in header
                    headerRight: () => <>
                        <LanguageToggle />
                    </>,
                }}
            />
        </Stack>
    );
}