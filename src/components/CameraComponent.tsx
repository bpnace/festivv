import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';

interface CameraComponentProps {
  onCapture: (photo: any) => void;
  onClose: () => void;
}

export default function CameraComponent({ onCapture, onClose }: CameraComponentProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>(CameraType?.back || 'back');
  const [flashMode, setFlashMode] = useState<FlashMode>(FlashMode?.off || 'off');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            'Kamerazugriff erforderlich',
            'Um Fotos aufzunehmen, benötigt die App Zugriff auf deine Kamera.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setHasPermission(false);
        Alert.alert(
          'Kamerafehler',
          'Die Kamera konnte nicht initialisiert werden. Bitte starte die App neu.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      try {
        setIsCapturing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: Platform.OS === 'ios' ? false : true,
        });
        onCapture(photo);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Fehler', 'Beim Aufnehmen des Fotos ist ein Fehler aufgetreten.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => 
      current === (CameraType?.back || 'back') ? (CameraType?.front || 'front') : (CameraType?.back || 'back')
    );
  };

  const toggleFlashMode = () => {
    setFlashMode(current => 
      current === (FlashMode?.off || 'off') ? (FlashMode?.on || 'on') : (FlashMode?.off || 'off')
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Kamerazugriff wird angefragt...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Kein Zugriff auf die Kamera</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={onClose}
        >
          <Text style={styles.permissionButtonText}>Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        ratio="16:9"
      >
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          
          <View style={styles.topControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleFlashMode}
            >
              <Ionicons 
                name={flashMode === (FlashMode?.off || 'off') ? "flash-off" : "flash"} 
                size={24} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={toggleCameraType}
            >
              <Ionicons name="camera-reverse" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <View style={styles.capturingIndicator} />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.xl + (Platform.OS === 'ios' ? 30 : 10),
    left: SPACING.lg,
    zIndex: 10,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.lg,
    paddingTop: SPACING.xl + (Platform.OS === 'ios' ? 30 : 10),
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  capturingIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.error,
  },
  placeholder: {
    width: 50,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.full,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
}); 