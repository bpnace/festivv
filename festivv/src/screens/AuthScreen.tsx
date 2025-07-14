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

const AuthScreen = () => {
  // State for form inputs and UI
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Get authentication functions from the auth hook
  const { signIn, signUp, continueAsGuest, testConnection } = useAuth();

  // Clear messages when changing modes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
  }, [mode]);

  // Handle form submission based on current mode
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      let result;
      
      // Perform the appropriate authentication action based on mode
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Bitte E-Mail und Passwort eingeben');
        }
        
        result = await signIn(email, password);
        
        if (!result.success && result.error) {
          throw new Error(result.error);
        }
        
        setSuccessMessage('Anmeldung erfolgreich!');
        
      } else if (mode === 'register') {
        if (!email || !password || !username) {
          throw new Error('Bitte alle Felder ausfüllen');
        }
        
        result = await signUp(email, password, username);
        
        if (result.success) {
          if (result.error?.includes('confirmation link')) {
            setSuccessMessage('Registrierung erfolgreich! Bitte überprüfe deine E-Mail für einen Bestätigungslink.');
            // Clear form fields after successful registration
            setEmail('');
            setPassword('');
            setUsername('');
            // Switch to login mode after successful registration
            setTimeout(() => {
              setMode('login');
            }, 2000);
          } else {
            setSuccessMessage('Registrierung erfolgreich!');
          }
        } else if (result.error) {
          throw new Error(result.error);
        }
        
      } else if (mode === 'guest') {
        result = await continueAsGuest();
        
        if (!result.success && result.error) {
          throw new Error(result.error || 'Fehler beim Gast-Login');
        }
        
        setSuccessMessage('Gast-Zugang erfolgreich!');
      }
      
    } catch (err: any) {
      setError(err.message);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test Supabase connection
  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await testConnection();
      
      if (result.success) {
        setSuccessMessage(`Verbindung erfolgreich! URL: ${result.url}`);
      } else {
        setError(`Verbindungsfehler: ${result.message}`);
      }
    } catch (err: any) {
      setError(`Unerwarteter Fehler: ${err.message}`);
    } finally {
      setLoading(false);
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
            {error && (
              <View style={styles.messageContainer}>
                <Text style={styles.errorText}>{error}</Text>
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
                  editable={!loading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Passwort"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />
                
                {/* Guest access link below login form */}
                <TouchableOpacity 
                  style={styles.guestLink}
                  onPress={() => setMode('guest')}
                  disabled={loading}
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
                  editable={!loading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-Mail"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Passwort"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />
                
                {/* Guest access link below register form */}
                <TouchableOpacity 
                  style={styles.guestLink}
                  onPress={() => setMode('guest')}
                  disabled={loading}
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
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {mode === 'login' ? 'Anmelden' : mode === 'register' ? 'Registrieren' : 'Als Gast fortfahren'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Test connection button */}
            <TouchableOpacity 
              style={styles.testButton} 
              onPress={handleTestConnection}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>Verbindung testen</Text>
            </TouchableOpacity>
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
  testButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#6366F1',
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