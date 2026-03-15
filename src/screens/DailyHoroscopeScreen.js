import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef, useState, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { getZodiacName, getZodiacSymbol } from '../utils/horoscopeEngine';
import { API_URL } from '../utils/apiConfig';

const ZODIAC_LIST = (language) => Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: getZodiacName(i + 1, language),
    symbol: getZodiacSymbol(i + 1, language),
}));

const ZodiacChip = ({ item, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.zodiacChip, selected && styles.zodiacChipSelected]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={styles.zodiacEmoji}>{item.symbol}</Text>
        <Text style={[styles.zodiacChipText, selected && styles.zodiacChipTextSelected]}>{item.name}</Text>
    </TouchableOpacity>
);

const HoroscopeCard = ({ icon, title, text, color }) => (
    <View style={[styles.horoscopeCard, { borderLeftColor: color }]}>
        <View style={styles.cardHeader}>
            <Ionicons name={icon} size={20} color={color} />
            <Text style={[styles.cardTitle, { color }]}>{title}</Text>
        </View>
        <Text style={styles.cardText}>{text}</Text>
    </View>
);

export default function DailyHoroscopeScreen() {
    const { t, language } = useLanguage();
    const [selectedSign, setSelectedSign] = useState(1);
    const [loading, setLoading] = useState(false);
    const [horoscope, setHoroscope] = useState(null);
    const [error, setError] = useState(false);
    const flatListRef = useRef(null);
    const today = new Date();

    const dateStr = today.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    // Correct localhost depending on simulator


    const fetchHoroscope = async (signId) => {
        setLoading(true);
        setError(false);
        try {
            const rashiName = getZodiacName(signId, 'en'); // Always fetch by English name
            const dateIso = today.toISOString().split('T')[0];
            
            const response = await fetch(`${API_URL}/astrology/horoscope/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rashi: rashiName,
                    date: dateIso,
                    lang: language
                }),
            });
            const data = await response.json();
            if (data.success) {
                setHoroscope(data.data);
            } else {
                setError(true);
            }
        } catch (e) {
            console.error("Failed to fetch horoscope", e);
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHoroscope(selectedSign);
    }, [selectedSign, language]);

    const handleSelect = (id) => {
        setSelectedSign(id);
        const index = ZODIAC_LIST(language).findIndex(z => z.id === id);
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.3 });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="sunny" size={32} color="#B8860B" />
                    <Text style={styles.title}>{t('daily_horoscope')}</Text>
                    <Text style={styles.dateText}>{dateStr}</Text>
                </View>

                {/* Zodiac Selector */}
                <FlatList
                    ref={flatListRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={ZODIAC_LIST(language)}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <ZodiacChip
                            item={item}
                            selected={item.id === selectedSign}
                            onPress={() => handleSelect(item.id)}
                        />
                    )}
                    contentContainerStyle={styles.zodiacList}
                    style={styles.zodiacContainer}
                    getItemLayout={(_, index) => ({ length: 90, offset: 90 * index, index })}
                />

                {/* Selected Sign Header */}
                <View style={styles.signHeader}>
                    <Text style={styles.signEmoji}>{getZodiacSymbol(selectedSign, language)}</Text>
                    <Text style={styles.signName}>{getZodiacName(selectedSign, language)}</Text>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#B8860B" style={{ marginTop: 40 }} />
                ) : horoscope ? (
                    <>
                        <View style={styles.mathInsights}>
                            <Text style={styles.insightText}>🪐 {t('moon_transit')} {horoscope.moon_transit} ({t('house_word')} {horoscope.transit_house_from_natal})</Text>
                        </View>
                        <HoroscopeCard icon="star" title={t('vedic_gochar')} text={horoscope.prediction} color="#B8860B" />
                    </>
                ) : error ? (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ color: '#999', marginBottom: 12 }}>{t('prediction_error')}</Text>
                        <TouchableOpacity
                            style={{ backgroundColor: '#B8860B', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                            onPress={() => fetchHoroscope(selectedSign)}
                        >
                            <Text style={{ color: '#FFF', fontWeight: '600' }}>{t('retry') || 'Retry'}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>{t('prediction_error')}</Text>
                )}

                {/* Disclaimer */}
                <View style={styles.disclaimerBox}>
                    <Ionicons name="information-circle-outline" size={16} color="#999" />
                    <Text style={styles.disclaimerText}>
                        {t('calculations_disclaimer')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 26, fontWeight: '300', color: '#B8860B', letterSpacing: 1.5, marginTop: 8 },
    dateText: { fontSize: 13, color: '#888', marginTop: 4 },
    zodiacContainer: { marginBottom: 20, maxHeight: 80 },
    zodiacList: { gap: 8, paddingHorizontal: 4 },
    zodiacChip: {
        alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12,
        borderRadius: 12, backgroundColor: '#F5F0E8', borderWidth: 1, borderColor: '#EBE7E0',
        minWidth: 78,
    },
    zodiacChipSelected: { backgroundColor: '#B8860B', borderColor: '#B8860B' },
    zodiacEmoji: { fontSize: 22 },
    zodiacChipText: { fontSize: 11, color: '#666', fontWeight: '600', marginTop: 2 },
    zodiacChipTextSelected: { color: '#FFFFFF' },
    signHeader: { alignItems: 'center', marginBottom: 16 },
    signEmoji: { fontSize: 48 },
    signName: { fontSize: 22, fontWeight: '600', color: '#333', letterSpacing: 1, marginTop: 4 },
    attributesRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    attrCard: {
        flex: 1, backgroundColor: '#FFF8E7', borderRadius: 12, padding: 12, alignItems: 'center',
        borderWidth: 1, borderColor: '#F0E6C8',
    },
    attrIcon: { fontSize: 20 },
    attrLabel: { fontSize: 10, color: '#999', fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    attrValue: { fontSize: 13, color: '#333', fontWeight: '700', marginTop: 2 },
    horoscopeCard: {
        backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, marginBottom: 14,
        borderLeftWidth: 4, borderWidth: 1, borderColor: '#EBE7E0',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    cardTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    cardText: { fontSize: 15, color: '#444', lineHeight: 24 },
    mathInsights: { backgroundColor: '#FFF8E7', borderRadius: 12, padding: 12, marginBottom: 14, alignItems: 'center', borderWidth: 1, borderColor: '#F0E6C8' },
    insightText: { fontSize: 14, color: '#555', textAlign: 'center' },
    disclaimerBox: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, paddingHorizontal: 12 },
    disclaimerText: { fontSize: 11, color: '#999', flex: 1, lineHeight: 16 },
});
