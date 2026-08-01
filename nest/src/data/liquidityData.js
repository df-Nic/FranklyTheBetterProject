// Data mapping deposit and investment products to their liquidity characteristics, exit penalty analysis, and subgoal alignment

export const LIQUIDITY_EXPLANATIONS = {
  // --- RETIREMENT ---
  ret_cpf_sa: {
    badge: "Government Backed Yield",
    type: "deposit",
    liquidity: "Retirement Drawdown",
    exitPenalty: "Zero Penalty at Maturity",
    subgoalAlignment: "Builds 4.0% p.a. guaranteed growth for retirement.",
    explanation: "Locks in guaranteed returns with zero exit fees when drawn at retirement."
  },
  ret_srs: {
    badge: "Tax-Advantaged Deposit",
    type: "deposit",
    liquidity: "Flexible SRS Vault",
    exitPenalty: "Zero Penalty Within SRS Basket",
    subgoalAlignment: "Timed with tax relief years and retirement goals.",
    explanation: "Lowers tax while allowing penalty-free reallocation."
  },
  ret_global_etf: {
    badge: "Liquid Equity Portfolio",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Lock-in / Exit Fee",
    subgoalAlignment: "Grows wealth for long-term goals with full exit freedom.",
    explanation: "RoboInvest portfolios carry zero early exit fees or lock-in penalties."
  },
  ret_blue_chip: {
    badge: "Dividend Equity Share Plan",
    type: "investment",
    liquidity: "Market Exchange Liquid",
    exitPenalty: "Zero Penalty on Share Sales",
    subgoalAlignment: "Generates dividends while keeping share sales flexible.",
    explanation: "SGX blue chip shares sell anytime at market rate with zero exit penalty."
  },
  ret_srs_ocbc: {
    badge: "SRS Unit Trust",
    type: "investment",
    liquidity: "Daily Unit Redemption",
    exitPenalty: "Zero Exit Lock-in Fee",
    subgoalAlignment: "Boosts SRS returns with daily unit redemption.",
    explanation: "Redeem fund units daily with zero exit fee."
  },
  ret_ocbc_robo: {
    badge: "Balanced Robo Vault",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Buffers volatility while allowing penalty-free cash out.",
    explanation: "Balanced portfolio with zero early withdrawal fees."
  },
  ret_ocbc_bcip: {
    badge: "S-REIT Dividend Basket",
    type: "investment",
    liquidity: "Stock Exchange Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Provides dividend yields with flexible exit.",
    explanation: "Sell REIT shares anytime at market rate with zero penalty."
  },


  // --- HOUSING (HDB / CONDO / LANDED) ---
  sav_ocbc360: {
    badge: "High-Yield Instant Access",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Instant cash access for short-term milestone payments.",
    explanation: "Earn up to 4.65% p.a. interest with 100% free daily withdrawals."
  },
  sav_bonus_plus: {
    badge: "Milestone-Aligned Saver",
    type: "deposit",
    liquidity: "Flexible Milestone Access",
    exitPenalty: "Zero Penalty on Subgoal Dates",
    subgoalAlignment: "Timed for 12–24 month milestone payments.",
    explanation: "Earn up to 3.70% p.a. with zero fee on scheduled milestone dates."
  },
  sav_fd_promo: {
    badge: "Staggered Fixed Deposit",
    type: "deposit",
    liquidity: "Maturity Aligned (6 Months)",
    exitPenalty: "Zero Penalty at Subgoal Maturity",
    subgoalAlignment: "Matures right before your downpayment date.",
    explanation: "Locks in 3.40% p.a. guaranteed return with zero exit fee at maturity."
  },
  sav_ocbc_money_max: {
    badge: "Instant Liquidity Vault",
    type: "deposit",
    liquidity: "Instant Daily Access",
    exitPenalty: "Zero Redemption Fee",
    subgoalAlignment: "Holds tax and legal fee buffers ready for immediate payout.",
    explanation: "Earns 3.85% p.a. cash yield with instant retrieval."
  },
  sav_premier_deposit: {
    badge: "Premier Tier Liquid Deposit",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "High-volume liquid cash for large downpayments.",
    explanation: "Earn up to 4.80% p.a. interest with 100% liquid cash availability."
  },
  sav_foreign_deposit: {
    badge: "Short-Term Currency Note",
    type: "deposit",
    liquidity: "Maturity Aligned Note",
    exitPenalty: "Zero Exit Penalty at Term",
    subgoalAlignment: "Matures ahead of key property contract dates.",
    explanation: "Short-term currency notes offering principal return with zero exit fee."
  },
  sav_tbills: {
    badge: "State-Backed T-Bills",
    type: "yield",
    liquidity: "6-Month Fixed Maturity",
    exitPenalty: "Zero Exit Penalty at Maturity",
    subgoalAlignment: "Matures right before your scheduled milestone due dates.",
    explanation: "Earn 3.70% p.a. government-backed return with zero exit risk."
  },

  sav_mmf: {
    badge: "Instant Money Market Fund",
    type: "yield",
    liquidity: "T+1 Instant Access",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "High-yield liquidity for unexpected milestone cash calls.",
    explanation: "Earns 3.90% p.a. return with fast redemption and zero exit fee."
  },
  sav_bcip_housing: {
    badge: "DCA Share Plan",
    type: "investment",
    liquidity: "Market Exchange Liquid",
    exitPenalty: "Zero Redemption Penalty",
    subgoalAlignment: "Builds downpayment capital with flexible sale options.",
    explanation: "Shares sell anytime on SGX at market rate with zero penalty."
  },
  sav_robo_growth: {
    badge: "Growth Investment Vault",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Grows long-term property capital with full liquidity.",
    explanation: "No lock-in contract. Cash out anytime for milestone payments."
  },
  sav_global_core: {
    badge: "Global Core Equities",
    type: "investment",
    liquidity: "Daily NAV Redemptions",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Compounds equity growth for mortgage payoff.",
    explanation: "Daily redemptions without early exit fees."
  },
  sav_ocbc_boostshield: {
    badge: "Bonus+ Yield Saver",
    type: "deposit",
    liquidity: "Subgoal-Aligned Access",
    exitPenalty: "Zero Penalty on Milestone",
    subgoalAlignment: "High yield saver for scheduled milestone payments.",
    explanation: "Earns up to 3.70% p.a. with zero fee on milestone dates."
  },
  sav_ocbc_notes: {
    badge: "Structured Yield Note",
    type: "deposit",
    liquidity: "Short-Term Maturing",
    exitPenalty: "Zero Penalty at Term",
    subgoalAlignment: "Short tenure aligned with downpayment due dates.",
    explanation: "Locks in higher yield with zero exit fee at term."
  },
  sav_sgs_bonds: {
    badge: "SG Savings Bonds (SSB)",
    type: "yield",
    liquidity: "Monthly Redemption Freedom",
    exitPenalty: "Zero Capital Loss / Penalty",
    subgoalAlignment: "Redeemable in any month with full interest for goals.",
    explanation: "Redeem capital any month with zero exit fee or loss."
  },

  // --- WEDDING FUND ---
  wed_ocbc360: {
    badge: "Daily Wedding Cash Vault",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Keeps wedding funds ready for vendor payment.",
    explanation: "Earns high interest with 100% free daily withdrawals."
  },
  wed_recurring: {
    badge: "Automated Goal Vault",
    type: "deposit",
    liquidity: "Instant Daily Access",
    exitPenalty: "Zero Lock-in Fee",
    subgoalAlignment: "Builds monthly reserves for banquet milestones.",
    explanation: "Draw down funds penalty-free on vendor payment dates."
  },
  wed_tbills: {
    badge: "Risk-Free Wedding Yield",
    type: "yield",
    liquidity: "6-Month Maturing T-Bills",
    exitPenalty: "Zero Penalty at Maturity",
    subgoalAlignment: "Matures right before final banquet payment.",
    explanation: "Earns 3.70% p.a. guaranteed return with zero exit fee."
  },
  wed_ocbc_boost: {
    badge: "Bonus Interest Wedding Vault",
    type: "deposit",
    liquidity: "Milestone Aligned",
    exitPenalty: "Zero Penalty on Milestone",
    subgoalAlignment: "High-yield saver for banquet downpayments.",
    explanation: "Earns high yield with zero fee on vendor payment dates."
  },
  wed_giro: {
    badge: "Recurring PayNow Vault",
    type: "deposit",
    liquidity: "100% Flexible",
    exitPenalty: "Zero Exit Fee",
    subgoalAlignment: "Builds cashflow for progressive wedding costs.",
    explanation: "Monthly transfers disburse penalty-free to vendors."
  },
  wed_mmf: {
    badge: "Liquid Wedding Cash Fund",
    type: "yield",
    liquidity: "Instant Access (T+1)",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Keeps banquet reserves earning 3.90% p.a.",
    explanation: "Fast redemption for vendor invoices with zero exit fee."
  },

  // --- CHILDREN'S EDUCATION ---
  edu_saver: {
    badge: "CDA Matched Savings Account",
    type: "deposit",
    liquidity: "Approved Provider Access",
    exitPenalty: "Zero Penalty for Education",
    subgoalAlignment: "Funds school and tuition milestones.",
    explanation: "Earns 2.0% p.a. plus 1-for-1 matching with zero withdrawal fee."
  },
  edu_srs: {
    badge: "SRS Education Growth",
    type: "deposit",
    liquidity: "Milestone Scheduled",
    exitPenalty: "Zero Reallocation Fee",
    subgoalAlignment: "Grows tuition funds tax-efficiently.",
    explanation: "Lowers current tax while allowing penalty-free reallocation."
  },
  edu_robo: {
    badge: "Balanced Education Fund",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Lock-in",
    subgoalAlignment: "Compounds tuition reserves over a long timeline.",
    explanation: "No lock-in contract fees. Shift to cash anytime."
  },
  edu_unit_trust: {
    badge: "Global Core Education Fund",
    type: "investment",
    liquidity: "Daily NAV Redemptions",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Generates capital growth for school fees.",
    explanation: "Daily liquidity to pay tuition fees on time without exit fees."
  },
  edu_saver_alt: {
    badge: "Promo CDA Saver",
    type: "deposit",
    liquidity: "Approved Provider Access",
    exitPenalty: "Zero Penalty",
    subgoalAlignment: "Higher promo rate for early education goals.",
    explanation: "Promo rate with zero withdrawal fee for approved spending."
  },
  edu_srs_alt: {
    badge: "SRS Global Equities",
    type: "investment",
    liquidity: "Daily Unit NAV Redemptions",
    exitPenalty: "Zero Redemption Fee",
    subgoalAlignment: "Grows long-term education funds.",
    explanation: "Zero exit penalties when liquidating for tuition milestones."
  },

  // --- CAREER BREAK ---
  car_ocbc360: {
    badge: "Transition Emergency Vault",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Provides living cashflow during career break.",
    explanation: "Instant daily access to living reserves with zero penalty."
  },
  car_bonus: {
    badge: "Transition High-Yield Saver",
    type: "deposit",
    liquidity: "Milestone Aligned",
    exitPenalty: "Zero Penalty on Break Start",
    subgoalAlignment: "Builds buffer cash for living expenses.",
    explanation: "Earns 3.70% p.a. with zero fee when starting your break."
  },

  // --- PARENTS' RETIREMENT ---
  par_cpf_ra: {
    badge: "CPF Retirement Sum Top-Up",
    type: "deposit",
    liquidity: "Monthly Life Payouts",
    exitPenalty: "Zero Penalty (State Guaranteed)",
    subgoalAlignment: "Funds parents' monthly payouts from age 65.",
    explanation: "Guaranteed 4.0% p.a. return providing tax relief and lifelong payouts."
  },

  // --- DEFAULT / GENERAL ---
  def_saver: {
    badge: "High-Yield Goal Vault",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Holds cash for short-term milestone goals.",
    explanation: "High interest with zero fee on withdrawal dates."
  },
  def_recurring: {
    badge: "Recurring Goal Transfer",
    type: "deposit",
    liquidity: "100% Liquid",
    exitPenalty: "Zero Lock-in Fee",
    subgoalAlignment: "Builds milestone reserves steadily every month.",
    explanation: "Automated transfers with total freedom to withdraw anytime."
  },
  def_etfs: {
    badge: "Growth Equity Portfolio",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Lock-in",
    subgoalAlignment: "Compounds long-term wealth for multi-year goals.",
    explanation: "RoboInvest portfolios carry zero early exit fees."
  },
  def_reits: {
    badge: "S-REIT Share Basket",
    type: "investment",
    liquidity: "Market Exchange Liquid",
    exitPenalty: "Zero Sale Penalty",
    subgoalAlignment: "Yield-generating equity basket for growth.",
    explanation: "Sell shares on SGX anytime at market rate with zero penalty."
  }
};


// Fallback generator for any newly added or custom products
export const getLiquidityExplanation = (action) => {
  if (!action) return null;
  
  const existing = LIQUIDITY_EXPLANATIONS[action.id];
  if (existing) return existing;

  const isDeposit = action.type === 'deposit';
  const isYield = action.type === 'yield';
  
  return {
    badge: isDeposit ? "High-Yield Savings Vault" : isYield ? "State-Backed Yield Note" : "Liquid Market Portfolio",
    type: isDeposit ? "deposit" : isYield ? "yield" : "investment",
    liquidity: isDeposit ? "100% Daily Liquid Access" : "Daily Market Redemption",
    exitPenalty: "Zero Early Exit Penalty",
    subgoalAlignment: `Aligned with your milestone dates for penalty-free cash access.`,
    explanation: `${action.name} offers ${action.rate ? (action.rate * 100).toFixed(2) + '% p.a. returns' : 'steady growth'} with zero early withdrawal fees.`
  };

};
