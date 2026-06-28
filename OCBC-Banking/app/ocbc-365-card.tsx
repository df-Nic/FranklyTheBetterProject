import React from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Text, XStack, YStack } from 'tamagui';
import { ProductHeader, PlanningOwlRecommendationBanner, StickyProductCTA } from '../components/planning-owl/ProductDestination';
import { buildPlanningOwlProductContext } from '../constants/planningOwlProductRoute';

export default function OCBC365CardPage() {
  const router = useRouter();
  const context = buildPlanningOwlProductContext(useLocalSearchParams());

  return (
    <YStack flex={1} backgroundColor="white">
      <ProductHeader title="Credit Card" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 132, paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <YStack alignItems="center" paddingVertical="$5">
          <Text color="#DA291C" fontWeight="900" fontSize={28}>
            OCBC
          </Text>
          <Text color="#EF6F76" fontWeight="900" fontSize={86} lineHeight={94}>
            365
          </Text>
          <Text color="#6A707A" fontWeight="900" fontSize={24} marginTop={-10}>
            VISA Signature
          </Text>
        </YStack>

        <PlanningOwlRecommendationBanner
          context={context}
          fallback="Suggested because recurring card/debit spend can be tracked against your planned-payment budget."
        />

        <Text fontSize={27} fontWeight="900" color="#20242C" marginTop="$6" marginBottom="$4">
          OCBC 365 Credit Card
        </Text>

        <ProductSection title="CARD BENEFITS" items={[
          '5% cashback on dining and food delivery',
          '3% cashback on groceries, transport, streaming and recurring bills',
          'Up to 29.5% off fuel at Caltex, Esso and Sinopec',
        ]} />

        <ProductSection title="FEES AND CHARGES" items={[
          'Principal card: SGD 196.20 a year, free for the first 2 years',
          'Supplementary card: SGD 98.10 a year, free for the first 2 years',
        ]} />
      </ScrollView>
      <StickyProductCTA
        label="Apply with this plan"
        onPress={() => router.push({ pathname: '/ocbc-365-card-apply', params: { ...context } })}
      />
    </YStack>
  );
}

function ProductSection({ title, items }: { title: string; items: string[] }) {
  return (
    <YStack marginBottom="$6">
      <Text fontSize={13} fontWeight="900" color="#5A606B" marginBottom="$3">
        {title}
      </Text>
      <YStack gap="$2.5">
        {items.map((item) => (
          <XStack key={item} gap="$3" alignItems="flex-start">
            <Feather name="circle" size={7} color="#7B8493" style={{ marginTop: 8 }} />
            <Text flex={1} fontSize={18} color="#5A606B" lineHeight={28}>
              {item}
            </Text>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}
