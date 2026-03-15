import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const KUNDLIS_KEY = '@saved_kundlis';

/**
 * Robust Local Storage Utility for Jyotish Guru.
 * 100% Offline, Privacy-focused, and Free.
 */

/**
 * Fetches all saved Kundlis from local storage.
 */
export const getUserKundlis = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(KUNDLIS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error fetching Kundlis:', e);
        Alert.alert('Error', 'Could not load your saved Kundlis.');
        return [];
    }
};

/**
 * Saves a Kundli to local storage.
 */
export const saveUserKundli = async (_, kundliData) => {
    try {
        const existing = await getUserKundlis();

        // Ensure data is valid
        if (!kundliData.name || !kundliData.date) {
            throw new Error('Invalid Kundli data: Name and Date are required.');
        }

        // Check if updating existing by name or generating new ID
        const newId = kundliData.id || Date.now().toString();
        const newKundli = {
            ...kundliData,
            id: newId,
            updated_at: new Date().toISOString(),
        };

        const updated = existing.filter(k => k.id !== newId);
        updated.unshift(newKundli);

        await AsyncStorage.setItem(KUNDLIS_KEY, JSON.stringify(updated));
        return newKundli;
    } catch (e) {
        console.error('Error saving Kundli:', e);
        Alert.alert('Save Failed', 'We could not save this Kundli locally.');
        throw e;
    }
};

/**
 * Deletes a Kundli from local storage.
 */
export const deleteUserKundli = async (_, kundliId) => {
    try {
        const existing = await getUserKundlis();
        const updated = existing.filter(k => k.id !== kundliId);
        await AsyncStorage.setItem(KUNDLIS_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Error deleting Kundli:', e);
        Alert.alert('Error', 'Could not delete the Kundli.');
        throw e;
    }
};

// Legacy support (No-op as Firebase is removed)
export const syncUserProfile = async () => {
    // No-op: Purely offline
    return null;
};
