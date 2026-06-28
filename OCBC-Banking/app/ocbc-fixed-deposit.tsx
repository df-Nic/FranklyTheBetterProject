import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, XStack, YStack } from 'tamagui';
import { ProductHeader, PlanningOwlRecommendationBanner, ProductSuccess, StickyProductCTA } from '../components/planning-owl/ProductDestination';
import { buildPlanningOwlProductContext, completePlanningOwlProductAction } from '../constants/planningOwlProductRoute';

export default function OCBCFixedDepositPage() {
  const router = useRouter();
  const context = buildPlanningOwlProductContext(useLocalSearchParams());
  const [review, setReview] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <ProductSuccess
        title="Fixed deposit placed"
        detail="This staged-cash action is now marked in your Planning Owl plan."
        buttonLabel="Back to plan"
        onBackToPlan={() => completePlanningOwlProductAction(router, context)}
      />
    );
  }

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ProductHeader title="Fixed Deposit" />
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 128, paddingBottom: 130 }}>
        <PlanningOwlRecommendationBanner
          context={context}
          fallback="Suggested because your planned payment date is known, so this money can be kept separate from daily spending."
        />
        <Text fontSize={30} fontWeight="900" color="#111820" marginTop="$6">
          {review ? 'Review placement' : 'Place a fixed deposit'}
        </Text>
        <YStack backgroundColor="white" borderRadius={12} padding="$4" gap="$3" marginTop="$4">
          <DetailRow label="Funding account" value="OCBC 360 Account" />
          <DetailRow label="Placement amount" value={context.recommendedAmount || 'SGD 50,000'} />
          <DetailRow label="Tenure" value="6 months" />
          <DetailRow label="Maturity instruction" value="Return principal and interest" />
        </YStack>
        {review && (
          <YStack backgroundColor="#FFF7F2" borderRadius={12} padding="$4" marginTop="$4">
            <Text fontSize={14} color="#6E3426" lineHeight={20}>
              This keeps known payment money separate from daily spending while the plan is waiting for its payment date.
            </Text>
          </YStack>
        )}
      </ScrollView>
      <StickyProductCTA label={review ? 'Confirm placement' : 'Place fixed deposit'} onPress={() => review ? setDone(true) : setReview(true)} />
    </YStack>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <XStack justifyContent="space-between" alignItems="flex-start" gap="$4">
      <Text flex={1} fontSize={13} color="rgba(23,32,48,0.55)">{label}</Text>
      <Text flex={1} fontSize={15} fontWeight="900" color="#111820" textAlign="right">{value}</Text>
    </XStack>
  );
}
