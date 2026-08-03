import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';
import {
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  Building2,
  DollarSign,
  Wallet,
  Sparkles
} from 'lucide-react';

export default function AccountDetailPage() {
  const {
    navigate,
    accountsData,
    selectedAccountId,
    performMockDeposit,
    isMasked
  } = useApp();

  const account = accountsData.find((acc) => acc.id === selectedAccountId) || accountsData[0];
  const [depositAmount, setDepositAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const presets = [1000, 5000, 8000, 10000];

  const handlePresetClick = (amount) => {
    setDepositAmount(amount.toString());
    setErrorMsg('');
  };

  const handleDepositSubmit = (e) => {
    e?.preventDefault();
    const num = parseFloat(depositAmount);
    if (isNaN(num) || num <= 0) {
      setErrorMsg('Please enter a valid deposit amount greater than S$0.');
      return;
    }
    setErrorMsg('');
    setIsSuccess(true);

    setTimeout(() => {
      performMockDeposit(num, account.id);
    }, 450);
  };

  const formatBalance = (amount, currency = 'SGD') => {
    if (isMasked) return '••••••••';
    return `${currency} ${amount.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col min-h-0 relative overflow-hidden select-none">
      {/* Background Orbs */}
      <BackgroundOrb color="pink" size="360px" className="-top-10 -right-10" />
      <BackgroundOrb color="blue" size="300px" className="bottom-10 -left-10" />

      {/* Frosted Header Bar */}
      <header className="pt-6 pb-3 h-auto w-full bg-white/70 backdrop-blur-xl border-b border-white/50 px-4 flex items-center gap-3 z-40 shrink-0 sticky top-0">
        <button
          onClick={() => navigate('home')}
          className="w-9 h-9 rounded-full bg-white/80 border border-zinc-200/80 shadow-xs flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-base font-black text-zinc-950 tracking-tight">{account.name}</h1>
          <span className="text-[10px] font-semibold text-zinc-500">Account Details & Deposit</span>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="flex-1 overflow-y-auto scroll-ios overflow-x-hidden no-scrollbar px-4 py-4 flex flex-col gap-4 z-10 pb-safe-nav touch-pan-y min-h-0">

        {/* Account Info Certificate Card */}
        <GlassCard className="p-5 border-white/70 bg-white/80 shadow-lg flex flex-col gap-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">
                {account.type || 'Savings Account'}
              </span>
              <h2 className="text-xl font-black text-zinc-900 mt-0.5 flex items-center gap-2">
                {account.name}
                {account.isJoint && (
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-accent/15 text-brand-accent rounded-md border border-brand-accent/25 uppercase">
                    Joint
                  </span>
                )}
              </h2>
              <span className="text-xs font-mono font-semibold text-zinc-500 mt-1">
                {isMasked ? '•••• •••• ••••' : account.number}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full text-[9.5px] font-black shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SDIC Insured</span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-200/60 flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10.5px] font-bold text-zinc-400 uppercase tracking-wide">
                Available Balance
              </span>
              <span className="text-2xl font-black text-brand-secondary tracking-tight mt-0.5">
                {formatBalance(account.balance, account.currency)}
              </span>
            </div>

            <div className="flex flex-col items-end bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
              <span className="text-[8.5px] font-black text-amber-700 uppercase tracking-wider">Interest Rate</span>
              <span className="text-xs font-black text-amber-800 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 text-amber-600" />
                {account.rate || '4.65% p.a.'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Mock Deposit Interactive Component */}
        <GlassCard className="p-5 border-white/70 bg-white/90 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-zinc-200/60 pb-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-zinc-900 tracking-tight">Simulate Deposit / Add Money</h3>
              <p className="text-[10.5px] text-zinc-500 font-medium">Test plan opportunities with an instant mock deposit</p>
            </div>
          </div>

          <form onSubmit={handleDepositSubmit} className="flex flex-col gap-4">
            {/* Input Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="deposit-amount-input" className="text-xs font-bold text-zinc-700">
                Deposit Amount (SGD)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-black text-zinc-500 pointer-events-none">
                  S$
                </span>
                <input
                  id="deposit-amount-input"
                  type="number"
                  step="any"
                  placeholder="Enter amount (e.g. 5000)"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                    setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-300/80 rounded-xl text-base font-black text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                />
              </div>
              {errorMsg && (
                <span className="text-[11px] font-bold text-red-600 mt-0.5">{errorMsg}</span>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider">Quick Presets</span>
              <div className="grid grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={`py-2 px-1 rounded-xl text-xs font-black border transition-all duration-150 cursor-pointer ${depositAmount === preset.toString()
                        ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                        : 'bg-zinc-100/80 text-zinc-700 border-zinc-200 hover:bg-zinc-200/80'
                      }`}
                  >
                    +S${(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSuccess}
              className={`w-full py-3.5 rounded-xl font-black text-xs text-white shadow-md flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${isSuccess
                  ? 'bg-emerald-600'
                  : 'bg-brand-primary hover:bg-brand-primary/95 active:bg-brand-primary'
                }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Deposit Successful! Navigating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Deposit</span>
                </>
              )}
            </motion.button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
