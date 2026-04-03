import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_COUNT_KEY = '@streak_count';
const LAST_OPEN_KEY = '@last_open_date';

const getDateString = (date) => {
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
};

export const updateStreak = async () => {
    try {
        const todayStr = getDateString(new Date());
        const lastOpenStr = await AsyncStorage.getItem(LAST_OPEN_KEY);
        let streak = parseInt(await AsyncStorage.getItem(STREAK_COUNT_KEY)) || 0;

        if (lastOpenStr === todayStr) {
            // Already opened today, no change
            return streak;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = getDateString(yesterday);

        if (lastOpenStr === yesterdayStr) {
            // Consecutive day — increment streak
            streak += 1;
        } else {
            // Streak broken — reset to 1
            streak = 1;
        }

        await AsyncStorage.setItem(STREAK_COUNT_KEY, streak.toString());
        await AsyncStorage.setItem(LAST_OPEN_KEY, todayStr);
        return streak;
    } catch (e) {
        console.error('Streak update error:', e);
        return 1;
    }
};

export const getStreak = async () => {
    try {
        const streak = parseInt(await AsyncStorage.getItem(STREAK_COUNT_KEY)) || 0;
        return streak;
    } catch (e) {
        return 0;
    }
};

export const getStreakMessage = (streak) => {
    if (streak >= 30) return '🙏 Devoted seeker!';
    if (streak >= 14) return '🌟 Two weeks of wisdom!';
    if (streak >= 7) return '✨ A full week of cosmic guidance!';
    if (streak >= 3) return '💪 Great consistency!';
    if (streak >= 1) return '🔥 Keep it going!';
    return '';
};
