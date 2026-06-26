import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { GlassCard } from '../GlassCard';
import { USER_TRAITS } from '../../constants/depositOwlData';

export function FinancialProfile() {
  return (
    <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 100 }}>
      <GlassCard padding="$5" marginBottom="$6" borderColor="rgba(218, 41, 28, 0.2)">
        <Text fontSize={16} fontWeight="bold" color="black" marginBottom="$1">
          Your Financial Profile
        </Text>
        <Text fontSize={13} color="rgba(0,0,0,0.6)" marginBottom="$3" lineHeight={18}>
          Based on your recent spending profile and behavior, Deposit Owl has identified you as:
        </Text>
        <XStack flexWrap="wrap" gap="$2">
          {USER_TRAITS.map((trait, index) => (
            <GlassCard key={index} paddingHorizontal="$3" paddingVertical="$1.5" borderRadius={20} backgroundColor={trait.bg} borderWidth={0}>
              <Text fontSize={12} fontWeight="700" color={trait.color}>
                {trait.label}
              </Text>
            </GlassCard>
          ))}
        </XStack>
      </GlassCard>
    </MotiView>
  );
}
