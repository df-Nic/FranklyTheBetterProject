import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../GlassCard';

export function SmartInsights() {
  return (
    <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 400 }}>
      <Text fontSize={18} fontWeight="bold" color="black" marginBottom="$4" marginTop="$4">
        Smart Insights
      </Text>
      <GlassCard padding="$5" borderColor="rgba(218, 41, 28, 0.3)">
        <XStack gap="$4" alignItems="center">
          <YStack backgroundColor="rgba(218, 41, 28, 0.1)" padding="$3" borderRadius={20}>
            <FontAwesome5 name="lightbulb" size={24} color="#DA291C" />
          </YStack>
          <YStack flex={1}>
            <Text fontSize={16} fontWeight="bold" color="black" marginBottom="$1">
              Optimize Liquidity
            </Text>
            <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={20}>
              You have $10,000 idle cash. Move it to the High-Yield Vault to earn an extra $45/month.
            </Text>
          </YStack>
        </XStack>
      </GlassCard>
    </MotiView>
  );
}
