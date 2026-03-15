import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_URL } from '../utils/apiConfig';
import { useLanguage } from '../context/LanguageContext';

const PanchangDetail = ({ label, value, icon, color }) => (
    <View style={styles.detailCard}>
        <View style={styles.detailHeader}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={styles.detailLabel}>{label}</Text>
        </View>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default function PanchangScreen() {
    const { t, language } = useLanguage();
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [panchang, setPanchang] = useState(null);
    const [viewMode, setViewMode] = useState('day'); // 'day' or 'month'
    const [monthData, setMonthData] = useState([]);

    const fetchPanchang = async (selectedDate) => {
        setLoading(true);
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const response = await fetch(`${API_URL}/astrology/panchang?date=${dateStr}&lang=${language}`);
            const data = await response.json();
            if (data.success) {
                setPanchang(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch panchang", e);
        }
        setLoading(false);
    };

    const fetchMonthPanchang = async (selectedDate) => {
        setLoading(true);
        try {
            const year = selectedDate.getFullYear();
            const month = selectedDate.getMonth() + 1;
            const response = await fetch(`${API_URL}/astrology/panchang/month?year=${year}&month=${month}&lang=${language}`);
            const data = await response.json();
            if (data.success) {
                setMonthData(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch month panchang", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (viewMode === 'day') fetchPanchang(date);
        else fetchMonthPanchang(date);
    }, [viewMode]);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
        if (viewMode === 'day') fetchPanchang(currentDate);
        else fetchMonthPanchang(currentDate);
    };

    const formatDate = (d) => {
        return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const renderMonthGrid = () => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];

        // Fill empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />);
        }

        // Fill days of the month
        monthData.forEach((item) => {
            const isToday = new Date().toDateString() === new Date(item.date).toDateString();
            const isSelected = date.toDateString() === new Date(item.date).toDateString();
            
            days.push(
                <TouchableOpacity 
                    key={item.day} 
                    style={[
                        styles.calendarDay, 
                        isToday && styles.calendarDayToday,
                        isSelected && styles.calendarDaySelected
                    ]}
                    onPress={() => {
                        setDate(new Date(item.date));
                        setViewMode('day');
                    }}
                >
                    <Text style={[styles.dayNum, isSelected && styles.dayNumSelected]}>{item.day}</Text>
                    <Text style={[styles.tithiNum, isSelected && styles.tithiNumSelected]} numberOfLines={1}>
                        {item.tithi.number}
                    </Text>
                    <Text style={styles.tithiNameSmall} numberOfLines={1}>
                        {item.tithi.name}
                    </Text>
                </TouchableOpacity>
            );
        });

        return <View style={styles.calendarGrid}>{days}</View>;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('panchang')}</Text>
                
                <View style={styles.modeTabs}>
                    <TouchableOpacity 
                        style={[styles.modeTab, viewMode === 'day' && styles.modeTabActive]}
                        onPress={() => setViewMode('day')}
                    >
                        <Text style={[styles.modeTabText, viewMode === 'day' && styles.modeTabTextActive]}>
                            {t('view_details')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.modeTab, viewMode === 'month' && styles.modeTabActive]}
                        onPress={() => setViewMode('month')}
                    >
                        <Text style={[styles.modeTabText, viewMode === 'month' && styles.modeTabTextActive]}>
                            {t('view_calendar')}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={styles.dateSelector} 
                    onPress={() => setShowPicker(true)}
                >
                    <Ionicons name="calendar-outline" size={20} color="#B8860B" />
                    <Text style={styles.dateText}>{formatDate(date)}</Text>
                    <Ionicons name="chevron-down" size={16} color="#B8860B" />
                </TouchableOpacity>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            <ScrollView contentContainerStyle={styles.scroll}>
                {loading ? (
                    <View style={styles.loaderBox}>
                        <ActivityIndicator size="large" color="#B8860B" />
                        <Text style={styles.loaderText}>{t('calculating')}</Text>
                    </View>
                ) : viewMode === 'month' ? (
                    <View style={styles.calendarContainer}>
                        <View style={styles.weekDays}>
                            {(language === 'hi' ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(d => (
                                <Text key={d} style={styles.weekDayText}>{d}</Text>
                            ))}
                        </View>
                        {renderMonthGrid()}
                    </View>
                ) : panchang ? (
                    <View style={styles.content}>
                        <View style={styles.mainInsight}>
                            <Text style={styles.mainInsightTithi}>{panchang.tithi.name} {t('tithi')}</Text>
                            <Text style={styles.mainInsightPaksha}>{panchang.paksha} {t('paksha')}</Text>
                        </View>

                        <View style={styles.grid}>
                            <PanchangDetail 
                                label={t('nakshatra')} 
                                value={panchang.nakshatra} 
                                icon="moon-outline" 
                                color="#2980B9" 
                            />
                            <PanchangDetail 
                                label={t('yoga')} 
                                value={panchang.yoga} 
                                icon="git-branch-outline" 
                                color="#8E44AD" 
                            />
                            <PanchangDetail 
                                label={t('karana')} 
                                value={panchang.karana} 
                                icon="layers-outline" 
                                color="#16A085" 
                            />
                            <PanchangDetail 
                                label={t('tithi_number')} 
                                value={panchang.tithi.number} 
                                icon="list-outline" 
                                color="#D35400" 
                            />
                        </View>

                        <View style={styles.astroBox}>
                            <Text style={styles.astroTitle}>{t('planetary_positions')}</Text>
                            <View style={styles.astroRow}>
                                <View style={styles.astroItem}>
                                    <Text style={styles.astroLabel}>{t('sun')}</Text>
                                    <Text style={styles.astroVal}>{panchang.sun_deg.toFixed(2)}°</Text>
                                </View>
                                <View style={styles.astroItem}>
                                    <Text style={styles.astroLabel}>{t('moon')}</Text>
                                    <Text style={styles.astroVal}>{panchang.moon_deg.toFixed(2)}°</Text>
                                </View>
                            </View>
                        </View>
                        
                        <View style={styles.infoCard}>
                            <Ionicons name="information-circle-outline" size={20} color="#B8860B" />
                            <Text style={styles.infoText}>
                                {t('panchang_info')}
                            </Text>
                        </View>
                    </View>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    scroll: { padding: 20 },
    header: { padding: 20, alignItems: 'center', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EBE7E0' },
    title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', letterSpacing: 1, marginBottom: 16 },
    modeTabs: { flexDirection: 'row', backgroundColor: '#F0E6D2', borderRadius: 25, padding: 4, marginBottom: 16 },
    modeTab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 21 },
    modeTabActive: { backgroundColor: '#B8860B' },
    modeTabText: { fontSize: 13, fontWeight: '600', color: '#B8860B' },
    modeTabTextActive: { color: '#FFF' },
    dateSelector: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBF0',
        paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20,
        borderWidth: 1, borderColor: '#F3E5AB', gap: 10,
    },
    dateText: { fontSize: 14, color: '#333', fontWeight: '500' },
    calendarContainer: { backgroundColor: '#FFF', borderRadius: 16, padding: 10, borderWidth: 1, borderColor: '#EBE7E0' },
    weekDays: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10, marginBottom: 10 },
    weekDayText: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#999' },
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    calendarDay: { 
        width: '14.28%', aspectRatio: 0.8, alignItems: 'center', justifyContent: 'center', 
        borderWidth: 0.5, borderColor: '#F9F9F9' 
    },
    calendarDayEmpty: { width: '14.28%', aspectRatio: 0.8 },
    calendarDayToday: { backgroundColor: '#FFFBF0' },
    calendarDaySelected: { backgroundColor: '#B8860B20', borderColor: '#B8860B' },
    dayNum: { fontSize: 14, fontWeight: '700', color: '#333' },
    dayNumSelected: { color: '#B8860B' },
    tithiNum: { fontSize: 10, color: '#B8860B', fontWeight: '700', marginTop: 2 },
    tithiNameSmall: { fontSize: 8, color: '#999', textTransform: 'uppercase' },
    content: { gap: 16 },
    mainInsight: {
        backgroundColor: '#FFF', borderRadius: 16, padding: 24, alignItems: 'center',
        borderWidth: 1, borderColor: '#EBE7E0',
    },
    mainInsightTithi: { fontSize: 24, fontWeight: '700', color: '#B8860B' },
    mainInsightPaksha: { fontSize: 14, color: '#666', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    detailCard: {
        flex: 1, minWidth: '45%', backgroundColor: '#FFF', borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: '#EBE7E0',
    },
    detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    iconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    detailLabel: { fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: 0.5 },
    detailValue: { fontSize: 17, fontWeight: '600', color: '#333' },
    astroBox: {
        backgroundColor: '#FFFBF0', borderRadius: 16, padding: 20,
        borderWidth: 1, borderColor: '#F3E5AB',
    },
    astroTitle: { fontSize: 13, fontWeight: '700', color: '#B8860B', marginBottom: 16, textTransform: 'uppercase', textAlign: 'center' },
    astroRow: { flexDirection: 'row', justifyContent: 'space-around' },
    astroItem: { alignItems: 'center' },
    astroLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
    astroVal: { fontSize: 18, fontWeight: '600', color: '#333' },
    infoCard: {
        flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#FDFBF7',
        borderRadius: 12, borderWidth: 1, borderStyle: 'dotted', borderColor: '#CCC',
        marginTop: 10,
    },
    infoText: { flex: 1, fontSize: 12, color: '#888', fontStyle: 'italic', lineHeight: 18 },
    loaderBox: { marginTop: 60, alignItems: 'center' },
    loaderText: { marginTop: 16, color: '#999', fontSize: 14 },
});

