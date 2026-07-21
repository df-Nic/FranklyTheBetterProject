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
    betterAlternatives: 2,
  },

  nextStep: {
    title: "Increase monthly savings",
    delta: "+$120/month",
    detail: "Reach \u201cFinal Payment Ready\u201d 2 months earlier",
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
  impact: { additionalSavings: 9200, timeSaved: "8.4 hrs", betterAlternatives: 3 },
  nextStep: {
    title: "Top up your SRS contribution",
    delta: "+S$300/month",
    detail: "Reach 25% Funded around 4 months earlier",
  },
};

const savingsPlan = {
  id: "savings",
  goalName: "HDB Downpayment",
  targetAmount: 150000,
  goalDate: "Mar 2028",
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
    { id: "initial", name: "Initial Deposit Ready", date: "Oct 2026", state: "completed" },
    { id: "quarter", name: "25% Funded", date: "Jan 2027", state: "next" },
    { id: "halfway", name: "Halfway Funded", date: "Jul 2027", state: "upcoming" },
    { id: "ready", name: "Downpayment Ready", date: "Mar 2028", state: "goal" },
  ],
  impact: { additionalSavings: 1860, timeSaved: "5.2 hrs", betterAlternatives: 3 },
  nextStep: {
    title: "Increase your monthly transfer",
    delta: "+S$250/month",
    detail: "Reach 25% Funded around 1 month earlier",
  },
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
  impact: { additionalSavings: 780, timeSaved: "3.8 hrs", betterAlternatives: 2 },
  nextStep: {
    title: "Enable monthly balance sweeps",
    delta: "+S$200/month",
    detail: "Close the current funding gap this quarter",
  },
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
  impact: { additionalSavings: 2460, timeSaved: "6.7 hrs", betterAlternatives: 3 },
  nextStep: {
    title: "Automate your monthly investment",
    delta: "+S$100/month",
    detail: "Reach 50% Funded around 2 months earlier",
  },
};

// Registry so a page can resolve a plan by id (extend as more goals are created).
export const MILESTONE_PLANS = {
  retirement: retirementPlan,
  savings: savingsPlan,
  emergency: emergencyPlan,
  default: defaultPlan,
  [weddingFundPlan.id]: weddingFundPlan,
};

export function getMilestonePlan(planId) {
  return MILESTONE_PLANS[planId] ?? defaultPlan;
}

// ---- helpers ----

export function formatSGD(amount) {
  const whole = Math.round(amount).toString();
  return "S$" + whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Derive the on-track headline from expected vs saved.
export function deriveOnTrack({ expected, saved }) {
  const diff = saved - expected;
  const ahead = diff >= 0;
  return {
    ahead,
    onTrack: ahead || Math.abs(diff) <= expected * 0.05, // small tolerance band
    expected,
    saved,
    deltaAmount: Math.abs(diff),
    deltaLabel: `${formatSGD(Math.abs(diff))} ${ahead ? "ahead of" : "behind"} schedule`,
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

export function getCurrentMilestoneIndex(milestones) {
  // Legacy compatibility: older data used `current` for the owl position.
  const legacyCurrent = milestones.findIndex((milestone) => milestone.state === "current");
  if (legacyCurrent >= 0) return legacyCurrent;
  for (let index = milestones.length - 1; index >= 0; index -= 1) {
    if (milestones[index].state === "completed") return index;
  }
  return 0;
}
