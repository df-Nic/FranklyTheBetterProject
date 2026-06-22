import React, { forwardRef } from 'react';
import { YStack, YStackProps } from 'tamagui';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

interface GlassCardProps extends YStackProps {
  children: React.ReactNode;
  intensity?: number;
}

export const GlassCard = forwardRef<any, GlassCardProps>(({ children, intensity = 50, ...props }, ref) => {
  const backgroundColor = 'rgba(255, 255, 255, 0.6)';
  const borderColor = 'rgba(255, 255, 255, 0.8)';

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
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </YStack>
  );
});
