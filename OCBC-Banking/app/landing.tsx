import React from 'react';
import { YStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { MotiView } from 'moti';

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <YStack flex={1} backgroundColor={theme === 'dark' ? '#0A0A0A' : '#FAFAFA'} justifyContent="center" alignItems="center" padding="$4">
      {/* Background Orb 1 */}
      <MotiView
        from={{ opacity: 0.3, scale: 0.8, translateY: -50 }}
        animate={{ opacity: 0.6, scale: 1.1, translateY: 50 }}
        transition={{ type: 'timing', duration: 4000, loop: true, repeatReverse: true }}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: 200,
          backgroundColor: theme === 'dark' ? 'rgba(218, 41, 28, 0.2)' : 'rgba(255, 182, 193, 0.5)',
          top: '-5%',
          left: '-20%',
        }}
      />
      {/* Background Orb 2 */}
      <MotiView
        from={{ opacity: 0.2, scale: 1, translateX: 50 }}
        animate={{ opacity: 0.5, scale: 0.9, translateX: -50 }}
        transition={{ type: 'timing', duration: 5000, loop: true, repeatReverse: true }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: theme === 'dark' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 228, 181, 0.4)',
          bottom: '10%',
          right: '-10%',
        }}
      />

      <YStack zIndex={1} alignItems="center" gap="$8" width="100%">
        <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ type: 'spring', damping: 12 }}>
          <Text fontSize={48} fontWeight="900" color={theme === 'dark' ? '#FFFFFF' : '#111111'} textAlign="center" letterSpacing={-1}>
            OCBC Wealth
          </Text>
        </MotiView>

        <MotiView from={{ translateY: 40, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 200, type: 'spring', damping: 14 }}>
          <GlassCard width="100%" maxWidth={380} padding="$6" gap="$4">
            <Text fontSize={26} fontWeight="700" color={theme === 'dark' ? '#FFFFFF' : '#111111'}>
              Elevate Your Future
            </Text>
            <Text fontSize={16} color={theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} lineHeight={24}>
              Experience a new standard of wealth management. Actionable AI-driven insights to grow your portfolio.
            </Text>
          </GlassCard>
        </MotiView>

        <MotiView from={{ translateY: 40, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 400, type: 'spring' }}>
          <Button 
            size="$5" 
            backgroundColor="#DA291C" 
            color="white" 
            borderRadius={30} 
            width={280}
            height={60}
            fontSize={18}
            fontWeight="bold"
            elevation={theme === 'dark' ? 10 : 5}
            shadowColor="#DA291C"
            shadowRadius={15}
            shadowOpacity={theme === 'dark' ? 0.4 : 0.2}
            onPress={() => router.push('/login')}
            pressStyle={{ opacity: 0.8, scale: 0.96 }}
          >
            Get Started
          </Button>
        </MotiView>
      </YStack>
    </YStack>
  );
}
