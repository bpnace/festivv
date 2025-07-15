import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../hooks/useAuth';

// Define the possible authentication modes
type AuthMode = 'login' | 'register' | 'guest';

// Suppress WebCrypto API warning in development
if (__DEV__) {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    if (args[0] && typeof args[0] === 'string' && 
        args[0].includes('WebCrypto API is not supported')) {
      return;
    }
    originalConsoleWarn(...args);
  };
}

const AuthScreen = () => {
  // State for form inputs and UI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get authentication functions from the auth hook
  const { signIn, signUp, continueAsGuest, isLoading, error, isAuthenticated } = useAuth();

  // Clear messages when changing modes
  useEffect(() => {
    setLocalError(null);
    setSuccessMessage(null);
  }, [mode]);

  // Update local error state when auth error changes
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  // Show success message when authentication succeeds
  useEffect(() => {
    if (isAuthenticated) {
      if (mode === 'login') {
        setSuccessMessage('Anmeldung erfolgreich!');
      } else if (mode === 'register') {
        setSuccessMessage('Registrierung erfolgreich!');
      } else if (mode === 'guest') {
        setSuccessMessage('Gast-Zugang erfolgreich!');
      }
    }
  }, [isAuthenticated, mode]);

  // Handle form submission based on current mode
  const handleSubmit = async () => {
    setLocalLoading(true);
    setLocalError(null);
    setSuccessMessage(null);
    
    try {
      // Perform the appropriate authentication action based on mode
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Bitte E-Mail und Passwort eingeben');
        }
        
        await signIn(email, password);
        
      } else if (mode === 'register') {
        if (!email || !password || !username) {
          throw new Error('Bitte alle Felder ausfüllen');
        }
        
        // Call signUp and handle any errors
        await signUp(email, password, username);
        
        // Show success message immediately after registration
        setSuccessMessage('Registrierung erfolgreich! Sie werden angemeldet...');
        
        // Clear form fields after registration attempt
        setEmail('');
        setPassword('');
        setUsername('');
        
        // Switch to login mode after registration
        setTimeout(() => {
          setMode('login');
        }, 2000);
        
      } else if (mode === 'guest') {
        await continueAsGuest();
      }
      
    } catch (err: any) {
      setLocalError(err.message);
      console.error('Auth error:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Festival Foto-App</Text>
            
            {/* Mode selector tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, mode === 'login' && styles.activeTab]} 
                onPress={() => setMode('login')}
              >
                <Text style={styles.tabText}>Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tab, mode === 'register' && styles.activeTab]} 
                onPress={() => setMode('register')}
              >
                <Text style={styles.tabText}>Registrieren</Text>
              </TouchableOpacity>
            </View>
            
            {/* Error message */}
            {localError && (
              <View style={styles.messageContainer}>
                <Text style={styles.errorText}>{localError}</Text>
              </View>
            )}
            
            {/* Success message */}
            {successMessage && (
              <View style={styles.messageContainer}>
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            )}
            
            {/* Login form */}
            {mode === 'login' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="E-Mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading && !localLoading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Passwort"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading && !localLoading}
                />
                
                {/* Guest access link below login form */}
                <TouchableOpacity 
                  style={styles.guestLink}
                  onPress={() => setMode('guest')}
                  disabled={isLoading || localLoading}
                >
                  <Text style={styles.guestLinkText}>Als Gast fortfahren</Text>
                </TouchableOpacity>
              </>
            )}
            
            {/* Register form */}
            {mode === 'register' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Benutzername"
                  value={username}
                  onChangeText={setUsername}
                  editable={!isLoading && !localLoading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-Mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading && !localLoading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Passwort"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading && !localLoading}
                />
                
                {/* Guest access link below register form */}
                <TouchableOpacity 
                  style={styles.guestLink}
                  onPress={() => setMode('guest')}
                  disabled={isLoading || localLoading}
                >
                  <Text style={styles.guestLinkText}>Als Gast fortfahren</Text>
                </TouchableOpacity>
              </>
            )}
            
            {/* Guest form */}
            {mode === 'guest' && (
              <View style={styles.guestContainer}>
                <Text style={styles.guestText}>
                  Als Gast fortfahren (ohne Registrierung)
                </Text>
                <Text style={styles.guestSubText}>
                  Du erhältst einen temporären Zugang zur App. Einige Funktionen sind möglicherweise eingeschränkt.
                </Text>
              </View>
            )}
            
            {/* Submit button */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit}
              disabled={isLoading || localLoading}
            >
              {isLoading || localLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : 'Als Gast fortfahren'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Connection status */}
            <View style={styles.connectionStatus}>
              <Text style={styles.connectionStatusText}>
                {isAuthenticated ? 'Verbunden ✅' : 'Nicht verbunden'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontWeight: '500',
  },
  messageContainer: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  errorText: {
    color: '#e53e3e',
    textAlign: 'center',
  },
  successText: {
    color: '#38a169',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  guestContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  guestText: {
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 5,
  },
  guestSubText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
  },
  connectionStatus: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  connectionStatusText: {
    color: '#666',
  },
  guestLink: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  guestLinkText: {
    color: '#6366F1',
    textDecorationLine: 'underline',
  },
});

export default AuthScreen; 