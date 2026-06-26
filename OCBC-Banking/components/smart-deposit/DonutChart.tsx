import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { YStack, Text } from 'tamagui';
import { MotiView } from 'moti';

type DataItem = {
  value: number;
  color: string;
  label: string;
};

type DonutChartProps = {
  data: DataItem[];
  size?: number;
  strokeWidth?: number;
  totalText?: string;
  subText?: string;
};

export function DonutChart({
  data,
  size = 200,
  strokeWidth = 24,
  totalText,
  subText
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = 0;

  const paths = data.map((item, index) => {
    // calculate segment angle
    let angle = (item.value / total) * 360;
    // to handle full circle if only one item
    if (angle === 360) angle = 359.999;

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
    ].join(' ');

    return (
      <Path
        key={index}
        d={d}
        fill="none"
        stroke={item.color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    );
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(0,0,0,0.03)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {paths}
      </Svg>
      {/* Center text container */}
      <YStack position="absolute" alignItems="center" justifyContent="center">
        {totalText && (
          <Text fontSize={20} fontWeight="bold" color="black">
            {totalText}
          </Text>
        )}
        {subText && (
          <Text fontSize={12} color="rgba(0,0,0,0.5)" marginTop="$1">
            {subText}
          </Text>
        )}
      </YStack>
    </View>
  );
}
