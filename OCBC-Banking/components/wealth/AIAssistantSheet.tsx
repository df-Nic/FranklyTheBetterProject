import React, { useState, useRef } from 'react';
import { Modal, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from 'react-native';
import { YStack, XStack, Text, Button, Input, Spinner } from 'tamagui';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useWealth } from './WealthContext';
import { MOCK_AI_REPLIES, DEFAULT_AI_REPLY } from './mockData';
import { BlurView } from 'expo-blur';

function getMockReply(question: string): string {
  const lower = question.toLowerCase();
  const match = MOCK_AI_REPLIES.find(r => r.keywords.some(kw => lower.includes(kw)));
  return match?.reply ?? DEFAULT_AI_REPLY;
}

export function AIAssistantSheet() {
  const { state, dispatch } = useWealth();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const QUICK_QUESTIONS = [
    'How close am I to Premier?',
    'What products are safest?',
    'How long until I unlock Premier?',
  ];

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    dispatch({ type: 'ADD_AI_MESSAGE', role: 'user', content: msg });
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getMockReply(msg);
      dispatch({ type: 'ADD_AI_MESSAGE', role: 'assistant', content: reply });
      setTyping(false);
    }, 1300);
  };

  return (
    <Modal
      visible={state.aiAssistantOpen}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => dispatch({ type: 'CLOSE_AI_ASSISTANT' })}
    >
      {/* Dimmed backdrop */}
      <YStack
        flex={1}
        backgroundColor="rgba(0,0,0,0.4)"
        justifyContent="flex-end"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%' }}
        >
          <YStack
            backgroundColor="#FAFAFA"
            borderTopLeftRadius={24}
            borderTopRightRadius={24}
            height={Dimensions.get('window').height * 0.72}
            overflow="hidden"
          >
            {/* Drag handle */}
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
              <XStack alignItems="center" gap="$3">
                <YStack
                  width={40} height={40}
                  borderRadius={20}
                  backgroundColor="rgba(218,41,28,0.1)"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FontAwesome5 name="robot" size={18} color="#DA291C" />
                </YStack>
                <YStack>
                  <Text fontSize={16} fontWeight="800" color="black">AI Wealth Assistant</Text>
                  <Text fontSize={12} color="rgba(0,0,0,0.45)">Ask me anything about your journey</Text>
                </YStack>
              </XStack>
              <Button
                circular size="$3"
                backgroundColor="rgba(0,0,0,0.05)"
                onPress={() => dispatch({ type: 'CLOSE_AI_ASSISTANT' })}
              >
                <Feather name="x" size={16} color="black" />
              </Button>
            </XStack>

            {/* Quick questions (only when no history) */}
            {state.aiChatHistory.length === 0 && (
              <YStack padding={20} gap="$2">
                <Text fontSize={12} fontWeight="700" color="rgba(0,0,0,0.4)" marginBottom="$1">
                  QUICK QUESTIONS
                </Text>
                {QUICK_QUESTIONS.map(q => (
                  <Button
                    key={q}
                    size="$3"
                    backgroundColor="rgba(218,41,28,0.06)"
                    borderRadius={12}
                    pressStyle={{ opacity: 0.75 }}
                    onPress={() => handleSend(q)}
                    alignSelf="flex-start"
                  >
                    <Text fontSize={13} color="#DA291C" fontWeight="600">{q}</Text>
                  </Button>
                ))}
              </YStack>
            )}

            {/* Chat messages */}
            <ScrollView
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              style={{ flex: 1, paddingHorizontal: 20 }}
              contentContainerStyle={{ gap: 12, paddingVertical: 16 }}
              keyboardShouldPersistTaps="handled"
            >
              {state.aiChatHistory.map((msg, i) => (
                <MotiView
                  key={i}
                  from={{ opacity: 0, translateY: 8 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 200 }}
                  style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
                >
                  <YStack
                    backgroundColor={msg.role === 'user' ? '#DA291C' : 'rgba(0,0,0,0.07)'}
                    paddingHorizontal={14}
                    paddingVertical={10}
                    borderRadius={16}
                  >
                    <Text fontSize={14} color={msg.role === 'user' ? 'white' : 'black'} lineHeight={20}>
                      {msg.content}
                    </Text>
                  </YStack>
                </MotiView>
              ))}

              {typing && (
                <YStack
                  alignSelf="flex-start"
                  backgroundColor="rgba(0,0,0,0.07)"
                  paddingHorizontal={14}
                  paddingVertical={10}
                  borderRadius={16}
                >
                  <XStack gap="$2" alignItems="center">
                    <Spinner size="small" color="#DA291C" />
                    <Text fontSize={13} color="rgba(0,0,0,0.5)">Thinking...</Text>
                  </XStack>
                </YStack>
              )}
            </ScrollView>

            {/* Input */}
            <XStack
              gap="$3"
              paddingHorizontal={20}
              paddingVertical={14}
              paddingBottom={Platform.OS === 'ios' ? 34 : 48}
              borderTopWidth={1}
              borderColor="rgba(0,0,0,0.06)"
            >
              <Input
                flex={1}
                placeholder="Ask your AI assistant..."
                value={input}
                onChangeText={setInput}
                backgroundColor="rgba(0,0,0,0.05)"
                borderColor="transparent"
                borderRadius={14}
                fontSize={14}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
              />
              <Button
                circular
                size="$4"
                backgroundColor="#DA291C"
                pressStyle={{ opacity: 0.8 }}
                onPress={() => handleSend()}
              >
                <Feather name="send" size={16} color="white" />
              </Button>
            </XStack>
          </YStack>
        </KeyboardAvoidingView>
      </YStack>
    </Modal>
  );
}
