import React, { useState } from 'react';
import { ScrollView, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

import { BackgroundOrb } from '../components/BackgroundOrb';
import { DonutChart } from '../components/smart-deposit/DonutChart';
import { LiquidityAreaChart } from '../components/smart-deposit/LiquidityAreaChart';
import { GlassCard } from '../components/GlassCard';
import { StandaloneNavBar } from '../components/StandaloneNavBar';
import { CustomSlider } from '../components/smart-deposit/CustomSlider';
import { PlanningOwlRecommendationBanner, ProductSuccess } from '../components/planning-owl/ProductDestination';
import { buildPlanningOwlProductContext, completePlanningOwlProductAction } from '../constants/planningOwlProductRoute';
export default function SmartDepositDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams<Record<string, string>>();
  const planningContext = buildPlanningOwlProductContext(params);
  const fromPlanningOwl = planningContext.source === 'planning_owl';

  const balanceData = [
    { label: 'OCBC', value: 45000, color: '#DA291C' },
    { label: 'DBS', value: 60000, color: '#1E1E1E' },
    { label: 'UOB', value: 19500, color: '#2196F3' },
  ];

  const [bufferMonths, setBufferMonths] = useState(3);
  const [averageExpense, setAverageExpense] = useState(3050);
  const [isEditingExpense, setIsEditingExpense] = useState(false);
  const [expenseInputText, setExpenseInputText] = useState('3050');
  
  // Custom deposit amount
  const [customDepositAmount, setCustomDepositAmount] = useState('');
  const [hasUserModifiedDeposit, setHasUserModifiedDeposit] = useState(false);
  const [planningOwlCompleted, setPlanningOwlCompleted] = useState(false);

  const totalCashBalance = balanceData.reduce((sum, item) => sum + item.value, 0);
  const targetBufferAmount = averageExpense * bufferMonths;
  const safeToDeposit = Math.max(0, totalCashBalance - targetBufferAmount);
  const bufferDeficit = Math.max(0, targetBufferAmount - totalCashBalance);
  
  const idleFunds = hasUserModifiedDeposit 
    ? (parseFloat(customDepositAmount) || 0) 
    : safeToDeposit;

  const amount1 = Math.round(idleFunds * 0.25);
  const amount2 = Math.round(idleFunds * 0.50);
  const amount3 = Math.max(0, idleFunds - amount1 - amount2);

  const allocationPlan = [
    { 
      title: 'Top up OCBC 360 Account', 
      amount: amount1, 
      text: `First, let's make sure your liquid cash is working its hardest. By moving $${amount1.toLocaleString()} into your OCBC 360 Account, you'll immediately hit the next bonus tier. This means you'll earn up to 4.45% p.a. while keeping the money easily accessible!`, 
      color: '#DA291C' 
    },
    { 
      title: 'OCBC 6-Month Fixed Deposit', 
      amount: amount2, 
      text: `Next, for the funds you won't need for daily expenses, predictability is key. Let's lock $${amount2.toLocaleString()} into a 6-Month Fixed Deposit. It's virtually risk-free and secures a guaranteed promotional rate, shielding your money from market volatility.`, 
      color: '#4CAF50' 
    },
    { 
      title: 'OCBC RoboInvest', 
      amount: amount3, 
      text: `Finally, let's think long-term. To actively beat inflation, I suggest putting the remaining $${amount3.toLocaleString()} into OCBC RoboInvest. By choosing a low-risk Blue Chip portfolio, your wealth can grow steadily in the background.`, 
      color: '#2196F3' 
    },
  ];

  if (planningOwlCompleted) {
    return (
      <ProductSuccess
        title="Deposit plan set up"
        detail="Your Deposit Owl action has been marked as set up for this Planning Owl plan."
        buttonLabel="Back to plan"
        onBackToPlan={() => completePlanningOwlProductAction(router, planningContext)}
      />
    );
  }

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

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 160 }}>
        {fromPlanningOwl && (
          <PlanningOwlRecommendationBanner
            context={planningContext}
            fallback="Planning Owl suggested Deposit Owl so this goal can have its own savings bucket while keeping emergency money available."
          />
        )}
        
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

        {/* NEW SECTION: Liquidity Buffer Configurator */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 175 }}>
          <GlassCard padding="$4.5" marginBottom="$6" borderRadius={16} borderColor="rgba(218, 41, 28, 0.15)">
            <YStack gap="$4">
              {isEditingExpense ? (
                <YStack gap="$3" width="100%">
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack gap="$0.5">
                      <Text fontSize={16} fontWeight="bold" color="black">Liquidity Buffer Configurator</Text>
                      <Text fontSize={12} color="rgba(0,0,0,0.5)">Set your safety net based on monthly expenses</Text>
                    </YStack>
                  </XStack>
                  <XStack 
                    alignItems="center" 
                    gap="$3" 
                    backgroundColor="white" 
                    borderWidth={1.5} 
                    borderColor="#DA291C" 
                    borderRadius={12} 
                    paddingHorizontal="$3.5" 
                    height={44}
                    shadowColor="#DA291C"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.08}
                    shadowRadius={4}
                    style={{ elevation: 3 }}
                    width="100%"
                  >
                    <Text fontSize={16} fontWeight="bold" color="rgba(0,0,0,0.4)">$</Text>
                    <Input
                      unstyled
                      flex={1}
                      height="100%"
                      fontSize={15}
                      fontWeight="bold"
                      color="black"
                      keyboardType="numeric"
                      value={expenseInputText}
                      onChangeText={setExpenseInputText}
                      onSubmitEditing={() => {
                        const val = parseFloat(expenseInputText) || 0;
                        setAverageExpense(val);
                        setIsEditingExpense(false);
                      }}
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={() => {
                        const val = parseFloat(expenseInputText) || 0;
                        setAverageExpense(val);
                        setIsEditingExpense(false);
                      }}
                    >
                      <MaterialCommunityIcons name="check-circle" size={22} color="#4CAF50" />
                    </TouchableOpacity>
                  </XStack>
                </YStack>
              ) : (
                <XStack justifyContent="space-between" alignItems="center">
                  <YStack gap="$0.5">
                    <Text fontSize={16} fontWeight="bold" color="black">Liquidity Buffer Configurator</Text>
                    <Text fontSize={12} color="rgba(0,0,0,0.5)">Set your safety net based on monthly expenses</Text>
                  </YStack>
                  <TouchableOpacity
                    onPress={() => {
                      setExpenseInputText(averageExpense.toString());
                      setIsEditingExpense(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <XStack 
                      alignItems="center" 
                      gap="$2" 
                      backgroundColor="rgba(218, 41, 28, 0.05)" 
                      borderWidth={1} 
                      borderColor="rgba(218, 41, 28, 0.2)" 
                      borderRadius={12} 
                      paddingHorizontal="$3" 
                      paddingVertical="$1.5"
                    >
                      <Text fontSize={13} fontWeight="bold" color="#DA291C">
                        ${averageExpense.toLocaleString()}/mo
                      </Text>
                      <MaterialCommunityIcons name="pencil" size={12} color="#DA291C" />
                    </XStack>
                  </TouchableOpacity>
                </XStack>
              )}

              <XStack justifyContent="space-between" alignItems="center" backgroundColor="rgba(0,0,0,0.02)" padding="$3" borderRadius={12}>
                <YStack>
                  <Text fontSize={11} color="rgba(0,0,0,0.5)" fontWeight="600">TARGET BUFFER</Text>
                  <Text fontSize={18} fontWeight="bold" color="#DA291C">${targetBufferAmount.toLocaleString()}</Text>
                </YStack>
                
                <YStack alignItems="flex-end">
                  <Text fontSize={11} color="rgba(0,0,0,0.5)" fontWeight="600">SAFE TO DEPOSIT</Text>
                  <Text fontSize={18} fontWeight="bold" color={safeToDeposit > 0 ? "#4CAF50" : "rgba(0,0,0,0.3)"}>
                    ${safeToDeposit.toLocaleString()}
                  </Text>
                </YStack>
              </XStack>

              <YStack gap="$1.5">
                <XStack height={14} borderRadius={7} overflow="hidden" backgroundColor="rgba(0,0,0,0.05)" width="100%">
                  <YStack 
                    height="100%" 
                    width={`${Math.min(100, (targetBufferAmount / totalCashBalance) * 100)}%`} 
                    backgroundColor="#DA291C" 
                  />
                  <YStack 
                    height="100%" 
                    width={`${Math.max(0, Math.min(100 - (targetBufferAmount / totalCashBalance) * 100, (safeToDeposit / totalCashBalance) * 100))}%`} 
                    backgroundColor="#4CAF50" 
                  />
                </XStack>
                <XStack justifyContent="space-between">
                  <Text fontSize={10} color="rgba(0,0,0,0.4)" fontWeight="500">Reserved Buffer ({Math.round(Math.min(100, (targetBufferAmount / totalCashBalance) * 100))}% of cash)</Text>
                  <Text fontSize={10} color="rgba(0,0,0,0.4)" fontWeight="500">Safe Spillover ({Math.round(Math.max(0, Math.min(100 - (targetBufferAmount / totalCashBalance) * 100, (safeToDeposit / totalCashBalance) * 100)))}%)</Text>
                </XStack>
              </YStack>

              <YStack gap="$1.5">
                <Text fontSize={12} color="rgba(0,0,0,0.6)" fontWeight="600">
                  Select Safety Net: <Text color="#DA291C" fontWeight="bold">{bufferMonths} Months</Text>
                </Text>
                <CustomSlider 
                  value={bufferMonths} 
                  steps={[1, 2, 3, 6, 9, 12]} 
                  onChange={(val) => {
                    setBufferMonths(val);
                    if (!hasUserModifiedDeposit) {
                      setCustomDepositAmount('');
                    }
                  }} 
                />
              </YStack>
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
                  {safeToDeposit > 0 ? (
                    <>
                      Based on your <Text fontWeight="bold" color="#DA291C">{bufferMonths}-month</Text> safety net, you need <Text fontWeight="bold">${targetBufferAmount.toLocaleString()}</Text> as a liquidity buffer. This leaves <Text fontWeight="bold" color="#4CAF50">${safeToDeposit.toLocaleString()}</Text> of your cash safe to deposit/reallocate into higher-yield options!
                    </>
                  ) : (
                    <>
                      Your current cash of <Text fontWeight="bold">${totalCashBalance.toLocaleString()}</Text> is below your target safety buffer of <Text fontWeight="bold" color="#DA291C">${targetBufferAmount.toLocaleString()}</Text> ({bufferMonths} months). I recommend building up your savings before allocating funds to investments.
                    </>
                  )}
                </Text>
              </YStack>
            </XStack>
          </GlassCard>
        </MotiView>

        {/* SECTION 3: Wealth Allocation Breakdown */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <Text fontSize={18} fontWeight="bold" color="black" marginBottom="$2">
            Deposit Owl&apos;s Guided Plan
          </Text>
        </MotiView>

        {/* SECTION 3.5: Deposit Action Area (Moved up here!) */}
        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ delay: 320, type: 'spring' }}
        >
          <GlassCard padding="$4.5" marginBottom="$6" borderRadius={16} borderColor="rgba(0,0,0,0.05)">
            <YStack gap="$4">
              <YStack gap="$1">
                <Text fontSize={16} fontWeight="bold" color="black">Execute Guided Allocation</Text>
                <Text fontSize={12} color="rgba(0,0,0,0.5)">Specify how much you want to deposit into this plan</Text>
              </YStack>

              <XStack gap="$3" alignItems="center">
                <Text fontSize={18} fontWeight="bold" color="black">$</Text>
                <Input
                  flex={1}
                  height={46}
                  borderRadius={12}
                  borderWidth={1.5}
                  borderColor="rgba(0,0,0,0.1)"
                  fontSize={16}
                  fontWeight="bold"
                  keyboardType="numeric"
                  placeholder={safeToDeposit.toString()}
                  value={hasUserModifiedDeposit ? customDepositAmount : ''}
                  onChangeText={(val) => {
                    setHasUserModifiedDeposit(true);
                    setCustomDepositAmount(val);
                  }}
                  disabled={safeToDeposit <= 0}
                  backgroundColor={safeToDeposit <= 0 ? "rgba(0,0,0,0.02)" : "white"}
                />
                
                {hasUserModifiedDeposit && (
                  <Button
                    size="$3"
                    variant="outlined"
                    borderColor="rgba(0,0,0,0.15)"
                    borderRadius={10}
                    onPress={() => {
                      setHasUserModifiedDeposit(false);
                      setCustomDepositAmount('');
                    }}
                  >
                    <Text fontSize={12} fontWeight="600" color="rgba(0,0,0,0.6)">Reset</Text>
                  </Button>
                )}
              </XStack>

              {safeToDeposit <= 0 ? (
                <XStack 
                  backgroundColor="rgba(218, 41, 28, 0.08)" 
                  padding="$3.5" 
                  borderRadius={12} 
                  alignItems="flex-start" 
                  gap="$2.5"
                >
                  <MaterialCommunityIcons name="alert-circle" size={20} color="#DA291C" style={{ marginTop: 2 }} />
                  <YStack flex={1}>
                    <Text fontSize={13} fontWeight="bold" color="#DA291C">Buffer Unmet</Text>
                    <Text fontSize={12} color="rgba(0,0,0,0.7)" lineHeight={18} marginTop="$1">
                      Keep saving! You need ${bufferDeficit.toLocaleString()} more to fully fund your safety buffer before locking money.
                    </Text>
                  </YStack>
                </XStack>
              ) : parseFloat(customDepositAmount) > safeToDeposit ? (
                <XStack 
                  backgroundColor="rgba(255, 184, 28, 0.12)" 
                  padding="$3.5" 
                  borderRadius={12} 
                  alignItems="flex-start" 
                  gap="$2.5"
                  borderWidth={1}
                  borderColor="rgba(255, 184, 28, 0.3)"
                >
                  <MaterialCommunityIcons name="alert" size={20} color="#DA291C" style={{ marginTop: 2 }} />
                  <YStack flex={1}>
                    <Text fontSize={13} fontWeight="bold" color="#DA291C">Liquidity Warning</Text>
                    <Text fontSize={12} color="rgba(0,0,0,0.7)" lineHeight={18} marginTop="$1">
                      Exceeding your safe deposit limit of ${safeToDeposit.toLocaleString()} might compromise your target safety net for emergencies.
                    </Text>
                  </YStack>
                </XStack>
              ) : hasUserModifiedDeposit && parseFloat(customDepositAmount) > 0 ? (
                <XStack 
                  backgroundColor="rgba(76, 175, 80, 0.08)" 
                  padding="$3.5" 
                  borderRadius={12} 
                  alignItems="flex-start" 
                  gap="$2.5"
                >
                  <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" style={{ marginTop: 2 }} />
                  <YStack flex={1}>
                    <Text fontSize={13} fontWeight="bold" color="#4CAF50">Liquidity Secured</Text>
                    <Text fontSize={12} color="rgba(0,0,0,0.7)" lineHeight={18} marginTop="$1">
                      Your custom allocation of ${parseFloat(customDepositAmount).toLocaleString()} is within the safe limit. Your ${targetBufferAmount.toLocaleString()} safety net is fully preserved.
                    </Text>
                  </YStack>
                </XStack>
              ) : (
                <XStack 
                  backgroundColor="rgba(76, 175, 80, 0.08)" 
                  padding="$3.5" 
                  borderRadius={12} 
                  alignItems="flex-start" 
                  gap="$2.5"
                >
                  <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" style={{ marginTop: 2 }} />
                  <YStack flex={1}>
                    <Text fontSize={13} fontWeight="bold" color="#4CAF50">Liquidity Secured</Text>
                    <Text fontSize={12} color="rgba(0,0,0,0.7)" lineHeight={18} marginTop="$1">
                      Using recommended amount. Your safety net of ${targetBufferAmount.toLocaleString()} will remain fully funded in liquid accounts.
                    </Text>
                  </YStack>
                </XStack>
              )}

              <Button
                backgroundColor={safeToDeposit > 0 ? "#DA291C" : "rgba(0,0,0,0.1)"}
                borderRadius={12}
                height={48}
                disabled={safeToDeposit <= 0}
                pressStyle={{ opacity: 0.8 }}
                onPress={() => {
                  if (fromPlanningOwl) {
                    setPlanningOwlCompleted(true);
                    return;
                  }

                  Alert.alert(
                    "Review Deposit", 
                    `Initiated allocation review for $${idleFunds.toLocaleString()}!\n\n` + 
                    `- OCBC 360 Account: $${amount1.toLocaleString()}\n` +
                    `- 6-Month Fixed Deposit: $${amount2.toLocaleString()}\n` + 
                    `- RoboInvest: $${amount3.toLocaleString()}`
                  );
                }}
              >
                <Text color={safeToDeposit > 0 ? "white" : "rgba(0,0,0,0.3)"} fontWeight="bold" fontSize={15}>
                  {fromPlanningOwl ? 'Use this deposit plan' : 'Review Deposit'}
                </Text>
              </Button>
            </YStack>
          </GlassCard>
        </MotiView>

        {/* SECTION 3.1: Wealth Allocation Visuals */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 340 }}>
          {/* Stacked Progress Bar */}
          <YStack marginBottom="$6">
            <XStack height={12} borderRadius={6} overflow="hidden" backgroundColor="rgba(0,0,0,0.05)">
              {allocationPlan.map((plan, i) => (
                <YStack 
                  key={i} 
                  height="100%" 
                  width={`${idleFunds > 0 ? (plan.amount / idleFunds) * 100 : 0}%`} 
                  backgroundColor={plan.color}
                />
              ))}
            </XStack>
            <XStack justifyContent="space-between" marginTop="$2">
              <Text fontSize={12} color="rgba(0,0,0,0.5)">Funds Recommended for Reallocation</Text>
              <Text fontSize={12} fontWeight="bold" color="black">
                ${idleFunds.toLocaleString()} / ${idleFunds.toLocaleString()}
              </Text>
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
                      <Text fontSize={15} fontWeight="bold" color={idleFunds > 0 ? plan.color : 'rgba(0,0,0,0.3)'}>
                        ${plan.amount.toLocaleString()}
                      </Text>
                    </XStack>
                    <Text fontSize={14} color="rgba(0,0,0,0.7)" lineHeight={22} marginBottom="$4">
                      {plan.text}
                    </Text>
                    
                    {/* Action Button */}
                    <Button 
                      backgroundColor={idleFunds > 0 ? plan.color : 'rgba(0,0,0,0.08)'}
                      borderRadius={12}
                      height={42}
                      pressStyle={{ opacity: 0.8 }}
                      disabled={idleFunds <= 0}
                      onPress={() => {
                        Alert.alert("Allocation", `Proceeding to allocate $${plan.amount.toLocaleString()} for ${plan.title}`);
                      }}
                    >
                      <Text color={idleFunds > 0 ? "white" : "rgba(0,0,0,0.3)"} fontWeight="600" fontSize={14}>
                        {i === 1 ? 'Set Up Transfer' : 'Allocate Funds'}
                      </Text>
                    </Button>
                  </YStack>
                </YStack>
              </XStack>
            </MotiView>
          ))}
        </YStack>

        {/* SECTION 3.5 was moved above */}

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

      {/* Floating nav bar matching the home page */}
      <StandaloneNavBar />
    </YStack>
  );
}
