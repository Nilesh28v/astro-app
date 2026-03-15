import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { EKADASHI_DATA } from '../utils/ekadashiData';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';
import { getNotificationsEnabled, scheduleEkadashiNotifications } from '../utils/notificationService';
import { calculatePanchang, getDailyTip } from '../utils/panchangEngine';

const QuickAccessCard = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity style={[styles.quickCard, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.7}>
        <Ionicons name={icon} size={28} color={color} />
        <Text style={styles.quickTitle}>{title}</Text>
        <Text style={styles.quickSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
);

const PanchangRow = ({ label, value, icon }) => (
    <View style={styles.panchangRow}>
        <Text style={styles.panchangIcon}>{icon}</Text>
        <Text style={styles.panchangLabel}>{label}</Text>
        <Text style={styles.panchangValue}>{value}</Text>
    </View>
);

export default function HomeScreen({ navigation }) {
    const { t, language, toggleLanguage } = useLanguage();
    const { user } = useAuth();
    const today = new Date();
    const panchang = useMemo(() => calculatePanchang(today, language), [language]);
    const dailyTip = useMemo(() => getDailyTip(today), []);

    useEffect(() => {
        const refreshNotifications = async () => {
            const enabled = await getNotificationsEnabled();
            if (enabled) {
                await scheduleEkadashiNotifications();
            }
        };
        refreshNotifications();
    }, []);

    const nextEkadashi = useMemo(() => {
        return EKADASHI_DATA.find(e => new Date(e.date) >= today);
    }, []);

    const daysUntilEkadashi = useMemo(() => {
        if (!nextEkadashi) return null;
        const diff = new Date(nextEkadashi.date) - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }, [nextEkadashi]);

    const dateStr = today.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Header */}
                <View style={styles.hero}>
                    <View style={styles.heroTopRow}>
                        <View style={styles.heroTextContainer}>
                            <Text style={styles.heroTitle}>
                                {t('namaste') || 'Namaste'}, {user?.name || user?.displayName?.split(' ')[0] || t('guest')}
                            </Text>
                            <Text style={styles.heroSubtitle}>{t('astro_companion')}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.homeLanguageToggle} 
                            onPress={toggleLanguage}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.homeLanguageText}>
                                {language === 'en' ? 'हि' : 'EN'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.dateText}>{dateStr}</Text>
                </View>

                {/* Panchang Card */}
                <View style={styles.panchangCard}>
                    <View style={styles.panchangHeader}>
                        <Ionicons name="moon-outline" size={20} color="#B8860B" />
                        <Text style={styles.sectionTitle}>{t('today_panchang')}</Text>
                        {panchang.isAuspicious ? (
                            <View style={styles.auspiciousBadge}>
                                <Text style={styles.auspiciousText}>✨ {t('auspicious')}</Text>
                            </View>
                        ) : (
                            <View style={styles.cautionBadge}>
                                <Text style={styles.cautionText}>⚠️ {t('caution')}</Text>
                            </View>
                        )}
                    </View>
                    <PanchangRow icon="📅" label={t('tithi')} value={panchang.tithi} />
                    <PanchangRow icon="⭐" label={t('nakshatra')} value={panchang.nakshatra} />
                    <PanchangRow icon="🔮" label={t('yoga')} value={panchang.yoga} />
                    <PanchangRow icon="🌗" label={t('karana')} value={panchang.karana} />
                    <View style={styles.panchangDivider} />
                    <PanchangRow icon="⛔" label={t('rahu_kaal')} value={panchang.rahuKaal} />
                    <PanchangRow icon="⚠️" label={t('gulika_kaal')} value={panchang.gulikaKaal} />
                </View>

                {/* Daily Tip */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipIcon}>{dailyTip.icon}</Text>
                    <Text style={styles.tipTitle}>{t('daily_tip')}</Text>
                    <Text style={styles.tipText}>{dailyTip.tip}</Text>
                </View>

                {/* Ekadashi Countdown */}
                {nextEkadashi && (() => {
                    const hiData = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.ekadashi?.[nextEkadashi.name] : null;
                    const displayName = hiData?.name || nextEkadashi.name;
                    const displaySig = hiData?.significance || nextEkadashi.significance;
                    
                    return (
                        <TouchableOpacity
                            style={styles.ekadashiCard}
                            onPress={() => navigation.navigate('MoreTab', { 
                                screen: 'EkadashiMain',
                                params: { expandId: nextEkadashi.id }
                            })}
                            activeOpacity={0.7}
                        >
                            <View style={styles.ekadashiHeader}>
                                <Ionicons name="calendar-outline" size={20} color="#B8860B" />
                                <Text style={styles.sectionTitle}>{t('upcoming_ekadashi')}</Text>
                            </View>
                            <View style={styles.ekadashiContent}>
                                <View style={styles.countdownCircle}>
                                    <Text style={styles.countdownNumber}>{daysUntilEkadashi}</Text>
                                    <Text style={styles.countdownLabel}>{t('days')}</Text>
                                </View>
                                <View style={styles.ekadashiDetails}>
                                    <Text style={styles.ekadashiName}>{displayName}</Text>
                                    <Text style={styles.ekadashiDate}>
                                        {new Date(nextEkadashi.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Text>
                                    <Text style={styles.ekadashiSig} numberOfLines={2}>{displaySig}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })()}

                {/* Quick Access Grid */}
                <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>{t('explore')}</Text>
                <View style={styles.quickGrid}>
                    <QuickAccessCard
                        icon="sunny-outline" title={t('daily_horoscope')}
                        subtitle={t('horoscope_desc')} color="#E67E22"
                        onPress={() => navigation.navigate('HoroscopeTab')}
                    />
                    <QuickAccessCard
                        icon="document-text-outline" title={t('my_kundlis')}
                        subtitle={t('my_kundlis_desc')} color="#8E44AD"
                        onPress={() => navigation.navigate('KundliTab', { screen: 'SavedKundlis', initial: false })}
                    />
                    <QuickAccessCard
                        icon="leaf-outline" title={t('remedies')}
                        subtitle={t('remedies_desc')} color="#27AE60"
                        onPress={() => navigation.navigate('RemediesTab')}
                    />
                    <QuickAccessCard
                        icon="planet-outline" title={t('planets')}
                        subtitle={t('navagraha_desc')} color="#2980B9"
                        onPress={() => navigation.navigate('MoreTab', { screen: 'PlanetsList', initial: false })}
                    />
                    <QuickAccessCard
                        icon="home-outline" title={t('houses')}
                        subtitle={t('bhava_desc')} color="#D35400"
                        onPress={() => navigation.navigate('MoreTab', { screen: 'HousesList', initial: false })}
                    />
                    <QuickAccessCard
                        icon="sparkles-outline" title={t('zodiacs')}
                        subtitle={t('rashi_desc')} color="#C0392B"
                        onPress={() => navigation.navigate('MoreTab', { screen: 'ZodiacsList', initial: false })}
                    />
                    <QuickAccessCard
                        icon="moon-outline" title={t('nakshatras')}
                        subtitle={t('nakshatras_desc')} color="#1ABC9C"
                        onPress={() => navigation.navigate('MoreTab', { screen: 'NakshatrasList', initial: false })}
                    />
                    <QuickAccessCard
                        icon="calendar-outline" title={t('ekadashi_calendar')}
                        subtitle={t('fasting_desc')} color="#F39C12"
                        onPress={() => navigation.navigate('MoreTab', { screen: 'EkadashiMain', initial: false })}
                    />
                    <QuickAccessCard
                        icon="time-outline" title={t('panchang')}
                        subtitle={t('tithi_nakshatra')} color="#F39C12"
                        onPress={() => navigation.navigate('MoreTab', { screen: 'Panchang', initial: false })}
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{t('footer_prayer')}</Text>
                    <Text style={styles.disclaimerFooter}>{t('footer_edu')}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    scrollContent: { padding: 20, paddingBottom: 40 },
    hero: { marginBottom: 24, marginTop: 8 },
    heroTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    heroTextContainer: { flex: 1 },
    heroEmoji: { fontSize: 40 },
    heroTitle: { fontSize: 28, fontWeight: '700', color: '#B8860B', letterSpacing: 1.5 },
    heroSubtitle: { fontSize: 11, color: '#999', letterSpacing: 1, marginTop: 2, textTransform: 'uppercase' },
    homeLanguageToggle: { 
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#B8860B15', 
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#B8860B30' 
    },
    homeLanguageText: { fontSize: 14, fontWeight: '700', color: '#B8860B' },
    dateText: { fontSize: 14, color: '#666', marginTop: 12, fontWeight: '500' },
    panchangCard: {
        backgroundColor: '#FFFBF0', borderRadius: 16, padding: 16, marginBottom: 16,
        borderWidth: 1, borderColor: '#F3E5AB',
        shadowColor: '#B8860B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
    },
    panchangHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#B8860B', letterSpacing: 1.5, flex: 1 },
    auspiciousBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    auspiciousText: { fontSize: 11, color: '#2E7D32', fontWeight: '700' },
    cautionBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
    cautionText: { fontSize: 11, color: '#E65100', fontWeight: '700' },
    panchangRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    panchangIcon: { fontSize: 16, width: 28 },
    panchangLabel: { fontSize: 13, color: '#888', fontWeight: '500', width: 90 },
    panchangValue: { fontSize: 13, color: '#333', fontWeight: '600', flex: 1 },
    panchangDivider: { height: 1, backgroundColor: '#F3E5AB', marginVertical: 8 },
    tipCard: {
        backgroundColor: '#FFF8E7', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center',
        borderWidth: 1, borderColor: '#F0E6C8',
    },
    tipIcon: { fontSize: 32 },
    tipTitle: { fontSize: 13, fontWeight: '700', color: '#B8860B', letterSpacing: 1.5, marginTop: 8, marginBottom: 8 },
    tipText: { fontSize: 14, color: '#555', lineHeight: 22, textAlign: 'center' },
    ekadashiCard: {
        backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 8,
        borderWidth: 1, borderColor: '#F3E5AB',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
    },
    ekadashiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    ekadashiContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    countdownCircle: {
        width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFF8E7',
        borderWidth: 2, borderColor: '#B8860B', justifyContent: 'center', alignItems: 'center',
    },
    countdownNumber: { fontSize: 24, fontWeight: '800', color: '#B8860B' },
    countdownLabel: { fontSize: 10, color: '#999', fontWeight: '600' },
    ekadashiDetails: { flex: 1 },
    ekadashiName: { fontSize: 16, fontWeight: '700', color: '#333' },
    ekadashiDate: { fontSize: 12, color: '#888', marginTop: 2 },
    ekadashiSig: { fontSize: 12, color: '#666', marginTop: 4, lineHeight: 18 },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    quickCard: {
        backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, width: '47%',
        borderLeftWidth: 3, borderWidth: 1, borderColor: '#EBE7E0',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    quickTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 8 },
    quickSubtitle: { fontSize: 11, color: '#999', marginTop: 2 },
    footer: { alignItems: 'center', marginTop: 30, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#EBE7E0' },
    footerText: { fontSize: 13, color: '#B8860B', fontWeight: '500' },
    disclaimerFooter: { fontSize: 10, color: '#BBB', marginTop: 6 },
});
