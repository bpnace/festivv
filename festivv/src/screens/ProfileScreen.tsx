import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TEXT_SIZES, BORDER_RADIUS } from '../constants';
import { useAuth } from '../hooks/useAuth';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  
  const isGuest = user?.user_metadata?.is_guest || false;
  const username = user?.user_metadata?.username || 'Festival-Fan';
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#6366F1', '#4F46E5']}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          {isGuest ? (
            <View style={styles.guestAvatar}>
              <Ionicons name="person" size={40} color="white" />
            </View>
          ) : (
            <Image 
              source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.avatar} 
            />
          )}
        </View>
        
        <Text style={styles.username}>{username}</Text>
        {isGuest && <Text style={styles.guestLabel}>Gast-Zugang</Text>}
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Gruppen</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Fotos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Freunde</Text>
          </View>
        </View>
        
        {isGuest && (
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Vollständiges Konto erstellen</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Einstellungen</Text>
        
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="person" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Profil bearbeiten</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Benachrichtigungen</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Privatsphäre</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="star" size={22} color={COLORS.accent} />
            </View>
            <Text style={styles.settingText}>Premium-Features</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>NEU</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Hilfe & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="information-circle" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Über Festivv</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={signOut}
          >
            <View style={[styles.settingIconContainer, {backgroundColor: 'rgba(239, 68, 68, 0.1)'}]}>
              <Ionicons name="log-out" size={22} color={COLORS.error} />
            </View>
            <Text style={[styles.settingText, {color: COLORS.error}]}>Abmelden</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: SPACING.base,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  guestAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  username: {
    fontSize: TEXT_SIZES.xxl,
    fontWeight: 'bold',
    color: 'white',
    marginTop: SPACING.sm,
  },
  guestLabel: {
    fontSize: TEXT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: TEXT_SIZES.xl,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: TEXT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  upgradeButton: {
    backgroundColor: 'white',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.lg,
  },
  upgradeButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.base,
    marginTop: SPACING.lg,
  },
  settingsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
  },
  settingText: {
    flex: 1,
    fontSize: TEXT_SIZES.base,
    color: COLORS.text,
  },
  premiumBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
  },
  premiumBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 