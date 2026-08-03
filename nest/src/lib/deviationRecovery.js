const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const isDeviationPlanActionable = (plan) =>
  plan?.status === "pending" || plan?.status === "timeline-extended";

export const getDeviationStatus = (affectedPlans = []) => {
  const pending = affectedPlans.filter((plan) => plan.status === "pending").length;
  if (!pending) return "resolved";
  return pending < affectedPlans.filter((plan) => plan.status !== "not-required").length
    ? "partially-resolved"
    : "pending";
};

export const createRecoveryBatch = (affectedPlans = [], selectedPlanIds = [], resolvedAt = new Date().toISOString()) => {
  const actionableIds = new Set(
    affectedPlans.filter(isDeviationPlanActionable).map((plan) => plan.planId),
  );
  const recoveryBatchPlanIds = [...new Set(selectedPlanIds)].filter((planId) => actionableIds.has(planId));
  if (!recoveryBatchPlanIds.length) return null;

  const batchIds = new Set(recoveryBatchPlanIds);
  const nextAffectedPlans = affectedPlans.map((plan) => (
    plan.status === "pending" && !batchIds.has(plan.planId)
      ? {
        ...plan,
        status: "covered",
        resolution: "recovery-concentrated-elsewhere",
        gap: 0,
        resolvedAt,
      }
      : plan
  ));

  return { recoveryBatchPlanIds, affectedPlans: nextAffectedPlans };
};

export const getTimelineAutoCoverage = (affectedPlans = [], selectedPlanIds = [], selectedStrategies = {}) => {
  const selectedIds = new Set(selectedPlanIds);
  const selectedPlans = affectedPlans.filter((plan) => selectedIds.has(plan.planId));
  const timelinePlans = selectedPlans.filter((plan) => selectedStrategies[plan.planId] === "timeline");
  if (!timelinePlans.length) return { capacity: 0, sourcePlanId: null, autoCoveredPlanIds: [] };

  const sourcePlan = timelinePlans.reduce((largest, plan) =>
    (Number(plan.gap) || 0) > (Number(largest.gap) || 0) ? plan : largest);
  const capacity = Number(sourcePlan.gap) || 0;
  const autoCoveredPlanIds = selectedPlans
    .filter((plan) => (
      plan.planId !== sourcePlan.planId
      && selectedStrategies[plan.planId] !== "timeline"
      && (Number(plan.gap) || 0) <= capacity
    ))
    .map((plan) => plan.planId);

  return { capacity, sourcePlanId: sourcePlan.planId, autoCoveredPlanIds };
};

export const calculateTimelineDelayMonths = (gap, monthlyContribution) => {
  const contribution = Number(monthlyContribution);
  if (!Number.isFinite(contribution) || contribution <= 0) return null;
  return Math.max(1, Math.ceil(Math.max(0, Number(gap) || 0) / contribution));
};

export const shiftPlanDate = (value, months) => {
  const text = String(value || "").trim();
  const match = text.match(/^(?:(\d{1,2})\s+)?([A-Za-z]{3,9})\s+(\d{4})$/);
  if (!match) return value;
  const monthIndex = MONTHS.findIndex((month) => month.toLowerCase() === match[2].slice(0, 3).toLowerCase());
  if (monthIndex < 0) return value;
  const date = new Date(Number(match[3]), monthIndex + Number(months), Number(match[1] || 1));
  return `${match[1] ? `${date.getDate()} ` : ""}${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const buildTimelineRevision = (plan, gap) => {
  const delayMonths = calculateTimelineDelayMonths(gap, plan?.monthlyContribution);
  if (!delayMonths) return null;
  const originalGoalDate = plan.goalDate;
  const revisedGoalDate = shiftPlanDate(originalGoalDate, delayMonths);
  const milestones = (plan.milestones || []).map((milestone) =>
    milestone.state === "completed"
      ? { ...milestone }
      : { ...milestone, date: shiftPlanDate(milestone.date, delayMonths) });
  return { originalGoalDate, revisedGoalDate, delayMonths, milestones };
};
