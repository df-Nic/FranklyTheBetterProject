export type PlanningOwlAnswers = {
  propertyValue: string | null;
  downpayment: string | null;
  timeframe: string | null;
};

export type PlanningOwlScenario = 'match_timing' | 'earlier' | 'later' | 'save_more';

type PlanningOwlAction = { id: string; label: string; detail: string; target: string };
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

const timeframeOptions = ['1-2 years', '3-4 years', '5-6 years', '7+ years'] as const;

function getTimingLabel(timeframe: string | null, offset: -1 | 0 | 1) {
  if (!timeframe) {
    return offset === -1 ? 'Earlier than target' : offset === 1 ? 'Later than target' : 'Based on your target timeframe';
  }

  const index = timeframeOptions.findIndex((option) => option === timeframe);
  if (index === -1) {
    return offset === -1 ? 'Earlier than your target' : offset === 1 ? 'Later than your target' : 'Based on your target timeframe';
  }

  const nextIndex = Math.max(0, Math.min(timeframeOptions.length - 1, index + offset));
  return timeframeOptions[nextIndex];
}

const baseActions = {
  loan: {
    id: 'loan',
    label: 'OCBC Home Loan',
    detail: 'Check indicative monthly repayments and packages',
    target: 'loan_owl',
  },
  deposit: {
    id: 'deposit',
    label: 'Deposit Owl',
    detail: 'Keep a dedicated emergency cash buffer',
    target: 'deposit_owl',
  },
  invest: {
    id: 'invest',
    label: 'Invest Owl',
    detail: 'Review a goal-based investment basket',
    target: 'invest_owl',
  },
} satisfies Record<string, PlanningOwlAction>;

export function getPlanningOwlScenarios(answers: PlanningOwlAnswers): PlanningOwlSimulation[] {
  const targetTiming = getTimingLabel(answers.timeframe, 0);
  const earlierTiming = getTimingLabel(answers.timeframe, -1);
  const laterTiming = getTimingLabel(answers.timeframe, 1);

  return [
    {
      scenario: 'match_timing',
      scenarioLabel: 'Option A',
      scenarioTitle: 'Match your timeline',
      scenarioSummary: 'Plan around the timeframe you selected.',
      title: 'Dream home 2026',
      successProbability: 78,
      timeToGoalYears: 2,
      purchaseTiming: targetTiming,
      liquidityNote: 'Balanced buffer',
      liquidityRequired: 'S$150k planned cash',
      liquidityAfterPurchase: 'S$70k buffer',
      riskLevel: 'Moderate',
      investmentBasket: 'Deposits plus lower-volatility investment allocation',
      expectedReturn: '+4.8%',
      downsideRisk: 'Possible -10% drawdown',
      upsidePotential: '+8% upside range',
      riskMessage: 'This follows your preferred timing while keeping a moderate cash buffer and measured market exposure.',
      bestFor: 'Staying close to your original plan',
      guidance: 'This scenario keeps your purchase timeline intact while balancing cash buffer and investment risk.',
      actions: [
        { ...baseActions.deposit, detail: 'Set aside S$70k as post-purchase buffer' },
        { ...baseActions.invest, detail: 'Use a lower-volatility basket for medium-term growth' },
        { ...baseActions.loan, detail: 'Check affordability against the selected timeline' },
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
            title: 'Balanced cash buffer',
            detail: 'The plan keeps a meaningful reserve after estimated upfront property costs.',
          },
          {
            title: 'Measured investment risk',
            detail: 'Only surplus funds are exposed to market movement while near-term cash stays accessible.',
          },
        ],
      },
    },
    {
      scenario: 'earlier',
      scenarioLabel: 'Option B',
      scenarioTitle: 'Buy earlier',
      scenarioSummary: 'Pull the purchase forward by using more cash sooner.',
      title: 'Dream home 2026',
      successProbability: 63,
      timeToGoalYears: 1,
      purchaseTiming: earlierTiming,
      liquidityNote: 'Low cash buffer',
      liquidityRequired: 'S$210k upfront',
      liquidityAfterPurchase: 'S$38k buffer',
      riskLevel: 'Cash buffer risk',
      investmentBasket: 'Cash, savings, short-tenor deposits',
      expectedReturn: '+2.4%',
      downsideRisk: 'Possible buffer shortfall',
      upsidePotential: '+4% liquidity recovery',
      riskMessage: 'Buying earlier reduces waiting time, but leaves less breathing room after downpayment and fees.',
      bestFor: 'Fastest purchase, tighter buffer',
      guidance: 'You may proceed earlier, but your cash buffer will fall below the recommended level.',
      actions: [
        { ...baseActions.loan, detail: 'Check monthly repayments before committing' },
        { ...baseActions.deposit, detail: 'Protect at least S$40k emergency cash' },
        { ...baseActions.invest, detail: 'Pause new investments for 6 months' },
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
            detail: 'Emergency cash should be ring-fenced before loan repayments begin.',
          },
        ],
      },
    },
    {
      scenario: 'later',
      scenarioLabel: 'Option C',
      scenarioTitle: 'Safer buffer',
      scenarioSummary: 'Create more breathing room by protecting cash and reducing pressure.',
      title: 'Dream home 2026',
      successProbability: 90,
      timeToGoalYears: 3,
      purchaseTiming: laterTiming,
      liquidityNote: 'Strong cash buffer',
      liquidityRequired: 'S$120k staged cash',
      liquidityAfterPurchase: 'S$105k buffer',
      riskLevel: 'Low',
      investmentBasket: 'FD/MMF plus conservative income allocation',
      expectedReturn: '+4.1%',
      downsideRisk: 'Possible -6% drawdown',
      upsidePotential: '+7% upside range',
      riskMessage: 'Extending the timing can protect your cash buffer and reduce pressure from future repayments.',
      bestFor: 'More breathing room, lower pressure',
      guidance: 'This scenario may extend the purchase timing so you can preserve a stronger cash buffer and avoid over-stretching.',
      actions: [
        { ...baseActions.deposit, detail: 'Park S$60k in FD/MMF for downpayment' },
        { ...baseActions.invest, detail: 'Invest excess S$30k for medium-term growth' },
        { ...baseActions.loan, detail: 'Set a property affordability alert' },
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
            title: 'Lower market pressure',
            detail: 'Funds can stay in deposits and conservative allocations because the plan has more runway.',
          },
        ],
      },
    },
    {
      scenario: 'save_more',
      scenarioLabel: 'Option D',
      scenarioTitle: 'Save more monthly',
      scenarioSummary: 'Keep your timing but increase monthly savings.',
      title: 'Dream home 2026',
      successProbability: 84,
      timeToGoalYears: 2,
      purchaseTiming: targetTiming,
      liquidityNote: 'Improved readiness',
      liquidityRequired: 'S$500/mo extra savings',
      liquidityAfterPurchase: 'S$82k buffer',
      riskLevel: 'Commitment risk',
      investmentBasket: 'Deposits plus lower-volatility investment allocation',
      expectedReturn: '+5.6%',
      downsideRisk: 'Falls back if extra savings stop',
      upsidePotential: '+10% upside range',
      riskMessage: 'This improves readiness only if you can keep saving the extra S$500/month without affecting essential spending.',
      bestFor: 'Higher confidence if you can commit',
      guidance: 'You can strengthen your plan by redirecting monthly surplus, but this option depends on sustaining the extra S$500/month comfortably.',
      actions: [
        { ...baseActions.deposit, detail: 'Auto-allocate S$500/month to the property goal' },
        { ...baseActions.invest, detail: 'Rebalance 15% to lower-volatility holdings' },
        { ...baseActions.loan, detail: 'Pre-check future loan affordability' },
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
            detail: 'The plan asks for recurring surplus to be redirected before discretionary spending.',
          },
        ],
      },
    },
  ];
}

export const planningOwlScenarios = getPlanningOwlScenarios({
  propertyValue: null,
  downpayment: null,
  timeframe: null,
});

export function getMockSimulation(answers: PlanningOwlAnswers, scenario: PlanningOwlScenario = 'match_timing') {
  return getPlanningOwlScenarios(answers).find((item) => item.scenario === scenario) ?? getPlanningOwlScenarios(answers)[0];
}
