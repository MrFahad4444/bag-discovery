import * as Notifications from 'expo-notifications';
import { withErrorHandling } from './utilhelper';

/**
 * Configure how notifications behave while the app
 * is running in the foreground.
 *
 * Expo SDK 53 introduced:
 * - shouldShowBanner
 * - shouldShowList
 *
 * Without these flags, foreground notifications may
 * not appear correctly on newer platforms/devices.
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
 * Displays an instant local notification on the device.
 *
 * Automatically:
 * - requests notification permission
 * - schedules the notification immediately
 * - handles runtime errors safely
 *
 * Common use cases:
 * - order updates
 * - reminders
 * - success messages
 * - background task alerts
 *
 * @param title - Notification title displayed to the user
 * @param body - Main notification message/content
 *
 * @returns Promise that resolves once the notification is scheduled
 */
async function showLocalNotification(
    title: string,
    body: string
): Promise<void> {
    return withErrorHandling(
        async () => {
            /**
             * Request notification permissions from the user.
             *
             * On iOS this is required before showing notifications.
             * Android may auto-grant permissions depending on version.
             */
            const { status } =
                await Notifications.requestPermissionsAsync();

            if (status !== 'granted') {
                console.warn(
                    'Notification permissions were denied by the user.'
                );
                return;
            }

            /**
             * Schedule a local notification instantly.
             *
             * Setting trigger to null tells Expo to display
             * the notification immediately.
             */
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                },
                trigger: null,
            });
        },
        'Error triggering local notification'
    );
}

export { showLocalNotification };

