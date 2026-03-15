import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSubscription } from '@/lib/subscription/context';

export default function ModalScreen() {
  const { hasAccess, openPaywall } = useSubscription();
  const hasProModal = hasAccess('pro_modal');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Go to home screen</ThemedText>
      </Link>
      {hasProModal ? (
        <ThemedView style={styles.proSection}>
          <ThemedText type="subtitle" style={styles.proTitle}>
            Pro Features
          </ThemedText>
          <ThemedText style={styles.proText}>Quick actions and advanced settings here.</ThemedText>
        </ThemedView>
      ) : (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => openPaywall('pro_modal')}
          activeOpacity={0.8}>
          <ThemedText type="defaultSemiBold">Unlock Pro Features</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  proSection: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  proTitle: {
    marginBottom: 8,
  },
  proText: {
    opacity: 0.8,
  },
  upgradeButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
});
