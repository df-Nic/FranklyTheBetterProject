import { formatSGD, getCurrentMilestoneIndex } from "./milestonePlans.js";

const NEUTRAL_OUTCOME = "your financial goal";

function buildProgressMessage(plan, onTrack) {
  const delta = formatSGD(onTrack.deltaAmount);
  const date = plan.goalDate;

  if (onTrack.status === "new") {
    return `Your plan is ready. Progress tracking will begin with your first contribution toward ${date}.`;
  }
  if (onTrack.ahead) {
    return `You’re ${delta} ahead of the pace for ${date}. That extra room can help absorb an uneven month without moving your goal date.`;
  }
  if (onTrack.status === "on-track") {
    return `You’re exactly on the saving pace needed for ${date}. Keep following the planned contribution schedule.`;
  }
  if (onTrack.status === "close") {
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

function buildEmotionalProgressMessage(plan, onTrack, prefix) {
  const focusByPlan = {
    "wedding-fund": "the celebration you want without putting pressure on the life that follows",
    retirement: "a future with more freedom and fewer financial worries",
    housing: "the security and breathing room of having a home of your own",
    savings: "the security and breathing room of having a home of your own",
    emergency: "the confidence to handle surprises without disrupting everyday life",
    "career-break": "the freedom to take your break without carrying financial worry into it",
    "parents-retirement": "greater comfort and security for your parents",
    default: "the future you want with less financial uncertainty",
  };

  if (plan.id === "children-education") {
    if (onTrack.status === "new") {
      return `${prefix}your education plan is ready. Progress will become clearer after the first contribution, with each milestone reflecting the learning stages you selected.`;
    }
    if (onTrack.ahead) {
      return `${prefix}you’re giving your child’s future more possibilities with every contribution. You’re already ahead of pace—keep going, because steady progress today means greater choice at the education stages ahead.`;
    }
    if (onTrack.onTrack) {
      return `${prefix}every contribution is helping turn your hopes for your child’s education into something real. You’re within reach of the pace you need, and staying steady now will give your family more choices later.`;
    }
    return `${prefix}this goal may need a little more attention, but the future you’re building for your child is still within reach. One manageable step now can restore momentum and preserve more education choices later.`;
  }

  const focus = focusByPlan[plan.id] || plan.personalContext?.desiredOutcome || focusByPlan.default;
  if (onTrack.status === "new") {
    return `${prefix}your plan for ${focus} is ready. Progress tracking will begin after your first contribution, giving you a clear starting point without a premature performance label.`;
  }
  if (onTrack.ahead) {
    return `${prefix}the steady choices you’re making are bringing you closer to ${focus}. You’re ahead of pace—keep going, because that extra breathing room gives you more choice when it matters.`;
  }
  if (onTrack.onTrack) {
    return `${prefix}you’re turning ${focus} into something achievable, one steady step at a time. You’re within reach of the pace you need, and consistency now will make the road ahead feel lighter.`;
  }
  return `${prefix}${focus} is still within reach, even if this plan needs a little more attention today. One manageable step can restore momentum without asking you to solve everything at once.`;
}

export function buildPersonalizedPlanCopy({
  plan, userName, onTrack, recentActivity, decision, wasHealed = false,
}) {
  const outcome = plan.personalContext?.desiredOutcome ?? NEUTRAL_OUTCOME;
  const name = userName?.trim();
  const prefix = name ? `${name}, ` : "";
  let situation = onTrack.status;
  let introduction = buildEmotionalProgressMessage(plan, onTrack, prefix);

  if (recentActivity?.type === "milestone") {
    situation = "milestone-completed";
    introduction = `${prefix}${recentActivity.title} is complete—a meaningful step toward ${outcome}. Take a moment to recognise that progress, then carry the momentum into what comes next.`;
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
    statusLabel: onTrack.status === "new"
      ? "Getting started"
      : onTrack.status === "ahead"
        ? "Ahead of pace"
        : onTrack.status === "on-track"
          ? "On pace"
          : onTrack.status === "close"
            ? "Slightly behind"
            : "Behind schedule",
    reflection: buildReflection(plan),
  };
}
