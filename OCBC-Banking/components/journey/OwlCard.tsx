// OwlCard.tsx
import React from "react";
import { Image, Pressable } from "react-native";
import { XStack, YStack, Text, Separator } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { OwlProduct, PALETTE } from "./journey.data";

interface Props {
  owl: OwlProduct;
  onPressCta: (owl: OwlProduct) => void;
}

export function OwlCard({ owl, onPressCta }: Props) {
  return (
    <YStack
      backgroundColor="#fff"
      borderRadius={18}
      borderWidth={1}
      borderColor="#F0EAE3"
      paddingHorizontal={18}
      paddingTop={18}
      shadowColor="#000"
      shadowOpacity={0.04}
      shadowRadius={2}
      shadowOffset={{ width: 0, height: 1 }}
      elevation={1}
    >
      <XStack gap={14}>
        <YStack
          width={58}
          height={58}
          borderRadius={29}
          backgroundColor={owl.tint}
          alignItems="center"
          justifyContent="center"
        >
          <Image source={owl.avatar} style={{ width: 58, height: 58, borderRadius: 29 }} />
        </YStack>

        <YStack flex={1}>
          <Text fontSize={19} fontWeight="700" color={PALETTE.ink} lineHeight={22}>
            {owl.name}
          </Text>
          <Text fontSize={11} fontWeight="700" letterSpacing={0.6} color="#C99A3A" marginVertical={3}>
            {owl.role}
          </Text>
          <Text fontSize={13.5} color={PALETTE.sub} lineHeight={20}>
            {owl.description}
          </Text>
        </YStack>
      </XStack>

      <Separator marginTop={14} borderColor="#F0EAE3" />

      {/* Footer: just the CTA now (holdings moved to the mascot total chip) */}
      <XStack alignItems="center" justifyContent="flex-end" paddingVertical={12}>
        <Pressable onPress={() => onPressCta(owl)} hitSlop={8}>
          <XStack alignItems="center" gap={4}>
            <Text fontSize={14} fontWeight="700" color={PALETTE.gold}>
              {owl.cta}
            </Text>
            <Ionicons name="arrow-forward" size={15} color={PALETTE.gold} />
          </XStack>
        </Pressable>
      </XStack>
    </YStack>
  );
}
