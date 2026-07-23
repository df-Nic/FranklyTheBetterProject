import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [page, setPage] = useState('landing'); // includes plan milestones, savings breakdown and opportunity detail routes
  const [isMasked, setIsMasked] = useState(true);
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts', 'investments', 'cards', 'loans'
  const [clickPos, setClickPos] = useState(null);
  const [activePlanTitle, setActivePlanTitle] = useState('');
  const [activePlanId, setActivePlanId] = useState(null); // 'retirement' | 'savings' | 'emergency' | 'default'
  const [createdPlans, setCreatedPlans] = useState([]); // In-memory list of plan IDs the user has created (resets on app restart)
  const [planDetailOrigin, setPlanDetailOrigin] = useState('home'); // 'home' | 'plan-dashboard'
  const [opportunityDecisions, setOpportunityDecisions] = useState({});
  const [opportunityNotice, setOpportunityNotice] = useState(null);
  const [user, setUser] = useState({
    name: 'Olivia',
    accessId: '',
  });

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

  const toggleMask = () => {
    setIsMasked((prev) => !prev);
  };

  const decideOpportunity = (planId, opportunity, status) => {
    if (!planId || !opportunity || !['accepted', 'declined'].includes(status)) return false;
    if (opportunity.status !== 'active' || opportunityDecisions[planId]) return false;
    if (status === 'accepted' && opportunity.eligibility?.status !== 'verified') return false;

    const decidedAt = '24 Jul 2026';
    setOpportunityDecisions((current) => ({
      ...current,
      [planId]: {
        opportunityId: opportunity.id,
        status,
        decidedAt,
        appliedChanges: status === 'accepted' ? opportunity.planChanges : null,
      },
    }));
    setOpportunityNotice({
      planId,
      status,
      message: status === 'accepted'
        ? 'Your plan has been enhanced with this opportunity.'
        : 'Your existing plan remains unchanged.',
    });
    return true;
  };

  const accountsData = [
    {
      id: 'acc-1',
      name: '360 Account',
      number: '• • • • 4892',
      balance: 138439.11,
      currency: 'SGD',
    },
    {
      id: 'acc-2',
      name: 'Savings Account',
      number: '• • • • 1083',
      balance: 15420.50,
      currency: 'SGD',
      isJoint: true,
    }
  ];

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
