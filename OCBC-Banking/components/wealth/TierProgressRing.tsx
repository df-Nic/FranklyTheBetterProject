import React from 'react';
import { Easing } from 'react-native-reanimated';
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
        {/* Progress fill — dynamic water wave effect */}
        <MotiView
          from={{ translateY: size }}
          animate={{ translateY: size - (size * (pct / 100)) }}
          transition={{ type: 'timing', duration: 1500, delay: 100 }}
          style={{
            position: 'absolute',
            top: 0,
            left: -size / 2,
            width: size * 2,
            height: size * 2,
          }}
        >
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
              type: 'timing',
              duration: 6000,
              loop: true,
              repeatReverse: false,
              easing: Easing.linear,
            }}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(218,41,28,0.22)',
              borderRadius: size * 0.85,
            }}
          />
        </MotiView>

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
