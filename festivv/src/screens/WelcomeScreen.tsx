import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TEXT_SIZES, GERMAN_TEXTS, BORDER_RADIUS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{GERMAN_TEXTS.ONBOARDING.WELCOME}</Text>
        <Text style={styles.subtitle}>
          {GERMAN_TEXTS.ONBOARDING.SUBTITLE}
        </Text>
        <Text style={styles.phase}>
          Phase 1.2 Authentication in Bearbeitung! 🚀
        </Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.buttonText}>{GERMAN_TEXTS.ONBOARDING.GET_STARTED}</Text>
        </TouchableOpacity>
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
    color: COLORS.festival,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  buttonText: {
    color: 'white',
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
  },
}); 