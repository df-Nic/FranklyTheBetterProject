import { getSavingsBreakdown } from "./savingsBreakdowns.js";

const dateValue = (value) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeTimestamp = (value) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : value;
};

const offsetDate = (value, days) => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  const date = new Date(parsed);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export function buildSeededPlanActivity(plan, opportunity, decision, opportunityLifecycle) {
  if (!plan || !plan.id) return [];
  const milestones = plan.milestones || [];
  const savings = getSavingsBreakdown(plan.id) || { items: [], asOf: "22 Jul 2026" };
  const createdMilestone = milestones.find((item) => item.id === "created");
  const createdDate = dateValue(createdMilestone?.date);
  const savingsAsOf = dateValue(savings.asOf);
  const savingsWindow = Math.max(savingsAsOf - createdDate, 86_400_000);
  const events = [];
  if (!plan.isUserCreated && savings.items) (savings.items || []).forEach((item, index) => {
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
    description: `${plan.goalName || 'Plan'} was created and added to your plan journey.`,
    timestamp: createdMilestone.date,
    status: "completed",
  });

  milestones
    .filter((item) => {
      const completedAt = dateValue(item.completedAt ?? item.date);
      return item.state === "completed"
        && item.id !== "created"
        && completedAt > 0
        && completedAt <= Date.now();
    })
    .forEach((item) => events.push({
    id: `milestone-${item.id}`, planId: plan.id, actor: "user", type: "milestone",
    title: item.completionSource === "opportunity" ? `${item.name} reached` : item.name,
    description: item.completionSource === "opportunity"
      ? `Your confirmed S$${(item.completionAmount || 0).toLocaleString("en-SG")} opportunity allocation brought this plan to S$${(item.savedAtCompletion || 0).toLocaleString("en-SG")} saved and completed this milestone.`
      : "You completed this step in your plan journey.",
    timestamp: item.completedAt ?? item.date,
    sortTimestamp: item.completionSource === "opportunity" ? item.completedAt : undefined,
    lifecycleGroup: item.completionSource === "opportunity"
      ? `opportunity-${item.completionOpportunityId}`
      : undefined,
    lifecycleStep: item.completionSource === "opportunity" ? 3 : undefined,
    status: "completed",
  }));

  const isStandaloneOpportunity = opportunityLifecycle?.route === "standalone";

  if (opportunity && isStandaloneOpportunity) events.push({
    id: `opportunity-${opportunity.id}`, planId: plan.id, actor: "owl", type: "opportunity",
    title: opportunity.title,
    description: opportunity.summary,
    timestamp: opportunityLifecycle.triggeredAt ?? opportunity.detectedDate,
    lifecycleGroup: `opportunity-${opportunity.id}`,
    lifecycleStep: 0,
    status: "identified",
  });

  if (decision && isStandaloneOpportunity) events.push({
    id: `decision-${opportunity?.id ?? plan.id}-${decision.status}`, planId: plan.id,
    actor: "user", type: "decision",
    title: decision.status === "accepted" ? "Opportunity accepted" : "Current plan kept",
    description: decision.status === "accepted"
      ? "You approved Agent Owl’s recommendation and updated the plan."
      : "You reviewed the recommendation and chose not to change the plan.",
    timestamp: decision.decidedAt,
    sortTimestamp: decision.decidedAt,
    lifecycleGroup: `opportunity-${opportunity?.id ?? plan.id}`,
    lifecycleStep: 1,
    status: decision.status,
  });

  if (decision?.status === "accepted" && opportunity && isStandaloneOpportunity) events.push({
    id: `opportunity-completed-${opportunity.id}`,
    planId: plan.id,
    actor: "owl",
    type: "completion",
    title: "Opportunity applied to plan",
    description: decision.returnedAmount > 0
      ? `S$${(decision.allocations?.find((allocation) => allocation.planId === plan.id)?.amount ?? 0).toLocaleString("en-SG")} was applied to ${plan.goalName || 'Plan'} and S$${decision.returnedAmount.toLocaleString("en-SG")} was returned to your ${decision.sourceAccount}.`
      : `${opportunity.title} has been applied successfully.`,
    timestamp: decision.decidedAt,
    sortTimestamp: decision.decidedAt,
    lifecycleGroup: `opportunity-${opportunity.id}`,
    lifecycleStep: 2,
    status: "completed",
  });
  return events.map((event) => ({ ...event, timestamp: normalizeTimestamp(event.timestamp) }));
}

export function getPlanActivity({ plan, opportunity, decision, opportunityLifecycle, runtimeEvents = [] }) {
  if (!plan || !plan.id) return [];
  const byId = new Map();
  [...buildSeededPlanActivity(plan, opportunity, decision, opportunityLifecycle), ...(runtimeEvents || [])]
    .filter((event) => {
      if (!event || event.planId !== plan.id) return false;
      const timestamp = dateValue(event.timestamp);
      return timestamp === 0 || timestamp <= Date.now();
    })
    .forEach((event) => {
      const existing = byId.get(event.id);
      byId.set(event.id, {
        ...existing,
        ...event,
        timestamp: normalizeTimestamp(event.timestamp),
      });
    });
  return [...byId.values()].sort((a, b) => {
    const aDate = dateValue(a.sortTimestamp ?? a.timestamp);
    const bDate = dateValue(b.sortTimestamp ?? b.timestamp);
    if (aDate !== bDate) return bDate - aDate;

    if (a.lifecycleGroup && a.lifecycleGroup === b.lifecycleGroup) {
      return (b.lifecycleStep ?? 0) - (a.lifecycleStep ?? 0);
    }

    const lifecycleRank = (event) => {
      if (event.type === "completion") return 6;
      if (event.type === "milestone") return 5;
      if (["adjustment", "saving"].includes(event.type) || event.status === "completed") return 4;
      if (["accepted", "declined"].includes(event.status) || event.type === "decision") return 3;
      if (["identified", "needs review", "assessed"].includes(event.status)) return 2;
      if (event.type === "created") return 1;
      return 0;
    };
    const rankDifference = lifecycleRank(b) - lifecycleRank(a);
    return rankDifference || String(b.id).localeCompare(String(a.id));
  });
}
