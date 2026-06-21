import React, { useState } from 'react';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { MotiView } from 'moti';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <YStack flex={1} backgroundColor={theme === 'dark' ? '#0A0A0A' : '#FAFAFA'} justifyContent="center" alignItems="center" padding="$4">
      
      <MotiView
        from={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1000 }}
        style={{
          position: 'absolute', width: 500, height: 500, borderRadius: 250,
          backgroundColor: theme === 'dark' ? 'rgba(218, 41, 28, 0.15)' : 'rgba(255, 182, 193, 0.3)',
          top: '-20%', right: '-20%'
        }}
      />

      <YStack zIndex={1} width="100%" alignItems="center">
        <MotiView from={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}>
          <GlassCard width={340} padding="$6" alignItems="center" gap="$5">
            
            <YStack gap="$2" alignItems="center" marginBottom="$2">
              <Text fontSize={32} fontWeight="800" color={theme === 'dark' ? '#FFFFFF' : '#111111'}>
                Welcome Back
              </Text>
              <Text fontSize={15} color={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}>
                Sign in to your wealth dashboard
              </Text>
            </YStack>

            <YStack width="100%" gap="$4">
              <Input
                placeholder="Access ID"
                placeholderTextColor={(theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)') as any}
                value={username}
                onChangeText={setUsername}
                size="$5"
                backgroundColor={theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)'}
                borderColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                color={theme === 'dark' ? '#FFF' : '#000'}
                borderRadius={12}
                borderWidth={1}
                focusStyle={{ borderColor: '#DA291C' }}
              />
              <Input
                placeholder="PIN"
                placeholderTextColor={(theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)') as any}
                value={pin}
                onChangeText={setPin}
                secureTextEntry
                size="$5"
                backgroundColor={theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)'}
                borderColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                color={theme === 'dark' ? '#FFF' : '#000'}
                borderRadius={12}
                borderWidth={1}
                focusStyle={{ borderColor: '#DA291C' }}
              />
            </YStack>

            <Button 
              width="100%"
              size="$5" 
              backgroundColor="#DA291C" 
              color="white" 
              borderRadius={12} 
              marginTop="$2"
              fontWeight="bold"
              fontSize={16}
              onPress={handleLogin}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
            >
              Sign In
            </Button>

            <XStack alignItems="center" gap="$4" width="100%" marginVertical="$2">
              <YStack flex={1} height={1} backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <Text fontSize={12} color={theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}>OR</Text>
              <YStack flex={1} height={1} backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
            </XStack>

            <YStack alignItems="center" gap="$2">
              <Button
                circular
                width={70}
                height={70}
                backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}
                borderColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                borderWidth={1}
                onPress={handleLogin}
                pressStyle={{ scale: 0.95 }}
              >
                <FontAwesome5 name="fingerprint" size={32} color="#DA291C" />
              </Button>
              <Text fontSize={12} color={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}>
                Tap to use Biometrics
              </Text>
            </YStack>

          </GlassCard>
        </MotiView>
      </YStack>
    </YStack>
  );
}
