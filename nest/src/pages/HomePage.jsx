import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';
import { getPlanOpportunity, getRecommendedPlan } from '../data/planOpportunities';
import { getMilestonePlan } from '../data/milestonePlans';
import nestHomeMasthead from '../assets/images/nest-home-hero-bg.png';
import {
  Scan,
  Bell,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Percent,
  Settings,
  Globe,
  Coins,
  Inbox,
  LogOut,
  Sparkles,
  X,
  Target
} from 'lucide-react';

const banners = [
  {
    title: 'Meet NEST',
    linkText: 'Start Your First Plan',
    bgType: 'nest',
    image: nestHomeMasthead
  },
  {
    title: 'Trade across 15 global exchanges with access to SG, US & China markets',
    linkText: 'Important Information',
    bgType: 'globe'
  },
  {
    title: 'OCBC 360 Account: Earn up to 4.65% p.a. on your savings',
    linkText: 'View Interests Tier',
    bgType: 'rate'
  }
];

const HomePage = () => {
  const {
    page,
    navigate,
    isMasked,
    toggleMask,
    activeTab,
    setActiveTab,
    user,
    accountsData,
    investmentsData,
    createdPlans,
    planAdjustments,
    opportunityDecisions,
    transactionDeviations,
    dismissDeviationNotifications,
    openDeviation,
    setActivePlanId,
    opportunitySourceAmount,
    showOpportunityPopup,
    setShowOpportunityPopup,
    setSelectedAccountId,
    requestPlanChatOpen
  } = useApp();
  const pendingHealers = transactionDeviations.filter((event) => event.status === 'pending');
  const visibleHealer = [...pendingHealers].reverse().find((event) => !event.notificationDismissed);
  const opportunity = getPlanOpportunity(opportunitySourceAmount);
  const opportunityHandled = Object.values(opportunityDecisions).some((decision) => decision.opportunityId === opportunity.id);
  const recommendedPlan = getRecommendedPlan(createdPlans.map((id) => getMilestonePlan(id, planAdjustments)));

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [opportunityDismissed, setOpportunityDismissed] = useState(false);

  useEffect(() => {
    if (page === 'home' || showOpportunityPopup) setOpportunityDismissed(false);
  }, [page, showOpportunityPopup]);

  const handleNavTabSelect = (tabId) => {
    setActiveNavTab(tabId);
    if (tabId === 'plan') {
      navigate('plan-dashboard');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 4000); // Auto-scroll every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    navigate('landing');
  };

  const formatBalance = (amount, currency = 'SGD') => {
    if (isMasked) return '••••••••';
    return `${currency} ${amount.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (numStr) => {
    if (isMasked) return '•••• •••• •••• ••••';
    return numStr;
  };

  // Quick Action Pills
  const actionPills = [
    { label: 'PayNow', icon: ({ className }) => <div className={`font-black text-[10px] leading-[9px] text-center tracking-tighter ${className}`}>PAY<br />NOW</div> },
    { label: 'Scan & Pay', icon: Scan },
    { label: 'Investments', icon: TrendingUp },
    { label: 'Customise', icon: Settings }
  ];

  // Tab configurations
  const tabs = [
    { id: 'accounts', label: 'Accounts' },
    { id: 'investments', label: 'Investments' },
    { id: 'cards', label: 'Cards' },
    { id: 'loans', label: 'Loans' }
  ];

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col min-h-0 relative overflow-hidden select-none">
      {/* Background Orb top-right */}
      <BackgroundOrb color="pink" size="360px" className="-top-10 -right-10" />

      <AnimatePresence>
        {visibleHealer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[70] flex items-center justify-center bg-zinc-950/55 px-5">
            <motion.div initial={{ y: 22, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="relative w-full rounded-[26px] bg-white p-5 shadow-2xl">
              <button onClick={dismissDeviationNotifications} aria-label="Dismiss" className="absolute right-4 top-4 text-zinc-500"><X size={20} /></button>
              <span className="rounded-md bg-red-50 px-2 py-1 text-[9px] font-black uppercase text-brand-primary">
                {pendingHealers.length > 1 ? `${pendingHealers.length} NEST plan updates` : 'NEST plan update'}
              </span>
              <h2 className="mt-4 text-[22px] font-black">Your plans need attention</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
                {pendingHealers.length > 1
                  ? `${pendingHealers.length} recent transactions may have affected your active goals. Agent Owl grouped them for review.`
                  : `A recent S$${visibleHealer.amount.toLocaleString('en-SG')} payment affected your active goals. Agent Owl has prepared recovery options.`}
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
                {visibleHealer.affectedPlans.slice(0, 3).map((plan, index) => (
                  <div key={plan.planId} className={`flex items-center gap-3 p-3 ${index ? 'border-t border-zinc-200' : ''}`}>
                    <Target size={16} className="text-brand-primary" />
                    <strong className="flex-1 text-[10px]">{plan.planName}</strong>
                    <span className={`text-[8px] font-black uppercase ${plan.status === 'pending' ? 'text-brand-primary' : 'text-emerald-600'}`}>{plan.status === 'pending' ? 'Needs healing' : 'On track'}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => openDeviation(visibleHealer.id)} className="mt-5 w-full rounded-xl bg-brand-primary py-3 text-[11px] font-black text-white">
                {pendingHealers.length > 1 ? `Review ${pendingHealers.length} transactions` : 'Review suggested fix'}
              </button>
              <button onClick={dismissDeviationNotifications} className="mt-2 w-full py-2 text-[10px] font-bold text-brand-primary">Not now</button>
            </motion.div>
          </motion.div>
        )}
        {showOpportunityPopup && opportunitySourceAmount > 0 && !pendingHealers.length && createdPlans.length > 0 && !opportunityHandled && !opportunityDismissed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[70] flex items-center justify-center bg-zinc-950/55 px-5">
            <motion.div initial={{ y: 22, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="relative w-full rounded-[26px] bg-white p-5 shadow-2xl">
              <Sparkles className="absolute -right-4 -top-4 h-20 w-20 text-amber-50" />
              <button onClick={() => { setOpportunityDismissed(true); setShowOpportunityPopup(false); }} aria-label="Dismiss" className="absolute right-4 top-4 text-zinc-500"><X size={20} /></button>
              <span className="rounded-md bg-amber-50 px-2 py-1 text-[9px] font-black uppercase text-amber-700">Opportunity starts now</span>
              <h2 className="mt-4 text-[22px] font-black">Put your S${opportunitySourceAmount.toLocaleString('en-SG')} deposit to work</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">Agent Owl compared all active plans and recommends starting with {recommendedPlan?.goalName}.</p>
              <button onClick={() => { setActivePlanId(recommendedPlan?.id || createdPlans[0]); setShowOpportunityPopup(false); navigate('opportunity-detail'); }} className="mt-5 w-full rounded-xl bg-[#7C2230] py-3 text-[11px] font-black text-white">Compare and allocate</button>
              <button onClick={() => { setOpportunityDismissed(true); setShowOpportunityPopup(false); }} className="mt-2 w-full py-2 text-[10px] font-bold text-[#7C2230]">Not now</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frosted Sticky Navigation Header */}
      <header className="pt-6 pb-2 h-auto w-full bg-white/60 backdrop-blur-xl border-b border-white/50 px-4 flex justify-between items-center z-40 shrink-0 sticky top-0">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer">
            <Scan className="w-[18px] h-[18px] stroke-[2.2]" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Bell Icon with Badge */}
          <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 relative cursor-pointer">
            <Bell className="w-[18px] h-[18px] stroke-[2.2]" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-white" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-brand-primary text-xs font-bold transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-4 py-4 flex flex-col gap-5 z-10 pb-safe-nav touch-pan-y min-h-0">
        
        {/* Full-bleed masthead with floating quick actions */}
        <div className="relative -mx-4 -mt-4">
          <div className={`relative min-h-[245px] overflow-hidden ${
            banners[activeBannerIndex].bgType === 'nest'
              ? 'bg-[#FFF7F5]'
              : 'bg-gradient-to-br from-white via-zinc-50 to-red-50/50'
          }`}>
            {banners[activeBannerIndex].bgType === 'nest' ? (
              <>
                <img
                  src={banners[activeBannerIndex].image}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="relative z-10 max-w-[54%] px-6 pt-7">
                  <p className="text-[22px] font-black leading-none tracking-tight text-zinc-950">
                    Hello, {user.name}!
                  </p>
                  <p className="mt-3 text-[12px] font-semibold leading-[1.45] text-zinc-700">
                    Making a savings goal is easy. NEST helps you stay on track, always with your permission.
                  </p>
                  <button
                    type="button"
                    onClick={requestPlanChatOpen}
                    className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    Start your first plan
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.8]" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="pointer-events-none absolute right-4 top-10 flex h-28 w-28 items-center justify-center opacity-10">
                  {banners[activeBannerIndex].bgType === 'globe' ? (
                    <Globe className="h-24 w-24 text-brand-secondary stroke-[1.1]" />
                  ) : (
                    <Coins className="h-24 w-24 text-brand-primary stroke-[1.1]" />
                  )}
                </div>
                <div className="relative z-10 max-w-[60%] pb-2 px-6 pt-7">
                  <p className="text-[22px] font-black leading-none tracking-tight text-zinc-950">
                    Hello, {user.name}!
                  </p>
                  <h3 className="mt-3 text-[12.5px] font-semibold leading-relaxed text-zinc-700">
                    {banners[activeBannerIndex].title}
                  </h3>
                  <a
                    href="https://www.ocbc.com"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <span>{banners[activeBannerIndex].linkText}</span>
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </a>
                </div>
              </>
            )}

            <div className="absolute bottom-[72px] right-5 z-20 flex gap-1.5 rounded-full bg-white/85 px-2 py-1 shadow-sm backdrop-blur-sm">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Show banner ${idx + 1}`}
                  onClick={() => setActiveBannerIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeBannerIndex ? 'w-3.5 bg-brand-primary' : 'w-1.5 bg-zinc-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative z-30 mx-4 -mt-16 overflow-hidden rounded-[16px] border border-zinc-200/70 bg-white shadow-[0_12px_28px_rgba(45,38,34,0.16)]">
            <div className="flex items-start justify-between px-2 py-3.5">
              {actionPills.map((pill, idx) => {
                const Icon = pill.icon;
                return (
                  <button
                    key={idx}
                    className="group flex flex-1 cursor-pointer flex-col items-center gap-1.5"
                    onClick={() => {
                      if (pill.label === 'PayNow') {
                        navigate('paynow-contacts');
                      } else if (pill.label === 'Investments') {
                        setActiveTab('investments');
                      }
                    }}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-zinc-800 transition-all duration-150 active:scale-95 ${
                      pill.label === 'Customise'
                        ? 'bg-[#EEE8E2] shadow-sm'
                        : 'bg-zinc-50 group-hover:bg-red-50 group-hover:text-brand-primary'
                    }`}>
                      {typeof Icon === 'function' ? (
                        <Icon className="h-[19px] w-[19px]" />
                      ) : (
                        <Icon className="h-[19px] w-[19px] stroke-[2]" />
                      )}
                    </div>
                    <span className="flex h-6 max-w-[70px] items-center justify-center text-center text-[10px] font-semibold leading-tight text-zinc-600">
                      {pill.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pill Navigation Bar (Dynamic Switcher) */}
        <div className="flex items-center gap-2 mt-0 shrink-0 overflow-x-auto no-scrollbar py-0.5">
          {/* Eye Toggle button */}
          <button
            onClick={toggleMask}
            className="w-10 h-10 rounded-full bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 shrink-0 cursor-pointer"
          >
            {isMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Separator */}
          <div className="w-[1.5px] h-5 bg-zinc-300 shrink-0" />

          {/* Tab lists */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 shrink-0 active:scale-95 cursor-pointer relative ${
                    isActive
                      ? 'bg-brand-primary border-brand-primary text-white shadow-sm shadow-brand-primary/20'
                      : 'bg-white border-brand-primary text-[#111111] hover:bg-red-50/20'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tab Content rendering */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex flex-col gap-4"
            >
              {/* Accounts Tab active */}
              {activeTab === 'accounts' && (
                <>
                  {accountsData.map((acc) => (
                    <GlassCard
                      key={acc.id}
                      className="p-4 border-white/60 flex flex-col justify-between min-h-[110px] cursor-pointer"
                      hoverable={true}
                      onClick={() => {
                        setSelectedAccountId(acc.id);
                        navigate('account-detail');
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide leading-none">
                            Savings
                          </span>
                          <span className="text-base font-bold text-zinc-900 mt-1 flex items-center gap-1.5">
                            {acc.name}
                            {acc.isJoint && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-accent/15 text-brand-accent rounded-md border border-brand-accent/25 uppercase">
                                Joint
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] font-semibold text-zinc-500 mt-1">
                            {formatNumber(acc.number)}
                          </span>
                        </div>
                        <span className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-end">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                          Available Balance
                        </span>
                        <span className="text-lg font-black text-brand-secondary tracking-tight">
                          {formatBalance(acc.balance, acc.currency)}
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                </>
              )}

              {/* Investments Tab active */}
              {activeTab === 'investments' && (
                <>
                  {/* Total Portfolio Value Grid card */}
                  <div className="grid grid-cols-5 gap-3.5">
                    {/* Left main portfolio display */}
                    <GlassCard className="col-span-3 p-4 border-white/60 flex flex-col justify-between min-h-[130px]">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          Net Wealth
                        </span>
                        <h4 className="text-[20px] font-black text-zinc-900 tracking-tight mt-1 leading-tight">
                          {formatBalance(investmentsData.totalBalance, investmentsData.currency)}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs mt-3 bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-100/50">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{investmentsData.ytdGrowth} YTD</span>
                      </div>
                    </GlassCard>

                    {/* Right minor split items */}
                    <div className="col-span-2 flex flex-col gap-3">
                      {investmentsData.portfolio.map((item) => (
                        <GlassCard key={item.id} className="p-3 border-white/60 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                              {item.name}
                            </span>
                            <span className="text-xs font-black text-zinc-800 block mt-0.5">
                              {isMasked ? '••••' : `$${(item.balance / 1000).toFixed(0)}k`}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-600">
                            {item.return}
                          </span>
                        </GlassCard>
                      ))}
                    </div>
                  </div>

                </>
              )}

              {/* Cards Tab active */}
              {activeTab === 'cards' && (
                <div className="flex flex-col gap-4">
                  <GlassCard className="p-4 border-white/60 relative overflow-hidden min-h-[140px] flex flex-col justify-between text-white" style={{ background: 'linear-gradient(135deg, #2E3E4F 0%, #1A2633 100%)' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400">NEST Platinum Debit</span>
                        <span className="text-sm font-bold mt-1">Daniel</span>
                      </div>
                      <span className="text-base font-black italic tracking-widest text-zinc-300">VISA</span>
                    </div>

                    <div className="mt-8 flex justify-between items-end">
                      <span className="text-xs font-mono tracking-widest text-zinc-300">
                        {formatNumber('•••• •••• •••• 9283')}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] uppercase tracking-wider text-zinc-400">Exp Date</span>
                        <span className="text-[10px] font-bold">11 / 30</span>
                      </div>
                    </div>
                  </GlassCard>
                  
                  <GlassCard className="p-4 border-white/60 flex items-center justify-between" hoverable={true}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-800">Add to Apple Wallet</span>
                        <span className="text-[9px] text-zinc-400 font-medium mt-0.5">Quick payments with Apple Pay</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </GlassCard>
                </div>
              )}

              {/* Loans Tab active */}
              {activeTab === 'loans' && (
                <div className="flex flex-col gap-4">
                  <GlassCard className="p-4 border-white/60 min-h-[120px] flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active Loan</span>
                        <h4 className="text-sm font-bold text-zinc-800 mt-1">EasiCredit Loan Account</h4>
                        <span className="text-[9px] text-zinc-500 font-semibold mt-0.5">Ac: 189-983-02-1</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#E5A93C]/10 text-[#E5A93C] rounded-md border border-[#E5A93C]/20">
                        Active
                      </span>
                    </div>

                    <div className="mt-4 flex justify-between items-end border-t border-zinc-200/50 pt-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-semibold">Remaining Loan Amount</span>
                        <span className="text-sm font-black text-zinc-800 tracking-tight mt-0.5">
                          {formatBalance(24800.00, 'SGD')}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-semibold">Interest Rate</span>
                        <span className="text-xs font-bold text-emerald-600 mt-0.5">3.88% p.a.</span>
                      </div>
                    </div>
                  </GlassCard>

                  <div className="bg-white border border-zinc-200/60 p-4 rounded-2xl flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-brand-accent shrink-0">
                      <Percent className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-800">Pre-Approved Refinancing Offers</span>
                      <p className="text-[10px] text-zinc-500 font-medium leading-normal mt-1">
                        Reduce your monthly mortgage payments. Check personalized rates starting from 2.99% p.a.
                      </p>
                      <button className="text-[10px] font-bold text-brand-accent flex items-center gap-0.5 mt-2 hover:underline focus:outline-none cursor-pointer">
                        <span>Check Eligibility</span>
                        <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
