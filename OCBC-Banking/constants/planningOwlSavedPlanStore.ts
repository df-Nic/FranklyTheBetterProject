import { PlanningOwlAnswers, PlanningOwlScenario } from './planningOwlMocks';

export type SavedPlanningOwlPlan = {
  id: string;
  title: string;
  event: 'property';
  answers: PlanningOwlAnswers;
  selectedScenario: PlanningOwlScenario;
  savedAt: string;
  updatedAt: string;
};

type SavePlanningOwlPlanInput = {
  id?: string | null;
  event: 'property';
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
    id: existingPlan?.id ?? `mock-property-plan-${Date.now()}`,
    title: getSavedPlanTitle(input.answers),
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

function getSavedPlanTitle(answers: PlanningOwlAnswers) {
  if (answers.timeframe) {
    return `Dream home - ${answers.timeframe}`;
  }

  return 'Dream home 2026';
}
