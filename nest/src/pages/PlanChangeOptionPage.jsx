import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';
import { PLANS_DATA, PLAN_ALTERNATIVES } from '../data/planTemplates';
import BackgroundOrb from '../components/ui/BackgroundOrb';

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
      rate: 0.0465,
      type: "deposit",
      tags: ["Higher interest yield", "Access cash anytime (Liquidity)", "No lock-in period", "Flexibility to top-up"]
    },
    {
      id: "alt_fd_promo_6m",
      name: "OCBC Fixed Deposit (6M)",
      desc: "Earn a guaranteed high interest rate with capital fully protected during a 6-month lock-in.",
      rate: 0.033,
      type: "deposit",
      tags: ["Higher interest yield", "Government-backed safety"]
    },
    {
      id: "alt_tbills_6m",
      name: "SG Treasury Bills (6M T-Bills)",
      desc: "Singapore Government-backed short-term bills capturing sovereign yields with zero credit risk.",
      rate: 0.037,
      type: "deposit",
      tags: ["Higher interest yield", "Government-backed safety", "No lock-in period"]
    },
    {
      id: "alt_bonus_plus",
      name: "OCBC Bonus+ Savings Account",
      desc: "Special savings account rewarding regular monthly savers with bonus interest rates and flexible deposits.",
      rate: 0.0375,
      type: "deposit",
      tags: ["Higher interest yield", "No lock-in period", "Flexibility to top-up"]
    },
    {
      id: "alt_lion_liq",
      name: "Lion-OCBC Enhanced Liquidity Fund",
      desc: "A high-yielding cash management fund targeting returns above deposits with daily liquidity and withdrawal access.",
      rate: 0.0385,
      type: "deposit",
      tags: ["Higher interest yield", "Access cash anytime (Liquidity)", "No lock-in period"]
    },
    {
      id: "alt_ssb_bonds",
      name: "Singapore Savings Bonds (SSB)",
      desc: "Risk-free step-up yield government bonds that can be redeemed in any month without any penalty.",
      rate: 0.032,
      type: "deposit",
      tags: ["Access cash anytime (Liquidity)", "No lock-in period", "Government-backed safety", "Flexibility to top-up"]
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
    },
    {
      id: "alt_china_asean",
      name: "OCBC Lion-OCBC China ASEAN Growth UT",
      desc: "Focuses on high-conviction emerging companies in regional growth corridors to capture fast-growing market returns.",
      rate: 0.08,
      type: "investment",
      tags: ["Higher growth potential", "Diversified global markets"]
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
    },
    {
      id: "alt_prestige_life",
      name: "GE GREAT Prestige Wealth Life Plan",
      desc: "Single-premium life insurance securing legacy payouts while compounding capital growth guarantees.",
      rate: 0.042,
      type: "protection",
      tags: ["Comprehensive cover limits", "Lump-sum payout options"]
    },
    {
      id: "alt_ci_early",
      name: "GE GREAT Early Critical Illness",
      desc: "Lump-sum financial payout upon detection of early-stage critical illnesses to safeguard savings continuity.",
      rate: 0.0,
      type: "protection",
      tags: ["Comprehensive cover limits", "Critical illness add-ons", "Lump-sum payout options"]
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
    activePlanTitle,
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

  // Filter and sort alternatives based on selected reasons matching alternative tags (strict AND)
  let filteredAlts = [];
  if (selectedReasons.length > 0) {
    // Keep alternatives that match all selected reasons (AND condition)
    filteredAlts = allAltsInCategory.filter(alt => {
      return alt.tags && selectedReasons.every(reason => alt.tags.includes(reason));
    });

    // Exclude alternatives that are identical to the original action
    filteredAlts = filteredAlts.filter(alt => {
      const normAltName = alt.name.toLowerCase();
      const normOrigName = (changingAction.name || '').toLowerCase();
      
      if (normAltName === normOrigName) return false;
      if (normAltName.includes("360") && normOrigName.includes("360")) return false;
      if (normAltName.includes("fixed deposit") && normOrigName.includes("fixed deposit")) return false;
      if (normAltName.includes("savings account") && normOrigName.includes("savings account")) return false;
      if (normAltName.includes("smart saver") && normOrigName.includes("smart saver")) return false;
      if (normAltName.includes("roboinvest") && normOrigName.includes("roboinvest")) return false;
      if (normAltName.includes("blue chip") && normOrigName.includes("blue chip")) return false;
      if (normAltName.includes("supremehealth") && normOrigName.includes("supremehealth")) return false;
      if (normAltName.includes("careshield") && normOrigName.includes("careshield")) return false;
      
      return true;
    });

    // Sort by matching reason count descending so the best match is first
    filteredAlts.sort((a, b) => {
      const matchA = a.tags.filter(tag => selectedReasons.includes(tag)).length;
      const matchB = b.tags.filter(tag => selectedReasons.includes(tag)).length;
      return matchB - matchA;
    });
  }

  // Fallback to first recommended alternative if selected id is invalid or filtered out
  const defaultInitialAlt = filteredAlts[0];
  const currentInitialAlt = changingAction ? (chosenAlternatives[changingAction.id] || defaultInitialAlt) : null;
  const [selectedAltId, setSelectedAltId] = useState(currentInitialAlt ? currentInitialAlt.id : "");

  // Update selectedAltId if the currently selected option gets filtered out of the list
  useEffect(() => {
    if (filteredAlts.length > 0 && !filteredAlts.some(a => a.id === selectedAltId)) {
      setSelectedAltId(filteredAlts[0].id);
    }
  }, [filteredAlts, selectedAltId]);

  const selectedAlt = filteredAlts.find(a => a.id === selectedAltId) || filteredAlts[0];

  const handleSelectOption = () => {
    if (!changingAction || !selectedAlt) return;

    setPendingExcluded(prev => {
      const next = new Set(prev);
      next.add(changingAction.id);
      return next;
    });

    setChosenAlternatives(prev => ({
      ...prev,
      [changingAction.id]: selectedAlt
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

  if (!changingAction) return null;

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

      {/* Sub-page Scroll Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-4 z-10 pb-36">
        
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
              You can choose a different {changingCategory?.name ? changingCategory.name.toLowerCase() : 'product'} option. We'll update your plan to show the impact.
            </p>
          </div>
        </div>

        {/* Staggered Payments Callout Notice */}
        {userPlanMeta.paymentStrategy?.toLowerCase() === 'staggered' && (
          <div
            className="p-4 bg-blue-50 border border-blue-100 rounded-[24px] flex gap-3.5 items-start shrink-0 shadow-sm"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center text-blue-600 shrink-0 shadow-inner">
              <AlertCircle className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">Payment Flexibility Activated</span>
              <p className="text-[9.5px] font-semibold text-blue-800 leading-relaxed mt-0.5">
                Based on your choice of <strong>Staggered Payments</strong> and your target timeline, these recommendations are structured to prioritize products with flexible exits and zero penalty fees. You retain the freedom to redirect cash without lock-in constraints.
              </p>
            </div>
          </div>
        )}

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
                  <span className="text-xs font-black text-zinc-800">Select reasons above to start</span>
                  <p className="text-[9.5px] text-zinc-500 font-semibold leading-relaxed max-w-[250px] mx-auto">
                    To see matching options, please select at least one reason why you'd like to change. We will instantly search and display tailored options for your plan.
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
          onClick={handleSelectOption}
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
