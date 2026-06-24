import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { XStack, YStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

let hasSeenLandingPage = false;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const router = useRouter();

  return (
    <XStack
      position="absolute"
      bottom={30}
      left={20}
      right={20}
      height={70}
      borderRadius={35}
      overflow="hidden"
      borderWidth={1}
      borderColor="rgba(255,255,255,0.8)"
      backgroundColor="rgba(255,255,255,0.7)"
      elevation={10}
      shadowColor="#000"
      shadowRadius={20}
      shadowOpacity={0.1}
    >
      <BlurView
        intensity={80}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      <XStack flex={1} alignItems="center" justifyContent="space-around" paddingHorizontal="$2">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const onPress = () => {
            if (route.name === 'more') {
              if (!hasSeenLandingPage) {
                hasSeenLandingPage = true;
                router.push('/wealth/tier-dashboard');
              } else {
                router.push('/wealth/dashboard');
              }
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
            >
              <YStack alignItems="center" gap="$1">
                <MotiView
                  animate={{
                    scale: isFocused ? 1.1 : 1,
                    translateY: isFocused ? -2 : 0,
                  }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  {options.tabBarIcon && options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? '#DA291C' : 'rgba(0,0,0,0.5)',
                    size: 20,
                  })}
                </MotiView>
                <Text 
                  fontSize={10} 
                  fontWeight={isFocused ? 'bold' : 'normal'}
                  color={isFocused ? '#DA291C' : 'rgba(0,0,0,0.5)'}
                >
                  {String(label)}
                </Text>
              </YStack>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </XStack>
  );
}
