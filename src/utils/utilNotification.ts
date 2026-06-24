import * as Notifications from 'expo-notifications';
import { withErrorHandling } from './utilhelper';

/**
 * Foreground notification behavior
 * Must be registered once at app startup.
 */
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Initialize notification system (call once in App root)
 * - Requests permission (if not granted)
 * - Sets Android notification channel
 */
async function initNotifications(): Promise<void> {
    await withErrorHandling(async () => {
        const settings = await Notifications.getPermissionsAsync();

        if (settings.status !== 'granted') {
            await Notifications.requestPermissionsAsync();
        }
    }, 'Error initializing notifications');
}

/**
 * Show a local notification immediately
 *
 * Use cases:
 * - success messages
 * - order updates
 * - reminders
 */
async function showLocalNotification(
    title: string,
    body: string
): Promise<void> {
    return withErrorHandling(async () => {
        const { status } = await Notifications.getPermissionsAsync();

        if (status !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
            },
            trigger: null,
        });
    }, 'Error triggering local notification');
}

export { initNotifications, showLocalNotification };
