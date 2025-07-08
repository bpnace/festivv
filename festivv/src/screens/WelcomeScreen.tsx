import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SPACING, TEXT_SIZES, GERMAN_TEXTS } from '../constants';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{GERMAN_TEXTS.ONBOARDING.WELCOME}</Text>
        <Text style={styles.subtitle}>
          {GERMAN_TEXTS.ONBOARDING.SUBTITLE}
        </Text>
        <Text style={styles.phase}>
          Phase 0 Setup abgeschlossen! 🎉
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: TEXT_SIZES.display,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.base,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TEXT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  phase: {
    fontSize: TEXT_SIZES.base,
    color: COLORS.success,
    textAlign: 'center',
    fontWeight: '600',
  },
}); 