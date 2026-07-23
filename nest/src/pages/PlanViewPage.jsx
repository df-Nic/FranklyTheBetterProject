import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import BackgroundOrb from '../components/ui/BackgroundOrb';

// Modular Imports
import { PLANS_DATA } from '../data/planTemplates';
import PlanAreaChart from '../components/ui/PlanAreaChart';
import PlanCardDeck from '../components/ui/PlanCardDeck';

const PlanViewPage = () => {
  const { clickPos, activePlanId, activePlanTitle, setPage } = useApp();

  // Identify active plan template
  const getActivePlan = () => {
    if (activePlanId && PLANS_DATA[activePlanId]) return PLANS_DATA[activePlanId];
    const title = (activePlanTitle || '').toLowerCase();
    const scores = {
      'retirement': 0,
      'wedding-fund': 0,
      'savings': 0,
      'emergency': 0
    };

    if (title.includes('retire') || title.includes('retirement')) scores['retirement'] += 10;
    if (title.includes('wed') || title.includes('wedding') || title.includes('marry') || title.includes('marriage')) scores['wedding-fund'] += 10;
    if (title.includes('emerg') || title.includes('emergency')) scores['emergency'] += 10;
    if (title.includes('hdb') || title.includes('downpayment') || title.includes('flat')) scores['savings'] += 10;

    const retireSupport = ['pension', 'srs'];
    const weddingSupport = ['proposal', 'banquet'];
    const savingsSupport = ['save', 'savings', 'home', 'house', 'deposit'];
    const emergencySupport = ['safe', 'safety', 'shield', 'protect', 'liquid', 'buffer'];

    retireSupport.forEach(kw => { if (title.includes(kw)) scores['retirement'] += 3; });
    weddingSupport.forEach(kw => { if (title.includes(kw)) scores['wedding-fund'] += 3; });
    savingsSupport.forEach(kw => { if (title.includes(kw)) scores['savings'] += 3; });
    emergencySupport.forEach(kw => { if (title.includes(kw)) scores['emergency'] += 3; });

    let highestScore = 0;
    let resolvedId = 'default';

    for (const [planId, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        resolvedId = planId;
      }
    }

    if (resolvedId !== 'default' && PLANS_DATA[resolvedId]) {
      return PLANS_DATA[resolvedId];
    }
    return PLANS_DATA.default;
  };

  const activePlan = getActivePlan();
  
  // Projections calculations based on specific targets and timelines
  const calculateDataPoints = (plan, categories) => {
    let initialCapital = 15000;
    if (plan.id === 'retirement') initialCapital = 30000;
    if (plan.id === 'savings') initialCapital = 25000;
    if (plan.id === 'emergency') initialCapital = 6000;
    if (plan.id === 'wedding-fund') initialCapital = 10000;

    const allActions = [];
    categories.forEach(cat => {
      cat.actions.forEach(act => {
        allActions.push(act);
      });
    });

    if (plan.id === 'emergency') {
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map((month, m) => {
        const baseGrowthVal = initialCapital * Math.pow(1 + 0.015/12, m);
        let depositsVal = 0;
        let investmentsVal = 0;

        allActions.forEach(action => {
          const isLump = action.isLumpSum;
          const r = action.rate / 12;
          const monthlyVal = action.baseVal / 12;

          if (action.type === 'deposit' || action.type === 'grant') {
            if (isLump) {
              depositsVal += action.baseVal * Math.pow(1 + r, m);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= m; k++) {
                recurringSum += monthlyVal * Math.pow(1 + r, m - k);
              }
              depositsVal += recurringSum;
            }
          } else if (action.type === 'investment' || action.type === 'yield' || action.type === 'saving') {
            if (isLump) {
              investmentsVal += action.baseVal * Math.pow(1 + r, m);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= m; k++) {
                recurringSum += monthlyVal * Math.pow(1 + r, m - k);
              }
              investmentsVal += recurringSum;
            }
          }
        });

        const y1 = Math.round(baseGrowthVal);
        const y2 = Math.round(baseGrowthVal + depositsVal);
        const y3 = Math.round(baseGrowthVal + depositsVal + investmentsVal);

        return { year: month, y1, y2, y3 };
      });
    }

    if (plan.id === 'wedding-fund') {
      // 1.5 Years plan (Jul 2026 - Dec 2027)
      // Steps: Jul 26, Dec 26, Jun 27, Dec 27
      const labels = ['Jul 26', 'Dec 26', 'Jun 27', 'Dec 27'];
      const times = [0, 0.5, 1.0, 1.5];

      return labels.map((label, idx) => {
        const t = times[idx];
        const baseGrowthVal = initialCapital * Math.pow(1.015, t);
        let depositsVal = 0;
        let investmentsVal = 0;

        allActions.forEach(action => {
          const isLump = action.isLumpSum;
          const r = action.rate;
          const periodicVal = action.baseVal / 2; // Semi-annual contribution
          const stepsCount = idx;

          if (action.type === 'deposit' || action.type === 'grant') {
            if (isLump) {
              depositsVal += action.baseVal * Math.pow(1 + r, t);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= stepsCount; k++) {
                recurringSum += periodicVal * Math.pow(1 + r, (stepsCount - k) * 0.5);
              }
              depositsVal += recurringSum;
            }
          } else if (action.type === 'investment' || action.type === 'yield' || action.type === 'saving') {
            if (isLump) {
              investmentsVal += action.baseVal * Math.pow(1 + r, t);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= stepsCount; k++) {
                recurringSum += periodicVal * Math.pow(1 + r, (stepsCount - k) * 0.5);
              }
              investmentsVal += recurringSum;
            }
          }
        });

        const y1 = Math.round(baseGrowthVal);
        const y2 = Math.round(baseGrowthVal + depositsVal);
        const y3 = Math.round(baseGrowthVal + depositsVal + investmentsVal);

        return { year: label, y1, y2, y3 };
      });
    }

    if (plan.id === 'savings') {
      const labels = ['2026', "H2 '26", '2027', "H2 '27", '2028'];
      const times = [0, 0.5, 1.0, 1.5, 2.0];

      return labels.map((label, idx) => {
        const t = times[idx];
        const baseGrowthVal = initialCapital * Math.pow(1.015, t);
        let depositsVal = 0;
        let investmentsVal = 0;

        allActions.forEach(action => {
          const isLump = action.isLumpSum;
          const r = action.rate;
          const periodicVal = action.baseVal / 2;
          const stepsCount = idx;

          if (action.type === 'deposit' || action.type === 'grant') {
            if (isLump) {
              depositsVal += action.baseVal * Math.pow(1 + r, t);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= stepsCount; k++) {
                recurringSum += periodicVal * Math.pow(1 + r, (stepsCount - k) * 0.5);
              }
              depositsVal += recurringSum;
            }
          } else if (action.type === 'investment' || action.type === 'yield' || action.type === 'saving') {
            if (isLump) {
              investmentsVal += action.baseVal * Math.pow(1 + r, t);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= stepsCount; k++) {
                recurringSum += periodicVal * Math.pow(1 + r, (stepsCount - k) * 0.5);
              }
              investmentsVal += recurringSum;
            }
          }
        });

        const y1 = Math.round(baseGrowthVal);
        const y2 = Math.round(baseGrowthVal + depositsVal);
        const y3 = Math.round(baseGrowthVal + depositsVal + investmentsVal);

        return { year: label, y1, y2, y3 };
      });
    }

    if (plan.id === 'retirement') {
      const labels = ['2026', '2029', '2032', '2035', '2038', '2041', '2045'];
      const times = [0, 3, 6, 9, 12, 15, 19];

      return labels.map((label, idx) => {
        const t = times[idx];
        const baseGrowthVal = initialCapital * Math.pow(1.015, t);
        let depositsVal = 0;
        let investmentsVal = 0;

        allActions.forEach(action => {
          const isLump = action.isLumpSum;
          const r = action.rate;
          const stepsCount = t;

          if (action.type === 'deposit' || action.type === 'grant') {
            if (isLump) {
              depositsVal += action.baseVal * Math.pow(1 + r, t);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= stepsCount; k++) {
                recurringSum += action.baseVal * Math.pow(1 + r, stepsCount - k);
              }
              depositsVal += recurringSum;
            }
          } else if (action.type === 'investment' || action.type === 'yield' || action.type === 'saving') {
            if (isLump) {
              investmentsVal += action.baseVal * Math.pow(1 + r, t);
            } else {
              let recurringSum = 0;
              for (let k = 1; k <= stepsCount; k++) {
                recurringSum += action.baseVal * Math.pow(1 + r, stepsCount - k);
              }
              investmentsVal += recurringSum;
            }
          }
        });

        const y1 = Math.round(baseGrowthVal);
        const y2 = Math.round(baseGrowthVal + depositsVal);
        const y3 = Math.round(baseGrowthVal + depositsVal + investmentsVal);

        return { year: label, y1, y2, y3 };
      });
    }

    // Default Custom Plan: 5 Years
    const labels = ['2026', '2027', '2028', '2029', '2030', '2031'];
    return labels.map((label, i) => {
      const baseGrowthVal = initialCapital * Math.pow(1.015, i);
      let depositsVal = 0;
      let investmentsVal = 0;

      allActions.forEach(action => {
        if (action.type === 'deposit') {
          if (action.isLumpSum) {
            depositsVal += action.baseVal * Math.pow(1 + action.rate, i);
          } else {
            let recurringSum = 0;
            for (let k = 1; k <= i; k++) {
              recurringSum += action.baseVal * Math.pow(1 + action.rate, i - k);
            }
            depositsVal += recurringSum;
          }
        } else if (action.type === 'investment' || action.type === 'yield') {
          if (action.isLumpSum) {
            investmentsVal += action.baseVal * Math.pow(1 + action.rate, i);
          } else {
            let recurringSum = 0;
            for (let k = 1; k <= i; k++) {
              recurringSum += action.baseVal * Math.pow(1 + action.rate, i - k);
            }
            investmentsVal += recurringSum;
          }
        } else if (action.type === 'grant') {
          if (action.isLumpSum && i >= 1) {
            depositsVal += action.baseVal * Math.pow(1 + 0.02, i - 1);
          } else if (!action.isLumpSum) {
            depositsVal += action.baseVal * i;
          }
        } else if (action.type === 'saving' || action.type === 'defense') {
          depositsVal += action.baseVal * i;
        }
      });

      const y1 = Math.round(baseGrowthVal);
      const y2 = Math.round(baseGrowthVal + depositsVal);
      const y3 = Math.round(baseGrowthVal + depositsVal + investmentsVal);

      return { year: label, y1, y2, y3 };
    });
  };

  const categoriesList = activePlan.categories;
  const chartPoints = calculateDataPoints(activePlan, categoriesList);
  const maxVal = Math.max(50000, Math.max(...chartPoints.map(p => p.y3)) * 1.15);

  const activeTimeline = activePlan.id === 'savings'
    ? activePlan.timelineExcluded(0, false)
    : activePlan.timelineExcluded(0);

  // Transition clip paths based on click origin
  const x = clickPos?.x ?? 195;
  const y = clickPos?.y ?? 422;
  const initialClip = `circle(0% at ${x}px ${y}px)`;
  const animateClip = `circle(150% at ${x}px ${y}px)`;

  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      y: 15,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <motion.div
      initial={{ clipPath: initialClip }}
      animate={{ clipPath: animateClip }}
      exit={{ clipPath: initialClip }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      className="absolute inset-0 bg-brand-primary z-30 flex flex-col overflow-hidden select-none"
    >
      <motion.div
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-full flex flex-col bg-[#F5F5F7] relative overflow-hidden"
      >
        {/* Background Orbs */}
        <BackgroundOrb color="pink" size="300px" className="-top-12 -left-12" />
        <BackgroundOrb color="blue" size="250px" className="bottom-20 -right-10" />

        {/* Header Bar */}
        <header className="pt-6 pb-2 h-auto w-full bg-white/60 backdrop-blur-xl border-b border-zinc-200/40 px-4 flex items-center gap-3 shrink-0 z-40 sticky top-0">
          <button
            onClick={() => setPage('plan-milestones')}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200/50 flex items-center justify-center text-zinc-700 active:scale-90 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-[18px] h-[18px] stroke-[2.2]" />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">NEST ADVISORY BOARD</span>
            <span className="text-sm font-black text-zinc-900 tracking-tight mt-0.5">{activePlan.title}</span>
          </div>
        </header>

        {/* Main Scroll Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-4 z-10 pb-28">
          
          {/* Top Section: Goal & Timeline */}
          <GlassCard className="p-4 border-white/70 relative overflow-hidden bg-white/40 shadow-sm flex flex-col gap-3 shrink-0">
            <span className="text-[8px] font-bold text-brand-primary uppercase tracking-widest leading-none flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Agentic Wealth Proposal
            </span>
            <h2 className="text-base font-black text-zinc-900 tracking-tight leading-snug">
              "{activePlan.goal}"
            </h2>
            <div className="flex items-center gap-2 mt-1 py-1.5 px-3 bg-brand-primary/5 rounded-full border border-brand-primary/10 self-start">
              <Calendar className="w-3.5 h-3.5 text-brand-primary" />
              <span className="text-[10px] font-bold text-brand-primary tracking-tight">
                Estimated Achievement: {activeTimeline}
              </span>
            </div>
          </GlassCard>

          {/* Middle Section: SVG Cumulative Growth Area Chart Component */}
          <GlassCard className="p-4 border-white/60 bg-white/40 shadow-sm flex flex-col gap-2 relative shrink-0">
            <div className="flex items-center justify-between border-b border-zinc-200/20 pb-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Projected Accumulation Curve</span>
                <span className="text-xs font-black text-zinc-800">Growth Forecast</span>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[8px] font-bold text-zinc-400">TARGET CAP</span>
                <span className="text-xs font-black text-emerald-600">
                  ${Math.round(chartPoints[chartPoints.length - 1].y3).toLocaleString()}
                </span>
              </div>
            </div>

            <PlanAreaChart chartPoints={chartPoints} maxVal={maxVal} />
          </GlassCard>

          {/* Section Indicator */}
          <div className="flex flex-col mt-2 shrink-0">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Execution Roadmap</span>
            <span className="text-[9px] text-zinc-400 leading-normal mt-1 text-zinc-400 font-medium">
              Swipe right to cycle, swipe left to bring bottom card up.
            </span>
          </div>

          {/* Main Category Action Card Deck Stack Component */}
          <PlanCardDeck 
            categories={categoriesList} 
            pendingExcluded={new Set()} 
            toggleAction={() => {}} 
            isReadOnly={true}
          />

          {/* Compliance statement */}
          <div className="bg-zinc-200/30 border border-zinc-200/40 rounded-xl p-2.5 flex gap-2 items-start mt-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span className="text-[8px] font-semibold text-zinc-400 leading-normal">
              Wealth advisor proposals are computed by Nest Planner. Historical simulation indicators are models; consult licensed experts before executing SG investments.
            </span>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
};

export default PlanViewPage;
