import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Button, Text, XStack, YStack } from 'tamagui';
import { ProductHeader, PlanningOwlRecommendationBanner, ProductSuccess } from '../components/planning-owl/ProductDestination';
import { buildPlanningOwlProductContext, completePlanningOwlProductAction } from '../constants/planningOwlProductRoute';

export default function OCBCHomeLoanPage() {
  const router = useRouter();
  const context = buildPlanningOwlProductContext(useLocalSearchParams());
  const [done, setDone] = useState(false);
  const [completionType, setCompletionType] = useState<'application' | 'callback'>('application');
  const [selectedPackage, setSelectedPackage] = useState('fixed');

  const loanPackages = [
    {
      id: 'fixed',
      title: '2-year fixed rate package',
      tag: 'Owl pick',
      rate: 'From 3.35% p.a.',
      repayment: 'SGD 3,350 - 3,950 / month',
      detail: 'Keeps repayments predictable while you prepare for upfront home costs.',
      reason: 'Suggested because your saved home timeline is near-term, so stable monthly repayments may be easier to plan around.',
    },
    {
      id: 'sora',
      title: 'SORA floating package',
      tag: 'Flexible',
      rate: 'From 3M SORA + spread',
      repayment: 'SGD 3,100 - 4,250 / month',
      detail: 'Lets repayments move with market rates, with more flexibility if you want to review later.',
      reason: 'Suggested as a comparison because your regular salary credits can support repayment checks, but the monthly amount may move.',
    },
    {
      id: 'bridging',
      title: 'Bridging loan option',
      tag: 'If selling first',
      rate: 'Case-by-case review',
      repayment: 'Short-term support',
      detail: 'Helps cover timing gaps if sale proceeds arrive after the next home payment is due.',
      reason: 'Suggested only if your home purchase depends on money coming in later from another property or large payment.',
    },
  ];
  const selectedLoanPackage = loanPackages.find((loanPackage) => loanPackage.id === selectedPackage) ?? loanPackages[0];

  if (done) {
    return (
      <ProductSuccess
        title={completionType === 'callback' ? 'Home loan callback requested' : 'Loan application started'}
        detail={
          completionType === 'callback'
            ? 'OCBC will contact you about the selected home-loan package. This action is now marked in your Planning Owl plan.'
            : `${selectedLoanPackage.title} has been marked as checked in your Planning Owl plan.`
        }
        buttonLabel="Back to plan"
        onBackToPlan={() => completePlanningOwlProductAction(router, context)}
      />
    );
  }

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ProductHeader title="OCBC Home Loan" />
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 128, paddingBottom: 145 }}>
        <PlanningOwlRecommendationBanner
          context={context}
          fallback="Suggested because regular salary credits can help estimate a comfortable future monthly repayment."
        />
        <Text fontSize={30} fontWeight="900" color="#111820" marginTop="$6">
          Recommended home loans
        </Text>
        <Text fontSize={15} color="rgba(23,32,48,0.58)" lineHeight={22} marginTop="$2">
          Compare mock OCBC loan packages using your saved home plan before applying.
        </Text>
        <YStack backgroundColor="white" borderRadius={12} padding="$4" gap="$3" marginTop="$5">
          <DetailRow label="Property budget" value={context.recommendedAmount || 'SGD 800k - 1.2m'} />
          <DetailRow label="Timeline" value={context.timeline || '1-2 years'} />
          <DetailRow label="Estimated repayment" value="SGD 3,200 - 4,100 / month" />
          <DetailRow label="Affordability note" value="Uses regular salary credits" />
        </YStack>

        <YStack gap="$3" marginTop="$5">
          <Text fontSize={17} fontWeight="900" color="#111820">
            Loan packages Owl recommends
          </Text>
          {loanPackages.map((loanPackage) => {
            const active = selectedPackage === loanPackage.id;

            return (
              <YStack
                key={loanPackage.id}
                backgroundColor={active ? '#FFF1F4' : 'white'}
                borderRadius={12}
                padding="$4"
                gap="$3"
                borderWidth={1}
                borderColor={active ? '#DA291C' : 'rgba(20,30,45,0.08)'}
                onPress={() => setSelectedPackage(loanPackage.id)}
              >
                <XStack alignItems="flex-start" gap="$3">
                  <YStack width={38} height={38} borderRadius={19} backgroundColor={active ? '#DA291C' : 'rgba(218,41,28,0.08)'} alignItems="center" justifyContent="center">
                    <Feather name={active ? 'check' : 'home'} size={18} color={active ? 'white' : '#DA291C'} />
                  </YStack>
                  <YStack flex={1}>
                    <XStack alignItems="center" gap="$2" flexWrap="wrap">
                      <Text fontSize={16} fontWeight="900" color="#111820">
                        {loanPackage.title}
                      </Text>
                      <YStack backgroundColor={active ? '#DA291C' : 'rgba(23,32,48,0.06)'} paddingHorizontal="$2" paddingVertical="$1" borderRadius={8}>
                        <Text fontSize={10} color={active ? 'white' : '#4A5770'} fontWeight="900">
                          {loanPackage.tag}
                        </Text>
                      </YStack>
                    </XStack>
                    <Text fontSize={13} color="#C9002B" fontWeight="900" marginTop="$1">
                      {loanPackage.rate}
                    </Text>
                    <Text fontSize={12} color="rgba(23,32,48,0.6)" marginTop="$1">
                      {loanPackage.repayment}
                    </Text>
                  </YStack>
                </XStack>
                <Text fontSize={13} color="rgba(23,32,48,0.62)" lineHeight={19}>
                  {loanPackage.detail}
                </Text>
                <YStack backgroundColor="rgba(180,58,29,0.08)" borderRadius={10} padding="$3">
                  <Text fontSize={11} color="#6E3426" lineHeight={16}>
                    Why Owl suggests this: {loanPackage.reason}
                  </Text>
                </YStack>
              </YStack>
            );
          })}
        </YStack>
      </ScrollView>
      <YStack position="absolute" bottom={0} left={0} right={0} padding="$4" paddingBottom="$7" backgroundColor="rgba(245,245,247,0.92)" gap="$2">
        <Button
          height={50}
          borderRadius={25}
          backgroundColor="#DA291C"
          color="white"
          fontWeight="800"
          onPress={() => {
            setCompletionType('application');
            setDone(true);
          }}
        >
          Apply for selected loan
        </Button>
        <Button
          height={44}
          borderRadius={22}
          backgroundColor="white"
          color="#111820"
          fontWeight="800"
          onPress={() => {
            setCompletionType('callback');
            setDone(true);
          }}
        >
          Request callback
        </Button>
      </YStack>
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
