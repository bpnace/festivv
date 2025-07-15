import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform, Alert } from 'react-native';
import { CameraCapturedPicture } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import CameraComponent from '../components/CameraComponent';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
  const navigation = useNavigation();
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleCapture = (capturedPhoto: CameraCapturedPicture) => {
    setPhoto(capturedPhoto);
  };
  
  const handleRetake = () => {
    setPhoto(null);
  };
  
  const handleSave = async () => {
    if (!photo) return;
    
    try {
      setIsSaving(true);
      
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Berechtigung erforderlich',
          'Um Fotos zu speichern, benötigt die App Zugriff auf deine Medienbibliothek.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Save to media library
      await MediaLibrary.saveToLibraryAsync(photo.uri);
      
      // Navigate to gallery with the new photo
      Alert.alert(
        'Gespeichert',
        'Das Foto wurde erfolgreich gespeichert.',
        [
          {
            text: 'Zur Galerie',
            onPress: () => {
              // @ts-ignore - Type safety will be handled in navigation types
              navigation.navigate('Gallery', { newPhotoUri: photo.uri });
            },
          },
          {
            text: 'Neues Foto',
            onPress: handleRetake,
          },
        ]
      );
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Fehler', 'Beim Speichern des Fotos ist ein Fehler aufgetreten.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleClose = () => {
    // @ts-ignore - Type safety will be handled in navigation types
    navigation.navigate('Gallery');
  };
  
  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        
        <View style={styles.previewControls}>
          <TouchableOpacity 
            style={styles.previewButton}
            onPress={handleRetake}
            disabled={isSaving}
          >
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.previewButtonText}>Neu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
              style={styles.saveButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isSaving ? (
                <Text style={styles.saveButtonText}>Speichern...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark" size={24} color="white" />
                  <Text style={styles.saveButtonText}>Speichern</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  return <CameraComponent onCapture={handleCapture} onClose={handleClose} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  previewControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg,
  },
  previewButton: {
    alignItems: 'center',
    padding: SPACING.base,
  },
  previewButtonText: {
    color: 'white',
    marginTop: SPACING.xs,
    fontSize: 14,
  },
  saveButton: {
    width: 150,
    height: 50,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
}); 