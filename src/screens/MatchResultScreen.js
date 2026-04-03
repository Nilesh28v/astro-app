import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { metrics } from '../utils/metrics';

export default function MatchResultScreen({ route }) {
    const { t, language } = useLanguage();
    const { result, boyName, girlName } = route.params;

    const { scores, totalScore, maxScore, interpretation, hasNadiDosh, hasBhakootDosh } = result.match;

    const getScoreColor = (score) => {
        if (score >= 24) return '#27AE60';
        if (score >= 18) return '#F39C12';
        return '#E74C3C';
    };

    const renderBar = (label, score, max) => {
        const percentage = (score / max) * 100;
        return (
            <View style={styles.barContainer} key={label}>
                <View style={styles.barLabelRow}>
                    <Text style={styles.barLabel}>{label}</Text>
                    <Text style={styles.barScore}>{score} / {max}</Text>
                </View>
                <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: getScoreColor(score * (36/max)) }]} />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                
                {/* Score Header */}
                <View style={[styles.scoreHeader, { backgroundColor: getScoreColor(totalScore) + '1A' }]}>
                    <Text style={[styles.scoreNumber, { color: getScoreColor(totalScore) }]}>
                        {totalScore} <Text style={{ fontSize: metrics.moderateScale(18) }}>/ {maxScore}</Text>
                    </Text>
                    <Text style={[styles.interpretation, { color: getScoreColor(totalScore) }]}>
                        {interpretation}
                    </Text>
                </View>

                {/* Names */}
                <View style={styles.namesBox}>
                    <View style={styles.nameCard}>
                        <Ionicons name="male" size={24} color="#3498DB" />
                        <Text style={styles.nameText}>{boyName}</Text>
                        <Text style={styles.nakText}>{result.boy.nakshatra}</Text>
                    </View>
                    <Ionicons name="heart" size={30} color="#E74C3C" style={{ marginHorizontal: 20 }} />
                    <View style={styles.nameCard}>
                        <Ionicons name="female" size={24} color="#E67E22" />
                        <Text style={styles.nameText}>{girlName}</Text>
                        <Text style={styles.nakText}>{result.girl.nakshatra}</Text>
                    </View>
                </View>

                {/* Alerts */}
                {(hasNadiDosh || hasBhakootDosh) && (
                    <View style={styles.alertBox}>
                        <Ionicons name="warning" size={20} color="#C0392B" />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            {hasNadiDosh && <Text style={styles.alertText}>• Nadi Dosh (0/8 points) - Careful analysis needed for health/progeny.</Text>}
                            {hasBhakootDosh && <Text style={styles.alertText}>• Bhakoot Dosh (0/7 points) - May affect emotional harmony.</Text>}
                        </View>
                    </View>
                )}

                {/* Detailed Breakdown */}
                <Text style={styles.sectionTitle}>{language === 'hi' ? 'अनुकूलता विवरण' : 'Compatibility Breakdown'}</Text>
                <View style={styles.detailsCard}>
                    {renderBar('Varna (Work/Ego)', scores.varna, 1)}
                    {renderBar('Vashya (Dominance)', scores.vashya, 2)}
                    {renderBar('Tara (Destiny)', scores.tara, 3)}
                    {renderBar('Yoni (Intimacy)', scores.yoni, 4)}
                    {renderBar('Graha Maitri (Mind)', scores.grahaMaitri, 5)}
                    {renderBar('Gana (Temperament)', scores.gana, 6)}
                    {renderBar('Bhakoot (Love)', scores.bhakoot, 7)}
                    {renderBar('Nadi (Health/Genes)', scores.nadi, 8)}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    scroll: { padding: metrics.scale(20) },
    scoreHeader: { alignItems: 'center', padding: metrics.verticalScale(24), borderRadius: 16, marginBottom: metrics.verticalScale(20) },
    scoreNumber: { fontSize: metrics.moderateScale(48), fontWeight: '700' },
    interpretation: { fontSize: metrics.moderateScale(16), fontWeight: '600', marginTop: 10 },
    namesBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: metrics.verticalScale(24) },
    nameCard: { alignItems: 'center', backgroundColor: '#FFF', padding: metrics.scale(16), borderRadius: 12, elevation: 1, width: '40%' },
    nameText: { fontSize: metrics.moderateScale(16), fontWeight: '600', marginTop: 8 },
    nakText: { fontSize: metrics.moderateScale(12), color: '#888', marginTop: 4 },
    alertBox: { flexDirection: 'row', backgroundColor: '#FDEDEC', padding: metrics.scale(16), borderRadius: 12, marginBottom: metrics.verticalScale(20), borderWidth: 1, borderColor: '#F5B7B1' },
    alertText: { color: '#C0392B', fontSize: metrics.moderateScale(13), fontWeight: '500', marginBottom: 4 },
    sectionTitle: { fontSize: metrics.moderateScale(18), fontWeight: '700', color: '#333', marginBottom: metrics.verticalScale(16) },
    detailsCard: { backgroundColor: '#FFF', padding: metrics.scale(16), borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    barContainer: { marginBottom: 16 },
    barLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    barLabel: { fontSize: metrics.moderateScale(14), color: '#555', fontWeight: '500' },
    barScore: { fontSize: metrics.moderateScale(14), color: '#B8860B', fontWeight: '600' },
    barTrack: { height: 8, backgroundColor: '#EBE7E0', borderRadius: 4, overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: 4 }
});
