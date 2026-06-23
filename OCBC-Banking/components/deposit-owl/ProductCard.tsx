import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { MotiView } from 'moti';
import { FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../GlassCard';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    category: string;
    description: string;
    reason: string;
    icon: string;
    color: string;
  };
  index: number;
};

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <MotiView 
      from={{ scale: 0.95, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      transition={{ delay: 300 + (index * 100), type: 'spring' }}
    >
      <GlassCard padding="$4" borderColor={`rgba(${product.color === '#4CAF50' ? '76, 175, 80' : product.color === '#2196F3' ? '33, 150, 243' : product.color === '#9C27B0' ? '156, 39, 176' : '233, 30, 99'}, 0.2)`}>
        <XStack gap="$4" alignItems="flex-start" marginBottom="$3">
          <YStack backgroundColor={`${product.color}15`} padding="$3" borderRadius={16}>
            <FontAwesome5 name={product.icon as any} size={24} color={product.color} />
          </YStack>
          <YStack flex={1}>
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$1">
              <GlassCard paddingHorizontal="$2" paddingVertical="$1" borderRadius={10} backgroundColor={`${product.color}15`} borderWidth={0}>
                <Text fontSize={10} fontWeight="bold" color={product.color} textTransform="uppercase">
                  {product.category}
                </Text>
              </GlassCard>
            </XStack>
            <Text fontSize={16} fontWeight="bold" color="black" marginBottom="$1">
              {product.name}
            </Text>
            <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={18} marginBottom="$3">
              {product.description}
            </Text>
            <YStack backgroundColor="rgba(0,0,0,0.03)" padding="$3" borderRadius={12} borderLeftWidth={3} borderColor={product.color}>
              <XStack alignItems="center" gap="$2" marginBottom="$1">
                <FontAwesome5 name="question-circle" size={14} color={product.color} />
                <Text fontSize={12} color="black" fontWeight="600">
                  Why this fits you:
                </Text>
              </XStack>
              <Text fontSize={12} color="rgba(0,0,0,0.6)" lineHeight={16}>
                {product.reason}
              </Text>
            </YStack>
          </YStack>
        </XStack>
        
        <Button 
          backgroundColor="black" 
          borderRadius={12} 
          height={40}
          pressStyle={{ opacity: 0.8 }}
        >
          <Text color="white" fontWeight="600" fontSize={14}>View Details</Text>
        </Button>
      </GlassCard>
    </MotiView>
  );
}
