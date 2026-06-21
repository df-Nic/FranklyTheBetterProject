import React, { useRef } from 'react';
import { ScrollView, StyleSheet, Animated, PanResponder } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useTheme } from '../../hooks/ThemeContext';
import { GlassCard } from '../../components/GlassCard';
import { ThemeToggle } from '../../components/ThemeToggle';
import { MotiView } from 'moti';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export default function HomePage() {
  const { theme } = useTheme();
  const router = useRouter();

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  return (
    <YStack flex={1} backgroundColor={theme === 'dark' ? '#121212' : '#F5F5F7'}>
      
      {/* Dynamic Background Elements */}
      <MotiView
        from={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 4000, loop: true }}
        style={{
          position: 'absolute', width: 500, height: 500, borderRadius: 250,
          backgroundColor: theme === 'dark' ? 'rgba(218, 41, 28, 0.1)' : 'rgba(255, 182, 193, 0.2)',
          top: '-20%', right: '-30%'
        }}
      />

      {/* Persistent Glass Header */}
      <YStack 
        position="absolute"
        top={0} left={0} right={0}
        zIndex={100}
      >
        <BlurView 
          intensity={80} 
          tint={theme === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill} 
        />
        <XStack 
          paddingHorizontal={24} 
          paddingTop={60} 
          paddingBottom={16} 
          justifyContent="space-between" 
          alignItems="center"
          borderBottomWidth={1}
          borderColor={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
        >
          <YStack>
            <Text fontSize={14} color={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}>
              Welcome back
            </Text>
            <Text fontSize={20} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'}>
              Support Team 2!!
            </Text>
          </YStack>
          <XStack alignItems="center" gap="$3">
            <ThemeToggle />
            <Button 
              circular 
              size="$3" 
              backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
              onPress={() => router.replace('/login')}
              pressStyle={{ opacity: 0.7 }}
            >
              <Feather name="log-out" size={16} color={theme === 'dark' ? 'white' : 'black'} />
            </Button>
          </XStack>
        </XStack>
      </YStack>
      
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 100 }}>
        
        {/* The "Pulse" Hero Section */}
        <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 100 }}>
          <YStack alignItems="center" marginBottom="$6">
            <Text fontSize={14} fontWeight="600" color="#DA291C" marginBottom="$2">
              TOTAL NET WORTH
            </Text>
            <Text fontSize={48} fontWeight="900" color={theme === 'dark' ? 'white' : 'black'} letterSpacing={-1}>
              $2,450,890
            </Text>
            <XStack alignItems="center" gap="$2" marginTop="$2">
              <Feather name="trending-up" size={16} color="#4CAF50" />
              <Text fontSize={14} color="#4CAF50" fontWeight="600">
                +2.4% this month
              </Text>
            </XStack>
          </YStack>
        </MotiView>

        {/* Action Pill */}
        <MotiView from={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 200, type: 'spring' }}>
          <GlassCard padding="$2" borderRadius={30} marginBottom="$8">
            <XStack justifyContent="space-between" paddingHorizontal="$4">
              {['Pay', 'Transfer', 'Scan'].map((action, i) => (
                <YStack key={action} alignItems="center" gap="$2" padding="$2">
                  <Button circular size="$4" backgroundColor={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}>
                    <Feather 
                      name={action === 'Pay' ? 'send' : action === 'Transfer' ? 'repeat' : 'maximize'} 
                      size={20} 
                      color={theme === 'dark' ? 'white' : 'black'} 
                    />
                  </Button>
                  <Text fontSize={12} fontWeight="500" color={theme === 'dark' ? 'white' : 'black'}>
                    {action}
                  </Text>
                </YStack>
              ))}
            </XStack>
          </GlassCard>
        </MotiView>

        {/* Bento Box Portfolio */}
        <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 300 }}>
          <Text fontSize={18} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'} marginBottom="$4">
            Wealth Portfolio
          </Text>
          
          <XStack gap="$4" marginBottom="$4">
            {/* Investments (Large Square) */}
            <GlassCard flex={1} height={200} padding="$4" justifyContent="space-between">
              <YStack>
                <Feather name="pie-chart" size={24} color="#DA291C" />
                <Text fontSize={14} color={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'} marginTop="$2">
                  Investments
                </Text>
              </YStack>
              <YStack>
                <Text fontSize={24} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'}>
                  $1,800,000
                </Text>
                <Text fontSize={12} color="#4CAF50">+12% YTD</Text>
              </YStack>
            </GlassCard>

            {/* Cash & Fixed Deposits (Two smaller rectangles) */}
            <YStack flex={1} gap="$4">
              <GlassCard flex={1} padding="$4" justifyContent="center">
                <Text fontSize={12} color={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}>
                  Cash
                </Text>
                <Text fontSize={18} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'}>
                  $150,890
                </Text>
              </GlassCard>
              <GlassCard flex={1} padding="$4" justifyContent="center">
                <Text fontSize={12} color={theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}>
                  Fixed Deposits
                </Text>
                <Text fontSize={18} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'}>
                  $500,000
                </Text>
              </GlassCard>
            </YStack>
          </XStack>
        </MotiView>

        {/* Smart Wealth Insights */}
        <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 400 }}>
          <Text fontSize={18} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'} marginBottom="$4" marginTop="$4">
            Smart Insights
          </Text>
          <GlassCard padding="$5" borderColor="rgba(218, 41, 28, 0.3)">
            <XStack gap="$4" alignItems="center">
              <YStack backgroundColor="rgba(218, 41, 28, 0.1)" padding="$3" borderRadius={20}>
                <FontAwesome5 name="lightbulb" size={24} color="#DA291C" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="bold" color={theme === 'dark' ? 'white' : 'black'} marginBottom="$1">
                  Optimize Liquidity
                </Text>
                <Text fontSize={13} color={theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} lineHeight={20}>
                  You have $10,000 idle cash. Move it to the High-Yield Vault to earn an extra $45/month.
                </Text>
              </YStack>
            </XStack>
          </GlassCard>
        </MotiView>

      </ScrollView>

      {/* Floating Draggable AI Bot */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: 'absolute',
          bottom: 120,
          right: 30,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          zIndex: 1000,
        }}
      >
        <MotiView 
          from={{ scale: 0.95 }} 
          animate={{ scale: 1.05 }} 
          transition={{ type: 'timing', duration: 1500, loop: true }}
        >
          <Button 
            circular 
            size="$6" 
            backgroundColor="#DA291C" 
            elevation={10}
            shadowColor="#DA291C"
            shadowRadius={10}
          >
            <FontAwesome5 name="robot" size={24} color="white" />
          </Button>
        </MotiView>
      </Animated.View>

    </YStack>
  );
}
