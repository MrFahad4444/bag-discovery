import { useTranslation } from '@/src/hooks'; // Verify path to your translation hook
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
    const { t } = useTranslation();

    const isAndroid15OrHigher =
        Platform.OS === 'android' && Number(Platform.Version) >= 35;

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
                    height: 60,
                    paddingBottom: paddingBottom,
                    paddingTop: 8,
                },
            }}
        >
            {/* 1. Discover Bags Screen */}
            <Tabs.Screen
                name="home"
                options={{
                    title: t('home'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="local-mall" size={size} color={color} />
                    ),
                }}
            />

            {/* 2. Reservations List Screen */}
            <Tabs.Screen
                name="reservations"
                options={{
                    title: t('reservations'),
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="bookmark" size={size} color={color} />
                    ),
                }}
            />

            {/* 3. Maps / Discovery View Screen */}
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
