import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants';

interface ScreenHeaderProps {
  title: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  children?: ReactNode;
}

export default function ScreenHeader({ 
  title, 
  rightIcon, 
  onRightIconPress,
  children 
}: ScreenHeaderProps) {
  return (
    <LinearGradient
      colors={['#8B5CF6', '#6366F1', '#4F46E5']}
      style={styles.header}
    >
      <View style={styles.headerTitleRow}>
        <Text style={styles.headerTitle}>{title}</Text>
        
        {rightIcon && (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onRightIconPress}
          >
            <Ionicons name={rightIcon as any} size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: SPACING.lg,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 