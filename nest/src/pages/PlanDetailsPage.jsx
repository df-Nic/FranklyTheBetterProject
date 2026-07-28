import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Check,
  Target,
  AlertTriangle,
  CheckCircle2,
  Coins
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import BackgroundOrb from '../components/ui/BackgroundOrb';

// Modular Imports
import { PLANS_DATA, PLAN_ALTERNATIVES } from '../data/planTemplates';
import PlanAreaChart from '../components/ui/PlanAreaChart';
import PlanTabbedDeck from '../components/ui/PlanTabbedDeck';
import ReplanOverlay from '../components/ui/ReplanOverlay';
import { getMilestonePlan } from '../data/milestonePlans';

const buildCanonicalProjection = ({
  targetAmount,
  targetDate,
  paymentStrategy,
  monthlyContribution,
  startingBalance = 0,
  categories = [],
}) => {
  const now = new Date();
  const parsedTarget = new Date(targetDate);
  const endDate = Number.isNaN(parsedTarget.getTime())
    ? new Date(now.getFullYear() + 5, 11, 1)
    : parsedTarget;
  const totalMonths = Math.max(1, (endDate.getFullYear() - now.getFullYear()) * 12 + endDate.getMonth() - now.getMonth());
  const contribution = paymentStrategy === 'lump-sum'
    ? 0
    : Number(monthlyContribution) || Math.ceil((Number(targetAmount) / totalMonths) / 10) * 10;
  const investmentActions = categories.flatMap(category => category.actions || [])
    .filter(action => ['investment', 'yield'].includes(action.type));
  const annualRate = investmentActions.length
    ? investmentActions.reduce((sum, action) => sum + Number(action.rate || 0), 0) / investmentActions.length
    : 0.025;
  const pointCount = Math.min(7, Math.max(3, Math.ceil(totalMonths / 12) + 1));

  return Array.from({ length: pointCount }, (_, index) => {
    const elapsedMonths = Math.round(totalMonths * index / (pointCount - 1));
    const pointDate = new Date(now.getFullYear(), now.getMonth() + elapsedMonths, 1);
    const contributed = paymentStrategy === 'lump-sum'
      ? (index === 0 ? 0 : Number(targetAmount))
      : contribution * elapsedMonths;
    const base = Number(startingBalance) + contributed;
    const years = elapsedMonths / 12;
    const projected = base * Math.pow(1 + annualRate, years);
    return {
      year: pointDate.toLocaleDateString('en-SG', { month: 'short', year: '2-digit' }),
      y1: Math.round(Number(startingBalance)),
      y2: Math.round(Math.min(Number(targetAmount), base)),
      y3: Math.round(Math.min(Number(targetAmount), projected)),
    };
  });
};

// Default subgoals registry mapping matching chat widget proposals
const INITIAL_PLAN_SUBGOALS = {
  'housing': [
    { id: 1, name: "First down payment", amount: 37500, date: "Dec 2026" },
    { id: 2, name: "Second down payment", amount: 52500, date: "Dec 2027" },
    { id: 3, name: "Rest of the housing loan", amount: 60000, date: "Jun 2028" }
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
    { id: 1, name: "Venue Booking Savings Target", amount: 14000, date: "Dec 2026" },
    { id: 2, name: "Catering & Banquet Downpayment Goal", amount: 10500, date: "Jun 2027" },
    { id: 3, name: "Honeymoon & Outfits Savings Goal", amount: 10500, date: "Dec 2027" }
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

const PlanDetailsPage = () => {
  const {
    clickPos,
    activePlanTitle,
    activePlanId,
    planDetailOrigin,
    setPage,
    createdPlans,
    customPlanData,
    planDrafts,
    confirmPlan,
    riskProfile,
    planAdjustments,
    changingAction,
    setChangingAction,
    changingCategory,
    setChangingCategory,
    chosenAlternatives,
    setChosenAlternatives,
    pendingExcluded,
    setPendingExcluded,
    appliedExcluded,
    setAppliedExcluded
  } = useApp();

  // 1. Identify active plan template — prefer activePlanId (precise), fall back to fuzzy title match
  const getActivePlan = () => {
    if (activePlanId && PLANS_DATA[activePlanId]) return PLANS_DATA[activePlanId];
    // Legacy fuzzy title-based fallback
    const title = (activePlanTitle || '').toLowerCase();
    const scores = {
      'retirement': 0,
      'wedding-fund': 0,
      'housing': 0,
      'savings': 0,
      'emergency': 0,
      'children-education': 0,
      'career-break': 0,
      'parents-retirement': 0
    };

    if (title.includes('retire') || title.includes('retirement')) {
      if (title.includes('parent') || title.includes('father') || title.includes('mother') || title.includes('parents')) {
        scores['parents-retirement'] += 10;
      } else {
        scores['retirement'] += 10;
      }
    }
    if (title.includes('wed') || title.includes('wedding') || title.includes('marry') || title.includes('marriage')) scores['wedding-fund'] += 10;
    if (title.includes('emerg') || title.includes('emergency')) scores['emergency'] += 10;
    if (title.includes('hdb') || title.includes('downpayment') || title.includes('flat') || title.includes('house') || title.includes('housing') || title.includes('property')) scores['housing'] += 10;
    if (title.includes('save') || title.includes('savings') || title.includes('vault') || title.includes('buffer')) scores['savings'] += 10;
    if (title.includes('child') || title.includes('children') || title.includes('education') || title.includes('school') || title.includes('uni') || title.includes('university') || title.includes('tuition')) scores['children-education'] += 10;
    if (title.includes('career') || title.includes('break') || title.includes('sabbatical') || title.includes('transition')) scores['career-break'] += 10;
    if (title.includes('parent') || title.includes('parents') || title.includes('elderly')) scores['parents-retirement'] += 10;

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
  const isPlanAccepted = activePlan && createdPlans.includes(activePlan.id);
  const activePlanDraft = (activePlan && planDrafts[activePlan.id]) || null;
  const isDraftReview = Boolean(activePlanDraft)
    && !['plan-milestones', 'plan-dashboard'].includes(planDetailOrigin);
  const isConfirmedBreakdown = Boolean(isPlanAccepted && !isDraftReview);
  
  // Custom user preferences passed from chat widget setup
  const userPlanMeta = isDraftReview
    ? activePlanDraft
    : (activePlan && customPlanData[activePlan.id]) || {};

  // Dynamic Goal text and timeline
  const adjustedPlan = activePlanId ? getMilestonePlan(activePlanId, planAdjustments) : null;
  const displayGoalTitle = adjustedPlan?.goalName || activePlan.title;
  const canonicalTargetAmount = isDraftReview
    ? userPlanMeta.targetAmount
    : adjustedPlan?.targetAmount || userPlanMeta.targetAmount;
  const canonicalTargetDate = isDraftReview
    ? userPlanMeta.targetDate
    : adjustedPlan?.goalDate || userPlanMeta.targetDate;
  const displayGoalAmount = canonicalTargetAmount
    ? `S$${Number(canonicalTargetAmount).toLocaleString('en-SG')}`
    : null;

  const displayTargetDate = canonicalTargetDate || null;

  // State definitions
  const [categoriesList, setCategoriesList] = useState([]);

  const [recalculating, setRecalculating] = useState(false);
  const [replanStepText, setReplanStepText] = useState("");
  const [replanProgress, setReplanProgress] = useState(0);

  // Subgoals Table State
  const [subgoals, setSubgoals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '', date: '' });

  // Dynamically synchronize categoriesList when activePlan changes
  useEffect(() => {
    if (activePlan) {
      setCategoriesList(
        isConfirmedBreakdown && userPlanMeta.confirmedCategories?.length
          ? userPlanMeta.confirmedCategories
          : activePlan.categories
      );
    }
  }, [activePlan, isConfirmedBreakdown, userPlanMeta.confirmedCategories]);

  // Reset states if target plan changes
  useEffect(() => {
    // Load subgoals: prioritize user custom subgoals from chat widget if present, else dynamically calculated or initial defaults
    const savedSubgoals = isConfirmedBreakdown && userPlanMeta.confirmedSubgoals?.length
      ? userPlanMeta.confirmedSubgoals
      : userPlanMeta.subgoals;
    if (savedSubgoals && savedSubgoals.length > 0) {
      setSubgoals(savedSubgoals.map((sub, i) => ({
        id: sub.id || i + 1,
        name: sub.name,
        amount: sub.amount,
        date: sub.date
      })));
    } else {
      const baseSubgoals = INITIAL_PLAN_SUBGOALS[activePlan.id] || INITIAL_PLAN_SUBGOALS['default'];
      const targetAmountVal = userPlanMeta.targetAmount ? Number(userPlanMeta.targetAmount) : null;
      
      if (targetAmountVal && baseSubgoals.length > 0) {
        const baseTotal = baseSubgoals.reduce((acc, s) => acc + (s.amount || 0), 0) || 1;
        const scaledSubs = baseSubgoals.map((s, idx) => {
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

          return {
            ...s,
            amount: scaledAmount,
            date: scaledDate
          };
        });
        setSubgoals(scaledSubs);
      } else {
        setSubgoals(baseSubgoals);
      }
    }
  }, [activePlanTitle, activePlan, isConfirmedBreakdown, userPlanMeta]);

  // Extract target numerical plan amount from user meta or goal string
  const getTargetPlanAmount = (plan) => {
    if (canonicalTargetAmount && Number(canonicalTargetAmount) > 0) {
      return Number(canonicalTargetAmount);
    }
    if (!plan || !plan.goal) return 100000;
    const match = plan.goal.match(/SG\$?\s*([\d,]+)/i) || plan.goal.match(/\$?\s*([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
    return 100000;
  };

  // Extract target deadline year/date from user target date or active timeline
  const getPlanTargetYear = (plan) => {
    if (canonicalTargetDate) {
      const yearMatch = canonicalTargetDate.match(/20\d\d/);
      if (yearMatch) return parseInt(yearMatch[0], 10);
    }
    if (!plan || !plan.timelineAll) return 2035;
    const years = plan.timelineAll.match(/20\d\d/g);
    if (years && years.length > 0) {
      return Math.max(...years.map(y => parseInt(y, 10)));
    }
    return 2035;
  };

  const targetPlanAmount = getTargetPlanAmount(activePlan);
  const planHorizonYear = getPlanTargetYear(activePlan);

  const totalSubgoalAmount = subgoals.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const isAmountTally = Math.abs(totalSubgoalAmount - targetPlanAmount) < 1;

  const isDateExceeded = subgoals.some(sub => {
    const yearMatch = (sub.date || '').match(/20\d\d/);
    if (yearMatch) {
      const yr = parseInt(yearMatch[0], 10);
      return yr > planHorizonYear;
    }
    return false;
  });

  // Subgoal CRUD Handlers
  const handleAddSubgoal = () => {
    const newId = Date.now();
    const newSub = {
      id: newId,
      name: "New Milestone Subgoal",
      amount: 10000,
      date: `Dec ${planHorizonYear}`
    };
    setSubgoals(prev => [...prev, newSub]);
    setEditingId(newId);
    setEditForm({ name: newSub.name, amount: newSub.amount, date: newSub.date });
  };

  const handleRemoveSubgoal = (id) => {
    setSubgoals(prev => prev.filter(s => s.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleStartEdit = (sub) => {
    setEditingId(sub.id);
    setEditForm({ name: sub.name, amount: sub.amount, date: sub.date });
  };

  const handleSaveEdit = () => {
    setSubgoals(prev => prev.map(s => {
      if (s.id === editingId) {
        return {
          ...s,
          name: editForm.name,
          amount: Number(editForm.amount) || 0,
          date: editForm.date
        };
      }
      return s;
    }));
    setEditingId(null);
  };

  useEffect(() => {
    console.log("PLAN DETAILS PAGE STATE:", {
      activePlanId,
      activePlanIdType: typeof activePlanId,
      activePlan,
      createdPlans,
      isPlanAccepted,
      planDetailOrigin
    });
  }, [activePlanId, activePlan, createdPlans, isPlanAccepted, planDetailOrigin]);

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
              const alt = chosenAlternatives[action.id] || PLAN_ALTERNATIVES[action.id];
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
      setChosenAlternatives({});
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
    if (plan.id === 'wedding-fund') initialCapital = 10000;
    if (plan.id === 'children-education') initialCapital = 12000;
    if (plan.id === 'career-break') initialCapital = 5000;
    if (plan.id === 'parents-retirement') initialCapital = 15000;

    const allActions = [];
    categories.forEach(cat => {
      cat.actions.forEach(act => {
        const resolvedAct = chosenAlternatives[act.id] || act;
        allActions.push(resolvedAct);
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

    if (plan.id === 'children-education') {
      // 9-10 Years plan (2026 - 2035)
      const labels = ['2026', '2028', '2030', '2032', '2034', '2035'];
      const times = [0, 2, 4, 6, 8, 9];

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
          } else if (action.type === 'investment' || action.type === 'yield' || action.type === 'saving' || action.type === 'defense') {
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

    if (plan.id === 'career-break') {
      // 2 Years plan (Jul 2026 - Jun 2028)
      const labels = ['Jul 26', 'Dec 26', 'Jun 27', 'Dec 27', 'Jun 28'];
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

    if (plan.id === 'parents-retirement') {
      // 6 Years plan (2026 - 2032)
      const labels = ['2026', '2027', '2028', '2029', '2030', '2031', '2032'];
      const times = [0, 1, 2, 3, 4, 5, 6];

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
          } else if (action.type === 'investment' || action.type === 'yield' || action.type === 'saving' || action.type === 'defense') {
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

  const projectionMonthlyContribution = isDraftReview
    ? null
    : adjustedPlan?.monthlyContribution;
  const chartPoints = buildCanonicalProjection({
    targetAmount: canonicalTargetAmount || adjustedPlan?.targetAmount || 0,
    targetDate: canonicalTargetDate || adjustedPlan?.goalDate,
    paymentStrategy: userPlanMeta.paymentStrategy || adjustedPlan?.paymentStrategy || 'staggered',
    monthlyContribution: projectionMonthlyContribution,
    startingBalance: isDraftReview ? 0 : adjustedPlan?.onTrack?.saved || 0,
    categories: categoriesList
      .map(category => ({
        ...category,
        actions: category.actions.filter(action => !appliedExcluded.has(action.id)),
      })),
  });
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
      className="absolute inset-0 z-50 bg-brand-primary flex flex-col overflow-hidden select-none"
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
            onClick={() => setPage(planDetailOrigin === 'risk-profiling' ? 'home' : (planDetailOrigin || 'home'))}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200/50 flex items-center justify-center text-zinc-700 active:scale-90 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-[18px] h-[18px] stroke-[2.2]" />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
              {isConfirmedBreakdown ? 'CONFIRMED PLAN BREAKDOWN' : 'NEST ADVISORY BOARD'}
            </span>
            <span className="text-sm font-black text-zinc-900 tracking-tight mt-0.5">{displayGoalTitle}</span>
          </div>
        </header>

        {/* Main Scroll Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-4 z-10 pb-[130px]">
          
          {/* Top Section: Goal & Timeline */}
          <GlassCard className="p-4 border-white/70 relative overflow-hidden bg-white/40 shadow-sm flex flex-col gap-3 shrink-0">
            <span className="text-[8px] font-bold text-brand-primary uppercase tracking-widest leading-none flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" />
              {isConfirmedBreakdown ? 'Your confirmed Nest plan' : 'Agentic Wealth Proposal'}
            </span>
            <h2 className="text-base font-black text-zinc-900 tracking-tight leading-snug">
              {displayGoalTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {displayGoalAmount && (
                <div className="flex items-center gap-1.5 py-1.5 px-3 bg-emerald-50 rounded-full border border-emerald-200/60 text-emerald-700">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-bold tracking-tight">
                    Target Goal: {displayGoalAmount}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 py-1.5 px-3 bg-brand-primary/5 rounded-full border border-brand-primary/10 text-brand-primary">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-[10px] font-bold tracking-tight">
                  {displayTargetDate ? 'Target Deadline:' : 'Estimated Achievement:'} {displayTargetDate || activeTimeline}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Middle Section: Interactive Subgoals Table & Validation */}
          <GlassCard className="p-4 border-white/60 bg-white/50 backdrop-blur-md shadow-sm flex flex-col gap-3 relative shrink-0">
            <div className="flex items-center justify-between border-b border-zinc-200/40 pb-2.5">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Plan Subgoals & Target Allocations</span>
                <span className="text-xs font-black text-zinc-800 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-brand-primary" />
                  Subgoals Breakdown
                </span>
              </div>
              {!isConfirmedBreakdown && (
                <button
                  onClick={handleAddSubgoal}
                  className="px-2.5 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Add Subgoal</span>
                </button>
              )}
            </div>

            {/* Subgoals Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/60 text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                    <th className="py-1.5 px-1.5 w-[42%]">Subgoal</th>
                    <th className="py-1.5 px-1.5 w-[28%] text-right">Amount (SGD)</th>
                    <th className="py-1.5 px-1.5 w-[22%] text-center">Target Date</th>
                    {!isConfirmedBreakdown && <th className="py-1.5 px-0.5 w-[8%] text-center"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/40">
                  {subgoals.map((sub, idx) => (
                    <tr key={sub.id || idx} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="py-2 px-1.5 align-middle">
                        {editingId === sub.id ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full bg-white border border-brand-primary/40 rounded px-1.5 py-1 text-xs text-zinc-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          />
                        ) : (
                          <span className="font-semibold text-zinc-800 text-[11px] leading-tight block">
                            {sub.name}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-1.5 align-middle text-right">
                        {editingId === sub.id ? (
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="w-20 bg-white border border-brand-primary/40 rounded px-1.5 py-1 text-xs text-zinc-900 font-semibold text-right focus:outline-none focus:ring-1 focus:ring-brand-primary ml-auto block"
                          />
                        ) : (
                          <span className="font-extrabold text-zinc-900 text-[11px]">
                            ${Number(sub.amount || 0).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-1.5 align-middle text-center">
                        {editingId === sub.id ? (
                          <input
                            type="text"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            placeholder="e.g. Dec 2028"
                            className="w-20 bg-white border border-brand-primary/40 rounded px-1 py-1 text-[11px] text-zinc-900 font-medium text-center focus:outline-none focus:ring-1 focus:ring-brand-primary mx-auto block"
                          />
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold">
                            {sub.date}
                          </span>
                        )}
                      </td>
                      {!isConfirmedBreakdown && <td className="py-2 px-0.5 align-middle text-center">
                        {editingId === sub.id ? (
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 text-emerald-600 hover:text-emerald-700 active:scale-90 transition-transform"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleStartEdit(sub)}
                              className="p-1 text-zinc-400 hover:text-zinc-700 active:scale-90 transition-transform"
                              title="Edit Subgoal"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveSubgoal(sub.id)}
                              className="p-1 text-zinc-400 hover:text-red-500 active:scale-90 transition-transform"
                              title="Remove Subgoal"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Validation Banner */}
            <div className="mt-1 pt-2.5 border-t border-zinc-200/50 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-zinc-500">Subgoals Total Amount:</span>
                <span className={`font-black ${isAmountTally ? 'text-emerald-600' : 'text-amber-600'}`}>
                  ${totalSubgoalAmount.toLocaleString()} / ${targetPlanAmount.toLocaleString()}
                </span>
              </div>

              {!isAmountTally && (
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-semibold text-amber-700 leading-snug">
                    Total amount does not tally with overall plan target (${targetPlanAmount.toLocaleString()}). Discrepancy: ${(totalSubgoalAmount - targetPlanAmount > 0 ? '+' : '')}${(totalSubgoalAmount - targetPlanAmount).toLocaleString()}.
                  </span>
                </div>
              )}

              {isDateExceeded && (
                <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-semibold text-red-700 leading-snug">
                    One or more subgoal target dates exceed the plan's target timeline ({planHorizonYear}).
                  </span>
                </div>
              )}

              {isAmountTally && !isDateExceeded && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-[10px] font-bold text-emerald-700">
                    All subgoal amounts tally and dates are within target schedule!
                  </span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Section Indicator & Instructions */}
          <div className="flex flex-col gap-2 shrink-0 mt-1">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {isConfirmedBreakdown ? 'Confirmed strategy' : 'Execution Roadmap'}
            </span>
            <div className="bg-white/50 border border-zinc-200/50 backdrop-blur-md rounded-2xl p-3 flex flex-col gap-2.5 shadow-sm">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                {isConfirmedBreakdown
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  : <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />}
                {isConfirmedBreakdown ? 'Your accepted recommendations' : 'Review your Nest Plan'}
              </span>
              {isConfirmedBreakdown && (
                <p className="text-[10px] text-zinc-600 font-semibold leading-relaxed">
                  These are the milestones, payment preferences, and wealth products confirmed for this plan.
                </p>
              )}
              <ul className={`${isConfirmedBreakdown ? 'hidden' : 'flex'} flex-col gap-2 text-[10px] text-zinc-600 font-semibold leading-normal list-none pl-0`}>
                <li className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 font-black text-[9px]">1</span>
                  <span><strong>Inspect Suggestions:</strong> Tap the category tabs below to see recommended wealth products.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 font-black text-[9px]">2</span>
                  <span><strong>Change Option:</strong> Click on any part of the card to choose alternative options. To undo, click the restore icon (↺).</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="w-4 h-4 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 font-black text-[9px]">3</span>
                  <span><strong>Replan with AI:</strong> Tap <strong>Replan with AI</strong> below to calculate new projections. Click <strong>Accept & Save Plan</strong> when satisfied.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Category Action Tabbed View Component */}
          <PlanTabbedDeck 
            categories={categoriesList} 
            pendingExcluded={pendingExcluded} 
            toggleAction={toggleAction} 
            onChangeProduct={isConfirmedBreakdown ? undefined : (action, category) => {
              setChangingAction(action);
              setChangingCategory(category);
              setPage('plan-change-option');
            }}
            isReadOnly={isConfirmedBreakdown}
            chosenAlternatives={chosenAlternatives}
            activePlan={activePlan}
            riskProfile={riskProfile}
          />

          {/* Staggered Payments Callout Notice */}
          {userPlanMeta.paymentStrategy?.toLowerCase() === 'staggered' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-50 border border-blue-100 rounded-[24px] flex gap-3.5 items-start mt-2 shrink-0 shadow-sm"
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
            </motion.div>
          )}

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
          <button
            onClick={() => {
              if (isConfirmedBreakdown) {
                setPage('plan-milestones');
                return;
              }
              const confirmed = confirmPlan(activePlan.id, {
                ...userPlanMeta,
                targetAmount: canonicalTargetAmount,
                targetDate: canonicalTargetDate,
                paymentStrategy: userPlanMeta.paymentStrategy || 'lump-sum',
                subgoals,
                categories: categoriesList,
              });
              if (confirmed) setPage('plan-dashboard');
            }}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold rounded-2xl text-[11px] uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isConfirmedBreakdown ? 'Back to plan journey' : 'Accept & Save Plan'}</span>
          </button>
        </div>



      </motion.div>
    </motion.div>
  );
};

export default PlanDetailsPage;
