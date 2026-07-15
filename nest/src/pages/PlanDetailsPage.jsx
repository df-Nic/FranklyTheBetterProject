import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Compass,
  TrendingUp,
  Percent,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Coins
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import BackgroundOrb from '../components/ui/BackgroundOrb';

const PlanDetailsPage = () => {
  const { clickPos, activePlanTitle, setPage } = useApp();
  const [activeTab, setActiveTab] = useState('summary');
  
  // Custom checklist items that can be checked by the user
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Establish Nest Smart Saver Deposit account', desc: 'Auto-allocate SG$10,000 to earn 4.2% p.a. starting immediately.', checked: true },
    { id: 2, text: 'Enable monthly automatic recurring transfer', desc: 'Schedule SG$500 per month via PayNow to your investment pool.', checked: false },
    { id: 3, text: 'Rebalance portfolio allocations to 65% Equity ETF', desc: 'Lower exposure to bonds to increase YTD yield for this specific goal.', checked: false },
    { id: 4, text: 'Configure threshold notification alerts', desc: 'Receive immediate push notices if the portfolio value shifts by >5%.', checked: false }
  ]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleBack = () => {
    setPage('home');
  };

  // Build the transition paths based on click positions
  const x = clickPos?.x ?? 195;
  const y = clickPos?.y ?? 422;

  const initialClip = `circle(0% at ${x}px ${y}px)`;
  const animateClip = `circle(150% at ${x}px ${y}px)`;

  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { delay: 0.35, duration: 0.4, ease: "easeOut" } 
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
        <header className="h-14 w-full bg-white/60 backdrop-blur-xl border-b border-zinc-200/40 px-4 flex items-center gap-3 shrink-0 z-10 sticky top-0">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200/50 flex items-center justify-center text-zinc-700 active:scale-90 transition-all duration-150 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-[18px] h-[18px] stroke-[2.2]" />
          </button>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">NEST ADVISORY BOARD</span>
            <span className="text-sm font-black text-zinc-900 tracking-tight mt-0.5">Custom Wealth Plan</span>
          </div>
        </header>

        {/* Scrollable Plan Board */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-5 z-10 pb-10">
          
          {/* Main Proposal Card */}
          <GlassCard className="p-5 border-white/70 relative overflow-hidden bg-white/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                <Compass className="w-[22px] h-[22px] stroke-[2.2] animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Active Recommendation</span>
                <h2 className="text-lg font-black text-zinc-900 tracking-tight leading-snug mt-0.5">
                  {activePlanTitle || 'Retirement Strategy'}
                </h2>
              </div>
            </div>
            <p className="text-zinc-600 font-medium text-[11px] leading-relaxed mt-4">
              This bespoke execution roadmap was synthesized by the Nest Planner agent based on your active assets, monthly saving flows, and investment objectives.
            </p>
          </GlassCard>

          {/* Dynamic Key metrics */}
          <div className="grid grid-cols-3 gap-3">
            <GlassCard className="p-3 border-white/60 flex flex-col justify-between min-h-[85px] bg-white/40 text-center">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">YTD Yield</span>
              <div className="flex items-center justify-center gap-0.5 text-emerald-600 font-black text-base mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.4%</span>
              </div>
            </GlassCard>

            <GlassCard className="p-3 border-white/60 flex flex-col justify-between min-h-[85px] bg-white/40 text-center">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Fees Rate</span>
              <div className="flex items-center justify-center gap-0.5 text-brand-primary font-black text-base mt-2">
                <Percent className="w-3.5 h-3.5" />
                <span>0.15%</span>
              </div>
            </GlassCard>

            <GlassCard className="p-3 border-white/60 flex flex-col justify-between min-h-[85px] bg-white/40 text-center">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Duration</span>
              <div className="flex items-center justify-center gap-0.5 text-zinc-800 font-black text-base mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>5 Years</span>
              </div>
            </GlassCard>
          </div>

          {/* Tab switch bar */}
          <div className="flex bg-zinc-200/50 backdrop-blur-md rounded-xl p-1 border border-zinc-200/35">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all ${
                activeTab === 'summary' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 py-2 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all ${
                activeTab === 'checklist' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Roadmap ({checklist.filter(i => !i.checked).length})
            </button>
          </div>

          {/* Tab contents */}
          {activeTab === 'summary' && (
            <div className="flex flex-col gap-4">
              {/* Visual allocation chart card */}
              <GlassCard className="p-4 border-white/60 bg-white/40">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Recommended Asset Split</span>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                      <span className="text-xs font-bold text-zinc-700">Equities Pool (65%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-secondary" />
                      <span className="text-xs font-bold text-zinc-700">Nest High-Yield (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-xs font-bold text-zinc-700">Liquid Cash (10%)</span>
                    </div>
                  </div>
                  {/* Simulated donut chart */}
                  <div className="w-20 h-20 rounded-full border-[10px] border-brand-primary relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[10px] border-zinc-700 border-l-transparent border-t-transparent transform rotate-45" />
                    <div className="absolute inset-0 rounded-full border-[10px] border-amber-500 border-b-transparent border-l-transparent border-t-transparent transform -rotate-12" />
                    <Coins className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>
              </GlassCard>

              {/* AI Advisor Guidance Box */}
              <div className="bg-emerald-50/60 border border-emerald-100/50 backdrop-blur-sm rounded-2xl p-4 flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-4 h-4 fill-current stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-950">AI Optimizer Insights</span>
                  <p className="text-[10px] text-emerald-900/80 font-medium leading-relaxed mt-1">
                    Based on SG market indicators, locking fixed deposit rates this quarter ensures structural defense. Tapping this recommendation matches Olivia's retirement schedule perfectly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="flex flex-col gap-3">
              {checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-2xl border text-left flex gap-3 items-start transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-zinc-100/50 border-zinc-200/50 opacity-60'
                      : 'bg-white border-zinc-200/60 shadow-sm hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    item.checked
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : 'bg-white border-zinc-300 text-transparent'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${item.checked ? 'text-zinc-500 line-through' : 'text-zinc-800'}`}>
                      {item.text}
                    </span>
                    <p className="text-[10px] text-zinc-400 font-medium leading-normal mt-1">
                      {item.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Disclaimer / Bottom warning */}
          <div className="bg-zinc-100/75 border border-zinc-200/40 rounded-xl p-3 flex gap-2.5 items-center mt-2">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
            <span className="text-[9px] font-semibold text-zinc-500 leading-normal">
              Nest Wealth Advisor plan formulations are educational prototypes. Seek verified advice before making direct SG financial transitions.
            </span>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanDetailsPage;
