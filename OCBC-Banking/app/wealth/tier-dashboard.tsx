import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { Easing } from 'react-native-reanimated';
import { useWealth } from '../../components/wealth/WealthContext';
import { TIER_CONFIG, CURRENT_AUM } from '../../components/wealth/mockData';

const ACTION_CARDS = [
  { id: 'grow', label: 'Grow Wealth', icon: 'trending-up', description: 'Invest and grow your AUM' },
  { id: 'protect', label: 'Protect', icon: 'shield', description: 'Insurance & coverage' },
  { id: 'save', label: 'Save', icon: 'dollar-sign', description: 'High-yield deposits' },
  { id: 'plan', label: 'Plan', icon: 'calendar', description: 'Estate & retirement' },
];

export default function TierDashboardScreen() {
  const router = useRouter();
  const { state } = useWealth();
  const [selectedCardId, setSelectedCardId] = useState('grow');

  const currentTier = TIER_CONFIG.find(t => t.id === 'basic')!;
  const targetTier = TIER_CONFIG.find(t => t.id === 'premier')!;
  const progress = CURRENT_AUM / targetTier.minAUM;
  const amountLeft = targetTier.minAUM - CURRENT_AUM;

  const handleGrowWealthPress = () => {
    router.push('/wealth/onboarding');
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <BackgroundOrb size={400} color="rgba(218, 41, 28, 0.08)" top="-10%" right="-20%" fromOpacity={0.5} toOpacity={1} />
      <BackgroundOrb size={300} color="rgba(255, 228, 181, 0.3)" bottom="10%" left="-15%" fromOpacity={0.3} toOpacity={0.6} />

      {/* Header */}
      <YStack position="absolute" top={0} left={0} right={0} zIndex={100}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <XStack
          paddingHorizontal={24}
          paddingTop={60}
          paddingBottom={16}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          <Button
            circular
            size="$3"
            backgroundColor="rgba(0,0,0,0.05)"
            onPress={() => router.back()}
            pressStyle={{ opacity: 0.7 }}
          >
            <Feather name="arrow-left" size={18} color="black" />
          </Button>
          <Text fontSize={17} fontWeight="700" color="black">
            Wealth Progression
          </Text>
          <YStack width={36} />
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 100 }}>

        {/* AUM Wave Card */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
          <GlassCard padding={0} marginBottom="$6" overflow="hidden" position="relative" height={180} justifyContent="center" alignItems="center">
            
            {/* Wave Background Fill */}
            <MotiView
              from={{ translateY: 180 }}
              animate={{ translateY: 180 - (180 * progress) }}
              transition={{ type: 'timing', duration: 1500, delay: 100 }}
              style={{
                position: 'absolute',
                top: 0,
                left: -425, // Center a very large squircle for a gentle wave
                width: 1200,
                height: 1200,
              }}
            >
              <MotiView
                from={{ rotate: '0deg' }}
                animate={{ rotate: '360deg' }}
                transition={{
                  type: 'timing',
                  duration: 8000,
                  loop: true,
                  repeatReverse: false,
                  easing: Easing.linear,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(218,41,28,0.12)',
                  borderRadius: 560,
                }}
              />
            </MotiView>

            {/* Foreground Content */}
            <YStack alignItems="center" zIndex={10}>
              <Text fontSize={13} fontWeight="700" color="rgba(0,0,0,0.5)" letterSpacing={1} marginBottom="$2">
                YOUR TOTAL AUM
              </Text>
              <Text fontSize={36} fontWeight="900" color="black">
                SGD {CURRENT_AUM.toLocaleString()}
              </Text>
            </YStack>
          </GlassCard>
        </MotiView>

        {/* Action Cards */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <Text fontSize={16} fontWeight="700" color="black" marginBottom="$3">
            How would you like to grow?
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            {ACTION_CARDS.map((card, i) => {
              const isActive = selectedCardId === card.id;
              return (
              <MotiView
                key={card.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 350 + i * 60, type: 'spring' }}
                style={{ width: '47%' }}
              >
                <TouchableOpacity onPress={() => setSelectedCardId(card.id)} activeOpacity={0.8}>
                  <GlassCard
                    padding="$4"
                    borderColor={isActive ? 'rgba(218,41,28,0.3)' : 'rgba(255,255,255,0.8)'}
                    backgroundColor={isActive ? 'rgba(218,41,28,0.05)' : 'rgba(255,255,255,0.6)'}
                    opacity={isActive ? 1 : 0.6}
                  >
                    <YStack gap="$2">
                      <YStack
                        width={40} height={40}
                        borderRadius={12}
                        backgroundColor={isActive ? 'rgba(218,41,28,0.12)' : 'rgba(0,0,0,0.05)'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Feather name={card.icon as any} size={20} color={isActive ? '#DA291C' : '#888'} />
                      </YStack>
                      <Text fontSize={14} fontWeight="700" color={isActive ? 'black' : '#666'}>
                        {card.label}
                      </Text>
                      <Text fontSize={11} color={isActive ? 'rgba(0,0,0,0.5)' : '#999'}>
                        {card.description}
                      </Text>
                    </YStack>
                  </GlassCard>
                </TouchableOpacity>
              </MotiView>
            )})}
          </XStack>
        </MotiView>

        {/* CTA */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 500 }}>
          <Button
            marginTop="$6"
            size="$5"
            backgroundColor="#DA291C"
            color="white"
            borderRadius={16}
            height={60}
            fontWeight="bold"
            fontSize={16}
            elevation={6}
            shadowColor="#DA291C"
            shadowRadius={12}
            shadowOpacity={0.3}
            pressStyle={{ opacity: 0.85, scale: 0.98 }}
            onPress={handleGrowWealthPress}
            icon={<Feather name="trending-up" size={20} color="white" />}
          >
            Start Investment Journey
          </Button>
        </MotiView>

        {/* Prototype Disclaimer */}
        <Text fontSize={11} color="rgba(0,0,0,0.3)" textAlign="center" marginTop="$4" lineHeight={16}>
          Prototype for demonstration only. Not financial advice. No real transactions are made.
        </Text>
      </ScrollView>
    </YStack>
  );
}
