import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
    // If we're on the web, just use localhost
    if (Platform.OS === 'web') {
        return 'http://localhost:3000/api';
    }

    // Attempt to get the debugger host from Expo constants
    // This works for Expo Go/Development builds to find the computer's IP
    const debuggerHost = Constants.expoConfig?.hostUri;
    const address = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

    // iOS, Android real device, and emulator all use the detected address
    return `http://${address}:3000/api`;
};

export const API_URL = getApiUrl();

