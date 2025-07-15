import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TEXT_SIZES, BORDER_RADIUS, GERMAN_TEXTS } from '../constants';
import { useNavigation } from '@react-navigation/native';

// Premium feature types
interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
}

export default function PremiumScreen() {
  const navigation = useNavigation();
  
  // Premium features list
  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'storage',
      title: GERMAN_TEXTS.PREMIUM.UNLIMITED_STORAGE,
      description: 'Speichere unbegrenzt viele Fotos in voller Qualität.',
      icon: 'cloud-upload',
    },
    {
      id: 'filters',
      title: GERMAN_TEXTS.PREMIUM.ADVANCED_FILTERS,
      description: 'Zugriff auf professionelle Fotofilter und Bearbeitungstools.',
      icon: 'color-filter',
      comingSoon: true,
    },
    {
      id: 'support',
      title: GERMAN_TEXTS.PREMIUM.PRIORITY_SUPPORT,
      description: 'Erhalte bevorzugten Support bei Fragen oder Problemen.',
      icon: 'help-buoy',
    },
    {
      id: 'themes',
      title: GERMAN_TEXTS.PREMIUM.CUSTOM_THEMES,
      description: 'Passe das Erscheinungsbild der App an deine Vorlieben an.',
      icon: 'color-palette',
      comingSoon: true,
    },
    {
      id: 'export',
      title: GERMAN_TEXTS.PREMIUM.EXPORT_ALBUMS,
      description: 'Exportiere komplette Alben als ZIP-Archiv oder teile sie mit Freunden.',
      icon: 'share',
      comingSoon: true,
    },
    {
      id: 'hd',
      title: GERMAN_TEXTS.PREMIUM.HD_UPLOADS,
      description: 'Lade Fotos in voller HD-Qualität hoch und teile sie ohne Qualitätsverlust.',
      icon: 'image',
    },
  ];
  
  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // Handle subscription button press
  const handleSubscribePress = () => {
    // In a real app, this would open a payment flow
    alert('In der vollständigen App würde hier der Zahlungsprozess starten.');
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.premiumIconContainer}>
            <Ionicons name="star" size={40} color="white" />
          </View>
          
          <Text style={styles.headerTitle}>Festivv Premium</Text>
          <Text style={styles.headerSubtitle}>
            Erweitere dein Festival-Erlebnis mit exklusiven Features
          </Text>
        </View>
      </LinearGradient>
      
      {/* Features List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.featuresContainer}>
          {premiumFeatures.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <View 
                style={[
                  styles.featureIconContainer,
                  feature.comingSoon && styles.comingSoonIconContainer
                ]}
              >
                <Ionicons 
                  name={feature.icon as any} 
                  size={24} 
                  color={feature.comingSoon ? COLORS.textTertiary : COLORS.primary} 
                />
              </View>
              
              <View style={styles.featureContent}>
                <View style={styles.featureTitleContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  {feature.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>
                        {GERMAN_TEXTS.PREMIUM.COMING_SOON}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Premium-Mitgliedschaft</Text>
          
          <View style={styles.pricingCard}>
            <View style={styles.pricingHeader}>
              <Text style={styles.pricingPlan}>Jahresabo</Text>
              <Text style={styles.pricingDiscount}>Spare 33%</Text>
            </View>
            
            <View style={styles.pricingContent}>
              <Text style={styles.pricingAmount}>39,99 €</Text>
              <Text style={styles.pricingPeriod}>pro Jahr</Text>
              <Text style={styles.pricingMonthly}>Entspricht 3,33 € pro Monat</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribePress}
            >
              <LinearGradient
                colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
                style={styles.subscribeButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.subscribeButtonText}>
                  {GERMAN_TEXTS.PREMIUM.UPGRADE}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pricingCard}>
            <View style={styles.pricingHeader}>
              <Text style={styles.pricingPlan}>Monatsabo</Text>
            </View>
            
            <View style={styles.pricingContent}>
              <Text style={styles.pricingAmount}>5,99 €</Text>
              <Text style={styles.pricingPeriod}>pro Monat</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribePress}
            >
              <LinearGradient
                colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
                style={styles.subscribeButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.subscribeButtonText}>
                  {GERMAN_TEXTS.PREMIUM.UPGRADE}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.termsText}>
            Die Abonnements verlängern sich automatisch. Kündigung jederzeit möglich.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
    paddingHorizontal: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  headerContent: {
    alignItems: 'center',
  },
  premiumIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  headerTitle: {
    fontSize: TEXT_SIZES.xxl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: TEXT_SIZES.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  featuresContainer: {
    marginBottom: SPACING.xl,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
  },
  comingSoonIconContainer: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  featureTitle: {
    fontSize: TEXT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  comingSoonBadge: {
    backgroundColor: COLORS.textTertiary,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  comingSoonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  featureDescription: {
    fontSize: TEXT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  pricingSection: {
    marginBottom: SPACING.xxl,
  },
  pricingTitle: {
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.base,
  },
  pricingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  pricingPlan: {
    fontSize: TEXT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  pricingDiscount: {
    backgroundColor: COLORS.accent,
    color: 'white',
    fontSize: TEXT_SIZES.xs,
    fontWeight: '600',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  pricingContent: {
    marginBottom: SPACING.lg,
  },
  pricingAmount: {
    fontSize: TEXT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  pricingPeriod: {
    fontSize: TEXT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  pricingMonthly: {
    fontSize: TEXT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  subscribeButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  subscribeButtonGradient: {
    paddingVertical: SPACING.base,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: TEXT_SIZES.base,
  },
  termsText: {
    fontSize: TEXT_SIZES.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
}); 