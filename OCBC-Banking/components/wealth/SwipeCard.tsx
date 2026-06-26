import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { Feather } from '@expo/vector-icons';

interface SwipeCardProps {
  headline: string;
  description: string;
  isTop: boolean;
  stackIndex: number; // 0 = top, 1 = second, 2 = third
  pan?: Animated.ValueXY; // only provided for the top card
}

export function SwipeCard({ headline, description, isTop, stackIndex, pan }: SwipeCardProps) {
  // Compute animated styles only for the top card
  const rotate = pan
    ? pan.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp',
      })
    : '0deg';


  const borderColor = pan
    ? pan.x.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ['rgba(218,41,28,0.8)', 'rgba(0,0,0,0.07)', 'rgba(76,175,80,0.8)'],
        extrapolate: 'clamp',
      })
    : 'rgba(0,0,0,0.07)';

  const borderWidth = pan
    ? pan.x.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [2.5, 1, 2.5],
        extrapolate: 'clamp',
      })
    : 1;

  const contentOpacity = pan
    ? pan.x.interpolate({
        inputRange: [-10, 0, 10],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      })
    : 1;

  const stackScale = 1 - stackIndex * 0.04;
  const stackTranslateY = stackIndex * 14;

  const cardStyle = isTop && pan
    ? {
        position: 'absolute' as const,
        width: '100%' as const,
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          { rotate },
          { scale: 1 },
        ],
        zIndex: 10,
      }
    : {
        position: 'absolute' as const,
        width: '100%' as const,
        transform: [
          { translateY: stackTranslateY },
          { scale: stackScale },
        ],
        zIndex: 10 - stackIndex,
      };

  return (
    <Animated.View style={cardStyle}>
      <Animated.View
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 24,
          minHeight: 290,
          borderWidth: borderWidth,
          borderColor: borderColor,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
          overflow: 'hidden',
        }}
      >

        <YStack flex={1} justifyContent="space-between" minHeight={240}>
          <YStack>
            <YStack
              backgroundColor="rgba(218,41,28,0.08)"
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius={10}
              alignSelf="flex-start"
              marginBottom="$4"
            >
              <Text fontSize={12} fontWeight="700" color="#DA291C" letterSpacing={0.5}>
                SCENARIO
              </Text>
            </YStack>
            <Text fontSize={22} fontWeight="800" color="black" lineHeight={30} marginBottom="$4">
              {headline}
            </Text>
            <Text fontSize={15} color="rgba(0,0,0,0.6)" lineHeight={24}>
              {description}
            </Text>
          </YStack>

          {isTop && (
            <Animated.View style={{ opacity: contentOpacity }}>
              <XStack justifyContent="space-between" marginTop="$6">
                <XStack alignItems="center" gap="$2" opacity={0.45}>
                  <Feather name="arrow-left" size={16} color="#DA291C" />
                  <Text fontSize={12} color="#DA291C" fontWeight="600">Not for me</Text>
                </XStack>
                <XStack alignItems="center" gap="$2" opacity={0.45}>
                  <Text fontSize={12} color="#4CAF50" fontWeight="600">I'd do this</Text>
                  <Feather name="arrow-right" size={16} color="#4CAF50" />
                </XStack>
              </XStack>
            </Animated.View>
          )}
        </YStack>
      </Animated.View>
    </Animated.View>
  );
}
