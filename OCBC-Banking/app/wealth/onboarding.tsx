import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { YStack, XStack, Text, Button } from 'tamagui';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { GlassCard } from '../../components/GlassCard';
import { BackgroundOrb } from '../../components/BackgroundOrb';
import { useWealth } from '../../components/wealth/WealthContext';

const QUESTIONS = [
  {
    id: 'ageRange',
    label: 'What is your age range?',
    options: ['20s', '30s', '40s', '50s+'],
  },
  {
    id: 'incomeRange',
    label: 'What is your monthly income?',
    options: ['SGD 3–5k', 'SGD 5–10k', 'SGD 10–20k', 'SGD 20k+'],
  },
  {
    id: 'investAmount',
    label: 'How much can you invest now?',
    options: ['SGD 1–5k', 'SGD 5–20k', 'SGD 20–50k', 'SGD 50k+'],
  },
  {
    id: 'loans',
    label: 'Do you have any outstanding loans?',
    options: ['Mortgage', 'Car loan', 'Personal loan', 'None'],
  },
  {
    id: 'marketPreference',
    label: 'Which markets interest you most?',
    options: ['Singapore', 'Asia', 'Global', 'No preference'],
  },
  {
    id: 'knowledgeLevel',
    label: 'What is your financial knowledge level?',
    options: ['Basic (Starting out)', 'Intermediate (Fundamentals)', 'Advanced (Complex instruments)'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { dispatch } = useWealth();

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const allAnswered = QUESTIONS.every(q => answers[q.id]);
  const answeredCount = Object.keys(answers).length;
  const progress = answeredCount / QUESTIONS.length;

  const handleSelect = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleContinue = () => {
    let kl: 'Basic' | 'Intermediate' | 'Advanced' = 'Basic';
    if (answers.knowledgeLevel?.startsWith('Intermediate')) kl = 'Intermediate';
    else if (answers.knowledgeLevel?.startsWith('Advanced')) kl = 'Advanced';

    dispatch({
      type: 'COMPLETE_ONBOARDING',
      profile: {
        ageRange: answers.ageRange,
        incomeRange: answers.incomeRange,
        investAmount: answers.investAmount,
        loans: answers.loans,
        targetTierTimeline: '3–5 years',
        marketPreference: answers.marketPreference,
        riskProfile: null,
        knowledgeLevel: kl,
      },
    });
    // Replace (not push) so onboarding is removed from the back stack.
    // After the quiz the user can go back without stepping through onboarding again.
    router.replace('/wealth/risk-swipe');
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <BackgroundOrb size={350} color="rgba(218, 41, 28, 0.07)" top="-10%" right="-20%" fromOpacity={0.4} toOpacity={0.8} />

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
          <Button
            circular size="$3"
            backgroundColor="rgba(0,0,0,0.05)"
            onPress={() => router.back()}
            pressStyle={{ opacity: 0.7 }}
          >
            <Feather name="arrow-left" size={18} color="black" />
          </Button>
          <Text fontSize={17} fontWeight="700" color="black">Tell us about yourself</Text>
          <Text fontSize={14} color="#DA291C" fontWeight="600">
            {answeredCount}/{QUESTIONS.length}
          </Text>
        </XStack>

        {/* Progress bar */}
        <YStack backgroundColor="rgba(0,0,0,0.04)" height={3}>
          <MotiView
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'timing', duration: 300 }}
            style={{ height: 3, backgroundColor: '#DA291C' }}
          />
        </YStack>
      </YStack>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 110, paddingBottom: 120 }}>
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100 }}
          style={{ marginTop: 24 }}
        >
          <Text fontSize={14} color="rgba(0,0,0,0.5)" lineHeight={20} marginBottom="$6">
            Help us understand your financial situation so we can build a personalised investment plan.
          </Text>
        </MotiView>

        <YStack gap="$5">
          {QUESTIONS.map((question, index) => (
            <MotiView
              key={question.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 150 + index * 80 }}
            >
              <YStack gap="$3">
                <XStack alignItems="center" gap="$2">
                  <YStack
                    width={24} height={24}
                    borderRadius={12}
                    backgroundColor={answers[question.id] ? '#DA291C' : 'rgba(0,0,0,0.08)'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {answers[question.id] ? (
                      <Feather name="check" size={13} color="white" />
                    ) : (
                      <Text fontSize={11} fontWeight="700" color="rgba(0,0,0,0.35)">{index + 1}</Text>
                    )}
                  </YStack>
                  <Text fontSize={15} fontWeight="700" color="black" flex={1}>
                    {question.label}
                  </Text>
                </XStack>

                <XStack flexWrap="wrap" gap="$2">
                  {question.options.map(option => {
                    const selected = answers[question.id] === option;
                    return (
                      <TouchableOpacity key={option} onPress={() => handleSelect(question.id, option)} activeOpacity={0.7}>
                        <MotiView
                          animate={{
                            scale: selected ? 1.03 : 1,
                          }}
                          transition={{ type: 'spring', damping: 15 }}
                        >
                          <YStack
                            paddingHorizontal={16}
                            paddingVertical={10}
                            borderRadius={25}
                            borderWidth={1.5}
                            borderColor={selected ? '#DA291C' : 'rgba(0,0,0,0.1)'}
                            backgroundColor={selected ? 'rgba(218,41,28,0.08)' : 'rgba(255,255,255,0.7)'}
                          >
                            <Text
                              fontSize={13}
                              fontWeight={selected ? '700' : '500'}
                              color={selected ? '#DA291C' : 'rgba(0,0,0,0.6)'}
                            >
                              {option}
                            </Text>
                          </YStack>
                        </MotiView>
                      </TouchableOpacity>
                    );
                  })}
                </XStack>
              </YStack>
            </MotiView>
          ))}
        </YStack>
      </ScrollView>

      {/* Sticky CTA */}
      <YStack
        position="absolute"
        bottom={0} left={0} right={0}
        padding={24}
        paddingBottom={40}
      >
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
        <MotiView
          animate={{ opacity: allAnswered ? 1 : 0.4, scale: allAnswered ? 1 : 0.98 }}
          transition={{ type: 'spring' }}
        >
          <Button
            size="$5"
            backgroundColor="#DA291C"
            color="white"
            borderRadius={16}
            height={56}
            fontWeight="bold"
            fontSize={16}
            disabled={!allAnswered}
            pressStyle={allAnswered ? { opacity: 0.85, scale: 0.98 } : {}}
            onPress={allAnswered ? handleContinue : undefined}
            elevation={allAnswered ? 6 : 0}
            shadowColor="#DA291C"
            shadowRadius={12}
            shadowOpacity={allAnswered ? 0.3 : 0}
          >
            Continue →
          </Button>
        </MotiView>
      </YStack>
    </YStack>
  );
}
