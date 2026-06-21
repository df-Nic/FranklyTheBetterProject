import React from 'react';
import { YStack, Text } from 'tamagui';
import { useTheme } from '../../hooks/ThemeContext';
import { GlassCard } from '../../components/GlassCard';

export default function PlanPage() {
  const { theme } = useTheme();

  return (
    <YStack flex={1} backgroundColor={theme === 'dark' ? '#121212' : '#F5F5F7'} justifyContent="center" alignItems="center" padding="$4">
      <GlassCard width="100%" maxWidth={400} padding="$6" alignItems="center">
        <Text fontSize={24} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'}>
          Plan Dashboard
        </Text>
      </GlassCard>
    </YStack>
  );
}
