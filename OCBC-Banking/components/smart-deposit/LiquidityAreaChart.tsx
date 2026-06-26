import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { YStack, XStack, Text } from 'tamagui';

export function LiquidityAreaChart() {
  const screenWidth = Dimensions.get('window').width;
  const cardPadding = 32;
  const containerPadding = 48;
  const width = screenWidth - containerPadding - cardPadding;
  const height = 180;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const deposits = [4000, 4200, 4100, 4500, 4800, 5000];
  const spending = [2800, 3100, 2900, 3200, 3000, 3300];

  const maxVal = 6000;
  const minVal = 0;

  // Chart margins
  const top = 15;
  const bottom = 25;
  const left = 40;
  const right = 15;

  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const getCoordinates = (data: number[]) => {
    return data.map((val, i) => {
      const x = left + (i * plotWidth) / (data.length - 1);
      const y = top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;
      return { x, y };
    });
  };

  const depositCoords = getCoordinates(deposits);
  const spendingCoords = getCoordinates(spending);

  const getPathD = (coords: { x: number; y: number }[]) => {
    return coords.reduce((acc, coord, i) => {
      return i === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
    }, '');
  };

  const getAreaD = (coords: { x: number; y: number }[]) => {
    const linePath = getPathD(coords);
    const bottomY = top + plotHeight;
    const startX = coords[0].x;
    const endX = coords[coords.length - 1].x;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  const depositPath = getPathD(depositCoords);
  const depositArea = getAreaD(depositCoords);

  const spendingPath = getPathD(spendingCoords);
  const spendingArea = getAreaD(spendingCoords);

  // Y-axis grid line values
  const yGridValues = [2000, 4000, 6000];

  return (
    <YStack gap="$4">
      <View style={{ width, height }}>
        <Svg width={width} height={height}>
          {/* Horizontal Grid Lines & Y-axis labels */}
          {yGridValues.map((val, index) => {
            const y = top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;
            return (
              <React.Fragment key={index}>
                <Line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="rgba(0,0,0,0.06)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <SvgText
                  x={left - 8}
                  y={y + 4}
                  fontSize={10}
                  fill="rgba(0,0,0,0.4)"
                  textAnchor="end"
                  fontWeight="600"
                >
                  {`$${val / 1000}k`}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Zero line */}
          <Line
            x1={left}
            y1={top + plotHeight}
            x2={width - right}
            y2={top + plotHeight}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={1}
          />
          <SvgText
            x={left - 8}
            y={top + plotHeight + 4}
            fontSize={10}
            fill="rgba(0,0,0,0.4)"
            textAnchor="end"
            fontWeight="600"
          >
            $0
          </SvgText>

          {/* Areas */}
          <Path d={depositArea} fill="rgba(76, 175, 80, 0.12)" />
          <Path d={spendingArea} fill="rgba(218, 41, 28, 0.12)" />

          {/* Lines */}
          <Path d={depositPath} fill="none" stroke="#4CAF50" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          <Path d={spendingPath} fill="none" stroke="#DA291C" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points / Circles */}
          {depositCoords.map((coord, i) => (
            <Circle key={`dep-${i}`} cx={coord.x} cy={coord.y} r={4} fill="#4CAF50" stroke="white" strokeWidth={1.5} />
          ))}
          {spendingCoords.map((coord, i) => (
            <Circle key={`sp-${i}`} cx={coord.x} cy={coord.y} r={4} fill="#DA291C" stroke="white" strokeWidth={1.5} />
          ))}

          {/* X-axis Month Labels */}
          {months.map((month, i) => {
            const x = left + (i * plotWidth) / (months.length - 1);
            return (
              <SvgText
                key={i}
                x={x}
                y={height - 6}
                fontSize={10}
                fill="rgba(0,0,0,0.5)"
                textAnchor="middle"
                fontWeight="600"
              >
                {month}
              </SvgText>
            );
          })}
        </Svg>
      </View>

      {/* Legend & Stats */}
      <XStack justifyContent="space-around" borderTopWidth={1} borderColor="rgba(0,0,0,0.05)" paddingTop="$3">
        <XStack alignItems="center" gap="$2">
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50' }} />
          <YStack>
            <Text fontSize={10} color="rgba(0,0,0,0.5)" fontWeight="600">Avg. Deposits</Text>
            <Text fontSize={13} fontWeight="bold" color="black">$4,433/mo</Text>
          </YStack>
        </XStack>
        <XStack alignItems="center" gap="$2">
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#DA291C' }} />
          <YStack>
            <Text fontSize={10} color="rgba(0,0,0,0.5)" fontWeight="600">Avg. Spending</Text>
            <Text fontSize={13} fontWeight="bold" color="black">$3,050/mo</Text>
          </YStack>
        </XStack>
        <XStack alignItems="center" gap="$2">
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2196F3' }} />
          <YStack>
            <Text fontSize={10} color="rgba(0,0,0,0.5)" fontWeight="600">Net Savings</Text>
            <Text fontSize={13} fontWeight="bold" color="#2196F3">+$1,383/mo</Text>
          </YStack>
        </XStack>
      </XStack>
    </YStack>
  );
}
