import React from 'react';
import { ScrollView, Image, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { GlassCard } from '../components/GlassCard';
import { BackgroundOrb } from '../components/BackgroundOrb';
import { MotiView } from 'moti';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LandingPage() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  return (
    <YStack flex={1} backgroundColor="#FAFAFA">
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

      <ScrollView
        contentContainerStyle={{ paddingTop: 90, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <YStack zIndex={1} alignItems="center" width="100%">
          {/* Welcome Header */}
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 800 }}
            style={{ marginVertical: 55, width: '100%', paddingHorizontal: 20 }}
          >
            <Text fontSize={48} fontWeight="900" color="#111111" textAlign="center" letterSpacing={-1} lineHeight={54}>
              Welcome to <Text color="#DA291C">OCBC</Text>
            </Text>
          </MotiView>

          {/* Quick Access Grid */}
          <MotiView
            from={{ translateY: 30, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 200, type: 'timing', duration: 800 }}
            style={{ width: '100%', paddingHorizontal: 24, marginVertical: 35 }}
          >
            <YStack gap="$6">
              {/* Row 1 */}
              <XStack justifyContent="space-around">
                <GridItem
                  icon={<MaterialCommunityIcons name="cellphone-key" size={24} color="#333" />}
                  label="OneToken"
                />
                <GridItem
                  icon={<Feather name="crop" size={24} color="#333" />}
                  label="Scan & Pay"
                />
                <GridItem
                  icon={<MaterialCommunityIcons name="bank-transfer" size={26} color="#333" />}
                  label="PayNow"
                />
              </XStack>

              {/* Row 2 */}
              <XStack justifyContent="space-around">
                <GridItem
                  icon={<Feather name="trending-up" size={24} color="#333" />}
                  label="Wealth Insights"
                />
                <GridItem
                  icon={<Feather name="repeat" size={22} color="#333" />}
                  label="Foreign Exchange"
                />
                <GridItem
                  icon={<Feather name="grid" size={24} color="#333" />}
                  label="More"
                />
              </XStack>
            </YStack>
          </MotiView>

          {/* Action CTAs */}
          <MotiView
            from={{ translateY: 30, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ delay: 300, type: 'timing', duration: 800 }}
            style={{ width: '100%', alignItems: 'center', gap: 16, marginTop: 25 }}
          >
            <Button
              size="$5"
              backgroundColor="#2E3E4F"
              color="white"
              borderRadius={12}
              width={320}
              height={55}
              fontSize={16}
              fontWeight="bold"
              elevation={4}
              shadowColor="#2E3E4F"
              shadowRadius={10}
              shadowOpacity={0.15}
              onPress={() => router.push('/login')}
              pressStyle={{ opacity: 0.85, scale: 0.98 }}
            >
              Log in to OCBC Singapore
            </Button>

            <Button
              size="$5"
              backgroundColor="white"
              borderColor="#DA291C"
              borderWidth={2}
              borderRadius={12}
              width={320}
              height={55}
              elevation={2}
              shadowColor="#DA291C"
              shadowRadius={8}
              shadowOpacity={0.08}
              onPress={() => router.push({ pathname: '/login', params: { redirect: '/owl-tiering' } })}
              pressStyle={{ opacity: 0.85, scale: 0.98 }}
            >
              <XStack alignItems="center" gap="$2" justifyContent="center">
                <Image
                  source={require('../assets/images/OCBC Owl.jpg')}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                  }}
                  resizeMode="contain"
                />
                <Text color="#DA291C" fontSize={14} fontWeight="bold">
                  Manage your wealth with NEST
                </Text>
              </XStack>
            </Button>
          </MotiView>

          {/* Security Advisory Footer */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 400, type: 'timing', duration: 800 }}
            style={{ width: '100%', paddingHorizontal: 28, marginTop: 50 }}
          >
            <Text fontSize={11} lineHeight={16} color="rgba(0,0,0,0.5)" textAlign="left">
              <Text fontWeight="bold" color="rgba(0,0,0,0.6)">Security advisory:</Text>
              {" Beware of calls that start with pre-recorded messages. Scam callers impersonating OCBC may request your banking details. Do not reveal them. "}
              <Text color="#0a7ea4" fontWeight="600">
                Learn more
              </Text>
            </Text>
          </MotiView>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

function GridItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <YStack alignItems="center" width={100} gap="$2">
      <YStack
        width={56}
        height={56}
        borderRadius={28}
        borderWidth={1.5}
        borderColor="rgba(0,0,0,0.1)"
        justifyContent="center"
        alignItems="center"
        backgroundColor="transparent"
      >
        <TouchableOpacity style={styles.gridBtn} activeOpacity={0.7}>
          {icon}
        </TouchableOpacity>
      </YStack>
      <Text fontSize={12} fontWeight="600" color="rgba(0,0,0,0.7)" textAlign="center">
        {label}
      </Text>
    </YStack>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
