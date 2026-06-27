import { DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import { TamaguiProvider } from 'tamagui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import tamaguiConfig from '../tamagui.config';
import { WealthProvider } from '../components/wealth/WealthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#F5F5F7');
  }, []);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F5F5F7',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        {/* WealthProvider lives here so the risk-profile quiz result persists
            across ALL routes, including those outside the /wealth/ group. */}
        <WealthProvider>
          <NavigationThemeProvider value={navTheme}>
            <Stack screenOptions={{ contentStyle: { backgroundColor: '#F5F5F7' } }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="landing" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="owl-tiering" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="planning-owl-sandbox" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="planning-owl-sandbox-handoff" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="recommendations" options={{ headerShown: false, animation: 'slide_from_right' }} />
              <Stack.Screen name="wealth" options={{ headerShown: false }} />
              <Stack.Screen name="smart-deposit-details" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="dark" />
          </NavigationThemeProvider>
        </WealthProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
