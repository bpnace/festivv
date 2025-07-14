import { Platform } from 'react-native';

// App Constants
export const APP_CONFIG = {
  NAME: 'Festivv',
  VERSION: '1.0.0',
  BUNDLE_ID: 'com.festivals.festivv',
  WEBSITE: 'https://festivv.app',
  SUPPORT_EMAIL: 'support@festivv.app',
  PRIVACY_POLICY: 'https://festivv.app/privacy',
  TERMS_OF_SERVICE: 'https://festivv.app/terms',
};

// Fonts
export const FONTS = {
  heading: 'Mansfield',
  body: 'Neue Power',
  system: Platform.OS === 'ios' ? 'System' : 'Roboto',
};

// Theme Colors - Modern and Colorful
export const COLORS = {
  // Primary Colors
  primary: '#6366F1', // Indigo
  primaryLight: '#8B5CF6', // Purple
  primaryDark: '#4F46E5', // Dark Indigo
  
  // Accent Colors
  accent: '#F59E0B', // Amber
  accentLight: '#FBD5AA',
  accentDark: '#D97706',
  
  // Festival Colors
  festival: '#EC4899', // Pink
  festivalLight: '#F9A8D4',
  festivalDark: '#DB2777',
  
  // Neutral Colors
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceVariant: '#F1F5F9',
  
  // Text Colors
  text: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  
  // Status Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Border and Dividers
  border: '#E2E8F0',
  divider: '#CBD5E1',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(255, 255, 255, 0.9)',
};

// Text Sizes
export const TEXT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  base: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 999,
};

// German Text Constants
export const GERMAN_TEXTS = {
  COMMON: {
    SAVE: 'Speichern',
    CANCEL: 'Abbrechen',
    DELETE: 'Löschen',
    EDIT: 'Bearbeiten',
    SHARE: 'Teilen',
    BACK: 'Zurück',
    NEXT: 'Weiter',
    LOADING: 'Laden...',
    ERROR: 'Fehler',
    SUCCESS: 'Erfolgreich',
    RETRY: 'Erneut versuchen',
    CONFIRM: 'Bestätigen',
    CLOSE: 'Schließen',
  },
  ONBOARDING: {
    WELCOME: 'Willkommen bei Festivv',
    SUBTITLE: 'Teile deine Festival-Momente mit deiner Gruppe',
    GET_STARTED: 'Loslegen',
    SKIP: 'Überspringen',
  },
  AUTH: {
    SIGN_IN: 'Anmelden',
    SIGN_UP: 'Registrieren',
    GUEST_ACCESS: 'Als Gast fortfahren',
    EMAIL: 'E-Mail',
    PASSWORD: 'Passwort',
    NAME: 'Name',
    FORGOT_PASSWORD: 'Passwort vergessen?',
  },
  GROUPS: {
    MY_GROUPS: 'Meine Gruppen',
    CREATE_GROUP: 'Gruppe erstellen',
    JOIN_GROUP: 'Gruppe beitreten',
    GROUP_NAME: 'Gruppenname',
    FESTIVAL_NAME: 'Festival-Name',
    INVITE_CODE: 'Einladungscode',
    SCAN_QR: 'QR-Code scannen',
    MEMBERS: 'Mitglieder',
    ADMIN: 'Admin',
  },
  GALLERY: {
    PHOTOS: 'Fotos',
    UPLOAD_PHOTO: 'Foto hochladen',
    TAKE_PHOTO: 'Foto aufnehmen',
    FROM_GALLERY: 'Aus Galerie',
    VISIBILITY: 'Sichtbarkeit',
    PRIVATE: 'Privat',
    GROUP: 'Gruppe',
    FESTIVAL: 'Festival',
    PUBLIC: 'Öffentlich',
    CAPTION: 'Beschreibung',
  },
  PREMIUM: {
    PREMIUM_FEATURES: 'Premium-Funktionen',
    UPGRADE: 'Upgrade auf Premium',
    COMING_SOON: 'Demnächst verfügbar',
    UNLIMITED_STORAGE: 'Unbegrenzter Speicher',
    ADVANCED_FILTERS: 'Erweiterte Filter',
    PRIORITY_SUPPORT: 'Prioritärer Support',
    CUSTOM_THEMES: 'Individuelle Themes',
    EXPORT_ALBUMS: 'Alben exportieren',
    HD_UPLOADS: 'HD-Uploads',
  },
  SETTINGS: {
    SETTINGS: 'Einstellungen',
    NOTIFICATIONS: 'Benachrichtigungen',
    PRIVACY: 'Datenschutz',
    ACCOUNT: 'Account',
    ABOUT: 'Über',
    LOGOUT: 'Abmelden',
    DELETE_ACCOUNT: 'Account löschen',
  },
}; 