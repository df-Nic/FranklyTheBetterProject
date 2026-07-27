import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ChevronRight, Plus, CalendarDays, Sparkles, CreditCard, Zap } from 'lucide-react';
import { PLANS_DATA } from '../data/planTemplates';
import { getPlanOpportunity, getRecommendedPlan } from '../data/planOpportunities';
import { getMilestonePlan } from '../data/milestonePlans';

// ─── Labeled Plan Illustrations ──────────────────────────────────────────────
import retirementImg from '../assets/images/Retirement Plan Image.svg';
import housingImg from '../assets/images/Housing Plan Image.svg';
import protectImg from '../assets/images/Protect Image.svg';
import savingsImg from '../assets/images/Savings Image.svg';
import weddingImg from '../assets/images/Wedding Image.svg';
import childrenEduImg from '../assets/images/Children Education.svg';
import careerBreakImg from '../assets/images/Career Break.svg';
import parentsRetireImg from '../assets/images/Parents Retirement.svg';

// ─── Plan Card Meta ──────────────────────────────────────────────────────────

const PLAN_META = {
  retirement: {
    image: retirementImg,
    tag: 'Retirement',
    tagColor: 'bg-orange-100 text-orange-700',
  },
  savings: {
    image: housingImg,
    tag: 'Savings & HDB',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  housing: {
    image: housingImg,
    tag: 'Savings & HDB',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  emergency: {
    image: protectImg,
    tag: 'Emergency Fund',
    tagColor: 'bg-indigo-100 text-indigo-700',
  },
  default: {
    image: savingsImg,
    tag: 'Wealth Builder',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  'wedding-fund': {
    image: weddingImg,
    tag: 'Wedding Fund',
    tagColor: 'bg-pink-100 text-pink-700',
  },
  'children-education': {
    image: childrenEduImg,
    tag: "Children's Education",
    tagColor: 'bg-purple-100 text-purple-700',
  },
  'career-break': {
    image: careerBreakImg,
    tag: 'Career Break',
    tagColor: 'bg-teal-100 text-teal-700',
  },
  'parents-retirement': {
    image: parentsRetireImg,
    tag: "Parents' Retirement",
    tagColor: 'bg-rose-100 text-rose-700',
  },
};

// ─── Single Plan Card ────────────────────────────────────────────────────────

const PlanCard = ({ planId, index, onClick }) => {
  const { planAdjustments } = useApp();
  const plan = PLANS_DATA[planId];
  const displayPlan = getMilestonePlan(planId, planAdjustments);
  const meta = PLAN_META[planId] || PLAN_META.default;
  const goalText = plan.goal.length > 92 ? plan.goal.slice(0, 92) + '\u2026' : plan.goal;
  
  const isHealed = planAdjustments?.[planId]?.healed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 160, delay: index * 0.08 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="shrink-0 bg-white rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-zinc-100 cursor-pointer select-none active:shadow-sm"
    >
      {/* Illustration zone */}
      <div className="relative w-full h-[150px] overflow-hidden bg-zinc-50 flex items-center justify-center p-3">
        <img 
          src={meta.image} 
          alt={meta.tag} 
          className="w-full h-full object-contain"
        />
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${meta.tagColor}`}>
          {meta.tag}
        </span>
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
          {isHealed && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-sm animate-pulse">
              <Sparkles className="h-2.5 w-2.5 stroke-[3]" />
              Plan Adjusted
            </span>
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-black text-zinc-900 tracking-tight leading-snug flex-1">
            {displayPlan.goalName}
          </h3>
          <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5">
            <ChevronRight className="w-4 h-4 text-zinc-500 stroke-[2.2]" />
          </div>
        </div>

        <p className="text-[10px] text-zinc-500 font-medium leading-snug">
          {goalText}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <CalendarDays className="w-3 h-3 text-zinc-400" />
          <span className="text-[9px] font-semibold text-zinc-400">
            Target:{' '}
            <span className="text-zinc-600 font-bold">{displayPlan.goalDate}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Plan Dashboard Page ─────────────────────────────────────────────────────

const PlanDashboardPage = () => {
  const { navigate, createdPlans, setActivePlanId, setClickPos, setPlanDetailOrigin, planAdjustments, opportunityDecisions, requestPlanChatOpen } = useApp();
  const dashboardPlans = createdPlans.map((id) => getMilestonePlan(id, planAdjustments));
  const recommendedPlan = getRecommendedPlan(dashboardPlans);
  const opportunity = getPlanOpportunity();
  const opportunityHandled = Object.values(opportunityDecisions).some((item) => item.opportunityId === opportunity.id);
  const startNewPlan = () => {
    requestPlanChatOpen();
    navigate('home');
  };

  const handleCardClick = (e, planId) => {
    const mobileFrame = e.currentTarget.closest('[data-mobile-frame]');
    if (mobileFrame) {
      const rect = mobileFrame.getBoundingClientRect();
      setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      setClickPos({ x: 195, y: 300 });
    }
    setActivePlanId(planId);
    setPlanDetailOrigin('plan-dashboard'); // back button returns to dashboard
    navigate('plan-milestones');
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col overflow-hidden select-none">
      {/* Header */}
      <header className="pt-6 pb-2 h-auto w-full bg-white/70 backdrop-blur-xl border-b border-white/50 px-4 flex items-center justify-between z-40 shrink-0 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">NEST ADVISORY</span>
            <span className="text-sm font-black text-zinc-900 tracking-tight mt-0.5">My Plans</span>
          </div>
        </div>

        <button
          onClick={startNewPlan}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary text-white text-[10px] font-bold transition-all duration-150 active:scale-95 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Plan</span>
        </button>
      </header>

      {/* Cards area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-4 py-5 pb-28 flex flex-col gap-4 z-10">
        {/* OCBC Expense Optimiser Banner */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate('expense-optimizer');
          }}
          className="relative w-full shrink-0 text-left overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1C1810] via-[#382B12] to-[#634B19] p-4 text-white shadow-[0_10px_25px_rgba(99,75,25,0.25)] cursor-pointer hover:shadow-xl transition-all duration-200 group active:scale-[0.99] border border-amber-500/30 z-20 pointer-events-auto"
        >
          <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-amber-400/20 backdrop-blur-md border border-amber-400/30 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-amber-300">
              <Sparkles className="w-3 h-3 fill-amber-300" />
              <span>OCBC Expense Optimiser</span>
            </div>
            <span className="text-[10px] font-bold text-amber-200/70 group-hover:text-amber-100 transition-colors flex items-center gap-1">
              <span>Explore Cards</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-base font-black text-white leading-tight">
              Optimize Your Spending & Accelerate Plan Goals
            </div>
            <p className="text-[11px] text-amber-100/80 leading-relaxed mt-1">
              Discover tailored OCBC Credit Cards matched to your unique spending habits, active sub-goals, and target completion dates.
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-amber-500/20">
            <span className="text-[9.5px] font-bold text-amber-200/80">
              Personalized Reward & Cash Rebate Perks
            </span>

            <span className="inline-flex items-center gap-1 bg-amber-400 text-zinc-950 px-3 py-1.5 rounded-full text-[9.5px] font-black shadow-xs group-hover:bg-amber-300 transition-colors">
              <span>Optimise Now</span>
              <ChevronRight className="w-3 h-3 stroke-[3]" />
            </span>
          </div>
        </button>

        {createdPlans.length > 0 && !opportunityHandled && (
          <button
            onClick={() => {
              setActivePlanId(recommendedPlan?.id ?? createdPlans[0]);
              navigate('opportunity-detail');
            }}
            className="relative min-h-[142px] shrink-0 overflow-hidden rounded-[22px] bg-[#7C2230] p-4 text-left text-white shadow-[0_10px_24px_rgba(124,34,48,0.24)]"
          >
            <Sparkles className="absolute -right-3 -top-3 h-20 w-20 text-white/10" />
            <div className="relative text-[9px] font-black uppercase tracking-[0.15em] text-white/65">Opportunity starts now</div>
            <div className="relative mt-1 text-[18px] font-black">Put your S$8,000 bonus to work</div>
            <p className="relative mt-1 text-[10.5px] leading-relaxed text-white/75">
              Owl compared {createdPlans.length} {createdPlans.length === 1 ? 'plan' : 'plans'} and recommends {recommendedPlan?.goalName}.
            </p>
            <span className="relative mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-[9px] font-black text-[#7C2230]">Compare and allocate</span>
          </button>
        )}
        {createdPlans.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center flex-1 gap-4 pt-20">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center">
              <CalendarDays className="w-8 h-8 text-zinc-300 stroke-[1.5]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-800">No plans yet</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-[200px] leading-snug">
                Chat with Nest to create your first financial plan.
              </p>
            </div>
            <button
              onClick={startNewPlan}
              className="mt-2 px-5 py-2.5 rounded-full bg-brand-primary text-white text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Create a Plan
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-0.5 mb-1 shrink-0">
              <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Active Plans</span>
              <span className="text-[10px] text-zinc-400 font-medium">
                Tap a plan to view details and execution roadmap
              </span>
            </div>

            {createdPlans.map((planId, index) => (
              <PlanCard
                key={planId}
                planId={planId}
                index={index}
                onClick={(e) => handleCardClick(e, planId)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PlanDashboardPage;
