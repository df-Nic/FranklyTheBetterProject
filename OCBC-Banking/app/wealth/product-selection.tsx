import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button, Spinner } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { useWealth } from '../../components/wealth/WealthContext';
import {
  WEALTH_PRODUCTS,
  SELECT_FOR_ME,
  SELECT_FOR_ME_REASON,
} from '../../components/wealth/mockData';

const RISK_LABELS = [
  { range: [0, 2], label: 'Conservative', icon: 'shield', color: '#0D1B3E', bgColor: 'rgba(13,27,62,0.12)', description: 'You prefer stability and capital protection over high returns.' },
  { range: [3, 5], label: 'Balanced', icon: 'pie-chart', color: '#F5A623', bgColor: 'rgba(245,166,35,0.15)', description: 'You\'re comfortable with moderate risk for steady growth.' },
  { range: [6, 8], label: 'Growth', icon: 'trending-up', color: '#DA291C', bgColor: 'rgba(218,41,28,0.12)', description: 'You embrace volatility for the potential of higher long-term returns.' },
];

export default function ProductSelectionScreen() {
  const router = useRouter();
  const { state, dispatch } = useWealth();
  const riskProfile = state.userProfile.riskProfile ?? 'Balanced';
  const profileDetails = RISK_LABELS.find(r => r.label === riskProfile) ?? RISK_LABELS[1];

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ productId: string; reason: string } | null>(null);

  const handleSelectForMe = () => {
    setAiLoading(true);
    setAiResult(null);
    setTimeout(() => {
      const productId = SELECT_FOR_ME[riskProfile];
      const reason = SELECT_FOR_ME_REASON[riskProfile];
      setAiResult({ productId, reason });
      setAiLoading(false);
    }, 1800);
  };

  const handleSelectProduct = (productId: string) => {
    dispatch({ type: 'SELECT_PRODUCT', productId });
    router.push('/wealth/fund-narrowing');
  };

  const handleConfirmAI = () => {
    if (aiResult) handleSelectProduct(aiResult.productId);
  };

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
          <YStack alignItems="center">
            <Text fontSize={17} fontWeight="700" color="black">Choose Your Product</Text>
          </YStack>
          <YStack width={36} />
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 140 }}>

        {/* Risk Profile Result Card */}
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/wealth/risk-swipe')}
          >
            <YStack
              backgroundColor="white"
              borderRadius={24}
              padding="$6"
              marginBottom="$5"
              alignItems="center"
              borderWidth={1}
              borderColor="rgba(218,41,28,0.2)"
              shadowColor="#000"
              shadowOpacity={0.06}
              shadowRadius={12}
              elevation={4}
            >
              <YStack
                backgroundColor={profileDetails.bgColor}
                padding={16}
                borderRadius={100}
                marginBottom="$4"
              >
                <Feather name={profileDetails.icon as any} size={40} color={profileDetails.color} />
              </YStack>
              <Text fontSize={11} fontWeight="800" color="rgba(0,0,0,0.4)" letterSpacing={1} marginBottom="$2">
                YOUR RISK PROFILE
              </Text>
              <YStack backgroundColor={profileDetails.color} paddingHorizontal={14} paddingVertical={6} borderRadius={20} marginBottom="$3">
                <Text fontSize={15} fontWeight="800" color="white" textTransform="uppercase" letterSpacing={0.5}>
                  {profileDetails.label}
                </Text>
              </YStack>
              <Text fontSize={14} color="rgba(0,0,0,0.6)" textAlign="center" lineHeight={20}>
                {profileDetails.description}
              </Text>
              <Text fontSize={11} color="#DA291C" fontWeight="800" marginTop="$3" textTransform="uppercase" letterSpacing={0.5}>
                Tap to reassess
              </Text>
            </YStack>
          </TouchableOpacity>
        </MotiView>

        {/* AI Result Banner */}
        {aiResult && (
          <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'spring' }}>
            <GlassCard padding="$5" marginBottom="$5" borderColor="rgba(218,41,28,0.3)" backgroundColor="rgba(218,41,28,0.04)">
              <XStack gap="$3" alignItems="flex-start">
                <YStack backgroundColor="rgba(218,41,28,0.12)" padding="$2" borderRadius={10}>
                  <Feather name="cpu" size={18} color="#DA291C" />
                </YStack>
                <YStack flex={1} gap="$1">
                  <Text fontSize={13} fontWeight="700" color="#DA291C">AI Recommendation</Text>
                  <Text fontSize={14} fontWeight="800" color="black">
                    {WEALTH_PRODUCTS.find(p => p.id === aiResult.productId)?.name}
                  </Text>
                  <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={20}>
                    {aiResult.reason}
                  </Text>
                </YStack>
              </XStack>
              <Button
                marginTop="$4"
                size="$4"
                backgroundColor="#DA291C"
                color="white"
                borderRadius={12}
                fontWeight="700"
                pressStyle={{ opacity: 0.85 }}
                onPress={handleConfirmAI}
              >
                Confirm This Choice →
              </Button>
            </GlassCard>
          </MotiView>
        )}

        <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
          <Text fontSize={14} color="rgba(0,0,0,0.5)" lineHeight={20} marginBottom="$5">
            Each product below counts toward your AUM, helping you unlock Premier Banking faster.
          </Text>
        </MotiView>

        <YStack gap="$3">
          {WEALTH_PRODUCTS.map((product, i) => {
            const isAIHighlighted = aiResult?.productId === product.id;
            return (
              <MotiView
                key={product.id}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 120 + i * 60 }}
              >
                <TouchableOpacity onPress={() => handleSelectProduct(product.id)} activeOpacity={0.85}>
                  <GlassCard
                    padding="$4"
                    borderColor={isAIHighlighted ? 'rgba(218,41,28,0.4)' : 'rgba(255,255,255,0.8)'}
                    backgroundColor={isAIHighlighted ? 'rgba(218,41,28,0.04)' : 'rgba(255,255,255,0.6)'}
                  >
                    <XStack gap="$4" alignItems="center">
                      <YStack
                        width={48} height={48}
                        borderRadius={14}
                        backgroundColor={isAIHighlighted ? 'rgba(218,41,28,0.1)' : 'rgba(0,0,0,0.05)'}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Feather name={product.icon as any} size={22} color={isAIHighlighted ? '#DA291C' : '#555'} />
                      </YStack>
                      <YStack flex={1} gap="$1">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize={15} fontWeight="800" color="black">{product.name}</Text>
                          {isAIHighlighted && (
                            <YStack backgroundColor="rgba(218,41,28,0.1)" paddingHorizontal="$2" paddingVertical={3} borderRadius={8}>
                              <Text fontSize={10} fontWeight="700" color="#DA291C">AI PICK</Text>
                            </YStack>
                          )}
                        </XStack>
                        <Text fontSize={13} color="rgba(0,0,0,0.55)" lineHeight={18}>{product.description}</Text>
                        <XStack gap="$3" marginTop="$1">
                          <XStack gap="$1" alignItems="center">
                            <Feather name="trending-up" size={11} color="#4CAF50" />
                            <Text fontSize={11} color="#4CAF50" fontWeight="600">{product.expectedReturn}</Text>
                          </XStack>
                          <XStack gap="$1" alignItems="center">
                            <Feather name="activity" size={11} color="rgba(0,0,0,0.4)" />
                            <Text fontSize={11} color="rgba(0,0,0,0.45)">{product.risk}</Text>
                          </XStack>
                        </XStack>
                        <Text fontSize={11} color="#DA291C" fontWeight="600" marginTop={2}>
                          ↑ {product.tierBoost}
                        </Text>
                      </YStack>
                      <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.25)" />
                    </XStack>
                  </GlassCard>
                </TouchableOpacity>
              </MotiView>
            );
          })}
        </YStack>
      </ScrollView>

      {/* Sticky Select For Me */}
      <YStack position="absolute" bottom={0} left={0} right={0} padding={24} paddingBottom={40}>
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        <TouchableOpacity
          onPress={aiLoading ? undefined : handleSelectForMe}
          disabled={aiLoading}
          activeOpacity={0.85}
        >
          <XStack
            backgroundColor={aiLoading ? '#DA291C' : '#0D1B3E'}
            opacity={aiLoading ? 0.85 : 1}
            height={56}
            borderRadius={16}
            alignItems="center"
            justifyContent="center"
            gap="$2"
            elevation={6}
            shadowColor="#0D1B3E"
            shadowRadius={12}
            shadowOpacity={0.2}
          >
            {aiLoading ? <Spinner color="white" /> : <Feather name="cpu" size={18} color="white" />}
            <Text color="white" fontWeight="bold" fontSize={15}>
              {aiLoading ? 'Analysing your profile...' : 'Select For Me'}
            </Text>
          </XStack>
        </TouchableOpacity>
      </YStack>
    </YStack>
  );
}
