import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { YStack, XStack, Button } from 'tamagui';
import { FontAwesome5 } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ProductCard } from './ProductCard';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export function ProductDeck({ products }: { products: any[] }) {
  const [deck, setDeck] = useState(products);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

  useEffect(() => {
    setDeck(products);
    setDirection(null);
  }, [products]);

  const advance = () => {
    setDirection('next');
    setDeck((prev) => {
      const newDeck = [...prev];
      const top = newDeck.shift();
      if (top) newDeck.push(top);
      return newDeck;
    });
  };

  const reverse = () => {
    setDirection('prev');
    setDeck((prev) => {
      const newDeck = [...prev];
      const bottom = newDeck.pop();
      if (bottom) newDeck.unshift(bottom);
      return newDeck;
    });
  };

  return (
    <YStack alignItems="center" width="100%">
      <YStack height={380} width="100%" position="relative" alignItems="center">
        {deck.map((product, index) => {
          return (
            <DraggableCard 
              key={product.id}
              product={product}
              index={index}
              total={deck.length}
              onSwipeRight={advance}
              onSwipeLeft={reverse}
              direction={direction}
            />
          );
        })}
      </YStack>
    </YStack>
  );
}

type DraggableCardProps = {
  product: any;
  index: number;
  total: number;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  direction: 'next' | 'prev' | null;
};

const DraggableCard = ({ product, index, total, onSwipeRight, onSwipeLeft, direction }: DraggableCardProps) => {
  const isTop = index === 0;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isTop && direction === 'prev') {
      // If this card just became top due to a reverse, slide it in from the left
      translateX.value = -width;
      translateX.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else if (isTop && direction === 'next') {
      // Just snapped to top from index 1, spring to resting state
      translateX.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(1, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      // Background cards
      translateX.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(index * 20, { duration: 300 });
      scale.value = withTiming(1 - (index * 0.05), { duration: 300 });
      opacity.value = withTiming(1 - (index * 0.1), { duration: 300 });
    }
  }, [index, isTop, direction]);

  const panGesture = Gesture.Pan()
    .enabled(isTop && total > 1)
    .onUpdate((e) => {
      // Prevent top card from moving left visually
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD || e.velocityX > 800) {
        // Swipe Right (Advance)
        translateX.value = withTiming(width, { duration: 200 }, () => {
          runOnJS(onSwipeRight)();
        });
      } else if (e.translationX < -SWIPE_THRESHOLD || e.velocityX < -800) {
        // Swipe Left trigger (Reverse)
        // Card didn't visually move left, but we still trigger the reverse logic
        translateX.value = withTiming(0, { duration: 300 });
        runOnJS(onSwipeLeft)();
      } else {
        // Snap back to center without wobble
        translateX.value = withTiming(0, { duration: 300 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(translateX.value, [-width, width], [-15, 15], Extrapolate.CLAMP);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${isTop ? rotateZ : 0}deg` }
      ],
      opacity: opacity.value,
      zIndex: total - index,
      position: 'absolute',
      width: '100%',
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle}>
        <ProductCard product={product} index={index} animated={false} />
      </Animated.View>
    </GestureDetector>
  );
};
