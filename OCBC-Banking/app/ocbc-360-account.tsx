import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Text, XStack, YStack } from 'tamagui';
import { ProductHeader, PlanningOwlRecommendationBanner, ProductSuccess, StickyProductCTA } from '../components/planning-owl/ProductDestination';
import { buildPlanningOwlProductContext, completePlanningOwlProductAction } from '../constants/planningOwlProductRoute';

const categories = [
  { title: 'Salary', detail: 'Use regular salary credits to organise monthly savings.', active: true },
  { title: 'Save', detail: 'Keep emergency cash and goal money separate.', active: true },
  { title: 'Spend', detail: 'Track card spend against recurring commitments.', active: true },
  { title: 'Insure', detail: 'Review protection needs when expenses change.', active: false },
  { title: 'Invest', detail: 'Consider longer-term money after near-term cash is set aside.', active: false },
  { title: 'Grow', detail: 'Build a habit across salary, spend, and save actions.', active: false },
];

export default function OCBC360AccountPage() {
  const router = useRouter();
  const context = buildPlanningOwlProductContext(useLocalSearchParams());
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <ProductSuccess
        title="Savings bucket set up"
        detail="The OCBC 360 savings action is now marked in your Planning Owl plan."
        buttonLabel="Back to plan"
        onBackToPlan={() => completePlanningOwlProductAction(router, context)}
      />
    );
  }

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ProductHeader title="OCBC 360 Account" />
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 128, paddingBottom: 130 }}>
        <PlanningOwlRecommendationBanner
          context={context}
          fallback="Suggested because salary credits and card spend are visible banking signals that can help organise monthly savings."
        />
        <Text fontSize={30} fontWeight="900" color="#111820" marginTop="$6">
          Set up your savings bucket
        </Text>
        <Text fontSize={15} color="rgba(23,32,48,0.58)" lineHeight={22} marginTop="$2" marginBottom="$5">
          Keep goal money separate while using OCBC 360 categories that match your plan.
        </Text>
        <YStack gap="$3">
          {categories.map((category) => (
            <XStack key={category.title} backgroundColor="white" borderRadius={10} padding="$4" gap="$3" alignItems="flex-start" borderWidth={1} borderColor={category.active ? 'rgba(218,41,28,0.25)' : 'rgba(20,30,45,0.06)'}>
              <YStack width={34} height={34} borderRadius={17} backgroundColor={category.active ? '#FFE2E8' : 'rgba(23,32,48,0.06)'} alignItems="center" justifyContent="center">
                <Feather name={category.active ? 'check' : 'circle'} size={16} color={category.active ? '#DA291C' : '#7A8494'} />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="900" color="#111820">{category.title}</Text>
                <Text fontSize={13} color="rgba(23,32,48,0.58)" lineHeight={19} marginTop="$1">{category.detail}</Text>
              </YStack>
            </XStack>
          ))}
        </YStack>
      </ScrollView>
      <StickyProductCTA label="Set up savings bucket" onPress={() => setDone(true)} />
    </YStack>
  );
}
