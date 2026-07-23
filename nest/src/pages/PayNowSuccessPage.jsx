import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Share2, Download, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getMilestonePlan } from '../data/milestonePlans';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';

const PayNowSuccessPage = () => {
  const {
    navigate,
    paynowContact,
    paynowAmount,
    paynowReference,
    paynowSourceAccount,
    setPaynowContact,
    setPaynowAmount,
    setPaynowReference,
    planAdjustments,
    setActivePlanId
  } = useApp();

  const [refId, setRefId] = useState('');
  const [timestamp, setTimestamp] = useState('');

  // Generate random transaction details on mount
  useEffect(() => {
    // Reference ID
    const randomRef = 'PN' + Math.floor(100000000 + Math.random() * 900000000);
    setRefId(randomRef);

    // Timestamp
    const now = new Date();
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
    setTimestamp(now.toLocaleDateString('en-SG', options));
  }, []);

  const handleFinish = () => {
    // Clear states
    setPaynowContact(null);
    setPaynowAmount('');
    setPaynowReference('');
    // Go home
    navigate('home');
  };

  const amountDisplay = parseFloat(paynowAmount || '0').toFixed(2);
  const name = paynowContact?.name || 'Ivan Heng';
  const detailString = paynowContact
    ? `${paynowContact.phone}${paynowContact.vpa ? ` • ${paynowContact.vpa}` : ''}`
    : '+65 88888888 • Ivanhengsj';

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative overflow-hidden select-none">
      {/* Background Orbs */}
      <BackgroundOrb color="pink" size="300px" className="-top-12 -right-12" />
      <BackgroundOrb color="peach" size="250px" className="bottom-12 -left-12" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-8 flex flex-col items-center justify-center gap-6 z-10">
        
        {/* Animated Checkmark Circle */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Check className="w-8 h-8 stroke-[3]" />
            </motion.div>
          </motion.div>
          {/* Pulsing ring */}
          <motion.div
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 0, scale: 1.4 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
            className="absolute w-16 h-16 rounded-full border-2 border-emerald-500/30"
          />
        </div>

        {/* Status Message */}
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-lg font-black text-emerald-600 tracking-tight">Payment Successful</h2>
          <div className="flex items-baseline gap-1 justify-center mt-1">
            <span className="text-3xl font-black text-zinc-900 tracking-tight">{amountDisplay}</span>
            <span className="text-sm font-black text-zinc-400 tracking-tight">SGD</span>
          </div>
        </div>

        {/* Healer AI Auto-Adjustment Success Card */}
        {(() => {
          const healedPlanId = Object.keys(planAdjustments || {}).find(
            (key) => planAdjustments[key]?.healed
          );
          if (!healedPlanId) return null;
          
          const healedPlan = getMilestonePlan(healedPlanId, planAdjustments);
          const healedPlanName = healedPlan?.goalName || 'Active Plan';
          const basePlan = getMilestonePlan(healedPlanId, {});
          const baseContribution = basePlan?.monthlyContribution || 1200;
          const baseDate = basePlan?.goalDate || 'Dec 2027';
          
          const adjustments = planAdjustments[healedPlanId] || {};
          const strategy = adjustments?.strategy || 'deposit';
          const numPaynowAmount = parseFloat(paynowAmount || '0');

          return (
            <GlassCard className="w-full p-4 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 flex flex-col gap-2.5 shadow-md shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/25 flex items-center justify-center text-emerald-600 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Nest AI Healer Success</span>
                  <span className="text-xs font-black text-zinc-900 tracking-tight mt-0.5">Plan Adjusted & Secured</span>
                </div>
              </div>
              <p className="text-[11px] font-medium text-zinc-600 leading-normal">
                Your <span className="font-bold text-zinc-950">{healedPlanName}</span> has been automatically adjusted to accommodate the S$${amountDisplay} transaction.
              </p>
              
              {strategy === 'deposit' && (
                <div className="bg-white/55 border border-emerald-500/10 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-zinc-500">Monthly Contribution:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 line-through font-semibold">S$${baseContribution.toLocaleString('en-SG')}</span>
                    <span className="text-zinc-400">→</span>
                    <span className="text-emerald-600 font-extrabold">S$${(adjustments.monthlyContribution || 1350).toLocaleString('en-SG')}/mo</span>
                  </div>
                </div>
              )}

              {strategy === 'timeline' && (
                <div className="bg-white/55 border border-emerald-500/10 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-zinc-500">Plan Target Date:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 line-through font-semibold">{baseDate}</span>
                    <span className="text-zinc-400">→</span>
                    <span className="text-emerald-600 font-extrabold">{adjustments.goalDate}</span>
                  </div>
                </div>
              )}

              {strategy === 'yield' && (
                <div className="bg-white/55 border border-emerald-500/10 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-zinc-500">Asset Yield Reallocation:</span>
                  <div className="text-right">
                    <span className="text-emerald-600 font-extrabold">OCBC 360 Account (4.65% p.a.)</span>
                  </div>
                </div>
              )}

              {strategy === 'sweep' && (
                <div className="bg-white/55 border border-emerald-500/10 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-zinc-500">Auto-Sweep Trigger:</span>
                  <div className="text-right">
                    <span className="text-emerald-600 font-extrabold">S$85/mo Cashback Sweeps</span>
                  </div>
                </div>
              )}

              <p className="text-[9px] font-semibold text-zinc-400 italic">
                {strategy === 'deposit' && `This auto-adjustment keeps your Target Date of ${baseDate} intact.`}
                {strategy === 'timeline' && `This keeps your monthly savings of S$${baseContribution.toLocaleString('en-SG')} unchanged.`}
                {strategy === 'yield' && `Reallocating S$${numPaynowAmount.toLocaleString('en-SG')} balances to optimize returns without changing timeline.`}
                {strategy === 'sweep' && `Taps discretionary cashback automatically to close the gap without changing timeline.`}
              </p>
            </GlassCard>
          );
        })()}

        {/* Digital Receipt Card */}
        <GlassCard className="w-full p-5 border-white/70 flex flex-col gap-4 shadow-md">
          {/* Header Row */}
          <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Transaction Receipt</span>
            <span className="text-[9px] font-bold text-zinc-400">{timestamp}</span>
          </div>

          {/* Details list */}
          <div className="flex flex-col gap-3">
            {/* Recipient info */}
            <div className="flex justify-between items-start gap-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">Paid to</span>
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-900 block">{name}</span>
                <span className="text-[9px] font-semibold text-zinc-500 block mt-0.5">{detailString}</span>
              </div>
            </div>

            {/* Source Account info */}
            <div className="flex justify-between items-center gap-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">From Account</span>
              <span className="text-xs font-bold text-zinc-800">
                {paynowSourceAccount?.name || '360 Account'}
              </span>
            </div>

            {/* Reference (if exists) */}
            {paynowReference && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Reference</span>
                <span className="text-xs font-bold text-zinc-800">{paynowReference}</span>
              </div>
            )}

            {/* Ref ID */}
            <div className="flex justify-between items-center gap-4 pt-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Transaction Ref</span>
              <span className="text-xs font-mono font-bold text-zinc-600">{refId}</span>
            </div>
          </div>

          {/* Quick Receipt Action buttons */}
          <div className="flex gap-2 pt-2 border-t border-zinc-200/50">
            <button className="flex-1 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-600 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button className="flex-1 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-zinc-600 text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all">
              <Download className="w-3.5 h-3.5" />
              <span>Save Image</span>
            </button>
          </div>
        </GlassCard>

        {/* Complete Action Button */}
        {(() => {
          const healedPlanId = Object.keys(planAdjustments || {}).find(
            (key) => planAdjustments[key]?.healed
          );
          if (!healedPlanId) return null;
          return (
            <button
              onClick={() => {
                setPaynowContact(null);
                setPaynowAmount('');
                setPaynowReference('');
                setActivePlanId(healedPlanId);
                navigate('plan-milestones');
              }}
              className="w-full mt-2 py-3.5 rounded-xl bg-zinc-900 text-white text-xs font-black tracking-wider transition-all duration-150 active:scale-98 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span>View Healed Plan Journey</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] text-emerald-400" />
            </button>
          );
        })()}

        <button
          onClick={handleFinish}
          className="w-full mt-2 py-3.5 rounded-xl bg-brand-primary text-white text-xs font-black tracking-wider transition-all duration-150 active:scale-98 cursor-pointer shadow-md shadow-brand-primary/15 flex items-center justify-center gap-1.5"
        >
          <span>Done</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

      </div>
    </div>
  );
};

export default PayNowSuccessPage;
