import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacyPolicyScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#B8860B" />
                </TouchableOpacity>
                <Text style={styles.title}>Privacy Policy</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.text}>
                    Welcome to Jyotish Guru. We respect your privacy and are committed to protecting your personal data. This privacy policy informs you how we look after your personal data when you use our application.
                </Text>

                <Text style={styles.sectionTitle}>2. Data We Collect</Text>
                <Text style={styles.text}>
                    - Profile Data: Email and name (if you choose to sign up via Google or Email).
                    - Astrological Data: Birth date, time, and location (stored either locally on your device or in our secure PostgreSQL database if you are logged in).
                </Text>

                <Text style={styles.sectionTitle}>3. How We Use Data</Text>
                <Text style={styles.text}>
                    Your data is used solely to provide personalized astrological calculations, horoscopes, and remedies. We do not sell or share your personal data with third parties for marketing purposes.
                </Text>

                <Text style={styles.sectionTitle}>4. Data Security</Text>
                <Text style={styles.text}>
                    We use industry-standard security measures (Firebase Auth and Supabase Encryption) to protect your data. Guest data remains exclusively on your local device.
                </Text>

                <Text style={styles.sectionTitle}>5. Your Rights</Text>
                <Text style={styles.text}>
                    You have the right to access, correct, or delete your personal data at any time through the application settings or by contacting us.
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Last Updated: March 2026</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFBF0',
        borderBottomWidth: 1,
        borderBottomColor: '#F3E5AB',
    },
    backButton: { marginRight: 16 },
    title: { fontSize: 20, fontWeight: '600', color: '#B8860B' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#B8860B', marginTop: 20, marginBottom: 8 },
    text: { fontSize: 14, color: '#555', lineHeight: 22 },
    footer: { marginTop: 40, alignItems: 'center', paddingBottom: 20 },
    footerText: { fontSize: 12, color: '#999' },
});
