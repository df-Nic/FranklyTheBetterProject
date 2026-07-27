import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTransactionDeviation } from '../data/transactionDeviations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState('landing'); // includes plan milestones, savings breakdown and opportunity detail routes
  const [isMasked, setIsMasked] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts', 'investments', 'cards', 'loans'
  const [clickPos, setClickPos] = useState(null);
  const [activePlanTitle, setActivePlanTitle] = useState('');
  const [activePlanId, setActivePlanId] = useState(null); // Selected proposal or accepted plan
  const [createdPlans, setCreatedPlans] = useState([]); // Plans are added only after explicit acceptance
  
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
  const [planDetailOrigin, setPlanDetailOrigin] = useState('home'); // 'home' | 'plan-dashboard'
  const [opportunityDecisions, setOpportunityDecisions] = useState({});
  const [opportunityNotice, setOpportunityNotice] = useState(null);
  const [planAdjustments, setPlanAdjustments] = useState({});
  const [planActivity, setPlanActivity] = useState([]);
  const [transactionDeviations, setTransactionDeviations] = useState([]);
  const [activeDeviationId, setActiveDeviationId] = useState(null);
  const [planChatRequest, setPlanChatRequest] = useState(0);
  const [user, setUser] = useState({
    name: 'Olivia',
    accessId: '',
  });

  const accountsData = [
    {
      id: 'acc-1',
      name: '360 Account',
      number: '001-23456-789',
      balance: 138439.11,
      currency: 'SGD',
    },
    {
      id: 'acc-2',
      name: 'Savings Account',
      number: '001-98765-432',
      balance: 15420.50,
      currency: 'SGD',
      isJoint: true,
    }
  ];

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

    setTransactionDeviations((current) => (
      current.some((item) => item.id === deviation.id) ? current : [...current, deviation]
    ));
    deviation.affectedPlans.forEach((affectedPlan) => {
      addPlanActivity(affectedPlan.planId, {
        id: `transaction-impact-${deviation.id}-${affectedPlan.planId}`,
        actor: 'owl',
        type: 'deviation',
        title: affectedPlan.impactStatus === 'needs-healing'
          ? 'Plan deviation detected'
          : affectedPlan.impactStatus === 'reduced-buffer'
            ? 'Plan buffer reduced'
            : 'Transaction impact checked',
        description: affectedPlan.impactStatus === 'needs-healing'
          ? `${transaction.type === 'paynow' ? 'PayNow' : 'A transaction'} of S$${transaction.amount.toLocaleString('en-SG')} may leave this plan S$${Math.round(affectedPlan.gap).toLocaleString('en-SG')} behind its expected path.`
          : affectedPlan.impactStatus === 'reduced-buffer'
            ? `Agent Owl assessed the S$${transaction.amount.toLocaleString('en-SG')} transaction. This plan remains on track with S$${Math.round(affectedPlan.remainingBuffer).toLocaleString('en-SG')} of buffer remaining.`
            : `Agent Owl assessed the S$${transaction.amount.toLocaleString('en-SG')} transaction and confirmed that this plan remains on track.`,
        timestamp: deviation.timestamp,
        status: affectedPlan.status === 'pending' ? 'needs review' : 'assessed',
      });
    });
    return deviation.id;
  };

  const dismissDeviationNotifications = () => {
    setTransactionDeviations((current) => current.map((item) => (
      item.status === 'pending' ? { ...item, notificationDismissed: true } : item
    )));
  };

  const openDeviation = (deviationId) => {
    setActiveDeviationId(deviationId);
    setPage('plan-healer');
  };

  const resolveDeviationPlan = (deviationId, planId, resolution) => {
    let resolvedEvent = null;
    let resolvedPlan = null;
    setTransactionDeviations((current) => current.map((event) => {
      if (event.id !== deviationId) return event;
      const affectedPlans = event.affectedPlans.map((plan) => {
        if (plan.planId !== planId || plan.status !== 'pending') return plan;
        resolvedPlan = plan;
        return { ...plan, ...resolution };
      });
      const status = affectedPlans.every((plan) => plan.status !== 'pending') ? 'resolved' : 'pending';
      resolvedEvent = { ...event, affectedPlans, status };
      return resolvedEvent;
    }));
    return { event: resolvedEvent, plan: resolvedPlan };
  };

  const applyDeviationRecovery = (deviationId, planId, strategyId) => {
    const event = transactionDeviations.find((item) => item.id === deviationId);
    const affectedPlan = event?.affectedPlans.find((item) => item.planId === planId && item.status === 'pending');
    const option = affectedPlan?.recoveryOptions.find((item) => item.id === strategyId);
    if (!event || !affectedPlan || !option) return false;

    adjustPlan(planId, {
      ...option.changes,
      healed: true,
      strategy: strategyId,
      selectedPlanId: planId,
    });
    resolveDeviationPlan(deviationId, planId, {
      status: 'applied',
      strategyId,
      resolvedAt: new Date().toISOString(),
    });
    addPlanActivity(planId, {
      id: `deviation-applied-${deviationId}-${planId}`,
      actor: 'owl',
      type: 'adjustment',
      title: 'Plan recovery applied',
      description: `${option.title} was applied after a S$${event.amount.toLocaleString('en-SG')} ${event.type === 'paynow' ? 'PayNow payment' : 'transaction'} (${option.before} → ${option.after}).`,
      timestamp: new Date().toISOString(),
      status: 'completed',
    });
    return true;
  };

  const declineDeviationRecovery = (deviationId, planId) => {
    const event = transactionDeviations.find((item) => item.id === deviationId);
    const affectedPlan = event?.affectedPlans.find((item) => item.planId === planId && item.status === 'pending');
    if (!event || !affectedPlan) return false;
    resolveDeviationPlan(deviationId, planId, {
      status: 'declined',
      resolvedAt: new Date().toISOString(),
    });
    addPlanActivity(planId, {
      id: `deviation-declined-${deviationId}-${planId}`,
      actor: 'user',
      type: 'decision',
      title: 'Current plan kept',
      description: `You reviewed the S$${event.amount.toLocaleString('en-SG')} transaction impact and chose not to change this plan.`,
      timestamp: new Date().toISOString(),
      status: 'declined',
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

  const [customPlanData, setCustomPlanData] = useState({});

  const updateCustomPlanData = (planId, data) => {
    setCustomPlanData(prev => ({
      ...prev,
      [planId]: {
        ...(prev[planId] || {}),
        ...data
      }
    }));
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
        applyDeviationRecovery,
        declineDeviationRecovery,
        planChatRequest,
        requestPlanChatOpen,
        consumePlanChatRequest,
        customPlanData,
        updateCustomPlanData,
        planDetailOrigin,
        setPlanDetailOrigin,
        opportunityDecisions,
        opportunityNotice,
        setOpportunityNotice,
        decideOpportunity,
        user,
        setUser,
        accountsData,
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
