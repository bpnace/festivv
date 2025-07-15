import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  Share,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { COLORS, SPACING, BORDER_RADIUS, GERMAN_TEXTS, TEXT_SIZES } from '../constants';

const { width, height } = Dimensions.get('window');

interface Photo {
  id: string;
  uri: string;
  caption?: string;
  date?: string;
  group?: string;
}

interface PhotoViewerProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewer({ photos, initialIndex, onClose }: PhotoViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const currentPhoto = photos[currentIndex];

  // Initialize loading state for all photos
  useEffect(() => {
    const initialLoadingState: Record<string, boolean> = {};
    photos.forEach(photo => {
      initialLoadingState[photo.id] = true;
    });
    setIsLoading(initialLoadingState);
    
    // Hide status bar when viewing photos
    StatusBar.setHidden(true);
    return () => {
      // Show status bar when component unmounts
      StatusBar.setHidden(false);
    };
  }, [photos]);

  // Scroll to initial photo
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: initialIndex * width, animated: false });
    }
  }, [initialIndex]);

  // Handle swipe to next or previous photo
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < photos.length) {
      setCurrentIndex(newIndex);
    }
  };

  // Download the current photo
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
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
      
      // For remote images, download first
      let fileUri = currentPhoto.uri;
      if (currentPhoto.uri.startsWith('http')) {
        const localUri = FileSystem.documentDirectory + `download-${Date.now()}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(currentPhoto.uri, localUri);
        if (downloadResult.status === 200) {
          fileUri = downloadResult.uri;
        }
      }
      
      // Save to media library
      await MediaLibrary.saveToLibraryAsync(fileUri);
      
      Alert.alert(
        'Gespeichert',
        'Das Foto wurde erfolgreich in deiner Galerie gespeichert.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error downloading photo:', error);
      Alert.alert('Fehler', 'Beim Speichern des Fotos ist ein Fehler aufgetreten.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Share the current photo
  const handleShare = async () => {
    try {
      // For remote images, we need to download them first
      if (currentPhoto.uri.startsWith('http')) {
        const fileUri = FileSystem.documentDirectory + `temp-${Date.now()}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(currentPhoto.uri, fileUri);
        
        if (downloadResult.status === 200) {
          await Share.share({
            url: fileUri,
            message: currentPhoto.caption || 'Sieh dir dieses Festival-Foto an!',
          });
        } else {
          throw new Error('Failed to download image for sharing');
        }
      } else {
        // Local file
        await Share.share({
          url: currentPhoto.uri,
          message: currentPhoto.caption || 'Sieh dir dieses Festival-Foto an!',
        });
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      Alert.alert('Fehler', 'Beim Teilen des Fotos ist ein Fehler aufgetreten.');
    }
  };

  // Navigate to the next photo
  const goToNextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }
  };

  // Navigate to the previous photo
  const goToPrevPhoto = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({ x: prevIndex * width, animated: true });
    }
  };

  // Handle image load error
  const handleImageError = (photoId: string) => {
    console.log('Image failed to load:', photoId);
    setImageErrors(prev => ({ ...prev, [photoId]: true }));
    setIsLoading(prev => ({ ...prev, [photoId]: false }));
  };

  // Handle image load success
  const handleImageLoad = (photoId: string) => {
    setIsLoading(prev => ({ ...prev, [photoId]: false }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fullscreenOverlay}
        activeOpacity={1}
        onPress={() => setIsFullscreen(!isFullscreen)}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          contentOffset={{ x: initialIndex * width, y: 0 }}
        >
          {photos.map((photo) => (
            <View key={photo.id} style={styles.photoContainer}>
              {imageErrors[photo.id] ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="image-outline" size={80} color={COLORS.textTertiary} />
                  <Text style={styles.errorText}>Bild konnte nicht geladen werden</Text>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                      setImageErrors(prev => ({ ...prev, [photo.id]: false }));
                      setIsLoading(prev => ({ ...prev, [photo.id]: true }));
                    }}
                  >
                    <Text style={styles.retryButtonText}>Erneut versuchen</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.photo}
                    resizeMode="contain"
                    onError={() => handleImageError(photo.id)}
                    onLoad={() => handleImageLoad(photo.id)}
                  />
                  {isLoading[photo.id] && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                  )}
                </>
              )}
            </View>
          ))}
        </ScrollView>
      </TouchableOpacity>

      {!isFullscreen && (
        <>
          {/* Header */}
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0)']}
            style={styles.header}
          >
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            
            <Text style={styles.photoCount}>
              {currentIndex + 1} / {photos.length}
            </Text>
          </LinearGradient>

          {/* Footer */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={styles.footer}
          >
            {currentPhoto.caption && (
              <Text style={styles.caption}>{currentPhoto.caption}</Text>
            )}
            
            {currentPhoto.date && (
              <Text style={styles.date}>{currentPhoto.date}</Text>
            )}
            
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleShare}
                disabled={imageErrors[currentPhoto.id]}
              >
                <Ionicons 
                  name="share-outline" 
                  size={24} 
                  color={imageErrors[currentPhoto.id] ? COLORS.textTertiary : "white"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleDownload}
                disabled={isDownloading || imageErrors[currentPhoto.id]}
              >
                {isDownloading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Ionicons 
                    name="download-outline" 
                    size={24} 
                    color={imageErrors[currentPhoto.id] ? COLORS.textTertiary : "white"} 
                  />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Navigation arrows */}
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.navButton, styles.leftNavButton]}
              onPress={goToPrevPhoto}
            >
              <Ionicons name="chevron-back" size={30} color="white" />
            </TouchableOpacity>
          )}
          
          {currentIndex < photos.length - 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.rightNavButton]}
              onPress={goToNextPhoto}
            >
              <Ionicons name="chevron-forward" size={30} color="white" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 999,
  },
  fullscreenOverlay: {
    flex: 1,
  },
  photoContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.textTertiary,
    marginTop: SPACING.base,
    fontSize: TEXT_SIZES.base,
  },
  retryButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCount: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    zIndex: 10,
  },
  caption: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: SPACING.base,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.base,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    zIndex: 10,
  },
  leftNavButton: {
    left: SPACING.base,
  },
  rightNavButton: {
    right: SPACING.base,
  },
}); 