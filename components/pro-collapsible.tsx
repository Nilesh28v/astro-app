/**
 * Collapsible section locked behind Pro subscription.
 * Shows paywall when free user taps to open.
 */

import type { PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSubscription } from '@/lib/subscription/context';
import type { ProFeature } from '@/lib/subscription/types';

import { Collapsible } from './ui/collapsible';

type Props = PropsWithChildren<{
  title: string;
  feature: ProFeature;
}>;

export function ProCollapsible({ title, feature, children }: Props) {
  const { hasAccess, openPaywall } = useSubscription();
  const theme = useColorScheme() ?? 'light';

  if (hasAccess(feature)) {
    return <Collapsible title={title}>{children}</Collapsible>;
  }

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => openPaywall(feature)}
        activeOpacity={0.8}>
        <IconSymbol
          name="lock.fill"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.tint : Colors.dark.tint}
        />
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText type="subtitle" style={styles.proBadge}>
          Pro
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proBadge: {
    fontSize: 10,
    opacity: 0.8,
  },
});
