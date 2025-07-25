import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TEXT_SIZES, BORDER_RADIUS } from '../constants';
import type { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

const PURPLE_GRADIENT = {
  start: '#8B5CF6',
  middle: '#6366F1',
  end: '#4F46E5',
};

export default function StartScreen() {
  const navigation = useNavigation<StartScreenNavigationProp>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[PURPLE_GRADIENT.start, PURPLE_GRADIENT.middle, PURPLE_GRADIENT.end]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.appName}>Festivv</Text>
          <Text style={styles.tagline}>Teile deine Festival-Momente</Text>
        </View>
      </LinearGradient>

      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Entdecke Festivv</Text>
        
        <View style={styles.featureGrid}>
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => navigation.navigate('Auth')}
          >
            <View style={[styles.iconCircle, {backgroundColor: COLORS.primaryLight}]}>
              <Ionicons name="people" size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>Gruppen</Text>
            <Text style={styles.featureDesc}>Erstelle und verwalte deine Festivalgruppen</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={[styles.iconCircle, {backgroundColor: COLORS.accent}]}>
              <Ionicons name="images" size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>Galerie</Text>
            <Text style={styles.featureDesc}>Alle Fotos deiner Gruppe an einem Ort</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={[styles.iconCircle, {backgroundColor: COLORS.festival}]}>
              <Ionicons name="camera" size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>Kamera</Text>
            <Text style={styles.featureDesc}>Nimm Fotos auf und teile sie sofort</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={[styles.iconCircle, {backgroundColor: COLORS.info}]}>
              <Ionicons name="location" size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>Freunde</Text>
            <Text style={styles.featureDesc}>Finde und treffe deine Festival-Freunde</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.getStartedContainer}>
        <Text style={styles.sectionTitle}>Los geht's!</Text>
        
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <LinearGradient
            colors={[PURPLE_GRADIENT.start, PURPLE_GRADIENT.end]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.getStartedText}>Jetzt anmelden</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.guestButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.guestButtonText}>Als Gast fortfahren</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.premiumBanner}>
        <LinearGradient
          colors={['rgba(245, 158, 11, 0.9)', 'rgba(217, 119, 6, 0.9)']}
          style={styles.premiumGradient}
        >
          <View style={styles.premiumContent}>
            <Ionicons name="star" size={24} color="white" />
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Premium-Features</Text>
              <Text style={styles.premiumDesc}>Mehr Speicher, Filter und HD-Uploads</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </View>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.xxxl + SPACING.lg,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: TEXT_SIZES.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: SPACING.lg,
  },
  featuresContainer: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TEXT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  featureTitle: {
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  featureDesc: {
    fontSize: TEXT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  getStartedContainer: {
    padding: SPACING.lg,
  },
  getStartedButton: {
    marginBottom: SPACING.base,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
  },
  getStartedText: {
    color: 'white',
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
    marginRight: SPACING.sm,
  },
  guestButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.base,
  },
  guestButtonText: {
    color: COLORS.primary,
    fontSize: TEXT_SIZES.base,
    fontWeight: '500',
  },
  premiumBanner: {
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xxxl,
  },
  premiumGradient: {
    borderRadius: BORDER_RADIUS.lg,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  premiumTextContainer: {
    flex: 1,
    marginLeft: SPACING.base,
  },
  premiumTitle: {
    color: 'white',
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
  },
  premiumDesc: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: TEXT_SIZES.sm,
  },
}); 