import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiUrl = () => {
    // 1. Check for environment variable (useful for local development)
    const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
    if (envUrl) {
        return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
    }

    // 2. Production Fallback (Hardcoded IP for EC2)
    // This ensures that APKs built without env variables still connect to the right place
    const LIVE_BACKEND_URL = 'http://13.62.227.112:4005';
    
    // 3. Fallback for Web
    if (Platform.OS === 'web') {
        return 'http://localhost:3000/api';
    }

    // Default to Live Backend for now to ensure APK works
    return `${LIVE_BACKEND_URL}/api`;
};

export const API_URL = getApiUrl();

