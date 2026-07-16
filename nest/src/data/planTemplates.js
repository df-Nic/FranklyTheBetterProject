// Goal-specific plans and dynamic recommendations data config using OCBC and Great Eastern wealth products
export const PLANS_DATA = {
  retirement: {
    id: "retirement",
    title: "OCBC Retirement Strategy",
    goal: "Build a SG$1,500,000 retirement nest egg by 2045 for a worry-free lifestyle",
    timelineAll: "Oct 2045 - Dec 2047",
    timelineExcluded: (numExcluded) => {
      if (numExcluded === 0) return "Oct 2045 - Dec 2047";
      if (numExcluded <= 2) return "Jun 2048 - Sep 2050";
      return "Aug 2051 - Dec 2054";
    },
    categories: [
      {
        id: "cpf_pension",
        name: "CPF & Pension Planning",
        icon: "Coins",
        actions: [
          { id: "ret_cpf_sa", name: "CPF SA Cash Top-up", desc: "Top up SG$8,000 directly to your CPF Special Account to earn 4.0% p.a. guaranteed yield and receive tax relief.", baseVal: 8000, rate: 0.04, type: "deposit" },
          { id: "ret_srs", name: "OCBC SRS Contribution", desc: "Contribute SG$15,000 annually into your Supplementary Retirement Scheme account to lower taxable income.", baseVal: 15000, rate: 0.03, type: "deposit" }
        ]
      },
      {
        id: "investments",
        name: "OCBC Strategic Growth",
        icon: "TrendingUp",
        actions: [
          { id: "ret_global_etf", name: "OCBC RoboInvest (Aggressive)", desc: "Automate SG$1,000/mo investments into equity portfolios yielding global market gains compounded at 7.2% p.a.", baseVal: 12000, rate: 0.072, type: "investment" },
          { id: "ret_blue_chip", name: "OCBC BCIP Dividend Plan", desc: "Allocate SG$400/mo into local blue chips and REITs via OCBC Blue Chip Investment Plan for a 5.5% annual dividend.", baseVal: 4800, rate: 0.055, type: "investment" }
        ]
      },
      {
        id: "insurance",
        name: "Great Eastern Protection",
        icon: "ShieldCheck",
        actions: [
          { id: "ret_annuity", name: "GE Great Lifetime Payout", desc: "Commit SG$500/mo to a guaranteed cash income insurance plan returning 4.5% p.a. from age 65.", baseVal: 6000, rate: 0.045, type: "defense" },
          { id: "ret_careshield", name: "GE GREAT CareShield Enhance", desc: "Enhance long-term disability payouts using CPF Medisave funds to prevent savings erosion.", baseVal: 1200, rate: 0.02, type: "defense" }
        ]
      }
    ]
  },
  savings: {
    id: "savings",
    title: "OCBC Savings & HDB Goal",
    goal: "Save SG$150,000 for a downpayment on a HDB flat in Singapore by 2028",
    timelineAll: "Mar 2028 - Jun 2029",
    timelineExcluded: (numExcluded, grantsExcluded) => {
      if (grantsExcluded) return "Oct 2031 - Dec 2033";
      if (numExcluded === 0) return "Mar 2028 - Jun 2029";
      if (numExcluded <= 2) return "Nov 2029 - Feb 2031";
      return "Jan 2031 - Sep 2032";
    },
    categories: [
      {
        id: "hy_deposits",
        name: "OCBC Savings Vaults",
        icon: "Coins",
        actions: [
          { id: "sav_ocbc360", name: "OCBC 360 Savings Account", desc: "Credit your salary and save SG$500/mo to hit up to 4.65% p.a. interest rate on your active deposits.", baseVal: 6000, rate: 0.0465, type: "deposit" },
          { id: "sav_fd_promo", name: "OCBC Fixed Deposit Sweep", desc: "Lock SG$20,000 idle cash in a promotional 6-month OCBC Fixed Deposit yielding 3.40% p.a. risk-free.", baseVal: 20000, rate: 0.034, type: "deposit", isLumpSum: true }
        ]
      },
      {
        id: "govt_grants",
        name: "Housing Subsidies & Loans",
        icon: "Gift",
        actions: [
          { id: "sav_cpf_grant", name: "Enhanced CPF Housing Grant", desc: "Claim up to SG$80,000 in government housing subsidies based on household income guidelines.", baseVal: 80000, rate: 0.0, type: "grant", isLumpSum: true },
          { id: "sav_hdb_loan", name: "HDB Concessionary Loan Setup", desc: "Keep SG$20,000 in your Ordinary Account to qualify for HDB's 2.6% p.a. stable interest rate loan.", baseVal: 2000, rate: 0.026, type: "grant" }
        ]
      },
      {
        id: "short_term_yield",
        name: "OCBC Liquid Instruments",
        icon: "TrendingUp",
        actions: [
          { id: "sav_tbills", name: "SG Treasury Bills (T-Bills)", desc: "Buy 6-month risk-free Singapore Government Securities to capture a state-backed 3.70% p.a. yield.", baseVal: 10000, rate: 0.037, type: "yield" },
          { id: "sav_mmf", name: "Lion-OCBC Money Market Fund", desc: "Allocate SG$5,000 to low-risk liquidity funds for a flexible 3.90% p.a. return with instant liquidity.", baseVal: 5000, rate: 0.039, type: "yield" }
        ]
      }
    ]
  },
  emergency: {
    id: "emergency",
    title: "OCBC Emergency Safety Net",
    goal: "Build a SG$30,000 emergency liquid safety net within 6 months to cover expenses",
    timelineAll: "Sep 2026 - Dec 2026",
    timelineExcluded: (numExcluded) => {
      if (numExcluded === 0) return "Sep 2026 - Dec 2026";
      if (numExcluded <= 2) return "Jan 2027 - Apr 2027";
      return "Jun 2027 - Sep 2027";
    },
    categories: [
      {
        id: "liquid_acc",
        name: "OCBC Liquid Accounts",
        icon: "Coins",
        actions: [
          { id: "em_saver", name: "OCBC Smart Saver Savings", desc: "Store your core emergency fund in a high-yield liquid account paying 4.20% p.a. on deposits.", baseVal: 5000, rate: 0.042, type: "deposit" },
          { id: "em_sweep", name: "Monthly Balance Sweep", desc: "Automatically sweep end-of-month cash balances exceeding SG$3,000 into active yield accounts.", baseVal: 3000, rate: 0.035, type: "deposit" }
        ]
      },
      {
        id: "budget_opt",
        name: "Spending Adjustments",
        icon: "Scissors",
        actions: [
          { id: "em_sub", name: "Subscription Cleanup", desc: "Connect credit cards to let AI auto-cancel 4 unused/redundant subscription accounts, saving SG$65/mo.", baseVal: 780, rate: 0.0, type: "saving" },
          { id: "em_dine", name: "Dining Out Savings Cap", desc: "Restrict food delivery app orders to save SG$200/mo and direct the savings to your safety net.", baseVal: 2400, rate: 0.0, type: "saving" }
        ]
      },
      {
        id: "protection",
        name: "GE Financial Security",
        icon: "ShieldAlert",
        actions: [
          { id: "em_shield", name: "GE SupremeHealth Upgrade", desc: "Upgrade your Medisave-funded health plan to cover 95% of private ward hospital costs and prevent cash drain.", baseVal: 1000, rate: 0.02, type: "saving" }
        ]
      }
    ]
  },
  default: {
    id: "default",
    title: "OCBC Custom Wealth Plan",
    goal: "Optimize cash flow and build a diversified SG$100,000 investment portfolio over 5 years",
    timelineAll: "Jan 2030 - Apr 2031",
    timelineExcluded: (numExcluded) => {
      if (numExcluded === 0) return "Jan 2030 - Apr 2031";
      if (numExcluded <= 2) return "Nov 2031 - Feb 2033";
      return "Oct 2033 - Dec 2035";
    },
    categories: [
      {
        id: "deposits",
        name: "Deposits Optimization",
        icon: "Coins",
        actions: [
          { id: "def_saver", name: "OCBC Smart Saver Deposit", desc: "Allocate SG$10,000 idle cash to the Smart Saver account to earn a 4.20% p.a. multiplier rate.", baseVal: 10000, rate: 0.042, type: "deposit" },
          { id: "def_recurring", name: "Monthly Auto-Savings Flow", desc: "Configure an automatic recurring PayNow transfer of SG$500/mo directly to your savings vault.", baseVal: 6000, rate: 0.038, type: "deposit" }
        ]
      },
      {
        id: "investments",
        name: "OCBC Asset Allocation",
        icon: "TrendingUp",
        actions: [
          { id: "def_etfs", name: "OCBC RoboInvest Balanced", desc: "Invest SG$400/mo in low-cost index funds to target an average historical stock return of 7.00% p.a.", baseVal: 4800, rate: 0.07, type: "investment" },
          { id: "def_reits", name: "OCBC BCIP Lion S-REIT ETF", desc: "Allocate SG$200/mo in SGX REITs for a steady, inflation-hedged 5.80% p.a. dividend flow.", baseVal: 2400, rate: 0.058, type: "investment" }
        ]
      },
      {
        id: "loans",
        name: "OCBC Debt & Loans",
        icon: "Percent",
        actions: [
          { id: "def_refinance", name: "OCBC EasiCredit Debt Refi", desc: "Consolidate card debt at 26% p.a. interest into a low-interest personal installment loan at 3.40% p.a.", baseVal: 3000, rate: 0.226, type: "loan" },
          { id: "def_mortgage", name: "OCBC Eco-Green Home Loan Check", desc: "Schedule a loan review to switch from floating SORA rates to stable fixed-rate mortgage layers.", baseVal: 1200, rate: 0.015, type: "loan" }
        ]
      }
    ]
  }
};

// Alternatives registry mapping for AI replanning to maintain progress goals
export const PLAN_ALTERNATIVES = {
  // Retirement alternatives
  ret_cpf_sa: { id: "ret_srs_ocbc", name: "OCBC Lion-OCBC SRS Unit Trust", desc: "Top up your SRS account and allocate funds to the Lion-OCBC Global Core Fund to earn an estimated 6.5% p.a.", baseVal: 8000, rate: 0.065, type: "deposit" },
  ret_srs: { id: "ret_great_lifetime", name: "GE Great Lifetime Payout", desc: "Start a Great Eastern Wealth Accumulator plan returning a guaranteed 3.5% p.a. + non-guaranteed bonuses.", baseVal: 15000, rate: 0.045, type: "deposit" },
  ret_global_etf: { id: "ret_ocbc_robo", name: "OCBC RoboInvest (Balanced Portfolio)", desc: "Deploy SG$1,000 monthly into OCBC RoboInvest global portfolios targeting diversified equity returns at 7.0% p.a.", baseVal: 12000, rate: 0.07, type: "investment" },
  ret_blue_chip: { id: "ret_ocbc_bcip", name: "OCBC BCIP Lion-Phillip S-REIT", desc: "Build regular shares in SG banks & REITs via OCBC BCIP starting at SG$400/mo to capture a 5.5% dividend yield.", baseVal: 4800, rate: 0.055, type: "investment" },
  ret_annuity: { id: "ret_ge_prestige", name: "GE Great Prestige Life Plan", desc: "Secure a single-premium Great Eastern lifetime income plan returning 4.2% p.a. from age 65.", baseVal: 6000, rate: 0.042, type: "defense" },
  ret_careshield: { id: "ret_ge_careshield", name: "GE Great CareShield Enhance Plus", desc: "Leverage Great Eastern CareShield supplement to boost monthly disability layouts by SG$1,500 using Medisave.", baseVal: 1200, rate: 0.02, type: "defense" },

  // Savings alternatives
  sav_ocbc360: { id: "sav_ocbc_boostshield", name: "OCBC Bonus+ Savings Yield", desc: "Save SG$500/mo into the OCBC Bonus+ Account to capture a high interest rate of up to 3.70% p.a. with zero withdrawals.", baseVal: 6000, rate: 0.037, type: "deposit" },
  sav_fd_promo: { id: "sav_ocbc_notes", name: "OCBC Structured Note Sweep", desc: "Lock SG$20,000 idle cash in a promotional OCBC short-term Structured Note yielding 3.65% p.a.", baseVal: 20000, rate: 0.0365, type: "deposit", isLumpSum: true },
  sav_cpf_grant: { id: "sav_hdb_resale_grant", name: "Proximity Housing Grant (PHG)", desc: "Claim SG$20,000 in Proximity Housing Grants by purchasing a resale HDB within 4km of parents.", baseVal: 20000, rate: 0.0, type: "grant", isLumpSum: true },
  sav_hdb_loan: { id: "sav_ocbc_home_loan", name: "OCBC HDB Home Loan Package", desc: "Finance via an OCBC HDB Home Loan pegged to 3M SORA to secure stable, competitive interest caps.", baseVal: 2000, rate: 0.026, type: "grant" },
  sav_tbills: { id: "sav_ocbc_money_max", name: "Lion-OCBC Enhanced Liquidity Fund", desc: "Deploy SG$10,000 cash in the Lion-OCBC liquidity fund capturing a flexible yield of 3.85% p.a.", baseVal: 10000, rate: 0.0385, type: "yield" },
  sav_mmf: { id: "sav_sgs_bonds", name: "Singapore Savings Bonds (SSB)", desc: "Allocate SG$5,000 to long-term SG Government Savings Bonds yielding a risk-free 3.20% p.a. step-up return.", baseVal: 5000, rate: 0.032, type: "yield" },

  // Emergency alternatives
  em_saver: { id: "em_ocbc_360_pocket", name: "OCBC 360 Save Pocket Account", desc: "Credit SG$3,000 to hit high interest multipliers on a separate pocket in your OCBC Digital app.", baseVal: 5000, rate: 0.042, type: "deposit" },
  em_sweep: { id: "em_ocbc_sweep", name: "OCBC Auto-Save Sweep Plan", desc: "Sweep excess savings automatically into low-risk OCBC money market funds yielding 3.75% p.a.", baseVal: 3000, rate: 0.0375, type: "deposit" },
  em_sub: { id: "em_ocbc_card_rebates", name: "OCBC 365 Card Spend Optimization", desc: "Direct utilities and card payments to OCBC 365 Card to earn 5% cash rebate, saving SG$80/mo.", baseVal: 960, rate: 0.0, type: "saving" },
  em_dine: { id: "em_ocbc_lifestyle_cap", name: "OCBC Spend Fit Tracker", desc: "Set dining/lifestyle spending limits in the OCBC Digital app to save SG$150/mo.", baseVal: 1800, rate: 0.0, type: "saving" },
  em_shield: { id: "em_ge_supreme_ecare", name: "GE SupremeHealth H1 Rider Plan", desc: "Add Great Eastern SupremeHealth Rider to cover hospital co-payment caps using CPF Medisave.", baseVal: 1000, rate: 0.02, type: "saving" },

  // Default alternatives
  def_saver: { id: "def_ocbc_bonus", name: "OCBC Bonus+ Savings Yield", desc: "Store SG$10,000 cash in the OCBC Bonus+ saver to gain up to 3.75% p.a. without withdrawals.", baseVal: 10000, rate: 0.0375, type: "deposit" },
  def_recurring: { id: "def_ocbc_giro", name: "OCBC GIRO Auto-Invest Flow", desc: "Configure an automatic monthly GIRO regular invest flow of SG$500 to OCBC Blue Chip Plan.", baseVal: 6000, rate: 0.04, type: "deposit" },
  def_etfs: { id: "def_ocbc_robo_growth", name: "OCBC RoboInvest Growth Portfolio", desc: "Invest SG$400/mo in OCBC RoboInvest's aggressive growth portfolios yielding 6.80% p.a.", baseVal: 4800, rate: 0.068, type: "investment" },
  def_reits: { id: "def_ocbc_bcip_reits", name: "OCBC BCIP Lion-Phillip REIT", desc: "Invest SG$200/mo in local REIT indices via OCBC BCIP to capture high SGD yields.", baseVal: 2400, rate: 0.058, type: "investment" },
  def_refinance: { id: "def_ocbc_easicredit", name: "OCBC EasiCredit Debt Transfer", desc: "Consolidate debt into an OCBC EasiCredit balance transfer at 0% interest for 12 months.", baseVal: 3000, rate: 0.226, type: "loan" },
  def_mortgage: { id: "def_ocbc_refi", name: "OCBC Fixed eco-Green Refinance", desc: "Refinance mortgage with OCBC Eco-Green Home Loans to lock in stable promotional rates.", baseVal: 1200, rate: 0.015, type: "loan" }
};
