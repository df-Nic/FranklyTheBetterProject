import { formatSGD, getCurrentMilestoneIndex } from "./milestonePlans.js";

const NEUTRAL_OUTCOME = "your financial goal";

function lowerFirst(value = "") {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function monthlyDelta(nextStep) {
  const amount = Number(String(nextStep?.delta ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(amount) ? Math.abs(amount) : null;
}

function buildProgressMessage(plan, onTrack) {
  const delta = formatSGD(onTrack.deltaAmount);
  const date = plan.goalDate;

  if (onTrack.ahead) {
    return `You’re ${delta} ahead of the pace for ${date}. That extra room can help absorb an uneven month without moving your goal date.`;
  }

  if (onTrack.onTrack) {
    return `You’re ${delta} below the pace for ${date}, and still within the plan’s normal buffer. A small adjustment can bring the next milestone closer without changing the whole plan.`;
  }

  return `You’re ${delta} below the pace for ${date}. The plan can focus first on the smallest adjustment that improves your path forward.`;
}

function buildReflection(plan) {
  const milestones = plan.milestones ?? [];
  const latest = milestones[getCurrentMilestoneIndex(milestones)];
  const next = milestones.find((milestone) => milestone.state === "next");
  const outcome = plan.personalContext?.desiredOutcome ?? NEUTRAL_OUTCOME;

  const achieved = latest
    ? `You’ve reached ${latest.name}. That is another concrete step toward ${outcome}.`
    : `Your journey toward ${outcome} is underway.`;

  const lookingAhead = next
    ? `Next is ${next.name} by ${next.date}.`
    : "Your planned milestones are complete.";

  return { achieved, lookingAhead };
}

function buildNextAction(plan) {
  const nextStep = plan.nextStep ?? {};
  const amount = monthlyDelta(nextStep);
  const amountLabel = amount === null ? null : `${formatSGD(amount)}/month`;
  const impact = nextStep.detail
    ? `it could help you ${lowerFirst(nextStep.detail).replace(/[.]$/, "")}.`
    : "it can strengthen the path to your next milestone.";

  return {
    eyebrow: "A manageable next move",
    title: nextStep.title ? `One option: ${lowerFirst(nextStep.title)}` : "Review your next adjustment",
    amountLabel,
    detail: amountLabel
      ? `If ${amountLabel} more still feels comfortable, ${impact}`
      : impact.charAt(0).toUpperCase() + impact.slice(1),
    cta: "Review this adjustment",
  };
}

export function buildPersonalizedPlanCopy({ plan, userName, onTrack }) {
  const outcome = plan.personalContext?.desiredOutcome ?? NEUTRAL_OUTCOME;
  const name = userName?.trim();

  return {
    introduction: name
      ? `${name}, you’re building toward ${outcome}.`
      : `You’re building toward ${outcome}.`,
    progressMessage: buildProgressMessage(plan, onTrack),
    statusLabel: onTrack.ahead
      ? "Ahead of pace"
      : onTrack.onTrack
        ? "Close to plan"
        : "Let’s adjust the pace",
    reflection: buildReflection(plan),
    nextAction: buildNextAction(plan),
  };
}
