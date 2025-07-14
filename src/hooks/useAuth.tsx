import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase';
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
            .eq('id', session.user.id)
            .single();
          
          if (userError && !userError.message.includes('No rows found')) {
            console.error('User data error:', userError.message);
            setError('Failed to get user data');
          } else if (userData) {
            setUser(userData);
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
            .eq('id', session.user.id)
            .single();
          
          if (userError && !userError.message.includes('No rows found')) {
            console.error('User data error:', userError.message);
            setError('Failed to get user data');
          } else if (userData) {
            setUser(userData);
          } else {
            // Create user profile if it doesn't exist
            const newUser: Omit<User, 'created_at' | 'updated_at'> = {
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'Guest User',
              email: session.user.email,
              is_guest: !session.user.email,
              avatar_url: null,
            };
            
            const { data: createdUser, error: createError } = await supabase
              .from('users')
              .insert([newUser])
              .select()
              .single();
            
            if (createError) {
              console.error('Create user error:', createError.message);
              setError('Failed to create user profile');
            } else if (createdUser) {
              setUser(createdUser);
            }
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        setError(error.message);
      } else {
        // Success message for email confirmation
        setError('Please check your email for verification link');
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
      const { error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Guest access error:', error.message);
        setError(error.message);
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