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
  SandboxState,
} from '../constants/planningOwlSandbox';

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'SGD',
  maximumFractionDigits: 0,
});

type GoalId = 'property' | 'custom';

const goalOptions: { id: GoalId; title: string; icon: keyof typeof Feather.glyphMap; enabled: boolean }[] = [
  { id: 'property', title: 'Buying a property', icon: 'home', enabled: true },
  { id: 'custom', title: 'Save for something else', icon: 'target', enabled: true },
];

export default function PlanningOwlSandboxHandoffScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    monthlySavings?: string;
    timelineYears?: string;
    projectedTotal?: string;
    suggestedTag?: SandboxState['suggestedTag'];
  }>();
  const [pickerOpen, setPickerOpen] = useState(false);

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

  const initialGoal = getSuggestedGoal(sandbox.suggestedTag);
  const [selectedGoal, setSelectedGoal] = useState<GoalId | null>(initialGoal);
  const mapping = selectedGoal ? GOAL_FIELD_MAPPINGS[selectedGoal] : null;
  const canCreatePlan = Boolean(selectedGoal);

  const createPlan = () => {
    if (!mapping) {
      router.push('/(tabs)/planning-owl');
      return;
    }

    const carried = buildPrefilledParams(sandbox, mapping);
    if (selectedGoal === 'custom') {
      router.push({
        pathname: '/(tabs)/planning-owl',
        params: {
          startStep: 'customQuestion1',
          prefillCustomGoalName: sandbox.suggestedTag === 'rainy_day' ? 'Rainy day fund' : undefined,
          prefillCustomTargetAmount: carried.targetAmount ? String(carried.targetAmount) : undefined,
          prefillCustomMonthlySavings: carried.monthlySavings ? String(carried.monthlySavings) : undefined,
          prefillCustomTimeline: carried.timeline ? String(carried.timeline) : undefined,
        },
      });
      return;
    }

    router.push({
      pathname: '/(tabs)/planning-owl',
      params: {
        startStep: 'question1',
        prefillTimeline: carried.timeline ? String(carried.timeline) : undefined,
        prefillDownpayment: carried.downpayment ? String(carried.downpayment) : undefined,
      },
    });
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHeader title="Make it real" subtitle="Carry over what fits" onBack={() => router.back()} />

        <MotiView from={{ opacity: 0, translateX: 28 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 260 }}>
          <YStack gap="$5">
            <YStack gap="$2">
              <Text fontSize={30} fontWeight="900" color="#111820">
                Turn these numbers into a plan
              </Text>
              <Text fontSize={15} color="rgba(23,32,48,0.58)" lineHeight={22}>
                Planning Owl can reuse the numbers that match your chosen goal and ask fresh for the rest.
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

            <GoalSummaryCard mapping={mapping} selectedGoal={selectedGoal} suggestedTag={sandbox.suggestedTag} />

            {pickerOpen && (
              <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 220 }}>
                <LifeEventPicker selectedGoal={selectedGoal} onSelectGoal={setSelectedGoal} />
              </MotiView>
            )}

            <YStack gap="$3" marginTop="$1">
              <Button height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={!canCreatePlan} onPress={createPlan}>
                {canCreatePlan ? 'Create plan with these numbers' : 'Coming soon'}
              </Button>
              <Button chromeless color="#5A6475" onPress={() => setPickerOpen((current) => !current)}>
                Choose a different goal instead
              </Button>
            </YStack>
          </YStack>
        </MotiView>
      </ScrollView>
    </YStack>
  );
}

function getSuggestedGoal(tag: SandboxState['suggestedTag']): GoalId | null {
  if (tag === 'rainy_day') return 'custom';
  return 'property';
}

function GoalSummaryCard({
  mapping,
  selectedGoal,
  suggestedTag,
}: {
  mapping: GoalFieldMapping | null;
  selectedGoal: GoalId | null;
  suggestedTag: SandboxState['suggestedTag'];
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
            {suggestedTag === 'property_deposit' ? 'SUGGESTED GOAL' : 'BEST AVAILABLE GOAL'}
          </Text>
          <Text fontSize={22} fontWeight="900" color="#111820" marginTop="$1">
            {selectedGoal === 'custom' ? 'Save for something else' : 'Buying a property'}
          </Text>
        </YStack>
        <Feather name={selectedGoal === 'custom' ? 'target' : 'home'} size={22} color="#DA291C" />
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

function LifeEventPicker({ selectedGoal, onSelectGoal }: { selectedGoal: GoalId | null; onSelectGoal: (goal: GoalId) => void }) {
  return (
    <YStack gap="$3">
      {goalOptions.map((event) => {
        const selected = selectedGoal === event.id;
        return (
          <Pressable key={event.id} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => onSelectGoal(event.id)}>
            <GlassCard padding="$4" borderColor={selected ? '#DA291C' : 'rgba(255,255,255,0.8)'}>
              <XStack alignItems="center" gap="$4">
                <YStack width={48} height={48} borderRadius={24} backgroundColor="rgba(218,41,28,0.1)" alignItems="center" justifyContent="center">
                  <Feather name={event.icon} size={22} color="#DA291C" />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={17} fontWeight="800" color="black">
                    {event.title}
                  </Text>
                  <Text fontSize={12} color="rgba(0,0,0,0.5)" marginTop="$1">
                    Ready to create
                  </Text>
                </YStack>
                {selected && <Feather name="check-circle" size={20} color="#DA291C" />}
              </XStack>
            </GlassCard>
          </Pressable>
        );
      })}
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
