import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';

// Temporary placeholder screens
const GroupsScreen = () => <View style={{ flex: 1 }} />;
const GalleryScreen = () => <View style={{ flex: 1 }} />;
const CameraScreen = () => <View style={{ flex: 1 }} />;
const FriendsScreen = () => <View style={{ flex: 1 }} />;
const ProfileScreen = () => <View style={{ flex: 1 }} />;
const SettingsScreen = () => <View style={{ flex: 1 }} />;
const PremiumScreen = () => <View style={{ flex: 1 }} />;

// Types
import { RootStackParamList, TabParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants';

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Main tab navigator (when authenticated)
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Groups') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Gallery') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Friends') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      })}
    >
      <Tab.Screen name="Groups" component={GroupsScreen} options={{ title: 'Gruppen' }} />
      <Tab.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Galerie' }} />
      <Tab.Screen name="Camera" component={CameraScreen} options={{ title: 'Kamera' }} />
      <Tab.Screen name="Friends" component={FriendsScreen} options={{ title: 'Freunde' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

export default function Navigation() {
  const { user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Authenticated routes
          <>
            <Stack.Screen name="Home" component={MainTabs} />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ headerShown: true, title: 'Einstellungen' }}
            />
            <Stack.Screen 
              name="Premium" 
              component={PremiumScreen} 
              options={{ headerShown: true, title: 'Premium' }}
            />
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 