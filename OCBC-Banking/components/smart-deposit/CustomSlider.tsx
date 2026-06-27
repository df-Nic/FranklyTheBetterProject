import React, { useState, useRef } from 'react';
import { View, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';
import { YStack, Text } from 'tamagui';
import * as Haptics from 'expo-haptics';

interface CustomSliderProps {
  value: number; // e.g. 3
  steps: number[]; // [1, 2, 3, 6, 9, 12]
  onChange: (val: number) => void;
}

export function CustomSlider({ value, steps, onChange }: CustomSliderProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<View>(null);

  const currentIndex = steps.indexOf(value);
  const activeIndex = currentIndex !== -1 ? currentIndex : 2; // default to 3 months (index 2)

  // Map activeIndex to percentage
  const getPercent = (idx: number) => {
    if (steps.length <= 1) return 0;
    return (idx / (steps.length - 1)) * 100;
  };

  const handleSelectIndex = async (idx: number) => {
    if (idx >= 0 && idx < steps.length && idx !== activeIndex) {
      onChange(steps[idx]);
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // web fallback or module error
      }
    }
  };

  const pageXRef = useRef(0);
  const widthRef = useRef(0);

  const getContainerCoords = (callback: (px: number, w: number) => void) => {
    const node = containerRef.current;
    if (!node) return;
    
    if (typeof window !== 'undefined' && (node as any).getBoundingClientRect) {
      const rect = (node as any).getBoundingClientRect();
      callback(rect.left, rect.width);
    } else {
      node.measure((x, y, w, h, px, py) => {
        if (w > 0) {
          callback(px, w);
        }
      });
    }
  };

  const handleTouchAt = (pageX: number) => {
    const w = widthRef.current || containerWidth;
    const px = pageXRef.current;
    if (w <= 0) return;
    const relativeX = pageX - px;
    const clampedX = Math.max(0, Math.min(w, relativeX));
    
    // Find step index with minimum distance to click
    let minDistance = Infinity;
    let closestIndex = activeIndex;
    
    for (let i = 0; i < steps.length; i++) {
      const stepX = (i / (steps.length - 1)) * w;
      const dist = Math.abs(clampedX - stepX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }
    handleSelectIndex(closestIndex);
  };

  // Support drag interactions with PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 4;
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        getContainerCoords((px, w) => {
          pageXRef.current = px;
          widthRef.current = w;
          setContainerWidth(w);
          handleTouchAt(gestureState.x0);
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        handleTouchAt(gestureState.moveX);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <YStack gap="$2" width="100%" paddingVertical="$2" paddingHorizontal="$1">
      {/* Track Container */}
      <View
        ref={containerRef}
        onLayout={() => {
          getContainerCoords((px, w) => {
            pageXRef.current = px;
            widthRef.current = w;
            setContainerWidth(w);
          });
        }}
        style={styles.sliderContainer}
        {...panResponder.panHandlers}
      >
        {/* Track Line */}
        <View style={styles.track} />
        
        {/* Active Track Line */}
        <View 
          style={[
            styles.activeTrack, 
            { width: `${getPercent(activeIndex)}%` }
          ]} 
        />

        {/* Unified Columns (Dot + Label) */}
        {steps.map((step, idx) => {
          const isPassed = idx <= activeIndex;
          const isActive = idx === activeIndex;
          return (
            <View
              key={idx}
              style={[
                styles.columnContainer,
                { left: `${getPercent(idx)}%` }
              ]}
            >
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => handleSelectIndex(idx)}
                style={styles.columnTapZone}
              >
                <View 
                  style={[
                    styles.tickDot,
                    isPassed && styles.tickDotPassed,
                    isActive && styles.tickDotActive
                  ]} 
                />
                <Text 
                  fontSize={12} 
                  fontWeight={isActive ? "bold" : "600"} 
                  color={isActive ? "#DA291C" : "rgba(0,0,0,0.4)"}
                  style={styles.tickLabel}
                >
                  {step} Mth
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Thumb */}
        <View 
          pointerEvents="none"
          style={[
            styles.thumb, 
            { left: `${getPercent(activeIndex)}%` }
          ]} 
        />
      </View>
    </YStack>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    height: 52,
    position: 'relative',
    width: '100%',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    width: '100%',
    position: 'absolute',
    top: 10,
  },
  activeTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DA291C',
    position: 'absolute',
    left: 0,
    top: 10,
  },
  columnContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    marginLeft: -30,
    alignItems: 'center',
  },
  columnTapZone: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  tickDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)',
    marginTop: 9, // sits centered over track line (track is top: 10, height: 8)
  },
  tickDotPassed: {
    borderColor: '#DA291C',
    backgroundColor: '#FFFFFF',
  },
  tickDotActive: {
    borderColor: '#DA291C',
    backgroundColor: '#DA291C',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 8, // adjusts center for 12px height
  },
  tickLabel: {
    marginTop: 18,
    textAlign: 'center',
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#DA291C',
    marginLeft: -12,
    top: 2, // centers over track line (thumb center is 2 + 12 = 14)
    shadowColor: '#DA291C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
