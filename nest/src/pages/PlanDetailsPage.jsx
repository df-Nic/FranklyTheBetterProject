import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import BackgroundOrb from '../components/ui/BackgroundOrb';

// Modular Imports
import { PLANS_DATA, PLAN_ALTERNATIVES } from '../data/planTemplates';
import PlanAreaChart from '../components/ui/PlanAreaChart';
import PlanCardDeck from '../components/ui/PlanCardDeck';
import ReplanOverlay from '../components/ui/ReplanOverlay';

const PlanDetailsPage = () => {
  const { clickPos, activePlanTitle, activePlanId, planDetailOrigin, setPage, addCreatedPlan } = useApp();

  // 1. Identify active plan template — prefer activePlanId (precise), fall back to fuzzy title match
  const getActivePlan = () => {
    if (activePlanId && PLANS_DATA[activePlanId]) return PLANS_DATA[activePlanId];
    // Legacy fuzzy title-based fallback
    const title = (activePlanTitle || '').toLowerCase();
    if (title.includes('retire')) return PLANS_DATA.retirement;
    if (title.includes('save') || title.includes('home') || title.includes('hdb')) return PLANS_DATA.savings;
    if (title.includes('emerg') || title.includes('safe') || title.includes('shield') || title.includes('protect')) return PLANS_DATA.emergency;
    return PLANS_DATA.default;
  };

  const activePlan = getActivePlan();
  
  // State definitions
  const [categoriesList, setCategoriesList] = useState([]);
  const [pendingExcluded, setPendingExcluded] = useState(new Set());
  const [appliedExcluded, setAppliedExcluded] = useState(new Set());

  const [recalculating, setRecalculating] = useState(false);
  const [replanStepText, setReplanStepText] = useState("");
  const [replanProgress, setReplanProgress] = useState(0);

  // Reset states if target plan changes
  useEffect(() => {
    setCategoriesList(activePlan.categories);
    setPendingExcluded(new Set());
    setAppliedExcluded(new Set());
  }, [activePlanTitle, activePlan]);

  // Back transition clip paths
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

  // Checkbox toggle actions
  const toggleAction = (actionId) => {
    setPendingExcluded(prev => {
      const next = new Set(prev);
      if (next.has(actionId)) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };

  // Replan AI loading simulation
  const triggerReplan = () => {
    setRecalculating(true);
    setReplanProgress(10);
    setReplanStepText("Analyzing deselected suggestions...");

    const timelineSteps = [
      { text: "Analyzing deselected suggestions...", progress: 25 },
      { text: "Finding alternative OCBC wealth products...", progress: 55 },
      { text: "Recalculating alternative growth projections...", progress: 80 },
      { text: "Finalizing optimized OCBC wealth roadmap...", progress: 95 }
    ];

    timelineSteps.forEach((step, i) => {
      setTimeout(() => {
        setReplanStepText(step.text);
        setReplanProgress(step.progress);
      }, (i + 1) * 900);
    });

    setTimeout(() => {
      // Substitute the deselected items with active alternatives
      setCategoriesList(prevCategories => {
        return prevCategories.map(cat => {
          const newActions = cat.actions.map(action => {
            if (pendingExcluded.has(action.id)) {
              const alt = PLAN_ALTERNATIVES[action.id];
              if (alt) return alt;
            }
            return action;
          });
          return {
            ...cat,
            actions: newActions
          };
        });
      });

      setPendingExcluded(new Set());
      setAppliedExcluded(new Set());
      setRecalculating(false);
      setReplanProgress(0);
    }, 4000);
  };

  // Compare pending modifications to applied graphed state
  const areSetsEqual = (a, b) => {
    if (a.size !== b.size) return false;
    for (const item of a) {
      if (!b.has(item)) return false;
    }
    return true;
  };
  const isModified = !areSetsEqual(pendingExcluded, appliedExcluded);

  // Projections calculations based on specific targets and timelines
  const calculateDataPoints = (plan, categories, exclusions) => {
    let initialCapital = 15000;
    if (plan.id === 'retirement') initialCapital = 30000;
    if (plan.id === 'savings') initialCapital = 25000;
    if (plan.id === 'emergency') initialCapital = 6000;

    const allActions = [];
    categories.forEach(cat => {
      cat.actions.forEach(act => {
        allActions.push(act);
      });
    });

    if (plan.id === 'emergency') {
      // 6 Months plan (Jul 2026 - Dec 2026)
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map((month, m) => {
        const baseGrowthVal = initialCapital * Math.pow(1 + 0.015/12, m);
        let depositsVal = 0;
        let investmentsVal = 0;

        allActions.forEach(action => {
          if (exclusions.has(action.id)) return;

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

    if (plan.id === 'savings') {
      // 2.5 Years plan (H1 2026 - H2 2028)
      // Steps of 6 months: t = [0, 0.5, 1, 1.5, 2]
      const labels = ['2026', "H2 '26", '2027', "H2 '27", '2028'];
      const times = [0, 0.5, 1.0, 1.5, 2.0];

      return labels.map((label, idx) => {
        const t = times[idx];
        const baseGrowthVal = initialCapital * Math.pow(1.015, t);
        let depositsVal = 0;
        let investmentsVal = 0;

        allActions.forEach(action => {
          if (exclusions.has(action.id)) return;

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

    if (plan.id === 'retirement') {
      // 19 Years plan (2026 - 2045)
      const labels = ['2026', '2029', '2032', '2035', '2038', '2041', '2045'];
      const times = [0, 3, 6, 9, 12, 15, 19];

      return labels.map((label, idx) => {
        const t = times[idx];
        const baseGrowthVal = initialCapital * Math.pow(1.015, t);
        let depositsVal = 0;
        let investmentsVal = 0;

        allActions.forEach(action => {
          if (exclusions.has(action.id)) return;

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

    // Default Custom Plan: 5 Years (2026 - 2031)
    const labels = ['2026', '2027', '2028', '2029', '2030', '2031'];
    return labels.map((label, i) => {
      const baseGrowthVal = initialCapital * Math.pow(1.015, i);
      let depositsVal = 0;
      let investmentsVal = 0;

      allActions.forEach(action => {
        if (exclusions.has(action.id)) return;

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

  const chartPoints = calculateDataPoints(activePlan, categoriesList, appliedExcluded);
  const maxVal = Math.max(50000, Math.max(...chartPoints.map(p => p.y3)) * 1.15);

  const activeTimeline = activePlan.id === 'savings'
    ? activePlan.timelineExcluded(0, false)
    : activePlan.timelineExcluded(0);

  return (
    <motion.div
      initial={{ clipPath: initialClip }}
      animate={{ clipPath: animateClip }}
      exit={{ clipPath: initialClip }}
      transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      className="absolute inset-0 bg-brand-primary z-50 flex flex-col overflow-hidden select-none"
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
            onClick={() => setPage(planDetailOrigin || 'home')}
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
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-4 z-10 pb-[130px]">
          
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
              Swipe right to cycle, swipe left to bring bottom card up, or tap checkboxes to deselect suggestions you do not want.
            </span>
          </div>

          {/* Main Category Action Card Deck Stack Component */}
          <PlanCardDeck 
            categories={categoriesList} 
            pendingExcluded={pendingExcluded} 
            toggleAction={toggleAction} 
          />

          {/* Compliance statement */}
          <div className="bg-zinc-200/30 border border-zinc-200/40 rounded-xl p-2.5 flex gap-2 items-start mt-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <span className="text-[8px] font-semibold text-zinc-400 leading-normal">
              Wealth advisor proposals are computed by Nest Planner. Historical simulation indicators are models; consult licensed experts before executing SG investments.
            </span>
          </div>

        </div>

        {/* Sticky Footer CTA */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-zinc-200/40 p-4 flex flex-col z-40"
          style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        >
          <AnimatePresence mode="wait">
            {!isModified ? (
              <motion.button
                key="proceed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  addCreatedPlan(activePlan.id);
                  setPage('plan-dashboard');
                }}
                className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold rounded-2xl text-[11px] uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Accept & Save Plan</span>
              </motion.button>
            ) : (
              <motion.button
                key="replan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onClick={triggerReplan}
                className="w-full py-3.5 bg-brand-primary hover:bg-red-600 text-white font-extrabold rounded-2xl text-[11px] uppercase tracking-wider transition-all duration-150 active:scale-[0.97] shadow-lg shadow-brand-primary/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Replan with AI</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Full screen AI Progress Recalculator Overlay */}
        <ReplanOverlay 
          isOpen={recalculating} 
          stepText={replanStepText} 
          progress={replanProgress} 
        />

      </motion.div>
    </motion.div>
  );
};

export default PlanDetailsPage;
