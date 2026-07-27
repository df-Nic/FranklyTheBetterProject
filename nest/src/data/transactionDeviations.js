import { getMilestonePlan } from "./milestonePlans";

export function createTransactionDeviation({ id, amount, reference, timestamp, sourceAccount, planIds, adjustments }) {
  if (!Number.isFinite(amount) || amount < 3000 || !planIds.length) return null;
  const plans = planIds.map((planId) => getMilestonePlan(planId, adjustments));
  const assessedPlans = plans.map((plan) => {
    const buffer = Math.max(0, plan.onTrack.saved - plan.onTrack.expected);
    const gap = Math.max(0, amount - buffer);
    return {
      planId: plan.id,
      planName: plan.goalName,
      gap,
      originalGap: gap,
      remainingBuffer: Math.max(0, buffer - amount),
      impactStatus: gap > 0 ? "needs-healing" : amount >= buffer * 0.25 ? "reduced-buffer" : "still-on-track",
      status: gap > 0 ? "pending" : "not-required",
    };
  }).sort((a, b) => b.gap - a.gap || a.planName.localeCompare(b.planName));
  const recommended = assessedPlans.find((plan) => plan.status === "pending");
  if (!recommended) return null;
  return {
    id,
    type: "paynow",
    amount,
    reference,
    timestamp,
    sourceAccount,
    status: "pending",
    notificationDismissed: false,
    recommendedPlanId: recommended.planId,
    affectedPlans: assessedPlans,
  };
}

export function planNeedsDeviationReview(events, planId) {
  return events.some((event) => event.status === "pending"
    && event.affectedPlans.some((plan) => plan.planId === planId && plan.status === "pending"));
}
