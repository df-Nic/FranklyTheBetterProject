import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Text, XStack, YStack } from 'tamagui';
import { ProductHeader, PlanningOwlRecommendationBanner, ProductSuccess, StickyProductCTA } from '../components/planning-owl/ProductDestination';
import { buildPlanningOwlProductContext, completePlanningOwlProductAction } from '../constants/planningOwlProductRoute';

const coverageAreas = [
  ['Income protection', 'Cover essential monthly expenses if income is disrupted.'],
  ['Critical illness', 'Prepare for treatment costs and recovery time.'],
  ['Family expenses', 'Protect recurring family costs as commitments change.'],
  ['Accident and health', 'Review accident and hospital coverage needs.'],
];

export default function OCBCInsurancePage() {
  const router = useRouter();
  const context = buildPlanningOwlProductContext(useLocalSearchParams());
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <ProductSuccess
        title="Coverage needs reviewed"
        detail="The OCBC Insurance review is now marked in your Planning Owl plan."
        buttonLabel="Back to plan"
        onBackToPlan={() => completePlanningOwlProductAction(router, context)}
      />
    );
  }

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ProductHeader title="OCBC Insurance" />
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 128, paddingBottom: 130 }}>
        <PlanningOwlRecommendationBanner
          context={context}
          fallback="Suggested because regular expenses can change after this milestone, and Owl can use your selected cost to estimate what to protect."
        />
        <Text fontSize={30} fontWeight="900" color="#111820" marginTop="$6">
          Review coverage needs
        </Text>
        <Text fontSize={15} color="rgba(23,32,48,0.58)" lineHeight={22} marginTop="$2" marginBottom="$5">
          Check which protection areas matter before expenses change.
        </Text>
        <YStack gap="$3">
          {coverageAreas.map(([title, detail]) => (
            <XStack key={title} backgroundColor="white" borderRadius={12} padding="$4" gap="$3" alignItems="flex-start">
              <YStack width={34} height={34} borderRadius={17} backgroundColor="#DDF5E4" alignItems="center" justifyContent="center">
                <Feather name="shield" size={16} color="#147A2E" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="900" color="#111820">{title}</Text>
                <Text fontSize={13} color="rgba(23,32,48,0.58)" lineHeight={19} marginTop="$1">{detail}</Text>
              </YStack>
            </XStack>
          ))}
        </YStack>
      </ScrollView>
      <StickyProductCTA label="Review coverage needs" onPress={() => setDone(true)} />
    </YStack>
  );
}
