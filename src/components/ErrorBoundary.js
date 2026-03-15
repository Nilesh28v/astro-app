import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Global Error Boundary to prevent the entire app from crashing.
 * If a screen fails to render, this captures the error and shows a graceful recovery UI.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to a local log file here
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleRestart = () => {
        // Simple state reset (or logic to reload app)
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            // Graceful fallback UI
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.icon}>🌌</Text>
                        <Text style={styles.title}>Oops! Something went wrong.</Text>
                        <Text style={styles.subtitle}>
                            We encountered a small glitch. Please try restarting the feature.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
                            <Text style={styles.buttonText}>Back to Home</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFBF7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 30,
        alignItems: 'center',
    },
    icon: {
        fontSize: 60,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#B8860B',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#B8860B',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorBoundary;
