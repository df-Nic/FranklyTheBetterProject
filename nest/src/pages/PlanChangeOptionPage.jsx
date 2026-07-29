import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Percent,
  Droplet,
  Lock,
  Unlock,
  MoreHorizontal,
  Info,
  Compass,
  X,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Scissors,
  Zap,
  CheckCircle2,
  Check
} from 'lucide-react';
import { PLANS_DATA, PLAN_ALTERNATIVES } from '../data/planTemplates';
import BackgroundOrb from '../components/ui/BackgroundOrb';

// Category Context Classifier
const getActionContext = (changingCategory, changingAction) => {
  const actId = (changingAction?.id || '').toLowerCase();
  const actName = (changingAction?.name || '').toLowerCase();
  const catId = (changingCategory?.id || '').toLowerCase();
  const catName = (changingCategory?.name || '').toLowerCase();

  // 1. Monthly Auto-Savings Flow / Automatic Monthly Goal Transfer
  if (
    actId.includes('recurring') ||
    actId.includes('transfer') ||
    actId.includes('auto_transfer') ||
    actName.includes('auto-savings') ||
    actName.includes('goal transfer') ||
    actName.includes('monthly auto') ||
    actName.includes('transfer')
  ) {
    return 'auto_transfer';
  }

  // 2. Flexible Lifestyle Budget / Dining Cap
  if (
    actId.includes('dine') ||
    actId.includes('lifestyle') ||
    actName.includes('lifestyle') ||
    actName.includes('dining') ||
    actName.includes('cap') ||
    actName.includes('tracker')
  ) {
    return 'lifestyle_budget';
  }

  // 3. Singapore Treasury Bills / Fixed Income
  if (
    actId.includes('tbills') ||
    actId.includes('t-bills') ||
    actId.includes('fixed_income') ||
    actName.includes('treasury') ||
    actName.includes('t-bill') ||
    actName.includes('fixed deposit') ||
    catId.includes('fixed')
  ) {
    return 'tbills';
  }

  // 4. OCBC RoboInvest
  if (
    actId.includes('robo') ||
    actName.includes('robo')
  ) {
    return 'robo_invest';
  }

  // 5. OCBC Blue Chip Investment Plan (BCIP)
  if (
    actId.includes('bcip') ||
    actName.includes('blue chip') ||
    actName.includes('bcip') ||
    actName.includes('reit')
  ) {
    return 'blue_chip';
  }

  // 6. Generic Investment
  if (
    catId.includes('invest') ||
    catName.includes('invest') ||
    changingAction?.type === 'investment'
  ) {
    return 'robo_invest';
  }

  // 7. Protection / Insurance
  if (
    catId.includes('insur') ||
    catId.includes('protect') ||
    catName.includes('insur') ||
    catName.includes('protect') ||
    changingAction?.type === 'defense' ||
    changingAction?.type === 'insurance' ||
    changingAction?.type === 'protection'
  ) {
    return 'protection';
  }

  // 8. Default: Deposit products
  return 'deposit';
};

// Simplified category pills & alternatives config map
const CONTEXT_CONFIG = {
  deposit: {
    title: "Change Deposit Product",
    buttonLabel: "Change deposit",
    pills: [
      { label: "Higher interest", icon: Percent },
      { label: "Easier access", icon: Droplet },
      { label: "Fewer conditions", icon: Unlock }
    ],
    guardrail: "OCBC 360’s interest depends on activities such as salary crediting, saving and card spending, so 'fewer conditions' is a defensible preference.",
    alternatives: [
      {
        id: "alt_ocbc360",
        name: "OCBC 360 Account",
        desc: "Credit your salary, save, and spend to earn up to 4.65% p.a. high interest on your primary liquid cash.",
        rate: 0.0465,
        type: "deposit product",
        riskBand: "Capital Safety",
        tags: ["Higher interest", "Easier access"],
        fitText: "Provides high interest yield while maintaining daily liquidity access for your cash."
      },
      {
        id: "alt_bonus_plus",
        name: "OCBC Bonus+ Savings Account",
        desc: "Suited to customers who can avoid withdrawals. Earn high bonus interest rates up to 4.15% p.a. for months with zero withdrawals.",
        rate: 0.0415,
        type: "deposit product",
        riskBand: "Capital Safety",
        tags: ["Higher interest", "Fewer conditions"],
        fitText: "Suited to customers who can avoid withdrawals to maximize bonus yield."
      },
      {
        id: "alt_monthly_savings",
        name: "OCBC Monthly Savings Account",
        desc: "Suited to regular monthly saving. Earn high baseline interest by committing consistent monthly savings.",
        rate: 0.0380,
        type: "deposit product",
        riskBand: "Capital Safety",
        tags: ["Higher interest", "Easier access"],
        fitText: "Suited to regular monthly saving with flexible penalty-free withdrawal access."
      },
      {
        id: "alt_time_deposit",
        name: "OCBC Time Deposit",
        desc: "Guaranteed capital returns with maturity structured before your next goal payment date.",
        rate: 0.0335,
        type: "deposit product",
        riskBand: "Capital Safety",
        tags: ["Higher interest", "Fewer conditions"],
        fitText: "Guarantees principal safety with fixed maturity before your next goal deadline."
      },
      {
        id: "alt_premier_div",
        name: "OCBC Premier Dividend Account",
        desc: "Premier wealth tier account offering up to 3.85% p.a. and seamless multi-currency FX liquidity.",
        rate: 0.0385,
        type: "deposit product",
        riskBand: "Capital Safety",
        tags: ["Higher interest", "Easier access"],
        fitText: "Provides high interest yield while maintaining daily multi-currency liquidity access."
      }
    ]
  },
  auto_transfer: {
    title: "Edit Goal Transfer Flow",
    buttonLabel: "Edit transfer",
    pills: [
      { label: "Transfer after payday", icon: Sparkles },
      { label: "Split into two transfers", icon: Scissors },
      { label: "Use another account", icon: CreditCard }
    ],
    guardrail: "Monthly amount and target date remain unchanged. Do not show other bank products here; these are execution preferences, not product alternatives.",
    isExecutionOnly: true,
    alternatives: [
      {
        id: "alt_payday_transfer",
        name: "S$500 once a month after salary credit",
        desc: "S$500 once a month after salary credit. Scheduled automatically 1 day after payday to secure your goal savings.",
        rate: 0,
        type: "execution preference",
        tags: ["Transfer after payday"],
        fitText: "Automates goal contribution immediately following your monthly salary credit."
      },
      {
        id: "alt_split_transfer",
        name: "S$250 twice a month",
        desc: "S$250 twice a month. Split into two recurring transfers on the 1st and 15th to smooth cash flow impact.",
        rate: 0,
        type: "execution preference",
        tags: ["Split into two transfers"],
        fitText: "Reduces peak cash-flow strain by dividing contributions across two pay periods."
      },
      {
        id: "alt_other_account",
        name: "S$500 from another selected OCBC account",
        desc: "S$500 from another selected OCBC account. Deduct goal transfers from your secondary OCBC deposit account.",
        rate: 0,
        type: "execution preference",
        tags: ["Use another account"],
        fitText: "Keeps your goal funding separate from your daily operating checking account."
      }
    ]
  },
  tbills: {
    title: "Change Fixed-Income Option",
    buttonLabel: "Change fixed-income option",
    pills: [
      { label: "Shorter maturity", icon: Lock },
      { label: "Longer maturity", icon: Lock },
      { label: "More flexible access", icon: Unlock }
    ],
    guardrail: "Only display options that mature or can be redeemed before the relevant goal payment. Singapore T-bills are issued with six-month and one-year original maturities, while Savings Bonds can be submitted for redemption in a chosen month. Avoid hardcoding yield because it changes by issue.",
    alternatives: [
      {
        id: "alt_tbill_6m",
        name: "6-month Singapore T-bill",
        desc: "6-month Singapore T-bill. Short-term Singapore Government Securities backed by sovereign guarantee.",
        rateText: "Auction yield",
        type: "fixed income",
        riskBand: "Capital Safety",
        tags: ["Shorter maturity"],
        fitText: "Matures in 6 months before your goal payment with zero credit risk."
      },
      {
        id: "alt_tbill_1y",
        name: "1-year Singapore T-bill",
        desc: "1-year Singapore T-bill. Guaranteed sovereign yield locked over a 12-month original maturity.",
        rateText: "Auction yield",
        type: "fixed income",
        riskBand: "Capital Safety",
        tags: ["Longer maturity"],
        fitText: "Matures in 1 year, locking in fixed sovereign yield prior to your target deadline."
      },
      {
        id: "alt_ssb_bond",
        name: "Singapore Savings Bond (SSB)",
        desc: "Singapore Savings Bond, where greater redemption flexibility is required. Step-up interest with monthly penalty-free exit.",
        rateText: "Step-up rate",
        type: "fixed income",
        riskBand: "Capital Safety",
        tags: ["More flexible access"],
        fitText: "Can be submitted for redemption in any chosen month before your relevant goal payment."
      },
      {
        id: "alt_ocbc_mmf",
        name: "Lion-OCBC Money Market Fund",
        desc: "Allocate funds into low-risk institutional liquidity instruments yielding 3.90% p.a. with instant cash retrieval.",
        rate: 0.039,
        type: "fixed income",
        riskBand: "Capital Safety",
        tags: ["More flexible access"],
        fitText: "Maintains high capital protection with instant liquidity for upcoming goal payments."
      }
    ]
  },
  lifestyle_budget: {
    title: "Edit Strategy",
    buttonLabel: "Edit strategy",
    pills: [
      { label: "Choose another category", icon: Scissors },
      { label: "Split across categories", icon: Sparkles },
      { label: "Use a savings transfer", icon: ArrowLeft }
    ],
    guardrail: "Required monthly contribution and target date remain unchanged. Do not show OCBC 360 or another financial product as the alternative result here.",
    isExecutionOnly: true,
    alternatives: [
      {
        id: "alt_dining_redirect",
        name: "Redirect S$150 from dining",
        desc: "Redirect S$150 from dining. Adjust food delivery and restaurant spending caps to fund your goal.",
        rate: 0,
        type: "spending strategy",
        tags: ["Choose another category"],
        fitText: "Targets dining out as a focused category to recover your required monthly contribution."
      },
      {
        id: "alt_split_categories",
        name: "Redirect S$50 each from dining, shopping and entertainment",
        desc: "Redirect S$50 each from dining, shopping and entertainment to balance lifestyle changes lightly.",
        rate: 0,
        type: "spending strategy",
        tags: ["Split across categories"],
        fitText: "Spreads small spending trims across three categories to minimize personal impact."
      },
      {
        id: "alt_increase_transfer",
        name: "Keep lifestyle spending unchanged and increase the automatic goal transfer by S$150",
        desc: "Keep lifestyle spending unchanged and increase the automatic goal transfer by S$150 directly.",
        rate: 0,
        type: "spending strategy",
        tags: ["Use a savings transfer"],
        fitText: "Preserves your current spending habits while automating goal funding from cash flow."
      }
    ]
  },
  robo_invest: {
    title: "Change Investment Option",
    buttonLabel: "Change investment option",
    pills: [
      { label: "Lower fees", icon: Percent },
      { label: "More diversified", icon: Compass },
      { label: "Easier access", icon: Unlock }
    ],
    guardrail: "OCBC RoboInvest provides ETF-based portfolios, automated portfolio management and multiple portfolios under one account.",
    alternatives: [
      {
        id: "alt_robo_defensive",
        name: "OCBC RoboInvest Defensive Portfolio",
        desc: "OCBC RoboInvest lower-volatility portfolio focusing on defensive global bonds and capital preservation.",
        rate: 0.050,
        type: "roboinvest portfolio",
        riskBand: "Capital Safety",
        tags: ["Lower fees", "Easier access"],
        fitText: "Protects capital from market volatility while maintaining automated portfolio rebalancing."
      },
      {
        id: "alt_robo_balanced",
        name: "OCBC RoboInvest Balanced Portfolio",
        desc: "OCBC RoboInvest balanced portfolio allocated across global equities, tech, and fixed income assets.",
        rate: 0.065,
        type: "roboinvest portfolio",
        riskBand: "Balanced",
        tags: ["More diversified", "Lower fees"],
        fitText: "Balances equity growth with capital protection across international markets."
      },
      {
        id: "alt_lion_income",
        name: "Lion-OCBC Global Income Fund",
        desc: "Allocates capital to high-quality dividend equities and corporate debt returning 5.20% p.a. monthly payouts.",
        rate: 0.052,
        type: "unit trust",
        riskBand: "Balanced",
        tags: ["More diversified", "Lower fees"],
        fitText: "Provides steady monthly income distributions to buffer against equity swings."
      },
      {
        id: "alt_robo_growth",
        name: "OCBC RoboInvest Growth Portfolio",
        desc: "Automated global equity ETF portfolio compounding wealth through broad market appreciation.",
        rate: 0.075,
        type: "roboinvest portfolio",
        riskBand: "Growth",
        tags: ["More diversified", "Easier access"],
        fitText: "Compounds wealth through global equity upside for long-term target timelines."
      },
      {
        id: "alt_us_dividend",
        name: "Lion-Global US Dividend Equity Fund",
        desc: "Focuses on premier US dividend growth stocks compounding at 7.80% p.a. average historical growth.",
        rate: 0.078,
        type: "unit trust",
        riskBand: "Growth",
        tags: ["More diversified"],
        fitText: "Captures US dividend growth to accelerate long-term capital accumulation."
      },
      {
        id: "alt_robo_dynamic",
        name: "OCBC RoboInvest Dynamic Growth Portfolio",
        desc: "High-conviction portfolio allocated to global innovation, semiconductors, and green energy ETFs.",
        rate: 0.085,
        type: "roboinvest portfolio",
        riskBand: "Aggressive Growth",
        tags: ["More diversified"],
        fitText: "Maximizes capital appreciation via high-conviction global growth themes."
      },
      {
        id: "alt_disruptive_innovation",
        name: "Lion Global Disruptive Innovation Fund",
        desc: "High-growth fund invested in global leaders reshaping AI, cloud computing, and next-gen tech.",
        rate: 0.090,
        type: "unit trust",
        riskBand: "Aggressive Growth",
        tags: ["More diversified"],
        fitText: "Targets maximum long-term upside by participating in global technological transformation."
      }
    ]
  },
  blue_chip: {
    title: "Change Investment Option",
    buttonLabel: "Change investment option",
    pills: [
      { label: "More diversified", icon: Compass },
      { label: "Lower monthly amount", icon: Percent },
      { label: "Different market exposure", icon: Droplet }
    ],
    guardrail: "BCIP supports recurring contributions from S$100 a month and offers eligible Singapore-listed shares and ETFs without a lock-in period.",
    alternatives: [
      {
        id: "alt_bcip_sreits",
        name: "OCBC BCIP Lion-Phillip S-REIT ETF",
        desc: "DCA into Singapore's top prime commercial and industrial real estate trusts for a 5.80% dividend yield.",
        rate: 0.058,
        type: "recurring investment",
        riskBand: "Balanced",
        tags: ["More diversified", "Different market exposure"],
        fitText: "Gains instant basket exposure to Singapore real estate investment trusts."
      },
      {
        id: "alt_bcip_sti",
        name: "OCBC BCIP SPDR Straits Times Index ETF",
        desc: "Dollar-cost average into Singapore's top 30 blue-chip companies starting from S$100/month.",
        rate: 0.055,
        type: "recurring investment",
        riskBand: "Balanced",
        tags: ["Lower monthly amount"],
        fitText: "Dollar-cost average into top dividend-paying SG blue chips with low monthly minimums."
      },
      {
        id: "alt_bcip_shares",
        name: "Singapore Blue-Chip Shares (DBS/OCBC/Singtel)",
        desc: "Direct regular savings into premier SGX banking and telecom counters with steady 5.20% dividend payouts.",
        rate: 0.052,
        type: "recurring investment",
        riskBand: "Growth",
        tags: ["Lower monthly amount"],
        fitText: "Builds equity ownership in Singapore's largest corporate market leaders."
      },
      {
        id: "alt_tech_innovation",
        name: "OCBC Global Tech & Innovation ETF",
        desc: "Invest in a basket of global technology and semiconductor leaders yielding an estimated 8.50% p.a.",
        rate: 0.085,
        type: "recurring investment",
        riskBand: "Aggressive Growth",
        tags: ["Different market exposure", "More diversified"],
        fitText: "Captures global tech sector expansion to supercharge portfolio growth."
      },
      {
        id: "alt_megatrends_equity",
        name: "OCBC Megatrends Equity Portfolio",
        desc: "Allocates recurring investment into global mega-trend themes including AI infrastructure and clean tech.",
        rate: 0.088,
        type: "recurring investment",
        riskBand: "Aggressive Growth",
        tags: ["More diversified"],
        fitText: "Aligns recurring savings with high-growth future economic shifts."
      }
    ]
  },
  protection: {
    title: "Change Protection Option",
    buttonLabel: "Change protection option",
    pills: [
      { label: "Lower premiums", icon: Percent },
      { label: "Medisave payable", icon: ShieldCheck },
      { label: "Broader coverage", icon: Compass }
    ],
    guardrail: "Ensure insurance protection keeps your financial runway secure from unexpected health events.",
    alternatives: [
      {
        id: "alt_supreme_standard",
        name: "GE GREAT SupremeHealth Standard",
        desc: "Basic Medisave-approved health shield plan protecting against large medical bills and hospital fees.",
        rate: 0.0,
        type: "protection",
        riskBand: "Capital Safety",
        tags: ["Lower premiums", "Medisave payable"],
        fitText: "Fully Medisave payable health cover keeping out-of-pocket cash overhead minimal."
      },
      {
        id: "alt_supreme_rider",
        name: "GE SupremeHealth H1 Rider Plan",
        desc: "Hospital co-payment rider protecting your cash savings by covering up to 90% of hospital bill co-payments.",
        rate: 0.0,
        type: "protection",
        riskBand: "Capital Safety",
        tags: ["Lower premiums", "Broader coverage"],
        fitText: "Covers cash co-payment caps so medical emergencies won't drain your nest egg."
      },
      {
        id: "alt_careshield_enhance",
        name: "GE GREAT CareShield Enhance Plus",
        desc: "Supplement to CareShield Life that boosts monthly payouts in case of disability, paid via Medisave.",
        rate: 0.0,
        type: "protection",
        riskBand: "Capital Safety",
        tags: ["Medisave payable", "Broader coverage"],
        fitText: "Enhances long-term disability protection using Medisave without impacting monthly cash flow."
      }
    ]
  }
};

const PlanChangeOptionPage = () => {
  const {
    activePlanId,
    setPage,
    changingCategory,
    setChangingCategory,
    changingAction,
    setChangingAction,
    chosenAlternatives,
    setChosenAlternatives,
    setPendingExcluded,
    customPlanData,
    planDrafts,
    riskProfile,
    housingPropertyType
  } = useApp();

  const getActivePlan = () => {
    let basePlan = (activePlanId && PLANS_DATA[activePlanId]) ? PLANS_DATA[activePlanId] : PLANS_DATA.default;
    if (activePlanId === 'housing' && PLANS_DATA.housing?.getByType) {
      basePlan = PLANS_DATA.housing.getByType(housingPropertyType || 'hdb');
    }
    const planMeta = (activePlanId && customPlanData[activePlanId]) || (activePlanId && planDrafts[activePlanId]) || {};
    return {
      ...basePlan,
      targetDate: planMeta.targetDate || planMeta.goalDate || basePlan.timelineAll,
    };
  };

  const activePlan = getActivePlan();
  const displayGoalTitle = activePlan.title;

  const ctxKey = getActionContext(changingCategory, changingAction);
  const currentConfig = CONTEXT_CONFIG[ctxKey] || CONTEXT_CONFIG.deposit;

  const reasonChips = currentConfig.pills;
  const [selectedReasons, setSelectedReasons] = useState([]);

  const handleToggleReason = (label) => {
    setSelectedReasons(prev => {
      if (prev.includes(label)) {
        return prev.filter(r => r !== label);
      } else {
        return [...prev, label];
      }
    });
  };

  const allAltsInCategory = currentConfig.alternatives;

  let filteredAlts = allAltsInCategory;
  if (selectedReasons.length > 0) {
    const matched = allAltsInCategory.filter(alt =>
      alt.tags && selectedReasons.some(reason => alt.tags.includes(reason))
    );
    if (matched.length > 0) {
      filteredAlts = [...matched].sort((a, b) => {
        const countA = a.tags.filter(t => selectedReasons.includes(t)).length;
        const countB = b.tags.filter(t => selectedReasons.includes(t)).length;
        return countB - countA;
      });
    }
  }

  // Sort/prioritize alternatives that match the user's risk profile
  filteredAlts = useMemo(() => {
    return [...filteredAlts].sort((a, b) => {
      const isAMatch = a.riskBand === riskProfile;
      const isBMatch = b.riskBand === riskProfile;
      if (isAMatch && !isBMatch) return -1;
      if (!isAMatch && isBMatch) return 1;
      return 0;
    });
  }, [filteredAlts, riskProfile]);

  const [selectedAltId, setSelectedAltId] = useState("");

  useEffect(() => {
    if (filteredAlts.length > 0 && !filteredAlts.some(a => a.id === selectedAltId)) {
      setSelectedAltId(filteredAlts[0].id);
    }
  }, [filteredAlts, selectedAltId]);

  const selectedAlt = filteredAlts.find(a => a.id === selectedAltId) || filteredAlts[0];

  const handleSelectOption = (overrideAlt) => {
    const targetAlt = overrideAlt || selectedAlt;
    if (!changingAction || !targetAlt) return;

    setPendingExcluded(prev => {
      const next = new Set(prev);
      next.add(changingAction.id);
      return next;
    });

    setChosenAlternatives(prev => ({
      ...prev,
      [changingAction.id]: targetAlt
    }));

    setChangingAction(null);
    setChangingCategory(null);
    setPage('plan-details');
  };

  const handleCancel = () => {
    setChangingAction(null);
    setChangingCategory(null);
    setPage('plan-details');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F5F5F7] relative overflow-hidden select-none text-left">
      <BackgroundOrb color="pink" size="300px" className="-top-12 -left-12" />
      <BackgroundOrb color="blue" size="250px" className="bottom-20 -right-10" />

      {/* Header */}
      <header className="pt-6 pb-2 h-auto w-full bg-white/60 backdrop-blur-xl border-b border-zinc-200/40 px-4 flex items-center justify-between shrink-0 z-40 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200/50 flex items-center justify-center text-zinc-700 active:scale-90 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-[18px] h-[18px] stroke-[2.2]" />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">NEST ADVISORY BOARD</span>
            <span className="text-sm font-black text-zinc-900 tracking-tight mt-0.5">{displayGoalTitle}</span>
          </div>
        </div>
        <button
          onClick={handleCancel}
          className="w-9 h-9 rounded-full bg-white border border-zinc-200/50 flex items-center justify-center text-zinc-700 active:scale-90 transition-all duration-150 cursor-pointer shadow-sm"
        >
          <X className="w-[18px] h-[18px] stroke-[2.2]" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-4 z-10 pb-64 touch-pan-y min-h-0">
        
        {/* Sub-header Title */}
        <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-none mt-1">
          {currentConfig.title}
        </h1>

        {/* Action being updated info card */}
        {changingAction && (
          <div className="bg-white/90 border border-zinc-200/60 p-3.5 rounded-[20px] flex items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-wider">Currently Selected</span>
              <span className="text-xs font-black text-zinc-900">{changingAction.name}</span>
            </div>
            <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 uppercase tracking-wider">
              {changingCategory?.name || 'Current'}
            </span>
          </div>
        )}

        {/* Guardrail & Context Callout */}
        {currentConfig.guardrail && (
          <div className="bg-emerald-50/80 border border-emerald-200/60 p-3.5 rounded-[20px] flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[9px] font-black text-emerald-900 uppercase tracking-wider">Guardrail & Guidelines</span>
              <p className="text-[9.5px] font-semibold text-emerald-800 leading-relaxed">
                {currentConfig.guardrail}
              </p>
            </div>
          </div>
        )}

        {/* Simplified Pills Category Selection */}
        <div className="flex flex-col gap-2 shrink-0 mt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10.5px] font-black text-zinc-800 tracking-tight">Select preference filter:</span>
            <span className="text-[8.5px] font-medium text-zinc-400 leading-normal">
              Tap a category pill below to filter alternatives based on your defensive preference.
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 py-1">
            {reasonChips.map((chip) => {
              const IconComponent = chip.icon;
              const isActive = selectedReasons.includes(chip.label);
              
              return (
                <button
                  key={chip.label}
                  onClick={() => handleToggleReason(chip.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9.5px] font-bold border transition-all duration-150 cursor-pointer select-none shrink-0 ${
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary border-brand-primary shadow-[0_2px_10px_rgba(225,29,72,0.12)] font-black scale-102'
                      : 'bg-white text-zinc-600 border-zinc-200/80 hover:border-zinc-300 hover:text-zinc-800'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-2.5 mt-1">
          <div className="flex flex-col gap-3">
            {filteredAlts.length === 0 ? (
              <div className="bg-white/80 border border-zinc-200/50 rounded-[24px] p-6 text-center flex flex-col items-center justify-center gap-3 shadow-xs backdrop-blur-md">
                <Info className="w-7 h-7 text-zinc-400" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black text-zinc-800">No exact matches found</span>
                  <p className="text-[9.5px] text-zinc-500 font-semibold leading-relaxed max-w-[250px] mx-auto">
                    Try choosing a different combination of reasons or deselecting filters to view all options.
                  </p>
                </div>
              </div>
            ) : (
              filteredAlts.map((alt, idx) => {
                const isChosen = selectedAlt?.id === alt.id;
                const isAiRecommended = idx === 0;
                
                return (
                  <div
                    key={alt.id}
                    onClick={() => setSelectedAltId(alt.id)}
                    className={`p-4 rounded-[24px] border text-left flex flex-col gap-3 transition-all duration-200 bg-white cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.02)] ${
                      isChosen
                        ? 'border-brand-primary ring-1 ring-brand-primary/20 shadow-md shadow-brand-primary/5'
                        : 'border-zinc-200/60 hover:border-zinc-300'
                    }`}
                  >
                    {/* Card Header Info */}
                    <div className="flex gap-3 justify-between items-start w-full">
                      <div className="flex gap-3 items-start">
                        {/* Radio Indicator */}
                        <div className="mt-1 shrink-0">
                          {isChosen ? (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-brand-primary flex items-center justify-center">
                              <div className="w-[8px] h-[8px] rounded-full bg-brand-primary" />
                            </div>
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full border-2 border-zinc-200" />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isAiRecommended && (
                              <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                                Recommended
                              </span>
                            )}
                            {alt.riskBand && (
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                                alt.riskBand === 'Capital Safety' ? 'bg-teal-50 text-teal-800 border-teal-200/60' :
                                alt.riskBand === 'Balanced' ? 'bg-amber-50 text-amber-800 border-amber-200/60' :
                                alt.riskBand === 'Growth' ? 'bg-purple-50 text-purple-800 border-purple-200/60' :
                                'bg-rose-50 text-rose-800 border-rose-200/60'
                              }`}>
                                {alt.riskBand}
                              </span>
                            )}
                            {alt.riskBand === riskProfile && (
                              <span className="text-[8px] font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200/80 rounded flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5 text-indigo-600" />
                                Fits {riskProfile}
                              </span>
                            )}
                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded uppercase tracking-wider">
                              {alt.type || 'Option'}
                            </span>
                          </div>
                          <span className="text-xs font-black text-zinc-900 tracking-tight mt-1">{alt.name}</span>
                        </div>
                      </div>

                      {/* Yield/Rate Display if applicable */}
                      {(alt.rate !== undefined && alt.rate > 0) && (
                        <div className="text-right flex flex-col items-end shrink-0">
                          <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none">Up to</span>
                          <span className="text-xs font-black text-emerald-600 tracking-tight mt-0.5">
                            {(alt.rate * 100).toFixed(2)}%
                          </span>
                          <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-0.5">p.a.</span>
                        </div>
                      )}
                      {alt.rateText && (
                        <div className="text-right flex flex-col items-end shrink-0">
                          <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none">Yield</span>
                          <span className="text-[10px] font-black text-emerald-700 tracking-tight mt-0.5">
                            {alt.rateText}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="pl-7 flex flex-col gap-2">
                      <p className="text-[9.5px] text-zinc-500 font-medium leading-relaxed">
                        {alt.desc}
                      </p>

                      {/* Spark fits label */}
                      <div className="flex items-start gap-1.5 text-[8.5px] font-semibold text-zinc-700 bg-zinc-50 rounded-xl p-2 border border-zinc-100">
                        <Sparkles className="w-3 h-3 text-brand-primary shrink-0 mt-0.5" />
                        <span>
                          <strong>Personalized Fit:</strong> {alt.fitText || "Aligned with your target schedule and risk criteria."}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Informational callout banner */}
        <div className="bg-blue-50/50 border border-blue-200/40 rounded-[20px] p-3 flex gap-2.5 items-center mt-2 shrink-0">
          <Info className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-[9.5px] font-bold text-blue-700 leading-normal">
            Your other plan components remain unchanged. Target timeline and contribution rules are preserved.
          </span>
        </div>

      </div>

      {/* Sub-page Sticky Footer CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200/40 p-4 flex flex-col gap-2 z-40"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          disabled={!selectedAlt}
          onClick={() => handleSelectOption()}
          className={`w-full py-3.5 text-white font-extrabold rounded-2xl text-[11px] uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md cursor-pointer text-center ${
            selectedAlt
              ? 'bg-brand-primary hover:bg-brand-primary/95'
              : 'bg-zinc-300 cursor-not-allowed shadow-none text-zinc-500'
          }`}
        >
          {currentConfig.buttonLabel}
        </button>
        <button
          onClick={handleCancel}
          className="text-center text-[10px] font-bold text-brand-primary hover:underline cursor-pointer py-1"
        >
          Keep current option
        </button>
      </div>
    </div>
  );
};

export default PlanChangeOptionPage;
