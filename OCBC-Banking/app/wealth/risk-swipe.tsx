import React, { useState, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { SwipeCard } from '../../components/wealth/SwipeCard';
import { useWealth } from '../../components/wealth/WealthContext';
import { RISK_CARDS } from '../../components/wealth/mockData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

const RISK_LABELS = [
  { range: [0, 2], label: 'Conservative', emoji: '🛡️', description: 'You prefer stability and capital protection over high returns.' },
  { range: [3, 5], label: 'Balanced', emoji: '⚖️', description: 'You\'re comfortable with moderate risk for steady growth.' },
  { range: [6, 8], label: 'Growth', emoji: '🚀', description: 'You embrace volatility for the potential of higher long-term returns.' },
];

function getRiskProfile(score: number) {
  return RISK_LABELS.find(r => score >= r.range[0] && score <= r.range[1]) ?? RISK_LABELS[1];
}

export default function RiskSwipeScreen() {
  const router = useRouter();
  const { dispatch } = useWealth();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Each card gets its own pan instance to prevent snapping back
  const pans = useRef(RISK_CARDS.map(() => new Animated.ValueXY())).current;
  const pan = pans[currentIndex] || pans[pans.length - 1];

  const processSwipe = (direction: 'left' | 'right', currentIdx: number, currentScore: number) => {
    const card = RISK_CARDS[currentIdx];
    const isRiskSeeking =
      (direction === 'right' && card.riskSeekingAnswer === 'right') ||
      (direction === 'left' && card.riskSeekingAnswer === 'left');
    const newScore = currentScore + (isRiskSeeking ? 1 : 0);
    const nextIndex = currentIdx + 1;

    if (nextIndex >= RISK_CARDS.length) {
      const profile = getRiskProfile(newScore);
      dispatch({ type: 'SET_RISK_PROFILE', riskProfile: profile.label as any });
      router.push('/wealth/product-selection');
    } else {
      setScore(newScore);
      setCurrentIndex(nextIndex);
    }
  };

  const swipeCard = (direction: 'left' | 'right') => {
    const targetX = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(pan, {
      toValue: { x: targetX, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      processSwipe(direction, currentIndex, score);
    });
  };

  const panResponder = React.useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeCard('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          swipeCard('left');
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 5,
          }).start();
        }
      },
    }),
    [currentIndex, score]
  );


  const visibleCards = RISK_CARDS.slice(currentIndex, currentIndex + 3);

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <BackgroundOrb size={350} color="rgba(218, 41, 28, 0.07)" top="-10%" right="-20%" fromOpacity={0.4} toOpacity={0.8} />

      {/* Header */}
      <YStack position="absolute" top={0} left={0} right={0} zIndex={100}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <XStack
          paddingHorizontal={24}
          paddingTop={60}
          paddingBottom={16}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          <Button
            circular size="$3"
            backgroundColor="rgba(0,0,0,0.05)"
            onPress={() => router.back()}
            pressStyle={{ opacity: 0.7 }}
          >
            <Feather name="arrow-left" size={18} color="black" />
          </Button>
          <YStack alignItems="center">
            <Text fontSize={17} fontWeight="700" color="black">Risk Profiling</Text>
            <Text fontSize={12} color="rgba(0,0,0,0.45)">
              {currentIndex + 1} of {RISK_CARDS.length}
            </Text>
          </YStack>
          <YStack width={36} />
        </XStack>
        {/* Progress bar */}
        <YStack backgroundColor="rgba(0,0,0,0.04)" height={3}>
          <MotiView
            animate={{ width: `${(currentIndex / RISK_CARDS.length) * 100}%` }}
            transition={{ type: 'timing', duration: 300 }}
            style={{ height: 3, backgroundColor: '#DA291C' }}
          />
        </YStack>
      </YStack>

      <YStack flex={1} paddingTop={120} paddingBottom={40} paddingHorizontal={24}>
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 100 }}>
          <Text fontSize={15} color="rgba(0,0,0,0.5)" textAlign="center" marginBottom="$6">
            Swipe right if you'd take this action, left if you wouldn't.
          </Text>
        </MotiView>

        {/* Card Stack — render back-to-front, attach panHandlers only on top card */}
        <YStack flex={1} alignItems="center" justifyContent="center">
          <YStack width="100%" position="relative" height={330}>
            {[...visibleCards].reverse().map((card, reversedIdx) => {
              const stackIndex = visibleCards.length - 1 - reversedIdx;
              const isTop = stackIndex === 0;
              return (
                <Animated.View
                  key={card.id}
                  {...(isTop ? panResponder.panHandlers : {})}
                  style={{ position: 'absolute', width: '100%', zIndex: 10 - stackIndex }}
                >
                  <SwipeCard
                    headline={card.headline}
                    description={card.description}
                    isTop={isTop}
                    stackIndex={stackIndex}
                    pan={pans[currentIndex + stackIndex]}
                  />
                </Animated.View>
              );
            })}
          </YStack>
        </YStack>

        {/* Manual swipe buttons */}
        <XStack justifyContent="space-between" paddingHorizontal="$4" marginTop="$4">
          <YStack alignItems="center" gap="$2">
            <Button
              circular
              size="$5"
              backgroundColor="rgba(218,41,28,0.1)"
              pressStyle={{ opacity: 0.7, scale: 0.95 }}
              onPress={() => swipeCard('left')}
            >
              <Feather name="x" size={26} color="#DA291C" />
            </Button>
            <Text fontSize={12} color="#DA291C" fontWeight="600">Not for me</Text>
          </YStack>

          <YStack alignItems="center" gap="$2">
            <Button
              circular
              size="$5"
              backgroundColor="rgba(76,175,80,0.1)"
              pressStyle={{ opacity: 0.7, scale: 0.95 }}
              onPress={() => swipeCard('right')}
            >
              <Feather name="check" size={26} color="#4CAF50" />
            </Button>
            <Text fontSize={12} color="#4CAF50" fontWeight="600">I'd do this</Text>
          </YStack>
        </XStack>
      </YStack>
    </YStack>
  );
}
