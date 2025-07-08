// User Types
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Home: undefined;
  Settings: undefined;
  Premium: undefined;
};

export type TabParamList = {
  Groups: undefined;
  Gallery: undefined;
  Camera: undefined;
  Friends: undefined;
  Profile: undefined;
}; 