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
    .filter((item) => item.state === "completed" && item.id !== "created")
    .forEach((item) => events.push({
    id: `milestone-${item.id}`, planId: plan.id, actor: "user", type: "milestone",
    title: item.name, description: "You completed this step in your plan journey.",
    timestamp: item.date, status: "completed",
  }));

  if (opportunity) events.push({
    id: `opportunity-${opportunity.id}`, planId: plan.id, actor: "owl", type: "opportunity",
    title: opportunity.title, description: opportunity.summary, timestamp: opportunity.detectedDate,
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
    description: `${opportunity.title} has been applied successfully.`,
    timestamp: decision.decidedAt,
    status: "completed",
  });
  return events;
}

export function getPlanActivity({ plan, opportunity, decision, runtimeEvents = [] }) {
  const byId = new Map();
  [...buildSeededPlanActivity(plan, opportunity, decision), ...runtimeEvents]
    .filter((event) => event.planId === plan.id)
    .forEach((event) => byId.set(event.id, event));
  const now = Date.now();
  return [...byId.values()].sort((a, b) => {
    const aDate = dateValue(a.timestamp);
    const bDate = dateValue(b.timestamp);
    const aFuture = aDate > now;
    const bFuture = bDate > now;

    if (aFuture !== bFuture) return aFuture ? 1 : -1;
    if (aDate !== bDate) return aFuture ? aDate - bDate : bDate - aDate;

    // Preserve lifecycle order when records only have day-level precision:
    // completed (latest), accepted, then identified.
    const lifecycleRank = { completed: 3, accepted: 2, identified: 1 };
    const rankDifference = (lifecycleRank[b.status] ?? 0) - (lifecycleRank[a.status] ?? 0);
    if (rankDifference) return rankDifference;
    return 0;
  });
}
