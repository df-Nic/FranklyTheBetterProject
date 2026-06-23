import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { YStack, XStack, Text, Button } from 'tamagui';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

import { BackgroundOrb } from '../components/BackgroundOrb';
import { DonutChart } from '../components/smart-deposit/DonutChart';
import { GlassCard } from '../components/GlassCard';

export default function SmartDepositDetailsPage() {
  const router = useRouter();

  const balanceData = [
    { label: 'OCBC', value: 45000, color: '#DA291C' },
    { label: 'DBS', value: 60000, color: '#1E1E1E' },
    { label: 'UOB', value: 19500, color: '#2196F3' },
  ];

  const idleFunds = 40000;

  const allocationPlan = [
    { title: 'Top up OCBC 360 Account', amount: 10000, description: 'Maximize bonus interest tiers (up to 4.45% p.a.).', color: '#DA291C' },
    { title: 'OCBC 6-Month Fixed Deposit', amount: 20000, description: 'Lock in guaranteed returns at promotional rates.', color: '#4CAF50' },
    { title: 'OCBC RoboInvest', amount: 10000, description: 'Diversified, low-risk Blue Chip portfolio for long-term growth.', color: '#2196F3' },
  ];

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Dynamic Background Elements */}
      <BackgroundOrb size={400} color="rgba(218, 41, 28, 0.1)" top="-10%" left="-20%" />
      <BackgroundOrb size={300} color="rgba(33, 150, 243, 0.1)" bottom="10%" right="-10%" />

      {/* Header */}
      <YStack position="absolute" top={0} left={0} right={0} zIndex={100}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <XStack paddingHorizontal={24} paddingTop={60} paddingBottom={16} alignItems="center" borderBottomWidth={1} borderColor="rgba(0,0,0,0.05)">
          <Button size="$3" circular backgroundColor="rgba(0,0,0,0.05)" onPress={() => router.back()} marginRight="$3">
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
          </Button>
          <YStack flex={1}>
            <Text fontSize={20} fontWeight="bold" color="black">Smart Deposit</Text>
            <Text fontSize={12} color="rgba(0,0,0,0.5)">Wealth Optimization</Text>
          </YStack>
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 100 }}>
        
        {/* SECTION 1: Total Balance & Linked Accounts */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
          <YStack alignItems="center" marginBottom="$6">
            <Text fontSize={14} color="rgba(0,0,0,0.6)" fontWeight="600" textTransform="uppercase" letterSpacing={1} marginBottom="$2">
              Total Aggregated Balance
            </Text>
            <Text fontSize={42} fontWeight="bold" color="black" marginBottom="$6">
              $124,500
            </Text>

            <XStack alignItems="center" gap="$6" flexWrap="wrap" justifyContent="center">
              <DonutChart 
                data={balanceData} 
                size={180} 
                strokeWidth={20}
                totalText="3 Banks"
                subText="Linked"
              />

              <YStack gap="$3">
                {balanceData.map((item, i) => (
                  <XStack key={i} alignItems="center" gap="$3">
                    <YStack width={12} height={12} borderRadius={6} backgroundColor={item.color} />
                    <YStack>
                      <Text fontSize={14} fontWeight="bold" color="black">{item.label}</Text>
                      <Text fontSize={12} color="rgba(0,0,0,0.5)">${item.value.toLocaleString()}</Text>
                    </YStack>
                  </XStack>
                ))}
                
                {/* Link Another Bank Action */}
                <Button 
                  marginTop="$2"
                  variant="outlined" 
                  borderColor="rgba(0,0,0,0.2)"
                  borderStyle="dashed"
                  borderRadius={12}
                  icon={<MaterialCommunityIcons name="plus" size={18} color="rgba(0,0,0,0.6)" />}
                  pressStyle={{ opacity: 0.7, backgroundColor: 'rgba(0,0,0,0.02)' }}
                >
                  <Text fontSize={12} fontWeight="600" color="rgba(0,0,0,0.6)">Link Another Bank</Text>
                </Button>
              </YStack>
            </XStack>
          </YStack>
        </MotiView>

        {/* SECTION 2: Deposit Owl AI Insight Banner */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <GlassCard padding={0} marginBottom="$6" borderRadius={20} overflow="hidden">
            <XStack backgroundColor="#DA291C" paddingVertical="$3" paddingHorizontal="$4" alignItems="center" gap="$2">
              <MaterialCommunityIcons name="owl" size={20} color="white" />
              <Text color="white" fontWeight="bold" fontSize={14}>Deposit Owl Insight</Text>
            </XStack>
            <XStack padding="$4" gap="$4" alignItems="center">
              <YStack flex={1}>
                <Text fontSize={14} color="black" lineHeight={22}>
                  I noticed <Text fontWeight="bold" color="#DA291C">$40,000</Text> of your total balance is sitting in basic accounts earning less than 0.05% interest. These are your <Text fontWeight="bold">&quot;Idle Funds&quot;</Text>. Let&apos;s put that money to work to beat inflation.
                </Text>
              </YStack>
            </XStack>
          </GlassCard>
        </MotiView>

        {/* SECTION 3: Wealth Allocation Breakdown */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <Text fontSize={18} fontWeight="bold" color="black" marginBottom="$4">
            Recommended Allocation
          </Text>

          {/* Stacked Progress Bar */}
          <YStack marginBottom="$5">
            <XStack height={12} borderRadius={6} overflow="hidden" backgroundColor="rgba(0,0,0,0.05)">
              {allocationPlan.map((plan, i) => (
                <YStack 
                  key={i} 
                  height="100%" 
                  width={`${(plan.amount / idleFunds) * 100}%`} 
                  backgroundColor={plan.color}
                />
              ))}
            </XStack>
            <XStack justifyContent="space-between" marginTop="$2">
              <Text fontSize={12} color="rgba(0,0,0,0.5)">Idle Funds Reallocated</Text>
              <Text fontSize={12} fontWeight="bold" color="black">$40,000 / $40,000</Text>
            </XStack>
          </YStack>

          {/* Allocation Cards */}
          <YStack gap="$3">
            {allocationPlan.map((plan, i) => (
              <GlassCard key={i} padding="$4" borderRadius={20}>
                <XStack gap="$3" alignItems="flex-start" marginBottom="$3">
                  <YStack backgroundColor={`${plan.color}15`} padding="$2" borderRadius={12}>
                    <FontAwesome5 
                      name={i === 0 ? "piggy-bank" : i === 1 ? "lock" : "chart-line"} 
                      size={20} 
                      color={plan.color} 
                    />
                  </YStack>
                  <YStack flex={1}>
                    <Text fontSize={16} fontWeight="bold" color="black" marginBottom="$1">
                      {plan.title}
                    </Text>
                    <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={18}>
                      {plan.description}
                    </Text>
                  </YStack>
                  <YStack alignItems="flex-end">
                    <Text fontSize={16} fontWeight="bold" color={plan.color}>
                      ${plan.amount.toLocaleString()}
                    </Text>
                    <Text fontSize={11} color="rgba(0,0,0,0.4)" marginTop="$1">
                      {((plan.amount / idleFunds) * 100)}%
                    </Text>
                  </YStack>
                </XStack>
                
                <Button 
                  backgroundColor="black"
                  borderRadius={12}
                  height={44}
                  pressStyle={{ opacity: 0.8 }}
                >
                  <Text color="white" fontWeight="600" fontSize={14}>
                    {i === 1 ? 'Set Up Transfer' : 'Allocate Funds'}
                  </Text>
                </Button>
              </GlassCard>
            ))}
          </YStack>
        </MotiView>

      </ScrollView>
    </YStack>
  );
}
