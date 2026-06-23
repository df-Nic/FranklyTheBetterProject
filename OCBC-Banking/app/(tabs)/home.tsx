import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import { HeroSection } from '../../components/home/HeroSection';
import { ActionPills } from '../../components/home/ActionPills';
import { WealthPortfolio } from '../../components/home/WealthPortfolio';
import { SmartInsights } from '../../components/home/SmartInsights';
import { FloatingBot } from '../../components/home/FloatingBot';

export default function HomePage() {
  const router = useRouter();

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">

      {/* Dynamic Background Elements */}
      <BackgroundOrb
        size={500}
        color="rgba(255, 182, 193, 0.2)"
        top="-20%" right="-30%"
        fromOpacity={0.5}
        toOpacity={1}
      />

      {/* Persistent Glass Header */}
      <YStack
        position="absolute"
        top={0} left={0} right={0}
        zIndex={100}
      >
        <BlurView
          intensity={80}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <XStack
          paddingHorizontal={24}
          paddingTop={60}
          paddingBottom={16}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          <YStack>
            <Text fontSize={14} color="rgba(0,0,0,0.5)">
              Welcome back
            </Text>
            <Text fontSize={20} fontWeight="bold" color="black">
              Support Team 2!!
            </Text>
          </YStack>
          <XStack alignItems="center" gap="$3">
            <Button
              circular
              size="$3"
              backgroundColor="rgba(0,0,0,0.05)"
              onPress={() => router.replace('/login')}
              pressStyle={{ opacity: 0.7 }}
            >
              <Feather name="log-out" size={16} color="black" />
            </Button>
          </XStack>
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 100 }}>
        <HeroSection />
        <ActionPills />
        <WealthPortfolio />
        <SmartInsights />
      </ScrollView>

      <FloatingBot />

    </YStack>
  );
}
