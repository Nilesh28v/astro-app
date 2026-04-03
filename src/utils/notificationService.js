import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { EKADASHI_DATA } from './ekadashiData';

const NOTIFICATION_KEY = '@ekadashi_notifications_enabled';
const DAILY_HOROSCOPE_KEY = '@daily_horoscope_notifications_enabled';

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

export const registerPushToken = async (userId) => {
    if (!Device.isDevice) return null;

    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return null;

        const token = (await Notifications.getExpoPushTokenAsync({
            projectId: 'bef2b6a3-915e-481e-8e54-5bb180f44a22', // From app.json
        })).data;

        if (userId && token) {
            // Fetch the API base URL from .env or constants
            const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://13.62.227.112:4005';
            await fetch(`${API_URL}/api/users/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseUid: userId,
                    pushToken: token,
                    email: 'user@example.com' // Should be passed from actual user object
                }),
            });
        }
        return token;
    } catch (e) {
        console.error('Error getting push token', e);
        return null;
    }
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
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: dayBefore,
                },
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
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: dayOf,
                },
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
        // Default to true for new users
        return value !== null ? JSON.parse(value) : true;
    } catch (e) {
        return false;
    }
};

// ==================== DAILY HOROSCOPE NOTIFICATIONS ====================

const RASHI_EMOJIS = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const DAILY_MESSAGES = [
    "Your today's horoscope is ready! Check what the stars say.",
    "The cosmos has a message for you today! ✨",
    "Start your day with celestial guidance 🌟",
    "Your daily planetary insights are waiting!",
    "See what the Navagrahas have planned for you today 🪐",
    "New day, new cosmic energy! Check your horoscope.",
    "The stars have aligned — your horoscope is ready! 🌌",
];

export const scheduleDailyHoroscopeNotification = async (userRashi) => {
    // Disabled: We now rely on the robust Server-Side Cron Job in astro-api
    // to handle daily horoscope push notifications consistently.
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
        if (notif.content?.data?.type === 'daily_horoscope') {
            await Notifications.cancelScheduledNotificationAsync(notif.identifier);
        }
    }

    // Return early to ensure local ones are cleared and no new ones are scheduled locally
    return;
};

export const setDailyHoroscopeEnabled = async (enabled, userRashi) => {
    try {
        await AsyncStorage.setItem(DAILY_HOROSCOPE_KEY, JSON.stringify(enabled));
        if (enabled) {
            const hasPermission = await requestNotificationPermissions();
            if (hasPermission) {
                await scheduleDailyHoroscopeNotification(userRashi);
            } else {
                return 'PERMISSION_DENIED';
            }
        } else {
            // Cancel only daily horoscope notifications
            const scheduled = await Notifications.getAllScheduledNotificationsAsync();
            for (const notif of scheduled) {
                if (notif.content?.data?.type === 'daily_horoscope') {
                    await Notifications.cancelScheduledNotificationAsync(notif.identifier);
                }
            }
        }
    } catch (e) {
        console.error('Error saving daily horoscope preference', e);
    }
};

export const getDailyHoroscopeEnabled = async () => {
    try {
        const value = await AsyncStorage.getItem(DAILY_HOROSCOPE_KEY);
        // Default to true for new users
        return value !== null ? JSON.parse(value) : true;
    } catch (e) {
        return true;
    }
};

// ==================== RETENTION NOTIFICATIONS ====================

export const cancelRetentionNotifications = async () => {
    try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        for (const notif of scheduled) {
            if (notif.content?.data?.type === 'retention') {
                await Notifications.cancelScheduledNotificationAsync(notif.identifier);
            }
        }
    } catch (e) {
        console.error('Error canceling retention notifications', e);
    }
};

export const scheduleRetentionNotification = async () => {
    try {
        await cancelRetentionNotifications(); // Clear any existing

        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return;

        // Schedule for 3 days from now
        const trigger = new Date();
        trigger.setDate(trigger.getDate() + 3);

        const titles = [
            "We miss you! ✨",
            "What do the stars say today? 🌟",
            "Your cosmic guide awaits 🪐"
        ];
        
        const bodies = [
            "Check your daily horoscope and panchang.",
            "Find out how your day aligns with the planets.",
            "Take a quick moment to read your daily Vedic insights."
        ];

        const randomIdx = Math.floor(Math.random() * titles.length);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: titles[randomIdx],
                body: bodies[randomIdx],
                data: { type: 'retention' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: trigger,
            },
        });
    } catch (e) {
        console.error('Error scheduling retention notification', e);
    }
};
