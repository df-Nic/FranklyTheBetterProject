import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { GlassCard } from '../GlassCard';

export function WealthPortfolio() {
  return (
    <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 300 }}>
      <Text fontSize={18} fontWeight="bold" color="black" marginBottom="$4">
        Wealth Portfolio
      </Text>

      <XStack gap="$4" marginBottom="$4">
        {/* Investments (Large Square) */}
        <GlassCard flex={1} height={200} padding="$4" justifyContent="space-between">
          <YStack>
            <Feather name="pie-chart" size={24} color="#DA291C" />
            <Text fontSize={14} color="rgba(0,0,0,0.6)" marginTop="$2">
              Investments
            </Text>
          </YStack>
          <YStack>
            <Text fontSize={24} fontWeight="bold" color="black">
              $1,800,000
            </Text>
            <Text fontSize={12} color="#4CAF50">+12% YTD</Text>
          </YStack>
        </GlassCard>

        {/* Cash & Fixed Deposits (Two smaller rectangles) */}
        <YStack flex={1} gap="$4">
          <GlassCard flex={1} padding="$4" justifyContent="center">
            <Text fontSize={12} color="rgba(0,0,0,0.6)">
              Cash
            </Text>
            <Text fontSize={18} fontWeight="bold" color="black">
              $150,890
            </Text>
          </GlassCard>
          <GlassCard flex={1} padding="$4" justifyContent="center">
            <Text fontSize={12} color="rgba(0,0,0,0.6)">
              Fixed Deposits
            </Text>
            <Text fontSize={18} fontWeight="bold" color="black">
              $500,000
            </Text>
          </GlassCard>
        </YStack>
      </XStack>
    </MotiView>
  );
}
