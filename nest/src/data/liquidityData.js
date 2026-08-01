// Data mapping deposit and investment products to their liquidity characteristics, exit penalty analysis, and subgoal alignment

export const LIQUIDITY_EXPLANATIONS = {
  // --- RETIREMENT ---
  ret_cpf_sa: {
    badge: "Government Backed Yield",
    type: "deposit",
    liquidity: "Structured Retirement Drawdown",
    exitPenalty: "Zero Penalty at Maturity",
    subgoalAlignment: "Calculated to build guaranteed 4.0% p.a. baseline growth for long-term retirement subgoals.",
    explanation: "Top-ups to CPF Special Account lock in guaranteed yields without private exit charges or early surrender penalties when funds are drawn down under statutory retirement milestone rules."
  },
  ret_srs: {
    badge: "Tax-Advantaged Deposit",
    type: "deposit",
    liquidity: "Flexible SRS Sub-Vault",
    exitPenalty: "Zero Penalty Within SRS Basket",
    subgoalAlignment: "Timed with tax relief years and retirement milestone subgoals.",
    explanation: "SRS contributions reduce current taxable income while allowing penalty-free reallocation between SGD cash, fixed deposits, and unit trusts as milestone dates approach."
  },
  ret_global_etf: {
    badge: "Liquid Equity Portfolio",
    type: "investment",
    liquidity: "Daily Liquid (T+2 Settlement)",
    exitPenalty: "Zero Lock-in / Exit Fee",
    subgoalAlignment: "DCA contributions grow wealth for mid-to-long term subgoals with total exit freedom.",
    explanation: "OCBC RoboInvest equity portfolios carry no early exit fees or withdrawal penalties. You can liquidate or rebalance positions at full market value when approaching target dates."
  },
  ret_blue_chip: {
    badge: "Dividend Equity Share Plan",
    type: "investment",
    liquidity: "Market Exchange Liquid",
    exitPenalty: "Zero Penalty on Share Sales",
    subgoalAlignment: "Generates quarterly cash dividends while maintaining option to sell shares before milestones.",
    explanation: "Blue chip shares traded on SGX can be sold at market price anytime without exit penalty fees, converting accrued dividend stock directly into cash for subgoals."
  },
  ret_srs_ocbc: {
    badge: "SRS Unit Trust",
    type: "investment",
    liquidity: "Daily Unit NAV Redemptions",
    exitPenalty: "Zero Exit Lock-in Fee",
    subgoalAlignment: "Enhances SRS returns while preserving unit redemption freedom for milestone payouts.",
    explanation: "Lion-OCBC Global Core Fund holdings within SRS can be redeemed at daily Net Asset Value without redemption penalties."
  },
  ret_ocbc_robo: {
    badge: "Balanced Robo Vault",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Buffers volatility while allowing penalty-free liquidation as target subgoals draw near.",
    explanation: "Balanced RoboInvest portfolios provide flexible automated asset allocation with zero early withdrawal or lock-in penalty fees."
  },
  ret_ocbc_bcip: {
    badge: "S-REIT Dividend Basket",
    type: "investment",
    liquidity: "Stock Exchange Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Delivers passive rental yield with flexible liquid exit prior to milestone dates.",
    explanation: "REIT units accumulated through BCIP can be liquidated on SGX at market rate with zero exit penalty."
  },

  // --- HOUSING (HDB / CONDO / LANDED) ---
  sav_ocbc360: {
    badge: "High-Yield Instant Access",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Ideal for short-term downpayment milestone payments that require instant cash access.",
    explanation: "OCBC 360 Account balances earn up to 4.65% p.a. bonus interest with complete liquidity. You can transfer funds for downpayment subgoals at any moment without forfeiting interest or incurring penalty fees."
  },
  sav_bonus_plus: {
    badge: "Milestone-Aligned Saver",
    type: "deposit",
    liquidity: "Flexible Milestone Access",
    exitPenalty: "Zero Penalty on Subgoal Dates",
    subgoalAlignment: "Structured for key downpayment tranches due in 12–24 months.",
    explanation: "OCBC Bonus+ rewards disciplined saving with up to 3.70% p.a. interest. Withdrawals made for scheduled milestone dates suffer zero penalty fee."
  },
  sav_fd_promo: {
    badge: "Staggered Fixed Deposit",
    type: "deposit",
    liquidity: "Maturity Aligned (6 Months)",
    exitPenalty: "Zero Penalty at Subgoal Maturity",
    subgoalAlignment: "Timed to mature exactly before your first downpayment milestone date.",
    explanation: "Unlike standard lock-ins, this fixed deposit is staggered so that its 6-month maturity matches your upcoming OTP downpayment date. You capture a guaranteed 3.40% p.a. yield with zero exit penalty when the milestone payment is due."
  },
  sav_ocbc_money_max: {
    badge: "Instant Liquidity Vault",
    type: "deposit",
    liquidity: "Instant Daily Access",
    exitPenalty: "Zero Redemption Fee",
    subgoalAlignment: "Holds stamp duty (BSD) and legal fee buffers ready for immediate payout.",
    explanation: "MoneyMax Liquidity Vault offers cash management yields (3.85% p.a.) with instant retrieval options, ensuring zero penalty or delay when paying conveyancing fees."
  },
  sav_premier_deposit: {
    badge: "Premier Tier Liquid Deposit",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "High-volume liquid cash backing large downpayments and property options.",
    explanation: "Premier Banking deposits earn up to 4.80% p.a. premier interest with 100% liquid availability for property milestone payments."
  },
  sav_foreign_deposit: {
    badge: "Short-Term Currency Note",
    type: "deposit",
    liquidity: "Maturity Aligned Note",
    exitPenalty: "Zero Exit Penalty at Term",
    subgoalAlignment: "Timed to mature ahead of key property contract signing dates.",
    explanation: "Foreign currency yield notes are structured on short durations matching property acquisition subgoals, ensuring full principal return without exit penalties."
  },
  sav_tbills: {
    badge: "State-Backed T-Bills",
    type: "yield",
    liquidity: "6-Month Fixed Maturity",
    exitPenalty: "Zero Exit Penalty at Maturity",
    subgoalAlignment: "Staggered to mature right before scheduled downpayment & tax due dates.",
    explanation: "Singapore Treasury Bills (T-Bills) carry the highest AAA state credit rating. By matching 6-month T-Bill issuance to your subgoal dates, you receive guaranteed 3.70% p.a. yields with zero secondary market exit risk."
  },
  sav_mmf: {
    badge: "Instant Money Market Fund",
    type: "yield",
    liquidity: "T+1 Instant Access",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Maintains yields near T-Bills while keeping cash 100% flexible for unexpected downpayment calls.",
    explanation: "Lion-OCBC Money Market Fund invests in ultra-short SG government securities. It offers 3.90% p.a. return with same-day or next-day liquid redemption and zero exit penalty."
  },
  sav_bcip_housing: {
    badge: "DCA Share Plan",
    type: "investment",
    liquidity: "Market Exchange Liquid",
    exitPenalty: "Zero Redemption Penalty",
    subgoalAlignment: "DCA accumulation for mid-term downpayment subgoals.",
    explanation: "Local blue chips & REITs accumulated via BCIP can be sold on SGX at market rate whenever downpayment capital is required, avoiding lock-in exit penalties."
  },
  sav_robo_growth: {
    badge: "Growth Investment Vault",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Compounds property capital over multi-year horizons with full withdrawal flexibility.",
    explanation: "Global growth portfolios carry no withdrawal lock-in clauses. You can transition funds into liquid savings as target property dates draw near."
  },
  sav_global_core: {
    badge: "Global Core Equities",
    type: "investment",
    liquidity: "Daily NAV Redemptions",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Grows long-term equity reserves for final mortgage payoff subgoals.",
    explanation: "Lion-OCBC Global Core Equities Fund allows daily redemptions without early exit fees."
  },
  sav_ocbc_boostshield: {
    badge: "Bonus+ Yield Saver",
    type: "deposit",
    liquidity: "Subgoal-Aligned Access",
    exitPenalty: "Zero Penalty on Milestone",
    subgoalAlignment: "Replaces standard savings with higher yield for milestone subgoals.",
    explanation: "Bonus+ Account earns up to 3.70% p.a. high interest without requiring salary credit, providing penalty-free withdrawals for your planned subgoals."
  },
  sav_ocbc_notes: {
    badge: "Structured Yield Note",
    type: "deposit",
    liquidity: "Short-Term Maturing",
    exitPenalty: "Zero Penalty at Term",
    subgoalAlignment: "Structured short tenure aligned with upcoming downpayment dates.",
    explanation: "Short-term yield notes lock in higher returns risk-free, with maturity scheduled prior to your subgoal payment deadline."
  },
  sav_sgs_bonds: {
    badge: "SG Savings Bonds (SSB)",
    type: "yield",
    liquidity: "Monthly Redemption Freedom",
    exitPenalty: "Zero Capital Loss / Penalty",
    subgoalAlignment: "Can be redeemed in any month with full accrued interest for subgoals.",
    explanation: "Singapore Savings Bonds offer step-up yields backed by the SG Government. You can redeem your capital in any month with zero exit penalty or capital loss."
  },

  // --- WEDDING FUND ---
  wed_ocbc360: {
    badge: "Daily Wedding Cash Vault",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Holds venue booking deposits ready for instant vendor payment.",
    explanation: "OCBC 360 Account keeps your wedding savings liquid while earning high base and bonus interest rates with zero withdrawal penalties."
  },
  wed_recurring: {
    badge: "Automated Goal Vault",
    type: "deposit",
    liquidity: "Instant Daily Access",
    exitPenalty: "Zero Lock-in Fee",
    subgoalAlignment: "Accumulates monthly savings directly towards banquet & catering milestone subgoals.",
    explanation: "Automated recurring transfers park money into high-yield liquid goal pockets that can be drawn down penalty-free on banquet due dates."
  },
  wed_tbills: {
    badge: "Risk-Free Wedding Yield",
    type: "yield",
    liquidity: "6-Month Maturing T-Bills",
    exitPenalty: "Zero Penalty at Maturity",
    subgoalAlignment: "Timed to mature 1 month before final banquet balance payment.",
    explanation: "T-Bills lock in 3.70% p.a. state-backed yields for idle wedding reserves with zero risk and zero exit penalty upon maturity."
  },
  wed_ocbc_boost: {
    badge: "Bonus Interest Wedding Vault",
    type: "deposit",
    liquidity: "Milestone Aligned",
    exitPenalty: "Zero Penalty on Milestone",
    subgoalAlignment: "High-yield saver for banquet downpayments.",
    explanation: "Bonus+ account maximizes yield on wedding funds while allowing penalty-free withdrawals on key vendor payment dates."
  },
  wed_giro: {
    badge: "Recurring PayNow Vault",
    type: "deposit",
    liquidity: "100% Flexible",
    exitPenalty: "Zero Exit Fee",
    subgoalAlignment: "Provides steady cashflow for progressive wedding expenses.",
    explanation: "Monthly scheduled transfers build liquid reserves that can be disbursed to wedding vendors without exit constraints."
  },
  wed_mmf: {
    badge: "Liquid Wedding Cash Fund",
    type: "yield",
    liquidity: "Instant Access (T+1)",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Keeps banquet reserves earning 3.90% p.a. until vendor invoices are issued.",
    explanation: "Money market funds allow fast redemption for wedding invoices while earning significantly more than basic checking accounts."
  },

  // --- CHILDREN'S EDUCATION ---
  edu_saver: {
    badge: "CDA Matched Savings Account",
    type: "deposit",
    liquidity: "Approved Provider Access",
    exitPenalty: "Zero Penalty for Education",
    subgoalAlignment: "Directly funds preschool, school, and healthcare milestone subgoals.",
    explanation: "OCBC Child Development Account (CDA) earns 2.0% p.a. interest plus dollar-for-dollar government matching with zero withdrawal fee at approved providers."
  },
  edu_srs: {
    badge: "SRS Education Growth",
    type: "deposit",
    liquidity: "Milestone Scheduled",
    exitPenalty: "Zero Reallocation Fee",
    subgoalAlignment: "Grows long-term tertiary education funds tax-efficiently.",
    explanation: "SRS contributions for education provide immediate tax savings while allowing penalty-free fund restructuring as your child grows."
  },
  edu_robo: {
    badge: "Balanced Education Fund",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Lock-in",
    subgoalAlignment: "Steadily compounds university tuition reserves over a 10-15 year timeline.",
    explanation: "RoboInvest education portfolios carry no lock-in contract fees. Assets can be shifted into liquid cash penalty-free before university admission."
  },
  edu_unit_trust: {
    badge: "Global Core Education Fund",
    type: "investment",
    liquidity: "Daily NAV Redemptions",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Generates capital growth for secondary school and diploma milestone fees.",
    explanation: "Global mutual funds offer daily liquidity so tuition fees can be paid on exact semester start dates without exit charges."
  },
  edu_saver_alt: {
    badge: "Promo CDA Saver",
    type: "deposit",
    liquidity: "Approved Provider Access",
    exitPenalty: "Zero Penalty",
    subgoalAlignment: "Higher promotional rate for early education subgoals.",
    explanation: "Promotional CDA account captures enhanced interest while keeping funds 100% available for authorized education disbursements."
  },
  edu_srs_alt: {
    badge: "SRS Global Equities",
    type: "investment",
    liquidity: "Daily Unit NAV Redemptions",
    exitPenalty: "Zero Redemption Fee",
    subgoalAlignment: "Maximizes long-term education wealth growth.",
    explanation: "Unit trust investments inside SRS carry zero exit penalties, ensuring full flexibility when liquidating for tuition milestones."
  },

  // --- CAREER BREAK ---
  car_ocbc360: {
    badge: "Transition Emergency Vault",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Provides immediate monthly cashflow during your career break.",
    explanation: "OCBC 360 Account provides complete instant access to living expense reserves during a career pause, with zero lock-in or early exit penalties."
  },
  car_bonus: {
    badge: "Transition High-Yield Saver",
    type: "deposit",
    liquidity: "Milestone Aligned",
    exitPenalty: "Zero Penalty on Break Start",
    subgoalAlignment: "Accumulates monthly buffer cash for upskilling and living expenses.",
    explanation: "Bonus+ Account yields 3.70% p.a. on your transition reserves. Withdrawals when beginning your career break incur zero penalty fees."
  },

  // --- PARENTS' RETIREMENT ---
  par_cpf_ra: {
    badge: "CPF Retirement Sum Top-Up",
    type: "deposit",
    liquidity: "Monthly Life Payouts",
    exitPenalty: "Zero Penalty (State Guaranteed)",
    subgoalAlignment: "Funds parents' lifelong monthly payouts starting at age 65.",
    explanation: "Top-ups to parents' CPF Retirement Account lock in guaranteed 4.0% p.a. returns backed by the SG Government, creating tax relief for you and lifelong monthly income for your parents."
  },

  // --- DEFAULT / GENERAL ---
  def_saver: {
    badge: "High-Yield Goal Vault",
    type: "deposit",
    liquidity: "100% Daily Liquid",
    exitPenalty: "Zero Exit Penalty",
    subgoalAlignment: "Holds reserve cash for short-term milestone subgoals.",
    explanation: "OCBC Bonus+ Account offers high interest with zero penalty fees on scheduled withdrawal dates."
  },
  def_recurring: {
    badge: "Recurring Goal Transfer",
    type: "deposit",
    liquidity: "100% Liquid",
    exitPenalty: "Zero Lock-in Fee",
    subgoalAlignment: "Builds milestone reserves steadily every month.",
    explanation: "Automated PayNow transfers build liquid reserves with total freedom to withdraw whenever milestone payments are due."
  },
  def_etfs: {
    badge: "Growth Equity Portfolio",
    type: "investment",
    liquidity: "Daily Liquid (T+2)",
    exitPenalty: "Zero Exit Lock-in",
    subgoalAlignment: "Compounds long-term wealth for multi-year subgoals.",
    explanation: "Automated RoboInvest portfolios carry zero early exit fees. Liquidate positions at market rate whenever cash is required for subgoals."
  },
  def_reits: {
    badge: "S-REIT Share Basket",
    type: "investment",
    liquidity: "Market Exchange Liquid",
    exitPenalty: "Zero Sale Penalty",
    subgoalAlignment: "Yield-generating equity basket for long-term growth subgoals.",
    explanation: "REIT shares traded on SGX offer full market liquidity with zero penalty fees when selling to fund target subgoals."
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
    subgoalAlignment: `Structured to align with your staggered subgoal payments, ensuring cash is accessible without penalty fees.`,
    explanation: `${action.name} provides competitive ${action.rate ? (action.rate * 100).toFixed(2) + '% p.a.' : 'returns'} while avoiding strict early withdrawal penalties or lock-in penalties on scheduled milestone dates.`
  };
};
