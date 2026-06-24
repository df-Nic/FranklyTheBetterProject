import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { TierProgressRing } from '../../components/wealth/TierProgressRing';
import { useWealth } from '../../components/wealth/WealthContext';
import { TIER_CONFIG, CURRENT_AUM } from '../../components/wealth/mockData';

const ACTION_CARDS = [
  { id: 'grow', label: 'Grow Wealth', icon: 'trending-up', active: true, description: 'Invest and grow your AUM' },
  { id: 'protect', label: 'Protect', icon: 'shield', active: false, description: 'Insurance & coverage' },
  { id: 'save', label: 'Save', icon: 'dollar-sign', active: false, description: 'High-yield deposits' },
  { id: 'plan', label: 'Plan', icon: 'calendar', active: false, description: 'Estate & retirement' },
];

export default function TierDashboardScreen() {
  const router = useRouter();
  const { state } = useWealth();

  const currentTier = TIER_CONFIG.find(t => t.id === 'basic')!;
  const targetTier = TIER_CONFIG.find(t => t.id === 'premier')!;
  const progress = CURRENT_AUM / targetTier.minAUM;
  const amountLeft = targetTier.minAUM - CURRENT_AUM;

  const handleGrowWealthPress = () => {
    if (state.hasCompletedOnboarding) {
      router.push('/wealth/product-selection');
    } else {
      router.push('/wealth/onboarding');
    }
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

        {/* Tier Progress Hero */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
          <GlassCard padding="$6" marginBottom="$5" alignItems="center">
            <Text fontSize={13} fontWeight="600" color="rgba(0,0,0,0.5)" marginBottom="$4" letterSpacing={0.5}>
              YOUR BANKING TIER JOURNEY
            </Text>

            <TierProgressRing
              progress={progress}
              size={180}
              currentLabel={currentTier.name}
              targetLabel={targetTier.name}
              amountLeft={`SGD ${amountLeft.toLocaleString()}`}
            />

            <YStack marginTop="$5" alignItems="center" gap="$1">
              <Text fontSize={14} color="rgba(0,0,0,0.5)">
                Current AUM
              </Text>
              <Text fontSize={28} fontWeight="900" color="black">
                SGD {CURRENT_AUM.toLocaleString()}
              </Text>
              <XStack alignItems="center" gap="$2" marginTop="$2" backgroundColor="rgba(218,41,28,0.08)" paddingHorizontal="$4" paddingVertical="$2" borderRadius={20}>
                <Feather name="target" size={14} color="#DA291C" />
                <Text fontSize={13} color="#DA291C" fontWeight="600">
                  SGD {amountLeft.toLocaleString()} more to {targetTier.name}
                </Text>
              </XStack>
            </YStack>
          </GlassCard>
        </MotiView>

        {/* Premier Benefits Preview */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <Text fontSize={16} fontWeight="700" color="black" marginBottom="$3">
            Unlock with Premier Banking
          </Text>
          <XStack gap="$3" marginBottom="$5" flexWrap="wrap">
            {targetTier.benefits.map((benefit, i) => (
              <MotiView key={i} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 250 + i * 50 }}>
                <XStack
                  backgroundColor="rgba(218,41,28,0.06)"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius={20}
                  alignItems="center"
                  gap="$2"
                >
                  <Feather name="check-circle" size={13} color="#DA291C" />
                  <Text fontSize={12} color="#DA291C" fontWeight="500">{benefit}</Text>
                </XStack>
              </MotiView>
            ))}
          </XStack>
        </MotiView>

        {/* Action Cards */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <Text fontSize={16} fontWeight="700" color="black" marginBottom="$3">
            How would you like to grow?
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            {ACTION_CARDS.map((card, i) => (
              <MotiView
                key={card.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 350 + i * 60, type: 'spring' }}
                style={{ width: '47%' }}
              >
                <GlassCard
                  padding="$4"
                  borderColor={card.active ? 'rgba(218,41,28,0.3)' : 'rgba(255,255,255,0.8)'}
                  backgroundColor={card.active ? 'rgba(218,41,28,0.05)' : 'rgba(255,255,255,0.6)'}
                  opacity={card.active ? 1 : 0.5}
                >
                  <YStack gap="$2">
                    <YStack
                      width={40} height={40}
                      borderRadius={12}
                      backgroundColor={card.active ? 'rgba(218,41,28,0.12)' : 'rgba(0,0,0,0.05)'}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Feather name={card.icon as any} size={20} color={card.active ? '#DA291C' : '#999'} />
                    </YStack>
                    <Text fontSize={14} fontWeight="700" color={card.active ? 'black' : '#999'}>
                      {card.label}
                    </Text>
                    <Text fontSize={11} color={card.active ? 'rgba(0,0,0,0.5)' : '#bbb'}>
                      {card.active ? card.description : 'Coming soon'}
                    </Text>
                  </YStack>
                </GlassCard>
              </MotiView>
            ))}
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
