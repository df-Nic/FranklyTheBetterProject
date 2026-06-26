import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Button, Input, Text, XStack, YStack } from 'tamagui';
import { GlassCard } from '../../components/GlassCard';
import { getMockSimulation, getPlanningOwlScenarios, PlanningOwlAnswers, PlanningOwlScenario, PlanningOwlSimulation } from '../../constants/planningOwlMocks';
import {
  deleteSavedPlanningOwlPlan,
  getSavedPlanningOwlPlans,
  savePlanningOwlPlan,
  SavedPlanningOwlPlan,
} from '../../constants/planningOwlSavedPlanStore';

type PlanningStep = 'plansHome' | 'eventPicker' | 'question1' | 'question2' | 'question3' | 'results' | 'comparison' | 'committed';

type PlanningOwlState = {
  step: PlanningStep;
  selectedEvent: 'property' | null;
  answers: PlanningOwlAnswers;
  selectedScenario: PlanningOwlScenario;
  savedPlans: SavedPlanningOwlPlan[];
  activePlanId: string | null;
  isViewingSavedPlan: boolean;
  askOwlOpen: boolean;
};

type QuestionConfig = {
  step: Extract<PlanningStep, 'question1' | 'question2' | 'question3'>;
  questionNumber: 1 | 2 | 3;
  answerKey: keyof PlanningOwlAnswers;
  title: string;
  subtitle: string;
  options: string[];
  chip?: string;
};

const initialState: PlanningOwlState = {
  step: 'plansHome',
  selectedEvent: null,
  answers: {
    propertyValue: null,
    downpayment: null,
    timeframe: null,
  },
  selectedScenario: 'match_timing',
  savedPlans: [],
  activePlanId: null,
  isViewingSavedPlan: false,
  askOwlOpen: false,
};

const questionConfigs: QuestionConfig[] = [
  {
    step: 'question1',
    questionNumber: 1,
    answerKey: 'propertyValue',
    title: 'What property value are you planning for?',
    subtitle: 'Choose the closest range for now. You can refine it later.',
    options: ['S$600k - 800k', 'S$800k - 1.2m', 'S$1.2m - 1.6m'],
  },
  {
    step: 'question2',
    questionNumber: 2,
    answerKey: 'downpayment',
    title: 'How much downpayment do you want ready?',
    subtitle: 'Planning Owl will use this to estimate your cash runway.',
    options: ['20%', '25%', '30%'],
    chip: 'Current eligible cash: S$150,890',
  },
  {
    step: 'question3',
    questionNumber: 3,
    answerKey: 'timeframe',
    title: 'When would you like to buy?',
    subtitle: 'A realistic target lets the plan balance growth and liquidity.',
    options: ['1-2 years', '3-4 years', '5-6 years'],
  },
];

const stepOrder: PlanningStep[] = ['plansHome', 'eventPicker', 'question1', 'question2', 'question3', 'results', 'comparison', 'committed'];

export default function PlanningOwlPage() {
  const router = useRouter();
  const [state, setState] = useState<PlanningOwlState>(initialState);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scenarios = useMemo(() => getPlanningOwlScenarios(state.answers), [state.answers]);
  const simulation = useMemo(() => getMockSimulation(state.answers, state.selectedScenario), [state.answers, state.selectedScenario]);
  const currentQuestion = questionConfigs.find((question) => question.step === state.step);

  useEffect(() => {
    let isMounted = true;

    getSavedPlanningOwlPlans().then((savedPlans) => {
      if (isMounted) {
        setState((current) => ({ ...current, savedPlans }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const transitionTo = (step: PlanningStep, patch?: Partial<PlanningOwlState>) => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    setState((current) => ({ ...current, ...patch, step }));
    setTimeout(() => setIsTransitioning(false), 280);
  };

  const updateAnswer = (key: keyof PlanningOwlAnswers, value: string) => {
    setState((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [key]: value,
      },
    }));
  };

  const goBack = () => {
    if (state.step === 'plansHome') {
      router.replace('/owl-tiering');
      return;
    }

    if (state.isViewingSavedPlan && (state.step === 'results' || state.step === 'comparison')) {
      transitionTo('plansHome', {
        selectedEvent: null,
        selectedScenario: 'match_timing',
        answers: initialState.answers,
        activePlanId: null,
        isViewingSavedPlan: false,
      });
      return;
    }

    if (state.step === 'committed') {
      transitionTo('plansHome', {
        selectedEvent: null,
        selectedScenario: 'match_timing',
        answers: initialState.answers,
        activePlanId: null,
        isViewingSavedPlan: false,
      });
      return;
    }

    const currentIndex = stepOrder.indexOf(state.step);
    if (currentIndex > 0) {
      transitionTo(stepOrder[currentIndex - 1]);
    }
  };

  const completeQuestion = (question: QuestionConfig) => {
    if (question.step === 'question3') {
      transitionTo('results');
      return;
    }

    transitionTo(question.step === 'question1' ? 'question2' : 'question3');
  };

  const showPendingAction = (target: string) => {
    Alert.alert('Coming soon', `This will open ${target.replace('_', ' ')}.`);
  };

  const editSavedPlan = (savedPlan: SavedPlanningOwlPlan) => {
    transitionTo('question1', {
      selectedEvent: savedPlan.event,
      answers: savedPlan.answers,
      selectedScenario: savedPlan.selectedScenario,
      activePlanId: savedPlan.id,
      isViewingSavedPlan: false,
    });
  };

  const viewSavedPlan = (savedPlan: SavedPlanningOwlPlan) => {
    transitionTo('results', {
      selectedEvent: savedPlan.event,
      answers: savedPlan.answers,
      selectedScenario: savedPlan.selectedScenario,
      activePlanId: savedPlan.id,
      isViewingSavedPlan: true,
    });
  };

  const openNewPlanPicker = () => {
    transitionTo('eventPicker', {
      selectedEvent: null,
      answers: initialState.answers,
      selectedScenario: 'match_timing',
      activePlanId: null,
      isViewingSavedPlan: false,
    });
  };

  const createPropertyPlan = () => {
    transitionTo('question1', {
      selectedEvent: 'property',
      answers: initialState.answers,
      selectedScenario: 'match_timing',
      activePlanId: null,
      isViewingSavedPlan: false,
    });
  };

  const deleteSavedPlan = (savedPlan: SavedPlanningOwlPlan) => {
    Alert.alert('Delete saved plan?', `Delete "${savedPlan.title}"? This cannot be undone.`, [
      { text: 'Keep plan', style: 'cancel' },
      {
        text: 'Delete plan',
        style: 'destructive',
        onPress: async () => {
          const planId = savedPlan.id;
          await deleteSavedPlanningOwlPlan(planId);
          const savedPlans = await getSavedPlanningOwlPlans();
          setState((current) => ({
            ...current,
            savedPlans,
            activePlanId: current.activePlanId === planId ? null : current.activePlanId,
            isViewingSavedPlan: current.activePlanId === planId ? false : current.isViewingSavedPlan,
            step: current.activePlanId === planId ? 'plansHome' : current.step,
          }));
        },
      },
    ]);
  };

  const commitPlan = async () => {
    if (isTransitioning) {
      return;
    }

    setIsTransitioning(true);
    const savedPlan = await savePlanningOwlPlan({
      id: state.activePlanId,
      event: 'property',
      answers: state.answers,
      selectedScenario: state.selectedScenario,
    });
    const savedPlans = await getSavedPlanningOwlPlans();
    setState((current) => ({ ...current, savedPlans, activePlanId: savedPlan.id, step: 'committed' }));
    setTimeout(() => setIsTransitioning(false), 280);
  };

  const finishAndReturnHome = () => {
    setState((current) => ({
      ...initialState,
      savedPlans: current.savedPlans,
      isViewingSavedPlan: false,
    }));
    router.replace('/(tabs)/home');
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHeader step={state.step} onBack={goBack} disableBack={isTransitioning} />

        <MotiView
          key={state.step}
          from={{ opacity: 0, translateX: 28 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -28 }}
          transition={{ type: 'timing', duration: 260 }}
        >
          {state.step === 'plansHome' && (
            <PlansHome
              savedPlans={state.savedPlans}
              disabled={isTransitioning}
              onNewPlan={openNewPlanPicker}
              onEditSavedPlan={editSavedPlan}
              onViewSavedPlan={viewSavedPlan}
              onDeleteSavedPlan={deleteSavedPlan}
            />
          )}

          {state.step === 'eventPicker' && (
            <LifeEventPicker
              disabled={isTransitioning}
              onSelectProperty={createPropertyPlan}
            />
          )}

          {currentQuestion && (
            <FollowUpQuestion
              question={currentQuestion}
              selectedValue={state.answers[currentQuestion.answerKey]}
              disabled={isTransitioning}
              onSelect={(value) => updateAnswer(currentQuestion.answerKey, value)}
              onNext={() => completeQuestion(currentQuestion)}
              onBack={goBack}
            />
          )}

          {state.step === 'results' && (
            <SimulationResults
              simulation={simulation}
              scenarios={scenarios}
              selectedScenario={state.selectedScenario}
              disabled={isTransitioning}
              isReadOnly={state.isViewingSavedPlan}
              onScenarioChange={(selectedScenario) => setState((current) => ({ ...current, selectedScenario, isViewingSavedPlan: false }))}
              onCompare={() => transitionTo('comparison')}
            />
          )}

          {state.step === 'comparison' && (
            <StrategyComparison
              simulation={simulation}
              disabled={isTransitioning}
              isReadOnly={state.isViewingSavedPlan}
              onActionPress={showPendingAction}
              onCommit={commitPlan}
            />
          )}

          {state.step === 'committed' && (
            <CommitConfirmation
              simulation={simulation}
              answers={state.answers}
              onDone={finishAndReturnHome}
            />
          )}
        </MotiView>
      </ScrollView>

      <AskOwlButton
        isOpen={state.askOwlOpen}
        onOpen={() => setState((current) => ({ ...current, askOwlOpen: true }))}
        onClose={() => setState((current) => ({ ...current, askOwlOpen: false }))}
      />
    </YStack>
  );
}

function FlowHeader({ step, onBack, disableBack }: { step: PlanningStep; onBack: () => void; disableBack: boolean }) {
  return (
    <XStack justifyContent="space-between" alignItems="center" marginBottom="$6">
      <Button circular size="$3" backgroundColor="rgba(0,0,0,0.05)" disabled={disableBack} onPress={onBack}>
        <Feather name="chevron-left" size={18} color={disableBack ? 'rgba(0,0,0,0.25)' : 'black'} />
      </Button>
      <YStack alignItems="center">
        <Text fontSize={13} color="#DA291C" fontWeight="700">
          Planning Owl
        </Text>
        <Text fontSize={11} color="rgba(0,0,0,0.5)">
          {step === 'plansHome' ? 'Your plans' : step === 'eventPicker' ? 'Choose a life event' : 'Property plan'}
        </Text>
      </YStack>
      <YStack width={36} />
    </XStack>
  );
}

function PlansHome({
  savedPlans,
  disabled,
  onNewPlan,
  onEditSavedPlan,
  onViewSavedPlan,
  onDeleteSavedPlan,
}: {
  savedPlans: SavedPlanningOwlPlan[];
  disabled: boolean;
  onNewPlan: () => void;
  onEditSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
  onViewSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
  onDeleteSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
}) {
  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <Text fontSize={30} fontWeight="900" color="black">
          Your plans
        </Text>
        <Text fontSize={15} color="rgba(0,0,0,0.58)" lineHeight={22}>
          Review saved goals, update assumptions, or create a new Planning Owl plan.
        </Text>
      </YStack>

      {savedPlans.length > 0 ? (
        <SavedPlansSection
          savedPlans={savedPlans}
          disabled={disabled}
          onNewPlan={onNewPlan}
          onEditSavedPlan={onEditSavedPlan}
          onViewSavedPlan={onViewSavedPlan}
          onDeleteSavedPlan={onDeleteSavedPlan}
        />
      ) : (
        <YStack padding="$5" gap="$4" borderRadius={16} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)" alignItems="center">
          <YStack width={54} height={54} borderRadius={27} backgroundColor="rgba(218,41,28,0.1)" alignItems="center" justifyContent="center">
            <Feather name="clipboard" size={24} color="#DA291C" />
          </YStack>
          <YStack gap="$2" alignItems="center">
            <Text fontSize={20} fontWeight="900" color="#111820" textAlign="center">
              No plans yet
            </Text>
            <Text fontSize={14} color="rgba(23,32,48,0.58)" textAlign="center" lineHeight={20}>
              Create your first plan to compare strategies and save your assumptions.
            </Text>
          </YStack>
          <Button width="100%" height={46} borderRadius={23} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onNewPlan}>
            Create your first plan
          </Button>
        </YStack>
      )}
    </YStack>
  );
}

function LifeEventPicker({ disabled, onSelectProperty }: { disabled: boolean; onSelectProperty: () => void }) {
  const events = [
    { id: 'property', title: 'Buying a property', icon: 'home', enabled: true },
    { id: 'education', title: 'Education', icon: 'book-open', enabled: false },
    { id: 'married', title: 'Getting married', icon: 'heart', enabled: false },
    { id: 'family', title: 'Starting a family', icon: 'users', enabled: false },
    { id: 'career', title: 'Career break', icon: 'coffee', enabled: false },
  ] as const;

  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <Text fontSize={30} fontWeight="900" color="black">
          What are you planning for?
        </Text>
        <Text fontSize={15} color="rgba(0,0,0,0.58)" lineHeight={22}>
          Pick a life event and Planning Owl will shape a mock scenario around it.
        </Text>
      </YStack>
      <YStack gap="$3">
        {events.map((event) => (
          <Pressable
            key={event.id}
            disabled={!event.enabled || disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled: !event.enabled || disabled }}
            onPress={event.enabled ? onSelectProperty : undefined}
          >
            <GlassCard padding="$4" opacity={event.enabled ? 1 : 0.48}>
              <XStack alignItems="center" gap="$4">
                <YStack width={48} height={48} borderRadius={24} backgroundColor="rgba(218,41,28,0.1)" alignItems="center" justifyContent="center">
                  <Feather name={event.icon} size={22} color="#DA291C" />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={17} fontWeight="800" color="black">
                    {event.title}
                  </Text>
                  {!event.enabled && (
                    <Text fontSize={12} color="rgba(0,0,0,0.5)" marginTop="$1">
                      Coming soon
                    </Text>
                  )}
                </YStack>
                {event.enabled && <Feather name="arrow-right" size={20} color="rgba(0,0,0,0.45)" />}
              </XStack>
            </GlassCard>
          </Pressable>
        ))}
      </YStack>
    </YStack>
  );
}

function SavedPlansSection({
  savedPlans,
  disabled,
  onNewPlan,
  onEditSavedPlan,
  onViewSavedPlan,
  onDeleteSavedPlan,
}: {
  savedPlans: SavedPlanningOwlPlan[];
  disabled: boolean;
  onNewPlan: () => void;
  onEditSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
  onViewSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
  onDeleteSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
}) {
  return (
    <YStack gap="$3">
      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize={18} fontWeight="900" color="#111820">
          Saved plans
        </Text>
        <Button size="$3" borderRadius={18} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onNewPlan}>
          New plan
        </Button>
      </XStack>
      {savedPlans.map((savedPlan) => (
        <SavedPlanCard
          key={savedPlan.id}
          savedPlan={savedPlan}
          disabled={disabled}
          onEdit={() => onEditSavedPlan(savedPlan)}
          onView={() => onViewSavedPlan(savedPlan)}
          onDelete={() => onDeleteSavedPlan(savedPlan)}
        />
      ))}
    </YStack>
  );
}

function SavedPlanCard({
  savedPlan,
  disabled,
  onEdit,
  onView,
  onDelete,
}: {
  savedPlan: SavedPlanningOwlPlan;
  disabled: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const savedScenario = getMockSimulation(savedPlan.answers, savedPlan.selectedScenario);

  return (
    <YStack padding="$4" gap="$4" borderRadius={16} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
      <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
        <YStack flex={1}>
          <Text fontSize={12} color="#C9002B" fontWeight="900" letterSpacing={2}>
            SAVED PLAN
          </Text>
          <Text fontSize={22} fontWeight="900" color="#111820" marginTop="$1">
            {savedPlan.title}
          </Text>
          <Text fontSize={12} color="rgba(23,32,48,0.52)" marginTop="$1">
            Last saved {formatSavedPlanDate(savedPlan.updatedAt)}
          </Text>
        </YStack>
        <XStack backgroundColor="#F2E7EA" paddingHorizontal="$3" paddingVertical="$2" borderRadius={16}>
          <Text fontSize={12} color="#C9002B" fontWeight="900">
            {savedScenario.scenarioLabel}
          </Text>
        </XStack>
      </XStack>

      <YStack gap="$2">
        <SummaryRow label="Property value" value={savedPlan.answers.propertyValue ?? 'Not set'} />
        <SummaryRow label="Downpayment" value={savedPlan.answers.downpayment ?? 'Not set'} />
        <SummaryRow label="Target timeframe" value={savedPlan.answers.timeframe ?? 'Not set'} />
      </YStack>

      <XStack gap="$2">
        <Button flex={1} height={42} borderRadius={21} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onEdit}>
          Edit answers
        </Button>
        <Button flex={1} height={42} borderRadius={21} backgroundColor="rgba(0,0,0,0.06)" color="#111820" fontWeight="800" disabled={disabled} onPress={onView}>
          View results
        </Button>
      </XStack>

      <Button chromeless alignSelf="center" disabled={disabled} color="#8B1E25" onPress={onDelete}>
        Delete plan
      </Button>
    </YStack>
  );
}

function FollowUpQuestion({
  question,
  selectedValue,
  disabled,
  onSelect,
  onNext,
  onBack,
}: {
  question: QuestionConfig;
  selectedValue: string | null;
  disabled: boolean;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [customValue, setCustomValue] = useState(() =>
    selectedValue && !question.options.includes(selectedValue) ? selectedValue : '',
  );

  const applyCustomValue = (value: string) => {
    setCustomValue(value);
    onSelect(value);
  };

  const selectTemplateValue = (value: string) => {
    setCustomValue('');
    onSelect(value);
  };

  return (
    <YStack gap="$5">
      <ProgressDots current={question.questionNumber} />
      <YStack gap="$2">
        <Text fontSize={27} fontWeight="900" color="black">
          {question.title}
        </Text>
        <Text fontSize={15} color="rgba(0,0,0,0.58)" lineHeight={22}>
          {question.subtitle}
        </Text>
      </YStack>

      {question.chip && (
        <XStack alignSelf="flex-start" backgroundColor="rgba(218,41,28,0.08)" paddingHorizontal="$3" paddingVertical="$2" borderRadius={16}>
          <Text fontSize={12} color="#DA291C" fontWeight="700">
            {question.chip}
          </Text>
        </XStack>
      )}

      <YStack gap="$3">
        {question.options.map((option) => (
          <OptionRow key={option} label={option} selected={selectedValue === option} disabled={disabled} onPress={() => selectTemplateValue(option)} />
        ))}
        <GlassCard padding="$4" borderColor={customValue && selectedValue === customValue ? '#DA291C' : 'rgba(255,255,255,0.8)'}>
          <YStack gap="$2">
            <Text fontSize={13} fontWeight="800" color="black">
              None of these match
            </Text>
            <Input
              value={customValue}
              onChangeText={applyCustomValue}
              disabled={disabled}
              placeholder={question.questionNumber === 1 ? 'Enter your property budget' : question.questionNumber === 2 ? 'Enter your downpayment' : 'Enter your target timeline'}
              height={44}
              borderRadius={14}
              borderColor="rgba(0,0,0,0.08)"
              backgroundColor="rgba(255,255,255,0.85)"
            />
          </YStack>
        </GlassCard>
      </YStack>

      <YStack gap="$3" marginTop="$2">
        <Button
          height={52}
          borderRadius={26}
          backgroundColor="#DA291C"
          color="white"
          fontWeight="800"
          disabled={!selectedValue || disabled}
          onPress={onNext}
        >
          Next
        </Button>
        <XStack justifyContent="space-between" alignItems="center">
          <Button chromeless disabled={disabled} onPress={onBack}>
            Back
          </Button>
          <Text fontSize={12} color="rgba(0,0,0,0.45)">
            Choose a preset or enter your own
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}

function OptionRow({ label, selected, disabled, onPress }: { label: string; selected: boolean; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: selected, disabled }}>
      <GlassCard padding="$4" borderColor={selected ? '#DA291C' : 'rgba(255,255,255,0.8)'}>
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={16} fontWeight="700" color="black">
            {label}
          </Text>
          <YStack
            width={24}
            height={24}
            borderRadius={12}
            borderWidth={2}
            borderColor={selected ? '#DA291C' : 'rgba(0,0,0,0.18)'}
            backgroundColor={selected ? '#DA291C' : 'transparent'}
            alignItems="center"
            justifyContent="center"
          >
            {selected && <Feather name="check" size={14} color="white" />}
          </YStack>
        </XStack>
      </GlassCard>
    </Pressable>
  );
}

function SimulationResults({
  simulation,
  scenarios,
  selectedScenario,
  disabled,
  isReadOnly,
  onScenarioChange,
  onCompare,
}: {
  simulation: PlanningOwlSimulation;
  scenarios: PlanningOwlSimulation[];
  selectedScenario: PlanningOwlScenario;
  disabled: boolean;
  isReadOnly: boolean;
  onScenarioChange: (scenario: PlanningOwlScenario) => void;
  onCompare: () => void;
}) {
  const [expandedScenario, setExpandedScenario] = useState<PlanningOwlScenario | null>(null);

  return (
    <YStack gap="$5">
      <YStack gap="$3">
        <XStack justifyContent="space-between" alignItems="center" gap="$3">
          <Text flex={1} fontSize={13} color="rgba(23,32,48,0.7)" letterSpacing={4}>
            LIFE EVENT: BUYING A PROPERTY
          </Text>
        </XStack>
        <XStack alignSelf="flex-start" backgroundColor="#DDF5E4" paddingHorizontal="$2.5" paddingVertical="$1.5" borderRadius={2}>
          <Text fontSize={10} color="#147A2E" fontWeight="900">
            SIMULATED
          </Text>
        </XStack>
        <Text fontSize={32} fontWeight="900" color="#111820">
          {simulation.title}
        </Text>
      </YStack>

      <XStack gap="$3">
        <MetricCard label="Success probability" value={`${simulation.successProbability}%`} accent />
        <MetricCard label="Purchase timing" value={simulation.purchaseTiming} />
      </XStack>
      <Text fontSize={12} color="rgba(23,32,48,0.58)" lineHeight={18}>
        Success is based on cash buffer, downpayment readiness, repayment comfort, and downside risk.
      </Text>

      <YStack gap="$3">
        <Text fontSize={16} fontWeight="900" color="#111820">
          Choose a scenario
        </Text>
        {isReadOnly ? (
          <ScenarioAccordionCard scenario={simulation} active expanded locked disabled={disabled} onPress={() => undefined} />
        ) : (
          scenarios.map((scenario) => (
            <ScenarioAccordionCard
              key={scenario.scenario}
              scenario={scenario}
              active={selectedScenario === scenario.scenario}
              expanded={expandedScenario === scenario.scenario}
              disabled={disabled}
              onPress={() => {
                setExpandedScenario((current) => (current === scenario.scenario ? null : scenario.scenario));
                onScenarioChange(scenario.scenario);
              }}
            />
          ))
        )}
      </YStack>

      <YStack padding="$5" gap="$4" borderRadius={16} borderWidth={1} borderColor="#F1CDD4" backgroundColor="#FFF1F4">
        <XStack alignItems="center" gap="$2">
          <FontAwesome5 name="brain" size={16} color="#C9002B" />
          <Text fontSize={17} fontWeight="900" color="#C9002B">
            Planning Owl Guidance
          </Text>
        </XStack>
        <Text fontSize={16} color="#3A1B24" lineHeight={26}>
          {simulation.guidance}
        </Text>
      </YStack>

      <KeyTerms />

      <Button height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onCompare}>
        Compare strategies
      </Button>
    </YStack>
  );
}

function StrategyComparison({
  simulation,
  disabled,
  isReadOnly,
  onActionPress,
  onCommit,
}: {
  simulation: PlanningOwlSimulation;
  disabled: boolean;
  isReadOnly: boolean;
  onActionPress: (target: string) => void;
  onCommit: () => void;
}) {
  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <Text fontSize={13} color="rgba(23,32,48,0.7)" letterSpacing={4}>
          STRATEGY COMPARISON
        </Text>
        <Text fontSize={32} fontWeight="900" color="#111820">
          Close the gap
        </Text>
      </YStack>

      <YStack gap="$3">
        <Text fontSize={16} fontWeight="900" color="#111820">
          Chosen scenario
        </Text>
        <ChosenScenarioCard scenario={simulation} locked={isReadOnly} />
      </YStack>

      <StrategyTimelineCard simulation={simulation} />

      <LifestyleSuggestions simulation={simulation} />

      <YStack padding="$5" gap="$4" borderRadius={16} borderWidth={1} borderColor="#F1CDD4" backgroundColor="#FFF1F4">
        <XStack alignItems="center" gap="$2">
          <Feather name="zap" size={17} color="#C9002B" />
          <Text fontSize={17} fontWeight="900" color="#C9002B">
            Why this works
          </Text>
        </XStack>
        {simulation.comparison.reasons.map((reason) => (
          <YStack key={reason.title} paddingLeft="$3" borderLeftWidth={3} borderLeftColor="#C9002B">
            <Text fontSize={15} fontWeight="900" color="#111820">
              {reason.title}
            </Text>
            <Text fontSize={13} color="rgba(23,32,48,0.62)" lineHeight={20} marginTop="$1">
              {reason.detail}
            </Text>
          </YStack>
        ))}
      </YStack>

      <YStack padding="$5" gap="$4" borderRadius={16} borderWidth={1} borderColor="#F1CDD4" backgroundColor="#FFF1F4">
        <XStack alignItems="center" gap="$2">
          <Feather name="check-circle" size={17} color="#C9002B" />
          <Text fontSize={17} fontWeight="900" color="#C9002B">
            Recommended action plan
          </Text>
        </XStack>
        <Text fontSize={14} color="#3A1B24" lineHeight={21}>
          {simulation.guidance}
        </Text>
        {simulation.actions.map((action) => (
          <ActionRow key={action.id} label={action.label} detail={action.detail} disabled={disabled} onPress={() => onActionPress(action.target)} />
        ))}
      </YStack>

      {isReadOnly ? (
        <YStack padding="$4" borderRadius={12} backgroundColor="rgba(0,0,0,0.04)">
          <Text fontSize={13} color="rgba(23,32,48,0.62)" textAlign="center" lineHeight={19}>
            This is a saved-plan preview. Use Edit answers from the saved-plan card to make changes and recommit.
          </Text>
        </YStack>
      ) : (
        <Button height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onCommit}>
          Save plan
        </Button>
      )}
    </YStack>
  );
}

function CommitConfirmation({
  simulation,
  answers,
  onDone,
}: {
  simulation: ReturnType<typeof getMockSimulation>;
  answers: PlanningOwlAnswers;
  onDone: () => void;
}) {
  return (
    <YStack gap="$5" alignItems="center">
      <YStack width={84} height={84} borderRadius={42} backgroundColor="rgba(76,175,80,0.14)" alignItems="center" justifyContent="center">
        <Feather name="check" size={42} color="#2E7D32" />
      </YStack>
      <YStack gap="$2" alignItems="center">
        <Text fontSize={30} fontWeight="900" color="black" textAlign="center">
          Plan saved
        </Text>
        <Text fontSize={15} color="rgba(0,0,0,0.58)" textAlign="center" lineHeight={22}>
          Your planning scenario has been saved. Recommended actions have not been applied yet. Open each recommendation separately when you are ready.
        </Text>
      </YStack>
      <GlassCard width="100%" padding="$4" gap="$3">
        <SummaryRow label="Property value" value={answers.propertyValue ?? 'Estimated'} />
        <SummaryRow label="Downpayment" value={answers.downpayment ?? 'Estimated'} />
        <SummaryRow label="Target timeframe" value={answers.timeframe ?? 'Estimated'} />
      </GlassCard>
      <Button width="100%" height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" onPress={onDone}>
        Done
      </Button>
    </YStack>
  );
}

function AskOwlButton({ isOpen, onOpen, onClose }: { isOpen: boolean; onOpen: () => void; onClose: () => void }) {
  return (
    <>
      <Button
        position="absolute"
        right={18}
        bottom={104}
        zIndex={30}
        circular
        size="$5"
        backgroundColor="#DA291C"
        elevation={10}
        shadowColor="#DA291C"
        shadowRadius={10}
        onPress={onOpen}
      >
        <FontAwesome5 name="robot" size={20} color="white" />
      </Button>

      {isOpen && (
        <YStack position="absolute" left={0} right={0} top={0} bottom={0} zIndex={40} justifyContent="flex-end">
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <MotiView from={{ translateY: 260 }} animate={{ translateY: 0 }} transition={{ type: 'timing', duration: 220 }}>
            <YStack backgroundColor="white" padding="$5" paddingBottom="$8" borderTopLeftRadius={24} borderTopRightRadius={24} gap="$4">
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize={18} fontWeight="900" color="black">
                  Ask Owl
                </Text>
                <Button circular size="$3" backgroundColor="rgba(0,0,0,0.05)" onPress={onClose}>
                  <Feather name="x" size={18} color="black" />
                </Button>
              </XStack>
              <Text fontSize={14} color="rgba(0,0,0,0.58)" lineHeight={21}>
                Ask Owl is listening. AI responses are mocked for this frontend pass.
              </Text>
            </YStack>
          </MotiView>
        </YStack>
      )}
    </>
  );
}

function StrategyTimelineCard({ simulation }: { simulation: ReturnType<typeof getMockSimulation> }) {
  const savedRatio = simulation.comparison.monthsSaved === 0 ? 0.08 : Math.max(0.22, Math.min(0.5, simulation.comparison.monthsSaved / 28));
  const savedWidth = `${Math.round(savedRatio * 100)}%`;
  const remainingWidth = `${100 - Math.round(savedRatio * 100)}%`;
  const badgeLabel = simulation.comparison.monthsSaved === 0 ? 'Liquidity preserved' : `${simulation.comparison.monthsSaved} months saved`;

  return (
    <YStack padding="$5" gap="$4" borderRadius={16} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
      <XStack justifyContent="space-between" alignItems="flex-start" gap="$4">
        <YStack flex={1}>
          <Text fontSize={12} color="rgba(23,32,48,0.55)" letterSpacing={2}>
            Optimized
          </Text>
          <Text fontSize={24} fontWeight="900" color="#C9002B">
            {simulation.comparison.optimizedGoalDate}
          </Text>
        </YStack>
        <YStack flex={1} alignItems="flex-end">
          <Text fontSize={12} color="rgba(23,32,48,0.55)" letterSpacing={2}>
            Current plan
          </Text>
          <Text fontSize={24} fontWeight="900" color="#111820">
            {simulation.comparison.currentGoalDate}
          </Text>
        </YStack>
      </XStack>

      <YStack gap="$2">
        <XStack alignSelf="center" backgroundColor="#DDF5E4" paddingHorizontal="$3" paddingVertical="$2" borderRadius={16}>
          <Text fontSize={12} color="#147A2E" fontWeight="900">
            {badgeLabel}
          </Text>
        </XStack>
        <XStack height={14} borderRadius={7} backgroundColor="#F2E7EA" overflow="hidden">
          <YStack width={savedWidth} height="100%" backgroundColor="#C9002B" />
          <YStack width={remainingWidth} height="100%" backgroundColor="#F2E7EA" />
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap="$2">
            <YStack width={10} height={10} borderRadius={5} backgroundColor="#C9002B" />
            <Text fontSize={12} color="rgba(23,32,48,0.62)">
              Earlier target
            </Text>
          </XStack>
          <XStack alignItems="center" gap="$2">
            <Text fontSize={12} color="rgba(23,32,48,0.62)">
              Original target
            </Text>
            <YStack width={10} height={10} borderRadius={5} backgroundColor="#D9C8CE" />
          </XStack>
        </XStack>
      </YStack>

      <Text fontSize={13} color="rgba(23,32,48,0.58)" lineHeight={19}>
        The timeline runs from the accelerated purchase date to the original plan, so the green badge shows the time gained.
      </Text>
    </YStack>
  );
}

function MetricCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <YStack flex={1} padding="$4" minHeight={92} justifyContent="space-between" borderRadius={8} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
      <Text fontSize={11} color="#4A5770" letterSpacing={2} textTransform="uppercase">
        {label}
      </Text>
      <Text fontSize={25} fontWeight="900" color={accent ? '#C9002B' : '#111820'}>
        {value}
      </Text>
    </YStack>
  );
}

function ActionRow({ label, detail, disabled, onPress }: { label: string; detail: string; disabled: boolean; onPress: () => void }) {
  const lowerLabel = label.toLowerCase();
  const isDeposit = lowerLabel.includes('deposit');
  const isLoan = lowerLabel.includes('loan');
  const iconName = isLoan ? 'briefcase' : isDeposit ? 'home' : 'bar-chart-2';
  const iconColor = isLoan ? '#7A4A00' : isDeposit ? '#C9002B' : '#415A9C';
  const iconBackground = isLoan ? '#FFF1D6' : isDeposit ? '#FFE2E8' : '#E4E9FF';
  const actionLabel = isLoan ? 'Explore OCBC Loans' : isDeposit ? 'Open Deposit Owl' : 'Open Investment Owl';

  return (
    <Pressable disabled={disabled} onPress={onPress} accessibilityRole="button">
      <XStack padding="$4" borderRadius={8} backgroundColor="white" alignItems="center" gap="$3">
        <YStack width={38} height={38} borderRadius={12} backgroundColor={iconBackground} alignItems="center" justifyContent="center">
          <Feather name={iconName} size={18} color={iconColor} />
        </YStack>
        <YStack flex={1}>
          <Text fontSize={15} fontWeight="900" color="#111820">
            {label}
          </Text>
          <Text fontSize={11} color="rgba(23,32,48,0.58)" marginTop="$1">
            {detail}
          </Text>
          <Text fontSize={13} color="#C9002B" marginTop="$2" fontWeight="900">
            {actionLabel}
          </Text>
        </YStack>
        <Feather name="arrow-right" size={20} color="#8B5962" />
      </XStack>
    </Pressable>
  );
}

function ScenarioAccordionCard({
  scenario,
  active,
  expanded,
  locked = false,
  disabled,
  onPress,
}: {
  scenario: PlanningOwlSimulation;
  active: boolean;
  expanded: boolean;
  locked?: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable disabled={disabled || locked} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active, disabled: disabled || locked }}>
      <YStack padding="$4" gap="$3" borderRadius={10} backgroundColor={active ? '#FFF1F4' : 'white'} borderWidth={1} borderColor={active ? '#C9002B' : 'rgba(20,30,45,0.06)'}>
        <XStack justifyContent="space-between" alignItems="center" gap="$3">
          <YStack flex={1}>
            <XStack alignItems="center" gap="$2">
              <Text fontSize={12} color="#C9002B" fontWeight="900">
                {scenario.scenarioLabel}
              </Text>
              {locked && <Feather name="lock" size={12} color="#C9002B" />}
            </XStack>
            <Text fontSize={16} color="#111820" fontWeight="900" marginTop="$1">
              {scenario.scenarioTitle}
            </Text>
          </YStack>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={active ? '#C9002B' : '#40506D'} />
        </XStack>

        <XStack gap="$2" flexWrap="wrap">
          <ScenarioPill label={scenario.purchaseTiming} />
          <ScenarioPill label={`${scenario.successProbability}% success`} />
          <ScenarioPill label={scenario.liquidityNote} alert={scenario.scenario === 'earlier'} />
        </XStack>

        {expanded && (
          <YStack gap="$3" paddingTop="$1">
            <Text fontSize={13} color="rgba(23,32,48,0.62)" lineHeight={19}>
              {scenario.riskMessage}
            </Text>
            <YStack gap="$2">
              <TradeOffDetailRow label="Best for" value={scenario.bestFor} accent={active} />
              <TradeOffDetailRow label="Cash needed" value={scenario.liquidityRequired} />
              <TradeOffDetailRow label="Remaining buffer" value={scenario.liquidityAfterPurchase} />
              <TradeOffDetailRow label="Risk" value={scenario.riskLevel} accent={active} />
              <TradeOffDetailRow label="Possible downside" value={scenario.downsideRisk} danger />
              <TradeOffDetailRow label="Basket" value={scenario.investmentBasket} secondary />
            </YStack>
          </YStack>
        )}
      </YStack>
    </Pressable>
  );
}

function ScenarioPill({ label, alert = false }: { label: string; alert?: boolean }) {
  return (
    <XStack backgroundColor={alert ? 'rgba(201,0,43,0.08)' : 'rgba(0,0,0,0.05)'} paddingHorizontal="$2.5" paddingVertical="$1.5" borderRadius={14}>
      <Text fontSize={11} color={alert ? '#C9002B' : '#33415C'} fontWeight="800">
        {label}
      </Text>
    </XStack>
  );
}

function TradeOffDetailRow({
  label,
  value,
  accent = false,
  danger = false,
  secondary = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
  secondary?: boolean;
}) {
  const valueColor = secondary ? 'rgba(23,32,48,0.56)' : danger ? '#C9002B' : accent ? '#C9002B' : '#111820';
  const valueWeight = secondary ? '600' : danger || accent ? '900' : '700';

  return (
    <XStack alignItems="flex-start" gap="$3">
      <Text width={112} fontSize={11} color="rgba(23,32,48,0.52)" fontWeight="800" textTransform="uppercase">
        {label}
      </Text>
      <Text flex={1} fontSize={secondary ? 11 : 12} color={valueColor} fontWeight={valueWeight} lineHeight={secondary ? 16 : 17}>
        {value}
      </Text>
    </XStack>
  );
}

function ChosenScenarioCard({ scenario, locked }: { scenario: PlanningOwlSimulation; locked: boolean }) {
  return (
    <YStack padding="$4" gap="$3" borderRadius={10} backgroundColor="#FFF1F4" borderWidth={1} borderColor="#C9002B">
      <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
        <YStack flex={1}>
          <XStack alignItems="center" gap="$2">
            <Text fontSize={12} color="#C9002B" fontWeight="900">
              {scenario.scenarioLabel}
            </Text>
            {locked && <Feather name="lock" size={12} color="#C9002B" />}
          </XStack>
          <Text fontSize={17} color="#111820" fontWeight="900" marginTop="$1">
            {scenario.scenarioTitle}
          </Text>
        </YStack>
        <Feather name="check-circle" size={18} color="#C9002B" />
      </XStack>
      <Text fontSize={13} color="rgba(23,32,48,0.62)" lineHeight={19}>
        {scenario.scenarioSummary}
      </Text>
      <XStack gap="$2" flexWrap="wrap">
        <ScenarioPill label={scenario.purchaseTiming} />
        <ScenarioPill label={`${scenario.successProbability}% success`} />
        <ScenarioPill label={scenario.liquidityNote} />
      </XStack>
    </YStack>
  );
}

function KeyTerms() {
  return (
    <YStack padding="$5" gap="$4" borderRadius={16} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
      <XStack alignItems="center" gap="$2">
        <Feather name="help-circle" size={17} color="#C9002B" />
        <Text fontSize={17} fontWeight="900" color="#111820">
          Key terms
        </Text>
      </XStack>
      <YStack gap="$3">
        <TermRow
          label="Success probability"
          value="How likely the mocked plan can meet the target, based on cash buffer, downpayment readiness, repayment comfort, and downside risk."
        />
        <TermRow
          label="Remaining buffer"
          value="Cash left after estimated upfront property costs, such as downpayment, fees, and reserves."
        />
        <TermRow
          label="Possible downside"
          value="How much the investment portion could fall in a weaker market."
        />
      </YStack>
    </YStack>
  );
}

function TermRow({ label, value }: { label: string; value: string }) {
  return (
    <YStack gap="$1">
      <Text fontSize={13} fontWeight="900" color="#111820">
        {label}
      </Text>
      <Text fontSize={12} color="rgba(23,32,48,0.6)" lineHeight={18}>
        {value}
      </Text>
    </YStack>
  );
}

function LifestyleSuggestions({ simulation }: { simulation: PlanningOwlSimulation }) {
  return (
    <YStack padding="$5" gap="$4" borderRadius={16} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
      <XStack alignItems="center" gap="$2">
        <Feather name="sliders" size={17} color="#C9002B" />
        <Text fontSize={17} fontWeight="900" color="#111820">
          Lifestyle adjustment
        </Text>
      </XStack>
      <Text fontSize={14} color="rgba(23,32,48,0.64)" lineHeight={21}>
        {simulation.comparison.lifestyleAdjustment}
      </Text>
      <YStack gap="$2">
        {simulation.comparison.lifestyleSuggestions.map((suggestion) => (
          <XStack key={suggestion} alignItems="flex-start" gap="$3">
            <YStack width={7} height={7} borderRadius={4} backgroundColor="#C9002B" marginTop="$2" />
            <Text flex={1} fontSize={13} color="#111820" lineHeight={20}>
              {suggestion}
            </Text>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}

function ProgressDots({ current }: { current: 1 | 2 | 3 }) {
  return (
    <XStack gap="$2">
      {[1, 2, 3].map((dot) => (
        <YStack key={dot} flex={1} height={5} borderRadius={3} backgroundColor={dot <= current ? '#DA291C' : 'rgba(0,0,0,0.1)'} />
      ))}
    </XStack>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <XStack justifyContent="space-between" gap="$3">
      <Text fontSize={13} color="rgba(0,0,0,0.54)">
        {label}
      </Text>
      <Text fontSize={13} color="black" fontWeight="800">
        {value}
      </Text>
    </XStack>
  );
}

function formatSavedPlanDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 170,
  },
});
