import { getMilestonePlan } from "./milestonePlans";

const getMonthsUntil = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 12;
  const now = new Date();
  return Math.max(1, (date.getFullYear() - now.getFullYear()) * 12 + date.getMonth() - now.getMonth());
};

const extendGoalDate = (dateValue, months = 2) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  const includesDay = /^\d{1,2}\s/.test(String(dateValue));
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("en-SG", {
    ...(includesDay ? { day: "numeric" } : {}),
    month: "short",
    year: "numeric",
  });
};

export function buildRecoveryOptions(plan, amount) {
  const baseContribution = plan.monthlyContribution > 0
    ? plan.monthlyContribution
    : Math.ceil((plan.targetAmount / getMonthsUntil(plan.goalDate)) / 10) * 10;
  const increasedContribution = Math.round(baseContribution + amount * 0.06);
  const extendedDate = extendGoalDate(plan.goalDate);

  return [
    {
      id: "deposit",
      title: "Adjust monthly deposit",
      label: "Agent Owl recommends",
      description: `Increase monthly savings from S$${baseContribution.toLocaleString("en-SG")} to S$${increasedContribution.toLocaleString("en-SG")} to protect ${plan.goalDate}.`,
      changes: { monthlyContribution: increasedContribution },
      before: `S$${baseContribution.toLocaleString("en-SG")}/mo`,
      after: `S$${increasedContribution.toLocaleString("en-SG")}/mo`,
    },
    {
      id: "timeline",
      title: "Extend plan duration",
      label: "Keep monthly amount",
      description: `Keep monthly savings unchanged and move the target from ${plan.goalDate} to ${extendedDate}.`,
      changes: { goalDate: extendedDate },
      before: plan.goalDate,
      after: extendedDate,
    },
    {
      id: "yield",
      title: "Optimize asset yields",
      label: "Keep target date",
      description: `Use the OCBC 360 Account yield to help absorb the S$${amount.toLocaleString("en-SG")} gap.`,
      changes: {},
      before: plan.strategy,
      after: "OCBC High-Yield reallocation active (4.65% p.a.)",
    },
    {
      id: "sweep",
      title: "Enable cash-flow auto-sweeps",
      label: "Use spare cash flow",
      description: `Sweep an estimated S$85 each month into ${plan.goalName} to rebuild the buffer.`,
      changes: {},
      before: plan.strategy,
      after: "Cashback sweeps active (S$85/mo auto-sweep)",
    },
  ];
}

export function createTransactionDeviation({
  id,
  type = "paynow",
  amount,
  reference,
  timestamp,
  sourceAccount,
  planIds,
  adjustments,
}) {
  if (!Number.isFinite(amount) || amount < 3000 || !planIds?.length) return null;

  const affectedPlans = planIds
    .map((planId) => getMilestonePlan(planId, adjustments))
    .map((plan) => {
      const existingBuffer = Math.max(0, plan.onTrack.saved - plan.onTrack.expected);
      const gap = Math.max(0, amount - existingBuffer);
      const remainingBuffer = Math.max(0, existingBuffer - amount);
      const impactStatus = gap > 0
        ? "needs-healing"
        : existingBuffer > 0 && amount >= existingBuffer * 0.25
          ? "reduced-buffer"
          : "still-on-track";
      return {
        planId: plan.id,
        planName: plan.goalName,
        gap,
        originalGap: gap,
        existingBuffer,
        remainingBuffer,
        impactStatus,
        urgencyScore: gap / Math.max(plan.targetAmount, 1),
        status: gap > 0 ? "pending" : "not-required",
        recoveryOptions: buildRecoveryOptions(plan, amount),
      };
    })
    .sort((a, b) => {
      const impactRank = { "needs-healing": 3, "reduced-buffer": 2, "still-on-track": 1 };
      return impactRank[b.impactStatus] - impactRank[a.impactStatus]
        || b.urgencyScore - a.urgencyScore
        || a.planName.localeCompare(b.planName);
    });

  const recommendedPlan = affectedPlans.find((plan) => plan.status === "pending");
  if (!recommendedPlan) return null;

  return {
    id,
    type,
    amount,
    reference,
    timestamp,
    sourceAccount,
    status: "pending",
    notificationDismissed: false,
    recommendedPlanId: recommendedPlan.planId,
    affectedPlans,
  };
}

export function getPendingDeviationCount(deviations) {
  return deviations.filter((event) => event.status === "pending").length;
}

export function planNeedsDeviationReview(deviations, planId) {
  return deviations.some((event) =>
    event.status === "pending"
    && event.affectedPlans.some((plan) => plan.planId === planId && plan.status === "pending"));
}
