import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  TrendingUp,
  ShieldCheck,
  Gift,
  Scissors,
  ShieldAlert,
  Percent,
  Compass,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { PLAN_ALTERNATIVES } from '../../data/planTemplates';

const ACTION_ELABORATIONS = {
  // Retirement
  ret_cpf_sa: "Guarantees 4% risk-free growth to secure your retirement baseline.",
  ret_srs: "Reduces your current tax bill while building tax-deferred savings.",
  ret_global_etf: "Uses long-term market growth to hit your large accumulation target.",
  ret_blue_chip: "Provides steady dividend income to supplement retirement payouts.",
  ret_annuity: "Creates a guaranteed monthly cash payout starting from age 65.",
  ret_careshield: "Protects your accumulated savings from healthcare erosion.",

  // Retirement Alternatives
  ret_srs_ocbc: "Boosts SRS returns using global equities instead of leaving it in cash.",
  ret_great_lifetime: "Offers flexible payouts with potential upside from bonuses.",
  ret_ocbc_robo: "Maintains growth path while buffering against market volatility.",
  ret_ocbc_bcip: "Focuses on stable SG REIT yields to generate passive cashflow.",
  ret_ge_prestige: "Secures higher single-premium lifetime payouts with cash options.",
  ret_ge_careshield: "Provides a larger disability payout shield funded by CPF Medisave.",

  // Housing / Savings
  sav_cpf_grant: "Unlocks maximum state grants to reduce your loan downpayment.",
  sav_hdb_loan: "Locks in concessionary rates to keep mortgage payments predictable.",
  sav_ocbc360: "High-yield daily-liquid cash account for your short-term savings.",
  sav_fd_promo: "Locks in promotional yields risk-free for your upcoming downpayment.",
  sav_tbills: "Captures safe, state-backed yield higher than normal savings accounts.",
  sav_mmf: "Maintains yield near T-Bills but keeps cash 100% flexible for withdrawals.",

  // Housing / Savings Alternatives
  sav_ocbc_boostshield: "Earns high bonus interest without requiring salary credit.",
  sav_ocbc_notes: "Increases yield slightly over standard fixed deposits risk-free.",
  sav_hdb_resale_grant: "Qualifies for proximity grant by planning location near parents.",
  sav_ocbc_home_loan: "Leverages SORA-pegged rates to benefit from falling interest environments.",
  sav_ocbc_money_max: "Higher liquidity cash fund with instant retrieval options.",
  sav_sgs_bonds: "Risk-free step-up yield that can be redeemed anytime without penalty.",

  // Emergency
  em_saver: "Keeps your safety buffer liquid while earning high base interest.",
  em_sweep: "Sweeps idle checking balances automatically into yields.",
  em_sub: "Instantly frees up cashflow by canceling unused services.",
  em_dine: "Trims lifestyle costs directly to build your buffer faster.",
  em_shield: "Avoids large out-of-pocket cash bills during medical emergencies.",

  // Emergency Alternatives
  em_ocbc_360_pocket: "Segments emergency cash inside a digital vault to prevent spending.",
  em_ocbc_sweep: "Automates savings transfer to yield-bearing cash funds.",
  em_ocbc_card_rebates: "Maximizes cashback on daily essentials to redirect to savings.",
  em_ocbc_lifestyle_cap: "Sets digital budget boundaries within your banking app.",
  em_ge_supreme_ecare: "Covers hospital co-payments via Medisave to preserve emergency cash.",

  // Wedding
  wed_ocbc360: "Parks short-term wedding cash in a high-yield liquid account.",
  wed_recurring: "Accumulates regular wedding budget automatically via monthly plans.",
  wed_tbills: "Safeguards banquet downpayment money with zero market risk.",
  wed_dine: "Frees up extra cash for the wedding by optimizing card spending.",

  // Wedding Alternatives
  wed_ocbc_boost: "Funnels wedding savings into a bonus interest multiplier account.",
  wed_giro: "Automates regular budget accumulation towards key banquet dates.",
  wed_mmf: "Keeps wedding funds flexible for caterer payments while earning yield.",
  wed_card_rebates: "Reduces banquet costs via card cashbacks on wedding merchants.",

  // Education
  edu_saver: "Locks in government dollar-for-dollar matching in CDA account.",
  edu_srs: "Directs long-term education funds into tax-advantaged accounts.",
  edu_robo: "Builds a dedicated education fund using moderate risk models.",
  edu_unit_trust: "Focuses on steady-yield mutual funds for school tuition fees.",
  edu_ge_endowment: "Ensures guaranteed payouts matching key school admission years.",

  // Education Alternatives
  edu_saver_alt: "Secures promotional interest for school savings accounts.",
  edu_srs_alt: "Maximizes educational wealth growth using long-horizon funds.",
  edu_robo_alt: "Lowers risk profile to preserve capital as graduation approaches.",
  edu_unit_trust_alt: "Creates recurring dividend cash to pay for term fees.",
  edu_ge_endowment_alt: "Secures cash payout timings matching secondary/uni gates.",

  // Career Break
  car_ocbc360: "Keeps transition funds liquid for monthly living expenses.",
  car_bonus: "Maximizes interest yield on career break cash deposits.",
  car_sweep: "Sweeps excess funds into highly liquid cash equivalents.",
  car_lifestyle: "Minimizes daily costs during transition via card savings.",

  // Career Break Alternatives
  car_ocbc360_alt: "Locks in interest yields without penalty during career transition.",
  car_bonus_alt: "Grows liquid cash quickly via multi-tier savings rates.",
  car_sweep_alt: "Places career break reserves in a high-yield cash sweep.",
  car_lifestyle_alt: "Reduces daily living bills via high-cashback cards.",

  // Parents' Retirement
  par_cpf_ra: "Guarantees high lifetime payouts for parents via CPF RA top-up.",
  par_ge_elderly: "Protects parents from medical bills that could drain your cash.",
  par_ge_life: "Secures senior life coverage to buffer parents' lifestyle costs.",

  // Parents' Retirement Alternatives
  par_cpf_ra_alt: "Provides a safe, fixed-term interest account for parents' funds.",
  par_ge_elderly_alt: "Opt for standard health riders to balance premium costs.",
  par_ge_life_alt: "Switches to senior term coverage to lower monthly premium bills.",

  // Default Custom
  def_saver: "Establishes a solid cash reserve baseline in a high-yield saver.",
  def_recurring: "Maintains consistent investing habits via automated flows.",
  def_etfs: "Grows wealth long-term through global equity exposure.",
  def_reits: "Collects regular passive yield from premier property assets.",
  def_refinance: "Lowers interest costs by transferring high-cost credit balances.",
  def_mortgage: "Refinances to eco-friendly loans to lower mortgage payments."
};

const renderCategoryIcon = (iconName) => {
  switch (iconName) {
    case 'Coins': return <Coins className="w-4 h-4 stroke-[2.2]" />;
    case 'TrendingUp': return <TrendingUp className="w-4 h-4 stroke-[2.2]" />;
    case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 stroke-[2.2]" />;
    case 'Gift': return <Gift className="w-4 h-4 stroke-[2.2]" />;
    case 'Scissors': return <Scissors className="w-4 h-4 stroke-[2.2]" />;
    case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 stroke-[2.2]" />;
    case 'Percent': return <Percent className="w-4 h-4 stroke-[2.2]" />;
    default: return <Compass className="w-4 h-4 stroke-[2.2]" />;
  }
};

const PlanTabbedDeck = ({ categories = [], pendingExcluded = new Set(), toggleAction, isReadOnly = false }) => {
  const [activeTabId, setActiveTabId] = useState(() => (categories[0] ? categories[0].id : ''));

  if (!categories || categories.length === 0) return null;

  // Fallback active category in case state is out of sync
  const currentCategory = categories.find(c => c.id === activeTabId) || categories[0];

  return (
    <div className="flex flex-col gap-3 shrink-0">
      {/* Category Tabs Container */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0 -mx-1 px-1">
        {categories.map((cat) => {
          const isActive = cat.id === currentCategory.id;
          const totalActions = cat.actions ? cat.actions.length : 0;
          const activeActionsCount = cat.actions ? cat.actions.filter(a => !pendingExcluded.has(a.id)).length : 0;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveTabId(cat.id)}
              className={`relative px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 border select-none ${isActive
                  ? 'bg-white text-brand-primary border-brand-primary/80 shadow-md shadow-brand-primary/10'
                  : 'bg-white/80 text-zinc-600 border-zinc-200/80 hover:bg-white hover:border-zinc-300'
                }`}
            >
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${isActive ? 'text-brand-primary bg-brand-primary/15' : 'text-zinc-500 bg-zinc-100'
                }`}>
                {renderCategoryIcon(cat.icon)}
              </div>
              <span className="whitespace-nowrap tracking-tight">{cat.name}</span>

              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${isActive
                  ? 'bg-brand-primary text-white'
                  : activeActionsCount < totalActions
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-zinc-100 text-zinc-500'
                }`}>
                {activeActionsCount}/{totalActions}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeTabOutline"
                  className="absolute inset-0 rounded-2xl border-2 border-brand-primary pointer-events-none shadow-[0_0_12px_rgba(225,29,72,0.15)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Actions List Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-white border border-zinc-200/50 rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-3 min-h-[190px]"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                {renderCategoryIcon(currentCategory.icon)}
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none">RECOMMENDED PRODUCTS</span>
                <span className="text-xs font-black text-zinc-900 tracking-tight mt-0.5">{currentCategory.name}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {currentCategory.actions && currentCategory.actions.map(action => {
              const isExcluded = pendingExcluded.has(action.id);
              return (
                <div
                  key={action.id}
                  onClick={() => !isReadOnly && toggleAction(action.id)}
                  className={`p-3 rounded-2xl border text-left flex gap-3 items-start transition-all duration-200 bg-white ${isExcluded
                      ? 'border-amber-200 shadow-[0_2px_12px_rgba(245,158,11,0.04)]'
                      : `border-zinc-200/60 ${isReadOnly ? '' : 'hover:border-brand-primary/40 hover:shadow-sm active:scale-[0.99] cursor-pointer'}`
                    }`}
                >
                  {/* Selection/Swap Trigger Button */}
                  {!isReadOnly ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAction(action.id);
                      }}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 cursor-pointer active:scale-90 ${isExcluded
                          ? 'bg-amber-100 border-amber-200 text-amber-700 hover:bg-amber-200 hover:text-amber-800'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary'
                        }`}
                      title={isExcluded ? 'Restore original product' : 'Swap for alternative product'}
                    >
                      {isExcluded ? (
                        <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 stroke-[2.2]" />
                      )}
                    </button>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                      <CheckCircle2 className="w-4 h-4 fill-current stroke-[2.5]" />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex flex-col flex-1">
                    <div className={`flex flex-col transition-all duration-200 ${isExcluded ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[11px] font-extrabold tracking-tight ${isExcluded ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>
                          {action.name}
                        </span>
                        {action.type && (
                          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isExcluded ? 'bg-zinc-200 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                            }`}>
                            {action.type}
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-zinc-500 font-medium leading-relaxed mt-1">
                        {action.desc}
                      </p>

                      {/* Elaboration of suggestion */}
                      <div className="mt-1.5 flex items-start gap-1 text-[8.5px] font-semibold text-zinc-500 bg-zinc-50/50 rounded-lg p-1 border border-zinc-100/50">
                        <Sparkles className="w-2.5 h-2.5 text-brand-primary/80 shrink-0 mt-0.5" />
                        <span>
                          <strong>Why it fits:</strong> {ACTION_ELABORATIONS[action.id] || "Fits your overall goal parameters."}
                        </span>
                      </div>
                    </div>

                    {/* Swap Actions / Alternative Panel */}
                    <AnimatePresence>
                      {isExcluded && (() => {
                        const alternative = PLAN_ALTERNATIVES[action.id];
                        return alternative ? (
                          <motion.div
                            key="alternative"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            onClick={(e) => e.stopPropagation()} // Prevent toggling when clicking inside alternative
                            className="overflow-hidden w-full"
                          >
                            <div className="p-3 bg-amber-50/40 border border-dashed border-amber-200 rounded-[16px] flex flex-col gap-2 shadow-[inset_0_1px_3px_rgba(245,158,11,0.02)]">
                              <div className="flex items-center justify-between gap-1.5 text-amber-700">
                                <div className="flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 fill-current text-amber-600 animate-pulse" />
                                  <span className="text-[8.5px] font-black uppercase tracking-wider">AI Proposed Replacement</span>
                                </div>
                                <span className="text-[7.5px] font-extrabold px-1.5 py-0.5 bg-amber-100 rounded-full text-amber-800 uppercase tracking-widest leading-none">
                                  Pending Replan
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[10.5px] font-extrabold text-zinc-800 tracking-tight">
                                    {alternative.name}
                                  </span>
                                  {alternative.type && (
                                    <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 uppercase tracking-wider">
                                      {alternative.type}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[9px] text-zinc-500 font-semibold leading-relaxed mt-1">
                                  {alternative.desc}
                                </p>
                                {/* Elaboration of suggestion for alternative */}
                                <div className="mt-1.5 flex items-start gap-1 text-[8px] font-semibold text-amber-800 bg-amber-100/40 rounded-lg p-1 border border-amber-200/40">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-600 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Why it fits:</strong> {ACTION_ELABORATIONS[alternative.id] || "Optimizes returns within plan parameters."}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="no-alternative"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[9px] font-medium text-zinc-400 italic"
                          >
                            Will be removed from plan. No direct alternative available.
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PlanTabbedDeck;
