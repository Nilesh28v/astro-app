import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { EKADASHI_DATA } from './ekadashiData';

const NOTIFICATION_KEY = '@ekadashi_notifications_enabled';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const requestNotificationPermissions = async () => {
    if (!Device.isDevice) {
        return false;
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    return finalStatus === 'granted';
};

export const scheduleEkadashiNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const futureEkadashis = EKADASHI_DATA.filter(e => new Date(e.date) > now).slice(0, 20); // Schedule next 20

    for (const ekd of futureEkadashis) {
        const ekdDate = new Date(ekd.date);

        // 1. One day before (Alert at 8:00 AM)
        const dayBefore = new Date(ekdDate);
        dayBefore.setDate(dayBefore.getDate() - 1);
        dayBefore.setHours(8, 0, 0, 0);

        if (dayBefore > now) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Ekadashi Tomorrow: ${ekd.name}`,
                    body: `Prepare your fast! Remembrance of Lord Vishnu starts tonight.`,
                    data: { ekadashiId: ekd.id },
                },
                trigger: dayBefore,
            });
        }

        // 2. Day of (Alert at 7:00 AM)
        const dayOf = new Date(ekdDate);
        dayOf.setHours(7, 0, 0, 0);

        if (dayOf > now) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Today is ${ekd.name}`,
                    body: ekd.significance.substring(0, 100) + '...',
                    data: { ekadashiId: ekd.id },
                },
                trigger: dayOf,
            });
        }
    }
};

export const setNotificationsEnabled = async (enabled) => {
    try {
        await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(enabled));
        if (enabled) {
            const hasPermission = await requestNotificationPermissions();
            if (hasPermission) {
                await scheduleEkadashiNotifications();
            } else {
                return 'PERMISSION_DENIED';
            }
        } else {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
    } catch (e) {
        console.error('Error saving notification preference', e);
    }
};

export const getNotificationsEnabled = async () => {
    try {
        const value = await AsyncStorage.getItem(NOTIFICATION_KEY);
        return value !== null ? JSON.parse(value) : false;
    } catch (e) {
        return false;
    }
};
