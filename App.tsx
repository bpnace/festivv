import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Navigation from './src/navigation';
import { AuthProvider } from './src/hooks/useAuth';
import { COLORS } from './src/constants';

// Simple error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Es ist ein Fehler aufgetreten</Text>
          <Text style={styles.errorMessage}>{this.state.error?.message || 'Unbekannter Fehler'}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoadingFailed, setFontLoadingFailed] = useState(false);
  
  // Try to load fonts, but don't block app if they fail
  // We use a try-catch block to handle any font loading errors
  const [fontsLoaded, fontError] = useFonts({
    Mansfield: require('./assets/Mansfield.ttf'),
    'Neue Power': require('./assets/NeuePower.ttf'),
  });

  // Log font loading error in development and set state
  useEffect(() => {
    if (fontError) {
      if (__DEV__) {
        console.warn('Font loading error:', fontError);
      }
      setFontLoadingFailed(true);
    }
  }, [fontError]);
  
  // Simulate a small loading time to ensure all components are ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Only wait for fonts for a maximum of 1 second to avoid blocking app startup
  useEffect(() => {
    const fontTimeout = setTimeout(() => {
      if (!fontsLoaded && !fontLoadingFailed) {
        console.warn('Font loading timed out, continuing without custom fonts');
        setFontLoadingFailed(true);
      }
    }, 1000);
    
    return () => clearTimeout(fontTimeout);
  }, [fontsLoaded, fontLoadingFailed]);
  
  // Show loading screen only if we're still in initial loading state
  // and fonts haven't failed or timed out
  if (isLoading && !fontLoadingFailed) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <Navigation />
        </AuthProvider>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
