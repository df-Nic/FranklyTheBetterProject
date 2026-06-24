import React from 'react';
import { StyleSheet } from 'react-native';
import { YStack, Text } from 'tamagui';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';

export default function MoreScreen() {
  return (
    <YStack flex={1} backgroundColor="#F5F5F7" justifyContent="center" alignItems="center">
      <Feather name="more-horizontal" size={40} color="#ccc" />
      <Text fontSize={18} fontWeight="700" color="#999" marginTop="$4">
        More Options
      </Text>
    </YStack>
  );
}
