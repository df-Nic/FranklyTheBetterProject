import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { MotiView } from 'moti';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { GlassCard } from '../GlassCard';

interface DynamicContentProps {
  selectedTab: string;
  isMasked: boolean;
}

export function DynamicContent({ selectedTab, isMasked }: DynamicContentProps) {
  // Helper to format values based on mask state
  const formatVal = (val: string, suffix: string = '') => {
    return isMasked ? '••••••••' + (suffix ? ' ' + suffix : '') : val + (suffix ? ' ' + suffix : '');
  };

  const renderAccounts = () => (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 150 }}
    >
      {/* 360 Account Card */}
      <GlassCard marginBottom="$4" padding="$4" borderColor="rgba(255,255,255,0.7)">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$3">
            <YStack
              width={42}
              height={42}
              borderRadius={21}
              backgroundColor="#FBECE5"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} fontWeight="bold" color="#DA291C">
                360
              </Text>
            </YStack>
            <YStack>
              <Text fontSize={16} fontWeight="bold" color="black">
                360 Account
              </Text>
            </YStack>
          </XStack>
          <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
        </XStack>

        <Text fontSize={13} color="rgba(0,0,0,0.5)" marginLeft={54} marginTop={-4}>
          {formatVal('537-812345-001')}
        </Text>

        <YStack height={1} backgroundColor="rgba(0,0,0,0.05)" marginVertical="$3" marginLeft={54} />

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54}>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Available balance
          </Text>
          <Text fontSize={15} fontWeight="bold" color="black">
            {formatVal('12,450.80', 'SGD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54} marginTop="$2">
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Debit card no.
          </Text>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            {formatVal('4599-8877-1234-5678')}
          </Text>
        </XStack>
      </GlassCard>

      {/* Savings Account Card */}
      <GlassCard marginBottom="$4" padding="$4" borderColor="rgba(255,255,255,0.7)">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$3">
            <YStack
              width={42}
              height={42}
              borderRadius={21}
              backgroundColor="#FBECE5"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} fontWeight="bold" color="#DA291C">
                SAV
              </Text>
            </YStack>
            <XStack alignItems="center" gap="$2">
              <Text fontSize={16} fontWeight="bold" color="black">
                Savings Account
              </Text>
              <YStack
                backgroundColor="white"
                paddingHorizontal="$2"
                paddingVertical="$0.5"
                borderRadius={10}
                borderWidth={1}
                borderColor="rgba(0,0,0,0.1)"
              >
                <Text fontSize={10} fontWeight="bold" color="rgba(0,0,0,0.5)">
                  Joint
                </Text>
              </YStack>
            </XStack>
          </XStack>
          <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
        </XStack>

        <Text fontSize={13} color="rgba(0,0,0,0.5)" marginLeft={54} marginTop={-4}>
          {formatVal('512-987654-002')}
        </Text>

        <YStack height={1} backgroundColor="rgba(0,0,0,0.05)" marginVertical="$3" marginLeft={54} />

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54}>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Available balance
          </Text>
          <Text fontSize={15} fontWeight="bold" color="black">
            {formatVal('138,439.11', 'SGD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54} marginTop="$2">
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Debit card no.
          </Text>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            {formatVal('4518-8822-8765-4321')}
          </Text>
        </XStack>
      </GlassCard>
    </MotiView>
  );

  const renderInvestments = () => (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 150 }}
    >
      {/* Wealth Portfolio Grid */}
      <XStack gap="$4" marginBottom="$4">
        {/* Investments Card (Large Square) */}
        <GlassCard flex={1} height={180} padding="$4" justifyContent="space-between" borderColor="rgba(255,255,255,0.7)">
          <YStack>
            <Feather name="pie-chart" size={24} color="#DA291C" />
            <Text fontSize={14} color="rgba(0,0,0,0.6)" marginTop="$2" fontWeight="500">
              Investments
            </Text>
          </YStack>
          <YStack>
            <Text fontSize={20} fontWeight="bold" color="black">
              {formatVal('$1,800,000')}
            </Text>
            <Text fontSize={12} color="#4CAF50" fontWeight="600" marginTop="$1">
              +12% YTD
            </Text>
          </YStack>
        </GlassCard>

        {/* Cash & Fixed Deposits (Stack of two rectangles) */}
        <YStack flex={1} gap="$3">
          <GlassCard flex={1} padding="$3.5" justifyContent="center" borderColor="rgba(255,255,255,0.7)">
            <Text fontSize={12} color="rgba(0,0,0,0.5)" fontWeight="500">
              Cash
            </Text>
            <Text fontSize={16} fontWeight="bold" color="black" marginTop="$1">
              {formatVal('$150,890')}
            </Text>
          </GlassCard>
          <GlassCard flex={1} padding="$3.5" justifyContent="center" borderColor="rgba(255,255,255,0.7)">
            <Text fontSize={12} color="rgba(0,0,0,0.5)" fontWeight="500">
              Fixed Deposits
            </Text>
            <Text fontSize={16} fontWeight="bold" color="black" marginTop="$1">
              {formatVal('$500,000')}
            </Text>
          </GlassCard>
        </YStack>
      </XStack>

      {/* Smart Insights Recommendation Card */}
      <Text fontSize={16} fontWeight="bold" color="black" marginBottom="$3" marginTop="$2">
        Smart Insights
      </Text>
      <GlassCard padding="$4" borderColor="rgba(218, 41, 28, 0.2)">
        <XStack gap="$4" alignItems="center">
          <YStack backgroundColor="rgba(218, 41, 28, 0.08)" padding="$3" borderRadius={15}>
            <FontAwesome5 name="lightbulb" size={20} color="#DA291C" />
          </YStack>
          <YStack flex={1}>
            <Text fontSize={15} fontWeight="bold" color="black" marginBottom="$1">
              Optimize Liquidity
            </Text>
            <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={18}>
              You have {formatVal('$10,000')} idle cash. Move it to the High-Yield Vault to earn an extra $45/month.
            </Text>
          </YStack>
        </XStack>
      </GlassCard>
    </MotiView>
  );

  const renderCards = () => (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 150 }}
    >
      {/* Credit Card */}
      <GlassCard marginBottom="$4" padding="$4" borderColor="rgba(255,255,255,0.7)">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$3">
            <YStack
              width={42}
              height={42}
              borderRadius={21}
              backgroundColor="#EAEAEA"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} fontWeight="bold" color="#333">
                365
              </Text>
            </YStack>
            <YStack>
              <Text fontSize={16} fontWeight="bold" color="black">
                OCBC 365 Credit Card
              </Text>
            </YStack>
          </XStack>
          <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
        </XStack>

        <Text fontSize={13} color="rgba(0,0,0,0.5)" marginLeft={54} marginTop={-4}>
          {formatVal('4599-4321-8765-4321')}
        </Text>

        <YStack height={1} backgroundColor="rgba(0,0,0,0.05)" marginVertical="$3" marginLeft={54} />

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54}>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Outstanding balance
          </Text>
          <Text fontSize={15} fontWeight="bold" color="black">
            {formatVal('1,245.50', 'SGD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54} marginTop="$2">
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Available credit
          </Text>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            {formatVal('13,754.50', 'SGD')}
          </Text>
        </XStack>
      </GlassCard>

      {/* FRANK Debit Card */}
      <GlassCard marginBottom="$4" padding="$4" borderColor="rgba(255,255,255,0.7)">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$3">
            <YStack
              width={42}
              height={42}
              borderRadius={21}
              backgroundColor="#E1F5FE"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} fontWeight="bold" color="#0288D1">
                FRK
              </Text>
            </YStack>
            <YStack>
              <Text fontSize={16} fontWeight="bold" color="black">
                OCBC FRANK Debit Card
              </Text>
            </YStack>
          </XStack>
          <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
        </XStack>

        <Text fontSize={13} color="rgba(0,0,0,0.5)" marginLeft={54} marginTop={-4}>
          {formatVal('4518-8765-4321-8765')}
        </Text>

        <YStack height={1} backgroundColor="rgba(0,0,0,0.05)" marginVertical="$3" marginLeft={54} />

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54}>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Available balance
          </Text>
          <Text fontSize={15} fontWeight="bold" color="black">
            {formatVal('5,432.10', 'SGD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54} marginTop="$2">
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Daily purchase limit
          </Text>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            {formatVal('2,000.00', 'SGD')}
          </Text>
        </XStack>
      </GlassCard>
    </MotiView>
  );

  const renderLoans = () => (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 150 }}
    >
      {/* Home Loan */}
      <GlassCard marginBottom="$4" padding="$4" borderColor="rgba(255,255,255,0.7)">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$3">
            <YStack
              width={42}
              height={42}
              borderRadius={21}
              backgroundColor="#E8F5E9"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} fontWeight="bold" color="#2E7D32">
                HOM
              </Text>
            </YStack>
            <YStack>
              <Text fontSize={16} fontWeight="bold" color="black">
                Home Mortgage Loan
              </Text>
            </YStack>
          </XStack>
          <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
        </XStack>

        <Text fontSize={13} color="rgba(0,0,0,0.5)" marginLeft={54} marginTop={-4}>
          {formatVal('LN-883921-H')}
        </Text>

        <YStack height={1} backgroundColor="rgba(0,0,0,0.05)" marginVertical="$3" marginLeft={54} />

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54}>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Outstanding balance
          </Text>
          <Text fontSize={15} fontWeight="bold" color="black">
            {formatVal('425,000.00', 'SGD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54} marginTop="$2">
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Monthly installment
          </Text>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            {formatVal('2,150.00', 'SGD')}
          </Text>
        </XStack>
      </GlassCard>

      {/* Car Loan */}
      <GlassCard marginBottom="$4" padding="$4" borderColor="rgba(255,255,255,0.7)">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$3">
            <YStack
              width={42}
              height={42}
              borderRadius={21}
              backgroundColor="#E8F5E9"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={11} fontWeight="bold" color="#2E7D32">
                CAR
              </Text>
            </YStack>
            <YStack>
              <Text fontSize={16} fontWeight="bold" color="black">
                Car Auto Loan
              </Text>
            </YStack>
          </XStack>
          <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
        </XStack>

        <Text fontSize={13} color="rgba(0,0,0,0.5)" marginLeft={54} marginTop={-4}>
          {formatVal('LN-229481-C')}
        </Text>

        <YStack height={1} backgroundColor="rgba(0,0,0,0.05)" marginVertical="$3" marginLeft={54} />

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54}>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Outstanding balance
          </Text>
          <Text fontSize={15} fontWeight="bold" color="black">
            {formatVal('32,400.00', 'SGD')}
          </Text>
        </XStack>

        <XStack justifyContent="space-between" alignItems="center" paddingLeft={54} marginTop="$2">
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            Monthly installment
          </Text>
          <Text fontSize={13} color="rgba(0,0,0,0.5)">
            {formatVal('550.00', 'SGD')}
          </Text>
        </XStack>
      </GlassCard>
    </MotiView>
  );

  switch (selectedTab) {
    case 'Accounts':
      return renderAccounts();
    case 'Investments':
      return renderInvestments();
    case 'Cards':
      return renderCards();
    case 'Loans':
      return renderLoans();
    default:
      return renderAccounts();
  }
}
