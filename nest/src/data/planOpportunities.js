import { applyFundingMilestoneStates } from "./milestonePlans";

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
      "Your plan keeps S$20,000 in low-risk savings for an August 2030 purchase.",
      "You prioritised flexibility, so the option preserves access with no fixed lock-in period.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$2,500", proposed: "S$2,500" },
      { label: "Accessible savings rate", current: "2.15% p.a.", proposed: "3.20% p.a." },
      { label: "Estimated interest", current: "S$860", proposed: "S$1,280" },
      { label: "Goal date", current: "Aug 2030", proposed: "Aug 2030" },
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
  "children-education": {
    id: "education-robo-upgrade",
    status: "active",
    title: "Optimize growth on education savings portfolios",
    summary: "A new children-education specific investment tier became available to boost returns.",
    triggerType: "New allocation",
    trigger: "OCBC RoboInvest added a dedicated Education Savings Tier yielding up to 7.20% p.a.",
    detectedDate: "24 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "30 Nov 2026",
    benefitType: "Greater yield with security",
    benefitLabel: "+S$680 estimated interest",
    benefitValue: "S$680",
    benefitCaption: "Potential additional interest",
    benefitContext: "Based on regular monthly contributions until matriculation.",
    relevance: [
      "Your plan allocates funds to children's education targeted for October 2035.",
      "The upgrade keeps the same risk tolerance while boosting targeted growth.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$500", proposed: "S$500" },
      { label: "Growth rate", current: "6.80% p.a.", proposed: "7.20% p.a." },
      { label: "Estimated value by 2035", current: "S$82,300", proposed: "S$84,100" },
    ],
    assumptions: ["S$500 monthly contributions remain uninterrupted.", "Promotional rates remain applicable."],
    tradeoffs: ["Subject to market volatility.", "Withdrawals before 2035 may incur small admin fees."],
    eligibility: { status: "verified", label: "Verified", detail: "Your linked CDA account status qualifies you for the tier." },
    source: "OCBC Education Fund product terms",
    planChanges: {
      strategy: "High-yield savings and optimized investment portfolios",
    },
  },
  "career-break": {
    id: "career-yield-booster",
    status: "active",
    title: "Improve rate on liquid short-term funds",
    summary: "Move transition savings to a high-yield liquid option preserving full access.",
    triggerType: "Rate optimization",
    trigger: "The Bonus+ savings interest rate tier increased from 3.00% to 3.70% p.a. for career savers.",
    detectedDate: "24 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "31 Oct 2026",
    benefitType: "Improved liquid yield",
    benefitLabel: "+S$190 estimated interest",
    benefitValue: "S$190",
    benefitCaption: "Estimated additional yield",
    benefitContext: "Without locking up funds or changing the June 2028 break date.",
    relevance: [
      "You are saving SG$25,000 for a transition planned in June 2028.",
      "Full liquidity is critical so the option has zero lock-in penalty.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$800", proposed: "S$800" },
      { label: "Liquid savings rate", current: "3.00% p.a.", proposed: "3.70% p.a." },
      { label: "Estimated interest", current: "S$380", proposed: "S$570" },
    ],
    assumptions: ["Contributions are held in the Bonus+ account.", "Promo rates remain valid through 2027."],
    tradeoffs: ["Requires zero withdrawals during the deposit month.", "Rate is variable post-promotional period."],
    eligibility: { status: "verified", label: "Verified", detail: "Your current monthly transfer meets the deposit criteria." },
    source: "OCBC Bonus+ product schedule",
    planChanges: {
      strategy: "Optimized liquid savings and automated sweeps",
    },
  },
  "parents-retirement": {
    id: "parents-senior-care-upgrade",
    status: "active",
    title: "Ensure sufficient protection against medical inflation",
    summary: "Adjust eldercare insurance protection to cover 95% of senior medical bills.",
    triggerType: "Policy update",
    trigger: "Great Eastern enhanced GREAT SupremeHealth Senior benefits for active policy holders.",
    detectedDate: "24 Jul 2026",
    checkedDate: "24 Jul 2026",
    expiryDate: "31 Dec 2026",
    benefitType: "Lower medical exposure",
    benefitLabel: "Up to S$15,000 yearly coverage boost",
    benefitValue: "95%",
    benefitCaption: "Hospital bill coverage limit",
    benefitContext: "Protecting retirement savings from sudden medical drawdowns.",
    relevance: [
      "Your plan supports parents' retirement with milestones ending in Dec 2032.",
      "Ensuring health protection preserves cash buffers for living costs.",
    ],
    comparisons: [
      { label: "Monthly contribution", current: "S$1,000", proposed: "S$1,000" },
      { label: "Senior hospital coverage", current: "90%", proposed: "95%" },
      { label: "Estimated cash-out-of-pocket", current: "S$3,000", proposed: "S$1,000" },
    ],
    assumptions: ["Parents' health declarations remain verified.", "Medisave limits permit the upgrade fee."],
    tradeoffs: ["Rider premiums are subject to age-band adjustments over time.", "Slightly higher premium deducted from Medisave."],
    eligibility: { status: "verified", label: "Verified", detail: "Linked parental details meet age limits for senior coverage." },
    source: "Great Eastern Senior Health terms",
    planChanges: {
      strategy: "CPF top-ups and enhanced senior protection plans",
    },
  }
};

const CASH_INFLUX_OPPORTUNITY = {
  id: "bonus-influx-jul-2026",
  status: "active",
  title: "Put your S$8,000 bonus to work",
  summary: "Agent Owl detected a salary bonus and compared how it could strengthen each active plan.",
  triggerType: "Extra funds detected",
  trigger: "A salary bonus of S$8,000 was credited to your 360 Account.",
  detectedDate: "24 Jul 2026",
  checkedDate: "24 Jul 2026",
  expiryDate: "31 Aug 2026",
  sourceAmount: 8000,
  sourceAccount: "OCBC 360 Account",
  benefitType: "Faster plan progress",
  benefitLabel: "Give your next goal a meaningful head start",
  benefitValue: "S$8,000",
  benefitCaption: "Unallocated bonus",
  benefitContext: "Choose the plan where these extra funds will make the most useful difference.",
  relevance: ["The funds are above your usual monthly income.", "Allocating them will not change recurring contributions."],
  comparisons: [],
  assumptions: ["The full S$8,000 remains available.", "No emergency cash requirement takes priority."],
  tradeoffs: ["Allocated funds become committed to the selected goal.", "Keeping the bonus unallocated preserves immediate flexibility."],
  eligibility: { status: "verified", label: "Verified", detail: "The bonus has cleared and is available in your linked 360 Account." },
  source: "360 Account credit transaction",
  planChanges: { strategy: "One-time bonus allocation" },
};

export function getPlanOpportunity(customAmount) {
  if (customAmount && typeof customAmount === "number" && customAmount > 0) {
    const formatted = `S$${customAmount.toLocaleString("en-SG")}`;
    return {
      ...CASH_INFLUX_OPPORTUNITY,
      sourceAmount: customAmount,
      title: `Put your ${formatted} deposit to work`,
      summary: `Agent Owl detected a deposit of ${formatted} and compared how it could strengthen each active plan.`,
      trigger: `A deposit of ${formatted} was credited to your OCBC Account.`,
      benefitValue: formatted,
      assumptions: [`The full ${formatted} remains available.`, "No emergency cash requirement takes priority."],
    };
  }
  return CASH_INFLUX_OPPORTUNITY;
}

export function getAllocationImpact(plan, amount = CASH_INFLUX_OPPORTUNITY.sourceAmount) {
  const saved = plan.onTrack?.saved ?? 0;
  const target = plan.targetAmount || 1;
  const remaining = Math.max(0, target - saved);
  const applied = Math.min(amount, remaining || amount);
  const gapRatio = remaining / target;
  const behindSchedule = (plan.onTrack?.expected ?? 0) > saved;
  const goalTime = Date.parse(plan.goalDate);
  const monthsToGoal = Number.isFinite(goalTime)
    ? Math.max(1, Math.round((goalTime - Date.now()) / 2_629_800_000))
    : 60;
  const deadlinePressure = Math.min(1, 24 / monthsToGoal);
  return {
    applied,
    currentProgress: Math.min(100, Math.round((saved / target) * 100)),
    newProgress: Math.min(100, Math.round(((saved + applied) / target) * 100)),
    monthsSaved: Math.max(1, Math.round(applied / Math.max(plan.monthlyContribution || 1, 1))),
    gapRatio,
    behindSchedule,
    deadlinePressure,
    pressure: gapRatio + (behindSchedule ? 0.35 : 0) + deadlinePressure * 0.25,
  };
}

export function getAllocationReason(plan, amount, total = CASH_INFLUX_OPPORTUNITY.sourceAmount) {
  const impact = getAllocationImpact(plan);
  const share = Math.round((amount / total) * 100);
  const outcome = plan.personalContext?.desiredOutcome || plan.goalName.toLowerCase();
  if (impact.behindSchedule) {
    return `${share}% goes here because ${plan.goalName} is behind schedule. This larger boost helps it catch up toward ${outcome}.`;
  }
  if (impact.deadlinePressure > 0.5) {
    return `${share}% goes here because ${plan.goalName} is one of your nearer goals and has ${Math.round(impact.gapRatio * 100)}% left to fund.`;
  }
  return `${share}% goes here because ${plan.goalName} still has ${Math.round(impact.gapRatio * 100)}% left to fund. Even with more time, this amount can start growing toward ${outcome} now.`;
}

export function getPersonalizedRecommendationReason(plan, userName) {
  const impact = getAllocationImpact(plan);
  const firstName = userName?.trim()?.split(/\s+/)[0];
  const outcome = plan.personalContext?.desiredOutcome || plan.personalContext?.motivation || "the outcome you planned for";
  const timing = impact.behindSchedule
    ? "it is behind the saving pace needed for its deadline"
    : impact.deadlinePressure > 0.5
      ? "its nearer deadline leaves less time for future contributions"
      : "it has the strongest remaining funding need among your active plans";
  return `${firstName ? `${firstName}, ` : ""}Owl prioritised ${plan.goalName} because ${Math.round(impact.gapRatio * 100)}% of its target is still unfunded and ${timing}. Using the bonus here makes the biggest immediate contribution toward ${outcome}, while easing the load on your regular monthly savings.`;
}

export function getProductAllocationReason(plan, userName) {
  const priority = plan.personalContext?.priority;
  const firstName = userName?.trim()?.split(/\s+/)[0];
  const outcome = plan.personalContext?.desiredOutcome || plan.personalContext?.motivation || "your stated goal";
  const prefix = firstName ? `${firstName}, ` : "";
  if (plan.id === "emergency") return `${prefix}Owl keeps this in OCBC 360 so it remains immediately available for ${outcome}. A fixed deposit or market portfolio could offer more return, but lock-up or volatility would work against an emergency buffer.`;
  if (["housing", "wedding-fund", "career-break"].includes(plan.id)) return `${prefix}Owl combines accessible OCBC 360 savings with a fixed deposit because ${outcome} has a defined, nearer-term date. It avoids equity-heavy portfolios: a market dip when you need to pay would matter more than their higher potential return.`;
  if (plan.id === "children-education") return `${prefix}Owl uses the Child Development Account for earlier education costs and the Balanced Portfolio for tuition further away, matching how your family will pay for ${outcome}. It avoids leaving everything in cash, where inflation can erode it, or putting everything into higher-risk equities when some money may be needed sooner.`;
  if (plan.id === "retirement") return `${prefix}Owl pairs SRS with the Balanced Portfolio because your longer horizon can use both tax savings and compounding for ${outcome}. It avoids an all-deposit mix that may grow too slowly and an equity-only mix with more volatility than your ${priority || "balanced"} preference calls for.`;
  if (plan.id === "parents-retirement") return `${prefix}Owl balances retirement-income support with a liquid OCBC 360 medical reserve because ${outcome} needs both dependable support and access for unexpected care. Locking the full bonus into an investment would leave too little flexibility.`;
  return `${prefix}Owl balances OCBC 360 liquidity with measured portfolio growth for ${outcome}. It avoids using only one product because your ${priority || "balanced"} preference needs both accessible funds and protection against inflation.`;
}

export function getRecommendedPlan(plans) {
  return [...plans].sort((a, b) => getAllocationImpact(b).pressure - getAllocationImpact(a).pressure)[0] ?? null;
}

export function getWeightedAllocations(plans, total = 8000) {
  if (!plans.length) return [];
  const weights = plans.map((plan) => Math.max(0.01, getAllocationImpact(plan).pressure));
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  let remaining = total;
  return plans.map((plan, index) => {
    const amount = index === plans.length - 1 ? remaining : Math.floor((total * weights[index]) / weightTotal);
    remaining -= amount;
    return { planId: plan.id, amount, monthsSaved: getAllocationImpact(plan, amount).monthsSaved };
  }).filter((item) => item.amount > 0);
}

export function scaleAllocationUses(planId, amount) {
  const base = getAllocationUses(planId);
  const baseTotal = base.reduce((sum, item) => sum + item.amount, 0) || 1;
  let remaining = amount;
  return base.map((item, index) => {
    const scaledAmount = index === base.length - 1 ? remaining : Math.round((amount * item.amount) / baseTotal);
    remaining -= scaledAmount;
    return { ...item, amount: scaledAmount, projectedGain: Math.round(item.projectedGain * scaledAmount / item.amount) };
  });
}

const ALLOCATION_USES = {
  retirement: [
    { product: "OCBC SRS Account", purpose: "Tax-efficient retirement contribution", amount: 5000 },
    { product: "OCBC Balanced Portfolio", purpose: "Long-term diversified growth", amount: 3000 },
  ],
  housing: [
    { product: "OCBC 360 Account", purpose: "Accessible downpayment reserve", amount: 5000 },
    { product: "OCBC Fixed Deposit", purpose: "Higher yield for later payments", amount: 3000 },
  ],
  savings: [
    { product: "OCBC 360 Account", purpose: "Liquid high-yield savings", amount: 5000 },
    { product: "OCBC Fixed Deposit", purpose: "Higher yield on planned funds", amount: 3000 },
  ],
  emergency: [
    { product: "OCBC 360 Account", purpose: "Immediately accessible safety buffer", amount: 8000 },
  ],
  "wedding-fund": [
    { product: "OCBC 360 Account", purpose: "Upcoming vendor payments", amount: 6000 },
    { product: "OCBC Fixed Deposit", purpose: "Yield on later-stage payments", amount: 2000 },
  ],
  "children-education": [
    { product: "OCBC Child Development Account", purpose: "Near-term education expenses", amount: 3000 },
    { product: "OCBC Balanced Portfolio", purpose: "Longer-term tuition growth", amount: 5000 },
  ],
  "career-break": [
    { product: "OCBC 360 Account", purpose: "Liquid career-break runway", amount: 6000 },
    { product: "OCBC Fixed Deposit", purpose: "Yield before the break begins", amount: 2000 },
  ],
  "parents-retirement": [
    { product: "CPF Cash Top-up via OCBC", purpose: "Parents’ retirement income", amount: 5000 },
    { product: "OCBC 360 Account", purpose: "Accessible medical reserve", amount: 3000 },
  ],
  default: [
    { product: "OCBC 360 Account", purpose: "Short-term liquidity", amount: 2000 },
    { product: "OCBC Balanced Portfolio", purpose: "Diversified long-term growth", amount: 6000 },
  ],
};

export function getAllocationUses(planId) {
  return (ALLOCATION_USES[planId] ?? ALLOCATION_USES.default).map((item) => {
    const product = item.product.toLowerCase();
    let annualRate = 0.025;
    let years = 2;
    let benefitType = "estimated interest";

    if (product.includes("balanced portfolio")) {
      annualRate = 0.05;
      years = 5;
      benefitType = "illustrative investment growth";
    } else if (product.includes("fixed deposit")) {
      annualRate = 0.03;
      years = 1;
    } else if (product.includes("child development")) {
      annualRate = 0.02;
      years = 3;
    } else if (product.includes("cpf")) {
      annualRate = 0.04;
      years = 5;
      benefitType = "estimated CPF interest";
    } else if (product.includes("srs")) {
      return {
        ...item,
        projectedGain: Math.round(item.amount * 0.15),
        growthLabel: "potential one-time tax saving",
        assumption: "Illustrated at a 15% marginal tax rate",
      };
    }

    return {
      ...item,
      projectedGain: Math.round(item.amount * (Math.pow(1 + annualRate, years) - 1)),
      growthLabel: `${benefitType} over ${years} ${years === 1 ? "year" : "years"}`,
      assumption: `Illustrated at ${(annualRate * 100).toFixed(1)}% p.a.`,
    };
  });
}

function accelerateGoalDate(value, months) {
  if (!months) return value;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return value;
  const date = new Date(parsed);
  date.setMonth(date.getMonth() - months);
  return date.toLocaleDateString("en-SG", {
    ...(String(value).match(/\d{1,2}\s/) ? { day: "numeric" } : {}),
    month: "short",
    year: "numeric",
  });
}

export function applyOpportunityChanges(plan, opportunity, decision) {
  const allocation = decision?.allocations?.find((item) => item.planId === plan.id);
  if (!opportunity || decision?.status !== "accepted" || !allocation) return plan;
  const changes = opportunity.planChanges ?? {};
  const milestoneDates = changes.milestoneDates ?? {};
  const acceleratedGoalDate = accelerateGoalDate(plan.goalDate, allocation.monthsSaved);
  const updatedSavedAmount = plan.onTrack.saved + allocation.amount;
  const datedMilestones = plan.milestones.map((milestone, index) => {
    if (milestoneDates[milestone.id]) return { ...milestone, date: milestoneDates[milestone.id] };
    if (index === plan.milestones.length - 1) return { ...milestone, date: acceleratedGoalDate };
    return milestone;
  });
  const fundedMilestones = applyFundingMilestoneStates(datedMilestones, updatedSavedAmount)
    .map((milestone) => {
      const previousMilestone = plan.milestones.find((item) => item.id === milestone.id);
      if (milestone.state !== "completed" || previousMilestone?.state === "completed") return milestone;
      return {
        ...milestone,
        completedAt: decision.decidedAt,
        completionSource: "opportunity",
        completionOpportunityId: opportunity.id,
        completionAmount: allocation.amount,
        savedAtCompletion: updatedSavedAmount,
      };
    });
  return {
    ...plan,
    goalDate: changes.goalDate ?? acceleratedGoalDate,
    ...(changes.monthlyContribution ? { monthlyContribution: changes.monthlyContribution } : {}),
    ...(changes.strategy ? { strategy: changes.strategy } : {}),
    onTrack: {
      ...plan.onTrack,
      saved: updatedSavedAmount,
    },
    milestones: fundedMilestones,
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
