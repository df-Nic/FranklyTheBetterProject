import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Edit2, Eye, EyeOff, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';

// Wait, make sure we use standard React imports and Framer Motion!
// Let's implement the Amount Page.
const PayNowAmountPage = () => {
  const {
    navigate,
    paynowContact,
    paynowAmount,
    setPaynowAmount,
    paynowReference,
    setPaynowReference,
    paynowSourceAccount,
    setPaynowSourceAccount,
    accountsData,
    isMasked,
    toggleMask
  } = useApp();

  const [amount, setAmount] = useState(paynowAmount || '');
  const [reference, setReference] = useState(paynowReference || '');
  const [showRefInput, setShowRefInput] = useState(!!paynowReference);
  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const [showLocalBalance, setShowLocalBalance] = useState(false);
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Recipient info
  const name = paynowContact?.name || 'Ivan Heng';
  const detailString = paynowContact
    ? `${paynowContact.phone}${paynowContact.vpa ? ` • ${paynowContact.vpa}` : ''}`
    : '+65 88888888 • Ivanhengsj';

  const handleNext = () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (numAmount > (paynowSourceAccount?.balance || 0)) {
      setError('Insufficient funds in the selected account');
      return;
    }
    
    setPaynowAmount(amount);
    setPaynowReference(reference);
    setError('');
    navigate('paynow-confirm');
  };

  const formatBalance = (balance) => {
    return balance.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow numbers with up to 2 decimal places
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
      setError('');
    }
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative overflow-hidden select-none">
      {/* Background Orbs */}
      <BackgroundOrb color="pink" size="320px" className="-top-10 -right-10" />
      <BackgroundOrb color="peach" size="240px" className="bottom-10 -left-10" />

      {/* Header */}
      <header className="pt-6 pb-4 h-auto w-full bg-white/40 backdrop-blur-xl border-b border-white/30 px-4 flex items-center justify-between z-40 shrink-0 sticky top-0">
        <button
          onClick={() => navigate('paynow-contacts')}
          className="w-9 h-9 rounded-full bg-white border border-zinc-200/60 flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-[18px] h-[18px] stroke-[2.5]" />
        </button>
        <div className="w-9 h-9" /> {/* Spacer */}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 flex flex-col gap-6 z-10 pb-10">
        {/* Recipient Details */}
        <div className="flex flex-col gap-1.5 px-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Pay to</span>
          <h3 className="text-2xl font-black text-zinc-900 tracking-tight leading-none">{name}</h3>
          <span className="text-[11px] font-semibold text-zinc-500">{detailString}</span>
        </div>

        {/* Amount Input Card */}
        <GlassCard className="p-5 border-white/70 relative">
          <div className="flex justify-between items-baseline">
            {/* Custom Input */}
            <div className="flex items-baseline w-full">
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="text-4xl font-black text-zinc-900 tracking-tight bg-transparent border-none outline-none p-0 focus:ring-0 max-w-[70%]"
                style={{ caretColor: '#E1251B' }}
              />
              <span className="text-base font-black text-zinc-400 ml-2 tracking-tight">SGD</span>
            </div>
          </div>

          {error && <span className="text-[10px] font-bold text-brand-primary mt-1 block">{error}</span>}

          <div className="text-[10px] font-semibold text-zinc-400 mt-3 flex items-center gap-1.5">
            <span>Daily limit remaining:</span>
            <span className="text-brand-accent font-bold">5,000.00 SGD</span>
          </div>

          {/* Reference Number Block */}
          <div className="mt-4">
            {!showRefInput ? (
              <button
                onClick={() => setShowRefInput(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/10 hover:bg-zinc-800/15 text-zinc-700 text-[10px] font-bold transition-all duration-150 cursor-pointer active:scale-95"
              >
                <Edit2 className="w-3 h-3 stroke-[2.2]" />
                <span>Add reference number</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-1.5">
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter reference number (optional)"
                  className="flex-1 bg-transparent text-[11px] font-semibold text-zinc-800 placeholder-zinc-400 border-none outline-none focus:ring-0 p-0"
                />
                <button
                  onClick={() => {
                    setReference('');
                    setShowRefInput(false);
                  }}
                  className="p-1 rounded-full hover:bg-zinc-200 text-zinc-400 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Source Account Card */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-1">From</span>
          <GlassCard className="p-4 border-white/70">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-black text-zinc-900 tracking-tight leading-snug">
                  {paynowSourceAccount?.name || '360 Account'}
                </h4>
                <p className="text-[10px] font-semibold text-zinc-400 mt-0.5">
                  {paynowSourceAccount?.number || '001-23456-789'}
                </p>
              </div>
              <button
                onClick={() => setShowAccountDrawer(true)}
                className="text-[11px] font-black text-brand-accent hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Balances */}
            <div className="mt-4 pt-3 border-t border-zinc-100/50 flex items-center justify-between">
              <button
                onClick={() => setShowLocalBalance(!showLocalBalance)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-brand-accent cursor-pointer select-none"
              >
                {showLocalBalance ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Hide available balance</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Show available balance</span>
                  </>
                )}
              </button>
              {showLocalBalance && (
                <span className="text-xs font-black text-zinc-700 tracking-tight">
                  SGD {formatBalance(paynowSourceAccount?.balance || 0)}
                </span>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Next Button */}
        <div className="mt-auto pt-6 flex justify-center">
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl bg-brand-secondary text-white text-xs font-black tracking-wider transition-all duration-150 active:scale-98 cursor-pointer shadow-md shadow-brand-secondary/15 flex items-center justify-center"
          >
            Next
          </button>
        </div>
      </div>

      {/* Account Selector Slide-Up Drawer */}
      <AnimatePresence>
        {showAccountDrawer && (
          <>
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 z-45"
              onClick={() => setShowAccountDrawer(false)}
            />
            {/* Drawer */}
            <div
              className="absolute bottom-0 left-0 right-0 max-h-[70%] bg-white rounded-t-[28px] border-t border-zinc-200/50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-hidden"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
            >
              {/* Drawer Header */}
              <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <span className="text-xs font-black text-zinc-950 uppercase tracking-wider">Select Source Account</span>
                <button
                  onClick={() => setShowAccountDrawer(false)}
                  className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600 active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Accounts list */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {accountsData.map((acc) => {
                  const isSelected = acc.id === paynowSourceAccount?.id;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => {
                        setPaynowSourceAccount(acc);
                        setShowAccountDrawer(false);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-brand-primary bg-red-50/5'
                          : 'border-zinc-200/60 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-zinc-900">{acc.name}</h5>
                          {acc.isJoint && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-brand-accent/10 text-brand-accent rounded">
                              JOINT
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">{acc.number}</p>
                        <p className="text-[10px] font-bold text-zinc-500 mt-2">
                          Balance: SGD {formatBalance(acc.balance)}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayNowAmountPage;
