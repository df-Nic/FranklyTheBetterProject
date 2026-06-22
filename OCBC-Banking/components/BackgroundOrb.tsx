import React from 'react';
import { MotiView } from 'moti';
import { DimensionValue } from 'react-native';

interface BackgroundOrbProps {
  color?: string;
  size?: number;
  top?: DimensionValue;
  right?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  duration?: number;
  fromOpacity?: number;
  toOpacity?: number;
  radii?: { tl: number; tr: number; br: number; bl: number };
}

export const BackgroundOrb = ({
  color = 'rgba(255, 182, 193, 0.3)',
  size = 500,
  top,
  right,
  bottom,
  left,
  duration = 4000,
  fromOpacity = 0.15,
  toOpacity = 0.4,
  radii = { tl: size / 2, tr: size / 2, br: size / 2, bl: size / 2 },
}: BackgroundOrbProps) => {
  return (
    <MotiView
      from={{ opacity: fromOpacity, scale: 0.8 }} 
      animate={{ opacity: toOpacity, scale: 1.1 }}
      transition={{ type: 'timing', duration, loop: true, repeatReverse: true }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderTopLeftRadius: radii.tl,
        borderTopRightRadius: radii.tr,
        borderBottomRightRadius: radii.br,
        borderBottomLeftRadius: radii.bl,
        backgroundColor: color,
        top, right, bottom, left
      }}
    />
  );
};
