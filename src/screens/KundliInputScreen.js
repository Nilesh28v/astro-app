import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect, useMemo } from 'react'; // Added useMemo
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function KundliInputScreen({ navigation }) {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());

    // Initial pre-fill from user profile
    useEffect(() => {
        if (user && !user.isGuest) {
            if (user.name) setName(user.name);
            else if (user.displayName && user.displayName !== 'Guest User') setName(user.displayName);

            let newDate = new Date();
            let updated = false;

            if (user.dob) {
                const [y, m, d] = user.dob.split('-').map(Number);
                if (y && m && d) {
                    newDate.setFullYear(y);
                    newDate.setMonth(m - 1);
                    newDate.setDate(d);
                    updated = true;
                }
            }
            if (user.tob) {
                const [h, min] = user.tob.split(':').map(Number);
                if (h !== undefined && min !== undefined) {
                    newDate.setHours(h);
                    newDate.setMinutes(min);
                    updated = true;
                }
            }
            
            if (updated) setDate(newDate);

            // Pre-fill city if coordinates are available
            if (user.lat && user.lon && user.city) {
                setSelectedCity({
                    name: user.city,
                    lat: user.lat,
                    lon: user.lon,
                    state: user.state || ''
                });
            }
        }
    }, [user]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Dynamic Location State
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState({ name: 'New Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi' });
    
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationViewLevel, setLocationViewLevel] = useState('states'); // 'states' or 'cities'
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);



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

    useEffect(() => {
        if (showLocationModal && states.length === 0) {
            fetchStates();
        }
    }, [showLocationModal]);

    const handleStateSelect = (state) => {
        setSelectedState(state);
        setLocationViewLevel('cities');
        setSearchQuery('');
        fetchCities(state.isoCode);
    };

    const handleCitySelect = (city) => {
        setSelectedCity({
            name: city.name,
            lat: parseFloat(city.latitude),
            lon: parseFloat(city.longitude),
            state: selectedState.name
        });
        setShowLocationModal(false);
        setLocationViewLevel('states');
        setSearchQuery('');
    };

    const filteredData = useMemo(() => {
        const list = locationViewLevel === 'states' ? states : cities;
        return list.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, states, cities, locationViewLevel]);

    const handleGenerate = () => {
        if (!name.trim()) return;
        navigation.navigate('KundliDisplay', {
            name,
            date: date.getTime(),
            lat: selectedCity.lat,
            lon: selectedCity.lon,
            city: selectedCity.name
        });
    };

    const onChangeDate = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            const newDate = new Date(date);
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
            setDate(newDate);
        }
    };

    const onChangeTime = (event, selectedTime) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>{t('create_kundli')}</Text>
                    <Text style={styles.subtitle}>{t('kundli_subtitle')}</Text>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('name_label')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('enter_name')}
                                value={name}
                                onChangeText={setName}
                                placeholderTextColor="#999"
                            />
                        </View>

                        {Platform.OS !== 'web' && (
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                    <Text style={styles.label}>{t('date') || 'Date'}</Text>
                                    <TouchableOpacity
                                        style={styles.pickerButton}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text style={styles.pickerText}>{date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>{t('time') || 'Time'}</Text>
                                    <TouchableOpacity
                                        style={styles.pickerButton}
                                        onPress={() => setShowTimePicker(true)}
                                    >
                                        <Text style={styles.pickerText}>
                                            {date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Birth Location Selection */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('birth_location')}</Text>
                            <TouchableOpacity
                                style={styles.pickerButton}
                                onPress={() => setShowLocationModal(true)}
                            >
                                <Text style={styles.pickerText}>
                                    {selectedCity.name}, {selectedCity.state}
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.helperText}>{t('precision_label')}: {selectedCity.lat.toFixed(4)}N, {selectedCity.lon.toFixed(4)}E (SwissEph)</Text>
                        </View>

                        {/* Date/Time Pickers for Web */}
                        {Platform.OS === 'web' && (
                            <View style={styles.webPickerContainer}>
                                <View style={styles.webInputGroup}>
                                    <Text style={styles.label}>{t('date_of_birth')}</Text>
                                    <input
                                        type="date"
                                        value={`${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (!val) return;
                                            const [y, m, d] = val.split('-').map(Number);
                                            // Ensure year is reasonable to avoid UI jumps
                                            if (y < 100) return;
                                            const newDate = new Date(y, m - 1, d, date.getHours(), date.getMinutes());
                                            setDate(newDate);
                                        }}
                                        style={styles.webDateInput}
                                    />
                                </View>
                                <View style={styles.webInputGroup}>
                                    <Text style={styles.label}>{t('time_of_birth')}</Text>
                                    <input
                                        type="time"
                                        value={`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (!val) return;
                                            const [h, min] = val.split(':').map(Number);
                                            const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, min);
                                            setDate(newDate);
                                        }}
                                        style={styles.webDateInput}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Native Date/Time Pickers */}
                        {Platform.OS !== 'web' && (
                            <>
                                {(showDatePicker || Platform.OS === 'ios') && showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onChangeDate}
                                    />
                                )}

                                {(showTimePicker || Platform.OS === 'ios') && showTimePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onChangeTime}
                                    />
                                )}
                            </>
                        )}

                        <TouchableOpacity
                            style={[styles.generateButton, !name && styles.disabledButton]}
                            onPress={handleGenerate}
                            disabled={!name}
                        >
                            <Text style={styles.generateButtonText}>{t('create_kundli')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Dynamic Location Modal */}
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
                                        <Text style={styles.closeButton}>{t('back')}</Text>
                                    </TouchableOpacity>
                                )}
                                <Text style={styles.modalTitle}>
                                    {locationViewLevel === 'states' ? t('select_state') : `${t('cities_in')} ${selectedState?.name}`}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                                <Text style={styles.closeButton}>{t('cancel')}</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholder={`${t('search_placeholder')} ${locationViewLevel}...`}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#999"
                        />

                        {loadingLocation ? (
                            <ActivityIndicator size="large" color="#B8860B" style={{marginTop: 50}} />
                        ) : (
                            <FlatList
                                data={filteredData}
                                keyExtractor={(item, index) => item.isoCode || item.name + index}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.cityItem}
                                        onPress={() => locationViewLevel === 'states' ? handleStateSelect(item) : handleCitySelect(item)}
                                    >
                                        <Text style={styles.cityName}>{item.name}</Text>
                                        {locationViewLevel === 'states' && <Text style={styles.stateName}>{item.countryCode}</Text>}
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>{t('no_locations')}</Text>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '300',
        color: '#1A1A1A',
        letterSpacing: 1.2,
        marginBottom: 8,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#888888',
        marginBottom: 40,
        lineHeight: 22,
    },
    form: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EBE7E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#B8860B',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9F7F2',
        borderWidth: 1,
        borderColor: '#EBE7E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1A1A1A',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pickerButton: {
        backgroundColor: '#F9F7F2',
        borderWidth: 1,
        borderColor: '#EBE7E0',
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        minHeight: 48,
    },
    pickerText: {
        fontSize: 16,
        color: '#1A1A1A',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
        fontStyle: 'italic',
    },
    generateButton: {
        backgroundColor: '#B8860B',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#D4C4A8',
    },
    generateButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    closeButton: {
        color: '#B8860B',
        fontSize: 16,
        fontWeight: '600',
    },
    searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
        color: '#1A1A1A',
    },
    cityItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    cityName: {
        fontSize: 16,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    stateName: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        color: '#999',
    },
    // Web Picker Styles
    webPickerContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 16,
    },
    webInputGroup: {
        flex: 1,
    },
    webDateInput: {
        backgroundColor: '#F9F7F2',
        border: '1px solid #EBE7E0',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '16px',
        color: '#1A1A1A',
        width: '100%',
        fontFamily: 'inherit',
    }
});


