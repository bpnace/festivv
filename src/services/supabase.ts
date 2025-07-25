import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';

// Define a simple Database type if the import fails
type Database = any;

// Helper function to get a value from Constants.expoConfig.extra
const getConfigValue = (key: string): string => {
  const value = Constants.expoConfig?.extra?.[key];
  return (value && typeof value === 'string' && value.trim() !== '') ? value : '';
};

// Get Supabase URL and keys
const supabaseUrl = getConfigValue('supabaseUrl');
const supabaseAnonKey = getConfigValue('supabaseAnonKey');
const supabaseServiceKey = getConfigValue('supabaseServiceKey');

// Validate URL and keys in development
if (__DEV__) {
  if (!supabaseUrl) {
    console.error('Supabase URL not found in environment variables');
  }
  
  if (!supabaseAnonKey) {
    console.error('Supabase anon key not found in environment variables');
  }
  
  if (!supabaseServiceKey) {
    console.error('Supabase service key not found in environment variables');
  }
  
  console.log('Supabase configuration:');
  console.log(`- URL: ${supabaseUrl ? 'Found ✅' : 'Missing ❌'}`);
  console.log(`- Anon Key: ${supabaseAnonKey ? 'Found ✅' : 'Missing ❌'}`);
  console.log(`- Service Key: ${supabaseServiceKey ? 'Found ✅' : 'Missing ❌'}`);
}

// Create a client with anonymous permissions for regular user operations
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Create admin client with service role for admin operations
// Never expose this to the client side! Only use in secure contexts!
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  }
);

// Helper function to check if Supabase is properly configured
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  url?: string;
  hasAnonKey: boolean;
  hasServiceKey: boolean;
}> => {
  if (!supabaseUrl) {
    return { 
      success: false, 
      message: 'Missing Supabase URL. Check your .env.local file.', 
      url: '',
      hasAnonKey: !!supabaseAnonKey,
      hasServiceKey: !!supabaseServiceKey
    };
  }
  
  if (!supabaseAnonKey) {
    return { 
      success: false, 
      message: 'Missing Supabase anon key. Check your .env.local file.', 
      url: supabaseUrl, 
      hasAnonKey: false,
      hasServiceKey: !!supabaseServiceKey
    };
  }

  try {
    // Try a simple query to test the connection
    console.log('Testing Supabase connection...');
    
    // First try to check auth session validity which should work regardless of tables
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth connection error:', authError.message);
      return { 
        success: false, 
        message: `Auth connection error: ${authError.message}`, 
        url: supabaseUrl, 
        hasAnonKey: true,
        hasServiceKey: !!supabaseServiceKey
      };
    }
    
    // Try to access the users table
    let { error } = await supabase.from('users').select('id').limit(1);
    
    if (error && error.message.includes('does not exist')) {
      console.log('Users table not found, need to run SQL setup script...');
      // No need to fail, we'll check if we can use auth functions
      error = null;
    }
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      
      // Try to check if anonymous auth is enabled
      try {
        const { error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError && anonError.message === 'Anonymous sign-ins are disabled') {
          return {
            success: false,
            message: 'Anonymous sign-ins are disabled. Enable them in Supabase Dashboard > Authentication > Providers.',
            url: supabaseUrl,
            hasAnonKey: true,
            hasServiceKey: !!supabaseServiceKey
          };
        }
      } catch (authErr) {
        // Ignore additional errors
      }
      
      return { 
        success: false, 
        message: `Connection error: ${error.message}`, 
        url: supabaseUrl, 
        hasAnonKey: true,
        hasServiceKey: !!supabaseServiceKey
      };
    }
    
    console.log('Supabase connection successful');
    return { 
      success: true, 
      message: 'Connection successful', 
      url: supabaseUrl, 
      hasAnonKey: true,
      hasServiceKey: !!supabaseServiceKey
    };
  } catch (err: any) {
    console.error('Unexpected Supabase error:', err.message);
    return { 
      success: false, 
      message: `Unexpected error: ${err.message || 'Unknown error'}`, 
      url: supabaseUrl, 
      hasAnonKey: true,
      hasServiceKey: !!supabaseServiceKey
    };
  }
};

// Test connection in development mode
if (__DEV__) {
  setTimeout(() => {
    testSupabaseConnection()
      .then(result => {
        if (!result.success) {
          console.warn('⚠️ Supabase connection test failed:', result.message);
          
          // Show alert in development mode
          if (Platform.OS !== 'web') {
            Alert.alert(
              'Supabase Connection Error',
              result.message,
              [{ text: 'OK' }]
            );
          }
        } else {
          console.log('✅ Supabase connection test passed');
        }
      })
      .catch(err => {
        console.error('Failed to test Supabase connection:', err);
      });
  }, 1000);
} 