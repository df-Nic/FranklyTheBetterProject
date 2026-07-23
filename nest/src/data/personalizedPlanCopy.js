import { formatSGD, getCurrentMilestoneIndex } from "./milestonePlans.js";

const NEUTRAL_OUTCOME = "your financial goal";

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
  };
}
