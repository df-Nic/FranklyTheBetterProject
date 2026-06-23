import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { GlassCard } from '../GlassCard';

export function ActionPills() {
  return (
    <MotiView from={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 200, type: 'spring' }}>
      <GlassCard padding="$2" borderRadius={30} marginBottom="$8">
        <XStack justifyContent="space-between" paddingHorizontal="$4">
          {['Pay', 'Transfer', 'Scan'].map((action, i) => (
            <YStack key={action} alignItems="center" gap="$2" padding="$2">
              <Button circular size="$4" backgroundColor="rgba(0,0,0,0.05)">
                <Feather
                  name={action === 'Pay' ? 'send' : action === 'Transfer' ? 'repeat' : 'maximize'}
                  size={20}
                  color="black"
                />
              </Button>
              <Text fontSize={12} fontWeight="500" color="black">
                {action}
              </Text>
            </YStack>
          ))}
        </XStack>
      </GlassCard>
    </MotiView>
  );
}
