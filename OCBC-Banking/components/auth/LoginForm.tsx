import React, { useState } from 'react';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <>
      <YStack gap="$2" alignItems="center" marginBottom="$2">
        <Text fontSize={32} fontWeight="800" color="#111111">
          Welcome Back
        </Text>
        <Text fontSize={15} color="rgba(0,0,0,0.5)">
          Sign in to your wealth dashboard
        </Text>
      </YStack>

      <YStack width="100%" gap="$4">
        <Input
          placeholder="Access ID"
          placeholderTextColor={"rgba(0,0,0,0.3)" as any}
          value={username}
          onChangeText={setUsername}
          size="$5"
          backgroundColor="rgba(255,255,255,0.7)"
          borderColor="rgba(0,0,0,0.1)"
          color="#000"
          borderRadius={12}
          borderWidth={1}
          focusStyle={{ borderColor: '#DA291C' }}
        />
        <Input
          placeholder="PIN"
          placeholderTextColor={"rgba(0,0,0,0.3)" as any}
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          size="$5"
          backgroundColor="rgba(255,255,255,0.7)"
          borderColor="rgba(0,0,0,0.1)"
          color="#000"
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
        <YStack flex={1} height={1} backgroundColor="rgba(0,0,0,0.1)" />
        <Text fontSize={12} color="rgba(0,0,0,0.4)">OR</Text>
        <YStack flex={1} height={1} backgroundColor="rgba(0,0,0,0.1)" />
      </XStack>

      <YStack alignItems="center" gap="$2">
        <Button
          circular
          width={70}
          height={70}
          backgroundColor="rgba(0,0,0,0.03)"
          borderColor="rgba(0,0,0,0.1)"
          borderWidth={1}
          onPress={handleLogin}
          pressStyle={{ scale: 0.95 }}
        >
          <FontAwesome5 name="fingerprint" size={32} color="#DA291C" />
        </Button>
        <Text fontSize={12} color="rgba(0,0,0,0.5)">
          Tap to use Biometrics
        </Text>
      </YStack>
    </>
  );
}
