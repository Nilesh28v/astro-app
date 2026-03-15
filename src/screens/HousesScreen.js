import React, { useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import astrologyData from '../../assets/data/astrologyData.json';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';

const HouseCard = React.memo(({ item, onPress, language }) => {
    const localized = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.houses[item.id] : null;
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.houseNumber}>
                    <Text style={styles.houseNumberText}>{item.id}</Text>
                </View>
                <View style={styles.cardTitleArea}>
                    <Text style={styles.houseName}>{localized?.name || item.name}</Text>
                    <Text style={styles.houseSign}>{item.rulingSign}</Text>
                </View>
            </View>
            <View style={styles.keywordsRow}>
                {item.keywords.slice(0, 4).map((kw, idx) => (
                    <View key={idx} style={styles.keywordBadge}>
                        <Text style={styles.keywordText}>{kw}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
});

const HousesScreen = ({ navigation }) => {
    const { t, language } = useLanguage();
    const handlePress = useCallback((item) => {
        navigation.navigate('HouseDetails', { house: item });
    }, [navigation]);

    const renderItem = useCallback(({ item }) => (
        <HouseCard item={item} onPress={handlePress} language={language} />
    ), [handlePress, language]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t('houses')}</Text>
                <Text style={styles.subtitle}>{t('houses_desc')}</Text>

                <FlatList
                    data={astrologyData.houses}
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
    houseNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF8E7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    houseNumberText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#B8860B',
    },
    cardTitleArea: {
        flex: 1,
    },
    houseName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    houseSign: {
        fontSize: 13,
        color: '#999999',
    },
    keywordsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    keywordBadge: {
        backgroundColor: '#F5F0E8',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    keywordText: {
        fontSize: 12,
        color: '#8B6914',
        fontWeight: '500',
    },
});

export default HousesScreen;
