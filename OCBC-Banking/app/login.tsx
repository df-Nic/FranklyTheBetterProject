import React from 'react';
import { YStack } from 'tamagui';
import { GlassCard } from '../components/GlassCard';
import { BackgroundOrb } from '../components/BackgroundOrb';
import { MotiView } from 'moti';
import { LoginForm } from '../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <YStack flex={1} backgroundColor="#FAFAFA" justifyContent="center" alignItems="center" padding="$4">
      
      <BackgroundOrb
        radii={{ tl: 260, tr: 240, br: 280, bl: 220 }}
        top="-20%" right="-20%"
      />

      <YStack zIndex={1} width="100%" alignItems="center">
        <MotiView from={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'timing', duration: 800 }}>
          <GlassCard width={340} padding="$6" alignItems="center" gap="$5">
            <LoginForm />
          </GlassCard>
        </MotiView>
      </YStack>
    </YStack>
  );
}
