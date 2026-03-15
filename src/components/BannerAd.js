import { StyleSheet, Text, View } from 'react-native';

// AdMob requires a Development Build (npx expo run:android / run:ios).
// This placeholder component is used in Expo Go and Web.
// When you're ready for production, replace this with the real AdMob BannerAd.
const BannerAdComponent = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.placeholderText}>Ad Space</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F0E8',
        borderTopWidth: 1,
        borderTopColor: '#EBE7E0',
    },
    placeholderText: {
        color: '#BBBBBB',
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});

export default BannerAdComponent;
