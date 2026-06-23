import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { RECOMMENDED_PRODUCTS } from '../../constants/depositOwlData';
import { FinancialProfile } from '../../components/deposit-owl/FinancialProfile';
import { ProductCard } from '../../components/deposit-owl/ProductCard';

export default function DepositOwlPage() {
  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      
      {/* Dynamic Background Elements */}
      <BackgroundOrb
        size={400}
        color="rgba(218, 41, 28, 0.15)"
        top="-10%" left="-20%"
        fromOpacity={0.4}
        toOpacity={0.8}
      />
      <BackgroundOrb
        size={300}
        color="rgba(33, 150, 243, 0.15)"
        bottom="-10%" right="-10%"
        fromOpacity={0.3}
        toOpacity={0.6}
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
          alignItems="center"
          gap="$3"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          <YStack backgroundColor="#DA291C" padding="$2" borderRadius={12}>
            <MaterialCommunityIcons name="owl" size={24} color="white" />
          </YStack>
          <YStack flex={1}>
            <Text fontSize={20} fontWeight="bold" color="black">
              Deposit Owl Recommendations
            </Text>
            <Text fontSize={12} color="rgba(0,0,0,0.5)">
              These products are tailored to your financial habits.
            </Text>
          </YStack>
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 100 }}>

        <FinancialProfile />

        {/* Recommended Products Grid */}
        <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 200 }}>
          <Text fontSize={18} fontWeight="bold" color="black" marginBottom="$1">
            Curated For You
          </Text>
          <Text fontSize={13} color="rgba(0,0,0,0.6)" marginBottom="$4" lineHeight={18}>
            Because you are planning for a family and saving consistently, Deposit Owl picked these tailored options just for you:
          </Text>

          <YStack gap="$4">
            {RECOMMENDED_PRODUCTS.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </YStack>
        </MotiView>

      </ScrollView>

    </YStack>
  );
}
