import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { Button, Input, Text, XStack, YStack } from 'tamagui';
import { GlassCard } from '../../components/GlassCard';
import {
  getPlanningOwlScenariosForEvent,
  getPlanningOwlSimulationForEvent,
  PlanningOwlAnswers,
  PlanningOwlEvent,
  PlanningOwlProfileSignals,
  PlanningOwlScenario,
  PlanningOwlSimulation,
} from '../../constants/planningOwlMocks';
import {
  deleteSavedPlanningOwlPlan,
  getSavedPlanningOwlPlans,
  savePlanningOwlPlan,
  SavedPlanningOwlPlan,
} from '../../constants/planningOwlSavedPlanStore';
import {
  getCompletedPlanningOwlActions,
  getPlanningOwlActionStatus,
  getPlanningOwlCompletionKey,
  getPlanningOwlProductRoute,
  getPlanningOwlReturnContext,
  mergePlanningOwlCompletedActions,
  markPlanningOwlActionComplete,
  savePlanningOwlReturnContext,
} from '../../constants/planningOwlProductActions';
import { useWealth } from '../../components/wealth/WealthContext';

type PlanningStep =
  | 'plansHome'
  | 'eventPicker'
  | 'question1'
  | 'question2'
  | 'question3'
  | 'customQuestion1'
  | 'customQuestion2'
  | 'customQuestion3'
  | 'customQuestion4'
  | 'results'
  | 'comparison'
  | 'committed';

type PlanningOwlState = {
  step: PlanningStep;
  selectedEvent: PlanningOwlEvent | null;
  answers: PlanningOwlAnswers;
  selectedScenario: PlanningOwlScenario;
  planName: string;
  savedPlans: SavedPlanningOwlPlan[];
  activePlanId: string | null;
  isViewingSavedPlan: boolean;
};

type QuestionConfig = {
  step: Extract<PlanningStep, 'question1' | 'question2' | 'question3' | 'customQuestion1' | 'customQuestion2' | 'customQuestion3' | 'customQuestion4'>;
  questionNumber: number;
  totalQuestions: number;
  answerKey: keyof PlanningOwlAnswers;
  title: string;
  subtitle: string;
  options: string[];
  chip?: string;
  customPlaceholder: string;
  prefilled?: boolean;
};

const initialState: PlanningOwlState = {
  step: 'plansHome',
  selectedEvent: null,
  answers: {
    propertyValue: null,
    downpayment: null,
    timeframe: null,
    customGoalName: null,
    customTargetAmount: null,
    customMonthlySavings: null,
    customTimeframe: null,
    educationFor: null,
    educationCost: null,
    educationTimeframe: null,
    weddingBudget: null,
    weddingTimeframe: null,
    weddingMonthlySavings: null,
    familyMonthlyCost: null,
    familyBufferMonths: null,
    familyTimeframe: null,
    careerBreakMonthlyExpenses: null,
    careerBreakDuration: null,
    careerBreakTimeframe: null,
  },
  selectedScenario: 'match_timing',
  planName: '',
  savedPlans: [],
  activePlanId: null,
  isViewingSavedPlan: false,
};

const propertyQuestionConfigs: QuestionConfig[] = [
  {
    step: 'question1',
    questionNumber: 1,
    totalQuestions: 3,
    answerKey: 'propertyValue',
    title: 'What property value are you planning for?',
    subtitle: 'Choose the closest range for now. You can refine it later.',
    options: ['S$600k - 800k', 'S$800k - 1.2m', 'S$1.2m - 1.6m'],
    customPlaceholder: 'Enter your property budget',
  },
  {
    step: 'question2',
    questionNumber: 2,
    totalQuestions: 3,
    answerKey: 'downpayment',
    title: 'How much downpayment do you want ready?',
    subtitle: 'Planning Owl will use this to estimate how much cash may be left after upfront costs.',
    options: ['20%', '25%', '30%'],
    chip: 'Current eligible cash: S$150,890',
    customPlaceholder: 'Enter your downpayment',
  },
  {
    step: 'question3',
    questionNumber: 3,
    totalQuestions: 3,
    answerKey: 'timeframe',
    title: 'When would you like to buy?',
    subtitle: 'A realistic target helps the plan keep enough money available for near-term needs.',
    options: ['<1 year', '1-2 years', '3-4 years', '5-6 years'],
    customPlaceholder: 'Enter your target timeline',
  },
];

const customQuestionConfigs: QuestionConfig[] = [
  {
    step: 'customQuestion1',
    questionNumber: 1,
    totalQuestions: 4,
    answerKey: 'customGoalName',
    title: 'What are you saving for?',
    subtitle: 'Name the goal so Planning Owl can keep the plan open-ended.',
    options: ['Rainy day fund', 'Travel', 'Renovation', 'Something else'],
    customPlaceholder: 'Enter your goal name',
  },
  {
    step: 'customQuestion2',
    questionNumber: 2,
    totalQuestions: 4,
    answerKey: 'customTargetAmount',
    title: 'How much do you want to save?',
    subtitle: 'Use a target amount that feels useful for this goal.',
    options: ['S$5,000', 'S$10,000', 'S$20,000', 'S$50,000'],
    customPlaceholder: 'Enter your target amount',
  },
  {
    step: 'customQuestion3',
    questionNumber: 3,
    totalQuestions: 4,
    answerKey: 'customMonthlySavings',
    title: 'How much can you set aside each month?',
    subtitle: 'This becomes the monthly habit in the mock projection.',
    options: ['S$200', 'S$500', 'S$1,000', 'S$1,500'],
    customPlaceholder: 'Enter monthly savings',
  },
  {
    step: 'customQuestion4',
    questionNumber: 4,
    totalQuestions: 4,
    answerKey: 'customTimeframe',
    title: 'When do you want to reach it?',
    subtitle: 'The timeline controls how much monthly pressure the plan creates.',
    options: ['<1 year', '1-2 years', '3-4 years', '5+ years'],
    customPlaceholder: 'Enter your target timeline',
  },
];

const lifeEventQuestionConfigs: Record<Exclude<PlanningOwlEvent, 'property' | 'custom'>, QuestionConfig[]> = {
  education: [
    {
      step: 'question1',
      questionNumber: 1,
      totalQuestions: 3,
      answerKey: 'educationFor',
      title: 'Who is this for?',
      subtitle: 'This helps Planning Owl frame the education target without assuming personal details.',
      options: ['Myself', 'Child', 'Sibling/family', 'Someone else'],
      customPlaceholder: 'Enter who this is for',
    },
    {
      step: 'question2',
      questionNumber: 2,
      totalQuestions: 3,
      answerKey: 'educationCost',
      title: 'What education cost are you planning for?',
      subtitle: 'Choose a rough fee target for this mock plan.',
      options: ['S$30,000', 'S$60,000', 'S$100,000'],
      customPlaceholder: 'Enter education cost',
    },
    {
      step: 'question3',
      questionNumber: 3,
      totalQuestions: 3,
      answerKey: 'educationTimeframe',
      title: 'When should the funds be ready?',
      subtitle: 'The date controls how much can stay liquid versus invested.',
      options: ['<1 year', '1-2 years', '3-4 years', '5+ years'],
      customPlaceholder: 'Enter readiness date',
    },
  ],
  wedding: [
    {
      step: 'question1',
      questionNumber: 1,
      totalQuestions: 3,
      answerKey: 'weddingBudget',
      title: 'What wedding budget are you planning for?',
      subtitle: 'Use a total budget so Planning Owl can model vendor payments and money kept for emergencies.',
      options: ['S$30,000', 'S$60,000', 'S$100,000'],
      customPlaceholder: 'Enter wedding budget',
    },
    {
      step: 'question2',
      questionNumber: 2,
      totalQuestions: 3,
      answerKey: 'weddingTimeframe',
      title: 'When is the wedding?',
      subtitle: 'Vendor deposits and final payments usually need cash before the date.',
      options: ['<1 year', '1-2 years', '3-4 years'],
      customPlaceholder: 'Enter wedding timeline',
    },
    {
      step: 'question3',
      questionNumber: 3,
      totalQuestions: 3,
      answerKey: 'weddingMonthlySavings',
      title: 'How much can you set aside monthly?',
      subtitle: 'This becomes the monthly savings habit for the mock projection.',
      options: ['S$500', 'S$1,000', 'S$1,500'],
      customPlaceholder: 'Enter monthly savings',
    },
  ],
  family: [
    {
      step: 'question1',
      questionNumber: 1,
      totalQuestions: 3,
      answerKey: 'familyMonthlyCost',
      title: 'What monthly family cost should we plan around?',
      subtitle: 'Pick the recurring amount Planning Owl should keep emergency money ready for.',
      options: ['S$1,000', 'S$2,000', 'S$3,000'],
      customPlaceholder: 'Enter monthly family cost',
    },
    {
      step: 'question2',
      questionNumber: 2,
      totalQuestions: 3,
      answerKey: 'familyBufferMonths',
      title: 'How many months of emergency money do you want?',
      subtitle: 'A larger emergency amount gives more breathing room before other actions.',
      options: ['6 months', '9 months', '12 months'],
      customPlaceholder: 'Enter emergency months',
    },
    {
      step: 'question3',
      questionNumber: 3,
      totalQuestions: 3,
      answerKey: 'familyTimeframe',
      title: 'When do you want this emergency money ready?',
      subtitle: 'Planning Owl will compare monthly pressure with money kept available.',
      options: ['<1 year', '1-2 years', '3-4 years'],
      customPlaceholder: 'Enter emergency timeline',
    },
  ],
  career_break: [
    {
      step: 'question1',
      questionNumber: 1,
      totalQuestions: 3,
      answerKey: 'careerBreakMonthlyExpenses',
      title: 'What monthly expenses should the break cover?',
      subtitle: 'This sets how much money you may need each month while income may pause.',
      options: ['S$2,000', 'S$4,000', 'S$6,000'],
      customPlaceholder: 'Enter monthly expenses',
    },
    {
      step: 'question2',
      questionNumber: 2,
      totalQuestions: 3,
      answerKey: 'careerBreakDuration',
      title: 'How long is the break?',
      subtitle: 'Planning Owl will model how much money the break needs.',
      options: ['3 months', '6 months', '12 months'],
      customPlaceholder: 'Enter break duration',
    },
    {
      step: 'question3',
      questionNumber: 3,
      totalQuestions: 3,
      answerKey: 'careerBreakTimeframe',
      title: 'When would the break start?',
      subtitle: 'More time before the break can reduce monthly pressure.',
      options: ['<1 year', '1-2 years', '3-4 years'],
      customPlaceholder: 'Enter start timeline',
    },
  ],
};

const eventLabels: Record<PlanningOwlEvent, string> = {
  property: 'Property plan',
  custom: 'Savings plan',
  education: 'Education plan',
  wedding: 'Wedding plan',
  family: 'Family emergency fund',
  career_break: 'Career break',
};

function getQuestionConfigsForEvent(event: PlanningOwlEvent | null) {
  if (event === 'custom') return customQuestionConfigs;
  if (event && event !== 'property') return lifeEventQuestionConfigs[event];
  return propertyQuestionConfigs;
}

function getEventLabel(event: PlanningOwlEvent | null) {
  return event ? eventLabels[event] : 'Choose a goal';
}

const stepOrder: PlanningStep[] = ['plansHome', 'eventPicker', 'question1', 'question2', 'question3', 'results', 'comparison', 'committed'];

function buildInitialPlanningState({
  startStep,
  startEvent,
  prefillTimeline,
  prefillDownpayment,
  prefillCustomGoalName,
  prefillCustomTargetAmount,
  prefillCustomMonthlySavings,
  prefillCustomTimeline,
  prefillEducationCost,
  prefillEducationTimeframe,
  prefillWeddingBudget,
  prefillWeddingMonthlySavings,
  prefillWeddingTimeframe,
  prefillFamilyTimeframe,
  prefillCareerBreakTimeframe,
}: {
  startStep?: string | string[];
  startEvent?: string | string[];
  prefillTimeline?: string | string[];
  prefillDownpayment?: string | string[];
  prefillCustomGoalName?: string | string[];
  prefillCustomTargetAmount?: string | string[];
  prefillCustomMonthlySavings?: string | string[];
  prefillCustomTimeline?: string | string[];
  prefillEducationCost?: string | string[];
  prefillEducationTimeframe?: string | string[];
  prefillWeddingBudget?: string | string[];
  prefillWeddingMonthlySavings?: string | string[];
  prefillWeddingTimeframe?: string | string[];
  prefillFamilyTimeframe?: string | string[];
  prefillCareerBreakTimeframe?: string | string[];
}): PlanningOwlState {
  const resolvedStartStep = getRouteParamString(startStep);
  const resolvedStartEvent = getPlanningOwlEventParam(startEvent);
  const resolvedPrefillTimeline = getRouteParamString(prefillTimeline);
  const resolvedPrefillDownpayment = getRouteParamString(prefillDownpayment);
  const resolvedCustomGoalName = getRouteParamString(prefillCustomGoalName);
  const resolvedCustomTargetAmount = getRouteParamString(prefillCustomTargetAmount);
  const resolvedCustomMonthlySavings = getRouteParamString(prefillCustomMonthlySavings);
  const resolvedCustomTimeline = getRouteParamString(prefillCustomTimeline);
  const resolvedEducationCost = getRouteParamString(prefillEducationCost);
  const resolvedEducationTimeframe = getRouteParamString(prefillEducationTimeframe);
  const resolvedWeddingBudget = getRouteParamString(prefillWeddingBudget);
  const resolvedWeddingMonthlySavings = getRouteParamString(prefillWeddingMonthlySavings);
  const resolvedWeddingTimeframe = getRouteParamString(prefillWeddingTimeframe);
  const resolvedFamilyTimeframe = getRouteParamString(prefillFamilyTimeframe);
  const resolvedCareerBreakTimeframe = getRouteParamString(prefillCareerBreakTimeframe);

  if (resolvedStartStep === 'customQuestion1') {
    return {
      ...initialState,
      step: 'customQuestion1',
      selectedEvent: 'custom',
      planName: resolvedCustomGoalName ?? '',
      answers: {
        ...initialState.answers,
        customGoalName: resolvedCustomGoalName,
        customTargetAmount: resolvedCustomTargetAmount ? formatSandboxCurrency(Number(resolvedCustomTargetAmount)) : null,
        customMonthlySavings: resolvedCustomMonthlySavings ? formatSandboxCurrency(Number(resolvedCustomMonthlySavings)) : null,
        customTimeframe: resolvedCustomTimeline ? formatSandboxTimeline(Number(resolvedCustomTimeline)) : null,
      },
    };
  }

  if (resolvedStartStep !== 'question1') {
    return initialState;
  }

  if (resolvedStartEvent && resolvedStartEvent !== 'property' && resolvedStartEvent !== 'custom') {
    return {
      ...initialState,
      step: 'question1',
      selectedEvent: resolvedStartEvent,
      answers: {
        ...initialState.answers,
        educationCost: resolvedStartEvent === 'education' && resolvedEducationCost ? formatSandboxCurrency(Number(resolvedEducationCost)) : null,
        educationTimeframe: resolvedStartEvent === 'education' ? resolvedEducationTimeframe : null,
        weddingBudget: resolvedStartEvent === 'wedding' && resolvedWeddingBudget ? formatSandboxCurrency(Number(resolvedWeddingBudget)) : null,
        weddingMonthlySavings: resolvedStartEvent === 'wedding' && resolvedWeddingMonthlySavings ? formatSandboxCurrency(Number(resolvedWeddingMonthlySavings)) : null,
        weddingTimeframe: resolvedStartEvent === 'wedding' ? resolvedWeddingTimeframe : null,
        familyTimeframe: resolvedStartEvent === 'family' ? resolvedFamilyTimeframe : null,
        careerBreakTimeframe: resolvedStartEvent === 'career_break' ? resolvedCareerBreakTimeframe : null,
      },
    };
  }

  return {
    ...initialState,
    step: 'question1',
    selectedEvent: 'property',
    answers: {
      ...initialState.answers,
      downpayment: resolvedPrefillDownpayment ? formatSandboxCurrency(Number(resolvedPrefillDownpayment)) : null,
      timeframe: resolvedPrefillTimeline ? formatSandboxTimeline(Number(resolvedPrefillTimeline)) : null,
    },
  };
}

function getRouteParamString(value?: string | string[]) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (typeof rawValue !== 'string') {
    return null;
  }

  const trimmed = rawValue.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getPlanningOwlEventParam(value?: string | string[]): PlanningOwlEvent | null {
  const event = getRouteParamString(value);
  if (
    event === 'property' ||
    event === 'custom' ||
    event === 'education' ||
    event === 'wedding' ||
    event === 'family' ||
    event === 'career_break'
  ) {
    return event;
  }

  return null;
}

function formatSandboxCurrency(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSandboxTimeline(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return `${value} ${value === 1 ? 'year' : 'years'}`;
}

export default function PlanningOwlPage() {
  const router = useRouter();
  const { state: wealthState } = useWealth();
  const {
    startStep,
    entrySource,
    startEvent,
    prefillTimeline,
    prefillDownpayment,
    prefillCustomGoalName,
    prefillCustomTargetAmount,
    prefillCustomMonthlySavings,
    prefillCustomTimeline,
    prefillEducationCost,
    prefillEducationTimeframe,
    prefillWeddingBudget,
    prefillWeddingMonthlySavings,
    prefillWeddingTimeframe,
    prefillFamilyTimeframe,
    prefillCareerBreakTimeframe,
    completedAction,
    completionKey,
  } = useLocalSearchParams<{
    startStep?: string;
    entrySource?: string;
    startEvent?: string;
    prefillTimeline?: string;
    prefillDownpayment?: string;
    prefillCustomGoalName?: string;
    prefillCustomTargetAmount?: string;
    prefillCustomMonthlySavings?: string;
    prefillCustomTimeline?: string;
    prefillEducationCost?: string;
    prefillEducationTimeframe?: string;
    prefillWeddingBudget?: string;
    prefillWeddingMonthlySavings?: string;
    prefillWeddingTimeframe?: string;
    prefillFamilyTimeframe?: string;
    prefillCareerBreakTimeframe?: string;
    completedAction?: string;
    completionKey?: string;
  }>();
  const [state, setState] = useState<PlanningOwlState>(() =>
    buildInitialPlanningState({
      startStep,
      startEvent,
      prefillTimeline,
      prefillDownpayment,
      prefillCustomGoalName,
      prefillCustomTargetAmount,
      prefillCustomMonthlySavings,
      prefillCustomTimeline,
      prefillEducationCost,
      prefillEducationTimeframe,
      prefillWeddingBudget,
      prefillWeddingMonthlySavings,
      prefillWeddingTimeframe,
      prefillFamilyTimeframe,
      prefillCareerBreakTimeframe,
    }),
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, setCompletionVersion] = useState(0);
  const prefilledKeys = useMemo(
    () => ({
      downpayment: typeof prefillDownpayment === 'string' && prefillDownpayment.length > 0,
      timeframe: typeof prefillTimeline === 'string' && prefillTimeline.length > 0,
      customGoalName: typeof prefillCustomGoalName === 'string' && prefillCustomGoalName.length > 0,
      customTargetAmount: typeof prefillCustomTargetAmount === 'string' && prefillCustomTargetAmount.length > 0,
      customMonthlySavings: typeof prefillCustomMonthlySavings === 'string' && prefillCustomMonthlySavings.length > 0,
      customTimeframe: typeof prefillCustomTimeline === 'string' && prefillCustomTimeline.length > 0,
      educationCost: typeof prefillEducationCost === 'string' && prefillEducationCost.length > 0,
      educationTimeframe: typeof prefillEducationTimeframe === 'string' && prefillEducationTimeframe.length > 0,
      weddingBudget: typeof prefillWeddingBudget === 'string' && prefillWeddingBudget.length > 0,
      weddingMonthlySavings: typeof prefillWeddingMonthlySavings === 'string' && prefillWeddingMonthlySavings.length > 0,
      weddingTimeframe: typeof prefillWeddingTimeframe === 'string' && prefillWeddingTimeframe.length > 0,
      familyTimeframe: typeof prefillFamilyTimeframe === 'string' && prefillFamilyTimeframe.length > 0,
      careerBreakTimeframe: typeof prefillCareerBreakTimeframe === 'string' && prefillCareerBreakTimeframe.length > 0,
    }),
    [
      prefillCareerBreakTimeframe,
      prefillCustomGoalName,
      prefillCustomMonthlySavings,
      prefillCustomTargetAmount,
      prefillCustomTimeline,
      prefillDownpayment,
      prefillEducationCost,
      prefillEducationTimeframe,
      prefillFamilyTimeframe,
      prefillTimeline,
      prefillWeddingBudget,
      prefillWeddingMonthlySavings,
      prefillWeddingTimeframe,
    ],
  );

  const selectedEvent = state.selectedEvent ?? 'property';
  const entrySourceValue = getRouteParamString(entrySource);
  const profileSignals = useMemo<PlanningOwlProfileSignals>(
    () => ({
      riskProfile: wealthState.userProfile.riskProfile,
      knowledgeLevel: wealthState.userProfile.knowledgeLevel,
      investAmount: wealthState.userProfile.investAmount,
      loans: wealthState.userProfile.loans,
      incomeRange: wealthState.userProfile.incomeRange,
      marketPreference: wealthState.userProfile.marketPreference,
    }),
    [
      wealthState.userProfile.incomeRange,
      wealthState.userProfile.investAmount,
      wealthState.userProfile.knowledgeLevel,
      wealthState.userProfile.loans,
      wealthState.userProfile.marketPreference,
      wealthState.userProfile.riskProfile,
    ],
  );
  const scenarios = useMemo(
    () => getPlanningOwlScenariosForEvent(selectedEvent, state.answers, profileSignals),
    [profileSignals, state.answers, selectedEvent],
  );
  const simulation = useMemo(
    () => getPlanningOwlSimulationForEvent(selectedEvent, state.answers, state.selectedScenario, profileSignals),
    [profileSignals, state.answers, selectedEvent, state.selectedScenario],
  );
  const actionCompletionKey = useMemo(
    () =>
      getPlanningOwlCompletionKey({
        planId: state.activePlanId,
        event: selectedEvent,
        selectedScenario: state.selectedScenario,
        answers: state.answers,
      }),
    [selectedEvent, state.activePlanId, state.answers, state.selectedScenario],
  );
  const completedActions = getCompletedPlanningOwlActions(actionCompletionKey);
  const isCurrentPlanSaved = useMemo(
    () =>
      state.savedPlans.some(
        (savedPlan) =>
          savedPlan.id === state.activePlanId &&
          savedPlan.event === state.selectedEvent &&
          savedPlan.selectedScenario === state.selectedScenario &&
          answersMatch(savedPlan.answers, state.answers),
      ),
    [state.activePlanId, state.answers, state.savedPlans, state.selectedEvent, state.selectedScenario],
  );
  const savedScenarioForCurrentAnswers = useMemo(() => {
    const savedPlan = state.savedPlans.find(
      (plan) =>
        plan.id === state.activePlanId &&
        plan.event === state.selectedEvent &&
        answersMatch(plan.answers, state.answers),
    );

    return savedPlan?.selectedScenario ?? null;
  }, [state.activePlanId, state.answers, state.savedPlans, state.selectedEvent]);
  const currentQuestion = getQuestionConfigsForEvent(state.selectedEvent).find((question) => question.step === state.step);
  const renderedQuestion = currentQuestion
    ? {
        ...currentQuestion,
        prefilled: Boolean(prefilledKeys[currentQuestion.answerKey as keyof typeof prefilledKeys]),
      }
    : undefined;

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

  useEffect(() => {
    if (!scenarios.some((scenario) => scenario.scenario === state.selectedScenario)) {
      setState((current) => ({ ...current, selectedScenario: scenarios[0]?.scenario ?? 'match_timing' }));
    }
  }, [scenarios, state.selectedScenario]);

  useEffect(() => {
    const completedActionId = getRouteParamString(completedAction);
    const completedKey = getRouteParamString(completionKey);

    if (!completedActionId || !completedKey) {
      return;
    }

    markPlanningOwlActionComplete(completedKey, completedActionId);
    setCompletionVersion((current) => current + 1);

    const returnContext = getPlanningOwlReturnContext(completedKey);
    if (!returnContext) {
      return;
    }

    setState((current) => ({
      ...current,
      step: 'results',
      selectedEvent: returnContext.event,
      answers: returnContext.answers,
      selectedScenario: returnContext.selectedScenario,
      planName: returnContext.planName,
      activePlanId: returnContext.planId,
      isViewingSavedPlan: returnContext.isViewingSavedPlan,
    }));
  }, [completedAction, completionKey]);

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

    if (entrySourceValue === 'sandbox' && (state.step === 'customQuestion1' || state.step === 'question1')) {
      transitionTo('eventPicker', {
        selectedEvent: null,
        selectedScenario: 'match_timing',
        answers: initialState.answers,
        planName: '',
        activePlanId: null,
        isViewingSavedPlan: false,
      });
      return;
    }

    if ((state.isViewingSavedPlan || isCurrentPlanSaved) && state.step === 'results') {
      transitionTo('plansHome', {
        selectedEvent: null,
        selectedScenario: 'match_timing',
        answers: initialState.answers,
        planName: '',
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
        planName: '',
        activePlanId: null,
        isViewingSavedPlan: false,
      });
      return;
    }

    const customBackSteps: Partial<Record<PlanningStep, PlanningStep>> = {
      customQuestion1: 'eventPicker',
      customQuestion2: 'customQuestion1',
      customQuestion3: 'customQuestion2',
      customQuestion4: 'customQuestion3',
    };
    const customBackStep = customBackSteps[state.step];
    if (customBackStep) {
      transitionTo(customBackStep);
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

    if (question.step === 'customQuestion4') {
      transitionTo('results');
      return;
    }

    const customNextSteps: Partial<Record<PlanningStep, PlanningStep>> = {
      customQuestion1: 'customQuestion2',
      customQuestion2: 'customQuestion3',
      customQuestion3: 'customQuestion4',
    };
    const customNextStep = customNextSteps[question.step];
    if (customNextStep) {
      transitionTo(customNextStep);
      return;
    }

    transitionTo(question.step === 'question1' ? 'question2' : 'question3');
  };

  const openProductAction = (target: string, actionId: string, insight?: string) => {
    const productRoute = getPlanningOwlProductRoute(target);

    if (!productRoute) {
      Alert.alert('Coming soon', `This will open ${target.replace('_', ' ')}.`);
      return;
    }

    const event = state.selectedEvent ?? 'property';
    const completionKeyForAction = getPlanningOwlCompletionKey({
      planId: state.activePlanId,
      event,
      selectedScenario: state.selectedScenario,
      answers: state.answers,
    });

    savePlanningOwlReturnContext({
      completionKey: completionKeyForAction,
      planId: state.activePlanId,
      event,
      answers: state.answers,
      selectedScenario: state.selectedScenario,
      planName: state.planName || simulation.title,
      isViewingSavedPlan: state.isViewingSavedPlan,
    });

    router.push({
      pathname: productRoute,
      params: {
        source: 'planning_owl',
        completionKey: completionKeyForAction,
        planId: state.activePlanId ?? '',
        actionId,
        productTarget: target,
        planTitle: state.planName || simulation.title,
        scenarioTitle: simulation.scenarioTitle,
        timeline: simulation.purchaseTiming,
        recommendedAmount: simulation.liquidityRequired,
        event,
        insight: insight ?? '',
      },
    } as Href);
  };

  const editSavedPlan = (savedPlan: SavedPlanningOwlPlan) => {
    transitionTo(savedPlan.event === 'custom' ? 'customQuestion1' : 'question1', {
      selectedEvent: savedPlan.event,
      answers: savedPlan.answers,
      selectedScenario: savedPlan.selectedScenario,
      planName: savedPlan.title,
      activePlanId: savedPlan.id,
      isViewingSavedPlan: false,
    });
  };

  const viewSavedPlan = (savedPlan: SavedPlanningOwlPlan) => {
    transitionTo('results', {
      selectedEvent: savedPlan.event,
      answers: savedPlan.answers,
      selectedScenario: savedPlan.selectedScenario,
      planName: savedPlan.title,
      activePlanId: savedPlan.id,
      isViewingSavedPlan: true,
    });
  };

  const openNewPlanPicker = () => {
    transitionTo('eventPicker', {
      selectedEvent: null,
      answers: initialState.answers,
      selectedScenario: 'match_timing',
      planName: '',
      activePlanId: null,
      isViewingSavedPlan: false,
    });
  };

  const createLifeEventPlan = (event: Exclude<PlanningOwlEvent, 'custom'>) => {
    transitionTo('question1', {
      selectedEvent: event,
      answers: initialState.answers,
      selectedScenario: 'match_timing',
      planName: '',
      activePlanId: null,
      isViewingSavedPlan: false,
    });
  };

  const createCustomPlan = (goalName?: string) => {
    transitionTo('customQuestion1', {
      selectedEvent: 'custom',
      answers: {
        ...initialState.answers,
        customGoalName: goalName ?? null,
      },
      selectedScenario: 'match_timing',
      planName: goalName ?? '',
      activePlanId: null,
      isViewingSavedPlan: false,
    });
  };

  const handleNudgeAction = (nudge: PlanningNudge) => {
    if (nudge.action.type === 'customEmergency') {
      createCustomPlan('Emergency savings');
      return;
    }

    if (nudge.action.type === 'event') {
      createLifeEventPlan(nudge.action.event);
      return;
    }

    openNewPlanPicker();
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
      event: state.selectedEvent ?? 'property',
      titleOverride: state.planName,
      answers: state.answers,
      selectedScenario: state.selectedScenario,
    });
    const savedCompletionKey = getPlanningOwlCompletionKey({
      planId: savedPlan.id,
      event: state.selectedEvent ?? 'property',
      selectedScenario: state.selectedScenario,
      answers: state.answers,
    });
    mergePlanningOwlCompletedActions(actionCompletionKey, savedCompletionKey);
    const savedPlans = await getSavedPlanningOwlPlans();
    setState((current) => ({ ...current, savedPlans, activePlanId: savedPlan.id, step: 'results' }));
    setTimeout(() => setIsTransitioning(false), 280);
  };

  const finishAndReturnPlans = () => {
    setState((current) => ({
      ...initialState,
      savedPlans: current.savedPlans,
      isViewingSavedPlan: false,
    }));
  };

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHeader step={state.step} selectedEvent={state.selectedEvent} onBack={goBack} disableBack={isTransitioning} />

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
              onNudgeAction={handleNudgeAction}
              onEditSavedPlan={editSavedPlan}
              onViewSavedPlan={viewSavedPlan}
              onDeleteSavedPlan={deleteSavedPlan}
            />
          )}

          {state.step === 'eventPicker' && (
            <LifeEventPicker
              disabled={isTransitioning}
              onSelectEvent={createLifeEventPlan}
              onSelectCustom={createCustomPlan}
            />
          )}

          {renderedQuestion && (
            <FollowUpQuestion
              question={renderedQuestion}
              selectedValue={state.answers[renderedQuestion.answerKey]}
              disabled={isTransitioning}
              onSelect={(value) => updateAnswer(renderedQuestion.answerKey, value)}
              onNext={() => completeQuestion(renderedQuestion)}
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
              isSaved={isCurrentPlanSaved}
              savedScenario={savedScenarioForCurrentAnswers}
              event={state.selectedEvent ?? 'property'}
              planName={state.planName}
              completedActions={completedActions}
              onPlanNameChange={(planName) => setState((current) => ({ ...current, planName }))}
              onScenarioChange={(selectedScenario) => setState((current) => ({ ...current, selectedScenario, isViewingSavedPlan: false }))}
              onActionPress={openProductAction}
              onCommit={commitPlan}
              onBackToPlans={finishAndReturnPlans}
            />
          )}

          {state.step === 'comparison' && (
            <StrategyComparison
              simulation={simulation}
              disabled={isTransitioning}
              isReadOnly={state.isViewingSavedPlan}
              completedActions={completedActions}
              onActionPress={openProductAction}
              onCommit={commitPlan}
            />
          )}

          {state.step === 'committed' && (
            <CommitConfirmation
              simulation={simulation}
              answers={state.answers}
              onDone={finishAndReturnPlans}
            />
          )}
        </MotiView>
      </ScrollView>

    </YStack>
  );
}

function FlowHeader({
  step,
  selectedEvent,
  onBack,
  disableBack,
}: {
  step: PlanningStep;
  selectedEvent: PlanningOwlEvent | null;
  onBack: () => void;
  disableBack: boolean;
}) {
  const subtitle = step === 'plansHome' ? 'Your plans' : step === 'eventPicker' ? 'Choose a goal' : getEventLabel(selectedEvent);

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
          {subtitle}
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
  onNudgeAction,
  onEditSavedPlan,
  onViewSavedPlan,
  onDeleteSavedPlan,
}: {
  savedPlans: SavedPlanningOwlPlan[];
  disabled: boolean;
  onNewPlan: () => void;
  onNudgeAction: (nudge: PlanningNudge) => void;
  onEditSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
  onViewSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
  onDeleteSavedPlan: (savedPlan: SavedPlanningOwlPlan) => void;
}) {
  const [showInsight, setShowInsight] = useState(true);
  const planningNudge = getPlanningNudge(savedPlans);

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

      {showInsight && (
        <YStack padding="$4" gap="$3" borderRadius={16} backgroundColor="#FFF7F2" borderWidth={1} borderColor="#F4D7C8">
          <XStack alignItems="center" gap="$3">
            <YStack width={42} height={42} borderRadius={21} backgroundColor="white" alignItems="center" justifyContent="center">
              <FontAwesome5 name="brain" size={17} color="#B43A1D" />
            </YStack>
            <YStack flex={1}>
              <Text fontSize={12} color="#B43A1D" fontWeight="900">
                {planningNudge.title}
              </Text>
              <Text fontSize={14} color="#33211B" lineHeight={20} marginTop="$1">
                {planningNudge.detail}
              </Text>
            </YStack>
          </XStack>
          <XStack gap="$2">
            <Button flex={1} height={40} borderRadius={20} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={() => onNudgeAction(planningNudge)}>
              {planningNudge.actionLabel}
            </Button>
            <Button chromeless flex={1} color="#6E5249" disabled={disabled} onPress={() => setShowInsight(false)}>
              Not now
            </Button>
          </XStack>
        </YStack>
      )}

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
        <YStack gap="$3">
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
        </YStack>
      )}
    </YStack>
  );
}

function LifeEventPicker({
  disabled,
  onSelectEvent,
  onSelectCustom,
}: {
  disabled: boolean;
  onSelectEvent: (event: Exclude<PlanningOwlEvent, 'custom'>) => void;
  onSelectCustom: () => void;
}) {
  const events: { id: Exclude<PlanningOwlEvent, 'custom'>; title: string; icon: keyof typeof Feather.glyphMap }[] = [
    { id: 'property', title: 'Buying a property', icon: 'home' },
    { id: 'education', title: 'Education', icon: 'book-open' },
    { id: 'wedding', title: 'Getting married', icon: 'heart' },
    { id: 'family', title: 'Starting a family', icon: 'users' },
    { id: 'career_break', title: 'Career break', icon: 'coffee' },
  ] as const;

  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <Text fontSize={30} fontWeight="900" color="black">
          What are you planning for?
        </Text>
        <Text fontSize={15} color="rgba(0,0,0,0.58)" lineHeight={22}>
          Pick a life event or open-ended savings goal and Planning Owl will shape a mock scenario around it.
        </Text>
      </YStack>

      <YStack gap="$3">
        <Text fontSize={13} color="rgba(23,32,48,0.55)" fontWeight="900" textTransform="uppercase">
          Recommended
        </Text>
        <Pressable disabled={disabled} accessibilityRole="button" onPress={() => onSelectEvent('property')}>
          <YStack padding="$4" gap="$3" borderRadius={16} backgroundColor="#FFF1F4" borderWidth={1} borderColor="#F1CDD4">
            <XStack alignItems="center" gap="$3">
              <YStack width={46} height={46} borderRadius={23} backgroundColor="white" alignItems="center" justifyContent="center">
                <Feather name="home" size={21} color="#DA291C" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={12} color="#C9002B" fontWeight="900">
                  Suggested by Owl
                </Text>
                <Text fontSize={17} fontWeight="900" color="#111820" marginTop="$1">
                  Buying a property
                </Text>
                <Text fontSize={12} color="rgba(23,32,48,0.58)" marginTop="$1">
                  Suggested because your salary credits are regular, your cash left after upfront home costs stays above the planning threshold, and recent high-value payment patterns make a property plan worth modelling.
                </Text>
              </YStack>
              <Feather name="arrow-right" size={20} color="#C9002B" />
            </XStack>
          </YStack>
        </Pressable>
      </YStack>

      <YStack gap="$3">
        <Text fontSize={13} color="rgba(23,32,48,0.55)" fontWeight="900" textTransform="uppercase">
          Life events
        </Text>
        {events.map((event) => (
          <Pressable
            key={event.id}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            onPress={() => onSelectEvent(event.id)}
          >
            <GlassCard padding="$4">
              <XStack alignItems="center" gap="$4">
                <YStack width={48} height={48} borderRadius={24} backgroundColor="rgba(218,41,28,0.1)" alignItems="center" justifyContent="center">
                  <Feather name={event.icon} size={22} color="#DA291C" />
                </YStack>
                <YStack flex={1}>
                  <Text fontSize={17} fontWeight="800" color="black">
                    {event.title}
                  </Text>
                </YStack>
                <Feather name="arrow-right" size={20} color="rgba(0,0,0,0.45)" />
              </XStack>
            </GlassCard>
          </Pressable>
        ))}
      </YStack>

      <YStack gap="$3">
        <Text fontSize={13} color="rgba(23,32,48,0.55)" fontWeight="900" textTransform="uppercase">
          Other goals
        </Text>
        <Pressable disabled={disabled} accessibilityRole="button" onPress={onSelectCustom}>
          <GlassCard padding="$4">
            <XStack alignItems="center" gap="$4">
              <YStack width={48} height={48} borderRadius={24} backgroundColor="rgba(65,90,156,0.1)" alignItems="center" justifyContent="center">
                <Feather name="target" size={22} color="#415A9C" />
              </YStack>
              <YStack flex={1}>
                <Text fontSize={17} fontWeight="800" color="black">
                  Save for something else
                </Text>
                <Text fontSize={12} color="rgba(0,0,0,0.5)" marginTop="$1">
                  Build a rainy day, travel, renovation, or custom savings goal.
                </Text>
              </YStack>
              <Feather name="arrow-right" size={20} color="rgba(0,0,0,0.45)" />
            </XStack>
          </GlassCard>
        </Pressable>
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
      <XStack alignItems="center" justifyContent="space-between" gap="$2">
        <Text fontSize={18} fontWeight="900" color="#111820">
          Saved plans
        </Text>
        <XStack gap="$2">
          <Button size="$3" borderRadius={18} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onNewPlan}>
            New plan
          </Button>
        </XStack>
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
  const savedScenario = getPlanningOwlSimulationForEvent(savedPlan.event, savedPlan.answers, savedPlan.selectedScenario);

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
        <XStack alignItems="center" gap="$2">
          <XStack borderWidth={1} borderColor="#F1CDD4" paddingHorizontal="$3" paddingVertical="$2" borderRadius={16}>
            <Text fontSize={12} color="#C9002B" fontWeight="900">
              {savedScenario.scenarioLabel}
            </Text>
          </XStack>
          <Button circular size="$3" backgroundColor="rgba(139,30,37,0.06)" disabled={disabled} onPress={onDelete}>
            <Feather name="trash-2" size={16} color={disabled ? 'rgba(139,30,37,0.28)' : '#8B1E25'} />
          </Button>
        </XStack>
      </XStack>

      <YStack gap="$2">
        {getSavedPlanSummaryRows(savedPlan).map((row) => (
          <SummaryRow key={row.label} label={row.label} value={row.value} />
        ))}
      </YStack>

      <XStack gap="$2">
        <Button flex={1} height={42} borderRadius={21} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onEdit}>
          Edit answers
        </Button>
        <Button flex={1} height={42} borderRadius={21} backgroundColor="rgba(0,0,0,0.06)" color="#111820" fontWeight="800" disabled={disabled} onPress={onView}>
          View results
        </Button>
      </XStack>
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
      <ProgressDots current={question.questionNumber} total={question.totalQuestions} />
      <YStack gap="$2">
        <YStack gap="$2">
          <Text fontSize={27} fontWeight="900" color="black">
            {question.title}
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            {question.prefilled && <QuestionBadge label="FROM NUMBERS" />}
          </XStack>
        </YStack>
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
              placeholder={question.customPlaceholder}
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

function QuestionBadge({ label }: { label: string }) {
  return (
    <XStack alignSelf="flex-start" backgroundColor="rgba(218,41,28,0.08)" paddingHorizontal="$2" paddingVertical="$1" borderRadius={8}>
      <Text fontSize={10} color="#DA291C" fontWeight="900">
        {label}
      </Text>
    </XStack>
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
  isSaved,
  savedScenario,
  event,
  planName,
  completedActions,
  onPlanNameChange,
  onScenarioChange,
  onActionPress,
  onCommit,
  onBackToPlans,
}: {
  simulation: PlanningOwlSimulation;
  scenarios: PlanningOwlSimulation[];
  selectedScenario: PlanningOwlScenario;
  disabled: boolean;
  isReadOnly: boolean;
  isSaved: boolean;
  savedScenario: PlanningOwlScenario | null;
  event: PlanningOwlEvent;
  planName: string;
  completedActions: Set<string>;
  onPlanNameChange: (value: string) => void;
  onScenarioChange: (scenario: PlanningOwlScenario) => void;
  onActionPress: (target: string, actionId: string, insight?: string) => void;
  onCommit: () => void;
  onBackToPlans: () => void;
}) {
  const [expandedScenario, setExpandedScenario] = useState<PlanningOwlScenario | null>(isReadOnly ? selectedScenario : null);
  const eventLabel = event === 'custom' ? 'CUSTOM SAVINGS GOAL' : event === 'property' ? 'LIFE EVENT: BUYING A PROPERTY' : `LIFE EVENT: ${getEventLabel(event).toUpperCase()}`;
  const timelineLabel = event === 'custom' || event !== 'property' ? 'Timeline' : 'Purchase timing';
  const successCopy =
    event === 'custom'
      ? 'Goal readiness is based on target amount, monthly savings habit, timeline, and money kept for emergencies.'
      : event !== 'property'
        ? 'Goal readiness is based on the selected target, timeline, monthly pressure, and cash kept available.'
      : 'Goal readiness is based on downpayment progress, repayment comfort, and cash left after upfront costs.';

  return (
    <YStack gap="$5">
      <YStack gap="$3">
        <XStack justifyContent="space-between" alignItems="center" gap="$3">
          <Text flex={1} fontSize={13} color="rgba(23,32,48,0.7)" letterSpacing={4}>
            {eventLabel}
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
        <MetricCard label="Goal readiness" value={`${simulation.successProbability}%`} accent />
        <MetricCard label={timelineLabel} value={simulation.purchaseTiming} />
      </XStack>
      <Text fontSize={12} color="rgba(23,32,48,0.58)" lineHeight={18}>
        {successCopy}
      </Text>

      <YStack gap="$3">
        <Text fontSize={16} fontWeight="900" color="#111820">
          Choose a scenario
        </Text>
        {isReadOnly ? (
          <ScenarioAccordionCard
            scenario={simulation}
            active
            expanded
            locked
            disabled={disabled}
            isReadOnly={isReadOnly}
            isSaved={isSaved}
            saveLocked={false}
            onPress={() => undefined}
            onActionPress={onActionPress}
            completedActions={completedActions}
            onCommit={onCommit}
            onBackToPlans={onBackToPlans}
            planName={planName}
            onPlanNameChange={onPlanNameChange}
          />
        ) : (
          scenarios.map((scenario) => (
            <ScenarioAccordionCard
              key={scenario.scenario}
              scenario={scenario}
              active={selectedScenario === scenario.scenario}
              expanded={expandedScenario === scenario.scenario}
              disabled={disabled}
              isReadOnly={isReadOnly}
              isSaved={isSaved && selectedScenario === scenario.scenario}
              saveLocked={Boolean(savedScenario && savedScenario !== scenario.scenario)}
              onPress={() => {
                setExpandedScenario((current) => (current === scenario.scenario ? null : scenario.scenario));
                onScenarioChange(scenario.scenario);
              }}
              onActionPress={onActionPress}
              completedActions={completedActions}
              onCommit={onCommit}
              onBackToPlans={onBackToPlans}
              planName={planName}
              onPlanNameChange={onPlanNameChange}
            />
          ))
        )}
      </YStack>
    </YStack>
  );
}

function StrategyComparison({
  simulation,
  disabled,
  isReadOnly,
  completedActions,
  onActionPress,
  onCommit,
}: {
  simulation: PlanningOwlSimulation;
  disabled: boolean;
  isReadOnly: boolean;
  completedActions: Set<string>;
  onActionPress: (target: string, actionId: string, insight?: string) => void;
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
          <ActionRow
            key={action.id}
            label={action.label}
            detail={action.detail}
            insight={action.insight}
            disabled={disabled}
            completed={completedActions.has(action.id)}
            completedLabel={getPlanningOwlActionStatus(action.id)}
            onPress={() => onActionPress(action.target, action.id, action.insight)}
          />
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
  simulation: PlanningOwlSimulation;
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

function StrategyTimelineCard({ simulation }: { simulation: PlanningOwlSimulation }) {
  const savedRatio = simulation.comparison.monthsSaved === 0 ? 0.08 : Math.max(0.22, Math.min(0.5, simulation.comparison.monthsSaved / 28));
  const savedWidth = `${Math.round(savedRatio * 100)}%`;
  const remainingWidth = `${100 - Math.round(savedRatio * 100)}%`;
  const badgeLabel = simulation.comparison.monthsSaved === 0 ? simulation.liquidityNote : `${simulation.comparison.monthsSaved} months saved`;

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

function ActionRow({
  label,
  detail,
  insight,
  disabled,
  completed = false,
  completedLabel,
  onPress,
}: {
  label: string;
  detail: string;
  insight?: string;
  disabled: boolean;
  completed?: boolean;
  completedLabel?: string;
  onPress: () => void;
}) {
  const lowerLabel = label.toLowerCase();
  const isDeposit = lowerLabel.includes('deposit');
  const isLoan = lowerLabel.includes('loan');
  const isAccount = lowerLabel.includes('360');
  const isCard = lowerLabel.includes('card');
  const isInsurance = lowerLabel.includes('insurance');
  const iconName = isLoan ? 'briefcase' : isDeposit || isAccount ? 'home' : isCard ? 'credit-card' : isInsurance ? 'shield' : 'bar-chart-2';
  const iconColor = isLoan ? '#7A4A00' : isDeposit || isAccount ? '#C9002B' : isCard ? '#6E4AA8' : isInsurance ? '#147A2E' : '#415A9C';
  const iconBackground = isLoan ? '#FFF1D6' : isDeposit || isAccount ? '#FFE2E8' : isCard ? '#EEE8FF' : isInsurance ? '#DDF5E4' : '#E4E9FF';
  const actionLabel = isLoan
    ? 'View recommended loans'
    : isDeposit
      ? 'Open Deposit Owl'
      : isAccount
        ? 'Review OCBC 360'
        : isCard
          ? 'Review card plan'
          : isInsurance
            ? 'Review OCBC Insurance'
            : 'Open Investment Owl';

  return (
    <Pressable disabled={disabled} onPress={onPress} accessibilityRole="button">
      <XStack
        padding="$4"
        borderRadius={8}
        backgroundColor={completed ? '#F7FBF8' : 'white'}
        borderWidth={completed ? 1 : 0}
        borderColor={completed ? '#CBE8D1' : 'transparent'}
        alignItems="center"
        gap="$3"
      >
        <YStack width={38} height={38} borderRadius={12} backgroundColor={iconBackground} alignItems="center" justifyContent="center">
          <Feather name={completed ? 'check' : iconName} size={18} color={completed ? '#147A2E' : iconColor} />
        </YStack>
        <YStack flex={1}>
          <XStack alignItems="center" gap="$2" flexWrap="wrap">
            <Text fontSize={15} fontWeight="900" color="#111820">
              {label}
            </Text>
            {completed && (
              <XStack alignItems="center" gap="$1" backgroundColor="#DDF5E4" paddingHorizontal="$2" paddingVertical="$1" borderRadius={10}>
                <Feather name="check-circle" size={11} color="#147A2E" />
                <Text fontSize={10} color="#147A2E" fontWeight="900">
                  {completedLabel ?? 'Done'}
                </Text>
              </XStack>
            )}
          </XStack>
          <Text fontSize={11} color="rgba(23,32,48,0.58)" marginTop="$1">
            {detail}
          </Text>
          {insight && (
            <XStack marginTop="$2" gap="$1.5" alignItems="flex-start">
              <Feather name="zap" size={11} color="#B43A1D" />
              <Text flex={1} fontSize={11} color="#6E5249" lineHeight={15}>
                Why Owl suggests this: {insight}
              </Text>
            </XStack>
          )}
          <Text fontSize={13} color={completed ? '#147A2E' : '#C9002B'} marginTop="$2" fontWeight="900">
            {completed ? 'View again' : actionLabel}
          </Text>
        </YStack>
        <Feather name="arrow-right" size={20} color={completed ? '#6CA67A' : '#8B5962'} />
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
  isReadOnly,
  isSaved,
  saveLocked,
  onPress,
  onActionPress,
  completedActions,
  onCommit,
  onBackToPlans,
  planName,
  onPlanNameChange,
}: {
  scenario: PlanningOwlSimulation;
  active: boolean;
  expanded: boolean;
  locked?: boolean;
  disabled: boolean;
  isReadOnly: boolean;
  isSaved: boolean;
  saveLocked: boolean;
  onPress: () => void;
  onActionPress: (target: string, actionId: string, insight?: string) => void;
  completedActions: Set<string>;
  onCommit: () => void;
  onBackToPlans: () => void;
  planName: string;
  onPlanNameChange: (value: string) => void;
}) {
  const [showFullPlan, setShowFullPlan] = useState(false);
  const fullPlanVisible = expanded && (showFullPlan || isReadOnly);

  return (
    <YStack padding="$4" gap="$3" borderRadius={10} backgroundColor={active ? '#FFF1F4' : 'white'} borderWidth={1} borderColor={active ? '#C9002B' : 'rgba(20,30,45,0.06)'}>
      <Pressable disabled={disabled || locked} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active, disabled: disabled || locked }}>
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
            <XStack gap="$2" flexWrap="wrap" marginTop="$2">
              <ScenarioPill label={`${scenario.successProbability}% goal ready`} accent={active} />
              <ScenarioPill label={scenario.purchaseTiming} />
              <ScenarioPill label={scenario.liquidityNote} alert={scenario.scenario === 'earlier'} />
            </XStack>
          </YStack>
          <YStack width={34} height={34} borderRadius={17} backgroundColor={active ? '#DA291C' : 'rgba(23,32,48,0.06)'} alignItems="center" justifyContent="center">
            <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={19} color={active ? 'white' : '#40506D'} />
          </YStack>
        </XStack>
      </Pressable>

      {expanded && (
        <YStack gap="$3" paddingTop="$1">
          {isSaved && (
            <XStack alignSelf="flex-start" alignItems="center" gap="$2" borderWidth={1} borderColor="#CBE8D1" paddingHorizontal="$3" paddingVertical="$2" borderRadius={16}>
              <Feather name="check-circle" size={14} color="#147A2E" />
              <Text fontSize={12} color="#147A2E" fontWeight="900">
                Plan saved
              </Text>
            </XStack>
          )}
          {scenario.owlRead && (
            <XStack gap="$2" padding="$3" borderRadius={8} backgroundColor="rgba(180,58,29,0.08)" alignItems="flex-start">
              <FontAwesome5 name="brain" size={13} color="#B43A1D" />
              <Text flex={1} fontSize={12} color="#6E3426" lineHeight={17}>
                Why Owl shows this: {scenario.owlRead}
              </Text>
            </XStack>
          )}
          <YStack gap="$2">
            <TradeOffDetailRow label="Best for" value={scenario.bestFor} accent={active} />
            <TradeOffDetailRow label="Cash required" value={scenario.liquidityRequired} />
            <TradeOffDetailRow label="Cash left after plan" value={scenario.liquidityAfterPurchase} />
            <TradeOffDetailRow label="Risk" value={scenario.riskLevel} accent={active} />
            <TradeOffDetailRow label="Suggested mix" value={scenario.investmentBasket} secondary />
          </YStack>

          <Button
            height={42}
            borderRadius={21}
            backgroundColor="rgba(0,0,0,0.06)"
            color="#111820"
            fontWeight="800"
            disabled={disabled}
            onPress={() => setShowFullPlan((current) => !current)}
          >
            {fullPlanVisible ? 'Hide full plan' : 'See full plan'}
          </Button>

          {fullPlanVisible && (
            <FullScenarioPlan
              scenario={scenario}
              disabled={disabled}
              isReadOnly={isReadOnly}
              isSaved={isSaved}
              saveLocked={saveLocked}
              onActionPress={onActionPress}
              completedActions={completedActions}
              onCommit={onCommit}
              onBackToPlans={onBackToPlans}
              planName={planName}
              onPlanNameChange={onPlanNameChange}
            />
          )}
        </YStack>
      )}
    </YStack>
  );
}

function ScenarioPill({ label, alert = false, accent = false }: { label: string; alert?: boolean; accent?: boolean }) {
  return (
    <XStack backgroundColor="transparent" borderWidth={1} borderColor={alert || accent ? '#F1CDD4' : 'rgba(23,32,48,0.14)'} paddingHorizontal="$2.5" paddingVertical="$1.5" borderRadius={14}>
      <Text fontSize={11} color={alert || accent ? '#C9002B' : '#33415C'} fontWeight="800">
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
      <YStack gap="$2">
        <Text fontSize={28} fontWeight="900" color="#C9002B">
          {scenario.successProbability}% goal ready
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          <ScenarioPill label={scenario.purchaseTiming} />
          <ScenarioPill label={scenario.liquidityNote} />
        </XStack>
      </YStack>
    </YStack>
  );
}

function FullScenarioPlan({
  scenario,
  disabled,
  isReadOnly,
  isSaved,
  saveLocked,
  onActionPress,
  completedActions,
  onCommit,
  onBackToPlans,
  planName,
  onPlanNameChange,
}: {
  scenario: PlanningOwlSimulation;
  disabled: boolean;
  isReadOnly: boolean;
  isSaved: boolean;
  saveLocked: boolean;
  onActionPress: (target: string, actionId: string, insight?: string) => void;
  completedActions: Set<string>;
  onCommit: () => void;
  onBackToPlans: () => void;
  planName: string;
  onPlanNameChange: (value: string) => void;
}) {
  const timelineLabel = scenario.comparison.monthsSaved > 0 ? `${scenario.comparison.monthsSaved} months earlier` : scenario.liquidityNote;

  return (
    <YStack gap="$3">
      <YStack padding="$4" gap="$3" borderRadius={10} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
        <XStack alignItems="center" gap="$2">
          <FontAwesome5 name="brain" size={15} color="#C9002B" />
          <Text fontSize={15} fontWeight="900" color="#111820">
            What this plan does
          </Text>
        </XStack>
        <Text fontSize={13} color="rgba(23,32,48,0.64)" lineHeight={20}>
          {scenario.guidance}
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          <ScenarioPill label={timelineLabel} accent={scenario.comparison.monthsSaved > 0} />
          <ScenarioPill label={scenario.liquidityAfterPurchase} />
          <ScenarioPill label={scenario.riskLevel} alert={scenario.scenario === 'earlier'} />
        </XStack>
      </YStack>

      <YStack padding="$4" gap="$3" borderRadius={10} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
        <XStack alignItems="center" gap="$2">
          <Feather name="sliders" size={16} color="#C9002B" />
          <Text fontSize={15} fontWeight="900" color="#111820">
            Lifestyle adjustment
          </Text>
        </XStack>
        <Text fontSize={13} color="rgba(23,32,48,0.64)" lineHeight={20}>
          {scenario.comparison.lifestyleAdjustment}
        </Text>
        {scenario.comparison.lifestyleSuggestions.map((suggestion) => (
          <XStack key={suggestion} alignItems="flex-start" gap="$3">
            <YStack width={6} height={6} borderRadius={3} backgroundColor="#C9002B" marginTop="$2" />
            <Text flex={1} fontSize={12} color="#111820" lineHeight={18}>
              {suggestion}
            </Text>
          </XStack>
        ))}
      </YStack>

      <YStack padding="$4" gap="$3" borderRadius={10} backgroundColor="white" borderWidth={1} borderColor="rgba(20,30,45,0.06)">
        <XStack alignItems="center" gap="$2">
          <Feather name="zap" size={16} color="#C9002B" />
          <Text fontSize={15} fontWeight="900" color="#111820">
            Why this works
          </Text>
        </XStack>
        {scenario.comparison.reasons.map((reason) => (
          <YStack key={reason.title} paddingLeft="$3" borderLeftWidth={3} borderLeftColor="#C9002B">
            <Text fontSize={13} fontWeight="900" color="#111820">
              {reason.title}
            </Text>
            <Text fontSize={12} color="rgba(23,32,48,0.6)" lineHeight={18} marginTop="$1">
              {reason.detail}
            </Text>
          </YStack>
        ))}
      </YStack>

      <YStack padding="$4" gap="$3" borderRadius={10} backgroundColor="#FFF1F4" borderWidth={1} borderColor="#F1CDD4">
        <XStack alignItems="center" gap="$2">
          <Feather name="check-circle" size={16} color="#C9002B" />
          <Text fontSize={15} fontWeight="900" color="#C9002B">
            Recommended action plan
          </Text>
        </XStack>
        {scenario.actions.map((action) => (
          <ActionRow
            key={action.id}
            label={action.label}
            detail={action.detail}
            insight={action.insight}
            disabled={disabled}
            completed={completedActions.has(action.id)}
            completedLabel={getPlanningOwlActionStatus(action.id)}
            onPress={() => onActionPress(action.target, action.id, action.insight)}
          />
        ))}
      </YStack>

      {isReadOnly ? (
        <YStack padding="$4" borderRadius={12} backgroundColor="rgba(0,0,0,0.04)">
          <Text fontSize={13} color="rgba(23,32,48,0.62)" textAlign="center" lineHeight={19}>
            This is a saved-plan preview. Use Edit answers from the saved-plan card to make changes and recommit.
          </Text>
        </YStack>
      ) : isSaved ? (
        <YStack padding="$4" gap="$3" borderRadius={12} backgroundColor="#DDF5E4">
          <Text fontSize={13} color="#147A2E" fontWeight="900" textAlign="center">
            Saved. You can still open each recommendation when you are ready.
          </Text>
          <Button height={42} borderRadius={21} backgroundColor="white" color="#147A2E" fontWeight="900" onPress={onBackToPlans}>
            Back to your plans
          </Button>
        </YStack>
      ) : saveLocked ? (
        <YStack padding="$4" gap="$3" borderRadius={12} backgroundColor="rgba(0,0,0,0.04)">
          <Text fontSize={13} color="rgba(23,32,48,0.62)" textAlign="center" lineHeight={19}>
            You have already saved another option for this plan. Return to your plans or edit the saved plan to change it.
          </Text>
          <Button height={42} borderRadius={21} backgroundColor="white" color="#111820" fontWeight="900" onPress={onBackToPlans}>
            Back to your plans
          </Button>
        </YStack>
      ) : (
        <YStack gap="$3">
          <YStack gap="$2">
            <Text fontSize={13} color="#111820" fontWeight="900">
              Plan name
            </Text>
            <Input
              value={planName}
              onChangeText={onPlanNameChange}
              disabled={disabled}
              placeholder={scenario.title}
              height={46}
              borderRadius={14}
              borderColor="rgba(0,0,0,0.08)"
              backgroundColor="white"
            />
            <Text fontSize={11} color="rgba(23,32,48,0.52)" lineHeight={16}>
              Optional. Leave blank to use the generated plan title.
            </Text>
          </YStack>
          <Button height={52} borderRadius={26} backgroundColor="#DA291C" color="white" fontWeight="800" disabled={disabled} onPress={onCommit}>
            Save plan
          </Button>
        </YStack>
      )}
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

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <XStack gap="$2">
      {Array.from({ length: total }, (_, index) => index + 1).map((dot) => (
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

function getSavedPlanSummaryRows(savedPlan: SavedPlanningOwlPlan) {
  const { answers } = savedPlan;
  switch (savedPlan.event) {
    case 'custom':
      return [
        { label: 'Goal', value: answers.customGoalName ?? 'Not set' },
        { label: 'Target amount', value: answers.customTargetAmount ?? 'Not set' },
        { label: 'Monthly savings', value: answers.customMonthlySavings ?? 'Not set' },
        { label: 'Target timeframe', value: answers.customTimeframe ?? 'Not set' },
      ];
    case 'education':
      return [
        { label: 'For', value: answers.educationFor ?? 'Not set' },
        { label: 'Education cost', value: answers.educationCost ?? 'Not set' },
        { label: 'Funds ready', value: answers.educationTimeframe ?? 'Not set' },
      ];
    case 'wedding':
      return [
        { label: 'Budget', value: answers.weddingBudget ?? 'Not set' },
        { label: 'Wedding date', value: answers.weddingTimeframe ?? 'Not set' },
        { label: 'Monthly savings', value: answers.weddingMonthlySavings ?? 'Not set' },
      ];
    case 'family':
      return [
        { label: 'Monthly cost', value: answers.familyMonthlyCost ?? 'Not set' },
        { label: 'Buffer', value: answers.familyBufferMonths ?? 'Not set' },
        { label: 'Ready by', value: answers.familyTimeframe ?? 'Not set' },
      ];
    case 'career_break':
      return [
        { label: 'Monthly expenses', value: answers.careerBreakMonthlyExpenses ?? 'Not set' },
        { label: 'Break length', value: answers.careerBreakDuration ?? 'Not set' },
        { label: 'Start date', value: answers.careerBreakTimeframe ?? 'Not set' },
      ];
    case 'property':
    default:
      return [
        { label: 'Property value', value: answers.propertyValue ?? 'Not set' },
        { label: 'Downpayment', value: answers.downpayment ?? 'Not set' },
        { label: 'Target timeframe', value: answers.timeframe ?? 'Not set' },
      ];
  }
}

type PlanningNudgeAction =
  | { type: 'picker' }
  | { type: 'customEmergency' }
  | { type: 'event'; event: Exclude<PlanningOwlEvent, 'custom'> };

type PlanningNudge = {
  title: string;
  detail: string;
  actionLabel: string;
  action: PlanningNudgeAction;
};

function getPlanningNudge(savedPlans: SavedPlanningOwlPlan[]): PlanningNudge {
  if (savedPlans.length === 0) {
    return {
      title: 'Start with a quick plan',
      detail: 'Start with what you can save, then let Owl suggest a goal.',
      actionLabel: 'Create a plan',
      action: { type: 'picker' },
    };
  }

  const savedEvents = new Set(savedPlans.map((plan) => plan.event));
  if (savedEvents.size === 1 && savedEvents.has('property')) {
    const homePlan = savedPlans.find((plan) => plan.event === 'property');
    const downpayment = homePlan?.answers.downpayment;
    const downpaymentCopy = downpayment ? `${downpayment} for upfront costs` : 'your saved home downpayment';
    return {
      title: 'Suggested next: Emergency savings',
      detail: `Because your saved home plan sets aside ${downpaymentCopy}, and your recurring card/debit spend suggests regular monthly commitments, Owl recommends checking emergency savings before adding another big goal.`,
      actionLabel: 'Create plan',
      action: { type: 'customEmergency' },
    };
  }

  if (savedEvents.has('custom')) {
    const nextLifeEventRecommendation = getNextLifeEventRecommendation(savedEvents);
    if (nextLifeEventRecommendation) {
      return nextLifeEventRecommendation;
    }
  }

  return {
    title: 'Review your saved plans',
    detail: `Because you have ${savedPlans.length} saved plans, Owl suggests reviewing targets or creating a new plan when your timeline or monthly amount changes.`,
    actionLabel: 'Create plan',
    action: { type: 'picker' },
  };
}

function getNextLifeEventRecommendation(savedEvents: Set<PlanningOwlEvent>): PlanningNudge | null {
  if (!savedEvents.has('education')) {
    return {
      title: 'Suggested next: Education',
      detail: 'Because your regular salary credits are visible and your emergency savings plan is in place, Owl recommends checking education costs before they become a fixed monthly commitment.',
      actionLabel: 'Create plan',
      action: { type: 'event', event: 'education' },
    };
  }

  if (!savedEvents.has('family')) {
    return {
      title: 'Suggested next: Family emergency fund',
      detail: 'Because recurring card/debit spend can rise when family expenses change, Owl recommends checking a family emergency fund before adding more commitments.',
      actionLabel: 'Create plan',
      action: { type: 'event', event: 'family' },
    };
  }

  if (!savedEvents.has('career_break')) {
    return {
      title: 'Suggested next: Career break',
      detail: 'Because regular salary credits are part of the current profile, Owl recommends checking how long expenses could be covered if income pauses.',
      actionLabel: 'Create plan',
      action: { type: 'event', event: 'career_break' },
    };
  }

  return null;
}

function answersMatch(left: PlanningOwlAnswers, right: PlanningOwlAnswers) {
  const keys: (keyof PlanningOwlAnswers)[] = [
    'propertyValue',
    'downpayment',
    'timeframe',
    'customGoalName',
    'customTargetAmount',
    'customMonthlySavings',
    'customTimeframe',
    'educationFor',
    'educationCost',
    'educationTimeframe',
    'weddingBudget',
    'weddingTimeframe',
    'weddingMonthlySavings',
    'familyMonthlyCost',
    'familyBufferMonths',
    'familyTimeframe',
    'careerBreakMonthlyExpenses',
    'careerBreakDuration',
    'careerBreakTimeframe',
  ];
  return keys.every((key) => left[key] === right[key]);
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 170,
  },
});
