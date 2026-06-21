import React, { forwardRef } from 'react';
import { YStack, YStackProps } from 'tamagui';
import { useTheme } from '../hooks/ThemeContext';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

interface GlassCardProps extends YStackProps {
  children: React.ReactNode;
  intensity?: number;
}

export const GlassCard = forwardRef<any, GlassCardProps>(({ children, intensity = 50, ...props }, ref) => {
  const { theme } = useTheme();
  
  const backgroundColor = theme === 'dark' 
    ? 'rgba(20, 20, 25, 0.4)' 
    : 'rgba(255, 255, 255, 0.6)';
    
  const borderColor = theme === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(255, 255, 255, 0.8)';

  return (
    <YStack
      ref={ref}
      borderRadius={20}
      overflow="hidden"
      borderWidth={1}
      borderColor={borderColor}
      backgroundColor={backgroundColor}
      {...props}
    >
      <BlurView 
        intensity={intensity} 
        tint={theme === 'dark' ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill} 
      />
      {children}
    </YStack>
  );
});
