import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';

export function HeroSection() {
  return (
    <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 100 }}>
      <YStack alignItems="center" marginBottom="$6">
        <Text fontSize={14} fontWeight="600" color="#DA291C" marginBottom="$2">
          TOTAL NET WORTH
        </Text>
        <Text fontSize={48} fontWeight="900" color="black" letterSpacing={-1}>
          $2,450,890
        </Text>
        <XStack alignItems="center" gap="$2" marginTop="$2">
          <Feather name="trending-up" size={16} color="#4CAF50" />
          <Text fontSize={14} color="#4CAF50" fontWeight="600">
            +2.4% this month
          </Text>
        </XStack>
      </YStack>
    </MotiView>
  );
}
