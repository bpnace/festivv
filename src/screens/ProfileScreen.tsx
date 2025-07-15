import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TEXT_SIZES, BORDER_RADIUS } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  const isGuest = user?.is_guest || false;
  const username = user?.name || 'Festival-Fan';
  const avatarUrl = user?.avatar_url || null;
  
  // Handle profile image selection
  const handleChangeProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Berechtigung erforderlich',
          'Um ein Profilbild auszuwählen, benötigt die App Zugriff auf deine Medienbibliothek.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // In a real app, we would upload this to storage and update the user profile
        console.log('Selected image:', result.assets[0].uri);
        Alert.alert(
          'Profilbild',
          'Das Profilbild wurde erfolgreich aktualisiert.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Fehler', 'Beim Auswählen des Bildes ist ein Fehler aufgetreten.');
    }
  };
  
  // Navigate to premium features page
  const handlePremiumPress = () => {
    // @ts-ignore - Type safety will be handled in navigation types
    navigation.navigate('Premium');
  };
  
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#6366F1', '#4F46E5']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={handleChangeProfileImage}
        >
          {isGuest || !avatarUrl ? (
            <View style={styles.guestAvatar}>
              <Ionicons name="person" size={40} color="white" />
              <View style={styles.editIconContainer}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </View>
          ) : (
            <View>
              <Image 
                source={{ uri: avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                style={styles.avatar} 
              />
              <View style={styles.editIconContainer}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </View>
          )}
        </TouchableOpacity>
        
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
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => setIsEditingProfile(true)}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="person" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Profil bearbeiten</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="notifications" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Benachrichtigungen</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? 'white' : (notificationsEnabled ? COLORS.primaryLight : COLORS.textTertiary)}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="location" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Standort teilen</Text>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? 'white' : (locationEnabled ? COLORS.primaryLight : COLORS.textTertiary)}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="moon" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={Platform.OS === 'ios' ? 'white' : (darkModeEnabled ? COLORS.primaryLight : COLORS.textTertiary)}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handlePremiumPress}
          >
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
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingIconContainer}>
              <Ionicons name="shield" size={22} color={COLORS.primary} />
            </View>
            <Text style={styles.settingText}>Datenschutz</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => {
              Alert.alert(
                'Abmelden',
                'Möchtest du dich wirklich abmelden?',
                [
                  { text: 'Abbrechen', style: 'cancel' },
                  { text: 'Abmelden', style: 'destructive', onPress: signOut }
                ]
              );
            }}
          >
            <View style={[styles.settingIconContainer, {backgroundColor: 'rgba(239, 68, 68, 0.1)'}]}>
              <Ionicons name="log-out" size={22} color={COLORS.error} />
            </View>
            <Text style={[styles.settingText, {color: COLORS.error}]}>Abmelden</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
      
      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <View style={styles.editProfileOverlay}>
          <View style={styles.editProfileContainer}>
            <View style={styles.editProfileHeader}>
              <Text style={styles.editProfileTitle}>Profil bearbeiten</Text>
              <TouchableOpacity onPress={() => setIsEditingProfile(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.editProfileImageContainer}
              onPress={handleChangeProfileImage}
            >
              {isGuest || !avatarUrl ? (
                <View style={styles.editProfileImage}>
                  <Ionicons name="person" size={40} color={COLORS.primary} />
                </View>
              ) : (
                <Image 
                  source={{ uri: avatarUrl || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                  style={styles.editProfileImage} 
                />
              )}
              <View style={styles.editProfileImageIcon}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.editProfileLabel}>Benutzername</Text>
            <View style={styles.editProfileInputContainer}>
              <Text style={styles.editProfileInput}>{username}</Text>
            </View>
            
            <Text style={styles.editProfileLabel}>E-Mail</Text>
            <View style={styles.editProfileInputContainer}>
              <Text style={styles.editProfileInput}>{user?.email || 'Keine E-Mail'}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => {
                setIsEditingProfile(false);
                Alert.alert('Gespeichert', 'Dein Profil wurde aktualisiert.');
              }}
            >
              <LinearGradient
                colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.saveButtonText}>Speichern</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
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
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.textTertiary,
    fontSize: TEXT_SIZES.sm,
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  editProfileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  editProfileContainer: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
  },
  editProfileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  editProfileTitle: {
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  editProfileImageContainer: {
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  editProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileImageIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  editProfileLabel: {
    fontSize: TEXT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  editProfileInputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.base,
    marginBottom: SPACING.base,
  },
  editProfileInput: {
    fontSize: TEXT_SIZES.base,
    color: COLORS.text,
  },
  saveButton: {
    marginTop: SPACING.base,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: SPACING.base,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: TEXT_SIZES.base,
  },
}); 