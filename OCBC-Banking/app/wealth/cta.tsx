import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { useWealth } from '../../components/wealth/WealthContext';
import { AMOUNT_MIDPOINT, GROWTH_RATE, CURRENT_AUM, TIER_CONFIG } from '../../components/wealth/mockData';

function formatCurrency(val: number) {
  return val.toLocaleString('en-SG', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function calculateProjection(amount: number, riskProfile: string, years: number): number {
  const rate = GROWTH_RATE[riskProfile] ?? 0.06;
  return Math.round(amount * Math.pow(1 + rate, years));
}

export default function CTAScreen() {
  const router = useRouter();
  const { state, dispatch } = useWealth();

  const riskProfile = state.userProfile.riskProfile ?? 'Balanced';
  const investRange = state.userProfile.investAmount;
  const timeline = state.userProfile.targetTierTimeline ?? '3–5 years';
  const selectedFund = state.selectedFund;

  const defaultAmount = AMOUNT_MIDPOINT[investRange] ?? 10000;
  const [amount, setAmount] = useState(defaultAmount);
  const [amountText, setAmountText] = useState(String(defaultAmount));
  const [agreed, setAgreed] = useState(false);
  const [invested, setInvested] = useState(false);

  const projectionYears = timeline.startsWith('1') ? 3 : timeline.startsWith('3') ? 5 : 7;
  const projectedValue = calculateProjection(amount, riskProfile, projectionYears);
  const projectedAUM = CURRENT_AUM + projectedValue;
  const targetAUM = TIER_CONFIG.find(t => t.id === 'premier')!.minAUM;
  const willUnlock = projectedAUM >= targetAUM;
  const yearsToPremier = willUnlock
    ? projectionYears
    : Math.ceil(Math.log(targetAUM / (CURRENT_AUM + amount)) / Math.log(1 + (GROWTH_RATE[riskProfile] ?? 0.06)));

  const handleAmountChange = (text: string) => {
    setAmountText(text);
    const num = parseInt(text.replace(/,/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
      dispatch({ type: 'SET_INVESTMENT_AMOUNT', amount: num });
    }
  };

  const handleInvest = () => {
    setInvested(true);
    setTimeout(() => {
      router.push('/wealth/dashboard');
    }, 2000);
  };

  if (invested) {
    return (
      <YStack flex={1} backgroundColor="#F5F5F7" justifyContent="center" alignItems="center" padding="$6">
        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300 }}
          style={{ alignItems: 'center' }}
        >
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'timing', duration: 400, delay: 200 }}
          >
            <YStack
              backgroundColor="rgba(76,175,80,0.15)"
              width={100}
              height={100}
              borderRadius={50}
              alignItems="center"
              justifyContent="center"
              marginBottom="$2"
            >
              <Feather name="check" size={50} color="#4CAF50" />
            </YStack>
          </MotiView>
          <Text fontSize={26} fontWeight="900" color="black" marginTop="$4" textAlign="center">
            Investment Placed!
          </Text>
          <Text fontSize={15} color="rgba(0,0,0,0.55)" textAlign="center" marginTop="$2">
            Redirecting to your dashboard...
          </Text>
        </MotiView>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <BackgroundOrb size={380} color="rgba(218,41,28,0.07)" top="-5%" right="-20%" fromOpacity={0.4} toOpacity={0.9} />

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
          <Text fontSize={17} fontWeight="700" color="black">Review & Invest</Text>
          <YStack width={36} />
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 140 }}>

        {/* Fund Selected */}
        {selectedFund && (
          <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
            <GlassCard padding="$4" marginBottom="$4">
              <XStack gap="$3" alignItems="center">
                <YStack backgroundColor="rgba(218,41,28,0.1)" padding="$3" borderRadius={12}>
                  <Feather name="pie-chart" size={20} color="#DA291C" />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={13} color="rgba(0,0,0,0.45)" fontWeight="600">SELECTED FUND</Text>
                  <Text fontSize={15} fontWeight="800" color="black">{selectedFund.name}</Text>
                  <Text fontSize={12} color="#DA291C" fontWeight="600">{selectedFund.assetClass}</Text>
                </YStack>
              </XStack>
            </GlassCard>
          </MotiView>
        )}

        {/* Investment Amount */}
        <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 180 }}>
          <GlassCard padding="$5" marginBottom="$4">
            <Text fontSize={13} fontWeight="700" color="rgba(0,0,0,0.5)" marginBottom="$3">INVESTMENT AMOUNT</Text>
            <XStack alignItems="center" gap="$3">
              <Text fontSize={22} fontWeight="900" color="#DA291C">SGD</Text>
              <TextInput
                value={amountText}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                style={{
                  flex: 1,
                  fontSize: 32,
                  fontWeight: '900',
                  color: '#111',
                  borderBottomWidth: 2,
                  borderColor: '#DA291C',
                  paddingBottom: 4,
                }}
              />
            </XStack>
            <Text fontSize={12} color="rgba(0,0,0,0.4)" marginTop="$2">
              Pre-filled based on your stated investment amount. Tap to edit.
            </Text>
          </GlassCard>
        </MotiView>

        {/* Projection */}
        <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 260 }}>
          <GlassCard padding="$5" marginBottom="$4" borderColor={willUnlock ? 'rgba(76,175,80,0.3)' : 'rgba(218,41,28,0.2)'}>
            <Text fontSize={13} fontWeight="700" color="rgba(0,0,0,0.5)" marginBottom="$3">GROWTH PROJECTION</Text>
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={14} color="rgba(0,0,0,0.55)">In {projectionYears} years</Text>
                <Text fontSize={22} fontWeight="900" color="black">SGD {formatCurrency(projectedValue)}</Text>
              </XStack>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize={14} color="rgba(0,0,0,0.55)">Your total AUM</Text>
                <Text fontSize={18} fontWeight="800" color={willUnlock ? '#4CAF50' : 'black'}>
                  SGD {formatCurrency(projectedAUM)}
                </Text>
              </XStack>

              <Text fontSize={11} color="rgba(0,0,0,0.35)">
                Based on {riskProfile} profile ({Math.round((GROWTH_RATE[riskProfile] ?? 0.06) * 100)}% p.a. avg). Not a guarantee.
              </Text>
            </YStack>
          </GlassCard>
        </MotiView>

        {/* Compliance Checkbox */}
        <MotiView from={{ opacity: 0, translateY: 15 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 340 }}>
          <GlassCard padding="$4" marginBottom="$6">
            <Text fontSize={13} fontWeight="700" color="rgba(0,0,0,0.5)" marginBottom="$3">MAS RISK ACKNOWLEDGMENT</Text>
            <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={20} marginBottom="$4">
              I understand that unit trusts are not principal-guaranteed. The value of the fund and any income accrued from it may fall as well as rise. Past performance is not necessarily indicative of future results.
            </Text>
            <Button
              size="$4"
              backgroundColor={agreed ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.04)'}
              borderWidth={1.5}
              borderColor={agreed ? '#4CAF50' : 'rgba(0,0,0,0.1)'}
              borderRadius={12}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => setAgreed(!agreed)}
              icon={<Feather name={agreed ? 'check-square' : 'square'} size={18} color={agreed ? '#4CAF50' : '#999'} />}
            >
              <Text fontSize={14} fontWeight={agreed ? '700' : '500'} color={agreed ? '#4CAF50' : 'rgba(0,0,0,0.5)'}>
                {agreed ? 'I understand & agree' : 'I acknowledge the risks above'}
              </Text>
            </Button>
          </GlassCard>
        </MotiView>
      </ScrollView>

      {/* Sticky Invest CTA */}
      <YStack position="absolute" bottom={0} left={0} right={0} padding={24} paddingBottom={40}>
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        <MotiView animate={{ opacity: agreed ? 1 : 0.4 }} transition={{ type: 'timing', duration: 200 }}>
          <Button
            size="$5"
            backgroundColor="#DA291C"
            color="white"
            borderRadius={16}
            height={60}
            fontWeight="bold"
            fontSize={17}
            elevation={agreed ? 8 : 0}
            shadowColor="#DA291C"
            shadowRadius={14}
            shadowOpacity={agreed ? 0.3 : 0}
            disabled={!agreed}
            pressStyle={agreed ? { opacity: 0.85, scale: 0.97 } : {}}
            onPress={agreed ? handleInvest : undefined}
            icon={<Feather name="check-circle" size={20} color="white" />}
          >
            Invest SGD {formatCurrency(amount)}
          </Button>
        </MotiView>
      </YStack>
    </YStack>
  );
}
