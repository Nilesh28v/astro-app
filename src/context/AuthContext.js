import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerPushToken } from '../utils/notificationService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserSession();
    }, []);

    useEffect(() => {
        if (user && !user.isGuest) {
            registerPushToken(user.email);
        }
    }, [user]);

    const checkUserSession = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('@user_session');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error('Failed to load session', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // Mock authentication - accept any email/password
        const mockUser = {
            displayName: email.split('@')[0],
            email: email,
            isGuest: false
        };
        await AsyncStorage.setItem('@user_session', JSON.stringify(mockUser));
        setUser(mockUser);
        registerPushToken(mockUser.email);
    };

    const signup = async (email, password, extraDetails = {}) => {
        // Mock signup - accept credentials and store extra profile details
        const mockUser = {
            displayName: extraDetails.name || email.split('@')[0],
            email: email,
            isGuest: false,
            ...extraDetails
        };
        await AsyncStorage.setItem('@user_session', JSON.stringify(mockUser));
        setUser(mockUser);
        registerPushToken(mockUser.email);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('@user_session');
        setUser(null);
    };

    const loginAsGuest = async () => {
        const guestUser = {
            displayName: 'Guest User',
            email: 'local@jyotish.guru',
            isGuest: true
        };
        await AsyncStorage.setItem('@user_session', JSON.stringify(guestUser));
        setUser(guestUser);
    };

    const loginWithGoogle = async (googleUser) => {
        const mockUser = {
            displayName: googleUser.displayName || (googleUser.email ? googleUser.email.split('@')[0] : 'Google User'),
            email: googleUser.email || '',
            isGuest: false,
            photoURL: googleUser.photoURL || null
        };
        await AsyncStorage.setItem('@user_session', JSON.stringify(mockUser));
        setUser(mockUser);
        registerPushToken(mockUser.email);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isGuest: user?.isGuest ?? true,
            login,
            signup,
            logout,
            loginAsGuest,
            loginWithGoogle,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
