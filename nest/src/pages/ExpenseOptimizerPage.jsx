import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CardDeckCarousel from '../components/ui/CardDeckCarousel';
import { getOptimizedCardsForPlan } from '../data/ocbcCards';
import { PLANS_DATA } from '../data/planTemplates';
import {
  ChevronLeft,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  CalendarDays,
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowRight,
  Gift,
  DollarSign,
  Share2,
  Sliders,
  Check
} from 'lucide-react';

export default function ExpenseOptimizerPage() {
  const { navigate, createdPlans, activePlanId, setActivePlanId } = useApp();

  // Determine active plan
  const selectedPlanId = activePlanId && PLANS_DATA[activePlanId] ? activePlanId : (createdPlans[0] || 'housing');
  const activePlan = PLANS_DATA[selectedPlanId] || PLANS_DATA.housing;

  // Recommended cards optimized for current plan
  const recommendedCards = useMemo(() => {
    return getOptimizedCardsForPlan(selectedPlanId, activePlan);
  }, [selectedPlanId, activePlan]);

  // Card deck selection state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const activeCard = recommendedCards[activeCardIndex] || recommendedCards[0];

  // Spending simulator slider state (S$800 to S$4,000 / month)
  const [monthlySpend, setMonthlySpend] = useState(1500);

  // Link card modal / status
  const [linkedCardId, setLinkedCardId] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Calculate annual reward value based on slider spend ratio
  const projectedAnnualReward = useMemo(() => {
    const ratio = monthlySpend / 1500;
    if (activeCard.rewardsType === 'cashback') {
      const val = Math.round(activeCard.baseEstAnnualValue * ratio);
      return `S$${val.toLocaleString()} / year cashback`;
    } else if (activeCard.rewardsType === 'miles') {
      const val = Math.round(activeCard.baseEstAnnualValue * ratio);
      return `${val.toLocaleString()} Miles / year`;
    } else {
      const val = Math.round(activeCard.baseEstAnnualValue * ratio);
      return `${val.toLocaleString()} OCBC$ / year`;
    }
  }, [monthlySpend, activeCard]);

  const handleLinkCard = (cardId) => {
    setLinkedCardId(cardId);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3500);
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col overflow-hidden relative h-full min-h-0">
      {/* Top Header */}
      <header className="pt-6 pb-3 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 px-4 flex items-center justify-between z-40 shrink-0 sticky top-0">
        <button
          onClick={() => navigate('plan-dashboard')}
          className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">OCBC SMART ADVISOR</span>
          <span className="text-xs font-black text-zinc-900 tracking-tight mt-0.5">Expense Optimiser</span>
        </div>

        <div className="w-9" />
      </header>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y no-scrollbar px-4 py-4 pb-28 flex flex-col gap-4 min-h-0">
        
        {/* Highlight Banner */}
        <div className="w-full shrink-0 bg-gradient-to-r from-[#E1251B] via-[#C62828] to-[#8E0000] rounded-2xl p-4 text-white shadow-lg relative overflow-hidden flex flex-col gap-1.5 border border-red-400/30">
          <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-1.5 w-fit bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1 rounded-full text-[9.5px] font-black text-white tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>Personalized Spending Match</span>
          </div>
          <h2 className="text-sm font-extrabold text-white leading-snug drop-shadow-xs">
            {activeCard.headlineReason}
          </h2>
        </div>

        {/* Unified Card Recommendations Container */}
        <div className="w-full bg-white rounded-3xl p-4 shadow-sm border border-zinc-200/60 flex flex-col gap-4">
          <div className="px-1 pt-1">
            <span className="text-[10.5px] font-black text-zinc-400 uppercase tracking-wider">Card Recommendations</span>
          </div>

          <CardDeckCarousel
            cards={recommendedCards}
            activeIndex={activeCardIndex}
            onChangeIndex={(newIdx) => setActiveCardIndex(newIdx)}
          />

          {/* Active Card Details directly inside the same box */}
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4 pt-3 border-t border-zinc-100"
          >
            {/* Card Info Header */}
            <div className="flex items-start justify-between pb-1">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-zinc-900">{activeCard.name}</h3>
                </div>
                <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{activeCard.tagline}</p>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${activeCard.badgeBg}`}>
                {activeCard.category}
              </div>
            </div>

            {/* Key Rates Row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100 flex flex-col">
                <span className="text-[9.5px] font-extrabold text-zinc-400 uppercase tracking-wider">Reward Structure</span>
                <span className="text-sm font-black text-red-600 mt-0.5">{activeCard.headlineRate}</span>
                <span className="text-[9.5px] font-medium text-zinc-500 mt-0.5">{activeCard.subText}</span>
              </div>
              <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100 flex flex-col">
                <span className="text-[9.5px] font-extrabold text-zinc-400 uppercase tracking-wider">Annual Fee Waiver</span>
                <span className="text-sm font-black text-zinc-900 mt-0.5">{activeCard.annualFeeWaiver}</span>
                <span className="text-[9.5px] font-medium text-zinc-500 mt-0.5">Min Spend: {activeCard.minSpend}</span>
              </div>
            </div>

            {/* Specific Reasons Section */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-red-600 fill-red-600" />
                <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                  Why this card fits your spending habits
                </h4>
              </div>

              <div className="flex flex-col gap-2">
                {activeCard.specificReasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-red-50/40 p-2.5 rounded-xl border border-red-100/60">
                    <div className="w-4 h-4 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-black">
                      {idx + 1}
                    </div>
                    <p className="text-[11px] font-medium text-zinc-800 leading-relaxed">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Spend Rewards Simulator */}
            <div className="bg-gradient-to-br from-red-50/30 via-white to-zinc-50 rounded-2xl p-4 border border-red-100/80 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-black text-zinc-900">Est. Monthly Spend Simulator</span>
                </div>
                <span className="text-xs font-black text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 shadow-2xs">
                  S${monthlySpend.toLocaleString()}/mo
                </span>
              </div>

              <input
                type="range"
                min="800"
                max="4000"
                step="100"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="custom-red-slider my-1"
              />

              <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold px-0.5">
                <span>S$800/mo</span>
                <span>S$2,400/mo</span>
                <span>S$4,000/mo</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-red-100 flex items-center justify-between shadow-2xs mt-1">
                <div className="flex flex-col">
                  <span className="text-[9.5px] font-bold text-zinc-400 uppercase">Projected Annual Return</span>
                  <span className="text-xs font-black text-emerald-600 mt-0.5">{projectedAnnualReward}</span>
                </div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                  Personalized Estimate
                </span>
              </div>
            </div>

            {/* Full Card Privileges List */}
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] font-black uppercase text-zinc-400 tracking-wider">All Card Privileges</span>
              <div className="flex flex-col gap-1.5">
                {activeCard.privileges.map((priv, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-[11px] text-zinc-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{priv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col pt-2 border-t border-zinc-100">
              <a
                href="https://www.ocbc.com/personal-banking/cards"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl font-black text-xs text-zinc-900 bg-white/90 backdrop-blur-md border border-zinc-200/90 hover:bg-[#D32F2F] hover:text-white hover:border-[#D32F2F] flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer group active:scale-[0.98]"
              >
                <span>Apply / View Details on OCBC.com</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
