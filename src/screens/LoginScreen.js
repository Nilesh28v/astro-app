import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../utils/apiConfig';

export default function LoginScreen() {
    const { t, language } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Extended Profile State
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    
    // Location State
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState({ name: 'New Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi' });
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationViewLevel, setLocationViewLevel] = useState('states'); // 'states' or 'cities'
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);

    const [loading, setLoading] = useState(false);
    const { login, signup, loginAsGuest } = useAuth();

    const fetchStates = async () => {
        setLoadingLocation(true);
        try {
            const response = await fetch(`${API_URL}/location/states`);
            const data = await response.json();
            if (data.success) setStates(data.data);
        } catch (e) {
            console.error("Failed to fetch states", e);
        }
        setLoadingLocation(false);
    };

    const fetchCities = async (stateCode) => {
        setLoadingLocation(true);
        try {
            const response = await fetch(`${API_URL}/location/cities?stateCode=${stateCode}`);
            const data = await response.json();
            if (data.success) setCities(data.data);
        } catch (e) {
            console.error("Failed to fetch cities", e);
        }
        setLoadingLocation(false);
    };

    const searchGlobalCities = async (query) => {
        if (!query || query.length < 2) return;
        setLoadingLocation(true);
        try {
            const response = await fetch(`${API_URL}/location/search-cities?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data.success) {
                setCities(data.data);
                setLocationViewLevel('cities');
            }
        } catch (e) {
            console.error("Global search failed", e);
        }
        setLoadingLocation(false);
    };

    useEffect(() => {
        if (showLocationModal && states.length === 0) {
            fetchStates();
        }
    }, [showLocationModal]);

    const handleStateSelect = (state) => {
        setSelectedState(state);
        setLocationViewLevel('cities');
        setLocationSearchQuery('');
        fetchCities(state.isoCode);
    };

    const handleCitySelect = (city) => {
        setSelectedCity({
            name: city.name,
            lat: parseFloat(city.latitude),
            lon: parseFloat(city.longitude),
            state: city.stateCode
        });
        setShowLocationModal(false);
        setLocationViewLevel('states');
        setLocationSearchQuery('');
    };

    const onChangeDate = (event, selectedDate) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) {
            const newDate = new Date(birthDate);
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
            setBirthDate(newDate);
        }
    };

    const onChangeTime = (event, selectedTime) => {
        if (Platform.OS === 'android') setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(birthDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setBirthDate(newDate);
        }
    };

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!name) {
                    Alert.alert('Error', 'Please enter your full name.');
                    setLoading(false);
                    return;
                }
                
                // Format details for signup
                const formattedDob = birthDate.toISOString().split('T')[0];
                const formattedTob = birthDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                
                await signup(email, password, { 
                    name, 
                    dob: formattedDob, 
                    tob: formattedTob, 
                    city: selectedCity.name,
                    lat: selectedCity.lat,
                    lon: selectedCity.lon
                });
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        Alert.alert('Information', 'Google Login requires native Firebase configuration which is currently disabled.');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.icon}>🌌</Text>
                        <Text style={styles.title}>Jyotish Guru</Text>
                        <Text style={styles.subtitle}>Unlock Your Cosmic Potential</Text>
                    </View>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(true)}
                        >
                            <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, !isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(false)}
                        >
                            <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        {!isLogin && (
                            <>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#B8860B" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Full Name"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        placeholderTextColor="#999"
                                    />
                                </View>

                                <View style={styles.inputRow}>
                                    <TouchableOpacity 
                                        style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Ionicons name="calendar-outline" size={20} color="#B8860B" style={styles.inputIcon} />
                                        <Text style={[styles.input, !birthDate && { color: '#999' }]}>
                                            {birthDate ? birthDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN') : 'Date of Birth'}
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}
                                        onPress={() => setShowTimePicker(true)}
                                    >
                                        <Ionicons name="time-outline" size={20} color="#B8860B" style={styles.inputIcon} />
                                        <Text style={[styles.input, !birthDate && { color: '#999' }]}>
                                            {birthDate ? birthDate.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Time'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity 
                                    style={styles.inputContainer}
                                    onPress={() => setShowLocationModal(true)}
                                >
                                    <Ionicons name="location-outline" size={20} color="#B8860B" style={styles.inputIcon} />
                                    <Text style={[styles.input, !selectedCity && { color: '#999' }]}>
                                        {selectedCity ? `${selectedCity.name}${selectedCity.state ? ', ' + selectedCity.state : ''}` : 'Birth Location'}
                                    </Text>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={birthDate}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onChangeDate}
                                    />
                                )}

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={birthDate}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onChangeTime}
                                    />
                                )}
                            </>
                        )}

                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#B8860B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#B8860B" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor="#999"
                            />
                        </View>

                        {isLogin && (
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.mainButton}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.mainButtonText}>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.guestButton} onPress={loginAsGuest}>
                        <Text style={styles.guestButtonText}>Continue as Guest</Text>
                        <Ionicons name="arrow-forward" size={16} color="#B8860B" />
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Location Selection Modal */}
            <Modal
                visible={showLocationModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLocationModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {locationViewLevel === 'cities' && (
                                    <TouchableOpacity onPress={() => setLocationViewLevel('states')} style={{marginRight: 10}}>
                                        <Text style={styles.modalBackText}>{t('back') || 'Back'}</Text>
                                    </TouchableOpacity>
                                )}
                                <Text style={styles.modalTitle}>
                                    {locationViewLevel === 'states' ? t('select_state') || 'Select State' : `${t('cities_in') || 'Cities in'} ${selectedState?.name || ''}`}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                                <Text style={styles.modalCancelText}>{t('cancel') || 'Cancel'}</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder={locationViewLevel === 'states' ? "Search state or type city name..." : "Search city..."}
                            value={locationSearchQuery}
                            onChangeText={(text) => {
                                setLocationSearchQuery(text);
                                if (locationViewLevel === 'states' && text.length >= 2) {
                                    searchGlobalCities(text);
                                }
                            }}
                            placeholderTextColor="#999"
                        />

                        {loadingLocation ? (
                            <ActivityIndicator size="large" color="#B8860B" style={{marginTop: 50}} />
                        ) : (
                            <FlatList
                                data={locationViewLevel === 'states' ? states.filter(s => s.name.toLowerCase().includes(locationSearchQuery.toLowerCase())) : cities.filter(c => c.name.toLowerCase().includes(locationSearchQuery.toLowerCase()))}
                                keyExtractor={(item, index) => item.isoCode || item.name + index}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalListItem}
                                        onPress={() => locationViewLevel === 'states' ? handleStateSelect(item) : handleCitySelect(item)}
                                    >
                                        <Text style={styles.modalListItemText}>{item.name}</Text>
                                        {locationViewLevel === 'states' && <Text style={styles.modalListItemSubtext}>{item.countryCode}</Text>}
                                        {item.stateCode && <Text style={styles.modalListItemSubtext}>{item.stateCode}</Text>}
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.modalEmptyText}>{t('no_locations') || 'No locations found.'}</Text>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7'
    },
    scrollContent: {
        padding: 30,
        paddingTop: 60
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    icon: {
        fontSize: 60,
        marginBottom: 16
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#B8860B',
        letterSpacing: 2
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
        letterSpacing: 1
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0EAD6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 30,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#B8860B',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#B8860B',
    },
    activeTabText: {
        color: '#FFF',
    },
    form: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EBE7E0',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 12,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    modalBackText: {
        color: '#B8860B',
        fontSize: 16,
        fontWeight: '600',
    },
    modalCancelText: {
        color: '#999',
        fontSize: 16,
        fontWeight: '600',
    },
    modalSearchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    modalListItem: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalListItemText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    modalListItemSubtext: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    modalEmptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#999',
        fontSize: 15,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#B8860B',
        fontSize: 14,
        fontWeight: '600',
    },
    mainButton: {
        backgroundColor: '#B8860B',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#B8860B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    mainButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#EBE7E0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#AAA',
        fontWeight: '600',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EBE7E0',
        borderRadius: 12,
        height: 56,
        marginBottom: 16,
    },
    socialButtonText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    guestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 30,
    },
    guestButtonText: {
        color: '#B8860B',
        fontSize: 15,
        fontWeight: '600',
        marginRight: 8,
    },
    footerText: {
        textAlign: 'center',
        color: '#AAA',
        fontSize: 12,
        lineHeight: 18,
    },
});
