// Load environment variables from .env
require('dotenv').config();

// Get environment variables
const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

// Log environment variables for debugging (only in development)
if (process.env.APP_ENV === 'development' || process.env.DEBUG_MODE === 'true') {
  console.log('Environment variables loaded in app.config.js:');
  console.log('EXPO_PUBLIC_SUPABASE_URL:', EXPO_PUBLIC_SUPABASE_URL ? 'Found' : 'Not found');
  console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', EXPO_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Not found');
  console.log('SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? 'Found' : 'Not found');
}

module.exports = {
  name: 'Festival Foto-App',
  slug: 'festivv',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.festivv.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.festivv.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    // Pass environment variables to the app
    supabaseUrl: EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: EXPO_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceKey: SUPABASE_SERVICE_KEY,
    
    // App configuration
    appEnv: process.env.APP_ENV || 'development',
    debugMode: process.env.DEBUG_MODE === 'true',
    enablePremiumFeatures: process.env.ENABLE_PREMIUM_FEATURES === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
    enablePushNotifications: process.env.ENABLE_PUSH_NOTIFICATIONS === 'true',
    
    // EAS configuration
    eas: {
      projectId: process.env.EAS_PROJECT_ID || ''
    }
  },
  plugins: [
    // Add any Expo plugins here
  ]
}; 