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
  getRankingExplanation,
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

  const recommendedProductId = SELECT_FOR_ME[riskProfile] ?? 'unit-trust';
  const recommendedProduct = WEALTH_PRODUCTS.find(p => p.id === recommendedProductId);
  const recommendedReason = SELECT_FOR_ME_REASON[riskProfile] ?? '';

  const otherProducts = WEALTH_PRODUCTS.filter(p => p.id !== recommendedProductId);

  const handleSelectProduct = (productId: string) => {
    dispatch({ type: 'SELECT_PRODUCT', productId });
    router.push('/wealth/fund-narrowing');
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

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 60 }}>

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
              padding="$5"
              marginBottom="$5"
              alignItems="center"
              borderWidth={1}
              borderColor="rgba(0,0,0,0.05)"
              shadowColor="#000"
              shadowOpacity={0.04}
              shadowRadius={8}
              elevation={2}
            >
              <XStack gap="$3" alignItems="center" width="100%">
                <YStack
                  backgroundColor={profileDetails.bgColor}
                  padding={10}
                  borderRadius={100}
                >
                  <Feather name={profileDetails.icon as any} size={22} color={profileDetails.color} />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={11} fontWeight="800" color="rgba(0,0,0,0.4)" letterSpacing={0.5}>
                    YOUR RISK PROFILE
                  </Text>
                  <Text fontSize={16} fontWeight="800" color={profileDetails.color} textTransform="uppercase">
                    {profileDetails.label}
                  </Text>
                </YStack>
                <Text fontSize={11} color="#DA291C" fontWeight="700" textTransform="uppercase">
                  Retake
                </Text>
              </XStack>
            </YStack>
          </TouchableOpacity>
        </MotiView>

        {/* Recommended Product Section */}
        {recommendedProduct && (
          <MotiView
            from={{ opacity: 0, translateY: 15 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100, type: 'timing', duration: 400 }}
          >
            <Text fontSize={18} fontWeight="800" color="black" marginBottom="$3" paddingLeft="$1">
              Recommended Pick for You
            </Text>

            <YStack
              backgroundColor="white"
              borderRadius={24}
              padding="$5"
              marginBottom="$6"
              borderWidth={1.5}
              borderColor="#DA291C"
              shadowColor="#DA291C"
              shadowOpacity={0.08}
              shadowRadius={16}
              elevation={4}
            >
              <XStack gap="$4" alignItems="center" marginBottom="$4">
                <YStack
                  width={48} height={48}
                  borderRadius={14}
                  backgroundColor="rgba(218,41,28,0.1)"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Feather name={recommendedProduct.icon as any} size={22} color="#DA291C" />
                </YStack>
                <YStack flex={1}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text fontSize={16} fontWeight="800" color="black">{recommendedProduct.name}</Text>
                    <YStack backgroundColor="rgba(218,41,28,0.1)" paddingHorizontal="$2.5" paddingVertical={3} borderRadius={8}>
                      <Text fontSize={10} fontWeight="800" color="#DA291C" letterSpacing={0.5}>BEST MATCH</Text>
                    </YStack>
                  </XStack>
                  <XStack gap="$3" marginTop="$1">
                    <XStack gap="$1" alignItems="center">
                      <Feather name="trending-up" size={11} color="#4CAF50" />
                      <Text fontSize={11} color="#4CAF50" fontWeight="600">{recommendedProduct.expectedReturn}</Text>
                    </XStack>
                    <XStack gap="$1" alignItems="center">
                      <Feather name="activity" size={11} color="rgba(0,0,0,0.4)" />
                      <Text fontSize={11} color="rgba(0,0,0,0.45)">{recommendedProduct.risk} Risk</Text>
                    </XStack>
                  </XStack>
                </YStack>
              </XStack>

              <Text fontSize={14} color="rgba(0,0,0,0.6)" lineHeight={20} marginBottom="$4">
                {recommendedProduct.description}
              </Text>

              {/* Rationale Bubble */}
              <YStack
                backgroundColor="rgba(218,41,28,0.04)"
                borderWidth={1}
                borderColor="rgba(218,41,28,0.12)"
                borderRadius={16}
                padding="$4"
                marginBottom="$5"
              >
                <XStack gap="$2" alignItems="flex-start" marginBottom="$1">
                  <Feather name="info" size={14} color="#DA291C" style={{ marginTop: 2 }} />
                  <Text fontSize={12} fontWeight="800" color="#DA291C" letterSpacing={0.5}>WHY THIS WAS SELECTED</Text>
                </XStack>
                <Text fontSize={13} color="rgba(0,0,0,0.65)" lineHeight={18}>
                  {recommendedReason}
                </Text>
              </YStack>

              <Button
                size="$5"
                backgroundColor="#DA291C"
                color="white"
                borderRadius={16}
                height={54}
                fontWeight="bold"
                fontSize={15}
                pressStyle={{ opacity: 0.85, scale: 0.98 }}
                onPress={() => handleSelectProduct(recommendedProductId)}
              >
                Select & Continue →
              </Button>
            </YStack>
          </MotiView>
        )}

        {/* Explore Other Options Section */}
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: 'timing', duration: 400 }}
        >
          <Text fontSize={18} fontWeight="800" color="black" marginBottom="$3" paddingLeft="$1">
            Explore Other Products
          </Text>

          <YStack gap="$3.5">
            {otherProducts.map((product, i) => {
              const rationale = getRankingExplanation(product.id, riskProfile);
              return (
                <MotiView
                  key={product.id}
                  from={{ opacity: 0, translateY: 15 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 250 + i * 50 }}
                >
                  <TouchableOpacity onPress={() => handleSelectProduct(product.id)} activeOpacity={0.85}>
                    <GlassCard padding="$4.5" backgroundColor="white" borderColor="rgba(0,0,0,0.05)">
                      <XStack gap="$4" alignItems="center">
                        <YStack
                          width={44} height={44}
                          borderRadius={12}
                          backgroundColor="rgba(0,0,0,0.04)"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Feather name={product.icon as any} size={20} color="#555" />
                        </YStack>
                        <YStack flex={1} gap="$1">
                          <XStack justifyContent="space-between" alignItems="center">
                            <Text fontSize={15} fontWeight="800" color="black">{product.name}</Text>
                          </XStack>
                          <Text fontSize={12.5} color="rgba(0,0,0,0.5)" lineHeight={17}>{product.description}</Text>

                          {/* Stats */}
                          <XStack gap="$3" marginTop="$1" marginBottom="$2">
                            <XStack gap="$1" alignItems="center">
                              <Feather name="trending-up" size={10} color="#4CAF50" />
                              <Text fontSize={10} color="#4CAF50" fontWeight="600">{product.expectedReturn}</Text>
                            </XStack>
                            <XStack gap="$1" alignItems="center">
                              <Feather name="activity" size={10} color="rgba(0,0,0,0.4)" />
                              <Text fontSize={10} color="rgba(0,0,0,0.45)">{product.risk}</Text>
                            </XStack>
                          </XStack>

                          {/* Inline Ranking Explanation */}
                          <YStack borderTopWidth={1} borderColor="rgba(0,0,0,0.04)" paddingTop="$2" marginTop="$1">
                            <Text fontSize={11} color="#666" style={{ fontStyle: 'italic' }} lineHeight={15}>
                              {rationale}
                            </Text>
                          </YStack>
                        </YStack>
                        <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.25)" />
                      </XStack>
                    </GlassCard>
                  </TouchableOpacity>
                </MotiView>
              );
            })}
          </YStack>
        </MotiView>
      </ScrollView>
    </YStack>
  );
}
