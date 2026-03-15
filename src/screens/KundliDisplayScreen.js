import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';
import astrologyData from '../../assets/data/astrologyData.json';
import KundliChart from '../components/KundliChart';
import { API_URL } from '../utils/apiConfig';



const PredictionCard = ({ planetName, house, effect, onPress, t, language }) => {
    const hiPlanet = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.planets?.[planetName.toLowerCase()] : null;
    const displayPlanetName = hiPlanet?.name || planetName;
    const planetId = planetName.toLowerCase(); // Assuming planetName is like 'Sun', 'Moon' etc.
    return (
    <TouchableOpacity
        style={styles.predictionCard}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.predictionHeader}>
            <Text style={styles.planetName}>{displayPlanetName}</Text>
            <View style={styles.houseBadge}>
                <Text style={styles.houseBadgeText}>{t('house_word')} {house}</Text>
            </View>
        </View>
        <Text style={styles.predictionEffect}>
            {(language === 'hi' && ASTROLOGY_TRANSLATIONS.hi.placements?.[planetId]?.[house])
                ? ASTROLOGY_TRANSLATIONS.hi.placements[planetId][house]
                : effect}
        </Text>
        <Text style={styles.tapTip}>{t('tap_learn_more')} {displayPlanetName} →</Text>
    </TouchableOpacity>
    );
};

const KundliDisplayScreen = ({ route, navigation }) => {
    const { name, date, lat, lon, city } = route.params;
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const birthDate = new Date(date);

    const [loading, setLoading] = useState(true);
    const [rawKundliData, setRawKundliData] = useState(null);
    const [viewMode, setViewMode] = useState('D1'); // D1 or D9

    const fetchKundliData = async () => {
        setLoading(true);
        try {
            const dateStr = birthDate.toISOString().split('T')[0];
            const timeStr = birthDate.toTimeString().split(' ')[0].substring(0, 5);
            
            const response = await fetch(`${API_URL}/astrology/kundli`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateStr, time: timeStr, lat, lon })
            });
            const data = await response.json();
            if (data.success) {
                setLoading(false);
                setRawKundliData(data.data);
                
                // Automatically save Kundli for the user
                if (user?.firebaseUid) {
                    saveKundli(data.data);
                }
            }
        } catch (e) {
            console.error("Failed to fetch Kundli data", e);
            setLoading(false);
        }
    };

    const saveKundli = async (chartData) => {
        try {
            await fetch(`${API_URL}/kundlis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.firebaseUid,
                    name: name,
                    date: new Date(date).toISOString(),
                    time: new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    location: { name: city, lat, lon },
                    chart: chartData
                })
            });
            console.log("Kundli saved successfully");
        } catch (e) {
            console.error("Failed to save Kundli", e);
        }
    };
    
    useEffect(() => {
        fetchKundliData();
    }, []);

    // Transform raw planetary data into House data for the UI Chart
    const chartData = useMemo(() => {
        if (!rawKundliData) return null;

        const placements = viewMode === 'D1' ? rawKundliData.d1_lagna : rawKundliData.d9_navamsha;
        const asc = placements.find(p => p.name === 'Ascendant');
        if (!asc) return null;

        const startRashi = viewMode === 'D1' ? asc.zodiacIndex : asc.d9ZodiacIndex;
        
        // Build 12 houses starting from Lagna house
        const houses = [];
        for (let h = 1; h <= 12; h++) {
            const currentRashi = ((startRashi + h - 2) % 12) + 1;
            
            // Find planets in this rashi
            const planetsInHouse = placements
                .filter(p => (viewMode === 'D1' ? p.zodiacIndex : p.d9ZodiacIndex) === currentRashi)
                .filter(p => p.name !== 'Ascendant')
                .map(p => p.name);

            houses.push({
                number: h,
                rashi: currentRashi,
                planets: planetsInHouse
            });
        }
        return houses;
    }, [rawKundliData, viewMode]);

    const predictions = useMemo(() => {
        if (!rawKundliData || !chartData) return [];
        
        // Using D1 placements for behavioral predictions
        const placements = rawKundliData.d1_lagna;
        const asc = placements.find(p => p.name === 'Ascendant');
        const startRashi = asc.zodiacIndex;

        return placements
            .filter(p => p.name !== 'Ascendant')
            .map(pos => {
                const planetId = pos.name.toLowerCase();
                
                // Calculate which house the planet is in
                // House = (PlanetRashi - LagnaRashi + 12) % 12 + 1
                let houseNum = (pos.zodiacIndex - startRashi + 12) % 12 + 1;

                const placementsData = astrologyData.placements[planetId] || [];
                const placementEntry = placementsData.find(p => p.house === houseNum);

                // Find planet object for navigation metadata
                const planetObj = astrologyData.planets.find(p => p.id === planetId);

                const placementEffect = (language === 'hi' && ASTROLOGY_TRANSLATIONS.hi.placements?.[planetId]?.[houseNum])
                    ? ASTROLOGY_TRANSLATIONS.hi.placements[planetId][houseNum]
                    : (placementEntry ? placementEntry.effect : t('placement_fallback'));

                return {
                    planetName: pos.name,
                    planetObj,
                    house: houseNum,
                    effect: placementEffect,
                    rashi: pos.zodiacIndex
                };
            });
    }, [rawKundliData, chartData, language, t]);

    const handlePlanetPress = (planet) => {
        if (!planet) return;
        navigation.navigate('MoreTab', {
            screen: 'PlanetDetails',
            params: { planet }
        });
    };

    if (loading) {
        return (
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#B8860B" />
                <Text style={{marginTop: 10, color: '#B8860B'}}>{t('calculating_degrees')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>{name}{t('kundli_title_suffix')}</Text>
                    <Text style={styles.subtitle}>
                        {birthDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')} — {birthDate.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={styles.cityText}>{city}</Text>
                </View>

                {/* Dual Chart Toggle */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity 
                        style={[styles.toggleButton, viewMode === 'D1' && styles.toggleActive]}
                        onPress={() => setViewMode('D1')}
                    >
                        <Text style={[styles.toggleText, viewMode === 'D1' && styles.toggleTextActive]}>{t('birth_chart_d1')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.toggleButton, viewMode === 'D9' && styles.toggleActive]}
                        onPress={() => setViewMode('D9')}
                    >
                        <Text style={[styles.toggleText, viewMode === 'D9' && styles.toggleTextActive]}>{t('navamsha_d9')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.chartSection}>
                    <Text style={styles.sectionTitle}>{viewMode === 'D1' ? t('lagna_kundli') : t('d9_navamsha_chart')}</Text>
                    {chartData && <KundliChart houses={chartData} size={320} />}
                    <View style={styles.chartInfo}>
                        <Text style={styles.chartInfoText}>
                            {viewMode === 'D1' ? t('lagna_ascendant') : t('navamsha_ascendant')}: <Text style={styles.bold}>{chartData?.[0]?.rashi}</Text> ({t('house_word')} 1)
                        </Text>
                        <Text style={styles.chartNote}>
                            {viewMode === 'D1' ? t('d1_description') : t('d9_description')}
                        </Text>
                    </View>
                </View>

                <View style={styles.predictionsSection}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>{t('planetary_placements')}</Text>
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>{t('swisseph_verified')}</Text>
                        </View>
                    </View>
                    <Text style={styles.predictionsSubtitle}>{t('placements_subtitle')}</Text>

                    {predictions.map((pred, idx) => (
                        <PredictionCard
                            key={idx}
                            planetName={pred.planetName}
                            house={pred.house}
                            effect={pred.effect}
                            onPress={() => handlePlanetPress(pred.planetObj)}
                            t={t}
                            language={language}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.resetButtonText}>{t('calculate_another')}</Text>
                </TouchableOpacity>
            </ScrollView>
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
        paddingBottom: 60,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        color: '#1A1A1A',
        letterSpacing: 1,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
        fontWeight: '500',
    },
    cityText: {
        fontSize: 16,
        color: '#B8860B',
        fontWeight: '600',
        marginTop: 4,
    },
    chartSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#B8860B',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
    chartInfo: {
        marginTop: 15,
        alignItems: 'center',
    },
    chartInfoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    bold: {
        fontWeight: '600',
        color: '#1A1A1A',
    },
    predictionsSection: {
        marginBottom: 30,
    },
    predictionsSubtitle: {
        fontSize: 15,
        color: '#888',
        marginBottom: 20,
        lineHeight: 20,
    },
    predictionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EBE7E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    predictionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    planetName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#B8860B',
    },
    houseBadge: {
        backgroundColor: '#FFF8E7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0E6C8',
    },
    houseBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8B6914',
    },
    predictionEffect: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        marginBottom: 12,
    },
    tapTip: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'right',
    },
    resetButton: {
        padding: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B8860B',
        borderRadius: 8,
        marginTop: 10,
    },
    resetButtonText: {
        color: '#B8860B',
        fontSize: 16,
        fontWeight: '600',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0EAD6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 25,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleActive: {
        backgroundColor: '#B8860B',
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B6914',
    },
    toggleTextActive: {
        color: '#FFFFFF',
    },
    chartNote: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        marginTop: 4,
        textAlign: 'center',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    verifiedBadge: {
        backgroundColor: '#27AE60',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    verifiedText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    }
});

export default KundliDisplayScreen;
