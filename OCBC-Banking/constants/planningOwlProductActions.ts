import { PlanningOwlAnswers, PlanningOwlEvent, PlanningOwlScenario } from './planningOwlMocks';

export type PlanningOwlProductTarget =
  | 'deposit_owl'
  | 'invest_owl'
  | 'loan_owl'
  | 'ocbc_360'
  | 'fixed_deposit'
  | 'ocbc_365_card'
  | 'ocbc_insurance';

export type PlanningOwlProductContext = {
  source?: string;
  completionKey?: string;
  planId?: string;
  actionId?: string;
  productTarget?: PlanningOwlProductTarget;
  planTitle?: string;
  scenarioTitle?: string;
  timeline?: string;
  recommendedAmount?: string;
  event?: PlanningOwlEvent;
  insight?: string;
};

export type PlanningOwlReturnContext = {
  completionKey: string;
  planId: string | null;
  event: PlanningOwlEvent;
  answers: PlanningOwlAnswers;
  selectedScenario: PlanningOwlScenario;
  planName: string;
  isViewingSavedPlan: boolean;
};

const completedActionsByKey = new Map<string, Set<string>>();
const returnContextsByKey = new Map<string, PlanningOwlReturnContext>();
const planningOwlAnswerKeys: (keyof PlanningOwlAnswers)[] = [
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

export function getPlanningOwlCompletionKey({
  planId,
  event,
  selectedScenario,
  answers,
}: {
  planId: string | null;
  event: PlanningOwlEvent;
  selectedScenario: PlanningOwlScenario;
  answers: PlanningOwlAnswers;
}) {
  if (planId) {
    return `saved:${planId}`;
  }

  return `draft:${event}:${selectedScenario}:${getPlanningOwlAnswerSignature(answers)}`;
}

function getPlanningOwlAnswerSignature(answers: PlanningOwlAnswers) {
  return planningOwlAnswerKeys.map((key) => `${key}=${encodeURIComponent(getSafeAnswerValue(answers[key]))}`).join('&');
}

function getSafeAnswerValue(value: unknown) {
  if (Array.isArray(value)) {
    return getSafeAnswerValue(value[0]);
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

export function savePlanningOwlReturnContext(context: PlanningOwlReturnContext) {
  returnContextsByKey.set(context.completionKey, {
    ...context,
    answers: { ...context.answers },
  });
}

export function getPlanningOwlReturnContext(completionKey: string | null | undefined) {
  if (!completionKey) {
    return null;
  }

  return returnContextsByKey.get(completionKey) ?? null;
}

export function markPlanningOwlActionComplete(completionKey: string | null | undefined, actionId: string | null | undefined) {
  if (!completionKey || !actionId) {
    return;
  }

  const completedActions = completedActionsByKey.get(completionKey) ?? new Set<string>();
  completedActions.add(actionId);
  completedActionsByKey.set(completionKey, completedActions);
}

export function getCompletedPlanningOwlActions(completionKey: string | null | undefined) {
  if (!completionKey) {
    return new Set<string>();
  }

  return new Set(completedActionsByKey.get(completionKey) ?? []);
}

export function mergePlanningOwlCompletedActions(fromKey: string | null | undefined, toKey: string | null | undefined) {
  if (!fromKey || !toKey || fromKey === toKey) {
    return;
  }

  const fromActions = completedActionsByKey.get(fromKey);
  if (!fromActions || fromActions.size === 0) {
    return;
  }

  const toActions = completedActionsByKey.get(toKey) ?? new Set<string>();
  fromActions.forEach((actionId) => toActions.add(actionId));
  completedActionsByKey.set(toKey, toActions);
}

export function getPlanningOwlActionStatus(actionId: string) {
  const statuses: Record<string, string> = {
    deposit: 'Set up',
    invest: 'Invested',
    loan: 'Checked',
    account360: 'Set up',
    fixed_deposit: 'Placed',
    card365: 'Applied',
    protection: 'Reviewed',
  };

  return statuses[actionId] ?? 'Done';
}

export function getPlanningOwlProductRoute(target: string) {
  const routes: Record<string, string> = {
    deposit_owl: '/smart-deposit-details',
    invest_owl: '/wealth/product-selection',
    loan_owl: '/ocbc-home-loan',
    ocbc_360: '/ocbc-360-account',
    fixed_deposit: '/ocbc-fixed-deposit',
    ocbc_365_card: '/ocbc-365-card',
    ocbc_insurance: '/ocbc-insurance',
  };

  return routes[target] ?? null;
}
