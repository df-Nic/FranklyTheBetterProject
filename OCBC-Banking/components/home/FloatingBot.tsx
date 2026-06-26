import React, { useRef } from 'react';
import { Animated, PanResponder, Image } from 'react-native';
import { Button } from 'tamagui';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

export function FloatingBot() {
  const router = useRouter();
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          router.push('/owl-tiering');
        }
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
      }}
    >
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
