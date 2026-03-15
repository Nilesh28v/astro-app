import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('@language');
            if (savedLanguage) {
                setLanguage(savedLanguage);
            }
        } catch (e) {
            console.error('Failed to load language', e);
        }
    };

    const toggleLanguage = async () => {
        const newLang = language === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        try {
            await AsyncStorage.setItem('@language', newLang);
        } catch (e) {
            console.error('Failed to save language', e);
        }
    };

    const t = (key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
