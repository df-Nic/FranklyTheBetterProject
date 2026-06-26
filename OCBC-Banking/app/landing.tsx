import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { GlassCard } from '../components/GlassCard';
import { BackgroundOrb } from '../components/BackgroundOrb';
import { MotiView } from 'moti';
import { CarouselItem } from '../components/landing/CarouselItem';

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
    <YStack flex={1} backgroundColor="#FAFAFA" justifyContent="center" alignItems="center" padding="$4">
      {/* Background Orb 1 */}
      <BackgroundOrb
        size={400}
        color="rgba(255, 182, 193, 0.5)"
        radii={{ tl: 220, tr: 180, br: 240, bl: 160 }}
        top="-5%" left="-20%"
        fromOpacity={0.3}
        toOpacity={0.6}
      />
      {/* Background Orb 2 */}
      <BackgroundOrb
        size={300}
        color="rgba(255, 228, 181, 0.4)"
        radii={{ tl: 130, tr: 170, br: 160, bl: 140 }}
        bottom="10%" right="-10%"
        duration={5000}
        fromOpacity={0.2}
        toOpacity={0.5}
      />

      <YStack zIndex={1} alignItems="center" gap="$8" width="100%">
        <MotiView from={{ translateY: 30, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ type: 'timing', duration: 800 }}>
          <Text fontSize={48} fontWeight="900" color="#111111" textAlign="center" letterSpacing={-1}>
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
                <CarouselItem key={index} item={item} cardWidth={cardWidth} />
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
                  backgroundColor={i === activeIndex ? '#DA291C' : 'rgba(0,0,0,0.2)'} 
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
            elevation={5}
            shadowColor="#DA291C"
            shadowRadius={15}
            shadowOpacity={0.2}
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
