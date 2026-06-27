import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button, Spinner, Input } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { useWealth } from '../../components/wealth/WealthContext';
import {
  WEALTH_PRODUCTS,
  MOCK_FUNDS,
} from '../../components/wealth/mockData';

const OTHER_MOCK_FUNDS = [
  {
    name: 'All-Weather Inflation-Linked Bond Fund',
    assetClass: 'Fixed Income',
    reason: 'Hedges against inflation with high-quality global bonds and capital preservation.',
    ytd: '+4.2%',
  },
  {
    name: 'OCBC Global ESG Sustainable Leaders Fund',
    assetClass: 'Sustainable Equity',
    reason: 'Invests in global companies with strong environmental and social governance.',
    ytd: '+8.7%',
  },
  {
    name: 'Asia Tech Pioneers Fund',
    assetClass: 'Thematic Equity',
    reason: 'Capitalizes on key technology and innovation leaders in the Asia-Pacific region.',
    ytd: '+14.9%',
  },
  {
    name: 'US Large Cap Value Fund',
    assetClass: 'US Equity',
    reason: 'Stable blue-chip exposure focusing on undervalued US market leaders.',
    ytd: '+6.5%',
  },
  {
    name: 'Global Real Estate Investment Trust (REIT) Fund',
    assetClass: 'Property/Real Assets',
    reason: 'Regular dividend yield through diversified global real estate assets.',
    ytd: '+5.8%',
  }
];

export default function FundNarrowingScreen() {
  const router = useRouter();
  const { state, dispatch } = useWealth();
  const riskProfile = state.userProfile.riskProfile ?? 'Balanced';
  const selectedProduct = WEALTH_PRODUCTS.find(p => p.id === state.selectedProduct);

  const [loading, setLoading] = useState(true);
  const [funds, setFunds] = useState<Array<{ name: string; assetClass: string; reason: string; ytd: string }>>([]);

  // Explore more states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAllOtherFunds, setShowAllOtherFunds] = useState(false);

  const filteredOtherFunds = OTHER_MOCK_FUNDS.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.assetClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Sustainable') return matchesSearch && fund.assetClass.includes('Sustainable');
    if (selectedFilter === 'Thematic') return matchesSearch && fund.assetClass.includes('Thematic');
    if (selectedFilter === 'Fixed Income') return matchesSearch && fund.assetClass.includes('Fixed Income');
    if (selectedFilter === 'Equity') return matchesSearch && fund.assetClass.includes('Equity');
    return matchesSearch;
  });

  const displayedOtherFunds = showAllOtherFunds
    ? filteredOtherFunds
    : filteredOtherFunds.slice(0, 2);

  // Simulate AI fund filtering on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setFunds(MOCK_FUNDS[riskProfile] ?? MOCK_FUNDS['Balanced']);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [riskProfile]);

  const handleSelectFund = (fund: { name: string; assetClass: string; reason: string; ytd: string }) => {
    dispatch({ type: 'SELECT_FUND', fund });
    router.push('/wealth/cta');
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <BackgroundOrb size={380} color="rgba(218,41,28,0.07)" top="-5%" right="-20%" fromOpacity={0.4} toOpacity={0.9} />

      {/* Header */}
      <YStack position="absolute" top={0} left={0} right={0} zIndex={100}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <XStack
          paddingHorizontal={24}
          paddingTop={60}
          paddingBottom={16}
          justifyContent="space-between"
          alignItems="center"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.05)"
        >
          <Button circular size="$3" backgroundColor="rgba(0,0,0,0.05)" onPress={() => router.back()} pressStyle={{ opacity: 0.7 }}>
            <Feather name="arrow-left" size={18} color="black" />
          </Button>
          <YStack alignItems="center">
            <Text fontSize={17} fontWeight="700" color="black">{selectedProduct?.name ?? 'Fund Recommendations'}</Text>
            <Text fontSize={12} color="#DA291C" fontWeight="600">Matched to your profile</Text>
          </YStack>
          <YStack width={36} />
        </XStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 120 }}>
        {loading ? (
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignItems: 'center', paddingTop: 60 }}>
            <YStack alignItems="center" gap="$4">
              <MotiView
                from={{ rotate: '0deg' }}
                animate={{ rotate: '360deg' }}
                transition={{ type: 'timing', duration: 1500, loop: true, repeatReverse: false }}
              >
                <Feather name="cpu" size={40} color="#DA291C" />
              </MotiView>
              <Text fontSize={16} fontWeight="700" color="black">Analysing your profile...</Text>
              <Text fontSize={14} color="rgba(0,0,0,0.5)" textAlign="center">
                Finding the best {selectedProduct?.name} funds for a {riskProfile} investor
              </Text>
            </YStack>
          </MotiView>
        ) : (
          <>
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }}>
              <Text fontSize={14} color="rgba(0,0,0,0.5)" lineHeight={20} marginBottom="$5">
                We've matched {funds.length} funds to your {riskProfile} risk profile. Each one has been selected to help grow your AUM.
              </Text>
            </MotiView>

            <YStack gap="$4">
              {funds.map((fund, i) => (
                <MotiView
                  key={fund.name}
                  from={{ opacity: 0, translateY: 25 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: 150 + i * 100, type: 'spring' }}
                >
                  <GlassCard padding="$5">
                    <YStack gap="$3">
                      <XStack justifyContent="space-between" alignItems="flex-start">
                        <YStack flex={1} paddingRight="$3">
                          <Text fontSize={15} fontWeight="800" color="black" lineHeight={22} marginBottom="$1">
                            {fund.name}
                          </Text>
                          <XStack gap="$2" alignItems="center">
                            <YStack
                              backgroundColor="rgba(218,41,28,0.08)"
                              paddingHorizontal="$2"
                              paddingVertical={3}
                              borderRadius={8}
                            >
                              <Text fontSize={11} fontWeight="700" color="#DA291C">{fund.assetClass}</Text>
                            </YStack>
                            <XStack alignItems="center" gap="$1">
                              <Feather name="trending-up" size={12} color="#4CAF50" />
                              <Text fontSize={12} color="#4CAF50" fontWeight="700">{fund.ytd} YTD</Text>
                            </XStack>
                          </XStack>
                        </YStack>
                      </XStack>

                      <Text fontSize={13} color="rgba(0,0,0,0.6)" lineHeight={20}>
                        {fund.reason}
                      </Text>

                      <TouchableOpacity onPress={() => handleSelectFund(fund)} activeOpacity={0.8}>
                        <YStack
                          backgroundColor="#DA291C"
                          borderRadius={12}
                          paddingVertical={12}
                          alignItems="center"
                        >
                          <Text fontSize={14} fontWeight="700" color="white">Invest in this Fund</Text>
                        </YStack>
                      </TouchableOpacity>
                    </YStack>
                  </GlassCard>
                </MotiView>
              ))}
            </YStack>

            {/* Divider */}
            <XStack height={1} backgroundColor="rgba(0,0,0,0.06)" marginVertical={32} />

            {/* Explore More Section */}
            <YStack gap="$4">
              <YStack>
                <Text fontSize={18} fontWeight="800" color="black">Explore More {selectedProduct?.name || 'Options'}</Text>
                <Text fontSize={13} color="rgba(0,0,0,0.5)" marginTop="$1">
                  Compare other available funds in this category beyond your matches
                </Text>
              </YStack>

              {/* Search and Filters */}
              <XStack
                backgroundColor="white"
                borderRadius={12}
                paddingHorizontal={12}
                paddingVertical={8}
                alignItems="center"
                borderWidth={1}
                borderColor="rgba(0,0,0,0.08)"
              >
                <Feather name="search" size={16} color="rgba(0,0,0,0.4)" style={{ marginRight: 8 }} />
                <Input
                  flex={1}
                  placeholder={`Search ${selectedProduct?.name || 'funds'}...`}
                  value={searchQuery}
                  onChangeText={(val) => {
                    setSearchQuery(val);
                    if (val) setShowAllOtherFunds(true);
                  }}
                  backgroundColor="transparent"
                  borderWidth={0}
                  paddingHorizontal={0}
                  fontSize={14}
                  height={36}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Feather name="x" size={16} color="rgba(0,0,0,0.4)" />
                  </TouchableOpacity>
                )}
              </XStack>

              {/* Filter Chips */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                {['All', 'Equity', 'Fixed Income', 'Sustainable', 'Thematic'].map((filter) => {
                  const isActive = selectedFilter === filter;
                  return (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => {
                        setSelectedFilter(filter);
                        setShowAllOtherFunds(true);
                      }}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: isActive ? '#DA291C' : 'white',
                        borderWidth: 1,
                        borderColor: isActive ? '#DA291C' : 'rgba(0,0,0,0.08)',
                      }}
                    >
                      <Text fontSize={12} fontWeight={isActive ? '700' : '500'} color={isActive ? 'white' : 'rgba(0,0,0,0.6)'}>
                        {filter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Other Funds List */}
              <YStack gap="$3">
                {displayedOtherFunds.map((fund, idx) => (
                  <MotiView
                    key={fund.name}
                    from={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 50 }}
                  >
                    <GlassCard padding="$4" backgroundColor="rgba(255, 255, 255, 0.7)">
                      <YStack gap="$2">
                        <XStack justifyContent="space-between" alignItems="flex-start">
                          <YStack flex={1} paddingRight="$2">
                            <Text fontSize={14} fontWeight="700" color="black">{fund.name}</Text>
                            <XStack gap="$2" marginTop={4} alignItems="center">
                              <YStack
                                backgroundColor="rgba(0,0,0,0.04)"
                                paddingHorizontal="$2"
                                paddingVertical={2}
                                borderRadius={6}
                              >
                                <Text fontSize={10} color="rgba(0,0,0,0.6)" fontWeight="700">{fund.assetClass}</Text>
                              </YStack>
                              <XStack alignItems="center" gap="$0.5">
                                <Feather name="trending-up" size={10} color="#4CAF50" />
                                <Text fontSize={11} color="#4CAF50" fontWeight="700">{fund.ytd} YTD</Text>
                              </XStack>
                            </XStack>
                          </YStack>
                          <TouchableOpacity
                            onPress={() => handleSelectFund(fund)}
                            style={{
                              backgroundColor: '#DA291C',
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 8,
                            }}
                          >
                            <Text fontSize={12} fontWeight="700" color="white">Invest</Text>
                          </TouchableOpacity>
                        </XStack>
                        <Text fontSize={12} color="rgba(0,0,0,0.5)" lineHeight={16}>
                          {fund.reason}
                        </Text>
                      </YStack>
                    </GlassCard>
                  </MotiView>
                ))}

                {displayedOtherFunds.length === 0 && (
                  <YStack alignItems="center" paddingVertical={20}>
                    <Text fontSize={13} color="rgba(0,0,0,0.4)">No funds match your search.</Text>
                  </YStack>
                )}
              </YStack>

              {/* Expand/Collapse Button */}
              {searchQuery === '' && selectedFilter === 'All' && OTHER_MOCK_FUNDS.length > 2 && (
                <TouchableOpacity
                  onPress={() => setShowAllOtherFunds(!showAllOtherFunds)}
                  activeOpacity={0.8}
                >
                  <XStack justifyContent="center" alignItems="center" gap="$1" paddingVertical={8}>
                    <Text fontSize={13} fontWeight="700" color="#DA291C">
                      {showAllOtherFunds ? 'Show Fewer Funds' : `View All ${OTHER_MOCK_FUNDS.length} Other Funds`}
                    </Text>
                    <Feather name={showAllOtherFunds ? 'chevron-up' : 'chevron-down'} size={16} color="#DA291C" />
                  </XStack>
                </TouchableOpacity>
              )}
            </YStack>
          </>
        )}
      </ScrollView>
    </YStack>
  );
}
