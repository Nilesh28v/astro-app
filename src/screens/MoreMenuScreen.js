import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';


const MenuItem = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>{title}</Text>
            <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
);

export default function MoreMenuScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.header}>{t('explore')} {t('vedic_astro')}</Text>
                <Text style={styles.headerSub}>{t('deep_dive')}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>{t('featured')}</Text>
                    <MenuItem
                        icon="calendar" title={t('panchang')}
                        subtitle={t('panchang_desc')}
                        color="#B8860B" onPress={() => navigation.navigate('Panchang')}
                    />
                    <TouchableOpacity 
                        style={styles.languageToggle} 
                        onPress={toggleLanguage}
                        activeOpacity={0.7}
                    >
                        <View style={styles.languageIconBox}>
                            <Ionicons name="language-outline" size={20} color="#B8860B" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.languageLabel}>{t('language')}</Text>
                            <Text style={styles.languageValue}>{language === 'en' ? 'English' : 'हिंदी'}</Text>
                        </View>
                        <View style={styles.toggleSwitch}>
                            <View style={[styles.toggleCircle, language === 'hi' && styles.toggleCircleRight]} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>{t('reference')}</Text>
                    <MenuItem
                        icon="planet-outline" title={t('planets')}
                        subtitle={t('planets_desc')}
                        color="#2980B9" onPress={() => navigation.navigate('PlanetsList')}
                    />
                    <MenuItem
                        icon="grid-outline" title={t('houses')}
                        subtitle={t('houses_desc')}
                        color="#D35400" onPress={() => navigation.navigate('HousesList')}
                    />
                    <MenuItem
                        icon="sparkles-outline" title={t('zodiacs')}
                        subtitle={t('zodiacs_desc')}
                        color="#C0392B" onPress={() => navigation.navigate('ZodiacsList')}
                    />
                    <MenuItem
                        icon="moon-outline" title={t('nakshatras')}
                        subtitle={t('nakshatras_desc')}
                        color="#1ABC9C" onPress={() => navigation.navigate('NakshatrasList')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>{t('spiritual')}</Text>
                    <MenuItem
                        icon="calendar-outline" title={t('ekadashi_calendar')}
                        subtitle={t('ekadashi_desc')}
                        color="#F39C12" onPress={() => navigation.navigate('EkadashiMain')}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>{t('account')}</Text>
                    <View style={styles.userCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
                            <Text style={styles.userEmail}>{user?.email}</Text>
                        </View>
                        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                            <Ionicons name="log-out-outline" size={24} color="#B8860B" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.menuItem, { marginTop: 10 }]}
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                    >
                        <Ionicons name="shield-checkmark-outline" size={20} color="#B8860B" />
                        <Text style={[styles.menuTitle, { marginLeft: 12, fontSize: 14 }]}>{t('privacy_policy')}</Text>
                        <View style={{ flex: 1 }} />
                        <Ionicons name="chevron-forward" size={16} color="#CCC" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>🙏 {t('footer_disclaimer')}</Text>
                    <Text style={styles.versionText}>Jyotish Guru v1.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    scroll: { padding: 20, paddingBottom: 40 },
    header: { fontSize: 26, fontWeight: '300', color: '#1A1A1A', letterSpacing: 1, marginTop: 8 },
    headerSub: { fontSize: 14, color: '#999', marginTop: 4, marginBottom: 24 },
    section: { marginBottom: 24 },
    sectionLabel: { fontSize: 11, fontWeight: '700', color: '#B8860B', letterSpacing: 2, marginBottom: 12 },
    subscriptionCard: { borderColor: '#F3E5AB', backgroundColor: '#FFFEF9' },
    subscriptionCardPro: { borderColor: '#C8E6C9', backgroundColor: '#E8F5E9' },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 14, padding: 14, marginBottom: 10,
        borderWidth: 1, borderColor: '#EBE7E0',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    menuTextContainer: { flex: 1 },
    menuTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
    menuSubtitle: { fontSize: 12, color: '#999', marginTop: 2, lineHeight: 16 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FDFBF7', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1, borderColor: '#F3E5AB' },
    avatarText: { fontSize: 18, fontWeight: '700', color: '#B8860B' },
    userInfo: { flex: 1 },
    userName: { fontSize: 15, fontWeight: '600', color: '#333' },
    userEmail: { fontSize: 12, color: '#999', marginTop: 2 },
    logoutBtn: { padding: 8 },
    userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBF0', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F3E5AB' },
    languageToggle: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
        borderRadius: 14, padding: 14, marginTop: 10,
        borderWidth: 1, borderColor: '#EBE7E0',
    },
    languageIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#B8860B15', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    languageLabel: { fontSize: 13, fontWeight: '700', color: '#999', textTransform: 'uppercase' },
    languageValue: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 2 },
    toggleSwitch: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#EBE7E0', padding: 2 },
    toggleCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    toggleCircleRight: { marginLeft: 'auto', backgroundColor: '#B8860B' },
    footer: { alignItems: 'center', marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#EBE7E0' },
    footerText: { fontSize: 12, color: '#999' },
    versionText: { fontSize: 11, color: '#CCC', marginTop: 4 },
});
