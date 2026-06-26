import { Stack, usePathname } from 'expo-router';
import { YStack } from 'tamagui';
import { WealthProvider } from '../../components/wealth/WealthContext';
import { AIAssistantFAB } from '../../components/wealth/AIAssistantFAB';
import { AIAssistantSheet } from '../../components/wealth/AIAssistantSheet';

export default function WealthLayout() {
  return (
    <WealthProvider>
      <YStack flex={1}>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="tier-dashboard" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="risk-swipe" />
          <Stack.Screen name="product-selection" />
          <Stack.Screen name="fund-narrowing" />
          <Stack.Screen name="cta" />
          <Stack.Screen name="dashboard" />
        </Stack>
        <AIAssistantSheet />
      </YStack>
    </WealthProvider>
  );
}
