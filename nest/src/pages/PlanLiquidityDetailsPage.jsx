import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Coins,
  Calendar,
  AlertCircle,
  Lock,
  RefreshCw,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useApp, getHousingSubgoals } from '../context/AppContext';
import { PLANS_DATA } from '../data/planTemplates';
import { getLiquidityExplanation } from '../data/liquidityData';
import BackgroundOrb from '../components/ui/BackgroundOrb';

const INITIAL_PLAN_SUBGOALS = {
  'housing': [
    { id: 1, name: "First down payment", amount: 125000, date: "Dec 2027" },
    { id: 2, name: "Second down payment", amount: 175000, date: "Dec 2028" },
    { id: 3, name: "Rest of the housing loan", amount: 200000, date: "Aug 2030" }
  ],
  'savings': [
    { id: 1, name: "Emergency Buffer Deposit Goal", amount: 15000, date: "Dec 2026" },
    { id: 2, name: "High-Yield Vault Target", amount: 15000, date: "Dec 2027" },
    { id: 3, name: "Growth Reserves Allocation Goal", amount: 20000, date: "Jun 2028" }
  ],
  'retirement': [
    { id: 1, name: "SRS & CPF Retirement Sum Target", amount: 225000, date: "Dec 2032" },
    { id: 2, name: "Strategic Wealth Growth Target", amount: 525000, date: "Dec 2038" },
    { id: 3, name: "GE Lifetime Payout Annuity Target", amount: 750000, date: "Oct 2045" }
  ],
  'wedding-fund': [
    { id: 1, name: "Venue Booking", amount: 14000, date: "Dec 2026" },
    { id: 2, name: "Catering & Banquet", amount: 10500, date: "Jun 2027" },
    { id: 3, name: "Honeymoon & Outfits", amount: 10500, date: "Dec 2027" }
  ],
  'children-education': [
    { id: 1, name: "CDA Account Savings Target", amount: 12000, date: "Dec 2028" },
    { id: 2, name: "Secondary School Savings Goal", amount: 28000, date: "Dec 2031" },
    { id: 3, name: "University Tuition Fees Target", amount: 40000, date: "Oct 2035" }
  ],
  'career-break': [
    { id: 1, name: "Living Expenses Savings Target", amount: 15000, date: "Dec 2026" },
    { id: 2, name: "Upskilling & Course Fee Goal", amount: 5000, date: "Dec 2027" },
    { id: 3, name: "Transition Emergency Cash Goal", amount: 5000, date: "Jun 2028" }
  ],
  'parents-retirement': [
    { id: 1, name: "Parents' Retirement Sum Target", amount: 60000, date: "Dec 2028" },
    { id: 2, name: "Senior Healthcare Protection Goal", amount: 30000, date: "Dec 2030" },
    { id: 3, name: "Elderly Care Living Fund Goal", amount: 30000, date: "Dec 2032" }
  ],
  'default': [
    { id: 1, name: "Short-term Reserve Vault", amount: 25000, date: "Dec 2027" },
    { id: 2, name: "Core Investment Portfolio Target", amount: 45000, date: "Dec 2029" },
    { id: 3, name: "Long-term Wealth Acceleration Goal", amount: 30000, date: "Apr 2031" }
  ]
};

const PlanLiquidityDetailsPage = () => {
  const {
    activePlanId,
    activePlanTitle,
    customPlanData,
    chosenAlternatives,
    appliedExcluded,
    housingPropertyType,
    setPage,
  } = useApp();

  // Resolve active plan
  const activePlan = useMemo(() => {
    let resolvedId = activePlanId;
    if (!resolvedId) {
      const title = (activePlanTitle || '').toLowerCase();
      if (title.includes('retire')) resolvedId = 'retirement';
      else if (title.includes('wedding')) resolvedId = 'wedding-fund';
      else if (title.includes('child') || title.includes('edu')) resolvedId = 'children-education';
      else if (title.includes('career')) resolvedId = 'career-break';
      else if (title.includes('parent')) resolvedId = 'parents-retirement';
      else resolvedId = 'housing';
    }

    const basePlan = PLANS_DATA[resolvedId] || PLANS_DATA['housing'];
    if (basePlan.id === 'housing' && basePlan.getByType) {
      return basePlan.getByType(housingPropertyType || 'hdb');
    }
    return basePlan;
  }, [activePlanId, activePlanTitle, housingPropertyType]);

  const userPlanMeta = (activePlan && customPlanData[activePlan.id]) || {};

  // Resolve active subgoals
  const subgoals = useMemo(() => {
    const savedSubgoals = userPlanMeta.confirmedSubgoals?.length
      ? userPlanMeta.confirmedSubgoals
      : userPlanMeta.subgoals;

    if (savedSubgoals && savedSubgoals.length > 0) {
      return savedSubgoals.map((sub, i) => ({
        id: sub.id || i + 1,
        name: sub.name,
        amount: sub.amount,
        date: sub.date
      }));
    }

    const baseSubgoals = activePlan.id === 'housing'
      ? getHousingSubgoals(housingPropertyType || 'hdb', userPlanMeta.targetAmount || 500000, userPlanMeta.targetDate || 'Aug 2030')
      : (INITIAL_PLAN_SUBGOALS[activePlan.id] || INITIAL_PLAN_SUBGOALS['default']);

    const targetAmountVal = userPlanMeta.targetAmount ? Number(userPlanMeta.targetAmount) : null;
    if (targetAmountVal && baseSubgoals.length > 0) {
      const baseTotal = baseSubgoals.reduce((acc, s) => acc + (s.amount || 0), 0) || 1;
      return baseSubgoals.map((s, idx) => {
        const ratio = s.amount / baseTotal;
        const scaledAmount = Math.round(ratio * targetAmountVal);
        let scaledDate = s.date;
        if (userPlanMeta.targetDate) {
          if (idx === baseSubgoals.length - 1) {
            scaledDate = userPlanMeta.targetDate;
          } else {
            const yearMatch = userPlanMeta.targetDate.match(/20\d\d/);
            if (yearMatch) {
              const targetYr = parseInt(yearMatch[0], 10);
              const startYr = 2026;
              const stepYr = Math.min(targetYr, startYr + Math.round(((targetYr - startYr) * (idx + 1)) / baseSubgoals.length));
              const monthStr = (s.date || '').split(' ')[0] || 'Dec';
              scaledDate = `${monthStr} ${stepYr}`;
            }
          }
        }
        return { ...s, amount: scaledAmount, date: scaledDate };
      });
    }
    return baseSubgoals;
  }, [activePlan, userPlanMeta, housingPropertyType]);

  // Extract recommended Deposits & Investments
  const depositAndInvestmentActions = useMemo(() => {
    if (!activePlan || !activePlan.categories) return [];

    const result = [];
    activePlan.categories.forEach((cat) => {
      const catId = (cat.id || '').toLowerCase();
      const catName = (cat.name || '').toLowerCase();
      const isDepositOrInvestCategory =
        catId.includes('deposit') ||
        catId.includes('invest') ||
        catId.includes('sav') ||
        catName.includes('deposit') ||
        catName.includes('invest') ||
        catName.includes('savings');

      if (!isDepositOrInvestCategory) return;

      (cat.actions || []).forEach((originalAction) => {
        if (appliedExcluded.has(originalAction.id)) return;
        const actionObj = chosenAlternatives[originalAction.id] || originalAction;
        const actType = (actionObj.type || '').toLowerCase();
        if (['deposit', 'investment', 'yield'].includes(actType)) {
          const explanation = getLiquidityExplanation(actionObj);
          result.push({
            action: actionObj,
            originalId: originalAction.id,
            categoryName: cat.name,
            categoryId: cat.id,
            isReplanned: Boolean(chosenAlternatives[originalAction.id]),
            explanation,
          });
        }
      });
    });

    return result;
  }, [activePlan, chosenAlternatives, appliedExcluded]);

  // Goal name descriptor for dynamic text (e.g. 'wedding', 'housing', etc.)
  const goalDescriptor = useMemo(() => {
    if (activePlan?.id === 'wedding-fund') return 'wedding';
    if (activePlan?.id === 'housing') return 'housing';
    if (activePlan?.id === 'children-education') return 'education';
    if (activePlan?.id === 'retirement') return 'retirement';
    return 'plan';
  }, [activePlan]);

  const monthlyTransferAmount = userPlanMeta.monthlyContribution || 500;
  const userName = userPlanMeta.userName || "Daniel";

  return (
    <div className="w-full h-full bg-[#F5F5F7] text-zinc-900 flex flex-col overflow-hidden relative select-none font-sans">
      {/* Background ambient decorative orbs matching PlanDetailsPage */}
      <BackgroundOrb color="pink" size="300px" className="-top-12 -left-12" />
      <BackgroundOrb color="blue" size="250px" className="bottom-20 -right-10" />

      {/* Header Bar */}
      <header className="pt-6 pb-2.5 h-auto w-full bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 px-4 flex items-center gap-3 shrink-0 z-40 sticky top-0 shadow-xs">
        <button
          onClick={() => setPage('plan-details')}
          className="w-9 h-9 rounded-full bg-white border border-zinc-200/60 flex items-center justify-center text-zinc-700 active:scale-90 transition-all duration-150 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-[18px] h-[18px] stroke-[2.2]" />
        </button>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest leading-none">
            STAGGERED PLAN EDUCATION
          </span>
          <h1 className="text-base font-black text-zinc-900 tracking-tight mt-0.5">
            How Your Plan Stays Flexible
          </h1>
        </div>
      </header>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pb-24 z-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

        {/* Card 1: PAYMENT FLEXIBILITY (Hero Concept Card matching Updated Screen 2 mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-3xl bg-white border border-zinc-200/70 shadow-xs relative overflow-hidden space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-100/80 flex items-center justify-center text-red-600 shrink-0">
                <Lock className="w-4.5 h-4.5 stroke-[2.2]" />
              </div>
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">
                PAYMENT FLEXIBILITY
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70 shrink-0">
              {subgoals.length} Payment Milestones
            </span>
          </div>

          <p className="text-xs text-zinc-700 leading-snug font-medium pr-1">
            NEST plans each {goalDescriptor} payment separately so the right amount is ready when needed.
          </p>
        </motion.div>

        {/* Card 2: YOUR PAYMENT TIMELINE (Subgoals Timeline matching Updated Screen 2 mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="p-4 rounded-3xl bg-white border border-zinc-200/70 shadow-xs space-y-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-red-600 shrink-0" />
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
              YOUR PAYMENT TIMELINE
            </h3>
          </div>

          <div className="space-y-2.5">
            {subgoals.map((sub, idx) => {
              const statusTag = idx === 0 ? "Available anytime" : idx === 1 ? "Ready before payment" : "Planned for later";
              const tagStyle = idx === 0
                ? "bg-emerald-50 text-emerald-800 border-emerald-200/70"
                : idx === 1
                  ? "bg-emerald-50/80 text-emerald-800 border-emerald-200/60"
                  : "bg-emerald-50/40 text-emerald-800 border-emerald-200/40";

              return (
                <div
                  key={sub.id || idx}
                  className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/50 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-red-50 text-red-600 text-[11px] font-black flex items-center justify-center border border-red-100 shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-extrabold text-zinc-900 truncate">{sub.name}</span>
                      <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-zinc-400 shrink-0" /> Target: {sub.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <span className="text-sm font-black text-red-950">
                      S${Number(sub.amount || 0).toLocaleString('en-SG')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${tagStyle}`}>
                      {statusTag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Card 3: Auto-fund this goal (matching Updated Screen 3 mockup) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3.5 rounded-3xl bg-white border border-zinc-200/70 shadow-xs flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50/80 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-100/80 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
              <RefreshCw className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-zinc-900">Auto-fund this goal</span>
              <span className="text-[11px] text-zinc-600 font-medium truncate mt-0.5">
                Transfer S${monthlyTransferAmount} monthly into {userName}&apos;s {goalDescriptor} allocation.
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </motion.div>

        {/* Section Title: RECOMMENDED ALLOCATIONS (matching Updated Screen 3 mockup) */}
        <div className="flex items-center justify-between pt-1 px-1 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-4 h-4 text-zinc-700 shrink-0" />
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider leading-snug">
              RECOMMENDED ALLOCATIONS
            </h3>
          </div>
          <span className="text-xs font-bold text-zinc-600 bg-white px-2.5 py-1 rounded-full border border-zinc-200/70 shadow-2xs shrink-0 whitespace-nowrap">
            {depositAndInvestmentActions.length || 3} Allocations
          </span>
        </div>

        {/* Product Allocation Cards (matching Updated Screen 3 mockup) */}
        <div className="space-y-3.5">
          {depositAndInvestmentActions.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 bg-white rounded-3xl border border-zinc-200/60 shadow-xs">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-zinc-400" />
              <p className="text-xs font-semibold">No deposit or investment recommendations found in this plan configuration.</p>
            </div>
          ) : (
            depositAndInvestmentActions.map(({ action, categoryName, explanation }, idx) => {
              const matchedSubgoal = subgoals[idx] || subgoals[subgoals.length - 1] || {};
              const shortSubgoalName = (matchedSubgoal.name || '')
                .replace(/Savings|Target|Goal|Downpayment|Buffer/gi, '')
                .trim() || `Milestone ${idx + 1}`;

              const tagText = idx === 0 ? "Near-term cash" : idx === 1 ? "Maturity matched" : "Later milestone";
              const whenAvailableText = idx === 0 ? "Daily access" : `Ready before ${matchedSubgoal.date || 'payment'}`;
              const supportsPaymentText = shortSubgoalName;
              const termsBadgeText = idx === 0 ? "No early withdrawal needed" : "Held to maturity";
              const termsSubtext = idx === 0
                ? "Best for the nearest vendor payment."
                : idx === 1
                  ? "Planned to mature before payment is due."
                  : "Planned to mature before later payment is due.";

              const productDesc = idx === 0
                ? `Keeps funds for the ${shortSubgoalName.toLowerCase()} payment accessible day to day.`
                : idx === 1
                  ? `A fixed deposit scheduled to mature before the next ${goalDescriptor} milestone.`
                  : `A fixed deposit scheduled for later ${goalDescriptor} milestones.`;

              return (
                <motion.div
                  key={action.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + idx * 0.05 }}
                  className="p-4 rounded-3xl bg-white border border-zinc-200/70 shadow-xs space-y-3"
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                        <Coins className="w-3.5 h-3.5 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-red-600">
                        DEPOSITS
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                      {tagText}
                    </span>
                  </div>

                  {/* Title and custom description */}
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 leading-snug">{action.name}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal mt-0.5">
                      {productDesc}
                    </p>
                  </div>

                  {/* Boxes: When funds are available & Supports this payment — side by side */}
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 space-y-0.5 text-xs">
                      <span className="text-zinc-400 text-[11px] font-semibold block">When funds are available</span>
                      <span className="text-xs font-black text-emerald-700 block">
                        {whenAvailableText}
                      </span>
                    </div>
                    <div className="flex-1 p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 space-y-0.5 text-xs">
                      <span className="text-zinc-400 text-[11px] font-semibold block">Supports this payment</span>
                      <span className="text-xs font-black text-zinc-900 block">
                        {supportsPaymentText}
                      </span>
                    </div>
                  </div>

                  {/* Box 2: Access and withdrawal terms */}
                  <div className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 space-y-1 text-xs">
                    <span className="text-zinc-400 text-[11px] font-semibold block">Access and withdrawal terms</span>
                    <div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70 inline-block">
                        {termsBadgeText}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 font-medium pt-0.5">
                      {termsSubtext}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

      </div>

      {/* Sticky Footer CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-zinc-200/40 p-4 flex flex-col z-40"
        style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => setPage('plan-details')}
          className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-2"
        >
          <span>RETURN TO PLAN REVIEW</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default PlanLiquidityDetailsPage;
