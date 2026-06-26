import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { MotiView } from 'moti';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';

export default function MoreMenuPage() {
  const menuSections = [
    {
      title: 'Account Services',
      icon: 'file-text',
      items: [
        { name: 'Manage e-Statements', sub: 'View and download paperless statements' },
        { name: 'Account Settings', sub: 'Update nicknames and display preferences' },
        { name: 'Manage Alerts', sub: 'Customize push notifications and SMS alerts' },
      ],
    },
    {
      title: 'Security Settings',
      icon: 'shield',
      items: [
        { name: 'Daily Transaction Limits', sub: 'Adjust transfer limits and card limits' },
        { name: 'Card Activation & Security', sub: 'Lock/unlock cards or report lost cards' },
        { name: 'Reset PIN', sub: 'Change online banking PIN or ATM PINs' },
      ],
    },
    {
      title: 'Help & Support',
      icon: 'help-circle',
      items: [
        { name: 'Locate Branch / ATM', sub: 'Find nearest branches and banking lobbies' },
        { name: 'Contact Us', sub: 'Get in touch with customer hotlines' },
        { name: 'Help Center & FAQs', sub: 'Browse articles and quick answers' },
      ],
    },
    {
      title: 'Legal & Rates',
      icon: 'info',
      items: [
        { name: 'Interest Rates', sub: 'Check deposit rates and loan interest rates' },
        { name: 'Terms & Conditions', sub: 'View standard banking agreements' },
        { name: 'Privacy Policy', sub: 'Manage your data consent settings' },
      ],
    },
  ];

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">

      {/* Dynamic Background Elements */}
      <BackgroundOrb
        size={400}
        color="rgba(218, 41, 28, 0.08)"
        top="-10%" left="-20%"
        fromOpacity={0.3}
        toOpacity={0.6}
      />
      <BackgroundOrb
        size={300}
        color="rgba(33, 150, 243, 0.08)"
        bottom="-10%" right="-10%"
        fromOpacity={0.2}
        toOpacity={0.5}
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
            <Feather name="menu" size={22} color="white" />
          </YStack>
          <YStack flex={1}>
            <Text fontSize={20} fontWeight="bold" color="black">
              More Options
            </Text>
            <Text fontSize={12} color="rgba(0,0,0,0.5)">
              Manage profile, accounts, security, and services.
            </Text>
          </YStack>
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* User Quick Profile Info Card */}
        <MotiView
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100 }}
        >
          <GlassCard padding="$4" marginBottom="$5" borderColor="rgba(255,255,255,0.7)">
            <XStack alignItems="center" gap="$3.5">
              <YStack
                width={50}
                height={50}
                borderRadius={25}
                backgroundColor="rgba(218, 41, 28, 0.1)"
                alignItems="center"
                justifyContent="center"
              >
                <Feather name="user" size={24} color="#DA291C" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={16} fontWeight="bold" color="black">Support Team 2</Text>
                <Text fontSize={12} color="rgba(0,0,0,0.5)">Access level: Administrator</Text>
              </YStack>
              <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.04)', padding: 8, borderRadius: 18 }}>
                <Feather name="edit-2" size={14} color="black" />
              </TouchableOpacity>
            </XStack>
          </GlassCard>
        </MotiView>

        {/* Menu Sections List */}
        <YStack gap="$5">
          {menuSections.map((section, index) => (
            <MotiView
              key={section.title}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 150 + index * 100 }}
            >
              <Text fontSize={15} fontWeight="bold" color="black" marginBottom="$2.5" paddingLeft="$1">
                {section.title}
              </Text>

              <GlassCard borderColor="rgba(255,255,255,0.7)">
                <YStack>
                  {section.items.map((item, i) => (
                    <TouchableOpacity
                      key={item.name}
                      onPress={() => { }}
                      activeOpacity={0.7}
                      style={{
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: i === section.items.length - 1 ? 0 : 1,
                        borderColor: 'rgba(0,0,0,0.04)',
                      }}
                    >
                      <YStack flex={1} paddingRight="$4">
                        <Text fontSize={14} fontWeight="600" color="black">
                          {item.name}
                        </Text>
                        <Text fontSize={11} color="rgba(0,0,0,0.4)" marginTop="$0.5">
                          {item.sub}
                        </Text>
                      </YStack>
                      <Feather name="chevron-right" size={16} color="rgba(0,0,0,0.3)" />
                    </TouchableOpacity>
                  ))}
                </YStack>
              </GlassCard>
            </MotiView>
          ))}
        </YStack>

      </ScrollView>

    </YStack>
  );
}
