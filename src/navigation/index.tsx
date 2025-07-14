import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

// Screens
import StartScreen from '../screens/StartScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import GroupsScreen from '../screens/GroupsScreen';
import GalleryScreen from '../screens/GalleryScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Types
import { RootStackParamList, TabParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants';

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Camera screen component
const CameraScreen = () => (
  <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
    <Ionicons name="camera" size={100} color={COLORS.primary} />
  </View>
);

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
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
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
              component={ProfileScreen} 
              options={{ headerShown: true, title: 'Einstellungen' }}
            />
            <Stack.Screen 
              name="Premium" 
              component={ProfileScreen} 
              options={{ headerShown: true, title: 'Premium' }}
            />
          </>
        ) : (
          // Unauthenticated routes
          <>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 