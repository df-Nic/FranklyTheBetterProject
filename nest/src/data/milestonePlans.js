// src/data/milestonePlans.js
// Data-driven source for the per-goal milestones page. Each plan renders its own
// mountain journey. Seeded with the Wedding Fund to match the reference design.
//
// Milestone states: 'completed' | 'next' | 'upcoming' | 'goal'
// Milestones are ordered BASE -> SUMMIT (first = Goal Created, last = the goal).

export const weddingFundPlan = {
  id: "wedding-fund",
  goalName: "Wedding Fund",
  targetAmount: 35000,
  goalDate: "15 Dec 2027",
  monthlyContribution: 1200,
  planType: "Goal savings",
  strategy: "Automated monthly savings",
  personalContext: {
    motivation: "Celebrate without beginning married life under financial pressure.",
    desiredOutcome: "a wedding funded with room for the life that follows",
    priority: "balance",
    flexibility: "some",
  },

  // Time-adjusted status (see MD: compares actual vs expected-by-today).
  onTrack: {
    expected: 22000, // what you should have saved by today
    saved: 23800, // what you've actually saved
  },

  // Base -> summit. 3–6 entries; the last one is the goal itself.
  milestones: [
    { id: "created", name: "Goal Created", date: "2 Jan 2026", state: "completed" },
    { id: "initial", name: "Initial Funding Ready", date: "28 Feb 2026", state: "completed" },
    { id: "halfway", name: "Halfway Funded", date: "30 Jun 2026", state: "completed" },
    { id: "final", name: "Final Payment Ready", date: "30 Sep 2027", state: "next" },
    { id: "goal", name: "Wedding Day!", date: "15 Dec 2027", state: "goal" },
  ],

  // Agent Owl Impact — every figure must trace to a recorded intervention.
  impact: {
    additionalSavings: 384,
    timeSaved: "6.1 hrs",
    opportunitiesActedOn: 2,
  },
};

const retirementPlan = {
  id: "retirement",
  goalName: "Retirement Strategy",
  targetAmount: 1500000,
  goalDate: "Oct 2045",
  monthlyContribution: 2400,
  planType: "Long-term retirement",
  strategy: "CPF, SRS and diversified investments",
  personalContext: {
    motivation: "Have more choice over time and commitments later in life.",
    desiredOutcome: "more choice over how to spend your future",
    priority: "certainty",
    flexibility: "some",
  },
  onTrack: { expected: 84000, saved: 89200 },
  milestones: [
    { id: "created", name: "Goal Created", date: "21 Jul 2026", state: "completed" },
    { id: "foundation", name: "Foundation Funded", date: "Oct 2028", state: "completed" },
    { id: "quarter", name: "25% Funded", date: "Jun 2032", state: "next" },
    { id: "halfway", name: "Halfway Funded", date: "Mar 2038", state: "upcoming" },
    { id: "income", name: "Retirement Income Ready", date: "Oct 2045", state: "goal" },
  ],
  impact: { additionalSavings: 9200, timeSaved: "8.4 hrs", opportunitiesActedOn: 3 },
};

const savingsPlan = {
  id: "savings",
  goalName: "HDB Downpayment",
  targetAmount: 500000,
  goalDate: "Aug 2030",
  monthlyContribution: 2500,
  planType: "Home purchase",
  strategy: "Cash savings, CPF grants and low-risk yield",
  personalContext: {
    motivation: "Create a first home without giving up financial breathing room.",
    desiredOutcome: "a first home with financial breathing room",
    priority: "flexibility",
    flexibility: "some",
  },
  onTrack: { expected: 31500, saved: 32800 },
  milestones: [
    { id: "created", name: "Goal Created", date: "21 Jul 2026", state: "completed" },
    { id: "initial", name: "Initial Deposit Ready", date: "Jul 2026", amount: 40000, state: "next" },
    { id: "quarter", name: "25% Funded", date: "Jan 2028", amount: 125000, state: "upcoming" },
    { id: "halfway", name: "Halfway Funded", date: "Jul 2029", amount: 250000, state: "upcoming" },
    { id: "ready", name: "Downpayment Ready", date: "Aug 2030", amount: 500000, state: "goal" },
  ],
  impact: { additionalSavings: 1860, timeSaved: "5.2 hrs", opportunitiesActedOn: 3 },
};

const housingPlan = {
  ...savingsPlan,
  id: "housing",
  goalName: "OCBC HDB Housing Plan",
  milestones: savingsPlan.milestones.map((milestone) => ({ ...milestone })),
};

const emergencyPlan = {
  id: "emergency",
  goalName: "Emergency Safety Net",
  targetAmount: 30000,
  goalDate: "Dec 2026",
  monthlyContribution: 4000,
  planType: "Emergency fund",
  strategy: "Liquid savings and monthly cash-flow sweeps",
  personalContext: {
    motivation: "Handle unexpected expenses without disrupting everyday life.",
    desiredOutcome: "handling unexpected expenses without disrupting everyday life",
    priority: "certainty",
    flexibility: "limited",
  },
  onTrack: { expected: 12000, saved: 11600 },
  milestones: [
    { id: "created", name: "Goal Created", date: "21 Jul 2026", state: "completed" },
    { id: "one-month", name: "1 Month Covered", date: "Aug 2026", state: "completed" },
    { id: "three-months", name: "3 Months Covered", date: "Oct 2026", state: "next" },
    { id: "six-months", name: "6-Month Safety Net", date: "Dec 2026", state: "goal" },
  ],
  impact: { additionalSavings: 780, timeSaved: "3.8 hrs", opportunitiesActedOn: 2 },
};

const defaultPlan = {
  id: "default",
  goalName: "Wealth Builder",
  targetAmount: 100000,
  goalDate: "Jan 2030",
  monthlyContribution: 900,
  planType: "Investment portfolio",
  strategy: "Automated savings and diversified investing",
  personalContext: {
    motivation: "Grow wealth steadily without taking on uncomfortable risk.",
    desiredOutcome: "steady growth within a risk level that suits you",
    priority: "low risk",
    flexibility: "some",
  },
  onTrack: { expected: 18000, saved: 19250 },
  milestones: [
    { id: "created", name: "Goal Created", date: "21 Jul 2026", state: "completed" },
    { id: "quarter", name: "25% Funded", date: "May 2027", state: "completed" },
    { id: "halfway", name: "Halfway Funded", date: "Jun 2028", state: "next" },
    { id: "three-quarter", name: "75% Funded", date: "Jul 2029", state: "upcoming" },
    { id: "goal", name: "Portfolio Goal Reached", date: "Jan 2030", state: "goal" },
  ],
  impact: { additionalSavings: 2460, timeSaved: "6.7 hrs", opportunitiesActedOn: 3 },
};

const childrenEducationPlan = {
  id: "children-education",
  goalName: "Children's Education",
  targetAmount: 80000,
  goalDate: "Oct 2035",
  monthlyContribution: 500,
  planType: "Education savings",
  strategy: "High-yield savings and investments",
  personalContext: {
    motivation: "Provide the best academic start without severe financial sacrifice.",
    desiredOutcome: "education costs funded for the learning stages you selected",
    priority: "balance",
    flexibility: "some",
  },
  onTrack: { expected: 12000, saved: 13500 },
  milestones: [
    { id: "created", name: "Goal Created", date: "2 Jan 2026", state: "completed" },
    { id: "savings-start", name: "First S$10k Saved", date: "15 Apr 2026", state: "completed" },
    { id: "halfway", name: "Halfway to Education Target", date: "Jun 2031", state: "next" },
    { id: "final-stretch", name: "Final Education Reserve Ready", date: "Jan 2034", state: "upcoming" },
    { id: "goal", name: "Education Fund Ready", date: "Oct 2035", state: "goal" },
  ],
  impact: { additionalSavings: 3800, timeSaved: "4.8 hrs", opportunitiesActedOn: 2 },
};

const careerBreakPlan = {
  id: "career-break",
  goalName: "Career Break Fund",
  targetAmount: 25000,
  goalDate: "Jun 2028",
  monthlyContribution: 800,
  planType: "Short-term savings",
  strategy: "Liquid savings and sweeps",
  personalContext: {
    motivation: "Take a sabbatical or transition careers with secure financial backing.",
    desiredOutcome: "six months of comfortable expenses covered during a break",
    priority: "flexibility",
    flexibility: "some",
  },
  onTrack: { expected: 6400, saved: 6900 },
  milestones: [
    { id: "created", name: "Goal Created", date: "21 Jul 2026", state: "completed" },
    { id: "one-month", name: "1 Month Covered", date: "Nov 2026", state: "completed" },
    { id: "halfway", name: "Halfway there", date: "May 2027", state: "next" },
    { id: "goal", name: "Career Break Commences!", date: "Jun 2028", state: "goal" },
  ],
  impact: { additionalSavings: 540, timeSaved: "3.2 hrs", opportunitiesActedOn: 1 },
};

const parentsRetirementPlan = {
  id: "parents-retirement",
  goalName: "Parents' Retirement",
  targetAmount: 120000,
  goalDate: "Dec 2032",
  monthlyContribution: 1000,
  planType: "Elderly support",
  strategy: "CPF top-ups and defense plans",
  personalContext: {
    motivation: "Support parents' post-work life and medical needs stress-free.",
    desiredOutcome: "a solid security buffer for parents' medical and living bills",
    priority: "certainty",
    flexibility: "some",
  },
  onTrack: { expected: 18000, saved: 19800 },
  milestones: [
    { id: "created", name: "Goal Created", date: "21 Jul 2026", state: "completed" },
    { id: "cpf-link", name: "CPF Account Linked", date: "Oct 2026", state: "completed" },
    { id: "halfway", name: "Halfway Funded", date: "Jul 2029", state: "next" },
    { id: "goal", name: "Security Milestone Achieved!", date: "Dec 2032", state: "goal" },
  ],
  impact: { additionalSavings: 2200, timeSaved: "6.5 hrs", opportunitiesActedOn: 2 },
};

// Registry so a page can resolve a plan by id (extend as more goals are created).
export const MILESTONE_PLANS = {
  retirement: retirementPlan,
  housing: housingPlan,
  savings: savingsPlan,
  emergency: emergencyPlan,
  default: defaultPlan,
  [weddingFundPlan.id]: weddingFundPlan,
  'children-education': childrenEducationPlan,
  'career-break': careerBreakPlan,
  'parents-retirement': parentsRetirementPlan,
};

export function getMilestonePlan(planId, adjustments) {
  const basePlan = MILESTONE_PLANS[planId] ?? defaultPlan;
  if (adjustments && adjustments[planId]) {
    const adj = adjustments[planId];
    let updatedPlan = {
      ...basePlan,
      ...adj
    };

    if (adj.strategy === 'timeline') {
      updatedPlan.milestones = basePlan.milestones.map((m, idx) => {
        if (idx === basePlan.milestones.length - 1) {
          return { ...m, date: adj.goalDate };
        }
        return m;
      });
    } else if (adj.strategy === 'yield') {
      updatedPlan.strategy = "OCBC High-Yield reallocation active (4.65% p.a.)";
    } else if (adj.strategy === 'sweep') {
      updatedPlan.strategy = "Cashback sweeps active (S$85/mo auto-sweep)";
    }

    return updatedPlan;
  }
  return basePlan;
}

// ---- helpers ----

export function formatSGD(amount) {
  const whole = Math.round(amount).toString();
  return "S$" + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Derive the on-track headline from expected vs saved.
export function deriveOnTrack({ expected, saved }) {
  const diff = saved - expected;
  const isNew = expected === 0 && saved === 0;
  const ahead = !isNew && diff > 0;
  const withinBuffer = !isNew && diff < 0 && Math.abs(diff) <= expected * 0.05;
  const status = isNew
    ? "new"
    : ahead
      ? "ahead"
      : diff === 0
        ? "on-track"
        : withinBuffer
          ? "close"
          : "behind";
  const deltaLabel = status === "new"
    ? "Awaiting first contribution"
    : status === "on-track"
      ? "Right on schedule"
      : status === "ahead"
        ? `${formatSGD(Math.abs(diff))} ahead of schedule`
        : status === "close"
          ? `${formatSGD(Math.abs(diff))} slightly behind`
          : `${formatSGD(Math.abs(diff))} behind schedule`;
  return {
    status,
    isNew,
    ahead,
    onTrack: ["ahead", "on-track", "close"].includes(status),
    expected,
    saved,
    deltaAmount: Math.abs(diff),
    deltaLabel,
  };
}

// Normalized positions following the illustrated road, ordered base -> summit.
// Labels alternate across the road and remain within the mobile viewport.
export const JOURNEY_POINTS = [
  { x: 42, y: 92, labelSide: "right" },
  { x: 48, y: 79, labelSide: "left" },
  { x: 46, y: 67, labelSide: "right" },
  { x: 52, y: 55, labelSide: "left" },
  { x: 47, y: 44, labelSide: "right" },
  { x: 50, y: 35, labelSide: "left" },
  { x: 51, y: 28, labelSide: "right" },
];

export function getJourneyPosition(index, count) {
  if (count <= 1) return JOURNEY_POINTS[0];
  const scaled = (index / (count - 1)) * (JOURNEY_POINTS.length - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(Math.ceil(scaled), JOURNEY_POINTS.length - 1);
  const mix = scaled - lower;
  const a = JOURNEY_POINTS[lower];
  const b = JOURNEY_POINTS[upper];
  return {
    x: a.x + (b.x - a.x) * mix,
    y: a.y + (b.y - a.y) * mix,
    labelSide: index % 2 === 0 ? "right" : "left",
  };
}

export function getJourneyProgressPosition(progress = 0) {
  const clamped = Math.min(1, Math.max(0, Number(progress) || 0));
  const scaled = clamped * (JOURNEY_POINTS.length - 1);
  const lower = Math.floor(scaled);
  const upper = Math.min(Math.ceil(scaled), JOURNEY_POINTS.length - 1);
  const mix = scaled - lower;
  const a = JOURNEY_POINTS[lower];
  const b = JOURNEY_POINTS[upper];
  return {
    x: a.x + (b.x - a.x) * mix,
    y: a.y + (b.y - a.y) * mix,
  };
}

export function getFundingJourneyProgress(milestones, savedAmount, targetAmount) {
  const fallback = Math.min(1, Math.max(0, savedAmount / Math.max(targetAmount || 0, 1)));
  if (!milestones?.length || !milestones.some((milestone) => Number.isFinite(milestone.amount))) {
    return fallback;
  }

  const thresholds = milestones
    .map((milestone, index) => ({
      index,
      amount: Number.isFinite(milestone.amount) ? milestone.amount : index === 0 ? 0 : null,
    }))
    .filter((milestone) => milestone.amount !== null);
  if (thresholds.length < 2) return fallback;
  if (savedAmount >= thresholds[thresholds.length - 1].amount) return 1;

  for (let index = 1; index < thresholds.length; index += 1) {
    const previous = thresholds[index - 1];
    const next = thresholds[index];
    if (savedAmount <= next.amount) {
      const segmentSize = Math.max(1, next.amount - previous.amount);
      const segmentProgress = Math.min(1, Math.max(0, (savedAmount - previous.amount) / segmentSize));
      const visualIndex = previous.index + (next.index - previous.index) * segmentProgress;
      return visualIndex / Math.max(milestones.length - 1, 1);
    }
  }
  return fallback;
}

export function applyFundingMilestoneStates(milestones, savedAmount) {
  if (!milestones.some((milestone) => Number.isFinite(milestone.amount))) {
    return milestones.map((milestone) => ({ ...milestone }));
  }
  let nextAssigned = false;
  return milestones.map((milestone, index) => {
    if (!Number.isFinite(milestone.amount)) return { ...milestone };
    if (savedAmount >= milestone.amount) return { ...milestone, state: "completed" };
    const isGoal = index === milestones.length - 1 || milestone.state === "goal";
    if (isGoal) return { ...milestone, state: "goal" };
    if (!nextAssigned) {
      nextAssigned = true;
      return { ...milestone, state: "next" };
    }
    return { ...milestone, state: "upcoming" };
  });
}

export function getCurrentMilestoneIndex(milestones) {
  // Legacy compatibility: older data used `current` for the owl position.
  const legacyCurrent = milestones.findIndex((milestone) => milestone.state === "current");
  if (legacyCurrent >= 0) return legacyCurrent;
  for (let index = milestones.length - 1; index >= 0; index -= 1) {
    if (milestones[index].state === "completed") return index;
  }
  return 0;
}
