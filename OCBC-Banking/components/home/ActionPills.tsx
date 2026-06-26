import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { MotiView } from 'moti';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../GlassCard';

export function ActionPills() {
  return (
    <MotiView
      from={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 200, type: 'spring' }}
    >
      <GlassCard padding="$3.5" borderRadius={24} marginBottom="$5" borderColor="rgba(255, 255, 255, 0.7)">
        <XStack justifyContent="space-between" alignItems="center">
          {/* PayNow Column */}
          <YStack flex={1} alignItems="center" gap="$2">
            <Button
              circular
              size="$4"
              backgroundColor="rgba(0,0,0,0.04)"
              pressStyle={{ opacity: 0.7, scale: 0.95 }}
            >
              <YStack alignItems="center" justifyContent="center">
                <Text fontSize={9} fontWeight="900" color="#DA291C" letterSpacing={0.2} lineHeight={10}>
                  PAY
                </Text>
                <Text fontSize={8} fontWeight="900" color="black" letterSpacing={0.2} lineHeight={9}>
                  NOW
                </Text>
              </YStack>
            </Button>
            <Text fontSize={12} fontWeight="600" color="black" textAlign="center">
              PayNow
            </Text>
          </YStack>

          {/* Scan & Pay Column */}
          <YStack flex={1} alignItems="center" gap="$2">
            <Button
              circular
              size="$4"
              backgroundColor="rgba(0,0,0,0.04)"
              pressStyle={{ opacity: 0.7, scale: 0.95 }}
            >
              <Feather name="maximize" size={18} color="black" />
            </Button>
            <Text fontSize={12} fontWeight="600" color="black" textAlign="center">
              Scan & Pay
            </Text>
          </YStack>

          {/* Foreign Exchange Column */}
          <YStack flex={1.2} alignItems="center" gap="$2">
            <Button
              circular
              size="$4"
              backgroundColor="rgba(0,0,0,0.04)"
              pressStyle={{ opacity: 0.7, scale: 0.95 }}
            >
              <MaterialCommunityIcons name="swap-horizontal-bold" size={20} color="black" />
            </Button>
            <Text fontSize={12} fontWeight="600" color="black" textAlign="center">
              Foreign Exchange
            </Text>
          </YStack>

          {/* Vertical Separator */}
          <YStack width={1} height={40} backgroundColor="rgba(0, 0, 0, 0.08)" marginHorizontal="$1" />

          {/* Customise Column */}
          <YStack flex={1} alignItems="center" gap="$2">
            <Button
              circular
              size="$4"
              backgroundColor="rgba(0,0,0,0.04)"
              pressStyle={{ opacity: 0.7, scale: 0.95 }}
            >
              <Feather name="settings" size={18} color="black" />
            </Button>
            <Text fontSize={12} fontWeight="600" color="black" textAlign="center">
              Customise
            </Text>
          </YStack>
        </XStack>
      </GlassCard>
    </MotiView>
  );
}
