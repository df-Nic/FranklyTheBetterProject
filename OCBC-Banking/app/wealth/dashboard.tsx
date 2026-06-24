import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { Easing } from 'react-native-reanimated';
import { useWealth } from '../../components/wealth/WealthContext';
import {
  CURRENT_AUM,
  TIER_CONFIG,
  WEALTH_PRODUCTS,
  GROWTH_RATE,
  MOCK_FUNDS,
} from '../../components/wealth/mockData';

const MOCK_HOLDINGS = [
  { label: 'Unit Trust', value: 85000, change: '+7.4%', icon: 'pie-chart', positive: true },
  { label: 'Fixed Deposit', value: 50000, change: '+3.1%', icon: 'dollar-sign', positive: true },
  { label: 'Savings Account', value: 13000, change: '+0.4%', icon: 'credit-card', positive: true },
];

const AI_NUDGE = {
  headline: 'You\'re making great progress!',
  body: 'Adding SGD 500/month in regular investments could unlock Premier Banking 18 months earlier.',
  icon: 'trending-up',
};

export default function DashboardScreen() {
  const router = useRouter();
  const { state } = useWealth();

  const riskProfile = state.userProfile.riskProfile ?? 'Balanced';
  const investmentAmount = state.investmentAmount ?? 10000;
  const selectedProduct = WEALTH_PRODUCTS.find(p => p.id === state.selectedProduct);
  const selectedFund = state.selectedFund;

  const newAUM = CURRENT_AUM + investmentAmount;
  const targetAUM = TIER_CONFIG.find(t => t.id === 'premier')!.minAUM;
  const progress = Math.min(newAUM / targetAUM, 1);
  const amountLeft = Math.max(targetAUM - newAUM, 0);

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <BackgroundOrb size={400} color="rgba(218,41,28,0.07)" top="-10%" right="-20%" fromOpacity={0.4} toOpacity={0.9} />
      <BackgroundOrb size={280} color="rgba(255,220,180,0.25)" bottom="5%" left="-10%" fromOpacity={0.3} toOpacity={0.6} />

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
          <Button circular size="$3" backgroundColor="rgba(0,0,0,0.05)" onPress={() => router.back()} pressStyle={{ opacity: 0.7 }}>
            <Feather name="arrow-left" size={18} color="black" />
          </Button>
          <Text fontSize={17} fontWeight="700" color="black">Wealth Dashboard</Text>
          <YStack width={36} />
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 100 }}>

        {/* Investment Summary Widget */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
          <GlassCard padding={0} marginBottom="$6" borderColor="rgba(218,41,28,0.2)" overflow="hidden" position="relative">
            {/* Wave Background Fill */}
            <MotiView
              from={{ translateY: 150 }}
              animate={{ translateY: 150 - (150 * progress) }}
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

            <YStack padding="$5" zIndex={10}>
              <XStack justifyContent="space-between" alignItems="flex-start">
                <YStack gap="$1">
                  <Text fontSize={14} fontWeight="700" color="rgba(0,0,0,0.5)">TOTAL INVESTMENTS</Text>
                  <Text fontSize={32} fontWeight="900" color="black">
                    SGD {newAUM.toLocaleString()}
                  </Text>
                </YStack>
                <YStack backgroundColor="rgba(76,175,80,0.1)" padding="$2" borderRadius={12}>
                  <Feather name="trending-up" size={20} color="#4CAF50" />
                </YStack>
              </XStack>
              
              <XStack gap="$5" marginTop="$2" paddingTop="$3" borderTopWidth={1} borderColor="rgba(0,0,0,0.05)">
                <YStack>
                  <Text fontSize={12} color="rgba(0,0,0,0.5)" marginBottom={2}>Total Profit / Loss</Text>
                  <Text fontSize={16} fontWeight="800" color="#4CAF50">+ SGD 8,450.00</Text>
                </YStack>
                <YStack>
                  <Text fontSize={12} color="rgba(0,0,0,0.5)" marginBottom={2}>All-Time Returns</Text>
                  <Text fontSize={16} fontWeight="800" color="#4CAF50">+ 6.41%</Text>
                </YStack>
              </XStack>
            </YStack>
          </GlassCard>
        </MotiView>

        {/* Holdings */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <Text fontSize={18} fontWeight="800" color="black" marginBottom="$3">Your Holdings</Text>

          {/* Latest investment */}
          {selectedFund && (
            <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 350, type: 'spring' }}>
              <YStack position="relative">
                <YStack position="absolute" top={-10} right={16} backgroundColor="#DA291C" paddingHorizontal={8} paddingVertical={4} borderRadius={8} zIndex={10} shadowColor="#DA291C" shadowOpacity={0.4} shadowRadius={6} elevation={4}>
                  <Text fontSize={10} fontWeight="800" color="white" letterSpacing={1}>NEW</Text>
                </YStack>
                <GlassCard padding="$4" marginBottom="$3" borderColor="rgba(218,41,28,0.3)">
                  <XStack justifyContent="space-between" alignItems="center">
                    <XStack gap="$3" alignItems="center" flex={1}>
                      <YStack backgroundColor="rgba(218,41,28,0.1)" padding="$3" borderRadius={12}>
                        <Feather name="pie-chart" size={18} color="#DA291C" />
                      </YStack>
                      <YStack flex={1}>
                        <XStack gap="$2" alignItems="center" marginBottom={2}>
                          <Text fontSize={14} fontWeight="800" color="black" flexShrink={1} numberOfLines={2}>
                            {selectedFund.name}
                          </Text>
                        </XStack>
                        <Text fontSize={12} color="rgba(0,0,0,0.5)">{selectedFund.assetClass}</Text>
                      </YStack>
                    </XStack>
                    <YStack alignItems="flex-end">
                      <Text fontSize={16} fontWeight="900" color="black">SGD {(investmentAmount).toLocaleString()}</Text>
                      <Text fontSize={12} color="#4CAF50" fontWeight="600">{selectedFund.ytd} YTD</Text>
                    </YStack>
                  </XStack>
                </GlassCard>
              </YStack>
            </MotiView>
          )}

          {/* Existing mock holdings */}
          <YStack gap="$3">
            {MOCK_HOLDINGS.map((holding, i) => (
              <MotiView
                key={holding.label}
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 380 + i * 80 }}
              >
                <GlassCard padding="$4">
                  <XStack justifyContent="space-between" alignItems="center">
                    <XStack gap="$3" alignItems="center">
                      <YStack backgroundColor="rgba(0,0,0,0.05)" padding="$3" borderRadius={12}>
                        <Feather name={holding.icon as any} size={18} color="#555" />
                      </YStack>
                      <YStack>
                        <Text fontSize={14} fontWeight="700" color="black">{holding.label}</Text>
                        <Text fontSize={12} color="rgba(0,0,0,0.45)">Existing holding</Text>
                      </YStack>
                    </XStack>
                    <YStack alignItems="flex-end">
                      <Text fontSize={16} fontWeight="900" color="black">SGD {holding.value.toLocaleString()}</Text>
                      <Text fontSize={12} color={holding.positive ? '#4CAF50' : '#DA291C'} fontWeight="600">
                        {holding.change}
                      </Text>
                    </YStack>
                  </XStack>
                </GlassCard>
              </MotiView>
            ))}
          </YStack>
        </MotiView>

        {/* Explore More */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 600 }}>
          <Button
            marginTop="$6"
            size="$5"
            backgroundColor="rgba(0,0,0,0.05)"
            color="black"
            borderRadius={16}
            height={56}
            fontWeight="700"
            fontSize={15}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => router.push('/wealth/product-selection')}
            icon={<Feather name="plus" size={18} color="black" />}
          >
            Explore More Products
          </Button>
        </MotiView>

        {/* Prototype Disclaimer */}
        <Text fontSize={11} color="rgba(0,0,0,0.3)" textAlign="center" marginTop="$4" lineHeight={16}>
          Prototype for demonstration only. Not financial advice. No real transactions are made.
        </Text>
      </ScrollView>

      {/* Mock Footer Nav to Exit Flow */}
      <XStack
        position="absolute"
        bottom={30}
        left={20}
        right={20}
        height={70}
        borderRadius={35}
        overflow="hidden"
        borderWidth={1}
        borderColor="rgba(255,255,255,0.8)"
        backgroundColor="rgba(255,255,255,0.7)"
        elevation={10}
        shadowColor="#000"
        shadowRadius={20}
        shadowOpacity={0.1}
        zIndex={100}
      >
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <XStack flex={1} alignItems="center" justifyContent="space-around" paddingHorizontal="$2">
          {[
            { name: 'Home', icon: 'home', route: '/' },
            { name: 'Plan', icon: 'trending-up', route: '/plan' },
            { name: 'Pay & Transfer', icon: 'repeat', route: '/pay' },
            { name: 'Rewards', icon: 'gift', route: '/rewards' },
            { name: 'More', icon: 'more-horizontal', route: '/more', active: true },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                if (!tab.active) {
                  router.dismissAll();
                  router.replace(tab.route as any);
                }
              }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
            >
              <YStack alignItems="center" gap="$1">
                <Feather name={tab.icon as any} size={20} color={tab.active ? '#DA291C' : 'rgba(0,0,0,0.5)'} />
                <Text fontSize={10} fontWeight={tab.active ? 'bold' : 'normal'} color={tab.active ? '#DA291C' : 'rgba(0,0,0,0.5)'}>
                  {tab.name}
                </Text>
              </YStack>
            </TouchableOpacity>
          ))}
        </XStack>
      </XStack>
    </YStack>
  );
}
