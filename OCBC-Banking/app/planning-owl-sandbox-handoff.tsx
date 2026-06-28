import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Button, Text, XStack, YStack } from 'tamagui';
import { GlassCard } from '../components/GlassCard';
import {
  buildPrefilledParams,
  GOAL_FIELD_MAPPINGS,
  GoalFieldMapping,
  getRankedGoalSuggestions,
  RankedGoalSuggestion,
  SandboxGoalId,
  SandboxState,
} from '../constants/planningOwlSandbox';

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'SGD',
  maximumFractionDigits: 0,
});

const goalOptions: { id: SandboxGoalId; title: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: 'custom', title: 'Custom savings goal', icon: 'target' },
  { id: 'property', title: 'Property plan', icon: 'home' },
  { id: 'education', title: 'Education fund', icon: 'book-open' },
  { id: 'wedding', title: 'Wedding plan', icon: 'heart' },
  { id: 'family', title: 'Family emergency fund', icon: 'users' },
  { id: 'career_break', title: 'Career break', icon: 'briefcase' },
];

export default function PlanningOwlSandboxHandoffScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    monthlySavings?: string;
    timelineYears?: string;
    projectedTotal?: string;
    suggestedTag?: SandboxState['suggestedTag'];
  }>();
  const sandbox = useMemo<SandboxState>(() => {
    const monthlySavings = Number(params.monthlySavings ?? 500);
    const timelineYears = Number(params.timelineYears ?? 5);
    const projectedTotal = Number(params.projectedTotal ?? 0);
    return {
      monthlySavings,
      timelineYears,
      projectedTotal,
      suggestedTag: params.suggestedTag ?? 'property_deposit',
    };
  }, [params.monthlySavings, params.projectedTotal, params.suggestedTag, params.timelineYears]);

  const rankedSuggestions = useMemo(() => getRankedGoalSuggestions(sandbox), [sandbox]);
  const [selectedGoal, setSelectedGoal] = useState<SandboxGoalId>(rankedSuggestions[0]?.goalId ?? 'custom');
  const selectedSuggestion = rankedSuggestions.find((suggestion) => suggestion.goalId === selectedGoal) ?? rankedSuggestions[0];
  const mapping = selectedGoal ? GOAL_FIELD_MAPPINGS[selectedGoal] : null;

  const createPlan = () => {
    if (!mapping) {
      router.replace('/(tabs)/planning-owl');
      return;
    }

    const carried = buildPrefilledParams(sandbox, mapping);
    const timeline = getTimelineAnswer(sandbox.timelineYears);
    if (selectedGoal === 'custom') {
      router.replace({
        pathname: '/(tabs)/planning-owl',
        params: {
          entrySource: 'sandbox',
          startStep: 'customQuestion1',
          prefillCustomGoalName: selectedSuggestion?.title === 'Emergency savings' ? 'Emergency savings' : undefined,
          prefillCustomTargetAmount: carried.targetAmount ? String(carried.targetAmount) : undefined,
          prefillCustomMonthlySavings: carried.monthlySavings ? String(carried.monthlySavings) : undefined,
          prefillCustomTimeline: carried.timeline ? String(carried.timeline) : undefined,
        },
      });
      return;
    }

    const baseParams = {
      entrySource: 'sandbox',
      startStep: 'question1',
      startEvent: selectedGoal,
    };

    if (selectedGoal === 'property') {
      router.replace({
        pathname: '/(tabs)/planning-owl',
        params: {
          ...baseParams,
          prefillTimeline: carried.timeline ? String(carried.timeline) : undefined,
          prefillDownpayment: carried.downpayment ? String(carried.downpayment) : undefined,
        },
      });
      return;
    }

    if (selectedGoal === 'education') {
      router.replace({
        pathname: '/(tabs)/planning-owl',
        params: {
          ...baseParams,
          prefillEducationCost: carried.educationCost ? String(carried.educationCost) : undefined,
          prefillEducationTimeframe: timeline,
        },
      });
      return;
    }

    if (selectedGoal === 'wedding') {
      router.replace({
        pathname: '/(tabs)/planning-owl',
        params: {
          ...baseParams,
          prefillWeddingBudget: carried.weddingBudget ? String(carried.weddingBudget) : undefined,
          prefillWeddingMonthlySavings: carried.weddingMonthlySavings ? String(carried.weddingMonthlySavings) : undefined,
          prefillWeddingTimeframe: timeline,
        },
      });
      return;
    }

    if (selectedGoal === 'family') {
      router.replace({
        pathname: '/(tabs)/planning-owl',
        params: {
          ...baseParams,
          prefillFamilyTimeframe: timeline,
        },
      });
      return;
    }

    router.replace({
      pathname: '/(tabs)/planning-owl',
      params: {
        ...baseParams,
        prefillCareerBreakTimeframe: timeline,
      },
    });
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHeader title="Make it real" subtitle="Owl found possible plans" onBack={() => router.back()} />

        <MotiView from={{ opacity: 0, translateX: 28 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 260 }}>
          <YStack gap="$5">
            <YStack gap="$2">
              <Text fontSize={30} fontWeight="900" color="#111820">
                Owl found possible plans
              </Text>
              <Text fontSize={15} color="rgba(23,32,48,0.58)" lineHeight={22}>
                Your monthly amount and timeline can fit different goals. Pick the one that feels closest.
              </Text>
            </YStack>

            <GlassCard padding="$5" gap="$3">
              <Text fontSize={16} fontWeight="900" color="#111820">
                Numbers summary
              </Text>
              <SummaryRow label="Monthly savings" value={currencyFormatter.format(sandbox.monthlySavings)} />
              <SummaryRow label="Timeline" value={`${sandbox.timelineYears} ${sandbox.timelineYears === 1 ? 'year' : 'years'}`} />
              <SummaryRow label="Projected total" value={currencyFormatter.format(sandbox.projectedTotal)} />
            </GlassCard>

            <RankedGoalList suggestions={rankedSuggestions} selectedGoal={selectedGoal} onSelectGoal={setSelectedGoal} />
            <GoalSummaryCard mapping={mapping} selectedGoal={selectedGoal} suggestion={selectedSuggestion} />

            <YStack gap="$3" marginTop="$1">
              <Button height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" onPress={createPlan}>
                Create this plan
              </Button>
            </YStack>
          </YStack>
        </MotiView>
      </ScrollView>
    </YStack>
  );
}

function getTimelineAnswer(timelineYears: number) {
  if (timelineYears <= 1) return '<1 year';
  if (timelineYears <= 2) return '1-2 years';
  if (timelineYears <= 4) return '3-4 years';
  return '5+ years';
}

function getGoalIcon(goalId: SandboxGoalId) {
  return goalOptions.find((goal) => goal.id === goalId)?.icon ?? 'target';
}

function RankedGoalList({
  suggestions,
  selectedGoal,
  onSelectGoal,
}: {
  suggestions: RankedGoalSuggestion[];
  selectedGoal: SandboxGoalId;
  onSelectGoal: (goal: SandboxGoalId) => void;
}) {
  return (
    <YStack gap="$3">
      <Text fontSize={16} fontWeight="900" color="#111820">
        Suggested plans
      </Text>
      {suggestions.map((suggestion, index) => {
        const selected = selectedGoal === suggestion.goalId;
        return (
          <Pressable key={`${suggestion.goalId}-${index}`} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => onSelectGoal(suggestion.goalId)}>
            <YStack padding="$4" gap="$2.5" borderRadius={12} backgroundColor={selected ? '#FFF1F4' : 'white'} borderWidth={1} borderColor={selected ? '#DA291C' : 'rgba(20,30,45,0.08)'}>
              <XStack alignItems="flex-start" gap="$3">
                <YStack width={38} height={38} borderRadius={19} backgroundColor={selected ? '#DA291C' : 'rgba(218,41,28,0.08)'} alignItems="center" justifyContent="center">
                  <Feather name={selected ? 'check' : getGoalIcon(suggestion.goalId)} size={17} color={selected ? 'white' : '#DA291C'} />
                </YStack>
                <YStack flex={1}>
                  <XStack alignItems="center" gap="$2" flexWrap="wrap">
                    <Text fontSize={16} fontWeight="900" color="#111820">
                      {suggestion.title}
                    </Text>
                    <XStack backgroundColor={selected ? '#DA291C' : 'rgba(23,32,48,0.06)'} paddingHorizontal="$2" paddingVertical="$1" borderRadius={8}>
                      <Text fontSize={10} color={selected ? 'white' : '#4A5770'} fontWeight="900">
                        {suggestion.fitLabel}
                      </Text>
                    </XStack>
                  </XStack>
                  <Text fontSize={12} color="rgba(23,32,48,0.62)" lineHeight={18} marginTop="$1">
                    {suggestion.reason}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Pressable>
        );
      })}
    </YStack>
  );
}

function GoalSummaryCard({
  mapping,
  selectedGoal,
  suggestion,
}: {
  mapping: GoalFieldMapping | null;
  selectedGoal: SandboxGoalId;
  suggestion?: RankedGoalSuggestion;
}) {
  if (!mapping) {
    return (
      <YStack padding="$5" gap="$4" borderRadius={16} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
        <XStack alignItems="center" gap="$3">
          <YStack width={44} height={44} borderRadius={22} backgroundColor="rgba(218,41,28,0.1)" alignItems="center" justifyContent="center">
            <Feather name="compass" size={20} color="#DA291C" />
          </YStack>
          <YStack flex={1}>
            <Text fontSize={18} fontWeight="900" color="#111820">
              Create a plan
            </Text>
            <Text fontSize={13} color="rgba(23,32,48,0.58)" lineHeight={19}>
              This looks more general, so Planning Owl will let you pick a goal first.
            </Text>
          </YStack>
        </XStack>
      </YStack>
    );
  }

  return (
    <YStack padding="$5" gap="$4" borderRadius={16} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
      <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
        <YStack flex={1}>
          <Text fontSize={12} color="#C9002B" fontWeight="900">
            WHAT CARRIES OVER
          </Text>
          <Text fontSize={22} fontWeight="900" color="#111820" marginTop="$1">
            {suggestion?.title ?? goalOptions.find((goal) => goal.id === selectedGoal)?.title}
          </Text>
        </YStack>
        <Feather name={getGoalIcon(selectedGoal)} size={22} color="#DA291C" />
      </XStack>

      <YStack gap="$3">
        <FieldList title="Carries over" fields={mapping.carries.map((field) => field.label)} accent />
        <FieldList title="Asked fresh" fields={mapping.asksNew.map((field) => field.label)} />
      </YStack>
    </YStack>
  );
}

function FieldList({ title, fields, accent = false }: { title: string; fields: string[]; accent?: boolean }) {
  return (
    <YStack gap="$2">
      <Text fontSize={12} color="rgba(23,32,48,0.55)" fontWeight="900" textTransform="uppercase">
        {title}
      </Text>
      {fields.map((field) => (
        <XStack key={field} alignItems="center" gap="$2">
          <YStack width={18} height={18} borderRadius={9} backgroundColor={accent ? '#DDF5E4' : '#FFF1F4'} alignItems="center" justifyContent="center">
            <Feather name={accent ? 'check' : 'plus'} size={11} color={accent ? '#147A2E' : '#C9002B'} />
          </YStack>
          <Text fontSize={14} color="#111820" fontWeight="700">
            {field}
          </Text>
        </XStack>
      ))}
    </YStack>
  );
}

function FlowHeader({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  return (
    <XStack justifyContent="space-between" alignItems="center" marginBottom="$6">
      <Button circular size="$3" backgroundColor="rgba(0,0,0,0.05)" onPress={onBack}>
        <Feather name="chevron-left" size={18} color="black" />
      </Button>
      <YStack alignItems="center">
        <Text fontSize={13} color="#DA291C" fontWeight="700">
          {title}
        </Text>
        <Text fontSize={11} color="rgba(0,0,0,0.5)">
          {subtitle}
        </Text>
      </YStack>
      <YStack width={36} />
    </XStack>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <XStack justifyContent="space-between" gap="$3">
      <Text fontSize={13} color="rgba(0,0,0,0.54)">
        {label}
      </Text>
      <Text flex={1} textAlign="right" fontSize={13} color="black" fontWeight="800">
        {value}
      </Text>
    </XStack>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 80,
  },
});
