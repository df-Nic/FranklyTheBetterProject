import { PLANS_DATA } from '../../../data/planTemplates.js';
import { getPortfolioEvidence } from './portfolioSnapshot.js';

const LEAD_BY_GOAL = {
  home_deposit: 'sequencing',
  retirement: 'yield',
  education: 'sequencing',
  emergency_fund: 'cashflow',
  general: 'sequencing',
};

function resolveTemplate(planId, propertyType) {
  const template = PLANS_DATA[planId] ?? PLANS_DATA.default;
  return planId === 'housing' && template.getByType
    ? template.getByType(propertyType ?? 'hdb')
    : template;
}

function actionSummary(action) {
  return {
    id: action.id,
    name: action.name,
    type: action.type,
    amount: Number(action.baseVal || 0),
    rate: Number(action.rate || 0),
  };
}

export function buildStrategySnapshot(request) {
  const template = resolveTemplate(request.planId, request.propertyType);
  const actions = (template.categories ?? []).flatMap((category) =>
    (category.actions ?? []).map((action) => ({ ...actionSummary(action), category: category.name })));
  const milestones = (request.milestones ?? []).map((milestone) => ({
    id: milestone.id,
    name: milestone.name,
    amount: Number(milestone.amount || 0),
    date: milestone.date ?? null,
  }));

  const cashflow = actions.filter((action) => ['deposit', 'saving', 'defense'].includes(action.type));
  const yieldActions = actions.filter((action) => ['investment', 'yield'].includes(action.type));
  const sequencing = actions.filter((action) => action.type === 'grant' || /loan|mortgage|cpf/i.test(`${action.name} ${action.category}`));
  const leadAgent = LEAD_BY_GOAL[request.goalType] ?? 'sequencing';
  const contributionCount = {
    cashflow: cashflow.length,
    yield: yieldActions.length,
    sequencing: Math.max(sequencing.length, milestones.length),
  };
  const confidence = Object.fromEntries(Object.entries(contributionCount).map(([agent, count]) => [
    agent,
    Math.min(0.92, 0.62 + Math.min(count, 5) * 0.035 + (agent === leadAgent ? 0.1 : 0)),
  ]));

  return {
    planId: request.planId,
    planTitle: request.goalLabel || template.title,
    targetAmount: Number(request.targetAmount || 0),
    targetDate: request.targetDate ?? null,
    horizonMonths: Number(request.horizonMonths || 0),
    monthlyContribution: Number(request.monthlyContribution || 0),
    paymentStrategy: request.paymentStrategy ?? 'staggered',
    riskProfile: request.riskProfile ?? 'balanced',
    milestones,
    actions,
    contributions: { cashflow, yield: yieldActions, sequencing },
    leadAgent,
    confidence,
    portfolio: request.portfolioSnapshot ?? null,
    synthesis: request.portfolioSnapshot?.hasExistingPlans
      ? 'The new goal was coordinated with existing commitments, while keeping accepted plans unchanged.'
      : 'Cashflow resilience, return potential, and milestone timing were combined into the final plan.',
  };
}

export function getAgentEvidence(snapshot, agent) {
  const fallback = {
    cashflow: 'the plan\u2019s liquidity buffer',
    yield: 'the plan\u2019s return assumptions',
    sequencing: 'the plan\u2019s milestone schedule',
  };
  const portfolioEvidence = getPortfolioEvidence(snapshot.portfolio, agent);
  if (portfolioEvidence) return portfolioEvidence;
  if (agent === 'sequencing' && snapshot.milestones?.[0]?.name) return snapshot.milestones[0].name;
  return snapshot.contributions?.[agent]?.[0]?.name ?? fallback[agent];
}
