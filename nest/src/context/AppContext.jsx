import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTransactionDeviation } from '../data/transactionDeviations';
import { getPlanOpportunity } from '../data/planOpportunities';

const AppContext = createContext();

const DEMO_HOUSING_SUBGOALS = [
  { id: 1, name: 'First down payment', amount: 37500, date: 'Dec 2026' },
  { id: 2, name: 'Second down payment', amount: 52500, date: 'Sep 2027' },
  { id: 3, name: 'Rest of the housing loan', amount: 60000, date: 'Mar 2028' },
];

const getMonthsUntil = (targetDate) => {
  const parsed = new Date(targetDate);
  if (Number.isNaN(parsed.getTime())) return 1;
  const now = new Date();
  return Math.max(1, (parsed.getFullYear() - now.getFullYear()) * 12 + parsed.getMonth() - now.getMonth());
};

const getRequiredMonthlyContribution = (targetAmount, targetDate, paymentStrategy) => {
  if (paymentStrategy !== 'staggered') return 0;
  const rawAmount = Number(targetAmount) / getMonthsUntil(targetDate);
  return Math.ceil(rawAmount / 10) * 10;
};

const buildConfirmedMilestones = (subgoals, targetDate) => {
  const created = {
    id: 'created',
    name: 'Goal Created',
    date: new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
    state: 'completed',
  };
  if (!subgoals?.length) {
    return [created, { id: 'goal', name: 'Target reached', date: targetDate, state: 'goal' }];
  }
  return [
    created,
    ...subgoals.map((subgoal, index) => ({
      id: `confirmed-${subgoal.id}`,
      name: subgoal.name,
      date: subgoal.date,
      amount: Number(subgoal.amount),
      state: index === 0 ? 'next' : index === subgoals.length - 1 ? 'goal' : 'upcoming',
    })),
  ];
};

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState('landing'); // includes plan milestones, savings breakdown and opportunity detail routes
  const [isMasked, setIsMasked] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts', 'investments', 'cards', 'loans'
  const [clickPos, setClickPos] = useState(null);
  const [activePlanTitle, setActivePlanTitle] = useState('');
  const [activePlanId, setActivePlanId] = useState(null); // Selected proposal or accepted plan
  // Demo seed: Daniel already has one accepted Housing plan.
  const [createdPlans, setCreatedPlans] = useState(['housing']); // Plans are added only after explicit acceptance

  // Shared Change Option States
  const [changingAction, setChangingAction] = useState(null);
  const [changingCategory, setChangingCategory] = useState(null);
  const [chosenAlternatives, setChosenAlternatives] = useState({});
  const [pendingExcluded, setPendingExcluded] = useState(new Set());
  const [appliedExcluded, setAppliedExcluded] = useState(new Set());

  // Reset selected alternatives and exclusion states when the active plan changes
  useEffect(() => {
    setPendingExcluded(new Set());
    setAppliedExcluded(new Set());
    setChosenAlternatives({});
  }, [activePlanId]);

  const [hasCreatedFirstPlan, setHasCreatedFirstPlan] = useState(false);
  const [riskProfile, setRiskProfile] = useState('Balanced Wealth');
  const [planDetailOrigin, setPlanDetailOrigin] = useState('home'); // 'home' | 'plan-dashboard'
  const [opportunityDecisions, setOpportunityDecisions] = useState({});
  const [opportunityNotice, setOpportunityNotice] = useState(null);
  const [planAdjustments, setPlanAdjustments] = useState({
    housing: {
      targetAmount: 150000,
      goalDate: 'Mar 2028',
      monthlyContribution: 2500,
      paymentStrategy: 'staggered',
      milestones: [
        { id: 'created', name: 'Goal Created', date: '12 Jan 2026', state: 'completed' },
        { id: 'initial', name: 'Initial Deposit Ready', date: '18 Mar 2026', state: 'completed' },
        { id: 'quarter', name: '25% Funded', date: 'Jan 2027', state: 'next' },
        { id: 'halfway', name: 'Halfway Funded', date: 'Jul 2027', state: 'upcoming' },
        { id: 'ready', name: 'Downpayment Ready', date: 'Mar 2028', state: 'goal' },
      ],
    },
  });
  const [planActivity, setPlanActivity] = useState([]);
  const [transactionDeviations, setTransactionDeviations] = useState([]);
  const [activeDeviationId, setActiveDeviationId] = useState(null);
  const [planChatRequest, setPlanChatRequest] = useState(0);
  const [user, setUser] = useState({
    name: 'Daniel',
    accessId: '',
  });

  const [accountsData, setAccountsData] = useState([
    {
      id: 'acc-1',
      name: '360 Account',
      number: '001-23456-789',
      balance: 138439.11,
      currency: 'SGD',
      type: 'Savings Account',
      rate: '4.65% p.a.',
    },
    {
      id: 'acc-2',
      name: 'Savings Account',
      number: '001-98765-432',
      balance: 15420.50,
      currency: 'SGD',
      isJoint: true,
      type: 'Joint Savings',
      rate: '2.15% p.a.',
    }
  ]);

  const [selectedAccountId, setSelectedAccountId] = useState('acc-1');
  const [opportunitySourceAmount, setOpportunitySourceAmount] = useState(8000);
  const [showOpportunityPopup, setShowOpportunityPopup] = useState(false);

  const performMockDeposit = (amount, accountId = selectedAccountId || 'acc-1') => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) return false;
    setAccountsData((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, balance: acc.balance + numAmount } : acc
      )
    );
    setOpportunitySourceAmount(numAmount);
    setShowOpportunityPopup(true);
    setPage('home');
    return true;
  };

  // PayNow specific states
  const [paynowContact, setPaynowContact] = useState(null);
  const [paynowAmount, setPaynowAmount] = useState('');
  const [paynowReference, setPaynowReference] = useState('');
  const [paynowSourceAccount, setPaynowSourceAccount] = useState(accountsData[0]);

  // Login redirect state
  const [loginRedirectPage, setLoginRedirectPage] = useState(null);

  const navigate = (targetPage) => {
    setPage(targetPage);
  };

  // Add a plan to the in-memory list (deduplicated by id)
  const addCreatedPlan = (planId) => {
    setCreatedPlans(prev => {
      if (prev.includes(planId)) return prev;
      return [...prev, planId];
    });
  };

  const adjustPlan = (planId, adjustments) => {
    setPlanAdjustments(prev => ({
      ...prev,
      [planId]: {
        ...(prev[planId] || {}),
        ...adjustments
      }
    }));
  };

  const addPlanActivity = (planId, event) => {
    if (!planId || !event?.id) return;
    setPlanActivity(prev => [...prev.filter(item => item.id !== event.id), { ...event, planId }]);
  };

  const registerTransactionDeviation = (transaction) => {
    const deviation = createTransactionDeviation({
      ...transaction,
      id: transaction.id || `deviation-${Date.now()}`,
      timestamp: transaction.timestamp || new Date().toISOString(),
      planIds: createdPlans,
      adjustments: planAdjustments,
    });
    if (!deviation) return null;
    setTransactionDeviations((current) =>
      current.some((item) => item.id === deviation.id) ? current : [...current, deviation]);
    deviation.affectedPlans.forEach((affectedPlan) => addPlanActivity(affectedPlan.planId, {
      id: `transaction-impact-${deviation.id}-${affectedPlan.planId}`,
      actor: 'owl',
      type: 'deviation',
      title: affectedPlan.impactStatus === 'needs-healing'
        ? 'Plan deviation detected'
        : affectedPlan.impactStatus === 'reduced-buffer'
          ? 'Plan buffer reduced'
          : 'Transaction impact checked',
      description: affectedPlan.impactStatus === 'needs-healing'
        ? `${deviation.type === 'paynow' ? 'PayNow' : 'A transaction'} of S$${deviation.amount.toLocaleString('en-SG')} may leave this plan S$${Math.round(affectedPlan.gap).toLocaleString('en-SG')} behind its expected path.`
        : affectedPlan.impactStatus === 'reduced-buffer'
          ? `Agent Owl assessed the S$${deviation.amount.toLocaleString('en-SG')} transaction. This plan remains on track with S$${Math.round(affectedPlan.remainingBuffer).toLocaleString('en-SG')} of buffer remaining.`
          : `Agent Owl assessed the S$${deviation.amount.toLocaleString('en-SG')} transaction and confirmed that this plan remains on track.`,
      timestamp: deviation.timestamp,
      status: affectedPlan.status === 'pending' ? 'needs review' : 'assessed',
    }));
    return deviation.id;
  };

  const dismissDeviationNotifications = () => setTransactionDeviations((current) =>
    current.map((event) => event.status === 'pending' ? { ...event, notificationDismissed: true } : event));

  const openDeviation = (id) => {
    setActiveDeviationId(id);
    setPage('plan-healer');
  };

  const applyDeviationRecovery = (eventId, planId, strategyId) => {
    const event = transactionDeviations.find((item) => item.id === eventId);
    const affectedPlan = event?.affectedPlans.find((item) => item.planId === planId && item.status === 'pending');
    const option = affectedPlan?.recoveryOptions?.find((item) => item.id === strategyId);
    if (!event || !affectedPlan || !option) return false;
    adjustPlan(planId, {
      ...option.changes,
      strategy: strategyId,
      healed: true,
      selectedPlanId: planId,
    });
    setTransactionDeviations((current) => current.map((item) => {
      if (item.id !== eventId) return item;
      const affectedPlans = item.affectedPlans.map((candidate) =>
        candidate.planId === planId && candidate.status === 'pending'
          ? { ...candidate, gap: 0, status: 'applied', resolution: strategyId, strategyId, resolvedAt: new Date().toISOString() }
          : candidate);
      return { ...item, affectedPlans, status: affectedPlans.some((candidate) => candidate.status === 'pending') ? 'pending' : 'resolved' };
    }));
    addPlanActivity(planId, {
      id: `deviation-applied-${eventId}-${planId}`,
      actor: 'owl',
      type: 'adjustment',
      title: 'Plan recovery applied',
      description: `${option.title} was applied after a S$${event.amount.toLocaleString('en-SG')} ${event.type === 'paynow' ? 'PayNow payment' : 'transaction'} (${option.before} to ${option.after}).`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });
    return true;
  };

  const declineDeviationRecovery = (eventId, planId) => {
    const event = transactionDeviations.find((item) => item.id === eventId);
    const affectedPlan = event?.affectedPlans.find((item) => item.planId === planId && item.status === 'pending');
    if (!event || !affectedPlan) return false;
    setTransactionDeviations((current) => current.map((item) => {
      if (item.id !== eventId) return item;
      const affectedPlans = item.affectedPlans.map((candidate) =>
        candidate.planId === planId && candidate.status === 'pending'
          ? { ...candidate, status: 'declined', resolution: 'declined', resolvedAt: new Date().toISOString() }
          : candidate);
      return { ...item, affectedPlans, status: affectedPlans.some((candidate) => candidate.status === 'pending') ? 'pending' : 'resolved' };
    }));
    addPlanActivity(planId, {
      id: `deviation-declined-${eventId}-${planId}`,
      actor: 'user',
      type: 'decision',
      title: 'Current plan kept',
      description: `You reviewed the S$${event.amount.toLocaleString('en-SG')} transaction impact and chose not to change this plan.`,
      timestamp: new Date().toISOString(),
      status: 'declined',
    });
    return true;
  };

  const applyHealerStrategy = applyDeviationRecovery;

  const applyOpportunityRecovery = (eventId, allocations) => {
    const event = transactionDeviations.find((item) => item.id === eventId);
    const opportunity = getPlanOpportunity();
    const validAllocations = allocations.filter((item) => Number.isInteger(item.amount) && item.amount > 0);
    const allocated = validAllocations.reduce((sum, item) => sum + item.amount, 0);
    if (!event || !validAllocations.length || allocated > opportunity.sourceAmount) return false;
    const sourcePlanId = event.recommendedPlanId;
    if (!decideOpportunity(sourcePlanId, opportunity, 'accepted', validAllocations)) return false;
    setTransactionDeviations((current) => current.map((item) => {
      if (item.id !== eventId) return item;
      const affectedPlans = item.affectedPlans.map((plan) => {
        const allocation = validAllocations.find((candidate) => candidate.planId === plan.planId)?.amount || 0;
        if (!allocation || plan.status !== 'pending') return plan;
        const gap = Math.max(0, plan.gap - allocation);
        return { ...plan, gap, status: gap === 0 ? 'applied' : 'pending', resolution: 'opportunity' };
      });
      return { ...item, affectedPlans, status: affectedPlans.some((plan) => plan.status === 'pending') ? 'pending' : 'resolved' };
    }));
    validAllocations.forEach((allocation) => {
      const before = event.affectedPlans.find((plan) => plan.planId === allocation.planId)?.gap || 0;
      addPlanActivity(allocation.planId, {
        id: `opportunity-heal-${eventId}-${allocation.planId}`,
        actor: 'owl',
        type: 'adjustment',
        title: 'Bonus used for plan recovery',
        description: `S$${allocation.amount.toLocaleString('en-SG')} of the bonus reduced the projected gap from S$${before.toLocaleString('en-SG')} to S$${Math.max(0, before - allocation.amount).toLocaleString('en-SG')}.`,
        timestamp: new Date().toISOString(),
        status: Math.max(0, before - allocation.amount) === 0 ? 'completed' : 'partially healed',
      });
    });
    return true;
  };
  const requestPlanChatOpen = () => setPlanChatRequest(value => value + 1);
  const consumePlanChatRequest = () => setPlanChatRequest(0);

  const toggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const decideOpportunity = (planId, opportunity, status, allocations = []) => {
    if (!planId || !opportunity || !['accepted', 'declined'].includes(status)) return false;
    if (opportunity.status !== 'active' || opportunityDecisions[planId]) return false;
    if (status === 'accepted' && opportunity.eligibility?.status !== 'verified') return false;

    const allocatedAmount = status === 'accepted'
      ? allocations.reduce((sum, allocation) => sum + allocation.amount, 0)
      : 0;
    if (status === 'accepted' && (
      allocatedAmount <= 0
      || allocatedAmount > (opportunity.sourceAmount ?? 0)
      || allocations.some((allocation) => !Number.isInteger(allocation.amount) || allocation.amount < 0)
    )) return false;

    const decidedAt = '24 Jul 2026';
    const returnedAmount = status === 'accepted'
      ? Math.max(0, (opportunity.sourceAmount ?? 0) - allocatedAmount)
      : opportunity.sourceAmount ?? 0;
    const formatAmount = (amount) => `S$${amount.toLocaleString('en-SG')}`;
    setOpportunityDecisions((current) => ({
      ...current,
      [planId]: {
        opportunityId: opportunity.id,
        status,
        decidedAt,
        sourcePlanId: planId,
        allocations: status === 'accepted' ? allocations : [],
        allocatedAmount,
        returnedAmount,
        sourceAccount: opportunity.sourceAccount ?? 'source account',
        appliedChanges: status === 'accepted' ? opportunity.planChanges : null,
      },
    }));
    setOpportunityNotice({
      planId,
      status,
      message: status === 'accepted'
        ? returnedAmount > 0
          ? `${formatAmount(allocatedAmount)} was added to your plan. ${formatAmount(returnedAmount)} was returned to your ${opportunity.sourceAccount ?? 'source account'}, and this opportunity is complete.`
          : 'Your plan has been enhanced with this opportunity.'
        : 'Your existing plan remains unchanged.',
    });
    setPlanActivity(prev => [...prev.filter(item => item.id !== `decision-${opportunity.id}-${status}`), {
      id: `decision-${opportunity.id}-${status}`,
      planId,
      actor: 'user',
      type: 'decision',
      title: status === 'accepted' ? 'Opportunity accepted' : 'Current plan kept',
      description: status === 'accepted'
        ? 'You approved Agent Owl’s recommendation and updated the plan.'
        : 'You reviewed the recommendation and chose not to change the plan.',
      timestamp: decidedAt,
      status,
    }]);
    return true;
  };

  const investmentsData = {
    totalBalance: 1800000.00,
    currency: 'SGD',
    ytdGrowth: '+12.4%',
    portfolio: [
      { id: 'inv-1', name: 'Cash Equities', balance: 950000.00, return: '+8.2%' },
      { id: 'inv-2', name: 'Fixed Deposits', balance: 850000.00, return: '+4.5%' },
    ],
    insights: [
      {
        id: 'ins-1',
        title: 'Optimize Liquidity',
        description: 'You have $120,000 idle cash in savings. Moving $50,000 to the Nest Smart Deposit could earn you 4.2% p.a. instead of 0.05% p.a.',
        cta: 'Grow Wealth',
      }
    ]
  };

  const [customPlanData, setCustomPlanData] = useState({
    housing: {
      targetAmount: 150000,
      targetDate: 'Mar 2028',
      paymentStrategy: 'staggered',
      subgoals: DEMO_HOUSING_SUBGOALS.map((subgoal) => ({ ...subgoal })),
      confirmedSubgoals: DEMO_HOUSING_SUBGOALS.map((subgoal) => ({ ...subgoal })),
      confirmedPaymentStrategy: 'staggered',
      confirmedAt: '2026-01-12T09:00:00+08:00',
    },
  });
  const [planDrafts, setPlanDrafts] = useState({});

  const updateCustomPlanData = (planId, data) => {
    setCustomPlanData(prev => ({
      ...prev,
      [planId]: {
        ...(prev[planId] || {}),
        ...data
      }
    }));
  };

  const updatePlanDraft = (planId, data) => {
    if (!planId) return;
    setPlanDrafts(prev => ({
      ...prev,
      [planId]: {
        ...(prev[planId] || {}),
        ...data,
      },
    }));
  };

  const discardPlanDraft = (planId) => {
    if (!planId) return false;
    setPlanDrafts(prev => {
      if (!prev[planId]) return prev;
      const next = { ...prev };
      delete next[planId];
      return next;
    });
    return true;
  };

  const confirmPlan = (planId, data) => {
    if (!planId || !data?.targetAmount || !data?.targetDate) return false;
    const targetAmount = Number(data.targetAmount);
    const paymentStrategy = data.paymentStrategy || 'lump-sum';
    const confirmedSubgoals = (data.subgoals || []).map((subgoal) => ({ ...subgoal, amount: Number(subgoal.amount) }));
    const confirmedAt = new Date().toISOString();
    const monthlyContribution = getRequiredMonthlyContribution(targetAmount, data.targetDate, paymentStrategy);
    const confirmedCategories = (data.categories || []).map((category) => ({
      ...category,
      actions: category.actions.map((action) => ({ ...action })),
    }));

    setCustomPlanData(prev => ({
      ...prev,
      [planId]: {
        ...(prev[planId] || {}),
        ...data,
        targetAmount,
        targetDate: data.targetDate,
        paymentStrategy,
        subgoals: confirmedSubgoals,
        confirmedSubgoals,
        confirmedCategories,
        confirmedPaymentStrategy: paymentStrategy,
        confirmedAt,
      },
    }));
    setPlanAdjustments(prev => ({
      ...prev,
      [planId]: {
        targetAmount,
        goalDate: data.targetDate,
        monthlyContribution,
        lumpSumContribution: paymentStrategy === 'lump-sum' ? targetAmount : 0,
        paymentStrategy,
        strategy: paymentStrategy === 'lump-sum'
          ? 'One-time contribution'
          : `Monthly contributions of S$${monthlyContribution.toLocaleString('en-SG')}`,
        onTrack: { expected: 0, saved: 0 },
        milestones: buildConfirmedMilestones(confirmedSubgoals, data.targetDate),
        isUserCreated: true,
      },
    }));
    setCreatedPlans(prev => prev.includes(planId) ? prev : [...prev, planId]);
    setPlanDrafts(prev => {
      const next = { ...prev };
      delete next[planId];
      return next;
    });
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        page,
        setPage,
        navigate,
        isMasked,
        toggleMask,
        activeTab,
        setActiveTab,
        clickPos,
        setClickPos,
        activePlanTitle,
        setActivePlanTitle,
        activePlanId,
        setActivePlanId,
        createdPlans,
        addCreatedPlan,
        hasCreatedFirstPlan,
        setHasCreatedFirstPlan,
        riskProfile,
        setRiskProfile,
        planAdjustments,
        adjustPlan,
        planActivity,
        addPlanActivity,
        transactionDeviations,
        activeDeviationId,
        setActiveDeviationId,
        registerTransactionDeviation,
        dismissDeviationNotifications,
        openDeviation,
        applyHealerStrategy,
        applyDeviationRecovery,
        declineDeviationRecovery,
        applyOpportunityRecovery,
        planChatRequest,
        requestPlanChatOpen,
        consumePlanChatRequest,
        customPlanData,
        updateCustomPlanData,
        planDrafts,
        updatePlanDraft,
        discardPlanDraft,
        confirmPlan,
        planDetailOrigin,
        setPlanDetailOrigin,
        opportunityDecisions,
        opportunityNotice,
        setOpportunityNotice,
        decideOpportunity,
        user,
        setUser,
        accountsData,
        setAccountsData,
        selectedAccountId,
        setSelectedAccountId,
        opportunitySourceAmount,
        setOpportunitySourceAmount,
        showOpportunityPopup,
        setShowOpportunityPopup,
        performMockDeposit,
        investmentsData,
        paynowContact,
        setPaynowContact,
        paynowAmount,
        setPaynowAmount,
        paynowReference,
        setPaynowReference,
        paynowSourceAccount,
        setPaynowSourceAccount,
        loginRedirectPage,
        setLoginRedirectPage,
        changingAction,
        setChangingAction,
        changingCategory,
        setChangingCategory,
        chosenAlternatives,
        setChosenAlternatives,
        pendingExcluded,
        setPendingExcluded,
        appliedExcluded,
        setAppliedExcluded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
