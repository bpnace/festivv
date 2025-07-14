import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  TextInput,
  FlatList 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TEXT_SIZES, BORDER_RADIUS } from '../constants';

// Mock data for friends
const MOCK_FRIENDS = [
  {
    id: '1',
    name: 'Max Mustermann',
    username: '@maxmuster',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isNearby: true,
    lastActive: '10min',
    status: 'online'
  },
  {
    id: '2',
    name: 'Lisa Schmidt',
    username: '@lisaschmidt',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isNearby: true,
    lastActive: '5min',
    status: 'online'
  },
  {
    id: '3',
    name: 'Jonas Weber',
    username: '@jweber',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    isNearby: false,
    lastActive: '1h',
    status: 'offline'
  },
  {
    id: '4',
    name: 'Anna Müller',
    username: '@annamueller',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    isNearby: false,
    lastActive: '3h',
    status: 'offline'
  }
];

type FriendTab = 'all' | 'nearby' | 'requests';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<FriendTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter friends based on active tab and search query
  const filteredFriends = MOCK_FRIENDS.filter(friend => {
    // Filter by search query
    if (searchQuery && !friend.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'nearby' && !friend.isNearby) {
      return false;
    }
    
    return true;
  });
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#6366F1', '#4F46E5']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Freunde</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Freunde suchen"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              Alle
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
            onPress={() => setActiveTab('nearby')}
          >
            <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
              In der Nähe
            </Text>
            <View style={styles.nearbyBadge}>
              <Text style={styles.nearbyBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
              Anfragen
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.locationShareContainer}>
          <View style={styles.locationIconContainer}>
            <Ionicons name="location" size={24} color="white" />
          </View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTitle}>Standort teilen</Text>
            <Text style={styles.locationSubtitle}>Hilf deinen Freunden, dich auf dem Festival zu finden</Text>
          </View>
          <TouchableOpacity style={styles.locationSwitch}>
            <View style={styles.locationSwitchKnob} />
          </TouchableOpacity>
        </View>
        
        {filteredFriends.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="people-outline" size={60} color={COLORS.textTertiary} />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'Keine Freunde gefunden' : 'Noch keine Freunde'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery 
                ? `Keine Ergebnisse für "${searchQuery}"`
                : 'Füge Festival-Freunde hinzu, um Fotos und deinen Standort zu teilen'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity style={styles.addFriendsButton}>
                <LinearGradient
                  colors={['#8B5CF6', '#4F46E5']}
                  style={styles.addFriendsButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="person-add" size={20} color="white" style={styles.addFriendsButtonIcon} />
                  <Text style={styles.addFriendsButtonText}>Freunde hinzufügen</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredFriends}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.friendRow}>
                <View style={styles.friendAvatar}>
                  <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                  <View style={[
                    styles.statusIndicator, 
                    item.status === 'online' ? styles.onlineIndicator : styles.offlineIndicator
                  ]} />
                </View>
                
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.friendUsername}>{item.username}</Text>
                </View>
                
                <View style={styles.friendActions}>
                  {item.isNearby && (
                    <View style={styles.nearbyContainer}>
                      <Ionicons name="location" size={16} color={COLORS.success} />
                      <Text style={styles.nearbyText}>In der Nähe</Text>
                    </View>
                  )}
                  <Text style={styles.lastActive}>Aktiv: {item.lastActive}</Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.friendsList}
          />
        )}
      </View>
      
      <TouchableOpacity style={styles.floatingButton}>
        <LinearGradient
          colors={['#8B5CF6', '#4F46E5']}
          style={styles.floatingButtonGradient}
        >
          <Ionicons name="person-add" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.base,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    fontSize: TEXT_SIZES.base,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  tab: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.primary,
  },
  nearbyBadge: {
    backgroundColor: COLORS.error,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  nearbyBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: SPACING.lg,
  },
  locationShareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: TEXT_SIZES.base,
  },
  locationSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: TEXT_SIZES.xs,
  },
  locationSwitch: {
    width: 50,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    padding: 2,
  },
  locationSwitchKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'white',
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
  addFriendsButton: {
    width: '80%',
    marginTop: SPACING.lg,
  },
  addFriendsButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.full,
  },
  addFriendsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: TEXT_SIZES.base,
  },
  addFriendsButtonIcon: {
    marginRight: SPACING.sm,
  },
  friendsList: {
    paddingHorizontal: SPACING.lg,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  onlineIndicator: {
    backgroundColor: COLORS.success,
  },
  offlineIndicator: {
    backgroundColor: COLORS.textTertiary,
  },
  friendInfo: {
    flex: 1,
    marginLeft: SPACING.base,
  },
  friendName: {
    fontSize: TEXT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  friendUsername: {
    fontSize: TEXT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  friendActions: {
    alignItems: 'flex-end',
  },
  nearbyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 4,
  },
  nearbyText: {
    fontSize: TEXT_SIZES.xs,
    color: COLORS.success,
    marginLeft: 2,
  },
  lastActive: {
    fontSize: TEXT_SIZES.xs,
    color: COLORS.textTertiary,
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
}); 