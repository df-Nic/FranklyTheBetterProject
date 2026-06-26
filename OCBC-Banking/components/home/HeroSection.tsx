import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../GlassCard';

export function HeroSection() {
  return (
    <MotiView
      from={{ translateY: 20, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ delay: 100 }}
    >
      <GlassCard
        marginBottom="$5"
        padding="$4"
        position="relative"
        overflow="hidden"
        borderColor="rgba(255, 255, 255, 0.7)"
      >
        {/* Subtle background glow/decoration representing coins and globe */}
        <YStack
          position="absolute"
          right="-10%"
          bottom="-20%"
          opacity={0.12}
          transform={[{ rotate: '-15deg' }]}
          alignItems="center"
          justifyContent="center"
        >
          <FontAwesome5 name="globe-asia" size={130} color="#DA291C" />
        </YStack>
        
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1.8} gap="$3">
            <XStack alignItems="center" gap="$1.5">
              <Text fontSize={15} fontWeight="600" color="black" lineHeight={22}>
                Trade across 15 global exchanges with access to SG, US & China markets
              </Text>
              <Feather name="chevron-right" size={16} color="black" style={{ marginTop: 2 }} />
            </XStack>
            
            <Text
              fontSize={13}
              color="#0a7ea4"
              fontWeight="600"
              pressStyle={{ opacity: 0.7 }}
            >
              Important Information
            </Text>
          </YStack>

          {/* Visual section on right: Globe + Golden Coins */}
          <XStack flex={1} justifyContent="flex-end" alignItems="center" height="100%" paddingTop="$1">
            <YStack position="relative" width={60} height={60} justifyContent="center" alignItems="center">
              {/* Globe Icon */}
              <Feather name="globe" size={36} color="rgba(0, 0, 0, 0.6)" />
              {/* Overlapping Gold Coins representation */}
              <YStack
                position="absolute"
                bottom={0}
                right={0}
                backgroundColor="#FFD54F"
                width={20}
                height={20}
                borderRadius={10}
                borderWidth={1}
                borderColor="white"
                alignItems="center"
                justifyContent="center"
                elevation={2}
              >
                <FontAwesome5 name="coins" size={10} color="#F57F17" />
              </YStack>
            </YStack>
          </XStack>
        </XStack>
      </GlassCard>
    </MotiView>
  );
}
