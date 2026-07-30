import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import CardDeckCarousel from '../components/ui/CardDeckCarousel';
import DepositVaultShowcase from '../components/ui/DepositVaultShowcase';
import { getOptimizedCardsForPlan } from '../data/ocbcCards';
import { getOptimizedDepositsForPlan } from '../data/ocbcDeposits';
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
  Check,
  Landmark,
  Layers,
  Repeat
} from 'lucide-react';

export default function ExpenseOptimizerPage() {
  const { navigate, createdPlans, activePlanId, setActivePlanId } = useApp();

  // Determine active plan
  const selectedPlanId = activePlanId && PLANS_DATA[activePlanId] ? activePlanId : (createdPlans[0] || 'housing');
  const activePlan = PLANS_DATA[selectedPlanId] || PLANS_DATA.housing;

  // Container height locking to prevent shrink/collapse during curtain transition
  const containerRef = useRef(null);
  const [lockedHeight, setLockedHeight] = useState(null);

  // View Mode: 'cards' (Credit Cards) or 'deposits' (Deposit Accounts)
  const [viewMode, setViewMode] = useState('cards');
  const [curtainPhase, setCurtainPhase] = useState('idle'); // 'idle' | 'covering' | 'revealing'

  // Recommended products optimized for current plan
  const recommendedCards = useMemo(() => {
    return getOptimizedCardsForPlan(selectedPlanId, activePlan);
  }, [selectedPlanId, activePlan]);

  const recommendedDeposits = useMemo(() => {
    return getOptimizedDepositsForPlan(selectedPlanId, activePlan);
  }, [selectedPlanId, activePlan]);

  const activeItems = viewMode === 'cards' ? recommendedCards : recommendedDeposits;

  // Card deck selection index
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const activeItem = activeItems[activeItemIndex] || activeItems[0];

  // Spending simulator slider state (S$800 to S$4,000 / month for cards)
  const [monthlySpend, setMonthlySpend] = useState(1500);

  // Deposit simulator slider state (S$5,000 to S$100,000 balance for deposits)
  const [depositBalance, setDepositBalance] = useState(50000);

  // Horizontal Curtain Scope Mode Switch Handler across whole container
  const handleSwitchMode = (newMode) => {
    if (newMode === viewMode || curtainPhase !== 'idle') return;

    if (containerRef.current) {
      setLockedHeight(containerRef.current.offsetHeight);
    }
    setCurtainPhase('covering');

    setTimeout(() => {
      setViewMode(newMode);
      setActiveItemIndex(0);
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

  // Calculate annual reward/interest value based on slider ratio
  const projectedReturnText = useMemo(() => {
    if (!activeItem) return '';
    if (viewMode === 'cards') {
      const ratio = monthlySpend / 1500;
      if (activeItem.rewardsType === 'cashback') {
        const val = Math.round(activeItem.baseEstAnnualValue * ratio);
        return `S$${val.toLocaleString()} / year cashback`;
      } else if (activeItem.rewardsType === 'miles') {
        const val = Math.round(activeItem.baseEstAnnualValue * ratio);
        return `${val.toLocaleString()} Miles / year`;
      } else {
        const val = Math.round(activeItem.baseEstAnnualValue * ratio);
        return `${val.toLocaleString()} OCBC$ / year`;
      }
    } else {
      // Deposit Account calculation
      const ratio = depositBalance / 75000;
      const val = Math.round((activeItem.baseEstAnnualValue || 3500) * ratio);
      return `S$${val.toLocaleString()} / year interest yield`;
    }
  }, [monthlySpend, depositBalance, activeItem, viewMode]);

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col overflow-hidden relative h-full min-h-0 select-none">
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
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">OCBC EXPENSE OPTIMISER</span>
          <span className="text-xs font-black text-zinc-900 tracking-tight mt-0.5">Recommendations Hub</span>
        </div>

        <div className="w-9" />
      </header>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y no-scrollbar px-4 py-4 pb-44 flex flex-col gap-4 min-h-0">
        
        {/* Highlight Banner */}
        <div className="w-full shrink-0 bg-gradient-to-r from-[#E1251B] via-[#C62828] to-[#8E0000] rounded-2xl p-4 text-white shadow-lg relative overflow-hidden flex flex-col gap-1.5 border border-red-400/30">
          <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-1.5 w-fit bg-white/15 backdrop-blur-md border border-white/25 px-2.5 py-1 rounded-full text-[9.5px] font-black text-white tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
            <span>Personalized Goal Match</span>
          </div>
          <h2 className="text-sm font-extrabold text-white leading-snug drop-shadow-xs">
            {activeItem?.headlineReason || 'Tailored banking solutions for your financial plan'}
          </h2>
        </div>

        {/* Unified Card Recommendations Container */}
        <div
          ref={containerRef}
          style={lockedHeight ? { minHeight: `${lockedHeight}px` } : {}}
          className={`w-full bg-white rounded-3xl p-4 shadow-sm border border-zinc-200/60 flex flex-col gap-4 relative transition-[min-height] duration-300 ease-out ${curtainPhase !== 'idle' ? 'overflow-hidden' : 'overflow-visible'}`}
        >
          
          {/* Horizontal Curtain Scope Transition Overlay */}
          <AnimatePresence>
            {curtainPhase !== 'idle' && (
              <motion.div
                key="full-card-box-horizontal-curtain"
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

          {/* Header Row & Curtain Scope Toggle Pill */}
          <div className="flex items-center justify-between px-1 pt-1">
            <div className="flex flex-col">
              <span className="text-[10.5px] font-black text-zinc-400 uppercase tracking-wider">
                {viewMode === 'cards' ? 'Card Recommendations' : 'Deposit Recommendations'}
              </span>
            </div>

            {/* Interactive Curtain Scope Flip Switch */}
            <div className="bg-zinc-100 p-0.5 rounded-full flex items-center border border-zinc-200/80 shadow-inner z-10">
              <button
                onClick={() => handleSwitchMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold transition-all duration-300 cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <CreditCard className="w-3 h-3" />
                <span>Credit Cards</span>
              </button>
              <button
                onClick={() => handleSwitchMode('deposits')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold transition-all duration-300 cursor-pointer ${
                  viewMode === 'deposits'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Landmark className="w-3 h-3" />
                <span>Deposit Accounts</span>
              </button>
            </div>
          </div>

          {/* Recommendations Showcase Component */}
          <div className="w-full py-1">
            {viewMode === 'cards' ? (
              <CardDeckCarousel
                cards={activeItems}
                activeIndex={activeItemIndex}
                onChangeIndex={(newIdx) => setActiveItemIndex(newIdx)}
                type="cards"
              />
            ) : (
              <DepositVaultShowcase
                deposits={activeItems}
                activeIndex={activeItemIndex}
                onChangeIndex={(newIdx) => setActiveItemIndex(newIdx)}
              />
            )}
          </div>

          {/* Active Item Details directly inside the same box */}
          {activeItem && (
            <motion.div
              key={`${activeItem.id}-${viewMode}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 pt-3 border-t border-zinc-100"
            >
              {/* Info Header */}
              <div className="flex items-start justify-between pb-1 gap-2">
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-black text-zinc-900 leading-tight">{activeItem.name}</h3>
                  <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{activeItem.tagline}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${activeItem.badgeBg}`}>
                  {activeItem.category}
                </div>
              </div>

              {/* Key Rates Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100 flex flex-col justify-between">
                  <span className="text-[9.5px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {viewMode === 'cards' ? 'Reward Structure' : 'Interest Rate Yield'}
                  </span>
                  <span className="text-sm font-black text-red-600 mt-1">{activeItem.headlineRate}</span>
                  <span className="text-[9.5px] font-medium text-zinc-500 mt-0.5">{activeItem.subText}</span>
                </div>
                <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100 flex flex-col justify-between">
                  <span className="text-[9.5px] font-extrabold text-zinc-400 uppercase tracking-wider">
                    {viewMode === 'cards' ? 'Annual Fee Waiver' : 'Monthly Fee Waiver'}
                  </span>
                  <span className="text-sm font-black text-zinc-900 mt-1">
                    {viewMode === 'cards' ? activeItem.annualFeeWaiver : activeItem.monthlyFeeWaiver}
                  </span>
                  <span className="text-[9.5px] font-medium text-zinc-500 mt-0.5">
                    {viewMode === 'cards' ? `Min Spend: ${activeItem.minSpend}` : `Min Deposit: ${activeItem.minDeposit}`}
                  </span>
                </div>
              </div>

              {/* Specific Recommendation Reasons Section */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-red-600 fill-red-600" />
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                    Why this {viewMode === 'cards' ? 'card' : 'deposit account'} is recommended for you
                  </h4>
                </div>

                <div className="flex flex-col gap-2">
                  {activeItem.specificReasons && activeItem.specificReasons.map((reason, idx) => (
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

              {/* Dynamic Spend / Yield Simulator */}
              <div className="bg-gradient-to-br from-red-50/30 via-white to-zinc-50 rounded-2xl p-4 border border-red-100/80 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-black text-zinc-900">
                      {viewMode === 'cards' ? 'Est. Monthly Spend Simulator' : 'Avg. Monthly Balance Yield Simulator'}
                    </span>
                  </div>
                  <span className="text-xs font-black text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 shadow-2xs">
                    {viewMode === 'cards' ? `S$${monthlySpend.toLocaleString()}/mo` : `S$${depositBalance.toLocaleString()} Balance`}
                  </span>
                </div>

                {viewMode === 'cards' ? (
                  <input
                    type="range"
                    min="800"
                    max="4000"
                    step="100"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(Number(e.target.value))}
                    className="custom-red-slider my-1"
                  />
                ) : (
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="2500"
                    value={depositBalance}
                    onChange={(e) => setDepositBalance(Number(e.target.value))}
                    className="custom-red-slider my-1"
                  />
                )}

                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold px-0.5">
                  <span>{viewMode === 'cards' ? 'S$800/mo' : 'S$5,000'}</span>
                  <span>{viewMode === 'cards' ? 'S$2,400/mo' : 'S$50,000'}</span>
                  <span>{viewMode === 'cards' ? 'S$4,000/mo' : 'S$100,000'}</span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-red-100 flex items-center justify-between shadow-2xs mt-1">
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-bold text-zinc-400 uppercase">
                      {viewMode === 'cards' ? 'Projected Annual Return' : 'Projected Annual Interest'}
                    </span>
                    <span className="text-xs font-black text-emerald-600 mt-0.5">{projectedReturnText}</span>
                  </div>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                    Personalized Estimate
                  </span>
                </div>
              </div>

              {/* Full Privileges List */}
              <div className="flex flex-col gap-2">
                <span className="text-[10.5px] font-black uppercase text-zinc-400 tracking-wider">
                  {viewMode === 'cards' ? 'All Card Privileges' : 'Account Features & Privileges'}
                </span>
                <div className="flex flex-col gap-1.5">
                  {activeItem.privileges && activeItem.privileges.map((priv, pIdx) => (
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
                  href="https://www.ocbc.com/personal-banking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl font-black text-xs text-zinc-900 bg-white/90 backdrop-blur-md border border-zinc-200/90 hover:bg-[#D32F2F] hover:text-white hover:border-[#D32F2F] flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer group active:scale-[0.98]"
                >
                  <span>Apply / View Details on OCBC.com</span>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
