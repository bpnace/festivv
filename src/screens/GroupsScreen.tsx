import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  FlatList 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TEXT_SIZES, BORDER_RADIUS } from '../constants';
import ScreenHeader from '../components/ScreenHeader';

// Mock data for groups
const MOCK_GROUPS = [
  {
    id: '1',
    name: 'Rock am Ring 2023',
    memberCount: 6,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cm9jayUyMGZlc3RpdmFsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    isAdmin: true,
    lastActive: '2023-07-30'
  },
  {
    id: '2',
    name: 'Tomorrowland 2023',
    memberCount: 4,
    image: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxlY3Ryb25pYyUyMG11c2ljJTIwZmVzdGl2YWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    isAdmin: false,
    lastActive: '2023-07-25'
  },
  {
    id: '3',
    name: 'Wacken 2023',
    memberCount: 8,
    image: 'https://images.unsplash.com/photo-1537824598505-99ee03483384?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhlYXZ5JTIwbWV0YWwlMjBmZXN0aXZhbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    isAdmin: false,
    lastActive: '2023-07-20'
  }
];

export default function GroupsScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader 
        title="Meine Gruppen" 
        rightIcon="add" 
        onRightIconPress={() => console.log('Add group')}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.joinOptionsContainer}>
          <TouchableOpacity style={styles.joinOption}>
            <LinearGradient
              colors={['#EC4899', '#DB2777']}
              style={styles.joinOptionIconContainer}
            >
              <Ionicons name="qr-code" size={22} color="white" />
            </LinearGradient>
            <Text style={styles.joinOptionText}>QR-Code scannen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.joinOption}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.joinOptionIconContainer}
            >
              <Ionicons name="link" size={22} color="white" />
            </LinearGradient>
            <Text style={styles.joinOptionText}>Mit Link beitreten</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.joinOption}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.joinOptionIconContainer}
            >
              <Ionicons name="people" size={22} color="white" />
            </LinearGradient>
            <Text style={styles.joinOptionText}>Gruppe erstellen</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Deine Festival-Gruppen</Text>
        
        {MOCK_GROUPS.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="people-outline" size={60} color={COLORS.textTertiary} />
            <Text style={styles.emptyStateTitle}>Noch keine Gruppen</Text>
            <Text style={styles.emptyStateSubtitle}>
              Erstelle eine neue Gruppe oder tritt einer bestehenden Gruppe bei
            </Text>
            <TouchableOpacity style={styles.createGroupButton}>
              <LinearGradient
                colors={['#8B5CF6', '#4F46E5']}
                style={styles.createGroupButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="people" size={20} color="white" style={styles.createGroupButtonIcon} />
                <Text style={styles.createGroupButtonText}>Gruppe erstellen</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={MOCK_GROUPS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.groupCard}>
                <Image source={{ uri: item.image }} style={styles.groupImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.groupImageOverlay}
                >
                  <View style={styles.groupInfoContainer}>
                    <View>
                      <Text style={styles.groupName}>{item.name}</Text>
                      <Text style={styles.groupMembers}>{item.memberCount} Mitglieder</Text>
                    </View>
                    
                    {item.isAdmin && (
                      <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>Admin</Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
            style={styles.groupsList}
          />
        )}
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SPACING.lg,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  newGroupButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  joinOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  joinOption: {
    alignItems: 'center',
    width: '30%',
  },
  joinOptionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  joinOptionText: {
    fontSize: TEXT_SIZES.sm,
    color: COLORS.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: TEXT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginVertical: SPACING.base,
    paddingHorizontal: SPACING.lg,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xxxl,
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
  createGroupButton: {
    width: '80%',
    marginTop: SPACING.lg,
  },
  createGroupButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  createGroupButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: TEXT_SIZES.base,
  },
  createGroupButtonIcon: {
    marginRight: SPACING.sm,
  },
  groupsList: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  groupCard: {
    height: 160,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.base,
    position: 'relative',
  },
  groupImage: {
    width: '100%',
    height: '100%',
  },
  groupImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  groupInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: SPACING.base,
  },
  groupName: {
    fontSize: TEXT_SIZES.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  groupMembers: {
    fontSize: TEXT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  adminBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  adminBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 