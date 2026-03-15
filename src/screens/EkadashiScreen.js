import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Platform
} from 'react-native';
import { EKADASHI_DATA } from '../utils/ekadashiData';
import { getNotificationsEnabled, setNotificationsEnabled } from '../utils/notificationService';
import { API_URL } from '../utils/apiConfig';
import { useLanguage } from '../context/LanguageContext';
import { ASTROLOGY_TRANSLATIONS } from '../utils/astrologyTranslations';

const EkadashiItem = ({ item, isNext, t, language, initialExpanded }) => {
    const [expanded, setExpanded] = useState(initialExpanded || false);

    useEffect(() => {
        if (initialExpanded) setExpanded(true);
    }, [initialExpanded]);
    const date = new Date(item.date);
    const locale = language === 'hi' ? 'hi-IN' : 'en-US';
    const formattedDate = date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    const dayName = date.toLocaleDateString(locale, { weekday: 'long' });

    // Get Hindi translations for this ekadashi if available
    const hiData = language === 'hi' ? ASTROLOGY_TRANSLATIONS.hi.ekadashi?.[item.name] : null;
    const displayName = hiData?.name || item.name;
    const displaySignificance = hiData?.significance || item.significance;
    const displayRemedies = hiData?.remedies || item.remedies;
    const displayRules = hiData?.dosAndDonts || item.dosAndDonts;

    return (
        <TouchableOpacity
            style={[styles.ekadashiCard, isNext && styles.nextEkadashiCard]}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                    <Text style={[styles.dateText, isNext && styles.nextDateText]}>{formattedDate}</Text>
                    <Text style={styles.dayText}>{dayName}</Text>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={[styles.ekadashiName, isNext && styles.nextEkadashiName]}>{displayName}</Text>
                    {isNext && <View style={styles.activeLabel}><Text style={styles.activeLabelText}>{t('next_label')}</Text></View>}
                </View>
                <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={isNext ? '#B8860B' : '#666'}
                />
            </View>

            {expanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.divider} />

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('ekadashi_significance')}</Text>
                        <Text style={styles.sectionText}>{displaySignificance}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('ekadashi_remedies')}</Text>
                        <Text style={styles.sectionText}>{displayRemedies}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('ekadashi_rules')}</Text>
                        <Text style={styles.sectionText}>{displayRules}</Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};


export default function EkadashiScreen({ route }) {
    const { t, language } = useLanguage();
    const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
    const [upcomingPrecise, setUpcomingPrecise] = useState(null);
    const [loading, setLoading] = useState(false);
    const now = new Date();



    const fetchUpcomingEkadashi = async () => {
        setLoading(true);
        try {
            const today = now.toISOString().split('T')[0];
            const response = await fetch(`${API_URL}/astrology/ekadashi/upcoming?date=${today}`);
            const data = await response.json();
            if (data.success) {
                setUpcomingPrecise(data.data);
            }
        } catch (e) {
            console.error("Failed to fetch ekadashi timings", e);
        }
        setLoading(false);
    };

    useEffect(() => {
        const loadSettings = async () => {
            const enabled = await getNotificationsEnabled();
            setNotificationsEnabledState(enabled);
        };
        loadSettings();
        fetchUpcomingEkadashi();
    }, []);

    const handleToggleNotifications = async (value) => {
        setNotificationsEnabledState(value);
        await setNotificationsEnabled(value);
    };

    const nextEkadashiId = useMemo(() => {
        const future = EKADASHI_DATA.find(e => new Date(e.date) >= now);
        return future ? future.id : null;
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{t('ekadashi_title')}</Text>
                    <Text style={styles.subtitle}>{t('ekadashi_subtitle')}</Text>
                </View>
                <View style={styles.toggleContainer}>
                    <Ionicons name={notificationsEnabled ? 'notifications' : 'notifications-off'} size={24} color="#B8860B" />
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={handleToggleNotifications}
                        trackColor={{ false: '#767577', true: '#F3E5AB' }}
                        thumbColor={notificationsEnabled ? '#B8860B' : '#f4f3f4'}
                    />
                </View>
            </View>

            {upcomingPrecise && (
                <View style={styles.preciseAlert}>
                    <Ionicons name="time" size={20} color="#B8860B" />
                    <View style={{flex: 1, marginLeft: 10}}>
                        <Text style={styles.preciseTitle}>{t('next_tithi_timing')} ({upcomingPrecise.type})</Text>
                        <Text style={styles.preciseTime}>{t('starts')}: {new Date(upcomingPrecise.start_date).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</Text>
                        <Text style={styles.preciseTime}>{t('ends')}: {new Date(upcomingPrecise.end_date).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}</Text>
                        <Text style={styles.preciseNote}>{t('swiss_eph_note')}</Text>
                    </View>
                </View>
            )}

            <FlatList
                data={EKADASHI_DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EkadashiItem 
                        item={item} 
                        isNext={item.id === nextEkadashiId} 
                        t={t} 
                        language={language} 
                        initialExpanded={item.id === route.params?.expandId}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={loading ? <ActivityIndicator color="#B8860B" style={{margin: 20}} /> : null}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFFBF0',
        borderBottomWidth: 1,
        borderBottomColor: '#F3E5AB',
    },
    title: {
        fontSize: 24,
        fontWeight: '300',
        color: '#B8860B',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 12,
        color: '#999',
        letterSpacing: 0.5,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    listContent: {
        padding: 16,
    },
    ekadashiCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EBE7E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    nextEkadashiCard: {
        borderColor: '#B8860B',
        backgroundColor: '#FFFBF0',
        borderWidth: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateContainer: {
        width: 100,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    nextDateText: {
        color: '#B8860B',
    },
    dayText: {
        fontSize: 10,
        color: '#999',
        textTransform: 'uppercase',
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    ekadashiName: {
        fontSize: 16,
        fontWeight: '300',
        color: '#333',
    },
    nextEkadashiName: {
        fontWeight: '600',
        color: '#B8860B',
    },
    activeLabel: {
        backgroundColor: '#B8860B',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    activeLabelText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: 'bold',
    },
    expandedContent: {
        marginTop: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3E5AB',
        marginBottom: 12,
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#B8860B',
        letterSpacing: 1,
        marginBottom: 4,
    },
    sectionText: {
        fontSize: 13,
        color: '#444',
        lineHeight: 18,
    },
    preciseAlert: {
        backgroundColor: '#FDF7E2',
        margin: 16,
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3E5AB',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    preciseTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8B6914',
        marginBottom: 5,
    },
    preciseTime: {
        fontSize: 13,
        color: '#1A1A1A',
        fontWeight: '500',
    },
    preciseNote: {
        fontSize: 11,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 6,
    }
});
