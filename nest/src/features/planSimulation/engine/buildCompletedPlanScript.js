import { buildSimulationScript } from './buildSimulationScript.js';

const GOAL_TYPE_BY_PLAN = {
  housing: 'home_deposit',
  savings: 'home_deposit',
  retirement: 'retirement',
  emergency: 'emergency_fund',
  'children-education': 'education',
};

function getHorizonMonths(goalDate) {
  const target = Date.parse(goalDate);
  if (!Number.isFinite(target)) return 36;
  return Math.max(1, Math.round((target - Date.now()) / (1000 * 60 * 60 * 24 * 30.44)));
}

export function buildCompletedPlanScript(plan) {
  if (!plan?.id) return null;

  const script = buildSimulationScript({
    planId: plan.id,
    goalType: GOAL_TYPE_BY_PLAN[plan.id] ?? 'general',
    goalLabel: plan.goalName,
    horizonMonths: getHorizonMonths(plan.goalDate),
    monthlyContribution: Number(plan.monthlyContribution || 0),
    targetAmount: Number(plan.targetAmount || 0),
    riskProfile: plan.personalContext?.priority ?? 'balanced',
    strategy: plan.strategy,
  });

  return { ...script, id: `completed_${plan.id}`, planId: plan.id, createdAt: 0 };
}
