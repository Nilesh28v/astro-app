import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Props = React.PropsWithChildren<{
  fallback?: React.ReactNode;
  onReset?: () => void;
}>;

type State = {
  error: Error | null;
};

/**
 * Error boundary to catch render errors and prevent full app crashes.
 * Renders a user-friendly fallback and allows retry.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Something went wrong
          </ThemedText>
          <ThemedText style={styles.message}>
            {__DEV__ ? this.state.error.message : 'Please try again.'}
          </ThemedText>
          <TouchableOpacity style={styles.button} onPress={this.handleReset} activeOpacity={0.8}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Try again
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 12,
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    opacity: 0.8,
  },
});
