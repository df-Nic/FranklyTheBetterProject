// OCBC Deposit Accounts dataset & Recommendation Engine

export const OCBC_DEPOSITS = [
  {
    id: 'ocbc-360',
    name: 'OCBC 360 Account',
    tagline: 'High-Yield Daily Liquid Savings with Bonus Tiers',
    category: 'High-Yield Savings',
    bgGradient: 'from-[#1C1917] via-[#991B1B] to-[#7F1D1D]',
    cardColor: '#D32F2F', // OCBC Red accent
    textColor: 'text-white',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    chipColor: '#E2B13C',
    network: 'VISA DEBIT',
    headlineRate: 'Up to 7.65% p.a.',
    subText: 'Bonus interest on first S$100,000 balance',
    primaryBenefit: 'Earn bonus rates when you Salary Credit, Save, Spend, Invest, and Insure with OCBC',
    minDeposit: 'S$1,000 initial deposit',
    monthlyFeeWaiver: 'S$2 fee waived if daily average balance >= S$3,000',
    privileges: [
      'Salary Credit Tier: Earn up to 2.50% p.a. when crediting monthly salary >= S$1,800',
      'Save Tier: Earn up to 1.50% p.a. bonus when increasing average daily balance by >= S$500/mo',
      'Spend Tier: Earn 0.60% p.a. bonus when spending S$500/mo on selected OCBC cards',
      'Grow Tier: Earn up to 2.40% p.a. extra on balances between S$75,000 and S$100,000',
      'Instant daily interest computation with full SDIC protection up to S$100,000'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 4650, // S$4,650/yr projected interest on S$100k balance
    planMatches: {
      housing: {
        score: 98,
        timeSavedMonths: 4,
        extraContributions: 'S$4,650/yr interest',
        headline: 'Accelerate Downpayment Growth via 7.65% p.a. Bonus Savings Yield',
        reasons: [
          'Crediting your salary & accumulating monthly HDB downpayment savings automatically unlocks 4.0%++ p.a. bonus interest.',
          'Earn up to S$387/month in pure interest cash flow to directly boost your home deposit fund without locking capital.',
          'Maintains 100% daily liquidity so you can transfer cash immediately when BTO key collection or downpayment date arrives.'
        ]
      },
      retirement: {
        score: 95,
        timeSavedMonths: 6,
        extraContributions: 'S$4,200/yr interest',
        headline: 'Compound Risk-Free Yields into Long-Term Retirement Capital',
        reasons: [
          'Maximizes risk-free yield on your liquid emergency & retirement buffer up to S$100,000.',
          'Seamless integration with OCBC RoboInvest and CPF top-ups triggers the Invest & Save bonus tiers.',
          'Zero capital risk ensures your retirement nest egg grows consistently regardless of equity market volatility.'
        ]
      },
      emergency: {
        score: 97,
        timeSavedMonths: 3,
        extraContributions: 'S$3,800/yr interest',
        headline: 'Ideal Foundation for Liquid Emergency Reserves',
        reasons: [
          'Keep 6 months of living expenses 100% accessible via FAST/PayNow while earning competitive yields.',
          'Save tier rewards disciplined monthly emergency fund top-ups with immediate bonus rate jumps.'
        ]
      },
      default: {
        score: 94,
        timeSavedMonths: 4,
        extraContributions: 'S$4,000/yr interest',
        headline: 'Singapore Flagship High-Yield Savings Account',
        reasons: [
          'Industry-leading interest rate tiers for active OCBC banking customers.',
          'Flexible category tiers adapt seamlessly to your changing monthly income and savings habits.'
        ]
      }
    }
  },
  {
    id: 'ocbc-bonus-plus',
    name: 'OCBC Bonus+ Savings Account',
    tagline: 'High Bonus Interest for Disciplined Monthly Savers',
    category: 'Bonus Savings',
    bgGradient: 'from-[#064E3B] via-[#047857] to-[#065F46]',
    cardColor: '#10B981', // Emerald Green
    textColor: 'text-white',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    chipColor: '#E2B13C',
    network: 'SDIC INSURED',
    headlineRate: 'Up to 4.15% p.a.',
    subText: 'Bonus for non-withdrawal monthly savings',
    primaryBenefit: 'Earn higher interest rates when you save at least S$500 monthly and make zero withdrawals',
    minDeposit: 'S$10,000 initial deposit',
    monthlyFeeWaiver: 'No monthly account fee',
    privileges: [
      'Base Interest: 0.05% p.a. credited monthly on full balance',
      'Bonus Interest: Up to 4.10% p.a. when saving >= S$500/month with zero account withdrawals',
      'Flexibility to pause or withdraw without account penalties (only forfeits bonus for that month)',
      'Multi-tiered interest growth calculated daily for maximum annual compounding',
      'Deposit Insurance Scheme: Full coverage up to S$100,000 by SDIC'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 3110, // S$3,110/yr interest on S$75k
    planMatches: {
      housing: {
        score: 94,
        timeSavedMonths: 3,
        extraContributions: 'S$3,110/yr interest',
        headline: 'Lock In Disciplined Monthly Saving Habits for Home Downpayment',
        reasons: [
          'Rewards non-withdrawal discipline with up to 4.15% p.a. return, keeping your house fund untouched.',
          'Automates monthly S$500+ transfers straight into your downpayment reserve.',
          'Provides higher yields than standard savings without locking capital into fixed terms.'
        ]
      },
      'wedding-fund': {
        score: 96,
        timeSavedMonths: 4,
        extraContributions: 'S$2,800/yr interest',
        headline: 'Grow Wedding Savings Securely Without Market Risk',
        reasons: [
          'Ensures wedding banquet deposits and ceremony funds remain 100% safe and accessible when vendor payments are due.',
          'Zero-withdrawal bonus encourages hands-off accumulation until the big day.'
        ]
      },
      default: {
        score: 91,
        timeSavedMonths: 3,
        extraContributions: 'S$2,900/yr interest',
        headline: 'Best Account for Goal-Driven Non-Withdrawal Savers',
        reasons: [
          'Significantly higher return than traditional savings accounts for steady monthly savers.',
          'No lock-in constraints allows emergency access whenever urgently needed.'
        ]
      }
    }
  },
  {
    id: 'ocbc-fd-6m',
    name: 'OCBC Fixed Deposit Account',
    tagline: 'Guaranteed Fixed Rate Protection for 6 to 12 Months',
    category: 'Fixed Term',
    bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
    cardColor: '#94A3B8', // Slate Metallic
    textColor: 'text-white',
    badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    chipColor: '#E2B13C',
    network: 'GUARANTEED',
    headlineRate: '3.35% p.a. Fixed',
    subText: 'Capital 100% guaranteed for term duration',
    primaryBenefit: 'Lock in guaranteed high returns with zero market exposure or rate fluctuations',
    minDeposit: 'S$20,000 placement',
    monthlyFeeWaiver: 'No maintenance fees',
    privileges: [
      'Guaranteed return paid out automatically upon maturity (6-Month or 12-Month tenures)',
      '100% principal protection with zero credit or investment volatility',
      'Option to auto-roll over principal and interest upon maturity for continuous compounding',
      'Flexible tenure placement directly via OCBC Digital Banking App in 60 seconds',
      'Protected under Singapore Deposit Insurance Scheme up to S$100,000'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 2680, // S$2,680/yr guaranteed on S$80k placement
    planMatches: {
      retirement: {
        score: 92,
        timeSavedMonths: 4,
        extraContributions: 'S$2,680/yr guaranteed',
        headline: 'Secure Guaranteed Cash Payouts for Horizon Planning',
        reasons: [
          'Locks in a guaranteed 3.35% p.a. return to shield your milestone savings from market downturns.',
          'Provides fixed maturity dates aligned with major expenditure or retirement drawdown goals.',
          '100% safe government-backed security eliminates stress over market fluctuations.'
        ]
      },
      housing: {
        score: 90,
        timeSavedMonths: 3,
        extraContributions: 'S$2,500/yr guaranteed',
        headline: 'Park Lump-Sum Downpayment Cash Safe Until BTO Key Collection',
        reasons: [
          'Locks up money safely for 6–12 months so it cannot be accidentally spent.',
          'Guaranteed interest payout boosts your renovation budget right at maturity.'
        ]
      },
      default: {
        score: 89,
        timeSavedMonths: 3,
        extraContributions: 'S$2,400/yr guaranteed',
        headline: 'Risk-Free Lump Sum Capital Growth',
        reasons: [
          'Guaranteed fixed return backed by OCBC Bank\'s AA1 credit rating.',
          'Hassle-free digital placement and instant maturity payout into any account.'
        ]
      }
    }
  },
  {
    id: 'ocbc-premier-div',
    name: 'OCBC Premier Dividend Account',
    tagline: 'Exclusive Wealth Tier Deposit & Multi-Currency Liquidity',
    category: 'Wealth & Multi-Currency',
    bgGradient: 'from-[#171717] via-[#262626] to-[#0A0A0A]',
    cardColor: '#D4AF37', // Royal Gold & Obsidian
    textColor: 'text-white',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    chipColor: '#E2B13C',
    network: 'PREMIER DEBIT',
    headlineRate: 'Up to 3.85% p.a. + FX',
    subText: 'Multi-currency yield across 12 major global currencies',
    primaryBenefit: 'Tier-1 yield for high balances, dedicated wealth advisory, and zero-fee foreign exchange FX deposits',
    minDeposit: 'S$200,000 total balance',
    monthlyFeeWaiver: 'Waived for OCBC Premier Banking clients',
    privileges: [
      'Seamless multi-currency savings across USD, AUD, GBP, EUR, JPY, CAD, and SGD',
      'Competitive FX rates with instant automatic foreign currency auto-conversions',
      'Exclusive access to OCBC Premier Banking Lounges & dedicated Wealth Management Advisor',
      'High daily debit spending limits and priority teller queueing at all OCBC branches',
      'Complimentary airport lounge passes & global travel insurance coverage'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 7700, // S$7,700/yr interest on S$200k balance
    planMatches: {
      retirement: {
        score: 97,
        timeSavedMonths: 7,
        extraContributions: 'S$7,700/yr interest',
        headline: 'Premier Wealth Yields & Global Multi-Currency Flexibility',
        reasons: [
          'Delivers tier-1 deposit returns while preserving multi-currency liquidity for global travel & overseas assets.',
          'Pairs directly with OCBC Premier Wealth Advisory for personalized estate & retirement tax planning.',
          'High S$200,000+ yield ceiling maximizes return on larger wealth portfolios.'
        ]
      },
      'career-break': {
        score: 95,
        timeSavedMonths: 5,
        extraContributions: 'S$6,800/yr interest',
        headline: 'Seamless Foreign Exchange Spending for Overseas Sabbatical',
        reasons: [
          'Hold and spend in USD, EUR, AUD, or GBP with zero foreign transaction fees during your sabbatical.',
          'Generates steady SGD passive interest while abroad to sustain your living expenses.'
        ]
      },
      default: {
        score: 93,
        timeSavedMonths: 5,
        extraContributions: 'S$7,000/yr interest',
        headline: 'Luxury Premier Banking & Global Asset Liquidity',
        reasons: [
          'Top-tier yield rates tailored for high-net-worth deposit holders.',
          'Consolidates local savings and international currency holdings in one unified account.'
        ]
      }
    }
  },
  {
    id: 'ocbc-frank-saver',
    name: 'OCBC FRANK Savings Account',
    tagline: 'Digital-First Savings Pockets & Zero Minimum Balance',
    category: 'Digital Savings',
    bgGradient: 'from-[#0369A1] via-[#0284C7] to-[#06B6D4]',
    cardColor: '#00B4D8', // Electric Cyan
    textColor: 'text-white',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    chipColor: '#E2B13C',
    network: 'FRANK DEBIT',
    headlineRate: 'Up to 2.50% p.a.',
    subText: 'Smart Pockets for automated goal tracking',
    primaryBenefit: 'Create sub-savings "Pockets" to lock away funds for specific goals while earning high interest',
    minDeposit: 'S$0 (Zero initial deposit requirement)',
    monthlyFeeWaiver: 'Waived for account holders below 26 years old or with automated e-statements',
    privileges: [
      'Organize money into custom Pockets (e.g. Travel, Emergency, Tech, Downpayment)',
      'Automated Round-Up Feature: Rounds up daily card debit spending to nearest dollar and saves difference into Pockets',
      'Zero minimum balance penalty for young adults and students',
      'Choose from 60+ custom debit card face designs or bio-sourced eco cards',
      'Exclusive digital lifestyle perks, festival discounts, and cashback deals'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 1250, // S$1,250/yr on S$50k balance
    planMatches: {
      'career-break': {
        score: 93,
        timeSavedMonths: 3,
        extraContributions: 'S$1,250/yr interest',
        headline: 'Segment Sabbatical Funds into Visual Goal Pockets',
        reasons: [
          'Separate living expenses from travel and learning budgets using automated digital Pockets.',
          'Automated card purchase round-ups build micro-savings effortlessly without manual transfers.'
        ]
      },
      emergency: {
        score: 91,
        timeSavedMonths: 2,
        extraContributions: 'S$1,100/yr interest',
        headline: 'Separate Emergency Buffer from Daily Spending Money',
        reasons: [
          'Visually lock away emergency funds inside a dedicated Pocket so you never accidentally spend it.',
          'Zero minimum balance friction makes it accessible for early-career professionals.'
        ]
      },
      default: {
        score: 88,
        timeSavedMonths: 2,
        extraContributions: 'S$1,000/yr interest',
        headline: 'Smart Goal Pockets & Automated Micro-Savings',
        reasons: [
          'Visual pocket partitioning keeps your finances organized and disciplined.',
          'Zero maintenance fees and total digital control via OCBC FRANK mobile app.'
        ]
      }
    }
  },
  {
    id: 'ocbc-msa',
    name: 'OCBC Monthly Savings Account (MSA)',
    tagline: 'Accessible Savings Account for Regular Top-Up Milestones',
    category: 'Milestone Builder',
    bgGradient: 'from-[#1E1B4B] via-[#312E81] to-[#4338CA]',
    cardColor: '#6366F1', // Indigo Vibrant
    textColor: 'text-white',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    chipColor: '#E2B13C',
    network: 'SAVINGS DEBIT',
    headlineRate: 'Up to 3.10% p.a.',
    subText: 'Low entry S$50 monthly deposit threshold',
    primaryBenefit: 'Perfect for building initial savings habits with flexible top-ups and bonus interest',
    minDeposit: 'S$50 initial deposit',
    monthlyFeeWaiver: 'S$2 monthly fee waived with minimum balance of S$500',
    privileges: [
      'Low minimum monthly deposit requirement (starts from just S$50/month)',
      'Earn bonus interest when you deposit monthly without withdrawing within the calendar month',
      'Passbook or e-Statement tracking with instant PayNow and FAST transfer support',
      'Linkable to OCBC ATM card for free withdrawals at all OCBC & UOB ATMs across Singapore',
      'SDIC protection insured up to S$100,000 per depositor'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 1550, // S$1,550/yr on S$50k balance
    planMatches: {
      'children-education': {
        score: 95,
        timeSavedMonths: 3,
        extraContributions: 'S$1,550/yr interest',
        headline: 'Build Children Education Fund with Consistent Monthly Top-Ups',
        reasons: [
          'Low S$50 threshold makes it easy to set up automated standing instructions for kids\' university funds.',
          'Bonus interest structure encourages steady monthly accumulation over 10–15 years.'
        ]
      },
      emergency: {
        score: 90,
        timeSavedMonths: 2,
        extraContributions: 'S$1,300/yr interest',
        headline: 'Low-Friction Starter Emergency Deposit Account',
        reasons: [
          'Ideal entry point to start accumulating your first S$5,000 emergency buffer.',
          'Full ATM network convenience and instant FAST transfer capabilities.'
        ]
      },
      default: {
        score: 87,
        timeSavedMonths: 2,
        extraContributions: 'S$1,200/yr interest',
        headline: 'Low-Barrier Milestone Deposit Builder',
        reasons: [
          'Simple, transparent monthly savings incentive for building discipline.',
          'Seamless link to all Singapore local payment gateways.'
        ]
      }
    }
  },
  {
    id: 'ocbc-foreign-curr',
    name: 'OCBC Global Savings Account',
    tagline: 'Multi-Currency Foreign Exchange Yields & FX Protection',
    category: 'Foreign Exchange',
    bgGradient: 'from-[#022C22] via-[#064E3B] to-[#047857]',
    cardColor: '#059669', // Deep Emerald FX
    textColor: 'text-white',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    chipColor: '#E2B13C',
    network: 'GLOBAL DEBIT',
    headlineRate: 'Up to 5.20% p.a. (USD)',
    subText: 'Earn high yields on foreign currencies (USD, AUD, NZD, GBP)',
    primaryBenefit: 'Hold, convert, and earn high interest rates on global currencies with zero FX conversion markup fees',
    minDeposit: 'USD 1,000 equivalent',
    monthlyFeeWaiver: 'No monthly fee for active FX holdings',
    privileges: [
      'High USD deposit yields up to 5.20% p.a. directly from Singapore',
      'Instant 24/7 FX trading at preferential wholesale interbank exchange rates',
      'Zero overseas transaction fees when spending abroad using linked OCBC Global Debit Card',
      'Hold up to 10 major global currencies in a single account (USD, AUD, CAD, EUR, GBP, HKD, JPY, NZD, SGD, CHF)',
      'SDIC protection for SGD equivalent balances up to S$100,000'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 3640, // ~S$3,640/yr interest on USD balance
    planMatches: {
      'career-break': {
        score: 96,
        timeSavedMonths: 5,
        extraContributions: 'S$3,640/yr FX yield',
        headline: 'Hedge Against Inflation with High USD & Foreign Currency Yields',
        reasons: [
          'Earn up to 5.20% p.a. on USD deposits while preparing for international travel or study sabbatical.',
          'Zero FX markup lets you lock in favorable exchange rates ahead of overseas trips.'
        ]
      },
      retirement: {
        score: 91,
        timeSavedMonths: 4,
        extraContributions: 'S$3,200/yr FX yield',
        headline: 'Diversify Retirement Cash Reserves into Global Hard Currencies',
        reasons: [
          'Protects purchasing power by holding high-yielding USD and AUD reserves alongside SGD.',
          'Instant interbank currency exchange directly inside the OCBC mobile app.'
        ]
      },
      default: {
        score: 89,
        timeSavedMonths: 3,
        extraContributions: 'S$3,000/yr FX yield',
        headline: 'High-Yield Foreign Currency & FX Liquidity Engine',
        reasons: [
          'Captures peak global interest rates on US Dollar and major foreign currencies.',
          'Direct integration with global debit card payments.'
        ]
      }
    }
  },
  {
    id: 'ocbc-lion-liq',
    name: 'Lion-OCBC Enhanced Liquidity Deposit Fund',
    tagline: 'High-Yield Cash Management Fund with Daily Liquidity',
    category: 'Cash Management Fund',
    bgGradient: 'from-[#31103F] via-[#5B21B6] to-[#7C3AED]',
    cardColor: '#8B5CF6', // Royal Purple Metallic
    textColor: 'text-white',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    chipColor: '#E2B13C',
    network: 'OCBC INVEST',
    headlineRate: '3.85% p.a. Net Yield',
    subText: 'Higher than standard fixed deposits with daily withdrawal access',
    primaryBenefit: 'Invests in ultra-short-term institutional money market instruments & bank deposits for maximum net yield',
    minDeposit: 'S$100 initial subscription',
    monthlyFeeWaiver: 'Zero sales charge / Zero lock-in period',
    privileges: [
      'Daily liquidity: T+1 fast withdrawal settlement straight back into your OCBC deposit account',
      'Net projected yield of ~3.85% p.a. accrued daily with zero lock-in penalty',
      'Managed by Lion Global Investors (a member of the OCBC Group)',
      'Holds high-grade Singapore government bills and top-tier bank deposits',
      'Zero sales charge & zero redemption fees for OCBC banking customers'
    ],
    rewardsType: 'interest',
    baseEstAnnualValue: 3080, // S$3,080/yr net yield on S$80k balance
    planMatches: {
      housing: {
        score: 95,
        timeSavedMonths: 4,
        extraContributions: 'S$3,080/yr yield',
        headline: 'Capture Higher Yields Than Fixed Deposits with Daily Access',
        reasons: [
          'Outperforms traditional fixed deposits (~3.85% p.a. net) without locking capital.',
          'T+1 fast redemption lets you pull cash instantly when downpayment or resale option fees are due.',
          'Zero sales charge keeps 100% of your earnings compounding towards your milestone.'
        ]
      },
      retirement: {
        score: 93,
        timeSavedMonths: 4,
        extraContributions: 'S$2,900/yr yield',
        headline: 'High-Yield Cash Buffer for Active Retirement Allocation',
        reasons: [
          'Ideal holding tank for dry-powder cash while waiting for equity market dip buying opportunities.',
          'Generates daily accrued interest higher than standard savings accounts.'
        ]
      },
      default: {
        score: 92,
        timeSavedMonths: 3,
        extraContributions: 'S$2,850/yr yield',
        headline: 'Premier Institutional Cash Yield Engine',
        reasons: [
          'High net returns combined with liquid daily redemption flexibility.',
          'Managed by Singapore\'s leading asset management firm, Lion Global Investors.'
        ]
      }
    }
  }
];

// Helper: Calculate custom deposit optimization metrics based on user active plan context
export function getOptimizedDepositsForPlan(planId, planData, limit = 3) {
  const selectedPlanId = planId || 'housing';
  
  const sortedDeposits = OCBC_DEPOSITS.map(deposit => {
    const match = deposit.planMatches[selectedPlanId] || deposit.planMatches.default;
    
    // Estimate target completion date impact
    const targetDate = planData?.timelineAll || '2028';
    
    return {
      ...deposit,
      matchScore: match.score,
      timeSavedMonths: match.timeSavedMonths,
      extraContributions: match.extraContributions,
      headlineReason: match.headline,
      specificReasons: match.reasons,
      targetDateContext: targetDate
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return limit ? sortedDeposits.slice(0, limit) : sortedDeposits;
}
