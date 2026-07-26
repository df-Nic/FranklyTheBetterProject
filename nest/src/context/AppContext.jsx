import React, { createContext, useState, useContext, useEffect } from 'react';

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
