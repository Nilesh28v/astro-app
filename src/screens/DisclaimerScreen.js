import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DISCLAIMER_KEY = '@disclaimer_accepted';

const DisclaimerScreen = ({ onAccept }) => {
    const [loading, setLoading] = useState(true);
    const [accepted, setAccepted] = useState(false);
    const [showFullTerms, setShowFullTerms] = useState(false);

    useEffect(() => {
        checkAcceptance();
    }, []);

    const checkAcceptance = async () => {
        try {
            const val = await AsyncStorage.getItem(DISCLAIMER_KEY);
            if (val === 'true') {
                setAccepted(true);
                onAccept();
            }
        } catch (e) { /* ignore */ }
        setLoading(false);
    };

    const handleAccept = async () => {
        try {
            await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
            setAccepted(true);
            onAccept();
        } catch (e) { /* ignore */ }
    };

    if (loading || accepted) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.icon}>🙏</Text>
                    <Text style={styles.title}>Welcome to Jyotish Guru</Text>
                    <Text style={styles.subtitle}>Vedic Astrology & Spiritual Guide</Text>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Ionicons name="information-circle-outline" size={24} color="#B8860B" />
                        <View style={styles.summaryTextContainer}>
                            <Text style={styles.summaryTitle}>Entertainment & Education</Text>
                            <Text style={styles.summaryDescription}>This app is for information and entertainment purposes only. Not a substitute for professional advice.</Text>
                        </View>
                    </View>

                    <View style={styles.summaryItem}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#B8860B" />
                        <View style={styles.summaryTextContainer}>
                            <Text style={styles.summaryTitle}>100% Private & Local</Text>
                            <Text style={styles.summaryDescription}>All your data stays on your device. We do not store or track any of your personal details.</Text>
                        </View>
                    </View>

                    <View style={styles.summaryItem}>
                        <Ionicons name="alert-circle-outline" size={24} color="#B8860B" />
                        <View style={styles.summaryTextContainer}>
                            <Text style={styles.summaryTitle}>User Responsibility</Text>
                            <Text style={styles.summaryDescription}>By proceeding, you agree to take full responsibility for any actions taken based on astrological suggestions.</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.expandToggle}
                    onPress={() => setShowFullTerms(!showFullTerms)}
                >
                    <Text style={styles.expandToggleText}>
                        {showFullTerms ? "Hide Detailed Terms" : "Review All Terms & Conditions"}
                    </Text>
                    <Ionicons
                        name={showFullTerms ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#B8860B"
                    />
                </TouchableOpacity>

                {showFullTerms && (
                    <View style={styles.fullTermsContainer}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>1. Educational Purpose Only</Text>
                            <Text style={styles.cardText}>
                                None of the content should be treated as professional medical, legal, or financial advice.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>2. No Guarantee of Accuracy</Text>
                            <Text style={styles.cardText}>
                                Astrological calculations are based on traditional Vedic texts and are approximate in nature.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>3. Remedies & Suggestions</Text>
                            <Text style={styles.cardText}>
                                Gemstone, mantra, and fasting suggestions are shared for informational purposes. Individual results vary.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>4. Limitation of Liability</Text>
                            <Text style={styles.cardText}>
                                Developers are not liable for any outcomes arising from the use of or reliance upon any content provided by this app.
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.footer}>
                    <Text style={styles.agreeText}>
                        By tapping "Agree & Continue", you confirm that you have read and accepted our terms.
                    </Text>

                    <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                        <Text style={styles.acceptButtonText}>🙏 I Agree & Continue</Text>
                    </TouchableOpacity>

                    <Text style={styles.copyrightText}>
                        © {new Date().getFullYear()} Jyotish Guru.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7'
    },
    content: {
        padding: 24,
        paddingBottom: 40
    },
    header: {
        alignItems: 'center',
        marginVertical: 32,
    },
    icon: {
        fontSize: 56,
        marginBottom: 16
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#2D2D2D',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 14,
        color: '#B8860B',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 6,
        letterSpacing: 2
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#B8860B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 24,
    },
    summaryItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    summaryTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2D2D2D',
        marginBottom: 4,
    },
    summaryDescription: {
        fontSize: 13,
        color: '#666666',
        lineHeight: 18,
    },
    expandToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 12,
    },
    expandToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#B8860B',
        marginRight: 8,
    },
    fullTermsContainer: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#F5F5F0',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#B8860B'
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2D2D2D',
        marginBottom: 4
    },
    cardText: {
        fontSize: 12,
        color: '#777777',
        lineHeight: 18
    },
    footer: {
        marginTop: 10,
        alignItems: 'center'
    },
    agreeText: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20
    },
    acceptButton: {
        backgroundColor: '#B8860B',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 40,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#B8860B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4
    },
    acceptButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF'
    },
    copyrightText: {
        fontSize: 11,
        color: '#BBBBBB',
        marginTop: 24
    },
});

export default DisclaimerScreen;
