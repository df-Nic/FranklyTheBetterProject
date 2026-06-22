import React from 'react';
import { YStack, Text } from 'tamagui';
import { GlassCard } from '../../components/GlassCard';

export default function PlanPage() {
  return (
    <YStack flex={1} backgroundColor="#F5F5F7" justifyContent="center" alignItems="center" padding="$4">
      <GlassCard width="100%" maxWidth={400} padding="$6" alignItems="center">
        <Text fontSize={24} fontWeight="bold" color="black">
          Plan
        </Text>
      </GlassCard>
    </YStack>
  );
}
