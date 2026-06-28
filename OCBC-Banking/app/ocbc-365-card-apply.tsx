import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button, Text, XStack, YStack } from 'tamagui';
import { ProductHeader, ProductSuccess } from '../components/planning-owl/ProductDestination';
import { buildPlanningOwlProductContext, completePlanningOwlProductAction } from '../constants/planningOwlProductRoute';

export default function OCBC365CardApplyPage() {
  const router = useRouter();
  const context = buildPlanningOwlProductContext(useLocalSearchParams());
  const [submitted, setSubmitted] = useState(false);
  const [consents, setConsents] = useState<string[]>([]);

  if (submitted) {
    return (
      <ProductSuccess
        title="Application started"
        detail="Your OCBC 365 application has been linked back to this Planning Owl recommendation."
        buttonLabel="Back to plan"
        onBackToPlan={() => completePlanningOwlProductAction(router, context)}
      />
    );
  }

  const toggleConsent = (value: string) => {
    setConsents((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  return (
    <YStack flex={1} backgroundColor="white">
      <ProductHeader title="OCBC 365 Credit Card" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 150, paddingBottom: 120 }}>
        <Text fontSize={28} fontWeight="900" color="#20242C" marginBottom="$7">
          Personal Details
        </Text>
        <FieldRow label="Education Level" />
        <FieldRow label="No. of dependents" />

        <Text fontSize={13} color="#3D4650" fontWeight="900" marginTop="$5">
          DATA PROTECTION AND MARKETING CONSENT
        </Text>
        <Text fontSize={17} color="#323840" lineHeight={26} marginTop="$1" marginBottom="$5">
          I consent to the collection, use, and disclosure of my personal data by OCBC and its related corporations in accordance with OCBC&apos;s Data Protection Policy.
        </Text>

        <YStack backgroundColor="#FFF1F4" padding="$3.5" borderRadius={8} marginBottom="$4">
          <Text fontSize={15} color="#323840" lineHeight={22}>
            Never miss out on our marketing deals and offers via:
          </Text>
        </YStack>

        {['Emails and other electronic channels', 'Phone number-based messages', 'Post', 'Phone calls'].map((item) => (
          <Pressable key={item} onPress={() => toggleConsent(item)}>
            <XStack alignItems="center" gap="$3" paddingVertical="$2.5">
              <YStack width={28} height={28} borderRadius={4} borderWidth={1.4} borderColor="#405766" alignItems="center" justifyContent="center">
                {consents.includes(item) && <Feather name="check" size={17} color="#DA291C" />}
              </YStack>
              <Text flex={1} fontSize={20} fontWeight="700" color="#2D323A">
                {item}
              </Text>
            </XStack>
          </Pressable>
        ))}
      </ScrollView>
      <YStack position="absolute" bottom={0} left={0} right={0} padding="$4" paddingBottom="$7" backgroundColor="white">
        <Button height={52} borderRadius={4} borderWidth={1} borderColor="#3D5663" backgroundColor="white" color="#3D5663" fontSize={17} fontWeight="800" onPress={() => setSubmitted(true)}>
          Next
        </Button>
      </YStack>
    </YStack>
  );
}

function FieldRow({ label }: { label: string }) {
  return (
    <XStack height={86} borderBottomWidth={1} borderColor="#8C9298" alignItems="center">
      <Text flex={1} fontSize={20} color="#4A4F57">
        {label}
      </Text>
      <Feather name="chevron-down" size={22} color="#111820" />
    </XStack>
  );
}
