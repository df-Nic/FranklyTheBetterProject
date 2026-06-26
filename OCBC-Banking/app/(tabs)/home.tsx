import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { AnimatePresence, MotiView } from 'moti';

import { HeroSection } from '../../components/home/HeroSection';
import { ActionPills } from '../../components/home/ActionPills';
import { DynamicContent } from '../../components/home/DynamicContent';
import { FloatingBot } from '../../components/home/FloatingBot';
import { GlassCard } from '../../components/GlassCard';

export default function HomePage() {
  const router = useRouter();
  const [isMasked, setIsMasked] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Accounts');

  // Speech bubble states
  const [bubbleState, setBubbleState] = useState<'hidden1' | 'show1' | 'hidden2' | 'show2'>('hidden1');

  const tabs = ['Accounts', 'Investments', 'Cards', 'Loans'];

  // Animation cycle logic for speech bubble
  useEffect(() => {
    if (selectedTab !== 'Accounts') {
      setBubbleState('hidden1');
      return;
    }

    let timer: any;

    const runSequence = () => {
      // 1. Initial 3s delay (hidden1)
      timer = setTimeout(() => {
        setBubbleState('show1');

        // 2. Show String 1 for 6s
        timer = setTimeout(() => {
          setBubbleState('hidden2');

          // 3. Wait 3s before String 2 (hidden2)
          timer = setTimeout(() => {
            setBubbleState('show2');

            // 4. Show String 2 for 6s
            timer = setTimeout(() => {
              setBubbleState('hidden1');
              runSequence(); // Restart cycle recursively
            }, 6000);
          }, 3000);
        }, 6000);
      }, 3000);
    };

    runSequence();

    return () => {
      clearTimeout(timer);
    };
  }, [selectedTab]);

  const showBubble = bubbleState === 'show1' || bubbleState === 'show2';
  const bubbleText = bubbleState === 'show2' || bubbleState === 'hidden2'
    ? "Looking for a smarter way to grow your balance?"
    : "Want your idle funds to work harder for you?";

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      {/* Dynamic Background Elements */}
      <BackgroundOrb
        size={500}
        color="rgba(255, 182, 193, 0.2)"
        top="-20%" right="-30%"
        fromOpacity={0.5}
        toOpacity={1}
      />

      {/* Persistent Glass Header matching the reference image layout */}
      <YStack
        position="absolute"
        top={0} left={0} right={0}
        zIndex={100}
      >
        <BlurView
          intensity={90}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
        <XStack
          paddingHorizontal={24}
          paddingTop={60}
          paddingBottom={16}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          {/* Top Left: Scanner / QR Icon */}
          <TouchableOpacity onPress={() => {}} style={{ padding: 4 }}>
            <Feather name="crop" size={24} color="black" />
          </TouchableOpacity>

          {/* Top Right Actions: Notification (Bell with red dot) + Logout Link */}
          <XStack alignItems="center" gap="$5">
            <TouchableOpacity onPress={() => {}} style={{ position: 'relative', padding: 4 }}>
              <Feather name="bell" size={22} color="black" />
              {/* Red dot indicator */}
              <YStack
                position="absolute"
                top={4}
                right={4}
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor="#DA291C"
                borderWidth={1.5}
                borderColor="#F5F5F7"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text fontSize={16} fontWeight="600" color="#0a7ea4">
                Logout
              </Text>
            </TouchableOpacity>
          </XStack>
        </XStack>
      </YStack>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 120, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Greeting Section */}
        <YStack marginBottom="$4" marginTop="$2">
          <Text fontSize={14} color="rgba(0,0,0,0.5)" fontWeight="500">
            Welcome back
          </Text>
          <Text fontSize={24} fontWeight="900" color="black" letterSpacing={-0.5}>
            Support Team 2!!
          </Text>
        </YStack>

        {/* Promo Banner Slider (HeroSection) */}
        <HeroSection />

        {/* Quick Actions Grid (ActionPills) */}
        <ActionPills />

        {/* Updates Alert Banner */}
        <GlassCard
          padding="$3"
          borderRadius={18}
          marginBottom="$5"
          backgroundColor="rgba(232, 234, 246, 0.4)"
          borderColor="rgba(232, 234, 246, 0.8)"
        >
          <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$2">
            <XStack alignItems="center" gap="$2.5" flex={1}>
              <Feather name="bell" size={16} color="#E5A93C" />
              <Text fontSize={12} fontWeight="600" color="rgba(0,0,0,0.7)" flex={1}>
                Do not miss account updates. Review email preferences.
              </Text>
            </XStack>
            <Feather name="chevron-right" size={16} color="rgba(0,0,0,0.4)" />
          </XStack>
        </GlassCard>

        {/* Pill Navigation Bar */}
        <XStack alignItems="center" marginBottom="$4" paddingVertical="$1">
          {/* Eye Toggle Button */}
          <TouchableOpacity 
            onPress={() => setIsMasked(!isMasked)} 
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 18, 
              backgroundColor: 'rgba(0,0,0,0.04)', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Feather name={isMasked ? "eye-off" : "eye"} size={18} color="black" />
          </TouchableOpacity>

          {/* Vertical Separator */}
          <YStack width={1} height={20} backgroundColor="rgba(0,0,0,0.15)" marginHorizontal="$3" />

          {/* Horizontal scrollable list of pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 40 }}
          >
            {tabs.map((tab) => {
              const isSelected = selectedTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: isSelected ? '#DA291C' : 'white',
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: '#DA291C',
                    shadowColor: isSelected ? '#DA291C' : '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isSelected ? 0.2 : 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}
                >
                  <Text 
                    fontSize={13} 
                    fontWeight="700" 
                    color={isSelected ? 'white' : 'black'}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </XStack>

        {/* Mascot + Speech Bubble Container (rendered only when Accounts is active) */}
        <AnimatePresence>
          {selectedTab === 'Accounts' && (
            <MotiView
              from={{ opacity: 0, scale: 0.9, translateY: 10 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, translateY: 10 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push('/smart-deposit-details')}
                accessibilityLabel="Learn about the Smart Tracker Deposit feature"
                accessibilityRole="button"
                style={{
                  marginVertical: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 10,
                  position: 'relative',
                  cursor: 'pointer', // Web hover helper
                }}
              >
                {/* Mascot Image with Shadow */}
                <YStack
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Image
                    source={require('../../assets/images/Deposit Owl.jpg')}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      borderWidth: 2,
                      borderColor: 'white',
                    }}
                    alt="Deposit Owl Mascot"
                    accessibilityLabel="Deposit Owl Mascot"
                  />
                </YStack>

                {/* Speech Bubble */}
                <MotiView
                  animate={{
                    opacity: showBubble ? 1 : 0,
                    translateX: showBubble ? 0 : -8,
                    scale: showBubble ? 1 : 0.95,
                  }}
                  transition={{
                    type: 'timing',
                    duration: 400,
                  }}
                  style={{
                    flex: 1,
                    marginLeft: 16,
                    backgroundColor: 'white',
                    borderRadius: 14,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 5,
                    elevation: 3,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.05)',
                    position: 'relative',
                  }}
                >
                  {/* Triangle Arrow/Tail pointing toward the mascot */}
                  <YStack
                    style={{
                      position: 'absolute',
                      left: -6,
                      top: '50%',
                      marginTop: -6,
                      width: 12,
                      height: 12,
                      backgroundColor: 'white',
                      borderLeftWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: 'rgba(0,0,0,0.05)',
                      transform: [{ rotate: '45deg' }],
                    }}
                  />

                  <Text
                    fontSize={13}
                    fontWeight="600"
                    color="#DA291C"
                    lineHeight={18}
                  >
                    {bubbleText}
                  </Text>
                </MotiView>
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>

        {/* Dynamic content cards based on selected pill */}
        <DynamicContent selectedTab={selectedTab} isMasked={isMasked} />
      </ScrollView>

      {/* Untouched Floating Chat Bot Overlay */}
      <FloatingBot />
    </YStack>
  );
}
