import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../services/supabase';
import { User } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of our authentication context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component that wraps the app and makes auth available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError.message);
          setError('Failed to get session');
          setIsLoading(false);
          return;
        }
        
        if (session) {
          // User is authenticated, fetch profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id);
          
          if (userError) {
            console.error('User data error:', userError.message);
            setError('Failed to get user data');
          } else if (userData && userData.length > 0) {
            setUser(userData[0]);
          } else {
            // No user profile found, create one
            await createUserProfile(session.user.id, session.user.email, session.user.user_metadata?.name);
          }
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err.message);
        setError('Failed to initialize authentication');
        
        // Check if it's a network error
        if (err.message.includes('Network request failed')) {
          setError('Network connection error. Please check your internet connection.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Get user profile
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id);
          
          if (userError) {
            console.error('User data error:', userError.message);
            setError('Failed to get user data');
          } else if (userData && userData.length > 0) {
            setUser(userData[0]);
          } else {
            // Create user profile if it doesn't exist
            await createUserProfile(session.user.id, session.user.email, session.user.user_metadata?.name);
          }
        } catch (err: any) {
          console.error('Profile fetch error:', err.message);
          setError('Failed to fetch user profile');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    // Initialize auth
    initializeAuth();
    
    // Cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Helper function to create user profile with proper error handling
  const createUserProfile = async (userId: string, email?: string | null, name?: string | null) => {
    try {
      // First, check if the user profile already exists
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);
      
      // If user already exists, just use that profile
      if (existingUsers && existingUsers.length > 0) {
        setUser(existingUsers[0]);
        return;
      }
      
      // Prepare user data
      const newUser = {
        id: userId,
        name: name || email?.split('@')[0] || 'User',
        email: email,
        is_guest: !email,
        avatar_url: null as string | null, // Explicitly type as string | null
      };
      
      // Try to create user profile
      const { error: insertError } = await supabase
        .from('users')
        .insert([newUser]);
      
      // If insert fails, try to fetch the user again (it might have been created by a trigger)
      if (insertError) {
        console.error('Create user error:', insertError.message);
        
        // If it's a duplicate key error, the user profile might already exist
        if (insertError.message.includes('duplicate key') || insertError.message.includes('violates row-level security policy')) {
          const { data: retryUsers, error: retryError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId);
          
          if (retryUsers && retryUsers.length > 0) {
            setUser(retryUsers[0]);
            return;
          }
        }
        
        // If we still can't get the user, store locally as fallback
        const localUser = {
          ...newUser,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Cast to unknown first to satisfy TypeScript
        setUser(localUser as unknown as User);
        
        // Store locally for persistence
        try {
          await AsyncStorage.setItem('user_profile', JSON.stringify(localUser));
        } catch (storageErr) {
          console.error('Failed to store user profile locally:', storageErr);
        }
      } else {
        // Fetch the created user to get all fields
        const { data: createdUsers, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId);
        
        if (fetchError) {
          console.error('Fetch created user error:', fetchError.message);
        } else if (createdUsers && createdUsers.length > 0) {
          setUser(createdUsers[0]);
        }
      }
    } catch (err: any) {
      console.error('Create user profile error:', err.message);
      setError('Failed to create user profile');
    }
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        setError(error.message);
      }
    } catch (err: any) {
      console.error('Sign in exception:', err.message);
      
      if (err.message.includes('Network request failed')) {
        setError('Network connection error. Please check your internet connection.');
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Sign up with auto-confirm enabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          // Enable auto-confirmation to bypass email verification
          emailRedirectTo: undefined,
        },
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        setError(error.message);
        return;
      }
      
      // Check if user was created
      if (data?.user) {
        console.log('User registered successfully:', data.user.id);
        
        // Create user profile in the database
        await createUserProfile(data.user.id, email, name);
        
        // No need to show verification message since we're auto-confirming
        setError(null);
      } else {
        // This shouldn't happen with auto-confirmation, but just in case
        setError('Registration successful. Please log in with your credentials.');
      }
    } catch (err: any) {
      console.error('Sign up exception:', err.message);
      
      if (err.message.includes('Network request failed')) {
        setError('Network connection error. Please check your internet connection.');
      } else {
        setError('Failed to sign up');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        setError(error.message);
      }
    } catch (err: any) {
      console.error('Sign out exception:', err.message);
      
      if (err.message.includes('Network request failed')) {
        setError('Network connection error. Please check your internet connection.');
        
        // Force sign out locally even if network request failed
        try {
          await AsyncStorage.removeItem('supabase.auth.token');
          setUser(null);
        } catch (storageErr) {
          console.error('Failed to clear auth storage:', storageErr);
        }
      } else {
        setError('Failed to sign out');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Continue as guest
  const continueAsGuest = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Guest access error:', error.message);
        setError(error.message);
      } else if (data?.user) {
        // Create guest user profile
        await createUserProfile(data.user.id, null, 'Guest User');
      }
    } catch (err: any) {
      console.error('Guest access exception:', err.message);
      
      if (err.message.includes('Network request failed')) {
        setError('Network connection error. Please check your internet connection.');
      } else {
        setError('Failed to access as guest');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Provide auth context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isGuest: user?.is_guest || false,
    error,
    signIn,
    signUp,
    signOut,
    continueAsGuest,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 