import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../utils/apiConfig';
import { metrics } from '../utils/metrics';

export default function MatchmakingScreen({ navigation }) {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(false);

    const [boyName, setBoyName] = useState('');
    const [boyDate, setBoyDate] = useState(new Date(1995, 4, 15, 10, 30));
    
    const [girlName, setGirlName] = useState('');
    const [girlDate, setGirlDate] = useState(new Date(1996, 7, 20, 14, 15));

    const [showPicker, setShowPicker] = useState(null); // 'boyDate', 'boyTime', 'girlDate', 'girlTime', null

    const onChangePicker = (event, selectedDate) => {
        if (Platform.OS === 'android') setShowPicker(null);
        if (selectedDate) {
            if (showPicker === 'boyDate') {
                const newDate = new Date(boyDate);
                newDate.setFullYear(selectedDate.getFullYear());
                newDate.setMonth(selectedDate.getMonth());
                newDate.setDate(selectedDate.getDate());
                setBoyDate(newDate);
            } else if (showPicker === 'boyTime') {
                const newDate = new Date(boyDate);
                newDate.setHours(selectedDate.getHours());
                newDate.setMinutes(selectedDate.getMinutes());
                setBoyDate(newDate);
            } else if (showPicker === 'girlDate') {
                const newDate = new Date(girlDate);
                newDate.setFullYear(selectedDate.getFullYear());
                newDate.setMonth(selectedDate.getMonth());
                newDate.setDate(selectedDate.getDate());
                setGirlDate(newDate);
            } else if (showPicker === 'girlTime') {
                const newDate = new Date(girlDate);
                newDate.setHours(selectedDate.getHours());
                newDate.setMinutes(selectedDate.getMinutes());
                setGirlDate(newDate);
            }
        }
    };

    const handleMatch = async () => {
        setLoading(true);
        try {
            const boy = {
                name: boyName,
                date: boyDate.toISOString().split('T')[0],
                time: boyDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            };
            const girl = {
                name: girlName,
                date: girlDate.toISOString().split('T')[0],
                time: girlDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            };

            const response = await fetch(`${API_URL}/astrology/match`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boy, girl })
            });
            const data = await response.json();
            
            if (data.success) {
                navigation.navigate('MatchResult', { result: data.data, boyName: boyName || 'Boy', girlName: girlName || 'Girl' });
            } else {
                Alert.alert('Error', data.error || 'Failed to match');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Network request failed. Ensure server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Ionicons name="heart" size={metrics.scale(40)} color="#E74C3C" />
                    <Text style={styles.title}>{language === 'hi' ? 'जीवनसाथी अनुकूलता' : 'Partner Compatibility'}</Text>
                    <Text style={styles.subtitle}>{language === 'hi' ? 'विवाह के लिए 36 गुणों का मिलान करें' : 'Match 36 Gunas for Marriage Compatibility'}</Text>
                </View>

                {/* Boy Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="male" size={20} color="#3498DB" />
                        <Text style={styles.cardTitle}>{language === 'hi' ? 'लड़के का विवरण' : "Boy's Details"}</Text>
                    </View>
                    <TextInput style={styles.input} placeholder={language === 'hi' ? 'नाम (वैकल्पिक)' : 'Name (Optional)'} placeholderTextColor="#999" value={boyName} onChangeText={setBoyName} />
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.input, styles.half]} onPress={() => setShowPicker('boyDate')}>
                            <Text style={styles.pickerText}>{boyDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.input, styles.half]} onPress={() => setShowPicker('boyTime')}>
                            <Text style={styles.pickerText}>{boyDate.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Ionicons name="add" size={24} color="#B8860B" />
                    <View style={styles.line} />
                </View>

                {/* Girl Section */}
                <View style={[styles.card, { borderColor: '#F5B041' }]}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="female" size={20} color="#E67E22" />
                        <Text style={[styles.cardTitle, { color: '#E67E22' }]}>{language === 'hi' ? 'लड़की का विवरण' : "Girl's Details"}</Text>
                    </View>
                    <TextInput style={styles.input} placeholder={language === 'hi' ? 'नाम (वैकल्पिक)' : 'Name (Optional)'} placeholderTextColor="#999" value={girlName} onChangeText={setGirlName} />
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.input, styles.half]} onPress={() => setShowPicker('girlDate')}>
                            <Text style={styles.pickerText}>{girlDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.input, styles.half]} onPress={() => setShowPicker('girlTime')}>
                            <Text style={styles.pickerText}>{girlDate.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.btn} onPress={handleMatch} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                        <Text style={styles.btnText}>{language === 'hi' ? 'मिलान करें' : 'Calculate Compatibility'}</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.infoText}>{language === 'hi' ? 'यह मिलान जन्म राशि और नक्षत्र पर आधारित है।' : 'Matching is based on Moon Sign and Nakshatra.'}</Text>
            
                {/* Pickers */}
                {(showPicker && Platform.OS !== 'web') && (
                    <DateTimePicker
                        value={showPicker.includes('boy') ? boyDate : girlDate}
                        mode={showPicker.includes('Date') ? 'date' : 'time'}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onChangePicker}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    scroll: { padding: metrics.scale(20) },
    header: { alignItems: 'center', marginBottom: metrics.verticalScale(24) },
    title: { fontSize: metrics.moderateScale(24), fontWeight: '300', color: '#E74C3C', marginTop: 10 },
    subtitle: { fontSize: metrics.moderateScale(14), color: '#666', marginTop: 5 },
    card: { backgroundColor: '#FFF', padding: metrics.scale(16), borderRadius: 12, borderWidth: 1, borderColor: '#3498DB', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
    cardTitle: { fontSize: metrics.moderateScale(16), fontWeight: '600', color: '#3498DB' },
    input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#E0E0E0', padding: metrics.scale(12), borderRadius: 8, minHeight: 45, marginBottom: 10, justifyContent: 'center' },
    pickerText: { fontSize: metrics.moderateScale(14), color: '#1A1A1A' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    half: { width: '48%' },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: metrics.verticalScale(16) },
    line: { flex: 1, height: 1, backgroundColor: '#EBE7E0' },
    btn: { backgroundColor: '#B8860B', padding: metrics.verticalScale(16), borderRadius: 10, alignItems: 'center', marginTop: metrics.verticalScale(24) },
    btnText: { color: '#FFF', fontSize: metrics.moderateScale(16), fontWeight: '600' },
    infoText: { textAlign: 'center', color: '#999', fontSize: metrics.moderateScale(12), marginTop: metrics.verticalScale(16) }
});
