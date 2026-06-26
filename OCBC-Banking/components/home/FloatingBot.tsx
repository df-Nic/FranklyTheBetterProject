import React, { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { Button } from 'tamagui';
import { MotiView } from 'moti';
import { FontAwesome5 } from '@expo/vector-icons';

export function FloatingBot() {
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
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
      onPanResponderRelease: () => {
        pan.flattenOffset();
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
          size="$6"
          backgroundColor="#DA291C"
          elevation={10}
          shadowColor="#DA291C"
          shadowRadius={10}
        >
          <FontAwesome5 name="robot" size={24} color="white" />
        </Button>
      </MotiView>
    </Animated.View>
  );
}
