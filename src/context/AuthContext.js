import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserSession();
    }, []);

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

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isGuest: user?.isGuest ?? true,
            login,
            signup,
            logout,
            loginAsGuest,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
