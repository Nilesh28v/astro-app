import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import astrologyData from '../../assets/data/astrologyData.json';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';
import { getZodiacSymbol } from '../utils/horoscopeEngine';

const InfoRow = ({ label, value, onPress }) => (
    <TouchableOpacity
        style={styles.infoRow}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.6 : 1}
    >
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, onPress && styles.infoValueTappable]}>
            {Array.isArray(value) ? value.join(', ') : value}
            {onPress ? ' →' : ''}
        </Text>
    </TouchableOpacity>
);

const ZodiacDetailsScreen = ({ route, navigation }) => {
    const { zodiac } = route.params;
    const { t, language } = useLanguage();

    const localized = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.zodiacs[zodiac.id] : null;
    const common = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.common : {};

    const translateValue = (val) => {
        if (language !== 'hi') return val;
        const key = val?.toLowerCase();
        return common[key] || val;
    };

    const handleRulingPlanetPress = () => {
        // Extract the base planet name (e.g., "Mars" from "Mars (and Ketu)")
        const planetName = zodiac.rulingPlanet.split(' (')[0].split(' and ')[0].trim();
        const planet = astrologyData.planets.find(
            (p) => p.name.toLowerCase().includes(planetName.toLowerCase())
        );
        if (planet) {
            navigation.navigate('PlanetDetails', { planet });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.symbol}>{getZodiacSymbol(zodiac.id, language)}</Text>
                    <Text style={styles.name}>{localized?.name || zodiac.name}</Text>
                    <Text style={styles.meta}>
                        {translateValue(zodiac.element)} • {translateValue(zodiac.quality)}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('overview')}</Text>
                    <Text style={styles.description}>{localized?.description || zodiac.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('key_attributes')}</Text>
                    <View style={styles.infoCard}>
                        <InfoRow
                            label={t('ruling_planet')}
                            value={zodiac.rulingPlanet}
                            onPress={handleRulingPlanetPress}
                        />
                        <InfoRow label={t('element')} value={translateValue(zodiac.element)} />
                        <InfoRow label={t('quality')} value={translateValue(zodiac.quality)} />
                        <InfoRow label={t('gender')} value={translateValue(zodiac.gender)} />
                        <InfoRow label={t('lucky_numbers')} value={zodiac.luckyNumbers} />
                        <InfoRow label={t('lucky_colors')} value={zodiac.luckyColors} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('positive_traits')}</Text>
                    <View style={styles.badgeRow}>
                        {zodiac.positiveTraits.map((trait, idx) => (
                            <View key={idx} style={styles.positiveBadge}>
                                <Text style={styles.positiveBadgeText}>{trait}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('negative_traits')}</Text>
                    <View style={styles.badgeRow}>
                        {zodiac.negativeTraits.map((trait, idx) => (
                            <View key={idx} style={styles.negativeBadge}>
                                <Text style={styles.negativeBadgeText}>{trait}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('compatibility')}</Text>
                    <View style={styles.badgeRow}>
                        {zodiac.compatibility.map((sign, idx) => (
                            <View key={idx} style={styles.compatBadge}>
                                <Text style={styles.compatBadgeText}>{sign}</Text>
                            </View>
                        ))}
                    </View>
                </View>
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
        alignItems: 'center',
        marginBottom: 36,
        marginTop: 10,
    },
    symbol: {
        fontSize: 64,
        color: '#B8860B',
        marginBottom: 10,
    },
    name: {
        fontSize: 28,
        fontWeight: '300',
        color: '#1A1A1A',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    meta: {
        fontSize: 14,
        color: '#999999',
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#B8860B',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#444444',
        lineHeight: 26,
        fontWeight: '400',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EBE7E0',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F0E8',
    },
    infoLabel: {
        fontSize: 14,
        color: '#888888',
        fontWeight: '500',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    infoValueTappable: {
        color: '#B8860B',
    },
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    positiveBadge: {
        backgroundColor: '#F0F8E7',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#D4E8C4',
    },
    positiveBadgeText: {
        fontSize: 13,
        color: '#4A7C23',
        fontWeight: '500',
    },
    negativeBadge: {
        backgroundColor: '#FFF0EE',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0D0CC',
    },
    negativeBadgeText: {
        fontSize: 13,
        color: '#C0392B',
        fontWeight: '500',
    },
    compatBadge: {
        backgroundColor: '#FFF8E7',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0E6C8',
    },
    compatBadgeText: {
        fontSize: 13,
        color: '#8B6914',
        fontWeight: '500',
    },
});

export default ZodiacDetailsScreen;
