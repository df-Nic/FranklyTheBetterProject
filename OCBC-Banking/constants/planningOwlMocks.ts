import { calculateProjection } from './planningOwlSandbox';

export type PlanningOwlEvent = 'property' | 'custom' | 'education' | 'wedding' | 'family' | 'career_break';

export type PlanningOwlAnswers = {
  propertyValue: string | null;
  downpayment: string | null;
  timeframe: string | null;
  customGoalName: string | null;
  customTargetAmount: string | null;
  customMonthlySavings: string | null;
  customTimeframe: string | null;
  educationFor: string | null;
  educationCost: string | null;
  educationTimeframe: string | null;
  weddingBudget: string | null;
  weddingTimeframe: string | null;
  weddingMonthlySavings: string | null;
  familyMonthlyCost: string | null;
  familyBufferMonths: string | null;
  familyTimeframe: string | null;
  careerBreakMonthlyExpenses: string | null;
  careerBreakDuration: string | null;
  careerBreakTimeframe: string | null;
};

export type PlanningOwlScenario = 'match_timing' | 'earlier' | 'later' | 'save_more';

type PlanningOwlAction = { id: string; label: string; detail: string; target: string; insight?: string };
type PlanningOwlReason = { title: string; detail: string };

export type PlanningOwlSimulation = {
  scenario: PlanningOwlScenario;
  scenarioLabel: string;
  scenarioTitle: string;
  scenarioSummary: string;
  title: string;
  successProbability: number;
  timeToGoalYears: number;
  purchaseTiming: string;
  liquidityNote: string;
  liquidityRequired: string;
  liquidityAfterPurchase: string;
  riskLevel: string;
  investmentBasket: string;
  expectedReturn: string;
  downsideRisk: string;
  upsidePotential: string;
  riskMessage: string;
  owlRead?: string;
  bestFor: string;
  guidance: string;
  actions: PlanningOwlAction[];
  comparison: {
    currentGoalDate: string;
    optimizedGoalDate: string;
    monthsSaved: number;
    lifestyleAdjustment: string;
    lifestyleSuggestions: string[];
    annualizedReturn: string;
    riskExposure: string;
    reasons: PlanningOwlReason[];
  };
};

const timeframeOptions = ['<1 year', '1-2 years', '3-4 years', '5-6 years', '7+ years'] as const;
const customTimeframeOptions = ['<1 year', '1-2 years', '3-4 years', '5+ years', '7+ years'] as const;

function getAnswerString(value: unknown) {
  if (Array.isArray(value)) {
    return getAnswerString(value[0]);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function getTimingLabel(timeframe: string | null, offset: -1 | 0 | 1) {
  const timeframeValue = getAnswerString(timeframe);
  if (!timeframeValue) {
    return offset === -1 ? 'Earlier than target' : offset === 1 ? 'Later than target' : 'Based on your target timeframe';
  }

  const index = timeframeOptions.findIndex((option) => option === timeframeValue);
  if (index === -1) {
    return offset === -1 ? 'Earlier than your target' : offset === 1 ? 'Later than your target' : 'Based on your target timeframe';
  }

  const nextIndex = Math.max(0, Math.min(timeframeOptions.length - 1, index + offset));
  return timeframeOptions[nextIndex];
}

function getCustomGoalName(answers: PlanningOwlAnswers) {
  return getAnswerString(answers.customGoalName) || 'Savings goal';
}

function parseCurrencyAmount(value: unknown, fallback: number) {
  const stringValue = getAnswerString(value);
  if (!stringValue) return fallback;
  const parsed = Number(stringValue.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getTimelineYears(value: unknown) {
  const stringValue = getAnswerString(value);
  if (!stringValue) return 3;
  if (stringValue.includes('<1')) return 1;
  if (stringValue.includes('1-2')) return 2;
  if (stringValue.includes('3-4')) return 4;
  if (stringValue.includes('5')) return 5;
  if (stringValue.includes('7')) return 7;
  const parsed = Number(stringValue.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
}

function getCustomTimingLabel(timeframe: string | null, offset: -1 | 0 | 1) {
  const timeframeValue = getAnswerString(timeframe);
  if (!timeframeValue) {
    return offset === -1 ? 'A little earlier' : offset === 1 ? 'More time to save' : 'Based on your target timeframe';
  }

  const index = customTimeframeOptions.findIndex((option) => option === timeframeValue);
  if (index === -1) {
    return offset === -1 ? 'A little earlier' : offset === 1 ? 'More time to save' : timeframeValue;
  }

  const nextIndex = Math.max(0, Math.min(customTimeframeOptions.length - 1, index + offset));
  return customTimeframeOptions[nextIndex];
}

const baseActions = {
  loan: {
    id: 'loan',
    label: 'OCBC Home Loan',
    detail: 'Check indicative monthly repayments and packages',
    target: 'loan_owl',
    insight: 'Suggested because your regular salary credits can help estimate a comfortable future monthly repayment.',
  },
  deposit: {
    id: 'deposit',
    label: 'Deposit Owl',
    detail: 'Keep money aside for emergencies',
    target: 'deposit_owl',
    insight: 'Suggested because your account balance has stayed above the emergency cash level for the past 3 months, so this goal can have its own savings bucket.',
  },
  invest: {
    id: 'invest',
    label: 'Invest Owl',
    detail: 'Review goal-based investing options',
    target: 'invest_owl',
    insight: 'Suggested because your selected timeline and existing emergency savings let Owl consider only money you do not need soon.',
  },
  account360: {
    id: 'account360',
    label: 'OCBC 360 Account',
    detail: 'Keep goal money separate and easy to use',
    target: 'ocbc_360',
    insight: 'Suggested because salary credits and card spend are visible banking signals that can help organise monthly savings.',
  },
  fixedDeposit: {
    id: 'fixed_deposit',
    label: 'OCBC Fixed Deposit',
    detail: 'Stage cash for a known payment window',
    target: 'fixed_deposit',
    insight: 'Suggested because your planned payment date is known, so this money can be kept separate from daily spending.',
  },
  card365: {
    id: 'card365',
    label: 'OCBC 365 Credit Card',
    detail: 'Review planned spending and card controls',
    target: 'ocbc_365_card',
    insight: 'Suggested because high-value payments can be compared with your card spend pattern before they affect money kept for emergencies.',
  },
  protection: {
    id: 'protection',
    label: 'Protection review',
    detail: 'Review coverage needs before the milestone',
    target: 'protection_review',
    insight: 'Suggested because regular expenses can change after this milestone, and Owl can use your selected cost to estimate what to protect.',
  },
} satisfies Record<string, PlanningOwlAction>;

export function getPlanningOwlScenarios(answers: PlanningOwlAnswers): PlanningOwlSimulation[] {
  const targetTiming = getTimingLabel(answers.timeframe, 0);
  const earlierTiming = getTimingLabel(answers.timeframe, -1);
  const laterTiming = getTimingLabel(answers.timeframe, 1);
  const downpaymentTarget = answers.downpayment ?? 'your selected downpayment';
  const propertyRange = answers.propertyValue ?? 'your property range';

  const scenarios: PlanningOwlSimulation[] = [
    {
      scenario: 'match_timing',
      scenarioLabel: 'Option A',
      scenarioTitle: 'Match your timeline',
      scenarioSummary: `Plan around ${propertyRange}, ${downpaymentTarget}, and ${targetTiming}.`,
      title: 'Dream home',
      successProbability: 78,
      timeToGoalYears: 2,
      purchaseTiming: targetTiming,
      liquidityNote: 'Balanced cash left',
      liquidityRequired: 'S$150k planned cash',
      liquidityAfterPurchase: 'S$70k cash left after upfront costs',
      riskLevel: 'Moderate',
      investmentBasket: 'Deposits plus lower-risk investing options',
      expectedReturn: '+4.8%',
      downsideRisk: 'Value may move up or down',
      upsidePotential: '+8% upside range',
      riskMessage: `This keeps your ${targetTiming} home target and ${downpaymentTarget}. It also keeps more cash available after upfront costs.`,
      owlRead: `Owl shows 78% because this option keeps your ${targetTiming} home target and ${downpaymentTarget} downpayment plan, while still leaving cash after upfront costs.`,
      bestFor: 'Staying close to your original plan',
      guidance: 'Keep your home-buying timeline the same, set aside the downpayment first, and only grow money you do not need soon.',
      actions: [
        { ...baseActions.deposit, detail: 'Set aside S$70k for emergencies after upfront costs', insight: `Suggested because your account balance trend shows enough cash left after upfront costs for the ${targetTiming} plan.` },
        { ...baseActions.invest, detail: 'Only consider growing money you do not need soon', insight: `Suggested because your selected timeline is ${targetTiming} and emergency cash is already kept aside.` },
        { ...baseActions.loan, detail: 'Check a comfortable monthly repayment', insight: `Suggested because your regular salary credits can be compared against repayments for ${propertyRange}.` },
        { ...baseActions.account360, detail: 'Keep the downpayment separate from daily spending', insight: 'Suggested because salary credits and card spend are already visible banking signals that can help organise monthly savings.' },
      ],
      comparison: {
        currentGoalDate: targetTiming,
        optimizedGoalDate: targetTiming,
        monthsSaved: 0,
        lifestyleAdjustment: 'Moderate spending review',
        lifestyleSuggestions: [
          'Reduce dining and entertainment by 10%.',
          'Move S$300/month into the property goal.',
          'Review subscriptions and recurring card spend.',
        ],
        annualizedReturn: '+4.8%',
        riskExposure: 'Moderate',
        reasons: [
          {
            title: 'Cash left after upfront costs',
            detail: 'The plan keeps a meaningful reserve after estimated upfront property costs.',
          },
          {
            title: 'Money you need soon stays safe',
            detail: 'Only money not needed soon is considered for growth while near-term costs stay separate.',
          },
        ],
      },
    },
    {
      scenario: 'later',
      scenarioLabel: 'Option C',
      scenarioTitle: 'Keep more cash aside',
      scenarioSummary: `Give ${downpaymentTarget} more time so cash pressure stays lower.`,
      title: 'Dream home',
      successProbability: 90,
      timeToGoalYears: 3,
      purchaseTiming: laterTiming,
      liquidityNote: 'More cash left',
      liquidityRequired: 'S$120k staged cash',
      liquidityAfterPurchase: 'S$105k cash left after upfront costs',
      riskLevel: 'Low',
      investmentBasket: 'Fixed deposits plus lower-risk income options',
      expectedReturn: '+4.1%',
      downsideRisk: 'Value may move up or down',
      upsidePotential: '+7% upside range',
      riskMessage: `This gives you more time, so the monthly pressure is lower and more cash stays available after upfront costs.`,
      owlRead: `Owl shows 90% because giving the downpayment plan more time lowers the monthly pressure and leaves more cash after upfront costs.`,
      bestFor: 'More breathing room, lower pressure',
      guidance: 'Give yourself more time so you can keep more cash available after paying the upfront home costs.',
      actions: [
        { ...baseActions.deposit, detail: 'Keep more money aside after the downpayment', insight: 'Suggested because your account balance trend can support a bigger amount kept for emergencies.' },
        { ...baseActions.invest, detail: 'Review growth only after near-term cash is set aside', insight: `Suggested because ${laterTiming} gives more time and your emergency cash is already kept aside.` },
        { ...baseActions.loan, detail: 'Set a property affordability alert', insight: `Suggested because regular salary credits help Owl estimate repayments for ${propertyRange}.` },
        { ...baseActions.fixedDeposit, detail: 'Keep planned downpayment cash separate from daily spending', insight: `Suggested because the ${laterTiming} payment window is known and can be planned around.` },
      ],
      comparison: {
        currentGoalDate: targetTiming,
        optimizedGoalDate: laterTiming,
        monthsSaved: 0,
        lifestyleAdjustment: 'Light spending adjustment',
        lifestyleSuggestions: [
          'Reduce dining by 5%.',
          'Redirect S$200/month into the property goal.',
          'Keep emergency savings untouched.',
        ],
        annualizedReturn: '+4.1%',
        riskExposure: 'Low',
        reasons: [
          {
            title: 'More breathing room',
            detail: 'The adjusted timing lets savings accumulate without putting pressure on emergency cash.',
          },
          {
            title: 'Less pressure to grow the money quickly',
            detail: 'The longer timeline means the plan can rely more on saving and less on taking risk.',
          },
        ],
      },
    },
    {
      scenario: 'save_more',
      scenarioLabel: 'Option D',
      scenarioTitle: 'Save more monthly',
      scenarioSummary: `Keep ${targetTiming} by increasing the monthly contribution.`,
      title: 'Dream home',
      successProbability: 84,
      timeToGoalYears: 2,
      purchaseTiming: targetTiming,
      liquidityNote: 'Improved readiness',
      liquidityRequired: 'S$500/mo extra savings',
      liquidityAfterPurchase: 'S$82k cash left after upfront costs',
      riskLevel: 'Commitment risk',
      investmentBasket: 'Deposits plus lower-risk investing options',
      expectedReturn: '+5.6%',
      downsideRisk: 'Falls back if extra savings stop',
      upsidePotential: '+10% upside range',
      riskMessage: 'This keeps the same timeline by setting aside more each month.',
      owlRead: `Owl shows 84% because adding S$500 a month makes the ${downpaymentTarget} downpayment plan easier to reach by ${targetTiming}, while still keeping emergency money aside.`,
      bestFor: 'Higher confidence if you can commit',
      guidance: 'Keep the same timeline by setting aside more each month. Owl checks this against your salary credits and regular spending.',
      actions: [
        { ...baseActions.deposit, detail: 'Set aside S$500/month for the property goal', insight: 'Suggested because regular salary credits make a monthly transfer easier to track.' },
        { ...baseActions.invest, detail: 'Only review growth after the monthly saving is covered', insight: `Suggested because your ${targetTiming} timeline and existing deposits show money needed soon should stay separate.` },
        { ...baseActions.loan, detail: 'Pre-check future loan affordability', insight: `Suggested because ${propertyRange} can change the future monthly repayment estimate.` },
        { ...baseActions.account360, detail: 'Use a separate savings bucket for monthly top-ups', insight: 'Suggested because salary credits and card spend can help Owl monitor whether the S$500 top-up stays comfortable.' },
      ],
      comparison: {
        currentGoalDate: targetTiming,
        optimizedGoalDate: targetTiming,
        monthsSaved: 0,
        lifestyleAdjustment: '+S$500/month savings',
        lifestyleSuggestions: [
          'Redirect S$500/month to the property goal.',
          'Reduce dining by 15%.',
          'Set an automated transfer and review after 3 months.',
        ],
        annualizedReturn: '+5.6%',
        riskExposure: 'Moderate',
        reasons: [
          {
            title: 'Higher monthly commitment',
            detail: 'Extra savings build a stronger downpayment reserve only if the monthly commitment is maintained.',
          },
          {
            title: 'Less spending flexibility',
            detail: 'The plan asks for extra monthly money to be set aside before optional spending.',
          },
        ],
      },
    },
  ];

  if (answers.timeframe !== '<1 year') {
    scenarios.splice(1, 0, {
      scenario: 'earlier',
      scenarioLabel: 'Option B',
      scenarioTitle: 'Buy earlier',
      scenarioSummary: `Pull the purchase toward ${earlierTiming} by using more cash sooner.`,
      title: 'Dream home',
      successProbability: 63,
      timeToGoalYears: 1,
      purchaseTiming: earlierTiming,
      liquidityNote: 'Less cash left',
      liquidityRequired: 'S$210k upfront',
      liquidityAfterPurchase: 'S$38k cash left after upfront costs',
      riskLevel: 'Less emergency cash',
      investmentBasket: 'Cash, savings, short-tenor deposits',
      expectedReturn: '+2.4%',
      downsideRisk: 'Emergency money may feel tight',
      upsidePotential: '+4% cash rebuild range',
      riskMessage: 'This gets you there sooner, but uses more cash now.',
      owlRead: `Owl shows 63% because this reaches the ${downpaymentTarget} downpayment plan sooner, but uses more cash now and leaves less money for emergencies.`,
      bestFor: 'Fastest purchase, less cash left',
      guidance: 'Move faster by using more cash now, but keep enough aside for emergencies.',
      actions: [
        { ...baseActions.loan, detail: 'Check monthly repayments before committing', insight: 'Suggested because your salary credits need to support repayments even after using more cash upfront.' },
        { ...baseActions.deposit, detail: 'Keep at least S$40k for emergencies', insight: 'Suggested because this option uses more cash now and leaves less cash after upfront costs.' },
        { ...baseActions.invest, detail: 'Pause new investments for 6 months', insight: 'Suggested because recent high-value payment patterns show this plan needs cash ready soon.' },
        { ...baseActions.fixedDeposit, detail: 'Keep purchase cash separate until needed', insight: 'Suggested because the earlier payment date is known and should not be mixed with daily spending.' },
      ],
      comparison: {
        currentGoalDate: targetTiming,
        optimizedGoalDate: earlierTiming,
        monthsSaved: 12,
        lifestyleAdjustment: 'Higher spending discipline',
        lifestyleSuggestions: [
          'Reduce dining by 20%.',
          'Pause selected discretionary purchases for 6 months.',
          'Keep bonuses or windfalls for stamp duty and fees.',
        ],
        annualizedReturn: '+2.4%',
        riskExposure: 'High',
        reasons: [
          {
            title: 'More cash used sooner',
            detail: 'The plan reaches the purchase earlier by committing more available cash upfront.',
          },
          {
            title: 'Buffer needs protection',
            detail: 'Emergency money should be kept aside before loan repayments begin.',
          },
        ],
      },
    });
  }

  return scenarios.map((scenario, index) => ({
    ...scenario,
    scenarioLabel: `Option ${String.fromCharCode(65 + index)}`,
  }));
}

export const planningOwlScenarios = getPlanningOwlScenarios({
  propertyValue: null,
  downpayment: null,
  timeframe: null,
  customGoalName: null,
  customTargetAmount: null,
  customMonthlySavings: null,
  customTimeframe: null,
  educationFor: null,
  educationCost: null,
  educationTimeframe: null,
  weddingBudget: null,
  weddingTimeframe: null,
  weddingMonthlySavings: null,
  familyMonthlyCost: null,
  familyBufferMonths: null,
  familyTimeframe: null,
  careerBreakMonthlyExpenses: null,
  careerBreakDuration: null,
  careerBreakTimeframe: null,
});

export function getMockSimulation(answers: PlanningOwlAnswers, scenario: PlanningOwlScenario = 'match_timing') {
  return getPlanningOwlScenarios(answers).find((item) => item.scenario === scenario) ?? getPlanningOwlScenarios(answers)[0];
}

export function getCustomGoalScenarios(answers: PlanningOwlAnswers): PlanningOwlSimulation[] {
  const goalName = getCustomGoalName(answers);
  const targetAmount = parseCurrencyAmount(answers.customTargetAmount, 20000);
  const monthlySavings = parseCurrencyAmount(answers.customMonthlySavings, 500);
  const years = getTimelineYears(answers.customTimeframe);
  const projectedTotal = calculateProjection(monthlySavings, years);
  const shortfall = Math.max(0, targetAmount - projectedTotal);
  const targetTiming = getCustomTimingLabel(answers.customTimeframe, 0);
  const earlierTiming = getCustomTimingLabel(answers.customTimeframe, -1);
  const laterTiming = getCustomTimingLabel(answers.customTimeframe, 1);
  const formattedTarget = formatCurrency(targetAmount);
  const formattedMonthly = formatCurrency(monthlySavings);
  const formattedShortfall = formatCurrency(shortfall);

  return [
    {
      scenario: 'match_timing',
      scenarioLabel: 'Option A',
      scenarioTitle: 'Build steadily',
      scenarioSummary: `Keep saving toward ${goalName} on your selected timeline.`,
      title: goalName,
      successProbability: shortfall === 0 ? 86 : 74,
      timeToGoalYears: years,
      purchaseTiming: targetTiming,
      liquidityNote: 'Emergency cash kept aside',
      liquidityRequired: `${formattedTarget} target`,
      liquidityAfterPurchase: 'Emergency cash untouched',
      riskLevel: 'Low',
      investmentBasket: 'Automated savings plus short-tenor deposits',
      expectedReturn: '+2.0%',
      downsideRisk: 'Low chance of falling short',
      upsidePotential: '+3% savings yield range',
      riskMessage: `This keeps ${goalName} simple: set aside ${formattedMonthly}/month and keep emergency money separate.`,
      owlRead: `This keeps your ${formattedTarget} target and ${formattedMonthly}/month habit clear, while emergency money stays separate.`,
      bestFor: 'Clear target, low complexity',
      guidance: `Set aside ${formattedMonthly}/month toward ${goalName}, and keep emergency money separate from this goal.`,
      actions: [
        { ...baseActions.deposit, detail: `Create a dedicated pocket for ${goalName}`, insight: `Suggested because your balance pattern shows enough emergency money kept aside, so ${goalName} can have its own savings bucket.` },
        { ...baseActions.invest, detail: years >= 3 ? 'Review lower-risk growth options for money you do not need soon' : 'Keep funds easy to use because the timeline is short', insight: years >= 3 ? `Suggested because your selected timeline is ${targetTiming} and your existing deposits show emergency money is already kept aside.` : 'Suggested because this goal is soon, so the money should stay easy to use.' },
      ],
      comparison: {
        currentGoalDate: targetTiming,
        optimizedGoalDate: targetTiming,
        monthsSaved: 0,
        lifestyleAdjustment: `${formattedMonthly}/month automated savings`,
        lifestyleSuggestions: [
          `Automate ${formattedMonthly}/month into this goal.`,
          'Keep emergency savings in a separate bucket.',
          shortfall > 0 ? `Review the target or add ${formattedShortfall} over time.` : 'Review the plan after three months of deposits.',
        ],
        annualizedReturn: '+2.0%',
        riskExposure: 'Low',
        reasons: [
          {
            title: 'Transparent savings habit',
            detail: 'The projection uses your selected monthly savings amount and target timeframe.',
          },
          {
            title: 'Emergency money stays separate',
            detail: 'The plan keeps the target separate from money needed for daily life.',
          },
        ],
      },
    },
    {
      scenario: 'save_more',
      scenarioLabel: 'Option B',
      scenarioTitle: 'Reach faster',
      scenarioSummary: 'Increase the monthly habit to close the gap sooner.',
      title: goalName,
      successProbability: shortfall === 0 ? 90 : 82,
      timeToGoalYears: Math.max(1, years - 1),
      purchaseTiming: earlierTiming,
      liquidityNote: 'Higher monthly habit',
      liquidityRequired: `${formatCurrency(monthlySavings + 200)}/mo habit`,
      liquidityAfterPurchase: 'Emergency cash kept aside if automated',
      riskLevel: 'Commitment risk',
      investmentBasket: 'Automated savings plus flexible deposits',
      expectedReturn: '+2.3%',
      downsideRisk: 'Falls behind if top-up stops',
      upsidePotential: '+4% savings yield range',
      riskMessage: 'This can reach the target faster, but only if the higher monthly transfer still feels comfortable.',
      owlRead: `This uses a higher monthly amount to reach ${formattedTarget} sooner, based on your selected savings habit.`,
      bestFor: 'Faster progress without extra risk',
      guidance: `Increase the monthly transfer by about S$200 and review it after three months.`,
      actions: [
        { ...baseActions.deposit, detail: `Automate ${formatCurrency(monthlySavings + 200)}/month into the goal`, insight: 'Suggested because regular salary credits make a monthly transfer easier to track.' },
        { ...baseActions.invest, detail: years >= 3 ? 'Review deposits or lower-risk investments for money not needed soon' : 'Keep the money easy to use', insight: years >= 3 ? `Suggested because your selected timeline is ${targetTiming} and existing deposits can cover emergency money first.` : 'Suggested because the goal is soon, so this money should not be hard to access.' },
      ],
      comparison: {
        currentGoalDate: targetTiming,
        optimizedGoalDate: earlierTiming,
        monthsSaved: 6,
        lifestyleAdjustment: '+S$200/month savings',
        lifestyleSuggestions: [
          'Redirect S$200/month before discretionary spending.',
          'Review recurring card spend for easy reductions.',
          'Pause the top-up if emergency cash falls below target.',
        ],
        annualizedReturn: '+2.3%',
        riskExposure: 'Low to moderate',
        reasons: [
          {
            title: 'Progress comes from habit, not guesswork',
            detail: 'The faster path is driven by the higher monthly contribution entered in the mock flow.',
          },
          {
            title: 'Cash remains accessible',
            detail: 'The plan avoids locking all funds away while the goal is still taking shape.',
          },
        ],
      },
    },
    {
      scenario: 'later',
      scenarioLabel: 'Option C',
      scenarioTitle: 'Keep more cash aside',
      scenarioSummary: 'Give the goal more time so monthly pressure stays lower.',
      title: goalName,
      successProbability: 92,
      timeToGoalYears: years + 1,
      purchaseTiming: laterTiming,
      liquidityNote: 'Most cash left',
      liquidityRequired: `${formattedMonthly}/mo or less`,
      liquidityAfterPurchase: 'More cash available',
      riskLevel: 'Lowest',
      investmentBasket: 'Savings account and short-tenor deposits',
      expectedReturn: '+1.8%',
      downsideRisk: 'Prices may rise over time',
      upsidePotential: '+2.5% savings yield range',
      riskMessage: 'A longer timeline lowers monthly pressure and keeps more cash available for unexpected needs.',
      owlRead: `This gives you more time, so ${formattedMonthly}/month does not crowd out money kept for emergencies.`,
      bestFor: 'Maximum cash comfort',
      guidance: `Give ${goalName} more time if you want a lower monthly amount and more cash available for daily life.`,
      actions: [
        { ...baseActions.deposit, detail: 'Keep the goal in an easy-to-use savings bucket', insight: 'Suggested because this option is mainly about keeping cash available for daily life and emergencies.' },
      ],
      comparison: {
        currentGoalDate: targetTiming,
        optimizedGoalDate: laterTiming,
        monthsSaved: 0,
        lifestyleAdjustment: 'Lower monthly pressure',
        lifestyleSuggestions: [
          'Keep the monthly transfer comfortable.',
          'Increase contributions only after income or emergency savings improves.',
          'Review the target amount every six months.',
        ],
        annualizedReturn: '+1.8%',
        riskExposure: 'Low',
        reasons: [
          {
            title: 'More time to save',
            detail: 'Extra time means the target can be funded without forcing a sharp monthly adjustment.',
          },
          {
            title: 'Most cash available',
            detail: 'This path is designed to keep day-to-day cash comfortable first.',
          },
        ],
      },
    },
  ];
}

export function getCustomGoalSimulation(answers: PlanningOwlAnswers, scenario: PlanningOwlScenario = 'match_timing') {
  const scenarios = getCustomGoalScenarios(answers);
  return scenarios.find((item) => item.scenario === scenario) ?? scenarios[0];
}

type LifeEventScenarioConfig = {
  title: string;
  targetValue: string;
  timing: string | null;
  targetLabel: string;
  monthlyLabel: string;
  baseProbability: number;
  growthLabel: string;
  riskLabel: string;
  actionSet: PlanningOwlAction[];
  copy: {
    matchTitle: string;
    earlierTitle: string;
    laterTitle: string;
    saveMoreTitle: string;
    matchGuidance: string;
    earlierGuidance: string;
    laterGuidance: string;
    saveMoreGuidance: string;
    lifestyleBase: string;
    liquidityStrong: string;
    whyOne: string;
    whyTwo: string;
  };
};

export function getPlanningOwlScenariosForEvent(event: PlanningOwlEvent, answers: PlanningOwlAnswers): PlanningOwlSimulation[] {
  if (event === 'custom') {
    return getCustomGoalScenarios(answers);
  }

  if (event === 'property') {
    return getPlanningOwlScenarios(answers);
  }

  return getLifeEventScenarios(getLifeEventScenarioConfig(event, answers));
}

export function getPlanningOwlSimulationForEvent(event: PlanningOwlEvent, answers: PlanningOwlAnswers, scenario: PlanningOwlScenario = 'match_timing') {
  const scenarios = getPlanningOwlScenariosForEvent(event, answers);
  return scenarios.find((item) => item.scenario === scenario) ?? scenarios[0];
}

function getLifeEventScenarioConfig(event: Exclude<PlanningOwlEvent, 'property' | 'custom'>, answers: PlanningOwlAnswers): LifeEventScenarioConfig {
  switch (event) {
    case 'education':
      return {
        title: 'Education fund',
        targetValue: answers.educationCost ?? 'S$60,000',
        timing: answers.educationTimeframe,
        targetLabel: `${answers.educationCost ?? 'S$60,000'} fee target`,
        monthlyLabel: 'S$650/month habit',
        baseProbability: 80,
        growthLabel: 'Deposits plus lower-risk education options',
        riskLabel: 'Fee timing risk',
        actionSet: [
          { ...baseActions.deposit, detail: 'Create a dedicated education savings pocket', insight: 'Suggested because the selected fee amount needs its own savings bucket, separate from daily spending.' },
          { ...baseActions.invest, detail: 'Review lower-risk growth options for longer timelines', insight: 'Suggested because your selected education date gives Owl time to consider money you do not need soon.' },
          { ...baseActions.fixedDeposit, detail: 'Keep known fee payments separate until needed', insight: 'Suggested because the fee date is known, so the money can be kept apart from daily spending.' },
          { ...baseActions.account360, detail: 'Keep near-term school fees easy to use', insight: 'Suggested because salary credits and account balances help Owl see whether fee money is staying available.' },
        ],
        copy: {
          matchTitle: 'Match fee timing',
          earlierTitle: 'Ready earlier',
          laterTitle: 'Keep more cash available',
          saveMoreTitle: 'Top up monthly',
          matchGuidance: 'Use your selected school fee date to keep near-term fees ready and plan the rest month by month.',
          earlierGuidance: 'Reach your education target earlier by setting aside more cash sooner.',
          laterGuidance: 'Give your education fund more time so you can keep more cash available now.',
          saveMoreGuidance: 'Keep your education date by setting aside more each month.',
          lifestyleBase: 'Education savings review',
          liquidityStrong: 'School fees staged',
          whyOne: 'The target is modelled from the selected fee amount and readiness date.',
          whyTwo: 'Fees due soon stay easy to use, while money not needed soon can be reviewed separately.',
        },
      };
    case 'wedding':
      return {
        title: 'Wedding plan',
        targetValue: answers.weddingBudget ?? 'S$60,000',
        timing: answers.weddingTimeframe,
        targetLabel: `${answers.weddingBudget ?? 'S$60,000'} budget`,
        monthlyLabel: answers.weddingMonthlySavings ?? 'S$1,000/month habit',
        baseProbability: 77,
        growthLabel: 'Savings, fixed deposits, and staged vendor payments',
        riskLabel: 'Vendor payment timing',
        actionSet: [
          { ...baseActions.deposit, detail: 'Separate vendor payments from everyday cash', insight: 'Suggested because vendor-style payments can be spotted as high-value payments and should not be mixed with daily spending.' },
          { ...baseActions.fixedDeposit, detail: 'Keep cash ready for known deposit dates', insight: 'Suggested because wedding payments often happen on known dates, so the money can be kept separate until then.' },
          { ...baseActions.card365, detail: 'Review wedding spend controls and rewards fit', insight: 'Suggested because vendor-style payments can be tracked against your card spending pattern.' },
        ],
        copy: {
          matchTitle: 'Match wedding date',
          earlierTitle: 'Book earlier',
          laterTitle: 'Keep more cash aside',
          saveMoreTitle: 'Save more monthly',
          matchGuidance: 'Use your selected wedding budget and date to keep vendor payments separate from daily spending.',
          earlierGuidance: 'Book earlier by using more cash now, while still keeping emergency money separate.',
          laterGuidance: 'Give your wedding fund more time to build so the monthly amount feels easier.',
          saveMoreGuidance: 'Keep your wedding date by setting aside more each month.',
          lifestyleBase: 'Wedding budget review',
          liquidityStrong: 'Vendor cash staged',
          whyOne: 'The mock plan uses the selected budget, date, and monthly savings habit.',
          whyTwo: 'Vendor payments are separated from emergency money, so the plan does not overstate how much cash is free to use.',
        },
      };
    case 'family':
      return {
        title: 'Family emergency fund',
        targetValue: answers.familyBufferMonths ?? '9 months',
        timing: answers.familyTimeframe,
        targetLabel: `${answers.familyBufferMonths ?? '9 months'} emergency fund`,
        monthlyLabel: `${answers.familyMonthlyCost ?? 'S$2,000'}/month cost base`,
        baseProbability: 83,
        growthLabel: 'Easy-to-use savings plus short-tenor deposits',
        riskLabel: 'Recurring expense risk',
        actionSet: [
          { ...baseActions.deposit, detail: 'Build a family emergency savings bucket', insight: 'Suggested because recurring family costs need money that is easy to reach first.' },
          { ...baseActions.protection, detail: 'Review coverage needs before expenses rise', insight: 'Suggested because starting a family changes regular expenses, and your selected monthly family cost gives Owl a clearer amount to protect.' },
          { ...baseActions.account360, detail: 'Keep family expense money easy to reach', insight: 'Suggested because salary credits and recurring card/debit spending can help Owl monitor family cash needs.' },
        ],
        copy: {
          matchTitle: 'Match emergency target',
          earlierTitle: 'Build emergency cash earlier',
          laterTitle: 'Lower pressure',
          saveMoreTitle: 'Increase monthly set-aside',
          matchGuidance: 'Build your selected family emergency money while keeping recurring costs visible.',
          earlierGuidance: 'Reach your emergency target faster by setting aside more cash sooner.',
          laterGuidance: 'Lower monthly pressure and keep the family cash reserve more comfortable.',
          saveMoreGuidance: 'Keep your target date by increasing the monthly family set-aside.',
          lifestyleBase: 'Family cashflow review',
          liquidityStrong: 'Emergency cash kept aside',
          whyOne: 'The plan is modelled from selected monthly family costs and emergency-fund months.',
          whyTwo: 'The recommendation prioritises cash that is easy to reach before investment or product actions.',
        },
      };
    case 'career_break':
      return {
        title: 'Career break fund',
        targetValue: answers.careerBreakDuration ?? '6 months',
        timing: answers.careerBreakTimeframe,
        targetLabel: `${answers.careerBreakDuration ?? '6 months'} break fund`,
        monthlyLabel: `${answers.careerBreakMonthlyExpenses ?? 'S$4,000'}/month expenses`,
        baseProbability: 79,
        growthLabel: 'Break savings, fixed deposits, and lower-risk review',
        riskLabel: 'Income-gap risk',
        actionSet: [
          { ...baseActions.deposit, detail: 'Keep break expenses in an easy-to-use savings bucket', insight: 'Suggested because income may pause, so the money for monthly expenses should be easy to reach.' },
          { ...baseActions.fixedDeposit, detail: 'Keep later-month cash separate until needed', insight: 'Suggested because the break length is known, so later-month money can be kept apart from daily spending.' },
          { ...baseActions.card365, detail: 'Review recurring card and subscription spend', insight: 'Suggested because recurring card/debit spending directly affects how long your break money lasts.' },
          { ...baseActions.invest, detail: 'Review lower-risk options only for money beyond break expenses', insight: 'Suggested because break expenses should be covered before any extra money is considered for growth.' },
        ],
        copy: {
          matchTitle: 'Match break date',
          earlierTitle: 'Start earlier',
          laterTitle: 'Extend break fund',
          saveMoreTitle: 'Boost monthly savings',
          matchGuidance: 'Set aside enough for your selected break length and keep that money separate from long-term savings.',
          earlierGuidance: 'Start your break earlier, but keep enough money aside for monthly expenses.',
          laterGuidance: 'Give yourself more time to save before income pauses.',
          saveMoreGuidance: 'Keep your break date by lifting monthly savings and reviewing recurring spend.',
          lifestyleBase: 'Break spending review',
          liquidityStrong: 'Income-gap cash kept aside',
          whyOne: 'The plan is based on selected monthly expenses and break duration.',
          whyTwo: 'The plan keeps break cash accessible because income may pause.',
        },
      };
  }
}

function getLifeEventScenarios(config: LifeEventScenarioConfig): PlanningOwlSimulation[] {
  const timing = getCustomTimingLabel(config.timing, 0);
  const earlierTiming = getCustomTimingLabel(config.timing, -1);
  const laterTiming = getCustomTimingLabel(config.timing, 1);
  const scenarios: PlanningOwlSimulation[] = [
    buildLifeEventScenario(config, 'match_timing', 'Option A', config.copy.matchTitle, timing, config.baseProbability, 'Balanced cash left', config.copy.matchGuidance, 0, config.copy.lifestyleBase),
    buildLifeEventScenario(config, 'earlier', 'Option B', config.copy.earlierTitle, earlierTiming, config.baseProbability - 14, 'Less cash left', config.copy.earlierGuidance, 6, 'Higher upfront discipline'),
    buildLifeEventScenario(config, 'later', 'Option C', config.copy.laterTitle, laterTiming, config.baseProbability + 8, config.copy.liquidityStrong, config.copy.laterGuidance, 0, 'Lower monthly pressure'),
    buildLifeEventScenario(config, 'save_more', 'Option D', config.copy.saveMoreTitle, timing, config.baseProbability + 4, 'Improved readiness', config.copy.saveMoreGuidance, 0, '+S$300/month savings'),
  ];

  if (config.timing === '<1 year') {
    return scenarios.filter((item) => item.scenario !== 'earlier').map((scenario, index) => ({
      ...scenario,
      scenarioLabel: `Option ${String.fromCharCode(65 + index)}`,
    }));
  }

  return scenarios;
}

function buildLifeEventScenario(
  config: LifeEventScenarioConfig,
  scenario: PlanningOwlScenario,
  scenarioLabel: string,
  scenarioTitle: string,
  purchaseTiming: string,
  successProbability: number,
  liquidityNote: string,
  guidance: string,
  monthsSaved: number,
  lifestyleAdjustment: string,
): PlanningOwlSimulation {
  return {
    scenario,
    scenarioLabel,
    scenarioTitle,
    scenarioSummary: guidance,
    title: config.title,
    successProbability,
    timeToGoalYears: getTimelineYears(config.timing),
    purchaseTiming,
    liquidityNote,
    liquidityRequired: config.targetLabel,
    liquidityAfterPurchase: scenario === 'earlier' ? 'Less cash left after the plan' : liquidityNote,
    riskLevel: scenario === 'earlier' ? 'Higher' : scenario === 'later' ? 'Low' : config.riskLabel,
    investmentBasket: config.growthLabel,
    expectedReturn: scenario === 'earlier' ? '+2.1%' : scenario === 'later' ? '+2.8%' : '+3.6%',
    downsideRisk: scenario === 'earlier' ? 'May feel tight month to month' : 'May need review if costs change',
    upsidePotential: scenario === 'save_more' ? '+6% readiness range' : '+4% readiness range',
    riskMessage: `${guidance} This is a simulated Planning Owl recommendation based on your selected answers and the bank signals shown in this prototype.`,
    owlRead:
      scenario === 'earlier'
        ? `This reaches ${config.targetLabel} sooner, but uses more cash now.`
        : scenario === 'later'
          ? `This gives you more time for ${config.targetLabel}, so the monthly pressure is lower.`
          : scenario === 'save_more'
            ? `This keeps the ${purchaseTiming} timeline by setting aside more each month.`
            : `This keeps ${config.targetLabel} on the ${purchaseTiming} timeline and uses ${config.monthlyLabel} as the planning habit.`,
    bestFor: scenario === 'earlier' ? 'Moving faster with less cash left' : scenario === 'later' ? 'More breathing room' : 'Staying close to the selected plan',
    guidance,
    actions: config.actionSet,
    comparison: {
      currentGoalDate: getCustomTimingLabel(config.timing, 0),
      optimizedGoalDate: purchaseTiming,
      monthsSaved,
      lifestyleAdjustment,
      lifestyleSuggestions: [
        `Keep ${config.targetValue} visible as the target.`,
        `Review ${config.monthlyLabel} before discretionary spending.`,
        scenario === 'later' ? 'Use the extra time to keep more cash available.' : 'Set an automated transfer and review after three months.',
      ],
      annualizedReturn: scenario === 'earlier' ? '+2.1%' : scenario === 'later' ? '+2.8%' : '+3.6%',
      riskExposure: scenario === 'earlier' ? 'High' : scenario === 'later' ? 'Low' : 'Moderate',
      reasons: [
        {
          title: 'Answer-led mock plan',
          detail: config.copy.whyOne,
        },
        {
          title: 'Cash kept available',
          detail: config.copy.whyTwo,
        },
      ],
    },
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(value);
}
