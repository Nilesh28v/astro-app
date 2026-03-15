import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import astrologyData from '../../assets/data/astrologyData.json';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';

const HouseDetailsScreen = ({ route, navigation }) => {
    const { house } = route.params;
    const { t, language } = useLanguage();
    const houseNum = parseInt(house.id);

    const localized = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.houses[house.id] : null;

    // Gather planet effects for this house
    const planetEffects = astrologyData.planets
        .map((planet) => {
            const placements = astrologyData.placements[planet.id] || [];
            const placement = placements.find((p) => p.house === houseNum);
            return placement ? { planet, effect: placement.effect } : null;
        })
        .filter(Boolean);

    const handlePlanetPress = (planet) => {
        navigation.navigate('PlanetDetails', { planet });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.houseNumberLarge}>
                        <Text style={styles.houseNumberText}>{house.id}</Text>
                    </View>
                    <Text style={styles.name}>{localized?.name || house.name}</Text>
                    <Text style={styles.rulingSign}>{t('ruling_sign')}: {house.rulingSign}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('overview')}</Text>
                    <Text style={styles.description}>{localized?.description || house.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('keywords')}</Text>
                    <View style={styles.badgeRow}>
                        {house.keywords.map((kw, idx) => (
                            <View key={idx} style={styles.badge}>
                                <Text style={styles.badgeText}>{kw}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('body_parts')}</Text>
                    <View style={styles.infoCard}>
                        {house.bodyParts.map((part, idx) => (
                            <Text key={idx} style={styles.listItem}>• {part}</Text>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('significations')}</Text>
                    <View style={styles.infoCard}>
                        {house.significations.map((sig, idx) => (
                            <Text key={idx} style={styles.listItem}>• {sig}</Text>
                        ))}
                    </View>
                </View>

                {planetEffects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('planets_in_house')}</Text>
                        <Text style={styles.planetSubtitle}>
                            {t('planet_behavior')}
                        </Text>
                        {planetEffects.map(({ planet, effect }) => {
                            const localizedPlanet = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.planets[planet.id] : null;
                            return (
                                <TouchableOpacity
                                    key={planet.id}
                                    style={styles.planetEffectCard}
                                    onPress={() => handlePlanetPress(planet)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.planetHeader}>
                                        <Text style={styles.planetSymbol}>{planet.symbol}</Text>
                                        <Text style={styles.planetName}>{localizedPlanet?.name || planet.name}</Text>
                                    </View>
                                    <Text style={styles.planetEffect}>
                                        {(language === 'hi' && ASTROLOGY_TRANSLATIONS.hi.placements?.[planet.id]?.[houseNum])
                                            ? ASTROLOGY_TRANSLATIONS.hi.placements[planet.id][houseNum]
                                            : effect}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
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
    houseNumberLarge: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFF8E7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        borderWidth: 2,
        borderColor: '#F0E6C8',
    },
    houseNumberText: {
        fontSize: 28,
        fontWeight: '300',
        color: '#B8860B',
    },
    name: {
        fontSize: 22,
        fontWeight: '300',
        color: '#1A1A1A',
        letterSpacing: 1,
        textAlign: 'center',
        marginBottom: 6,
    },
    rulingSign: {
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
    badgeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        backgroundColor: '#FFF8E7',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0E6C8',
    },
    badgeText: {
        fontSize: 13,
        color: '#8B6914',
        fontWeight: '500',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EBE7E0',
    },
    listItem: {
        fontSize: 15,
        color: '#444444',
        lineHeight: 28,
    },
    planetSubtitle: {
        fontSize: 13,
        color: '#999999',
        marginBottom: 14,
        marginTop: -4,
    },
    planetEffectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EBE7E0',
    },
    planetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    planetSymbol: {
        fontSize: 24,
        color: '#B8860B',
        marginRight: 10,
    },
    planetName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A1A',
    },
    planetEffect: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 22,
    },
});

export default HouseDetailsScreen;
