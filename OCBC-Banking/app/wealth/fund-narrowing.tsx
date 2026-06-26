import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Dimensions, View, Animated, Image, PanResponder } from 'react-native';
import { YStack, XStack, Text, Button, Spinner, Input, Avatar, Sheet } from 'tamagui';
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
  MOCK_AI_REPLIES,
  DEFAULT_AI_REPLY,
} from '../../components/wealth/mockData';

function getMockReply(question: string): string {
  const lower = question.toLowerCase();
  const match = MOCK_AI_REPLIES.find(r => r.keywords.some(kw => lower.includes(kw)));
  return match?.reply ?? DEFAULT_AI_REPLY;
}

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

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFund, setModalFund] = useState<{ name: string } | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Explore more states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showAllOtherFunds, setShowAllOtherFunds] = useState(false);

  // Floating draggable owl states
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [bubbleOnRight, setBubbleOnRight] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only trigger dragging if moved more than 5px to allow clicking
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        isDragging.current = true;
        setBubbleVisible(false);
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const padding = 20;
        const owlSize = 64;

        // Horizontal boundaries relative to starting position (right: 20)
        const minX = 2 * padding + owlSize - screenWidth;
        const maxX = 0;

        // Vertical boundaries relative to starting position (bottom: 30)
        const minY = 120 + 30 + owlSize - screenHeight;
        const maxY = 0;

        const offsetX = (pan.x as any)._offset || 0;
        const offsetY = (pan.y as any)._offset || 0;

        let targetX = offsetX + gestureState.dx;
        let targetY = offsetY + gestureState.dy;

        // Clamp values to keep owl on screen
        if (targetX < minX) targetX = minX;
        if (targetX > maxX) targetX = maxX;
        if (targetY < minY) targetY = minY;
        if (targetY > maxY) targetY = maxY;

        pan.x.setValue(targetX - offsetX);
        pan.y.setValue(targetY - offsetY);
      },
      onPanResponderRelease: () => {
        isDragging.current = false;
        pan.flattenOffset();

        // Calculate if owl is on the left half of the screen
        const screenWidth = Dimensions.get('window').width;
        const initialOwlX = screenWidth - 20 - 64; // right=20, owlWidth=64
        const currentOwlX = initialOwlX + (pan.x as any)._value;
        setBubbleOnRight(currentOwlX < screenWidth / 2);

        setBubbleVisible(true);
      },
      onPanResponderTerminate: () => {
        isDragging.current = false;
        pan.flattenOffset();

        // Calculate if owl is on the left half of the screen
        const screenWidth = Dimensions.get('window').width;
        const initialOwlX = screenWidth - 20 - 64;
        const currentOwlX = initialOwlX + (pan.x as any)._value;
        setBubbleOnRight(currentOwlX < screenWidth / 2);

        setBubbleVisible(true);
      }
    })
  ).current;

  const handleOpenGeneralChat = () => {
    setModalFund(null);
    setChatHistory([{
      role: 'assistant',
      content: `Hi there! I am your Investment Owl assistant. Hoot! 🦉\n\nI can help you understand the recommended **${selectedProduct?.name || 'investment'}** products or explain how these fit your **${riskProfile}** risk profile to help you reach **Premier Banking** (SGD 200,000 AUM).\n\nAsk me anything!`,
    }]);
    setChatInput('');
    setModalOpen(true);
  };

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

  const handleAskAbout = (fund: { name: string }) => {
    setModalFund(fund);
    setChatHistory([{
      role: 'assistant',
      content: `Hi! Ask me anything about the **${fund.name}** and whether it fits your investment profile.`,
    }]);
    setChatInput('');
    setModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setAiTyping(true);
    setTimeout(() => {
      const reply = getMockReply(userMsg);
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      setAiTyping(false);
    }, 1200);
  };

  const handleSelectFund = (fund: { name: string; assetClass: string; reason: string; ytd: string }) => {
    dispatch({ type: 'SELECT_FUND', fund });
    router.push('/wealth/cta');
  };

  const speechBubble = (
    <MotiView
      animate={{
        opacity: bubbleVisible ? 1 : 0,
        scale: bubbleVisible ? 1 : 0.8,
        translateX: bubbleVisible ? 0 : (bubbleOnRight ? -10 : 10),
      }}
      transition={{ type: 'timing', duration: 200 }}
      style={{
        position: 'absolute',
        top: 14,
        left: bubbleOnRight ? 72 : -178,
      }}
    >
      <TouchableOpacity onPress={handleOpenGeneralChat} activeOpacity={0.95}>
        <GlassCard
          paddingHorizontal="$3"
          paddingVertical="$2"
          backgroundColor="white"
          width={170}
          borderWidth={1}
          borderColor="rgba(0,0,0,0.06)"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <XStack alignItems="center" gap="$1.5" justifyContent="center">
            <Text fontSize={12} fontWeight="700" color="black">Ask Investment Owl</Text>
            <Text fontSize={12}>🦉</Text>
          </XStack>
        </GlassCard>
      </TouchableOpacity>
    </MotiView>
  );

  const owlAvatar = (
    <MotiView
      from={{ scale: 0, rotate: '-20deg' }}
      animate={{ scale: 1, rotate: '0deg' }}
      transition={{ type: 'spring', delay: 500 }}
    >
      <TouchableOpacity
        onPress={handleOpenGeneralChat}
        activeOpacity={0.9}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <YStack
          width={64}
          height={64}
          borderRadius={32}
          backgroundColor="white"
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            source={require('../../assets/images/Invest Owl.jpg')}
            style={{
              width: 64,
              height: 64,
            }}
            resizeMode="contain"
          />
        </YStack>
      </TouchableOpacity>
    </MotiView>
  );

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

      {/* Ask About This — Sheet */}
      <Sheet
        modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        snapPoints={[85]}
        dismissOnSnapToBottom
        position={0}
        zIndex={100000}
      >
        <Sheet.Overlay enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} backgroundColor="rgba(0,0,0,0.4)" />
        <Sheet.Handle backgroundColor="rgba(0,0,0,0.15)" />
        <Sheet.Frame backgroundColor="#F5F5F7" borderTopLeftRadius={24} borderTopRightRadius={24}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            {/* Header */}
            <XStack
              paddingHorizontal={20}
              paddingVertical={14}
              justifyContent="space-between"
              alignItems="center"
              backgroundColor="white"
              borderBottomWidth={1}
              borderColor="rgba(0,0,0,0.06)"
            >
              <XStack alignItems="center" gap="$3" flex={1}>
                <YStack width={36} height={36} borderRadius={18} backgroundColor="rgba(218,41,28,0.1)" alignItems="center" justifyContent="center" overflow="hidden">
                  {modalFund ? (
                    <Feather name="bar-chart-2" size={16} color="#DA291C" />
                  ) : (
                    <Image
                      source={require('../../assets/images/Invest Owl.jpg')}
                      style={{ width: 36, height: 36 }}
                      resizeMode="contain"
                    />
                  )}
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="800" color="black" numberOfLines={1}>
                    {modalFund ? modalFund.name : (selectedProduct?.name ? `${selectedProduct.name} Advisor` : 'Investment Advisor')}
                  </Text>
                  <Text fontSize={12} color="#DA291C" fontWeight="600">
                    {modalFund ? 'Fund Assistant' : 'Investment Owl'}
                  </Text>
                </YStack>
              </XStack>
              <Button circular size="$3" backgroundColor="rgba(0,0,0,0.05)" onPress={() => setModalOpen(false)}>
                <Feather name="x" size={16} color="black" />
              </Button>
            </XStack>

            {/* Chat */}
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              style={{ flex: 1, paddingHorizontal: 20 }}
              contentContainerStyle={{ gap: 16, paddingVertical: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              {chatHistory.map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <XStack key={i} justifyContent={isUser ? 'flex-end' : 'flex-start'} gap="$2" alignItems="flex-end">
                    {!isUser && (
                      <YStack width={28} height={28} borderRadius={14} backgroundColor="white" borderWidth={1} borderColor="rgba(0,0,0,0.08)" overflow="hidden" alignItems="center" justifyContent="center">
                        <Image
                          source={require('../../assets/images/Invest Owl.jpg')}
                          style={{ width: 26, height: 26 }}
                          resizeMode="contain"
                        />
                      </YStack>
                    )}
                    <YStack
                      backgroundColor={isUser ? '#DA291C' : 'white'}
                      paddingHorizontal={16}
                      paddingVertical={12}
                      borderRadius={20}
                      borderBottomRightRadius={isUser ? 4 : 20}
                      borderBottomLeftRadius={!isUser ? 4 : 20}
                      maxWidth="80%"
                      shadowColor="#000"
                      shadowOpacity={0.04}
                      shadowRadius={8}
                      elevation={2}
                    >
                      <Text fontSize={14} color={isUser ? 'white' : 'black'} lineHeight={22}>
                        {msg.content}
                      </Text>
                    </YStack>
                  </XStack>
                );
              })}
              {aiTyping && (
                <XStack justifyContent="flex-start" gap="$2" alignItems="flex-end">
                  <YStack width={28} height={28} borderRadius={14} backgroundColor="white" borderWidth={1} borderColor="rgba(0,0,0,0.08)" overflow="hidden" alignItems="center" justifyContent="center">
                    <Image
                      source={require('../../assets/images/Invest Owl.jpg')}
                      style={{ width: 26, height: 26 }}
                      resizeMode="contain"
                    />
                  </YStack>
                  <YStack
                    backgroundColor="white"
                    paddingHorizontal={16}
                    paddingVertical={12}
                    borderRadius={20}
                    borderBottomLeftRadius={4}
                    shadowColor="#000"
                    shadowOpacity={0.04}
                    shadowRadius={8}
                  >
                    <XStack gap="$2" alignItems="center">
                      <Spinner size="small" color="#DA291C" />
                      <Text fontSize={13} color="rgba(0,0,0,0.5)">Typing...</Text>
                    </XStack>
                  </YStack>
                </XStack>
              )}
            </ScrollView>

            <YStack backgroundColor="white" paddingTop={12} paddingBottom={Platform.OS === 'ios' ? 34 : 48} paddingHorizontal={20} borderTopWidth={1} borderColor="rgba(0,0,0,0.06)">
              <XStack
                gap="$3"
                backgroundColor="#F5F5F7"
                borderRadius={24}
                paddingHorizontal={16}
                paddingVertical={8}
                alignItems="center"
                borderWidth={1}
                borderColor="rgba(0,0,0,0.05)"
              >
                <Input
                  flex={1}
                  placeholder={modalFund ? "Ask about this fund..." : "Ask Investment Owl..."}
                  value={chatInput}
                  onChangeText={setChatInput}
                  backgroundColor="transparent"
                  borderWidth={0}
                  paddingHorizontal={0}
                  fontSize={15}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                />
                <Button circular size="$3" backgroundColor={chatInput.trim() ? '#DA291C' : 'rgba(0,0,0,0.1)'} pressStyle={{ opacity: 0.8 }} onPress={handleSendMessage}>
                  <Feather name="arrow-up" size={18} color="white" />
                </Button>
              </XStack>
            </YStack>
          </KeyboardAvoidingView>
        </Sheet.Frame>
      </Sheet>

      {/* Floating Draggable Investment Owl Assistant Bubble */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          width: 64,
          height: 64,
          zIndex: 1000,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        }}
      >
        {owlAvatar}
        {speechBubble}
      </Animated.View>
    </YStack>
  );
}
