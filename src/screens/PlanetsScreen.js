import React, { useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import astrologyData from '../../assets/data/astrologyData.json';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';

const PlanetCard = React.memo(({ item, onPress, language }) => {
    const localized = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.planets[item.id] : null;
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.planetSymbol}>{item.symbol}</Text>
                <Text style={styles.planetName}>{localized?.name || item.name}</Text>
            </View>
            <Text style={styles.planetBrief} numberOfLines={2}>
                {localized?.description || item.description}
            </Text>
        </TouchableOpacity>
    );
});

const PlanetsScreen = ({ navigation }) => {
    const { t, language } = useLanguage();
    const handlePress = useCallback((item) => {
        navigation.navigate('PlanetDetails', { planet: item });
    }, [navigation]);

    const renderItem = useCallback(({ item }) => (
        <PlanetCard item={item} onPress={handlePress} language={language} />
    ), [handlePress, language]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t('planets')}</Text>
                <Text style={styles.subtitle}>{t('planets_desc')}</Text>

                <FlatList
                    data={astrologyData.planets}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
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
        paddingTop: 20, // Reduced from 40 as navigation header handles top padding
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
        marginBottom: 32,
        lineHeight: 22,
    },
    listContainer: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#EBE7E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    planetSymbol: {
        fontSize: 24,
        color: '#B8860B',
        marginRight: 12,
    },
    planetName: {
        fontSize: 20,
        fontWeight: '400',
        color: '#1A1A1A',
        letterSpacing: 0.5,
    },
    planetBrief: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
});

export default PlanetsScreen;
