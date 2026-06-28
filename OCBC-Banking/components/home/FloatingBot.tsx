import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, Image, useWindowDimensions } from 'react-native';
import { Button, YStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

export function FloatingBot() {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [isMovedLeft, setIsMovedLeft] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const positionRef = useRef({ x: 0, y: 0 });

  // Track if mascot is moved to the left half of the screen
  useEffect(() => {
    const threshold = -screenWidth / 2 + 62.5;
    const listenerId = pan.x.addListener(({ value }) => {
      setIsMovedLeft(value < threshold);
    });
    return () => {
      pan.x.removeListener(listenerId);
    };
  }, [pan.x, screenWidth]);

  // Interval for displaying the speech bubble
  useEffect(() => {
    // Initial delay of 2s before showing
    const initialTimer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    const interval = setInterval(() => {
      setShowBubble(prev => !prev);
    }, 6000); // Toggles every 6s (show 6s, hide 6s)

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        positionRef.current = {
          x: (pan.x as any)._value,
          y: (pan.y as any)._value
        };
      },
      onPanResponderMove: (e, gestureState) => {
        const nextX = positionRef.current.x + gestureState.dx;
        const nextY = positionRef.current.y + gestureState.dy;

        // Clamp Y: Keep at least 10px spacing above the 100px tab bar (nextY <= 10), and keep below status bar (nextY >= -screenHeight + 250)
        const clampedY = Math.min(Math.max(nextY, -screenHeight + 250), 10);

        // Clamp X: Keep between left: 20 (nextX >= -screenWidth + 115) and right: 20 (nextX <= 10)
        const clampedX = Math.min(Math.max(nextX, -screenWidth + 115), 10);

        pan.setValue({ x: clampedX, y: clampedY });
      },
      onPanResponderRelease: (e, gestureState) => {
        // Tap check
        const isTap = Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5;
        if (isTap) {
          router.push('/owl-tiering');
          return;
        }

        // Midpoint check
        const threshold = -screenWidth / 2 + 62.5;
        const currentX = (pan.x as any)._value;
        const targetX = currentX < threshold ? (-screenWidth + 125) : 0;

        // Snap mascot to left/right edge using spring animation
        Animated.spring(pan.x, {
          toValue: targetX,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }).start();
      }
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        bottom: 120,
        right: 30,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        zIndex: 1000,
        overflow: 'visible',
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Speech Bubble */}
      <MotiView
        animate={{
          opacity: showBubble ? 1 : 0,
          translateX: showBubble ? 0 : (isMovedLeft ? 8 : -8),
          scale: showBubble ? 1 : 0.95,
        }}
        transition={{
          type: 'timing',
          duration: 400,
        }}
        style={{
          position: 'absolute',
          width: 180,
          backgroundColor: 'white',
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 5,
          elevation: 3,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
          alignSelf: 'center',
          // Position relative to the parent mascot: left of it if on right, right of it if on left
          ...(isMovedLeft ? { left: 75 } : { right: 75 }),
        }}
      >
        {/* Triangle Arrow/Tail pointing toward the mascot */}
        <YStack
          position="absolute"
          top={0}
          bottom={0}
          justifyContent="center"
          {...(isMovedLeft ? { left: -6 } : { right: -6 })}
        >
          <YStack
            style={{
              width: 10,
              height: 10,
              backgroundColor: 'white',
              borderColor: 'rgba(0,0,0,0.05)',
              transform: [{ rotate: '45deg' }],
              ...(isMovedLeft
                ? { borderLeftWidth: 1, borderBottomWidth: 1 }
                : { borderRightWidth: 1, borderTopWidth: 1 }),
            }}
          />
        </YStack>

        <Text
          fontSize={12}
          fontWeight="600"
          color="#DA291C"
          lineHeight={16}
        >
          Come see how NEST can grow your wealth!
        </Text>
      </MotiView>

      {/* Circle Mascot Button */}
      <MotiView
        from={{ scale: 0.95 }}
        animate={{ scale: 1.05 }}
        transition={{ type: 'timing', duration: 1500, loop: true }}
      >
        <Button
          circular
          width={65}
          height={65}
          backgroundColor="white"
          elevation={10}
          shadowColor="#000"
          shadowRadius={10}
          padding={0}
          onPress={() => router.push('/owl-tiering')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: '#DA291C',
          }}
        >
          <Image
            source={require('../../assets/images/OCBC Owl.jpg')}
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
            }}
            resizeMode="contain"
          />
        </Button>
      </MotiView>
    </Animated.View>
  );
}
