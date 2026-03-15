import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import astrologyData from '../../assets/data/astrologyData.json';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';

const InfoRow = ({ label, value, t }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{Array.isArray(value) ? value.join(', ') : value}</Text>
    </View>
);

const PlacementCard = ({ placement, house, onPress, language, planet }) => {
    const localizedHouse = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.houses[house.id] : null;
    return (
        <TouchableOpacity
            style={styles.placementCard}
            onPress={() => onPress(house)}
            activeOpacity={0.7}
        >
            <View style={styles.placementHeader}>
                <View style={styles.houseNumberCircle}>
                    <Text style={styles.houseNumberText}>{placement.house}</Text>
                </View>
                <Text style={styles.placementHouseName} numberOfLines={1}>{localizedHouse?.name || house.name}</Text>
            </View>
            <Text style={styles.placementEffect}>
                {(language === 'hi' && ASTROLOGY_TRANSLATIONS.hi.placements?.[planet.id]?.[placement.house])
                    ? ASTROLOGY_TRANSLATIONS.hi.placements[planet.id][placement.house]
                    : placement.effect}
            </Text>
        </TouchableOpacity>
    );
};

const PlanetDetailsScreen = ({ route, navigation }) => {
    const { planet } = route.params;
    const { t, language } = useLanguage();
    const placements = astrologyData.placements[planet.id] || [];

    const localized = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.planets[planet.id] : null;
    const common = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.common : {};

    const translateValue = (val) => {
        if (language !== 'hi') return val;
        const key = val?.toLowerCase();
        return common[key] || val;
    };

    const handleHousePress = (house) => {
        navigation.navigate('HouseDetails', { house });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.symbol}>{planet.symbol}</Text>
                    <Text style={styles.name}>{localized?.name || planet.name}</Text>
                    <Text style={styles.natureBadge}>{translateValue(planet.nature)}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('overview')}</Text>
                    <Text style={styles.description}>{localized?.description || planet.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('significance')}</Text>
                    <Text style={styles.description}>{localized?.significance || planet.significance}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('key_attributes')}</Text>
                    <View style={styles.infoCard}>
                        <InfoRow label={t('element')} value={translateValue(planet.element)} />
                        <InfoRow label={t('gender')} value={translateValue(planet.gender)} />
                        <InfoRow label={t('gemstone')} value={planet.gemstone} />
                        <InfoRow label={t('metal')} value={planet.metal} />
                        <InfoRow label={t('color')} value={planet.color} />
                        <InfoRow label={t('ruling_day')} value={translateValue(planet.rulingDay)} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('dignity')}</Text>
                    <View style={styles.infoCard}>
                        <InfoRow label={t('exaltation')} value={planet.exaltation} />
                        <InfoRow label={t('debilitation')} value={planet.debilitation} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('relationships')}</Text>
                    <View style={styles.infoCard}>
                        <InfoRow label={t('friends')} value={planet.friends} />
                        <InfoRow label={t('enemies')} value={planet.enemies} />
                        <InfoRow label={t('neutral')} value={planet.neutral} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('beej_mantra')}</Text>
                    <View style={styles.mantraCard}>
                        <Text style={styles.mantraText}>{planet.mantra}</Text>
                    </View>
                </View>

                {placements.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('house_placement')}</Text>
                        <Text style={styles.placementSubtitle}>
                            {t('house_tap_instruction')}
                        </Text>
                        {placements.map((placement) => {
                            const house = astrologyData.houses.find(
                                (h) => parseInt(h.id) === placement.house
                            );
                            return (
                                <PlacementCard
                                    key={placement.house}
                                    placement={placement}
                                    house={house}
                                    onPress={handleHousePress}
                                    language={language}
                                    planet={planet}
                                />
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
        marginBottom: 8,
    },
    natureBadge: {
        fontSize: 12,
        color: '#B8860B',
        fontWeight: '600',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        backgroundColor: '#FFF8E7',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        overflow: 'hidden',
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
    mantraCard: {
        backgroundColor: '#FFF8E7',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0E6C8',
    },
    mantraText: {
        fontSize: 15,
        color: '#8B6914',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    placementSubtitle: {
        fontSize: 13,
        color: '#999999',
        marginBottom: 14,
        marginTop: -4,
    },
    placementCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#EBE7E0',
    },
    placementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    houseNumberCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF8E7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    houseNumberText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#B8860B',
    },
    placementHouseName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A1A',
        flex: 1,
    },
    placementEffect: {
        fontSize: 14,
        color: '#555555',
        lineHeight: 22,
    },
});

export default PlanetDetailsScreen;
