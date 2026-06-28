import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Button, Text, XStack, YStack } from 'tamagui';
import { PlanningOwlProductContext } from '../../constants/planningOwlProductActions';

export function ProductHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();

  return (
    <YStack position="absolute" top={0} left={0} right={0} zIndex={100}>
      <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFill} />
      <XStack paddingHorizontal={22} paddingTop={58} paddingBottom={15} alignItems="center" borderBottomWidth={1} borderColor="rgba(0,0,0,0.06)">
        <Button circular size="$3" backgroundColor="transparent" onPress={() => router.back()} marginRight="$3">
          <Feather name="chevron-left" size={26} color="#111820" />
        </Button>
        <YStack flex={1} alignItems="center" marginRight={42}>
          <Text fontSize={17} fontWeight="600" color="#242832">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize={11} color="rgba(23,32,48,0.52)" marginTop={2}>
              {subtitle}
            </Text>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
}

export function PlanningOwlRecommendationBanner({
  context,
  fallback,
}: {
  context: PlanningOwlProductContext;
  fallback: string;
}) {
  const insight = context.insight || fallback;

  return (
    <YStack padding="$4" gap="$2.5" borderRadius={14} backgroundColor="#FFF7F2" borderWidth={1} borderColor="#F4D7C8">
      <XStack alignItems="center" gap="$2.5">
        <YStack width={34} height={34} borderRadius={17} backgroundColor="white" alignItems="center" justifyContent="center">
          <FontAwesome5 name="brain" size={14} color="#B43A1D" />
        </YStack>
        <YStack flex={1}>
          <Text fontSize={12} color="#B43A1D" fontWeight="900">
            From Planning Owl
          </Text>
          <Text fontSize={14} color="#33211B" lineHeight={20} marginTop={2}>
            {insight}
          </Text>
        </YStack>
      </XStack>
      {(context.planTitle || context.scenarioTitle || context.timeline) && (
        <XStack gap="$2" flexWrap="wrap">
          {context.planTitle && <InfoChip label={context.planTitle} />}
          {context.scenarioTitle && <InfoChip label={context.scenarioTitle} />}
          {context.timeline && <InfoChip label={context.timeline} />}
        </XStack>
      )}
    </YStack>
  );
}

export function InfoChip({ label }: { label: string }) {
  return (
    <XStack borderWidth={1} borderColor="rgba(180,58,29,0.18)" paddingHorizontal="$2.5" paddingVertical="$1.5" borderRadius={10}>
      <Text fontSize={11} color="#6E5249" fontWeight="800">
        {label}
      </Text>
    </XStack>
  );
}

export function ProductSuccess({
  title,
  detail,
  buttonLabel,
  onBackToPlan,
}: {
  title: string;
  detail: string;
  buttonLabel: string;
  onBackToPlan: () => void;
}) {
  return (
    <YStack flex={1} backgroundColor="#F5F5F7" justifyContent="center" alignItems="center" padding="$6">
      <YStack width={84} height={84} borderRadius={42} backgroundColor="#DDF5E4" alignItems="center" justifyContent="center" marginBottom="$4">
        <Feather name="check" size={42} color="#147A2E" />
      </YStack>
      <Text fontSize={28} fontWeight="900" color="#111820" textAlign="center">
        {title}
      </Text>
      <Text fontSize={15} color="rgba(23,32,48,0.58)" textAlign="center" lineHeight={22} marginTop="$2" marginBottom="$6">
        {detail}
      </Text>
      <Button width="100%" height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" onPress={onBackToPlan}>
        {buttonLabel}
      </Button>
    </YStack>
  );
}

export function StickyProductCTA({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <YStack position="absolute" bottom={0} left={0} right={0} padding="$4" paddingBottom="$7">
      <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
      <Button height={54} borderRadius={4} backgroundColor={disabled ? '#C9D1D6' : '#3D5663'} color="white" fontSize={17} fontWeight="800" disabled={disabled} onPress={onPress}>
        {label}
      </Button>
    </YStack>
  );
}
