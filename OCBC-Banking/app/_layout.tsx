import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { ThemeProvider, useTheme } from '../hooks/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { theme } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme === 'dark' ? '#121212' : '#F5F5F7');
  }, [theme]);

  const navTheme = theme === 'dark' ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#121212',
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F5F5F7',
    },
  };

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <NavigationThemeProvider value={navTheme}>
        <Stack screenOptions={{ contentStyle: { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="landing" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
