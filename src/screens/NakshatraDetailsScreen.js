import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{Array.isArray(value) ? value.join(', ') : value}</Text>
    </View>
);

const NakshatraDetailsScreen = ({ route }) => {
    const { nakshatra } = route.params;
    const { t } = useLanguage();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.numberLarge}>
                        <Text style={styles.numberText}>{nakshatra.number}</Text>
                    </View>
                    <Text style={styles.name}>{nakshatra.name}</Text>
                    <Text style={styles.meta}>{nakshatra.zodiacSpan}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('overview')}</Text>
                    <Text style={styles.description}>{nakshatra.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('key_attributes')}</Text>
                    <View style={styles.infoCard}>
                        <InfoRow label={t('ruling_planet')} value={nakshatra.rulingPlanet} />
                        <InfoRow label={t('deity')} value={nakshatra.deity} />
                        <InfoRow label={t('symbol_label')} value={nakshatra.symbol} />
                        <InfoRow label={t('animal_symbol')} value={nakshatra.animalSymbol} />
                        <InfoRow label={t('gana')} value={nakshatra.gana} />
                        <InfoRow label={t('quality')} value={nakshatra.quality} />
                        <InfoRow label={t('element')} value={nakshatra.element} />
                        <InfoRow label={t('zodiac_span')} value={nakshatra.zodiacSpan} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('positive_traits')}</Text>
                    <View style={styles.badgeRow}>
                        {nakshatra.positiveTraits.map((trait, idx) => (
                            <View key={idx} style={styles.positiveBadge}>
                                <Text style={styles.positiveBadgeText}>{trait}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('negative_traits')}</Text>
                    <View style={styles.badgeRow}>
                        {nakshatra.negativeTraits.map((trait, idx) => (
                            <View key={idx} style={styles.negativeBadge}>
                                <Text style={styles.negativeBadgeText}>{trait}</Text>
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
    numberLarge: {
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
    numberText: {
        fontSize: 28,
        fontWeight: '300',
        color: '#B8860B',
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
});

export default NakshatraDetailsScreen;
