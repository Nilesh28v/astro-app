import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { REMEDIES_DATA, REMEDIES_DATA_HI } from '../utils/remediesData';
import { getZodiacSymbol } from '../utils/horoscopeEngine';

const ZODIAC_KEYS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const ZodiacChip = ({ sign, symbol, selected, onPress }) => (
    <TouchableOpacity style={[styles.chip, selected && styles.chipSel]} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.chipEmoji}>{symbol}</Text>
        <Text style={[styles.chipText, selected && styles.chipTextSel]}>{sign}</Text>
    </TouchableOpacity>
);

const ExpandableSection = ({ title, icon, color, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <View style={[styles.section, { borderLeftColor: color }]}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setOpen(!open)} activeOpacity={0.7}>
                <Ionicons name={icon} size={20} color={color} />
                <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={color} />
            </TouchableOpacity>
            {open && <View style={styles.sectionContent}>{children}</View>}
        </View>
    );
};

export default function RemediesScreen() {
    const { t, language } = useLanguage();
    const [selected, setSelected] = useState(0);
    const flatRef = useRef(null);
    const key = ZODIAC_KEYS[selected];

    const currentRemediesData = language === 'hi' ? REMEDIES_DATA_HI : REMEDIES_DATA;
    const data = currentRemediesData[key];

    const handleSelect = (idx) => {
        setSelected(idx);
        flatRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.3 });
    };

    if (!data) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Ionicons name="leaf" size={28} color="#27AE60" />
                    <Text style={styles.title}>{t('vedic_remedies')}</Text>
                    <Text style={styles.subtitle}>{t('remedies_subtitle')}</Text>
                </View>

                <FlatList
                    ref={flatRef}
                    horizontal showsHorizontalScrollIndicator={false}
                    data={ZODIAC_KEYS.map((k, i) => ({ key: k, data: currentRemediesData[k], idx: i }))}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => (
                        <ZodiacChip 
                            sign={item.data.sign} 
                            symbol={getZodiacSymbol(item.key, language)} 
                            selected={item.idx === selected} 
                            onPress={() => handleSelect(item.idx)} 
                        />
                    )}
                    contentContainerStyle={styles.chipList}
                    style={{ marginBottom: 16, maxHeight: 80 }}
                    getItemLayout={(_, index) => ({ length: 90, offset: 90 * index, index })}
                />

                <View style={styles.signCard}>
                    <Text style={styles.signEmoji}>{getZodiacSymbol(key, language)}</Text>
                    <Text style={styles.signName}>{data.sign}</Text>
                    <Text style={styles.signMeta}>{data.element} • {language === 'hi' ? 'स्वामी' : 'Ruler'}: {data.ruler}</Text>
                </View>

                {/* Gemstone */}
                <ExpandableSection title={t('gemstone_remedy')} icon="diamond-outline" color="#8E44AD">
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('gem_primary')}</Text><Text style={styles.val}>{data.gemstone.primary}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('gem_alternative')}</Text><Text style={styles.val}>{data.gemstone.alternative}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('gem_finger')}</Text><Text style={styles.val}>{data.gemstone.finger}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('gem_metal')}</Text><Text style={styles.val}>{data.gemstone.metal}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('gem_day')}</Text><Text style={styles.val}>{data.gemstone.day}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('gem_weight')}</Text><Text style={styles.val}>{data.gemstone.weight}</Text></View>
                    <Text style={styles.howTo}>{data.gemstone.howToWear}</Text>
                </ExpandableSection>

                {/* Mantras */}
                <ExpandableSection title={t('sacred_mantras')} icon="musical-notes-outline" color="#D35400">
                    {data.mantras.map((m, i) => (
                        <View key={i} style={styles.mantraCard}>
                            <Text style={styles.mantraName}>{m.name}</Text>
                            <Text style={styles.mantraText}>{m.text}</Text>
                            <Text style={styles.mantraInfo}>{language === 'hi' ? 'जप' : 'Chant'} {m.count} {language === 'hi' ? 'बार' : 'times'} • {m.benefit}</Text>
                        </View>
                    ))}
                </ExpandableSection>

                {/* Donations */}
                <ExpandableSection title={t('donations_daan')} icon="gift-outline" color="#2980B9">
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('don_items')}</Text><Text style={styles.val}>{data.donations.items}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('don_day')}</Text><Text style={styles.val}>{data.donations.day}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('don_to')}</Text><Text style={styles.val}>{data.donations.to}</Text></View>
                </ExpandableSection>

                {/* Fasting */}
                <ExpandableSection title={t('fasting_vrat')} icon="restaurant-outline" color="#C0392B">
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('don_day')}</Text><Text style={styles.val}>{data.fasting.day}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('fast_rules')}</Text><Text style={styles.val}>{data.fasting.rules}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.lbl}>{t('fast_food')}</Text><Text style={styles.val}>{data.fasting.food}</Text></View>
                </ExpandableSection>

                {/* Lucky Colors */}
                <ExpandableSection title={t('lucky_colors')} icon="color-palette-outline" color="#1ABC9C">
                    <View style={styles.colorRow}>
                        <Text style={styles.colorLabel}>{t('wear')}:</Text>
                        {data.colors.lucky.map((c, i) => (
                            <View key={i} style={styles.colorBadge}><Text style={styles.colorBadgeText}>{c}</Text></View>
                        ))}
                    </View>
                    <View style={styles.colorRow}>
                        <Text style={styles.colorLabel}>{t('avoid')}:</Text>
                        {data.colors.avoid.map((c, i) => (
                            <View key={i} style={styles.avoidBadge}><Text style={styles.avoidBadgeText}>{c}</Text></View>
                        ))}
                    </View>
                </ExpandableSection>

                {/* Lifestyle */}
                <ExpandableSection title={t('lifestyle_tips')} icon="heart-outline" color="#27AE60">
                    {data.lifestyle.map((tip, i) => (
                        <View key={i} style={styles.tipRow}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                </ExpandableSection>

                {/* Common Remedies */}
                <ExpandableSection title={t('problem_remedies')} icon="medkit-outline" color="#E67E22">
                    <View style={styles.remedyBlock}>
                        <Text style={styles.remedyTitle}>💼 {t('remedy_career')}</Text>
                        <Text style={styles.remedyText}>{data.commonRemedies.career}</Text>
                    </View>
                    <View style={styles.remedyBlock}>
                        <Text style={styles.remedyTitle}>💚 {t('remedy_health')}</Text>
                        <Text style={styles.remedyText}>{data.commonRemedies.health}</Text>
                    </View>
                    <View style={styles.remedyBlock}>
                        <Text style={styles.remedyTitle}>💕 {t('remedy_marriage')}</Text>
                        <Text style={styles.remedyText}>{data.commonRemedies.marriage}</Text>
                    </View>
                    <View style={styles.remedyBlock}>
                        <Text style={styles.remedyTitle}>💰 {t('remedy_finance')}</Text>
                        <Text style={styles.remedyText}>{data.commonRemedies.finance}</Text>
                    </View>
                </ExpandableSection>

                <View style={styles.disclaimer}>
                    <Ionicons name="information-circle-outline" size={14} color="#999" />
                    <Text style={styles.disclaimerText}>{t('remedies_disclaimer')}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    scroll: { padding: 20, paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 26, fontWeight: '300', color: '#27AE60', letterSpacing: 1.5, marginTop: 8 },
    subtitle: { fontSize: 13, color: '#888', marginTop: 2 },
    chipList: { gap: 8, paddingHorizontal: 4 },
    chip: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#F5F0E8', borderWidth: 1, borderColor: '#EBE7E0', minWidth: 78 },
    chipSel: { backgroundColor: '#27AE60', borderColor: '#27AE60' },
    chipEmoji: { fontSize: 22 },
    chipText: { fontSize: 11, color: '#666', fontWeight: '600', marginTop: 2 },
    chipTextSel: { color: '#FFF' },
    signCard: { alignItems: 'center', marginBottom: 20 },
    signEmoji: { fontSize: 48 },
    signName: { fontSize: 22, fontWeight: '600', color: '#333', marginTop: 4 },
    signMeta: { fontSize: 13, color: '#888', marginTop: 2 },
    section: { backgroundColor: '#FFF', borderRadius: 14, marginBottom: 12, borderLeftWidth: 4, borderWidth: 1, borderColor: '#EBE7E0', overflow: 'hidden' },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
    sectionTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5, flex: 1 },
    sectionContent: { paddingHorizontal: 14, paddingBottom: 14 },
    infoRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F5F0E8' },
    lbl: { fontSize: 13, color: '#888', fontWeight: '500', width: 90 },
    val: { fontSize: 13, color: '#333', fontWeight: '500', flex: 1 },
    howTo: { fontSize: 12, color: '#666', lineHeight: 18, marginTop: 8, fontStyle: 'italic', backgroundColor: '#FFF8E7', padding: 10, borderRadius: 8 },
    mantraCard: { backgroundColor: '#FFF8E7', borderRadius: 10, padding: 12, marginBottom: 8 },
    mantraName: { fontSize: 13, fontWeight: '700', color: '#8B6914', marginBottom: 4 },
    mantraText: { fontSize: 15, color: '#333', fontStyle: 'italic', lineHeight: 22, marginBottom: 4 },
    mantraInfo: { fontSize: 11, color: '#888' },
    colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginBottom: 8 },
    colorLabel: { fontSize: 13, color: '#888', fontWeight: '600', marginRight: 4 },
    colorBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    colorBadgeText: { fontSize: 12, color: '#2E7D32', fontWeight: '500' },
    avoidBadge: { backgroundColor: '#FFEBEE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    avoidBadgeText: { fontSize: 12, color: '#C0392B', fontWeight: '500' },
    tipRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
    tipBullet: { fontSize: 14, color: '#27AE60', fontWeight: '700' },
    tipText: { fontSize: 13, color: '#444', lineHeight: 20, flex: 1 },
    remedyBlock: { marginBottom: 12 },
    remedyTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 4 },
    remedyText: { fontSize: 13, color: '#555', lineHeight: 20 },
    disclaimer: { flexDirection: 'row', gap: 6, marginTop: 16, alignItems: 'flex-start' },
    disclaimerText: { fontSize: 11, color: '#999', flex: 1, lineHeight: 16 },
});
