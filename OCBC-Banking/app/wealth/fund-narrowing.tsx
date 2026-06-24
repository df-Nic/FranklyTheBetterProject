import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
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
  MOCK_AI_REPLIES,
  DEFAULT_AI_REPLY,
} from '../../components/wealth/mockData';

function getMockReply(question: string): string {
  const lower = question.toLowerCase();
  const match = MOCK_AI_REPLIES.find(r => r.keywords.some(kw => lower.includes(kw)));
  return match?.reply ?? DEFAULT_AI_REPLY;
}

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

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 130, paddingBottom: 60 }}>
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
                We've matched {funds.length} funds to your {riskProfile} risk profile. Each one has been selected to help grow your AUM toward Premier Banking.
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

                      <XStack gap="$3">
                        <TouchableOpacity onPress={() => handleAskAbout(fund)} style={{ flex: 1 }} activeOpacity={0.8}>
                          <YStack
                            borderWidth={1.5}
                            borderColor="rgba(218,41,28,0.3)"
                            borderRadius={12}
                            paddingVertical={10}
                            alignItems="center"
                          >
                            <Text fontSize={13} fontWeight="700" color="#DA291C">Ask about this →</Text>
                          </YStack>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSelectFund(fund)} style={{ flex: 1 }} activeOpacity={0.8}>
                          <YStack
                            backgroundColor="#DA291C"
                            borderRadius={12}
                            paddingVertical={10}
                            alignItems="center"
                          >
                            <Text fontSize={13} fontWeight="700" color="white">Invest Now</Text>
                          </YStack>
                        </TouchableOpacity>
                      </XStack>
                    </YStack>
                  </GlassCard>
                </MotiView>
              ))}
            </YStack>
          </>
        )}
      </ScrollView>

      {/* Ask About This — Modal (no portal needed) */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setModalOpen(false)}
      >
        <YStack flex={1} backgroundColor="rgba(0,0,0,0.4)" justifyContent="flex-end">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <YStack
              backgroundColor="#FAFAFA"
              borderTopLeftRadius={24}
              borderTopRightRadius={24}
              maxHeight="65%"
              overflow="hidden"
            >
              {/* Handle */}
              <YStack alignItems="center" paddingTop={12} paddingBottom={4}>
                <YStack width={36} height={4} borderRadius={2} backgroundColor="rgba(0,0,0,0.15)" />
              </YStack>

              {/* Header */}
              <XStack
                paddingHorizontal={20}
                paddingVertical={14}
                justifyContent="space-between"
                alignItems="center"
                borderBottomWidth={1}
                borderColor="rgba(0,0,0,0.06)"
              >
                <YStack flex={1}>
                  <Text fontSize={15} fontWeight="800" color="black" numberOfLines={2}>{modalFund?.name}</Text>
                  <Text fontSize={12} color="rgba(0,0,0,0.5)">Ask me anything about this fund</Text>
                </YStack>
                <Button circular size="$3" backgroundColor="rgba(0,0,0,0.05)" onPress={() => setModalOpen(false)}>
                  <Feather name="x" size={16} color="black" />
                </Button>
              </XStack>

              {/* Chat */}
              <ScrollView
                style={{ flex: 1, paddingHorizontal: 20 }}
                contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
                keyboardShouldPersistTaps="handled"
              >
                {chatHistory.map((msg, i) => (
                  <YStack
                    key={i}
                    alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    backgroundColor={msg.role === 'user' ? '#DA291C' : 'rgba(0,0,0,0.06)'}
                    paddingHorizontal={14}
                    paddingVertical={10}
                    borderRadius={16}
                    maxWidth="85%"
                  >
                    <Text fontSize={14} color={msg.role === 'user' ? 'white' : 'black'} lineHeight={20}>
                      {msg.content}
                    </Text>
                  </YStack>
                ))}
                {aiTyping && (
                  <YStack
                    alignSelf="flex-start"
                    backgroundColor="rgba(0,0,0,0.06)"
                    paddingHorizontal={14}
                    paddingVertical={10}
                    borderRadius={16}
                  >
                    <XStack gap="$2" alignItems="center">
                      <Spinner size="small" color="#DA291C" />
                      <Text fontSize={13} color="rgba(0,0,0,0.5)">Typing...</Text>
                    </XStack>
                  </YStack>
                )}
              </ScrollView>

              {/* Input */}
              <XStack
                gap="$3"
                paddingHorizontal={20}
                paddingVertical={14}
                paddingBottom={Platform.OS === 'ios' ? 34 : 20}
                borderTopWidth={1}
                borderColor="rgba(0,0,0,0.06)"
              >
                <Input
                  flex={1}
                  placeholder="Ask about this fund..."
                  value={chatInput}
                  onChangeText={setChatInput}
                  backgroundColor="rgba(0,0,0,0.05)"
                  borderColor="transparent"
                  borderRadius={14}
                  fontSize={14}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                />
                <Button circular size="$4" backgroundColor="#DA291C" pressStyle={{ opacity: 0.8 }} onPress={handleSendMessage}>
                  <Feather name="send" size={16} color="white" />
                </Button>
              </XStack>
            </YStack>
          </KeyboardAvoidingView>
        </YStack>
      </Modal>
    </YStack>
  );
}
