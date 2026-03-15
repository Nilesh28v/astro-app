import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { API_URL } from '../utils/apiConfig';

export default function SavedKundlisScreen({ navigation }) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [kundlis, setKundlis] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedKundlis = async () => {
        if (!user?.firebaseUid) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/kundlis/${user.firebaseUid}`);
            const data = await response.json();
            setKundlis(data);
        } catch (e) {
            console.error("Failed to fetch saved kundlis", e);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchSavedKundlis();
        }, [user?.firebaseUid])
    );

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/kundlis/${user.firebaseUid}/${id}`, {
                method: 'DELETE',
            });
            setKundlis(prev => prev.filter(k => k.id !== id));
        } catch (e) {
            console.error("Failed to delete kundli", e);
        }
    };

    const renderItem = ({ item }) => {
        const birthDate = new Date(item.birth_date);
        const loc = typeof item.birth_location === 'string' ? JSON.parse(item.birth_location) : item.birth_location;

        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => navigation.navigate('KundliDisplay', {
                    name: item.name,
                    date: birthDate.getTime(),
                    lat: loc.lat,
                    lon: loc.lon,
                    city: loc.name
                })}
            >
                <View style={styles.cardInfo}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.details}>
                        {birthDate.toLocaleDateString()} • {item.birth_time}
                    </Text>
                    <Text style={styles.location}>{loc.name}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => handleDelete(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('saved_kundlis')}</Text>
                <Text style={styles.subtitle}>{t('saved_kundlis_subtitle')}</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#B8860B" />
                </View>
            ) : (
                <FlatList
                    data={kundlis}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ionicons name="document-text-outline" size={60} color="#DDD" />
                            <Text style={styles.emptyText}>{t('no_saved_kundlis')}</Text>
                            <TouchableOpacity 
                                style={styles.createBtn}
                                onPress={() => navigation.navigate('KundliInput')}
                            >
                                <Text style={styles.createBtnText}>{t('create_kundli')}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFBF7' },
    header: { padding: 24, paddingBottom: 10 },
    title: { fontSize: 28, fontWeight: '300', color: '#1A1A1A' },
    subtitle: { fontSize: 14, color: '#999', marginTop: 4 },
    list: { padding: 20 },
    card: {
        backgroundColor: '#FFF', borderRadius: 14, padding: 16, marginBottom: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderWidth: 1, borderColor: '#EBE7E0',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    },
    cardInfo: { flex: 1 },
    name: { fontSize: 18, fontWeight: '600', color: '#333' },
    details: { fontSize: 13, color: '#888', marginTop: 4 },
    location: { fontSize: 13, color: '#B8860B', fontWeight: '500', marginTop: 2 },
    deleteBtn: { padding: 8 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#999', fontSize: 16, marginTop: 16, marginBottom: 24 },
    createBtn: { backgroundColor: '#B8860B', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25 },
    createBtnText: { color: '#FFF', fontWeight: '600' },
});
