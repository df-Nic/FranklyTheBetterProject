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

export function buildPersonalizedPlanCopy({ plan, userName, onTrack, recentActivity, decision, wasHealed = false }) {
  const outcome = plan.personalContext?.desiredOutcome ?? NEUTRAL_OUTCOME;
  const name = userName?.trim();
  const prefix = name ? `${name}, ` : "";
  const latestCompleted = plan.milestones?.filter((item) => item.state === "completed").at(-1);
  let situation = onTrack.ahead ? "ahead" : onTrack.onTrack ? "close" : "behind";
  let introduction = onTrack.ahead
    ? `${prefix}you’ve built valuable breathing room. Keep your next contribution steady to protect it.`
    : onTrack.onTrack
      ? `${prefix}you’re still within reach of your plan. One steady contribution keeps the next milestone moving closer.`
      : `${prefix}this plan is behind pace, but it is recoverable. Start with the smallest adjustment that closes the gap.`;

  if (latestCompleted) {
    situation = "milestone-completed";
    introduction = `${prefix}${latestCompleted.name} is complete—a real step toward ${outcome}. Keep that momentum on the next milestone.`;
  }
  if (wasHealed || recentActivity?.type === "adjustment") {
    situation = "adjusted";
    introduction = `${prefix}your plan has adapted to the latest change. Review the new path, then keep the next contribution on course.`;
  } else if (decision?.status === "accepted") {
    situation = "opportunity-accepted";
    introduction = `${prefix}your approved opportunity is now strengthening this plan. The next step is simply to stay consistent.`;
  } else if (decision?.status === "declined") {
    situation = "opportunity-declined";
    introduction = `${prefix}you kept the plan you know. That clarity matters—continue with the next scheduled step.`;
  } else if (recentActivity?.type === "opportunity") {
    situation = "opportunity-identified";
    introduction = `${prefix}Agent Owl found a possible improvement. Review the trade-offs before deciding whether it belongs in your plan.`;
  }

  return {
    introduction,
    situation,
    progressMessage: buildProgressMessage(plan, onTrack),
    statusLabel: onTrack.ahead
      ? "Ahead of pace"
      : onTrack.onTrack
        ? "Close to plan"
        : "Let’s adjust the pace",
    reflection: buildReflection(plan),
  };
}
