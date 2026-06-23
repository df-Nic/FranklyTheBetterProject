import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { MotiView } from 'moti';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const USER_TRAITS = [
  "Big Spender",
  "Planning for Family",
  "High Cash Inflow",
  "Travel Enthusiast"
];

const RECOMMENDED_PRODUCTS = [
  {
    id: '1',
    name: 'High-Yield Family Savings Account',
    category: 'Deposits',
    description: 'Perfect for building a nest egg for your growing family with bonus interest tiers.',
    icon: 'piggy-bank',
    iconLib: 'FontAwesome5',
    color: '#4CAF50',
  },
  {
    id: '2',
    name: 'Travel Rewards Credit Card',
    category: 'Cards',
    description: 'Earn miles 3x faster on your frequent trips and hotel bookings.',
    icon: 'plane-departure',
    iconLib: 'FontAwesome5',
    color: '#2196F3',
  },
  {
    id: '3',
    name: 'Fixed Deposit Plan',
    category: 'Accounts',
    description: 'Lock in your high cash inflow for 12 months at a guaranteed 4.5% p.a.',
    icon: 'chart-line',
    iconLib: 'FontAwesome5',
    color: '#9C27B0',
  }
];

export default function DepositOwlPage() {
  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      
      {/* Dynamic Background Elements */}
      <BackgroundOrb
        size={400}
        color="rgba(218, 41, 28, 0.15)"
        top="-10%" left="-20%"
        fromOpacity={0.4}
        toOpacity={0.8}
      />
      <BackgroundOrb
        size={300}
        color="rgba(33, 150, 243, 0.15)"
        bottom="-10%" right="-10%"
        fromOpacity={0.3}
        toOpacity={0.6}
      />

      {/* Persistent Glass Header */}
      <YStack
        position="absolute"
        top={0} left={0} right={0}
        zIndex={100}
      >
        <BlurView
          intensity={80}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <XStack
          paddingHorizontal={24}
          paddingTop={60}
          paddingBottom={16}
          alignItems="center"
          gap="$3"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          <YStack backgroundColor="#DA291C" padding="$2" borderRadius={12}>
            <MaterialCommunityIcons name="owl" size={24} color="white" />
          </YStack>
          <YStack flex={1}>
            <Text fontSize={20} fontWeight="bold" color="black">
              Deposit Owl Recommendations
            </Text>
            <Text fontSize={12} color="rgba(0,0,0,0.5)">
              These products are tailored to your financial habits.
            </Text>
          </YStack>
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 100 }}>

        {/* User Characteristics Summary */}
        <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 100 }}>
          <Text fontSize={16} fontWeight="bold" color="black" marginBottom="$3">
            Your Financial Profile
          </Text>
          <XStack flexWrap="wrap" gap="$2" marginBottom="$6">
            {USER_TRAITS.map((trait, index) => (
              <GlassCard key={index} paddingHorizontal="$3" paddingVertical="$1.5" borderRadius={20} backgroundColor="rgba(255,255,255,0.7)">
                <Text fontSize={12} fontWeight="600" color="#333">
                  {trait}
                </Text>
              </GlassCard>
            ))}
          </XStack>
        </MotiView>

        {/* Recommended Products Grid */}
        <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 200 }}>
          <Text fontSize={18} fontWeight="bold" color="black" marginBottom="$4">
            Curated For You
          </Text>

          <YStack gap="$4">
            {RECOMMENDED_PRODUCTS.map((product, index) => (
              <MotiView 
                key={product.id}
                from={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: 300 + (index * 100), type: 'spring' }}
              >
                <GlassCard padding="$4" borderColor={`rgba(${product.color === '#4CAF50' ? '76, 175, 80' : product.color === '#2196F3' ? '33, 150, 243' : '156, 39, 176'}, 0.2)`}>
                  <XStack gap="$4" alignItems="flex-start" marginBottom="$3">
                    <YStack backgroundColor={`${product.color}15`} padding="$3" borderRadius={16}>
                      <FontAwesome5 name={product.icon} size={24} color={product.color} />
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
                      <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={18}>
                        {product.description}
                      </Text>
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
            ))}
          </YStack>
        </MotiView>

      </ScrollView>

    </YStack>
  );
}
