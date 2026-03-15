import React, { useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import astrologyData from '../../assets/data/astrologyData.json';
import { useLanguage } from '../context/LanguageContext';

const NakshatraCard = React.memo(({ item, onPress }) => (
    <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
    >
        <View style={styles.cardHeader}>
            <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{item.number}</Text>
            </View>
            <View style={styles.cardTitleArea}>
                <Text style={styles.nakshatraName}>{item.name}</Text>
                <Text style={styles.nakshatraMeta}>{item.rulingPlanet} • {item.zodiacSpan}</Text>
            </View>
        </View>
        <View style={styles.detailRow}>
            <Text style={styles.deityText}>☸ {item.deity}</Text>
        </View>
        <View style={styles.traitsRow}>
            {item.positiveTraits.slice(0, 3).map((trait, idx) => (
                <View key={idx} style={styles.traitBadge}>
                    <Text style={styles.traitText}>{trait}</Text>
                </View>
            ))}
        </View>
    </TouchableOpacity>
));

const NakshatrasScreen = ({ navigation }) => {
    const { t } = useLanguage();
    const handlePress = useCallback((item) => {
        navigation.navigate('NakshatraDetails', { nakshatra: item });
    }, [navigation]);

    const renderItem = useCallback(({ item }) => (
        <NakshatraCard item={item} onPress={handlePress} />
    ), [handlePress]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{t('nakshatras')}</Text>
                <Text style={styles.subtitle}>{t('nakshatras_subtitle')}</Text>

                <FlatList
                    data={astrologyData.nakshatras}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
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
        marginBottom: 10,
    },
    numberCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF8E7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    numberText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#B8860B',
    },
    cardTitleArea: {
        flex: 1,
    },
    nakshatraName: {
        fontSize: 18,
        fontWeight: '400',
        color: '#1A1A1A',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    nakshatraMeta: {
        fontSize: 13,
        color: '#999999',
    },
    detailRow: {
        marginBottom: 10,
    },
    deityText: {
        fontSize: 13,
        color: '#8B6914',
        fontWeight: '500',
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

export default NakshatrasScreen;
