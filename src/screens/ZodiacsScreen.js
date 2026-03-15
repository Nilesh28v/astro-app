import React, { useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import astrologyData from '../../assets/data/astrologyData.json';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';
import { getZodiacSymbol } from '../utils/horoscopeEngine';

const ZodiacCard = React.memo(({ item, onPress, language }) => {
    const localized = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.zodiacs[item.id] : null;
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.zodiacSymbol}>{getZodiacSymbol(item.id, language)}</Text>
                <View style={styles.cardTitleArea}>
                    <Text style={styles.zodiacName}>{localized?.name || item.name}</Text>
                    <Text style={styles.zodiacMeta}>{item.element} • {item.quality} • {item.rulingPlanet}</Text>
                </View>
            </View>
            <View style={styles.traitsRow}>
                {item.positiveTraits.slice(0, 3).map((trait, idx) => (
                    <View key={idx} style={styles.traitBadge}>
                        <Text style={styles.traitText}>{trait}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
});

const ZodiacsScreen = ({ navigation }) => {
    const { t, language } = useLanguage();
    const handlePress = useCallback((item) => {
        navigation.navigate('ZodiacDetails', { zodiac: item });
    }, [navigation]);

    const renderItem = useCallback(({ item }) => (
        <ZodiacCard item={item} onPress={handlePress} language={language} />
    ), [handlePress, language]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t('zodiacs')}</Text>
                <Text style={styles.subtitle}>{t('zodiacs_desc')}</Text>

                <FlatList
                    data={astrologyData.zodiacs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={12}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '300',
        color: '#1A1A1A',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#888888',
        marginBottom: 28,
        lineHeight: 22,
    },
    listContainer: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#EBE7E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    zodiacSymbol: {
        fontSize: 32,
        color: '#B8860B',
        marginRight: 14,
    },
    cardTitleArea: {
        flex: 1,
    },
    zodiacName: {
        fontSize: 18,
        fontWeight: '400',
        color: '#1A1A1A',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    zodiacMeta: {
        fontSize: 13,
        color: '#999999',
    },
    traitsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    traitBadge: {
        backgroundColor: '#F5F0E8',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    traitText: {
        fontSize: 12,
        color: '#8B6914',
        fontWeight: '500',
    },
});

export default ZodiacsScreen;
