import { PlanningOwlAnswers, PlanningOwlEvent, PlanningOwlScenario } from './planningOwlMocks';

export type SavedPlanningOwlPlan = {
  id: string;
  title: string;
  event: PlanningOwlEvent;
  answers: PlanningOwlAnswers;
  selectedScenario: PlanningOwlScenario;
  savedAt: string;
  updatedAt: string;
};

type SavePlanningOwlPlanInput = {
  id?: string | null;
  event: PlanningOwlEvent;
  titleOverride?: string | null;
  answers: PlanningOwlAnswers;
  selectedScenario: PlanningOwlScenario;
};

let savedPlanningOwlPlans: SavedPlanningOwlPlan[] = [];

export async function getSavedPlanningOwlPlans() {
  return [...savedPlanningOwlPlans].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function savePlanningOwlPlan(input: SavePlanningOwlPlanInput) {
  const now = new Date().toISOString();
  const existingPlan = input.id ? savedPlanningOwlPlans.find((plan) => plan.id === input.id) : undefined;

  const savedPlan: SavedPlanningOwlPlan = {
    id: existingPlan?.id ?? `mock-${input.event}-plan-${Date.now()}`,
    title: getSavedPlanTitle(input.event, input.answers, input.titleOverride, existingPlan?.title),
    event: input.event,
    answers: { ...input.answers },
    selectedScenario: input.selectedScenario,
    savedAt: existingPlan?.savedAt ?? now,
    updatedAt: now,
  };

  if (existingPlan) {
    savedPlanningOwlPlans = savedPlanningOwlPlans.map((plan) => (plan.id === savedPlan.id ? savedPlan : plan));
  } else {
    savedPlanningOwlPlans = [savedPlan, ...savedPlanningOwlPlans];
  }

  return savedPlan;
}

export async function deleteSavedPlanningOwlPlan(planId: string) {
  savedPlanningOwlPlans = savedPlanningOwlPlans.filter((plan) => plan.id !== planId);
}

function getSavedPlanTitle(event: PlanningOwlEvent, answers: PlanningOwlAnswers, titleOverride?: string | null, existingTitle?: string) {
  const trimmedTitle = titleOverride?.trim();
  if (trimmedTitle) {
    return trimmedTitle;
  }

  if (existingTitle) {
    return existingTitle;
  }

  if (event === 'custom') {
    return getAnswerString(answers.customGoalName) || 'Custom savings goal';
  }

  if (event !== 'property') {
    const eventTitle = getEventTitle(event);
    const timeframe = getEventTimeframe(event, answers);
    return timeframe ? `${eventTitle} - ${timeframe}` : eventTitle;
  }

  if (answers.timeframe) {
    return `Dream home - ${answers.timeframe}`;
  }

  return 'Dream home';
}

function getAnswerString(value: unknown) {
  if (Array.isArray(value)) {
    return getAnswerString(value[0]);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function getEventTitle(event: Exclude<PlanningOwlEvent, 'property' | 'custom'>) {
  const labels: Record<Exclude<PlanningOwlEvent, 'property' | 'custom'>, string> = {
    education: 'Education',
    wedding: 'Wedding',
    family: 'Family buffer',
    career_break: 'Career break',
  };
  return labels[event];
}

function getEventTimeframe(event: Exclude<PlanningOwlEvent, 'property' | 'custom'>, answers: PlanningOwlAnswers) {
  const timeframes: Record<Exclude<PlanningOwlEvent, 'property' | 'custom'>, string | null> = {
    education: answers.educationTimeframe,
    wedding: answers.weddingTimeframe,
    family: answers.familyTimeframe,
    career_break: answers.careerBreakTimeframe,
  };
  return timeframes[event];
}
