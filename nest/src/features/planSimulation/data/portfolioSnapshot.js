function monthIndex(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getFullYear() * 12 + parsed.getMonth();
}

function nextMilestone(plan) {
  return (plan.milestones ?? []).find((milestone) => ['next', 'upcoming', 'goal'].includes(milestone.state)) ?? null;
}

export function buildPortfolioSnapshot({ request, plans = [] }) {
  const existingPlans = plans
    .filter(Boolean)
    .filter((plan) => plan.id !== request.planId)
    .map((plan) => {
      const milestone = nextMilestone(plan);
      return {
        id: plan.id,
        name: plan.goalName,
        targetDate: plan.goalDate,
        monthlyContribution: Number(plan.monthlyContribution || 0),
        strategy: plan.strategy ?? '',
        priority: plan.personalContext?.priority ?? 'balance',
        flexibility: plan.personalContext?.flexibility ?? 'some',
        nextMilestone: milestone ? { name: milestone.name, date: milestone.date } : null,
      };
    });

  const newTarget = monthIndex(request.targetDate);
  const collisions = existingPlans.filter((plan) => {
    const dates = [plan.targetDate, plan.nextMilestone?.date].map(monthIndex).filter(Number.isFinite);
    return Number.isFinite(newTarget) && dates.some((date) => Math.abs(date - newTarget) <= 6);
  }).map((plan) => plan.id);
  const committedMonthly = existingPlans.reduce((total, plan) => total + plan.monthlyContribution, 0);

  return {
    hasExistingPlans: existingPlans.length > 0,
    existingPlans,
    committedMonthly,
    combinedMonthly: committedMonthly + Number(request.monthlyContribution || 0),
    milestoneCollisions: collisions,
    coordination: existingPlans.length
      ? collisions.length
        ? 'staged-around-milestones'
        : 'protected-existing-commitments'
      : 'standalone',
  };
}

export function getPortfolioEvidence(portfolio, agent) {
  if (!portfolio?.hasExistingPlans) return null;
  const names = portfolio.existingPlans.map((plan) => plan.name).join(' and ');
  if (agent === 'cashflow') return `the S$${portfolio.committedMonthly.toLocaleString('en-SG')} already committed monthly`;
  if (agent === 'yield') return `overlap with ${names}`;
  return portfolio.milestoneCollisions.length
    ? `timing around ${names}' upcoming milestones`
    : `${names}' existing timeline`;
}
