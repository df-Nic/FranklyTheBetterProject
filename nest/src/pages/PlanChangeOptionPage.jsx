import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Landmark,
  Zap,
  CheckCircle2,
  Check
} from 'lucide-react';
import { PLANS_DATA, PLAN_ALTERNATIVES } from '../data/planTemplates';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import CardDeckCarousel from '../components/ui/CardDeckCarousel';
import { getOptimizedCardsForPlan } from '../data/ocbcCards';
import { getOptimizedDepositsForPlan } from '../data/ocbcDeposits';

// Category Helper
const getCategoryType = (changingCategory, changingAction) => {
  const catId = (changingCategory?.id || '').toLowerCase();
  const catName = (changingCategory?.name || '').toLowerCase();
  const actType = (changingAction?.type || '').toLowerCase();
  
  // Investments category or action type checks
  if (catId.includes('invest') || catName.includes('invest') || actType === 'investment') {
    return 'investment';
  }
  
  // Insurance / Protection category or action type checks
  if (catId.includes('insur') || catId.includes('protect') || catName.includes('insur') || catName.includes('protect') || actType === 'defense' || actType === 'insurance' || actType === 'protection') {
    return 'protection';
  }

  // Deposits / Grants / Savings checks
  if (catId.includes('deposit') || catName.includes('deposit') || actType === 'deposit' || actType === 'yield' || actType === 'grant' || actType === 'saving') {
    return 'deposit';
  }
  
  return 'deposit';
};

// Category Specific Unique Reasons Map
const REASONS_MAP = {
  deposit: [
    { label: "Higher interest yield", icon: Percent },
    { label: "Access cash anytime (Liquidity)", icon: Droplet },
    { label: "No lock-in period", icon: Lock },
    { label: "Government-backed safety", icon: ShieldCheck },
    { label: "Flexibility to top-up", icon: MoreHorizontal }
  ],
  investment: [
    { label: "Higher growth potential", icon: Percent },
    { label: "Dividends & passive income", icon: Droplet },
    { label: "Diversified global markets", icon: Compass },
    { label: "Lower management fees", icon: Lock },
    { label: "Dynamic automated rebalancing", icon: MoreHorizontal }
  ],
  protection: [
    { label: "Comprehensive cover limits", icon: ShieldCheck },
    { label: "Pay via CPF Medisave", icon: Lock },
    { label: "Lower premium costs", icon: Percent },
    { label: "Critical illness add-ons", icon: Compass },
    { label: "Lump-sum payout options", icon: MoreHorizontal }
  ]
};

// Rich dynamic alternatives database
const ALTERNATIVES_DATABASE = {
  deposit: [
    {
      id: "alt_ocbc360",
      name: "OCBC 360 Account",
      desc: "High-yield daily-liquid savings account earning bonus interest for salary credits and monthly savings.",
      rate: 0.0765,
      type: "deposit",
      tags: ["Higher interest yield", "Access cash anytime (Liquidity)", "No lock-in period", "Flexibility to top-up"]
    },
    {
      id: "alt_bonus_plus",
      name: "OCBC Bonus+ Savings Account",
      desc: "Special savings account rewarding regular monthly savers with bonus interest rates up to 4.15% p.a.",
      rate: 0.0415,
      type: "deposit",
      tags: ["Higher interest yield", "No lock-in period", "Flexibility to top-up"]
    },
    {
      id: "alt_fd_promo_6m",
      name: "OCBC Fixed Deposit (6M)",
      desc: "Earn a guaranteed 3.35% p.a. interest rate with capital fully protected during a 6-month term.",
      rate: 0.0335,
      type: "deposit",
      tags: ["Higher interest yield", "Government-backed safety"]
    },
    {
      id: "alt_premier_div",
      name: "OCBC Premier Dividend Account",
      desc: "Premier wealth tier account offering up to 3.85% p.a. and seamless multi-currency FX liquidity.",
      rate: 0.0385,
      type: "deposit",
      tags: ["Higher interest yield", "Access cash anytime (Liquidity)", "Flexibility to top-up"]
    },
    {
      id: "alt_frank_saver",
      name: "OCBC FRANK Savings Account",
      desc: "Digital-first savings account with sub-pockets, card round-up micro-savings, and zero min balance.",
      rate: 0.025,
      type: "deposit",
      tags: ["Access cash anytime (Liquidity)", "No lock-in period", "Flexibility to top-up"]
    },
    {
      id: "alt_lion_liq",
      name: "Lion-OCBC Enhanced Liquidity Fund",
      desc: "A high-yielding cash management fund targeting ~3.85% p.a. returns with daily liquidity.",
      rate: 0.0385,
      type: "deposit",
      tags: ["Higher interest yield", "Access cash anytime (Liquidity)", "No lock-in period"]
    },
    {
      id: "alt_foreign_curr",
      name: "OCBC Global Savings Account",
      desc: "Multi-currency foreign exchange deposit account earning up to 5.20% p.a. on USD balances.",
      rate: 0.052,
      type: "deposit",
      tags: ["Higher interest yield", "Access cash anytime (Liquidity)"]
    }
  ],
  investment: [
    {
      id: "alt_robo_aggressive",
      name: "OCBC RoboInvest (Aggressive Growth)",
      desc: "A dynamically rebalanced portfolio focusing on US tech equities and global ETFs for maximum growth.",
      rate: 0.072,
      type: "investment",
      tags: ["Higher growth potential", "Diversified global markets", "Dynamic automated rebalancing"]
    },
    {
      id: "alt_lion_global_core",
      name: "Lion-OCBC Global Core Fund (Balanced)",
      desc: "Diversified unit trust holding global equities and fixed income to secure steady growth with low fee overheads.",
      rate: 0.065,
      type: "investment",
      tags: ["Higher growth potential", "Diversified global markets", "Lower management fees"]
    },
    {
      id: "alt_bcip_banks",
      name: "OCBC BCIP Blue Chip Share Plan",
      desc: "Regular savings plan investing in top SG banks & blue chips to secure steady, compounding dividends.",
      rate: 0.055,
      type: "investment",
      tags: ["Higher growth potential", "Dividends & passive income", "Lower management fees"]
    },
    {
      id: "alt_bcip_reits",
      name: "OCBC BCIP Lion-Phillip S-REIT ETF",
      desc: "Dollar-cost average into premium Singapore real estate portfolios to generate monthly passive dividend yields.",
      rate: 0.058,
      type: "investment",
      tags: ["Dividends & passive income", "Lower management fees", "Diversified global markets"]
    }
  ],
  protection: [
    {
      id: "alt_supreme_standard",
      name: "GE GREAT SupremeHealth Standard",
      desc: "Basic Medisave-approved health shield plan protecting against large medical bills and hospital fees.",
      rate: 0.0,
      type: "protection",
      tags: ["Comprehensive cover limits", "Pay via CPF Medisave", "Lower premium costs"]
    },
    {
      id: "alt_supreme_rider",
      name: "GE SupremeHealth H1 Rider Plan",
      desc: "Hospital co-payment rider protecting your cash savings by covering up to 90% of hospital bill co-payments.",
      rate: 0.0,
      type: "protection",
      tags: ["Comprehensive cover limits", "Lower premium costs"]
    },
    {
      id: "alt_careshield_enhance",
      name: "GE GREAT CareShield Enhance Plus",
      desc: "Supplement to CareShield Life that boosts monthly payouts in case of disability, paid via Medisave.",
      rate: 0.0,
      type: "protection",
      tags: ["Comprehensive cover limits", "Pay via CPF Medisave"]
    }
  ]
};

const generateFitDescription = (alt, activePlan, selectedReasons) => {
  const age = 28;
  const riskProfile = "Balanced Wealth";
  const stageOfLife = "Young Professional";
  const planTitle = activePlan?.title || "Nest Plan";
  const timeline = activePlan?.timelineAll || "medium-term";

  let text = `Excellent match for you (Age ${age}, ${stageOfLife}) with a ${riskProfile} risk profile. `;
  
  if (alt.type === 'deposit') {
    text += `Aligns with your ${planTitle} timeline (${timeline}) by keeping assets protected from short-term market volatility. `;
    if (selectedReasons.includes("Access cash anytime (Liquidity)") || selectedReasons.includes("No lock-in period")) {
      text += `Directly addresses your request for liquidity and flexibility, letting you withdraw or redirect funds without penalty. `;
    } else if (selectedReasons.includes("Higher interest yield")) {
      text += `Optimizes your deposit returns up to ${(alt.rate * 100).toFixed(2)}% p.a. while keeping capital 100% secure. `;
    } else {
      text += `Provides a stable, liquid foundation for your regular contributions. `;
    }
  } else if (alt.type === 'investment') {
    text += `Fits your long-term ${planTitle} horizon by compounding wealth through global markets. `;
    if (selectedReasons.includes("Higher growth potential")) {
      text += `Positions your portfolio to capture aggressive equity upside targeting ${(alt.rate * 100).toFixed(2)}% p.a. growth. `;
    } else if (selectedReasons.includes("Dividends & passive income")) {
      text += `Focuses on steady cash-flow distributions to supplement your plan's progress. `;
    } else {
      text += `Maintains consistent dollar-cost averaging to buffer against entry timing risks. `;
    }
  } else if (alt.type === 'protection') {
    text += `Secures your financial runway and protects your ${planTitle} from unexpected disruption. `;
    if (selectedReasons.includes("Pay via CPF Medisave")) {
      text += `Allows premium funding via Medisave to preserve your cash flow for active investments. `;
    } else if (selectedReasons.includes("Lower premium costs")) {
      text += `Optimizes coverage limits to lower premium overhead by up to 15%, keeping your savings rate high. `;
    } else {
      text += `Provides a comprehensive safety net so medical expenses won't erode your savings milestones. `;
    }
  }
  
  return text;
};

const getPlanImpact = (action, alternative, plan) => {
  if (!action || !alternative) return null;

  // Fallback dynamic computation
  const originalRate = action.rate || 0.03;
  const alternativeRate = alternative.rate || 0.03;
  const rateDiff = alternativeRate - originalRate;
  
  const baseProb = 86;
  const probChange = Math.round(rateDiff * 100 * 1.5);
  const afterProb = baseProb + probChange;
  const probDiffText = probChange > 0 ? `+${probChange}pp` : probChange < 0 ? `${probChange}pp` : "No change";
  const probPositive = probChange >= 0;

  const baseTimeline = 24;
  const timelineChange = -Math.round(rateDiff * 100 * 0.5);
  const afterTimeline = baseTimeline + timelineChange;
  const timelineDiffText = timelineChange > 0 ? `+${timelineChange} month${timelineChange > 1 ? 's' : ''}` : timelineChange < 0 ? `${timelineChange} month${timelineChange < -1 ? 's' : ''}` : "No change";
  const timelinePositive = timelineChange <= 0;

  const baseSaving = 2500;
  const savingChange = -Math.round(rateDiff * 100 * 30);
  const afterSaving = baseSaving + savingChange;
  const savingDiffText = savingChange > 0 ? `+$${savingChange}` : savingChange < 0 ? `-$${Math.abs(savingChange)}` : "No change";
  const savingPositive = savingChange <= 0;

  return {
    fundingProbability: {
      before: `${baseProb}%`,
      after: `${afterProb}%`,
      diff: probDiffText,
      isPositive: probPositive
    },
    targetTimeline: {
      before: `${baseTimeline}`,
      after: `${afterTimeline} months`,
      diff: timelineDiffText,
      isPositive: timelinePositive
    },
    monthlySaving: {
      before: `$${baseSaving.toLocaleString()}`,
      after: `$${afterSaving.toLocaleString()}`,
      diff: savingDiffText,
      isPositive: savingPositive
    }
  };
};

const PlanChangeOptionPage = () => {
  const {
    activePlanId,
    setPage,
    changingAction,
    setChangingAction,
    changingCategory,
    setChangingCategory,
    chosenAlternatives,
    setChosenAlternatives,
    setPendingExcluded,
    customPlanData
  } = useApp();

  // Identify active plan template
  const getActivePlan = () => {
    if (activePlanId && PLANS_DATA[activePlanId]) return PLANS_DATA[activePlanId];
    return PLANS_DATA.default;
  };

  const activePlan = getActivePlan();
  const displayGoalTitle = activePlan.title;
  const userPlanMeta = (activePlan && customPlanData[activePlan.id]) || {};

  // Detect category type to fetch appropriate reasons
  const catType = getCategoryType(changingCategory, changingAction);
  const reasonChips = REASONS_MAP[catType] || REASONS_MAP.deposit;

  // Container height locking to prevent shrink/collapse during curtain transition
  const containerRef = useRef(null);
  const [lockedHeight, setLockedHeight] = useState(null);

  // Deck carousel view mode: 'deposits' or 'cards'
  const [deckMode, setDeckMode] = useState('deposits');
  const [curtainPhase, setCurtainPhase] = useState('idle'); // 'idle' | 'covering' | 'revealing'
  const [deckActiveIndex, setDeckActiveIndex] = useState(0);

  // Recommended products optimized for active plan
  const recommendedDeposits = useMemo(() => {
    return getOptimizedDepositsForPlan(activePlan.id, activePlan);
  }, [activePlan]);

  const recommendedCards = useMemo(() => {
    return getOptimizedCardsForPlan(activePlan.id, activePlan);
  }, [activePlan]);

  const deckItems = deckMode === 'deposits' ? recommendedDeposits : recommendedCards;
  const activeDeckItem = deckItems[deckActiveIndex] || deckItems[0];

  const handleSwitchDeckMode = (newMode) => {
    if (newMode === deckMode || curtainPhase !== 'idle') return;

    if (containerRef.current) {
      setLockedHeight(containerRef.current.offsetHeight);
    }
    setCurtainPhase('covering');

    setTimeout(() => {
      setDeckMode(newMode);
      setDeckActiveIndex(0);
      setCurtainPhase('revealing');

      requestAnimationFrame(() => {
        if (containerRef.current) {
          setLockedHeight(containerRef.current.scrollHeight);
        }
      });
    }, 240);

    setTimeout(() => {
      setCurtainPhase('idle');
      setLockedHeight(null);
    }, 480);
  };

  // Multi-select selectedReasons state
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

  // Get dynamic pool of alternatives from the database for the active category
  const allAltsInCategory = ALTERNATIVES_DATABASE[catType] || [];

  // Filter and sort alternatives based on selected reasons matching alternative tags
  let filteredAlts = [];
  if (selectedReasons.length > 0) {
    filteredAlts = allAltsInCategory.filter(alt => {
      return alt.tags && selectedReasons.every(reason => alt.tags.includes(reason));
    });

    filteredAlts = filteredAlts.filter(alt => {
      const normAltName = alt.name.toLowerCase();
      const normOrigName = (changingAction?.name || '').toLowerCase();
      
      if (normAltName === normOrigName) return false;
      return true;
    });

    filteredAlts.sort((a, b) => {
      const matchA = a.tags.filter(tag => selectedReasons.includes(tag)).length;
      const matchB = b.tags.filter(tag => selectedReasons.includes(tag)).length;
      return matchB - matchA;
    });
  }

  // Fallback initial alt
  const defaultInitialAlt = filteredAlts[0];
  const currentInitialAlt = changingAction ? (chosenAlternatives[changingAction.id] || defaultInitialAlt) : null;
  const [selectedAltId, setSelectedAltId] = useState(currentInitialAlt ? currentInitialAlt.id : "");

  useEffect(() => {
    if (filteredAlts.length > 0 && !filteredAlts.some(a => a.id === selectedAltId)) {
      setSelectedAltId(filteredAlts[0].id);
    }
  }, [filteredAlts, selectedAltId]);

  const selectedAlt = filteredAlts.find(a => a.id === selectedAltId) || filteredAlts[0] || {
    id: activeDeckItem?.id || 'alt_ocbc360',
    name: activeDeckItem?.name || 'OCBC 360 Account',
    desc: activeDeckItem?.tagline || 'High-yield deposit savings account',
    rate: 0.0465,
    type: deckMode === 'deposits' ? 'deposit' : 'card'
  };

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

  if (!changingAction) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#F5F5F7] px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-zinc-400 shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-sm font-black text-zinc-900">No product selected</h1>
        <p className="mt-1 max-w-[250px] text-[10px] font-medium leading-relaxed text-zinc-500">
          Return to the plan and choose “Change product” on the recommendation you want to replace.
        </p>
        <button
          onClick={() => setPage('plan-details')}
          className="mt-5 rounded-xl bg-brand-primary px-5 py-2.5 text-[10px] font-black text-white shadow-sm active:scale-95"
        >
          Back to plan
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F5F5F7] relative overflow-hidden select-none text-left">
      {/* Background Orbs */}
      <BackgroundOrb color="pink" size="300px" className="-top-12 -left-12" />
      <BackgroundOrb color="blue" size="250px" className="bottom-20 -right-10" />

      {/* Sub-page Header */}
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

      {/* Sub-page Scroll Content - Unconstrained scrolling with clear bottom clearance */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-4 z-10 pb-64 touch-pan-y min-h-0">
        
        {/* Title */}
        <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-none mt-1">
          Change {changingCategory?.name ? (changingCategory.name.endsWith('s') ? changingCategory.name.slice(0, -1) : changingCategory.name) : 'Product'} Option
        </h1>

        {/* Top explanation box */}
        <div className="bg-white/70 border border-white/80 p-4 rounded-[24px] flex gap-3.5 items-start shadow-[0_2px_12px_rgba(0,0,0,0.02)] backdrop-blur-md">
          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0 shadow-inner">
            <Compass className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-semibold text-zinc-600 leading-relaxed">
              Explore recommended deposit accounts & credit cards to optimize your financial plan.
            </p>
          </div>
        </div>

        {/* Visual 3D Card Recommendations Deck - Dynamic Auto Height & Conditional Overflow */}
        <div
          ref={containerRef}
          style={lockedHeight ? { minHeight: `${lockedHeight}px` } : {}}
          className={`w-full bg-white rounded-3xl p-4 shadow-sm border border-zinc-200/60 flex flex-col gap-3 relative transition-[min-height] duration-300 ease-out ${curtainPhase !== 'idle' ? 'overflow-hidden' : 'overflow-visible'}`}
        >
          
          {/* Horizontal Container Curtain Scope Transition Overlay */}
          <AnimatePresence>
            {curtainPhase !== 'idle' && (
              <motion.div
                key="full-plan-card-box-horizontal-curtain"
                initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                animate={{
                  clipPath: curtainPhase === 'covering'
                    ? 'inset(0% 0% 0% 0%)'
                    : 'inset(0% 0% 0% 100%)'
                }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 z-50 bg-gradient-to-r from-[#E1251B] via-[#C62828] to-[#8E0000] rounded-3xl shadow-2xl pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex flex-col">
              <span className="text-[10.5px] font-black text-zinc-400 uppercase tracking-wider">
                {deckMode === 'deposits' ? 'Recommended Deposit Accounts' : 'Recommended Credit Cards'}
              </span>
            </div>

            {/* Curtain Scope Mode Switcher Button */}
            <div className="bg-zinc-100 p-0.5 rounded-full flex items-center border border-zinc-200/80 shadow-inner z-10">
              <button
                onClick={() => handleSwitchDeckMode('deposits')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold transition-all duration-300 cursor-pointer ${
                  deckMode === 'deposits'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Landmark className="w-3 h-3" />
                <span>Deposits</span>
              </button>
              <button
                onClick={() => handleSwitchDeckMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold transition-all duration-300 cursor-pointer ${
                  deckMode === 'cards'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <CreditCard className="w-3 h-3" />
                <span>Cards</span>
              </button>
            </div>
          </div>

          {/* 3D Visual Deck Carousel */}
          <div className="w-full py-1">
            <CardDeckCarousel
              cards={deckItems}
              activeIndex={deckActiveIndex}
              onChangeIndex={(newIdx) => setDeckActiveIndex(newIdx)}
            />
          </div>

          {/* Active Item Recommendation Reason Breakdown */}
          {activeDeckItem && (
            <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100 bg-zinc-50/50 p-3.5 rounded-2xl border border-zinc-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                    {activeDeckItem.matchScore || 96}% Plan Match
                  </span>
                  <span className="text-[9px] font-bold text-zinc-400">
                    {activeDeckItem.extraContributions}
                  </span>
                </div>
                <span className="text-xs font-black text-red-600">
                  {activeDeckItem.headlineRate}
                </span>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-xs font-black text-zinc-900 leading-snug">{activeDeckItem.name}</h3>
                <p className="text-[9.5px] font-medium text-zinc-600 leading-relaxed">
                  {activeDeckItem.headlineReason}
                </p>
              </div>

              {/* Specific Reasons why this is recommended */}
              <div className="flex flex-col gap-1.5 mt-1">
                <span className="text-[8.5px] font-black uppercase tracking-wider text-zinc-400">Why this is recommended:</span>
                {activeDeckItem.specificReasons && activeDeckItem.specificReasons.map((reason, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-2 text-[9.5px] font-semibold text-zinc-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {/* Quick Select Button for Card Deck Item */}
              <button
                onClick={() => {
                  const altObj = {
                    id: activeDeckItem.id,
                    name: activeDeckItem.name,
                    desc: activeDeckItem.tagline || activeDeckItem.headlineReason,
                    rate: activeDeckItem.rewardsType === 'interest' ? 0.0465 : 0.03,
                    type: deckMode === 'deposits' ? 'deposit' : 'card'
                  };
                  handleSelectOption(altObj);
                }}
                className="mt-2 w-full py-2.5 rounded-xl bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm hover:bg-red-700 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Select {activeDeckItem.name}</span>
              </button>
            </div>
          )}
        </div>

        {/* Chips Filter Section */}
        <div className="flex flex-col gap-2 shrink-0 mt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10.5px] font-black text-zinc-800 tracking-tight">Why would you like to change? (Select all that apply)</span>
            <span className="text-[8.5px] font-medium text-zinc-400 leading-normal">
              Please choose one or more reasons. Your options will dynamically filter and update below as you make selections.
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold border transition-all duration-150 cursor-pointer select-none shrink-0 ${
                    isActive
                      ? 'bg-brand-primary/5 text-brand-primary border-brand-primary shadow-[0_2px_10px_rgba(225,29,72,0.08)] font-extrabold'
                      : 'bg-white text-zinc-500 border-zinc-200/80 hover:border-zinc-300 hover:text-zinc-700'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alternatives block */}
        <div className="flex flex-col gap-2.5 mt-1">
          {selectedReasons.length > 0 && (
            <div className="flex flex-col gap-0.5">
              <span className="text-[10.5px] font-black text-zinc-800 tracking-tight">Here are {filteredAlts.length} alternative options</span>
              <span className="text-[9.5px] font-medium text-zinc-400 leading-none mt-0.5">
                We recommend options matching your criteria and profile.
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {selectedReasons.length === 0 ? (
              <div className="bg-white/80 border border-zinc-200/50 rounded-[24px] p-6 text-center flex flex-col items-center justify-center gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] backdrop-blur-md">
                <Sparkles className="w-7 h-7 text-brand-primary animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black text-zinc-800">Select reasons above or pick from recommendations above</span>
                  <p className="text-[9.5px] text-zinc-500 font-semibold leading-relaxed max-w-[250px] mx-auto">
                    Choose one of the recommended cards/accounts above or select criteria chips to filter specific options.
                  </p>
                </div>
              </div>
            ) : filteredAlts.length === 0 ? (
              <div className="bg-white/80 border border-zinc-200/50 rounded-[24px] p-6 text-center flex flex-col items-center justify-center gap-3 shadow-[0_2px_12px_rgba(0,0,0,0.01)] backdrop-blur-md">
                <Info className="w-7 h-7 text-zinc-400" />
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-black text-zinc-800">No exact matches found</span>
                  <p className="text-[9.5px] text-zinc-500 font-semibold leading-relaxed max-w-[250px] mx-auto">
                    Try choosing a different combination of reasons or deselecting some filters to display related options.
                  </p>
                </div>
              </div>
            ) : (
              filteredAlts.map((alt, idx) => {
                const isChosen = selectedAlt?.id === alt.id;
                const isAiRecommended = idx === 0;
                const impact = getPlanImpact(changingAction, alt, activePlan);
                const fitDescription = generateFitDescription(alt, activePlan, selectedReasons);
                
                return (
                  <div
                    key={alt.id}
                    onClick={() => setSelectedAltId(alt.id)}
                    className={`p-4 rounded-[24px] border text-left flex flex-col gap-3.5 transition-all duration-200 bg-white cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.02)] ${
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
                          <div className="flex items-center gap-1.5">
                            {isAiRecommended && (
                              <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                                AI Recommended
                              </span>
                            )}
                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-100 text-zinc-500 rounded uppercase tracking-wider">
                              {changingCategory?.name ? (changingCategory.name.endsWith('s') ? changingCategory.name.slice(0, -1) : changingCategory.name) : 'PRODUCT'}
                            </span>
                          </div>
                          <span className="text-xs font-black text-zinc-900 tracking-tight mt-1">{alt.name}</span>
                        </div>
                      </div>

                      {/* Rate Display */}
                      <div className="text-right flex flex-col items-end shrink-0">
                        <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none">Up to</span>
                        <span className="text-xs font-black text-emerald-600 tracking-tight mt-0.5">
                          {alt.rate === 0 ? 'N/A' : `${(alt.rate * 100).toFixed(2)}%`}
                        </span>
                        <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none mt-0.5">p.a.</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="pl-7 flex flex-col">
                      <p className="text-[9.5px] text-zinc-500 font-medium leading-relaxed">
                        {alt.desc}
                      </p>

                      {/* Spark fits label */}
                      <div className="mt-2.5 flex items-start gap-1.5 text-[8.5px] font-semibold text-zinc-600 bg-zinc-50/50 rounded-lg p-2 border border-zinc-100/50 self-start">
                        <Sparkles className="w-2.5 h-2.5 text-brand-primary/80 shrink-0 mt-0.5" />
                        <span>
                          <strong>Personalized Fit:</strong> {fitDescription}
                        </span>
                      </div>

                      {/* Table Plan Impact */}
                      {impact && (
                        <div className="mt-3.5 border border-zinc-200/40 rounded-2xl overflow-hidden bg-zinc-50/50">
                          <div className="grid grid-cols-3 divide-x divide-zinc-200/40 text-center py-2 bg-zinc-50/20">
                            <div className="flex flex-col gap-0.5 px-1.5">
                              <span className="text-[7.5px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Funding probability</span>
                              <span className="text-[10px] font-extrabold text-zinc-800 mt-1 leading-none">
                                {impact.fundingProbability.before} &rarr; {impact.fundingProbability.after}
                              </span>
                              <span className={`text-[8.5px] font-black mt-1 leading-none ${impact.fundingProbability.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                                ({impact.fundingProbability.diff})
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 px-1.5">
                              <span className="text-[7.5px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Target timeline</span>
                              <span className="text-[10px] font-extrabold text-zinc-800 mt-1 leading-none">
                                {impact.targetTimeline.before} &rarr; {impact.targetTimeline.after}
                              </span>
                              <span className={`text-[8.5px] font-black mt-1 leading-none ${
                                impact.targetTimeline.diff === "No change"
                                  ? 'text-zinc-400'
                                  : impact.targetTimeline.isPositive
                                    ? 'text-emerald-600'
                                    : 'text-rose-500'
                              }`}>
                                {impact.targetTimeline.diff === "No change" ? "No change" : `(${impact.targetTimeline.diff})`}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 px-1.5">
                              <span className="text-[7.5px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Monthly saving</span>
                              <span className="text-[10px] font-extrabold text-zinc-800 mt-1 leading-none">
                                {impact.monthlySaving.before} &rarr; {impact.monthlySaving.after}
                              </span>
                              <span className={`text-[8.5px] font-black mt-1 leading-none ${
                                impact.monthlySaving.diff === "No change"
                                  ? 'text-zinc-400'
                                  : impact.monthlySaving.isPositive
                                    ? 'text-emerald-600'
                                    : 'text-rose-500'
                              }`}>
                                {impact.monthlySaving.diff === "No change" ? "No change" : `(${impact.monthlySaving.diff})`}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

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
            Your other plan components remain unchanged. Only this {changingCategory?.name ? changingCategory.name.toLowerCase() : 'product'} option will be updated.
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
          Select This Option
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
