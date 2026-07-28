import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  Percent,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Zap,
  Building2,
  Wallet
} from 'lucide-react';

export default function DepositVaultShowcase({ deposits, activeIndex, onChangeIndex }) {
  const activeDeposit = deposits[activeIndex] || deposits[0];

  const handlePrev = () => {
    onChangeIndex((activeIndex - 1 + deposits.length) % deposits.length);
  };

  const handleNext = () => {
    onChangeIndex((activeIndex + 1) % deposits.length);
  };

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* Main Deposit Vault Certificate Folder */}
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDeposit.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="w-full rounded-3xl p-5 text-white relative overflow-hidden shadow-xl border border-white/20 flex flex-col gap-4"
            style={{
              background: getVaultGradient(activeDeposit.id),
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.35)'
            }}
          >
            {/* Background Bank Linework SVG Watermark */}
            <svg className="absolute -right-8 -bottom-10 w-52 h-52 text-white/5 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="50" cy="50" r="46" />
              <circle cx="50" cy="50" r="36" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="26" />
              <path d="M50 4 L50 96 M4 L50 L96 50" />
            </svg>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Certificate Header Bar */}
            <div className="flex items-center justify-between relative z-10 border-b border-white/15 pb-3">
              <span className="text-xs font-bold text-white tracking-tight">{activeDeposit.category}</span>

              {/* Protection Badge */}
              <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/25 text-[9.5px] font-black text-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300/30" />
                <span>SDIC INSURED (S$100K)</span>
              </div>
            </div>

            {/* Hero Account Info & Yield Display */}
            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="text-base font-black text-white leading-tight tracking-tight drop-shadow-xs">
                {activeDeposit.name}
              </h3>
              <p className="text-[11px] font-medium text-white/85 leading-snug">
                {activeDeposit.tagline}
              </p>

              {/* Highlight Interest Yield Box */}
              <div className="mt-1 flex items-center gap-3">
                <div className="bg-gradient-to-r from-amber-400/30 via-emerald-400/30 to-amber-300/20 backdrop-blur-md border border-amber-300/60 px-3 py-2 rounded-2xl flex items-center gap-2 shadow-xs">
                  <TrendingUp className="w-4 h-4 text-amber-300 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[8.5px] font-extrabold text-amber-200 uppercase tracking-wider leading-none">Yield Rate</span>
                    <span className="text-sm font-black text-white tracking-tight mt-0.5">{activeDeposit.headlineRate}</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-wider">Projected Annual Return</span>
                  <span className="text-xs font-black text-amber-300">
                    +S${activeDeposit.baseEstAnnualValue.toLocaleString()} / year
                  </span>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2 relative z-10 pt-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 flex flex-col justify-between">
                <span className="text-[8.5px] font-extrabold text-white/60 uppercase tracking-wider">Liquidity & Access</span>
                <span className="text-[10.5px] font-black text-white mt-1">{getLiquidityTag(activeDeposit)}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 flex flex-col justify-between">
                <span className="text-[8.5px] font-extrabold text-white/60 uppercase tracking-wider">Initial Deposit</span>
                <span className="text-[10.5px] font-black text-white mt-1">{activeDeposit.minDeposit}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Prev / Next Controls */}
        <div className="flex items-center justify-center gap-4 mt-2.5 z-20">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white text-zinc-700 shadow-md border border-zinc-200/80 active:scale-95 transition cursor-pointer hover:bg-zinc-50"
            aria-label="Previous item"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1.5">
            {deposits.map((_, i) => (
              <button
                key={i}
                onClick={() => onChangeIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex ? 'w-6 bg-[#D32F2F]' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                }`}
                aria-label={`Go to deposit account ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white text-zinc-700 shadow-md border border-zinc-200/80 active:scale-95 transition cursor-pointer hover:bg-zinc-50"
            aria-label="Next item"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getLiquidityTag(card) {
  if (card.id === 'ocbc-fd-6m') return '6-Month Fixed Term';
  if (card.id === 'ocbc-premier-div') return '12 Major Currencies';
  if (card.id === 'ocbc-frank-saver') return 'Goal Pockets & Round-Ups';
  if (card.id === 'ocbc-foreign-curr') return 'USD High Yield (FX)';
  if (card.id === 'ocbc-lion-liq') return 'T+1 Fast Redemption';
  if (card.id === 'ocbc-bonus-plus') return 'Non-Withdrawal Bonus';
  return '100% Daily Liquid Access';
}

function getVaultGradient(id) {
  switch (id) {
    case 'ocbc-360':
      return 'linear-gradient(135deg, #1C1917 0%, #B91C1C 55%, #7F1D1D 100%)';
    case 'ocbc-bonus-plus':
      return 'linear-gradient(135deg, #064E3B 0%, #047857 55%, #065F46 100%)';
    case 'ocbc-fd-6m':
      return 'linear-gradient(135deg, #0F172A 0%, #334155 55%, #1E293B 100%)';
    case 'ocbc-premier-div':
      return 'linear-gradient(135deg, #171717 0%, #262626 55%, #92400E 100%)';
    case 'ocbc-frank-saver':
      return 'linear-gradient(135deg, #0369A1 0%, #0284C7 55%, #0D9488 100%)';
    case 'ocbc-msa':
      return 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 55%, #4338CA 100%)';
    case 'ocbc-foreign-curr':
      return 'linear-gradient(135deg, #022C22 0%, #059669 55%, #047857 100%)';
    case 'ocbc-lion-liq':
      return 'linear-gradient(135deg, #31103F 0%, #6D28D9 55%, #4C1D95 100%)';
    default:
      return 'linear-gradient(135deg, #1C1917 0%, #991B1B 100%)';
  }
}
