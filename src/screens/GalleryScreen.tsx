import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TEXT_SIZES, BORDER_RADIUS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';
import PhotoViewer from '../components/PhotoViewer';
import { useNavigation } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.sm * 2) / 3;

// Mock data for photos with additional metadata
const MOCK_PHOTOS = [
  { 
    id: '1', 
    uri: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    caption: 'Großartige Stimmung beim Hauptact',
    date: '15.07.2023',
    group: 'Festival-Gang'
  },
  { 
    id: '2', 
    uri: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    caption: 'Lichtshow bei Sonnenuntergang',
    date: '16.07.2023',
    group: 'Festival-Gang'
  },
  { 
    id: '3', 
    uri: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    caption: 'Die Menge ist begeistert',
    date: '15.07.2023',
    group: 'Festival-Gang'
  },
  { 
    id: '4', 
    uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZlc3RpdmFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    caption: 'Backstage mit der Band',
    date: '17.07.2023',
    group: 'VIP-Gruppe'
  },
  { 
    id: '5', 
    uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZlc3RpdmFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    caption: 'Nachtkonzert',
    date: '16.07.2023',
    group: 'Festival-Gang'
  },
  { 
    id: '6', 
    uri: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZlc3RpdmFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    caption: 'Festival-Atmosphäre',
    date: '17.07.2023',
    group: 'Festival-Gang'
  },
];

type Category = 'all' | 'group' | 'private' | 'favorites';

export default function GalleryScreen({ route }: any) {
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  // Handle new photo from camera if passed through navigation
  React.useEffect(() => {
    if (route.params?.newPhotoUri) {
      // In a real app, we would save this to the database
      // For now, we'll just show a success message
      console.log('New photo received:', route.params.newPhotoUri);
      
      // Clear the parameter to prevent showing the message again on re-render
      navigation.setParams({ newPhotoUri: undefined });
    }
  }, [route.params?.newPhotoUri]);
  
  const handlePhotoPress = (index: number) => {
    setSelectedPhotoIndex(index);
  };
  
  const handleCloseViewer = () => {
    setSelectedPhotoIndex(null);
  };
  
  const handleCameraPress = () => {
    // @ts-ignore - Type safety will be handled in navigation types
    navigation.navigate('Camera');
  };
  
  return (
    <View style={styles.container}>
      <ScreenHeader title="Galerie">
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textTertiary} />
          <Text style={styles.searchPlaceholder}>Fotos suchen</Text>
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity 
            style={[styles.categoryButton, activeCategory === 'all' && styles.activeCategoryButton]} 
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[styles.categoryButtonText, activeCategory === 'all' && styles.activeCategoryText]}>
              Alle Fotos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryButton, activeCategory === 'group' && styles.activeCategoryButton]} 
            onPress={() => setActiveCategory('group')}
          >
            <Text style={[styles.categoryButtonText, activeCategory === 'group' && styles.activeCategoryText]}>
              Gruppenfotos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryButton, activeCategory === 'private' && styles.activeCategoryButton]} 
            onPress={() => setActiveCategory('private')}
          >
            <Text style={[styles.categoryButtonText, activeCategory === 'private' && styles.activeCategoryText]}>
              Meine Fotos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryButton, activeCategory === 'favorites' && styles.activeCategoryButton]} 
            onPress={() => setActiveCategory('favorites')}
          >
            <Text style={[styles.categoryButtonText, activeCategory === 'favorites' && styles.activeCategoryText]}>
              Favoriten
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenHeader>
      
      {MOCK_PHOTOS.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="images-outline" size={60} color={COLORS.textTertiary} />
          <Text style={styles.emptyStateTitle}>Keine Fotos gefunden</Text>
          <Text style={styles.emptyStateSubtitle}>
            Nimm deine ersten Festival-Fotos auf und teile sie mit deiner Gruppe
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={handleCameraPress}>
            <LinearGradient
              colors={['#8B5CF6', '#4F46E5']}
              style={styles.uploadButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="camera" size={20} color="white" style={styles.uploadButtonIcon} />
              <Text style={styles.uploadButtonText}>Foto aufnehmen</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={MOCK_PHOTOS}
            keyExtractor={item => item.id}
            numColumns={3}
            contentContainerStyle={styles.photoGrid}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={styles.photoContainer}
                onPress={() => handlePhotoPress(index)}
              >
                <Image source={{ uri: item.uri }} style={styles.photo} />
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
          
          <TouchableOpacity 
            style={styles.floatingButton}
            onPress={handleCameraPress}
          >
            <LinearGradient
              colors={['#8B5CF6', '#4F46E5']}
              style={styles.floatingButtonGradient}
            >
              <Ionicons name="camera" size={24} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
      
      {selectedPhotoIndex !== null && (
        <PhotoViewer
          photos={MOCK_PHOTOS}
          initialIndex={selectedPhotoIndex}
          onClose={handleCloseViewer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.base,
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.base,
  },
  searchPlaceholder: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: SPACING.sm,
    fontSize: TEXT_SIZES.base,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
  },
  categoryButton: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  activeCategoryButton: {
    backgroundColor: 'white',
  },
  categoryButtonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    fontSize: TEXT_SIZES.sm,
  },
  activeCategoryText: {
    color: COLORS.primary,
  },
  photoGrid: {
    padding: SPACING.lg,
  },
  photoContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  floatingButton: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg + SPACING.xxl,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateTitle: {
    fontSize: TEXT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtitle: {
    fontSize: TEXT_SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  uploadButton: {
    width: '80%',
    marginTop: SPACING.lg,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  uploadButtonIcon: {
    marginRight: SPACING.xs,
  },
}); 