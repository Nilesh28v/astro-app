/**
 * Subscription context - works with or without native IAP.
 * Gracefully degrades in Expo Go (mock mode, free tier).
 * Wire RevenueCat when using dev client.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { apiGet } from '@/lib/api/client';
import { tryAsync } from '@/lib/errors';
import { isProFeature, type ProFeature, type SubscriptionTier } from '@/lib/subscription/types';

type SubscriptionContextValue = {
  tier: SubscriptionTier;
  isLoading: boolean;
  error: string | null;
  hasPro: boolean;
  hasAccess: (feature: ProFeature) => boolean;
  refresh: () => Promise<void>;
  openPaywall: (feature?: ProFeature) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

/** In Expo Go or when IAP unavailable, treat as free tier (graceful degradation) */
const IAP_AVAILABLE = !__DEV__ && (Platform.OS === 'ios' || Platform.OS === 'android');

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paywallFeature, setPaywallFeature] = useState<ProFeature | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: apiError } = await tryAsync(async () => {
      const res = await apiGet<{ tier: SubscriptionTier }>('/api/subscription/status');
      if (res.ok) return res.data.tier;
      return 'free' as SubscriptionTier;
    });
    if (apiError) {
      setError(apiError.message);
      setTier('free');
    } else if (data) {
      setTier(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasAccess = useCallback(
    (feature: ProFeature): boolean => {
      if (!isProFeature(feature)) return true;
      return tier === 'pro';
    },
    [tier]
  );

  const hasPro = tier === 'pro';

  const openPaywall = useCallback((feature?: ProFeature) => {
    setPaywallFeature(feature ?? 'pro_tips');
  }, []);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      tier,
      isLoading,
      error,
      hasPro,
      hasAccess,
      refresh,
      openPaywall,
    }),
    [tier, isLoading, error, hasPro, hasAccess, refresh, openPaywall]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
      {paywallFeature && (
        <PaywallModal
          feature={paywallFeature}
          onClose={() => setPaywallFeature(null)}
          onSuccess={() => {
            setTier('pro');
            setPaywallFeature(null);
          }}
        />
      )}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    return {
      tier: 'free',
      isLoading: false,
      error: null,
      hasPro: false,
      hasAccess: () => true,
      refresh: async () => {},
      openPaywall: () => {},
    };
  }
  return ctx;
}

/**
 * Paywall modal - shown when user taps locked Pro content.
 * In mock mode: shows "Pro preview" and allows continue (dev UX).
 * In production: would integrate RevenueCat paywall UI.
 */
function PaywallModal({
  feature,
  onClose,
  onSuccess,
}: {
  feature: ProFeature;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const handleUnlock = () => {
    if (IAP_AVAILABLE) {
      // TODO: Open RevenueCat purchase flow
      onSuccess();
    } else {
      // Dev / Expo Go: allow access for testing
      onSuccess();
    }
  };

  return (
    <ModalOverlay onClose={onClose}>
      <PaywallContent
        feature={feature}
        onClose={onClose}
        onUnlock={handleUnlock}
        isDev={!IAP_AVAILABLE}
      />
    </ModalOverlay>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <Modal visible transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <ThemedView style={styles.card}>{children}</ThemedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function PaywallContent({
  feature,
  onClose,
  onUnlock,
  isDev,
}: {
  feature: ProFeature;
  onClose: () => void;
  onUnlock: () => void;
  isDev: boolean;
}) {
  const title = 'Jyotish Pro';
  return (
    <>
      <ThemedText type="title" style={{ marginBottom: 8 }}>
        {title}
      </ThemedText>
      <ThemedText style={{ marginBottom: 12, fontSize: 13, opacity: 0.9 }}>
        Pro Tips, advanced features & ad-free experience.
      </ThemedText>
      <ThemedText style={{ marginBottom: 4, fontSize: 12, opacity: 0.7 }}>
        • Pro Tips & advanced content
      </ThemedText>
      <ThemedText style={{ marginBottom: 4, fontSize: 12, opacity: 0.7 }}>
        • Pro features in modals & tools
      </ThemedText>
      <ThemedText style={{ marginBottom: 16, fontSize: 12, opacity: 0.7 }}>
        • Ad-free experience (when enabled)
      </ThemedText>
      {!isDev && (
        <ThemedText style={{ marginBottom: 12, fontSize: 14 }}>
          Subscribe in-app to unlock. Price shown on next screen.
        </ThemedText>
      )}
      {isDev && (
        <ThemedText style={{ marginBottom: 12, opacity: 0.6, fontSize: 11 }}>
          Dev mode: real purchase not set up. Tap below to unlock for testing.
        </ThemedText>
      )}
      <TouchableOpacity
        onPress={onUnlock}
        activeOpacity={0.8}
        style={{ paddingVertical: 14, paddingHorizontal: 24, marginBottom: 8, alignItems: 'center' }}>
        <ThemedText type="defaultSemiBold">
          {isDev ? 'Unlock Pro (test)' : 'Subscribe — choose plan'}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={onClose} activeOpacity={0.8} style={{ paddingVertical: 8 }}>
        <ThemedText type="link">Maybe later</ThemedText>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
  },
});
