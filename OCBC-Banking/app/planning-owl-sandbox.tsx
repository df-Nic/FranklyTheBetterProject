import React, { useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Button, Text, XStack, YStack } from 'tamagui';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { GlassCard } from '../components/GlassCard';
import { calculateProjection, getSuggestedTag, SandboxState } from '../constants/planningOwlSandbox';

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'SGD',
  maximumFractionDigits: 0,
});

const tagCopy: Record<SandboxState['suggestedTag'], { label: string; detail: string; icon: keyof typeof Feather.glyphMap }> = {
  rainy_day: {
    label: 'Rainy-day range',
    detail: 'This looks like short-term emergency savings.',
    icon: 'umbrella',
  },
  property_deposit: {
    label: 'Property deposit range',
    detail: 'These numbers can carry into a property plan.',
    icon: 'home',
  },
  bigger_goal: {
    label: 'Bigger goal range',
    detail: 'A longer horizon may suit a full Planning Owl plan.',
    icon: 'trending-up',
  },
};

export default function PlanningOwlSandboxScreen() {
  const router = useRouter();
  const [monthlySavings, setMonthlySavings] = useState(500);
  const [timelineYears, setTimelineYears] = useState(5);

  const projectedTotal = useMemo(() => calculateProjection(monthlySavings, timelineYears), [monthlySavings, timelineYears]);
  const suggestedTag = getSuggestedTag(projectedTotal);
  const tag = tagCopy[suggestedTag];

  const sandboxState: SandboxState = {
    monthlySavings,
    timelineYears,
    projectedTotal,
    suggestedTag,
  };

  const startHandoff = () => {
    router.push({
      pathname: '/planning-owl-sandbox-handoff',
      params: {
        monthlySavings: String(sandboxState.monthlySavings),
        timelineYears: String(sandboxState.timelineYears),
        projectedTotal: String(sandboxState.projectedTotal),
        suggestedTag: sandboxState.suggestedTag,
      },
    });
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHeader title="Quick estimate" subtitle="Start with what you can save" onBack={() => router.back()} />

        <MotiView from={{ opacity: 0, translateX: 28 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', duration: 260 }}>
          <YStack gap="$5">
            <YStack gap="$2">
              <Text fontSize={30} fontWeight="900" color="#111820">
                Not sure what to plan for?
              </Text>
              <Text fontSize={15} color="rgba(23,32,48,0.58)" lineHeight={22}>
                Enter a monthly amount and timeline. Owl will show what kind of goal it could support.
              </Text>
            </YStack>

            <GlassCard padding="$5" gap="$5">
              <SliderRow
                label="Monthly savings"
                value={monthlySavings}
                min={100}
                max={3000}
                step={100}
                formattedValue={currencyFormatter.format(monthlySavings)}
                onChange={setMonthlySavings}
              />
              <SliderRow
                label="Timeline"
                value={timelineYears}
                min={1}
                max={15}
                step={1}
                formattedValue={`${timelineYears} ${timelineYears === 1 ? 'year' : 'years'}`}
                onChange={setTimelineYears}
              />
            </GlassCard>

            <YStack padding="$5" gap="$4" borderRadius={16} backgroundColor="#111820">
              <Text fontSize={12} color="rgba(255,255,255,0.58)" fontWeight="800" textTransform="uppercase">
                Mock projected total
              </Text>
              <Text fontSize={39} fontWeight="900" color="white">
                {currencyFormatter.format(projectedTotal)}
              </Text>
              <XStack alignSelf="flex-start" alignItems="center" gap="$2" backgroundColor="rgba(255,255,255,0.12)" paddingHorizontal="$3" paddingVertical="$2" borderRadius={18}>
                <Feather name={tag.icon} size={14} color="#FFFFFF" />
                <Text fontSize={12} color="white" fontWeight="900">
                  {tag.label}
                </Text>
              </XStack>
              <Text fontSize={13} color="rgba(255,255,255,0.68)" lineHeight={20}>
                {tag.detail}
              </Text>
            </YStack>

            <YStack gap="$3" marginTop="$2">
              <Button height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" onPress={startHandoff}>
                Make this a real plan
              </Button>
              <Button chromeless color="#5A6475" onPress={() => router.back()}>
                Keep browsing without saving
              </Button>
            </YStack>
          </YStack>
        </MotiView>
      </ScrollView>
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

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  formattedValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formattedValue: string;
  onChange: (value: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(1);
  const startProgress = useRef(0);
  const progress = useSharedValue((value - min) / (max - min));

  const updateFromProgress = (nextProgress: number) => {
    const clamped = Math.max(0, Math.min(1, nextProgress));
    const rawValue = min + clamped * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const boundedValue = Math.max(min, Math.min(max, steppedValue));
    progress.value = withTiming((boundedValue - min) / (max - min), { duration: 90 });
    onChange(boundedValue);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(Math.max(1, event.nativeEvent.layout.width));
  };

  const handleGesture = (event: PanGestureHandlerGestureEvent) => {
    const { state, translationX } = event.nativeEvent;
    if (state === State.BEGAN) {
      startProgress.current = (value - min) / (max - min);
    }
    if (state === State.ACTIVE) {
      updateFromProgress(startProgress.current + translationX / trackWidth);
    }
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * trackWidth - 12 }],
  }));

  return (
    <YStack gap="$3">
      <XStack justifyContent="space-between" alignItems="center" gap="$4">
        <Text fontSize={15} color="#111820" fontWeight="900">
          {label}
        </Text>
        <Text fontSize={17} color="#DA291C" fontWeight="900">
          {formattedValue}
        </Text>
      </XStack>
      <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
        <Animated.View onLayout={handleLayout} style={styles.sliderHitbox}>
          <YStack height={8} borderRadius={4} backgroundColor="rgba(17,24,32,0.1)" overflow="hidden">
            <Animated.View style={[styles.sliderFill, fillStyle]} />
          </YStack>
          <Animated.View style={[styles.sliderThumb, thumbStyle]} />
        </Animated.View>
      </PanGestureHandler>
      <XStack justifyContent="space-between">
        <Text fontSize={11} color="rgba(23,32,48,0.48)">
          {label === 'Timeline' ? `${min} yr` : currencyFormatter.format(min)}
        </Text>
        <Text fontSize={11} color="rgba(23,32,48,0.48)">
          {label === 'Timeline' ? `${max} yrs` : currencyFormatter.format(max)}
        </Text>
      </XStack>
    </YStack>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 80,
  },
  sliderHitbox: {
    height: 34,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DA291C',
  },
  sliderThumb: {
    position: 'absolute',
    left: 0,
    top: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: '#DA291C',
    shadowColor: '#111820',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});
