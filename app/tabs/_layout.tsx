import { useTranslation } from '@/src/hooks'; // Verify path to your translation hook
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

/**
 * Bottom tab navigation layout for the main app sections.
 *
 * Includes:
 * - Home (bag discovery)
 * - Reservations
 * - Maps view
 *
 * Also handles platform-specific tab bar sizing
 * for better UI consistency on Android vs iOS.
 */
export default function TabLayout() {
    const { t } = useTranslation();

    /**
     * Adjust tab bar height dynamically for newer Android versions.
     */
    const isAndroid15OrHigher =
        Platform.OS === 'android' && Number(Platform.Version) >= 35;

    const tabHeight = isAndroid15OrHigher ? 80 : 60;
    const paddingBottom = isAndroid15OrHigher ? 24 : 8;

    return (
        <Tabs
            screenOptions={{
                headerShown: false, // Disables tab headers so your root stack headers can control titles
                tabBarActiveTintColor: '#3B82F6',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    height: tabHeight,
                    paddingBottom: paddingBottom,
                    paddingTop: 8,
                },
            }}
        >
            {/* Bag Discovery */}
            <Tabs.Screen
                name="home"
                options={{
                    title: t('home'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="local-mall" size={size} color={color} />
                    ),
                }}
            />

            {/* User reservations list */}
            <Tabs.Screen
                name="reservations"
                options={{
                    title: t('reservations'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="bookmark" size={size} color={color} />
                    ),
                }}
            />

            {/* Map */}
            <Tabs.Screen
                name="maps"
                options={{
                    title: t('maps'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="map" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
