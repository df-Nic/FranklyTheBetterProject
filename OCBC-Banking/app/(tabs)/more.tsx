import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { TIER_CONFIG, CURRENT_AUM } from '../../components/wealth/mockData';

const TIER_PERKS = [
  { icon: 'user-tie', label: 'Dedicated RM', description: 'Your personal Relationship Manager, available whenever you need guidance.' },
  { icon: 'clock', label: 'Priority Service', description: 'Skip the queue at all OCBC branches island-wide.' },
  { icon: 'exchange-alt', label: 'Preferential FX', description: 'Better exchange rates on all foreign currency transactions.' },
  { icon: 'chart-line', label: 'Exclusive Products', description: 'Access structured products and private funds unavailable to standard customers.' },
];

export default function MoreScreen() {
  const router = useRouter();
  const targetTier = TIER_CONFIG.find(t => t.id === 'premier')!;
  const amountLeft = targetTier.minAUM - CURRENT_AUM;
  const progress = CURRENT_AUM / targetTier.minAUM;

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <BackgroundOrb size={450} color="rgba(218, 41, 28, 0.08)" top="-15%" right="-25%" fromOpacity={0.4} toOpacity={0.9} />
      <BackgroundOrb size={300} color="rgba(255, 220, 180, 0.3)" bottom="5%" left="-10%" fromOpacity={0.3} toOpacity={0.6} />

      {/* Header */}
      <YStack position="absolute" top={0} left={0} right={0} zIndex={100}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <XStack
          paddingHorizontal={24}
          paddingTop={60}
          paddingBottom={16}
          alignItems="center"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          <Text fontSize={20} fontWeight="800" color="black">Invest</Text>
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 120, paddingBottom: 120 }}>

        {/* Hero Section */}
        <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100, type: 'timing', duration: 600 }}>
          <YStack marginBottom="$6" gap="$2">
            <XStack alignItems="center" gap="$2" marginBottom="$1">
              <YStack backgroundColor="rgba(218,41,28,0.1)" padding="$2" borderRadius={10}>
                <FontAwesome5 name="crown" size={16} color="#DA291C" />
              </YStack>
              <Text fontSize={13} fontWeight="700" color="#DA291C" letterSpacing={0.5}>
                WEALTH PROGRESSION
              </Text>
            </XStack>
            <Text fontSize={30} fontWeight="900" color="black" lineHeight={36}>
              Grow Your Wealth.{'\n'}Unlock Premier.
            </Text>
            <Text fontSize={15} color="rgba(0,0,0,0.55)" lineHeight={22} marginTop="$1">
              You're SGD {amountLeft.toLocaleString()} away from OCBC Premier Banking and exclusive financial privileges.
            </Text>
          </YStack>
        </MotiView>

        {/* Progress Snapshot Card */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <GlassCard padding="$5" marginBottom="$5" borderColor="rgba(218,41,28,0.2)">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
              <YStack>
                <Text fontSize={13} color="rgba(0,0,0,0.45)" fontWeight="600">CURRENT AUM</Text>
                <Text fontSize={24} fontWeight="900" color="black">SGD {CURRENT_AUM.toLocaleString()}</Text>
              </YStack>
              <YStack alignItems="flex-end">
                <Text fontSize={13} color="rgba(0,0,0,0.45)" fontWeight="600">TARGET</Text>
                <Text fontSize={24} fontWeight="900" color="#DA291C">SGD 200,000</Text>
              </YStack>
            </XStack>
            {/* Progress Bar */}
            <YStack backgroundColor="rgba(0,0,0,0.06)" borderRadius={8} height={10} overflow="hidden">
              <MotiView
                from={{ width: '0%' }}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ delay: 400, type: 'timing', duration: 1000 }}
                style={{ height: 10, backgroundColor: '#DA291C', borderRadius: 8 }}
              />
            </YStack>
            <XStack justifyContent="space-between" marginTop="$2">
              <Text fontSize={12} color="rgba(0,0,0,0.4)">{Math.round(progress * 100)}% achieved</Text>
              <Text fontSize={12} color="#DA291C" fontWeight="600">SGD {amountLeft.toLocaleString()} to go</Text>
            </XStack>
          </GlassCard>
        </MotiView>

        {/* Premier Perks */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <Text fontSize={17} fontWeight="800" color="black" marginBottom="$3">
            What you'll unlock
          </Text>
          <YStack gap="$3" marginBottom="$6">
            {TIER_PERKS.map((perk, i) => (
              <MotiView key={perk.label} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 350 + i * 70 }}>
                <GlassCard padding="$4">
                  <XStack gap="$4" alignItems="center">
                    <YStack
                      width={44} height={44}
                      borderRadius={14}
                      backgroundColor="rgba(218,41,28,0.1)"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FontAwesome5 name={perk.icon as any} size={18} color="#DA291C" />
                    </YStack>
                    <YStack flex={1}>
                      <Text fontSize={15} fontWeight="700" color="black" marginBottom={2}>{perk.label}</Text>
                      <Text fontSize={13} color="rgba(0,0,0,0.55)" lineHeight={18}>{perk.description}</Text>
                    </YStack>
                  </XStack>
                </GlassCard>
              </MotiView>
            ))}
          </YStack>
        </MotiView>

        {/* Main CTA */}
        <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 600, type: 'spring' }}>
          <Button
            size="$5"
            backgroundColor="#DA291C"
            color="white"
            borderRadius={16}
            height={62}
            fontWeight="bold"
            fontSize={17}
            elevation={8}
            shadowColor="#DA291C"
            shadowRadius={16}
            shadowOpacity={0.3}
            pressStyle={{ opacity: 0.85, scale: 0.97 }}
            onPress={() => router.push('/wealth/tier-dashboard')}
          >
            Start Investing →
          </Button>
          <Text fontSize={12} color="rgba(0,0,0,0.3)" textAlign="center" marginTop="$3" lineHeight={16}>
            Prototype for demonstration only. Not financial advice.
          </Text>
        </MotiView>

      </ScrollView>
    </YStack>
  );
}
