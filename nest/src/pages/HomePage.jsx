import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';
import ChatWidget from '../components/ui/ChatWidget';
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
  LogOut
} from 'lucide-react';

const banners = [
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
    navigate,
    isMasked,
    toggleMask,
    activeTab,
    setActiveTab,
    user,
    accountsData,
    investmentsData
  } = useApp();

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

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
    { label: 'Foreign Exchange', icon: Globe },
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
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative overflow-hidden select-none">
      {/* Background Orb top-right */}
      <BackgroundOrb color="pink" size="360px" className="-top-10 -right-10" />

      {/* Frosted Sticky Navigation Header */}
      <header className="h-14 w-full bg-white/60 backdrop-blur-xl border-b border-white/50 px-4 flex justify-between items-center z-40 shrink-0 sticky top-0">
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-4 py-4 flex flex-col gap-5 z-10 pb-10">
        
        {/* Greeting Section */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Welcome back</span>
          <h2 className="text-2xl font-black text-zinc-950 tracking-tight">{user.name}</h2>
        </div>

        {/* Hero Slider Banner */}
        <div className="relative w-full">
          <GlassCard className="p-4 relative min-h-[125px] flex flex-col justify-between border-white/60">
            {/* Background art */}
            <div className="absolute right-2 bottom-2 w-28 h-28 opacity-15 pointer-events-none flex items-center justify-center">
              {banners[activeBannerIndex].bgType === 'globe' ? (
                <Globe className="w-20 h-20 text-brand-secondary stroke-[1.2]" />
              ) : (
                <Coins className="w-20 h-20 text-brand-primary stroke-[1.2]" />
              )}
            </div>

            <div className="max-w-[70%] z-10">
              <h3 className="text-sm font-bold text-zinc-800 leading-snug">
                {banners[activeBannerIndex].title}
              </h3>
            </div>

            <div className="mt-4 flex items-center justify-between z-10">
              <a
                href="https://www.ocbc.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-brand-accent flex items-center gap-0.5 hover:underline"
              >
                <span>{banners[activeBannerIndex].linkText}</span>
                <ChevronRight className="w-3 h-3 stroke-[2.5]" />
              </a>

              {/* Slider Dots */}
              <div className="flex gap-1.5">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBannerIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeBannerIndex ? 'w-3.5 bg-brand-secondary' : 'bg-zinc-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Action Pills Bar */}
        <div className="flex justify-between items-center bg-white/40 backdrop-blur-md rounded-2xl p-3 border border-white/50 shadow-sm">
          {actionPills.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <button
                key={idx}
                className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer group"
                onClick={() => {}}
              >
                <div className="w-11 h-11 rounded-full bg-white border border-zinc-200/60 shadow-sm flex items-center justify-center text-zinc-700 transition-all duration-150 active:scale-95 group-hover:border-brand-primary/45 group-hover:text-brand-primary">
                  {typeof Icon === 'function' ? (
                    <Icon className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5 stroke-[2]" />
                  )}
                </div>
                <span className="text-[10px] font-semibold text-zinc-600 leading-tight text-center max-w-[65px] h-6 flex items-center justify-center">
                  {pill.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Updates Alert Banner */}
        <div className="bg-indigo-50/60 border border-indigo-100/50 backdrop-blur-sm rounded-xl p-3 flex gap-2.5 items-center">
          <div className="w-7 h-7 rounded-full bg-[#E5A93C]/10 flex items-center justify-center text-[#E5A93C] shrink-0">
            <Bell className="w-4 h-4 fill-current stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-semibold text-indigo-950 leading-snug">
            Do not miss account updates. Review email preferences.
          </span>
        </div>

        {/* Pill Navigation Bar (Dynamic Switcher) */}
        <div className="flex items-center gap-2 mt-1 shrink-0 overflow-x-auto no-scrollbar py-0.5">
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
                    <GlassCard key={acc.id} className="p-4 border-white/60 flex flex-col justify-between min-h-[110px]" hoverable={true}>
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
                        <span className="text-sm font-bold mt-1">Olivia</span>
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
      
      {/* Interactive AI Chatbot Widget */}
      <ChatWidget />
    </div>
  );
};

export default HomePage;
