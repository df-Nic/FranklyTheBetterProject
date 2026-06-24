import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { MotiView } from 'moti';

interface TierProgressRingProps {
  progress: number; // 0 to 1
  size?: number;
  currentLabel: string;
  targetLabel: string;
  amountLeft: string;
}

export function TierProgressRing({
  progress,
  size = 110,
  currentLabel,
  targetLabel,
  amountLeft,
}: TierProgressRingProps) {
  const pct = Math.min(Math.round(progress * 100), 100);

  return (
    <YStack alignItems="center" justifyContent="center" width={size}>
      {/* Circular-look using a bordered container */}
      <YStack
        width={size}
        height={size}
        borderRadius={size / 2}
        backgroundColor="rgba(218,41,28,0.06)"
        borderWidth={6}
        borderColor="rgba(218,41,28,0.15)"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        {/* Progress fill — bottom half fills upward */}
        <MotiView
          from={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ type: 'timing', duration: 1200, delay: 300 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(218,41,28,0.18)',
          }}
        />

        {/* Center text */}
        <YStack alignItems="center" zIndex={10}>
          <Text fontSize={size > 130 ? 22 : 18} fontWeight="900" color="#DA291C">
            {pct}%
          </Text>
          <Text fontSize={size > 130 ? 10 : 8} color="rgba(0,0,0,0.4)" fontWeight="600" textAlign="center">
            to {targetLabel}
          </Text>
        </YStack>
      </YStack>

      <Text fontSize={11} color="rgba(0,0,0,0.4)" fontWeight="600" textAlign="center" marginTop={6}>
        {currentLabel}
      </Text>
    </YStack>
  );
}
