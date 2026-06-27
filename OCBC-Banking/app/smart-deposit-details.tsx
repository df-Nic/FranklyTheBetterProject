import React from 'react';
import { ScrollView, StyleSheet, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { YStack, XStack, Text, Button } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

import { BackgroundOrb } from '../components/BackgroundOrb';
import { DonutChart } from '../components/smart-deposit/DonutChart';
import { LiquidityAreaChart } from '../components/smart-deposit/LiquidityAreaChart';
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
    { 
      title: 'Top up OCBC 360 Account', 
      amount: 10000, 
      text: "First, let's make sure your liquid cash is working its hardest. By moving $10,000 into your OCBC 360 Account, you'll immediately hit the next bonus tier. This means you'll earn up to 4.45% p.a. while keeping the money easily accessible!", 
      color: '#DA291C' 
    },
    { 
      title: 'OCBC 6-Month Fixed Deposit', 
      amount: 20000, 
      text: "Next, for the funds you won't need for daily expenses, predictability is key. Let's lock $20,000 into a 6-Month Fixed Deposit. It's virtually risk-free and secures a guaranteed promotional rate, shielding your money from market volatility.", 
      color: '#4CAF50' 
    },
    { 
      title: 'OCBC RoboInvest', 
      amount: 10000, 
      text: "Finally, let's think long-term. To actively beat inflation, I suggest putting the remaining $10,000 into OCBC RoboInvest. By choosing a low-risk Blue Chip portfolio, your wealth can grow steadily in the background.", 
      color: '#2196F3' 
    },
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

        {/* Cash Flow & Liquidity Graph */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 150 }}>
          <GlassCard padding="$4" marginBottom="$6" borderRadius={16}>
            <YStack gap="$3">
              <YStack gap="$1">
                <Text fontSize={16} fontWeight="bold" color="black">Liquidity & Cash Flow</Text>
                <Text fontSize={12} color="rgba(0,0,0,0.5)">Comparing monthly deposits against spending</Text>
              </YStack>
              <LiquidityAreaChart />
            </YStack>
          </GlassCard>
        </MotiView>

        {/* SECTION 2: Deposit Owl AI Insight Banner */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <GlassCard 
            padding="$4" 
            marginBottom="$6" 
            borderRadius={16} 
            borderLeftWidth={4}
            borderLeftColor="#DA291C"
            borderColor="rgba(255,255,255,0.7)"
          >
            <XStack gap="$3" alignItems="flex-start">
              <YStack backgroundColor="rgba(218, 41, 28, 0.08)" padding="$2" borderRadius={10} marginTop="$0.5">
                <MaterialCommunityIcons name="lightbulb-on" size={20} color="#DA291C" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={12} color="#DA291C" fontWeight="bold" letterSpacing={0.5} textTransform="uppercase" marginBottom="$1">
                  Deposit Owl Insight
                </Text>
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
            Deposit Owl&apos;s Guided Plan
          </Text>

          {/* Stacked Progress Bar */}
          <YStack marginBottom="$6">
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
        </MotiView>

        {/* Conversational Allocation Timeline */}
        <YStack gap="$5" paddingLeft="$1">
          {allocationPlan.map((plan, i) => (
            <MotiView 
              key={i}
              from={{ opacity: 0, translateX: 20, translateY: 10 }} 
              animate={{ opacity: 1, translateX: 0, translateY: 0 }} 
              transition={{ delay: 500 + (i * 200), type: 'spring' }}
            >
              <XStack gap="$3" alignItems="flex-start">
                <YStack 
                  marginTop="$2"
                  shadowColor="#DA291C" 
                  shadowOffset={{ width: 0, height: 4 }} 
                  shadowOpacity={0.15} 
                  shadowRadius={6}
                  style={{ elevation: 2 }}
                >
                  <Image 
                    source={require('../assets/images/owl-deposit.png')} 
                    style={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: 18, 
                      borderWidth: 2, 
                      borderColor: 'white',
                      backgroundColor: 'white'
                    }}
                    resizeMode="contain"
                    alt="Deposit Owl Avatar"
                  />
                </YStack>
                <YStack flex={1}>
                  {/* Chat Bubble */}
                  <YStack 
                    backgroundColor="white" 
                    padding="$4" 
                    borderRadius={20} 
                    borderTopLeftRadius={4}
                    borderWidth={1}
                    borderColor="rgba(0,0,0,0.05)"
                    shadowColor="black"
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowOpacity={0.03}
                    shadowRadius={12}
                    elevation={2}
                  >
                    <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                      <Text fontSize={15} fontWeight="bold" color="black">
                        {plan.title}
                      </Text>
                      <Text fontSize={15} fontWeight="bold" color={plan.color}>
                        ${plan.amount.toLocaleString()}
                      </Text>
                    </XStack>
                    <Text fontSize={14} color="rgba(0,0,0,0.7)" lineHeight={22} marginBottom="$4">
                      {plan.text}
                    </Text>
                    
                    {/* Action Button */}
                    <Button 
                      backgroundColor={plan.color}
                      borderRadius={12}
                      height={42}
                      pressStyle={{ opacity: 0.8 }}
                    >
                      <Text color="white" fontWeight="600" fontSize={14}>
                        {i === 1 ? 'Set Up Transfer' : 'Allocate Funds'}
                      </Text>
                    </Button>
                  </YStack>
                </YStack>
              </XStack>
            </MotiView>
          ))}
        </YStack>

        {/* SECTION 4: Explore More Products Promotion */}
        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ delay: 1100, type: 'spring' }}
        >
          <GlassCard
            marginTop="$7"
            padding="$4.5"
            borderColor="rgba(218, 41, 28, 0.2)"
            backgroundColor="rgba(255, 255, 255, 0.75)"
          >
            <XStack gap="$3" alignItems="center" marginBottom="$3">
              <Image 
                source={require('../assets/images/owl-deposit.png')} 
                style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: 22, 
                  borderWidth: 1.5, 
                  borderColor: 'rgba(218, 41, 28, 0.2)',
                  backgroundColor: 'white'
                }}
                resizeMode="contain"
                alt="Deposit Owl Mascot"
              />
              <YStack flex={1}>
                <Text fontSize={15} fontWeight="bold" color="black">
                  Explore More Tailored Products
                </Text>
                <Text fontSize={12} color="rgba(0,0,0,0.5)">
                  Deposit Owl has curated other financial growth options for you.
                </Text>
              </YStack>
            </XStack>
            
            <Button
              backgroundColor="#DA291C"
              borderRadius={12}
              height={46}
              onPress={() => router.push('/recommendations')}
              pressStyle={{ opacity: 0.8 }}
            >
              <Text color="white" fontWeight="bold" fontSize={14}>
                Explore More Products
              </Text>
            </Button>
          </GlassCard>
        </MotiView>

      </ScrollView>
    </YStack>
  );
}
