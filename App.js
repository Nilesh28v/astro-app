import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ErrorBoundary from './src/components/ErrorBoundary';

import BannerAdComponent from './src/components/BannerAd';
import DailyHoroscopeScreen from './src/screens/DailyHoroscopeScreen';
import DisclaimerScreen from './src/screens/DisclaimerScreen';
import EkadashiScreen from './src/screens/EkadashiScreen';
import HomeScreen from './src/screens/HomeScreen';
import HouseDetailsScreen from './src/screens/HouseDetailsScreen';
import HousesScreen from './src/screens/HousesScreen';
import KundliDisplayScreen from './src/screens/KundliDisplayScreen';
import KundliInputScreen from './src/screens/KundliInputScreen';
import MoreMenuScreen from './src/screens/MoreMenuScreen';
import NakshatraDetailsScreen from './src/screens/NakshatraDetailsScreen';
import NakshatrasScreen from './src/screens/NakshatrasScreen';
import PlanetDetailsScreen from './src/screens/PlanetDetailsScreen';
import PlanetsScreen from './src/screens/PlanetsScreen';
import RemediesScreen from './src/screens/RemediesScreen';
import ZodiacDetailsScreen from './src/screens/ZodiacDetailsScreen';
import ZodiacsScreen from './src/screens/ZodiacsScreen';
import PanchangScreen from './src/screens/PanchangScreen';
import SavedKundlisScreen from './src/screens/SavedKundlisScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import LoginScreen from './src/screens/LoginScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const HoroscopeStack = createNativeStackNavigator();
const KundliStack = createNativeStackNavigator();
const RemediesStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const stackScreenOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: '#FDFBF7' },
    headerTintColor: '#B8860B',
    headerTitleStyle: { fontWeight: '300', letterSpacing: 1 },
    headerShadowVisible: false,
    headerBackTitleVisible: false,
};

function HomeStackScreen() {
    const { t } = useLanguage();
    return (
        <HomeStack.Navigator screenOptions={stackScreenOptions}>
            <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: t('jyotish_guru') }} />
        </HomeStack.Navigator>
    );
}

function HoroscopeStackScreen() {
    const { t } = useLanguage();
    return (
        <HoroscopeStack.Navigator screenOptions={stackScreenOptions}>
            <HoroscopeStack.Screen name="HoroscopeMain" component={DailyHoroscopeScreen} options={{ title: t('daily_horoscope') }} />
        </HoroscopeStack.Navigator>
    );
}

function KundliStackScreen() {
    const { t } = useLanguage();
    return (
        <KundliStack.Navigator screenOptions={stackScreenOptions}>
            <KundliStack.Screen name="KundliInput" component={KundliInputScreen} options={{ title: t('create_kundli') }} />
            <KundliStack.Screen name="SavedKundlis" component={SavedKundlisScreen} options={{ title: t('saved_kundlis') }} />
            <KundliStack.Screen name="KundliDisplay" component={KundliDisplayScreen} options={{ title: t('your_birth_chart') }} />
        </KundliStack.Navigator>
    );
}

function RemediesStackScreen() {
    const { t } = useLanguage();
    return (
        <RemediesStack.Navigator screenOptions={stackScreenOptions}>
            <RemediesStack.Screen name="RemediesMain" component={RemediesScreen} options={{ title: t('remedies') }} />
        </RemediesStack.Navigator>
    );
}

function MoreStackScreen() {
    const { t } = useLanguage();
    return (
        <MoreStack.Navigator screenOptions={stackScreenOptions}>
            <MoreStack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ title: t('more') }} />
            <MoreStack.Screen name="PlanetsList" component={PlanetsScreen} options={{ title: t('planets') }} />
            <MoreStack.Screen name="PlanetDetails" component={PlanetDetailsScreen} options={({ route }) => ({ title: route.params.planet.name })} />
            <MoreStack.Screen name="HousesList" component={HousesScreen} options={{ title: t('houses') }} />
            <MoreStack.Screen name="HouseDetails" component={HouseDetailsScreen} options={({ route }) => ({ title: `${t('houses')} ${route.params.house.id}` })} />
            <MoreStack.Screen name="ZodiacsList" component={ZodiacsScreen} options={{ title: t('zodiacs') }} />
            <MoreStack.Screen name="ZodiacDetails" component={ZodiacDetailsScreen} options={({ route }) => ({ title: route.params.zodiac.name })} />
            <MoreStack.Screen name="NakshatrasList" component={NakshatrasScreen} options={{ title: t('nakshatras') }} />
            <MoreStack.Screen name="NakshatraDetails" component={NakshatraDetailsScreen} options={({ route }) => ({ title: route.params.nakshatra.name })} />
            <MoreStack.Screen name="EkadashiMain" component={EkadashiScreen} options={{ title: t('ekadashi_calendar') }} />
            <MoreStack.Screen name="Panchang" component={PanchangScreen} options={{ title: t('panchang') }} />
            <MoreStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: t('privacy_policy') }} />
        </MoreStack.Navigator>
    );
}

const AppContent = () => {
    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
    const [checkingDisclaimer, setCheckingDisclaimer] = useState(true);

    useEffect(() => {
        // Suppress unwanted logs for a cleaner user experience
        LogBox.ignoreLogs(['Firebase', 'PushNotification']);
        checkDisclaimer();
    }, []);

    const checkDisclaimer = async () => {
        try {
            const val = await AsyncStorage.getItem('@disclaimer_accepted');
            if (val === 'true') setDisclaimerAccepted(true);
        } catch (e) {
            console.error('Error reading disclaimer status:', e);
        }
        setCheckingDisclaimer(false);
    };

    if (loading || checkingDisclaimer) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#B8860B" />
            </View>
        );
    }

    if (!disclaimerAccepted) {
        return (
            <SafeAreaProvider>
                <DisclaimerScreen
                    onAccept={() => setDisclaimerAccepted(true)}
                />
            </SafeAreaProvider>
        );
    }

    // Return LoginScreen if user is not authenticated
    if (!user) {
        return (
            <SafeAreaProvider>
                <LoginScreen />
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <NavigationContainer>
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                let iconName;
                                if (route.name === 'HomeTab') {
                                    iconName = focused ? 'home' : 'home-outline';
                                } else if (route.name === 'HoroscopeTab') {
                                    iconName = focused ? 'sunny' : 'sunny-outline';
                                } else if (route.name === 'KundliTab') {
                                    iconName = focused ? 'document-text' : 'document-text-outline';
                                } else if (route.name === 'RemediesTab') {
                                    iconName = focused ? 'leaf' : 'leaf-outline';
                                } else if (route.name === 'MoreTab') {
                                    iconName = focused ? 'apps' : 'apps-outline';
                                }
                                return <Ionicons name={iconName} size={size} color={color} />;
                            },
                            tabBarActiveTintColor: '#B8860B',
                            tabBarInactiveTintColor: '#999999',
                            tabBarStyle: {
                                backgroundColor: '#FDFBF7',
                                borderTopColor: '#EBE7E0',
                                height: 90,
                                paddingBottom: 30,
                                paddingTop: 10,
                            },
                            headerShown: false,
                        })}
                    >
                        <Tab.Screen name="HomeTab" component={HomeStackScreen} options={{ title: t('home') }} />
                        <Tab.Screen name="HoroscopeTab" component={HoroscopeStackScreen} options={{ title: t('horoscope') }} />
                        <Tab.Screen name="KundliTab" component={KundliStackScreen} options={{ title: t('kundli') }} />
                        <Tab.Screen name="RemediesTab" component={RemediesStackScreen} options={{ title: t('remedies') }} />
                        <Tab.Screen 
                            name="MoreTab" 
                            component={MoreStackScreen} 
                            options={{ title: t('more') }} 
                            listeners={({ navigation }) => ({
                                tabPress: (e) => {
                                    if (navigation.isFocused()) {
                                        navigation.dispatch(StackActions.popToTop());
                                    }
                                },
                            })}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
                <BannerAdComponent />
            </View>
        </SafeAreaProvider>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </AuthProvider>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
    },
});
