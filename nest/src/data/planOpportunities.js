export const PLAN_OPPORTUNITIES = {
  savings: {
    id: "hdb-flexi-deposit",
    status: "active",
    title: "Earn more while keeping your downpayment accessible",
    summary: "A new flexible deposit rate became available for the accessible savings already held in your plan.",
    triggerType: "New product",
    trigger: "OCBC Flexi Deposit introduced a 3.20% p.a. tier for balances held for at least six months.",
    detectedDate: "23 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "30 Sep 2026",
    benefitType: "Greater yield with liquidity",
    benefitLabel: "+S$420 estimated interest",
    benefitValue: "S$420",
    benefitCaption: "Potential additional interest",
    benefitContext: "Without changing your monthly contribution or goal date.",
    relevance: [
      "Your plan keeps S$20,000 in low-risk savings for a March 2028 purchase.",
      "You prioritised flexibility, so the option preserves access with no fixed lock-in period.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$2,500", proposed: "S$2,500" },
      { label: "Accessible savings rate", current: "2.15% p.a.", proposed: "3.20% p.a." },
      { label: "Estimated interest", current: "S$860", proposed: "S$1,280" },
      { label: "Goal date", current: "Mar 2028", proposed: "Mar 2028" },
    ],
    assumptions: ["S$20,000 remains in the account for 20 months.", "The promotional rate remains available under the stated conditions."],
    tradeoffs: ["The bonus rate requires a minimum S$500 monthly credit.", "Rates may change after the promotional period."],
    eligibility: { status: "verified", label: "Verified", detail: "Your current balance and monthly transfer meet the published conditions." },
    source: "OCBC Flexi Deposit product terms",
    planChanges: {
      strategy: "Cash savings, CPF grants and flexible higher-yield deposits",
    },
  },
  emergency: {
    id: "emergency-liquid-bonus",
    status: "active",
    title: "Add a higher rate without locking away your safety net",
    summary: "A new liquid savings tier became available for the funds already held in your safety net.",
    triggerType: "Rate change",
    trigger: "The liquid savings bonus tier increased from 1.80% to 2.40% p.a.",
    detectedDate: "22 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "31 Oct 2026",
    benefitType: "Improved liquidity yield",
    benefitLabel: "+S$180 estimated annual interest",
    benefitValue: "S$180",
    benefitCaption: "Potential additional interest each year",
    benefitContext: "While preserving immediate access to your emergency funds.",
    relevance: [
      "Your plan keeps S$30,000 immediately accessible for unexpected expenses.",
      "You prioritised certainty and have limited contribution flexibility, so no extra transfer is required.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$4,000", proposed: "S$4,000" },
      { label: "Withdrawal access", current: "Immediate", proposed: "Immediate" },
      { label: "Savings rate", current: "1.80% p.a.", proposed: "2.40% p.a." },
      { label: "Estimated annual interest", current: "S$540", proposed: "S$720" },
    ],
    assumptions: ["The average eligible balance remains S$30,000.", "Account conditions continue to be met."],
    tradeoffs: ["The bonus tier requires salary crediting.", "The interest rate is variable and may change."],
    eligibility: { status: "verified", label: "Verified", detail: "Your linked salary credit and balance meet the current conditions." },
    source: "OCBC liquid savings rate schedule",
    planChanges: {
      strategy: "Liquid higher-yield savings and monthly cash-flow sweeps",
    },
  },
  retirement: {
    id: "retirement-lower-fee-fund",
    status: "active",
    title: "Lower the ongoing cost of your retirement portfolio",
    summary: "A lower-cost share class is now available for the diversified allocation already used by your plan.",
    triggerType: "New product",
    trigger: "A lower-cost share class became available for the same diversified allocation.",
    detectedDate: "21 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "31 Dec 2026",
    benefitType: "Lower ongoing cost",
    benefitLabel: "S$460 lower estimated annual fees",
    benefitValue: "S$460",
    benefitCaption: "Potential annual fee reduction",
    benefitContext: "Without changing your contribution or portfolio risk band.",
    relevance: [
      "Your retirement allocation already uses the same underlying diversified strategy.",
      "You prioritised certainty, so the proposed allocation keeps the same risk band and contribution.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$2,400", proposed: "S$2,400" },
      { label: "Portfolio risk band", current: "Balanced", proposed: "Balanced" },
      { label: "Annual fee", current: "0.82%", proposed: "0.56%" },
      { label: "Estimated annual fees", current: "S$1,460", proposed: "S$1,000" },
    ],
    assumptions: ["The compared invested balance remains approximately S$178,000.", "Underlying allocation weights remain unchanged."],
    tradeoffs: ["Switching may keep funds out of market for up to one business day.", "Future fund expenses can change."],
    eligibility: { status: "verified", label: "Verified", detail: "Your portfolio value meets the share-class minimum." },
    source: "OCBC investment platform fee schedule",
    planChanges: {
      strategy: "CPF, SRS and lower-cost diversified investments",
    },
  },
  default: {
    id: "wealth-diversification-update",
    status: "active",
    title: "Broaden diversification within your existing risk level",
    summary: "A new diversified allocation can reduce concentration while keeping your monthly investment and risk preference unchanged.",
    triggerType: "Portfolio update",
    trigger: "A low-volatility global bond fund was added to the available portfolio range.",
    detectedDate: "20 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "30 Nov 2026",
    benefitType: "Improved risk alignment",
    benefitLabel: "12% lower concentration",
    benefitValue: "12%",
    benefitCaption: "Lower top-two concentration",
    benefitContext: "While keeping your monthly investment and risk preference unchanged.",
    relevance: [
      "Your current portfolio has 42% concentrated in two holdings.",
      "You prioritised lower risk, so the proposal diversifies rather than increasing equity exposure.",
    ],
    comparisons: [
      { label: "Monthly investment", current: "S$900", proposed: "S$900" },
      { label: "Risk band", current: "Conservative", proposed: "Conservative" },
      { label: "Top-two concentration", current: "42%", proposed: "30%" },
      { label: "Liquidity", current: "3–5 days", proposed: "3–5 days" },
    ],
    assumptions: ["The current portfolio weights are unchanged from the latest review.", "The new fund remains within the conservative model allocation."],
    tradeoffs: ["Diversification may reduce gains if the current largest holdings outperform.", "Rebalancing creates a short period out of market."],
    eligibility: { status: "verified", label: "Verified", detail: "The fund is available for your account and portfolio size." },
    source: "OCBC model portfolio catalogue",
    planChanges: {
      strategy: "Automated savings and broader diversified investing",
    },
  },
  "wedding-fund": {
    id: "wedding-goal-rate",
    status: "active",
    title: "Earn more on funds set aside for upcoming payments",
    summary: "A new goal-savings rate became available for the balance already set aside for upcoming payments.",
    triggerType: "New savings tier",
    trigger: "A 2.80% p.a. goal-savings tier became available for balances above S$10,000.",
    detectedDate: "22 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "31 Oct 2026",
    benefitType: "Lower funding pressure",
    benefitLabel: "+S$144 estimated interest",
    benefitValue: "S$144",
    benefitCaption: "Potential additional interest",
    benefitContext: "Without increasing your contribution or changing payment access.",
    relevance: [
      "Your wedding fund balance exceeds the new tier's S$10,000 minimum.",
      "You prioritised balance, so the option does not increase your monthly contribution or add a lock-in.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$1,200", proposed: "S$1,200" },
      { label: "Savings rate", current: "1.60% p.a.", proposed: "2.80% p.a." },
      { label: "Estimated interest", current: "S$192", proposed: "S$336" },
      { label: "Payment access", current: "Immediate", proposed: "Immediate" },
    ],
    assumptions: ["An average S$12,000 remains eligible for 12 months.", "The tier conditions continue to be met."],
    tradeoffs: ["The rate requires the existing automated monthly contribution.", "The interest rate is variable."],
    eligibility: { status: "verified", label: "Verified", detail: "Your balance and automated contribution meet the current tier conditions." },
    source: "OCBC Goal Savings product terms",
    planChanges: {
      strategy: "Automated monthly savings with enhanced goal-account yield",
      onTrackSavedDelta: 144,
    },
  },
};

export function getPlanOpportunity(planId) {
  return PLAN_OPPORTUNITIES[planId] ?? PLAN_OPPORTUNITIES.default;
}

export function applyOpportunityChanges(plan, opportunity, decision) {
  if (!opportunity || decision?.status !== "accepted") return plan;
  const changes = opportunity.planChanges ?? {};
  const milestoneDates = changes.milestoneDates ?? {};
  return {
    ...plan,
    ...(changes.goalDate ? { goalDate: changes.goalDate } : {}),
    ...(changes.monthlyContribution ? { monthlyContribution: changes.monthlyContribution } : {}),
    ...(changes.strategy ? { strategy: changes.strategy } : {}),
    onTrack: { ...plan.onTrack },
    milestones: plan.milestones.map((milestone) => (
      milestoneDates[milestone.id] ? { ...milestone, date: milestoneDates[milestone.id] } : milestone
    )),
  };
}

export function canAcceptOpportunity(opportunity, decision) {
  return getOpportunityStatus(opportunity, decision) === "active"
    && !decision
    && opportunity.eligibility?.status === "verified";
}

export function getOpportunityStatus(opportunity, decision, now = new Date()) {
  if (decision?.status) return decision.status;
  if (!opportunity) return "unavailable";
  if (opportunity.status !== "active") return opportunity.status;
  const expiry = Date.parse(opportunity.expiryDate);
  if (Number.isFinite(expiry) && now.getTime() > expiry + 86_400_000) return "expired";
  return "active";
}
