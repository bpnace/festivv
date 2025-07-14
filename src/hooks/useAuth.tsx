import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '../services/supabase';
import { Alert } from 'react-native';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<{ success: boolean; error?: string }>;
  testConnection: () => Promise<{ success: boolean; message: string; url?: string; hasAnonKey: boolean }>;
  clearError: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and provides auth context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Effect for initializing auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have an active session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError.message);
          setError(`Session error: ${sessionError.message}`);
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);
          }
        );

        setInitialized(true);
        setLoading(false);

        // Clean up subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (err: any) {
        console.error('Unexpected error during auth initialization:', err.message);
        setError(`Auth initialization error: ${err.message}`);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        console.error('Sign in error:', signInError.message);
        return { success: false, error: signInError.message };
      }

      return { success: true };
    } catch (err: any) {
      const errorMsg = `Unexpected sign in error: ${err.message}`;
      setError(errorMsg);
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if username is provided
      if (!username.trim()) {
        setError('Username is required');
        return { success: false, error: 'Username is required' };
      }

      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        console.error('Sign up error:', signUpError.message);
        return { success: false, error: signUpError.message };
      }

      // Check if email confirmation is required
      if (data.user && !data.user.confirmed_at) {
        return { 
          success: true, 
          error: 'Please check your email for a confirmation link' 
        };
      }

      return { success: true };
    } catch (err: any) {
      const errorMsg = `Unexpected sign up error: ${err.message}`;
      setError(errorMsg);
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        setError(signOutError.message);
        console.error('Sign out error:', signOutError.message);
      }
    } catch (err: any) {
      const errorMsg = `Unexpected sign out error: ${err.message}`;
      setError(errorMsg);
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Continue as guest
  const continueAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use anonymous session instead of email-based guest account
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        let errorMessage = `Guest access error: ${error.message}`;
        
        // Provide more helpful message for common errors
        if (error.message === 'Anonymous sign-ins are disabled') {
          errorMessage = 'Anonymous sign-ins are currently disabled in your Supabase project. Please enable them in Supabase Dashboard > Authentication > Providers > Anonymous Sign-in.';
          
          // Log detailed instructions
          console.error('Guest access error:', error.message);
          console.log('\nTo enable anonymous sign-ins:');
          console.log('1. Go to your Supabase project dashboard');
          console.log('2. Navigate to Authentication > Providers');
          console.log('3. Enable "Anonymous Sign-in"');
          console.log('4. Save changes');
        } 
        else if (error.message.includes('Database error creating')) {
          errorMessage = 'Error creating guest user in database. Please ensure you have run the SQL setup script in simplified-security-fix.sql.';
          
          console.error('Guest access error:', error.message);
          console.log('\nMake sure:');
          console.log('1. You have run the SQL setup script');
          console.log('2. The users table exists and has the correct schema');
          console.log('3. The trigger for automatically creating users is set up');
        }
        
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (data.user) {
        console.log('Created anonymous guest session');
        return { success: true };
      }

      return { success: false, error: 'Failed to create guest session' };
    } catch (err: any) {
      const errorMsg = `Unexpected guest access error: ${err.message}`;
      setError(errorMsg);
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Test Supabase connection
  const testConnection = async () => {
    return await testSupabaseConnection();
  };

  // Clear any error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    session,
    loading,
    error,
    initialized,
    signIn,
    signUp,
    signOut,
    continueAsGuest,
    testConnection,
    clearError,
  };

  // Provide the auth context to children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth; 