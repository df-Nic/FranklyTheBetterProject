import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { MotiView } from 'moti';

const CAROUSEL_DATA = [
  {
    title: "Elevate Your Future",
    description: "Experience a new standard of wealth management. Actionable AI-driven insights to grow your portfolio."
  },
  {
    title: "Global Portfolios",
    description: "Access markets worldwide. Diversify your assets seamlessly with our multi-currency private banking accounts."
  },
  {
    title: "Exclusive Rewards",
    description: "Unlock unparalleled privileges. From private concierge services to bespoke lifestyle experiences."
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();

  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(380);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (cardWidth === 0) return;
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % CAROUSEL_DATA.length;
      scrollViewRef.current?.scrollTo({ x: nextIndex * cardWidth, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, cardWidth]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (cardWidth === 0) return;
    const slideIndex = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (slideIndex !== activeIndex && slideIndex >= 0 && slideIndex < CAROUSEL_DATA.length) {
      setActiveIndex(slideIndex);
    }
  };

  return (
    <YStack flex={1} backgroundColor={theme === 'dark' ? '#0A0A0A' : '#FAFAFA'} justifyContent="center" alignItems="center" padding="$4">
      {/* Background Orb 1 */}
      <MotiView
        from={{ opacity: 0.3, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1.1 }}
        transition={{ type: 'timing', duration: 4000, loop: true, repeatReverse: true }}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderTopLeftRadius: 220,
          borderTopRightRadius: 180,
          borderBottomRightRadius: 240,
          borderBottomLeftRadius: 160,
          backgroundColor: theme === 'dark' ? 'rgba(218, 41, 28, 0.2)' : 'rgba(255, 182, 193, 0.5)',
          top: '-5%',
          left: '-20%',
        }}
      />
      {/* Background Orb 2 */}
      <MotiView
        from={{ opacity: 0.2, scale: 1 }}
        animate={{ opacity: 0.5, scale: 0.9 }}
        transition={{ type: 'timing', duration: 5000, loop: true, repeatReverse: true }}
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderTopLeftRadius: 130,
          borderTopRightRadius: 170,
          borderBottomRightRadius: 160,
          borderBottomLeftRadius: 140,
          backgroundColor: theme === 'dark' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 228, 181, 0.4)',
          bottom: '10%',
          right: '-10%',
        }}
      />

      <YStack position="absolute" top={60} right={24} zIndex={100}>
        <ThemeToggle />
      </YStack>

      <YStack zIndex={1} alignItems="center" gap="$8" width="100%">
        <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ type: 'timing', duration: 800 }}>
          <Text fontSize={48} fontWeight="900" color={theme === 'dark' ? '#FFFFFF' : '#111111'} textAlign="center" letterSpacing={-1}>
            OCBC Wealth
          </Text>
        </MotiView>

        <MotiView from={{ translateY: 40, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 200, type: 'timing', duration: 800 }}>
          <GlassCard 
            width="100%" 
            maxWidth={380} 
            padding="$0" 
            overflow="hidden"
            onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
          >
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onScroll}
              scrollEventThrottle={16}
            >
              {CAROUSEL_DATA.map((item, index) => (
                <YStack key={index} width={cardWidth} padding="$6" gap="$4">
                  <Text fontSize={26} fontWeight="700" color={theme === 'dark' ? '#FFFFFF' : '#111111'}>
                    {item.title}
                  </Text>
                  <Text fontSize={16} color={theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} lineHeight={24}>
                    {item.description}
                  </Text>
                </YStack>
              ))}
            </ScrollView>
            
            {/* Dots */}
            <XStack justifyContent="center" gap="$2" paddingBottom="$5">
              {CAROUSEL_DATA.map((_, i) => (
                <YStack 
                  key={i} 
                  width={i === activeIndex ? 20 : 6} 
                  height={6} 
                  borderRadius={3} 
                  backgroundColor={i === activeIndex ? '#DA291C' : (theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')} 
                />
              ))}
            </XStack>
          </GlassCard>
        </MotiView>

        <MotiView from={{ translateY: 40, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 400, type: 'timing', duration: 800 }}>
          <Button 
            size="$5" 
            backgroundColor="#DA291C" 
            color="white" 
            borderRadius={30} 
            width={280}
            height={60}
            fontSize={18}
            fontWeight="bold"
            elevation={theme === 'dark' ? 10 : 5}
            shadowColor="#DA291C"
            shadowRadius={15}
            shadowOpacity={theme === 'dark' ? 0.4 : 0.2}
            onPress={() => router.push('/login')}
            pressStyle={{ opacity: 0.8, scale: 0.96 }}
          >
            Get Started
          </Button>
        </MotiView>
      </YStack>
    </YStack>
  );
}
