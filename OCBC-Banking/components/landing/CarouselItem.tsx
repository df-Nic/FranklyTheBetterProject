import React from 'react';
import { YStack, Text } from 'tamagui';

type CarouselItemProps = {
  item: {
    title: string;
    description: string;
  };
  cardWidth: number;
};

export function CarouselItem({ item, cardWidth }: CarouselItemProps) {
  return (
    <YStack width={cardWidth} padding="$6" gap="$4">
      <Text fontSize={26} fontWeight="700" color="#111111">
        {item.title}
      </Text>
      <Text fontSize={16} color="rgba(0,0,0,0.6)" lineHeight={24}>
        {item.description}
      </Text>
    </YStack>
  );
}
