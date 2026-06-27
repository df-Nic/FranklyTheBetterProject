import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { XStack, YStack, Text } from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useRouter, usePathname } from 'expo-router';

const NAV_ITEMS = [
  { label: 'Home',         icon: 'home',           route: '/(tabs)/home'    },
  { label: 'Plan',         icon: 'trending-up',    route: '/(tabs)/plan'    },
  { label: 'Pay',          icon: 'repeat',         route: '/(tabs)/pay'     },
  { label: 'Rewards',      icon: 'gift',           route: '/(tabs)/rewards' },
  { label: 'More',         icon: 'more-horizontal', route: '/(tabs)/more'   },
] as const;

interface Props {
  /** The route key of the tab that should appear active. Defaults to matching by pathname. */
  activeRoute?: string;
}

export function StandaloneNavBar({ activeRoute }: Props) {
  const router = useRouter();
  const pathname = usePathname();

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
      zIndex={200}
    >
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      <XStack flex={1} alignItems="center" justifyContent="space-around" paddingHorizontal="$2">
        {NAV_ITEMS.map((item) => {
          const isFocused = activeRoute
            ? activeRoute === item.route
            : pathname === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={item.label}
              onPress={() => router.replace(item.route as any)}
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
                  <Feather
                    name={item.icon as any}
                    size={20}
                    color={isFocused ? '#DA291C' : 'rgba(0,0,0,0.5)'}
                  />
                </MotiView>
                <Text
                  fontSize={10}
                  fontWeight={isFocused ? 'bold' : 'normal'}
                  color={isFocused ? '#DA291C' : 'rgba(0,0,0,0.5)'}
                >
                  {item.label}
                </Text>
              </YStack>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </XStack>
  );
}
