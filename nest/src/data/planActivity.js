import { getSavingsBreakdown } from "./savingsBreakdowns";

const dateValue = (value) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const offsetDate = (value, days) => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  const date = new Date(parsed);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const offsetMinutes = (value, minutes) => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  return new Date(parsed + minutes * 60_000).toISOString();
};

export function buildSeededPlanActivity(plan, opportunity, decision) {
  const savings = getSavingsBreakdown(plan.id);
  const createdMilestone = plan.milestones.find((item) => item.id === "created");
  const createdDate = dateValue(createdMilestone?.date);
  const savingsAsOf = dateValue(savings.asOf);
  const savingsWindow = Math.max(savingsAsOf - createdDate, 86_400_000);
  const events = [];
  savings.items.forEach((item, index) => {
    const segmentStart = createdDate + (savingsWindow * index) / savings.items.length;
    const segmentEnd = createdDate + (savingsWindow * (index + 1)) / savings.items.length;
    const identifiedAt = createdDate
      ? new Date(segmentStart + (segmentEnd - segmentStart) * 0.25).toISOString()
      : offsetDate(savings.asOf, -(savings.items.length - index) * 9 - 2);
    const acceptedAt = createdDate
      ? new Date(segmentStart + (segmentEnd - segmentStart) * 0.55).toISOString()
      : offsetDate(savings.asOf, -(savings.items.length - index) * 9 - 1);
    const completedAt = createdDate
      ? new Date(segmentStart + (segmentEnd - segmentStart) * 0.85).toISOString()
      : offsetDate(savings.asOf, -(savings.items.length - index) * 9);

    events.push(
      {
        id: `saving-identified-${item.id}`, planId: plan.id, actor: "owl", type: "opportunity",
        title: item.title, description: `Agent Owl identified this opportunity for your plan.`,
        timestamp: identifiedAt, status: "identified",
      },
      {
        id: `saving-accepted-${item.id}`, planId: plan.id, actor: "user", type: "decision",
        title: `${item.title} accepted`, description: "You approved this opportunity.",
        timestamp: acceptedAt, status: "accepted",
      },
      {
        id: `saving-${item.id}`, planId: plan.id, actor: "owl", type: "saving",
        title: item.title, description: item.description, timestamp: completedAt,
        status: "completed", amount: item.amount, calculation: item.calculation, source: item.source,
      },
    );
  });

  if (createdMilestone) events.push({
    id: "plan-created",
    planId: plan.id,
    actor: "user",
    type: "created",
    title: "Plan created",
    description: `${plan.goalName} was created and added to your plan journey.`,
    timestamp: createdMilestone.date,
    status: "completed",
  });

  plan.milestones
    .filter((item) => {
      const completedAt = dateValue(item.completedAt ?? item.date);
      return item.state === "completed"
        && item.id !== "created"
        && completedAt > 0
        && completedAt <= Date.now();
    })
    .forEach((item) => events.push({
    id: `milestone-${item.id}`, planId: plan.id, actor: "user", type: "milestone",
    title: item.name, description: "You completed this step in your plan journey.",
    timestamp: item.completedAt ?? item.date, status: "completed",
  }));

  if (opportunity) events.push({
    id: `opportunity-${opportunity.id}`, planId: plan.id, actor: "owl", type: "opportunity",
    title: opportunity.title,
    description: opportunity.summary,
    timestamp: createdDate && dateValue(opportunity.detectedDate) <= createdDate
      ? new Date(createdDate + 5 * 60_000).toISOString()
      : opportunity.detectedDate,
    status: "identified",
  });

  if (decision) events.push({
    id: `decision-${opportunity?.id ?? plan.id}-${decision.status}`, planId: plan.id,
    actor: "user", type: "decision",
    title: decision.status === "accepted" ? "Opportunity accepted" : "Current plan kept",
    description: decision.status === "accepted"
      ? "You approved Agent Owl’s recommendation and updated the plan."
      : "You reviewed the recommendation and chose not to change the plan.",
    timestamp: decision.decidedAt, status: decision.status,
  });

  if (decision?.status === "accepted" && opportunity) events.push({
    id: `opportunity-completed-${opportunity.id}`,
    planId: plan.id,
    actor: "owl",
    type: "completion",
    title: "Opportunity applied to plan",
    description: decision.returnedAmount > 0
      ? `S$${(decision.allocations.find((allocation) => allocation.planId === plan.id)?.amount ?? 0).toLocaleString("en-SG")} was applied to ${plan.goalName} and S$${decision.returnedAmount.toLocaleString("en-SG")} was returned to your ${decision.sourceAccount}.`
      : `${opportunity.title} has been applied successfully.`,
    timestamp: offsetMinutes(decision.decidedAt, 2),
    status: "completed",
  });
  return events;
}

export function getPlanActivity({ plan, opportunity, decision, runtimeEvents = [] }) {
  const byId = new Map();
  [...buildSeededPlanActivity(plan, opportunity, decision), ...runtimeEvents]
    .filter((event) => event.planId === plan.id)
    .forEach((event) => byId.set(event.id, event));
  return [...byId.values()].sort((a, b) => {
    const aDate = dateValue(a.timestamp);
    const bDate = dateValue(b.timestamp);
    if (aDate !== bDate) return bDate - aDate;

    // Deterministic fallback for legacy records that only contain a calendar date.
    const lifecycleRank = { completed: 3, accepted: 2, identified: 1 };
    return (lifecycleRank[b.status] ?? 0) - (lifecycleRank[a.status] ?? 0);
  });
}
