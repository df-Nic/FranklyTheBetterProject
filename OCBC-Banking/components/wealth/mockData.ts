// Mock data for the Wealth Progression feature
// All data is hardcoded for the frontend prototype

// ─── Tier Configuration ─────────────────────────────────────────────────────
export const TIER_CONFIG = [
  {
    id: 'basic',
    name: 'OCBC 360',
    minAUM: 0,
    maxAUM: 200000,
    color: '#6B7280',
    benefits: ['Basic banking services', 'Online banking', 'Debit card'],
  },
  {
    id: 'premier',
    name: 'Premier Banking',
    minAUM: 200000,
    maxAUM: 1000000,
    color: '#DA291C',
    benefits: ['Dedicated relationship manager', 'Priority queuing', 'Preferential FX rates', 'Exclusive investment products'],
  },
  {
    id: 'private',
    name: 'Premier Private Client',
    minAUM: 1000000,
    maxAUM: Infinity,
    color: '#0D1B3E',
    benefits: ['Private banking services', 'Family office solutions', 'Bespoke wealth management', 'Global market access'],
  },
];

export const CURRENT_AUM = 148000;   // Mock current AUM
export const CURRENT_TIER_ID = 'basic';
export const TARGET_TIER_ID = 'premier';

// ─── Risk Scenario Cards ─────────────────────────────────────────────────────
export const RISK_CARDS = [
  {
    id: 1,
    headline: 'New Business Investment',
    description: 'A new café opens near you. You invest SGD 5,000 in their first funding round knowing 3 in 5 such cafés close within two years.',
    riskSeekingAnswer: 'right', // swipe right = risk-seeking
    Basic: {
      headline: 'Cafe Investment',
      description: 'A new neighborhood cafe opens. You invest $5,000 in it, knowing that most new cafes close down within two years.',
    },
    Intermediate: {
      headline: 'New Business Investment',
      description: 'A local cafe is raising capital. You invest SGD 5,000 in their first funding round knowing 3 in 5 such cafés close within two years.',
    },
    Advanced: {
      headline: 'Early-Stage Café Venture',
      description: 'You allocate SGD 5,000 of early-stage venture capital in a local café startup, accepting high seed-stage default rates in search of equity alpha.',
    },
  },
  {
    id: 2,
    headline: 'Market Downturn',
    description: 'Your fund dropped 15% this month due to global news. You hold and wait rather than cutting your losses.',
    riskSeekingAnswer: 'right',
    Basic: {
      headline: 'Market Dropping',
      description: 'Your investment account falls 15% in value this month due to bad news. You choose to wait it out instead of selling at a loss.',
    },
    Intermediate: {
      headline: 'Market Downturn',
      description: 'Your fund dropped 15% this month due to global news. You hold and wait rather than cutting your losses.',
    },
    Advanced: {
      headline: 'Equity Market Drawdown',
      description: 'Your equity-heavy fund experiences a 15% mark-to-market drawdown this month. You maintain your strategic allocation rather than crystallizing losses.',
    },
  },
  {
    id: 3,
    headline: 'Locked Savings',
    description: 'You lock away SGD 10,000 for 5 years at a guaranteed 3% p.a. with no early withdrawal option.',
    riskSeekingAnswer: 'left', // swipe left = risk-seeking (prefers guaranteed)
    Basic: {
      headline: 'Locked Account',
      description: 'You put $10,000 into a locked savings account for 5 years at a guaranteed 3% interest, knowing you cannot touch it early.',
    },
    Intermediate: {
      headline: 'Locked Savings',
      description: 'You lock away SGD 10,000 for 5 years at a guaranteed 3% p.a. with no early withdrawal option.',
    },
    Advanced: {
      headline: 'Illiquid Fixed Income',
      description: 'You allocate SGD 10,000 to an illiquid 5-year fixed debt instrument yielding 3.0% p.a., sacrificing asset liquidity for principal protection.',
    },
  },
  {
    id: 4,
    headline: 'Index Fund Bet',
    description: 'An index fund has returned 8% annually for 10 years. You put in half your savings.',
    riskSeekingAnswer: 'right',
    Basic: {
      headline: 'Safe Stock Fund',
      description: 'A stock market fund has earned 8% a year for the last 10 years. You put half of your total savings into it.',
    },
    Intermediate: {
      headline: 'Index Fund Bet',
      description: 'An index fund has returned 8% annually for 10 years. You put in half your savings.',
    },
    Advanced: {
      headline: 'Equity Index Allocation',
      description: 'A broad-market equity index ETF demonstrates historical returns of 8% CAGR over 10 years. You allocate 50% of your current liquid assets to it.',
    },
  },
  {
    id: 5,
    headline: 'Tech Stock Double',
    description: 'A tech stock you own doubles in a week. You sell half to lock in gains.',
    riskSeekingAnswer: 'left',
    Basic: {
      headline: 'Tech Stock Rise',
      description: 'A technology stock you bought doubles in value in just one week. You immediately sell half to secure your profit.',
    },
    Intermediate: {
      headline: 'Tech Stock Double',
      description: 'A tech stock you own doubles in a week. You sell half to lock in gains.',
    },
    Advanced: {
      headline: 'High-Beta Equity Harvest',
      description: 'A technology position in your portfolio rises 100% in a week. You harvest 50% of the position to secure capital gains and rebalance.',
    },
  },
  {
    id: 6,
    headline: 'Flat Portfolio',
    description: 'Your portfolio is flat for 18 months with no growth. You stay invested and do not move funds.',
    riskSeekingAnswer: 'right',
    Basic: {
      headline: 'No Account Growth',
      description: 'Your investments do not gain any value for 18 months. You leave your money exactly where it is and wait.',
    },
    Intermediate: {
      headline: 'Flat Portfolio',
      description: 'Your portfolio is flat for 18 months with no growth. You stay invested and do not move funds.',
    },
    Advanced: {
      headline: 'Sideways Market Patience',
      description: 'Your portfolio experiences a sideways consolidation phase with zero net growth for 18 months. You remain fully allocated to your long-term strategy.',
    },
  },
  {
    id: 7,
    headline: 'Crypto Opportunity',
    description: 'A colleague made 40% on crypto last year. You allocate 10% of your savings to try it.',
    riskSeekingAnswer: 'right',
    Basic: {
      headline: 'Crypto Investment',
      description: 'A coworker made 40% profit on cryptocurrency last year. You put 10% of your savings into it to try and get the same results.',
    },
    Intermediate: {
      headline: 'Crypto Opportunity',
      description: 'A colleague made 40% on crypto last year. You allocate 10% of your savings to try it.',
    },
    Advanced: {
      headline: 'Speculative Asset Allocation',
      description: 'A colleague reports a 40% return on digital assets. You allocate a 10% satellite position to highly volatile cryptocurrencies.',
    },
  },
  {
    id: 8,
    headline: 'Guaranteed vs Uncertain',
    description: 'You choose a lower but guaranteed return over a higher but uncertain one.',
    riskSeekingAnswer: 'left',
    Basic: {
      headline: 'Guaranteed Returns',
      description: 'You prefer a smaller, guaranteed investment return over a much larger but risky return.',
    },
    Intermediate: {
      headline: 'Guaranteed vs Uncertain',
      description: 'You choose a lower but guaranteed return over a higher but uncertain one.',
    },
    Advanced: {
      headline: 'Risk Premium Trade-Off',
      description: 'You prioritize risk-free yields over equity risk premiums, choosing asset safety over high-beta upside.',
    },
  },
];

// ─── Wealth Products ─────────────────────────────────────────────────────────
export const WEALTH_PRODUCTS = [
  {
    id: 'unit-trust',
    name: 'Unit Trust',
    description: 'Professionally managed fund across stocks, bonds, or both.',
    tierBoost: 'Counts toward your AUM — accelerate your path to Premier.',
    icon: 'pie-chart',
    expectedReturn: '6–10% p.a.',
    risk: 'Medium–High',
    minInvestment: 1000,
  },
  {
    id: 'blue-chip',
    name: 'Blue Chip Investment Plan',
    description: 'Invest a fixed amount monthly into Singapore\'s top companies.',
    tierBoost: 'Regular contributions build your AUM steadily.',
    icon: 'trending-up',
    expectedReturn: '5–8% p.a.',
    risk: 'Medium',
    minInvestment: 100,
  },
  {
    id: 'roboinvest',
    name: 'RoboInvest',
    description: 'Hands-off themed portfolio managed by an algorithm from SGD 100.',
    tierBoost: 'Low barrier to start growing your tier AUM.',
    icon: 'cpu',
    expectedReturn: '4–7% p.a.',
    risk: 'Low–Medium',
    minInvestment: 100,
  },
  {
    id: 'precious-metals',
    name: 'Precious Metals',
    description: 'Buy gold or silver as a hedge against inflation.',
    tierBoost: 'Diversify your AUM with tangible assets.',
    icon: 'award',
    expectedReturn: '3–5% p.a.',
    risk: 'Low–Medium',
    minInvestment: 500,
  },
  {
    id: 'sgs',
    name: 'Singapore Government Securities',
    description: 'Government-backed bonds, near risk-free, with fixed returns.',
    tierBoost: 'Safe AUM growth with guaranteed returns.',
    icon: 'shield',
    expectedReturn: '3–4% p.a.',
    risk: 'Very Low',
    minInvestment: 500,
  },
  {
    id: 'structured-deposits',
    name: 'Structured Deposits',
    description: 'Capital-protected deposit with returns tied to market performance.',
    tierBoost: 'Protect your capital while building AUM.',
    icon: 'lock',
    expectedReturn: '2–5% p.a.',
    risk: 'Low',
    minInvestment: 5000,
  },
  {
    id: 'e-securities',
    name: 'Electronic Securities',
    description: 'Digital bonds and notes issued by corporates and government entities.',
    tierBoost: 'Fixed income to steadily grow your AUM.',
    icon: 'file-text',
    expectedReturn: '3–5% p.a.',
    risk: 'Low',
    minInvestment: 1000,
  },
];

// ─── Select For Me — Mock result based on risk profile ───────────────────────
export const SELECT_FOR_ME: Record<string, string> = {
  Conservative: 'sgs',
  Balanced: 'unit-trust',
  Growth: 'unit-trust',
};

export const SELECT_FOR_ME_REASON: Record<string, string> = {
  Conservative: 'Based on your preference for stability, Singapore Government Securities offer safe, guaranteed returns that steadily build your Premier tier AUM.',
  Balanced: 'Based on your balanced risk profile and investment timeline, a Unit Trust offers the right mix of growth and diversification to reach Premier Banking.',
  Growth: 'Your growth-oriented profile and strong income make Unit Trusts the best fit — higher returns mean you\'ll reach Premier Banking faster.',
};

// ─── Fund Cards per Risk Profile ─────────────────────────────────────────────
export const MOCK_FUNDS: Record<string, Array<{name: string; assetClass: string; reason: string; ytd: string}>> = {
  Conservative: [
    {
      name: 'Nikko AM Shenton Short Term Bond Fund',
      assetClass: 'Short Duration Bond',
      reason: 'Low volatility with stable returns — ideal for capital preservation.',
      ytd: '+3.2%',
    },
    {
      name: 'LionGlobal SGD Enhanced Liquidity Fund',
      assetClass: 'Money Market',
      reason: 'Near-cash liquidity with better returns than a savings account.',
      ytd: '+2.8%',
    },
    {
      name: 'Fullerton SGD Bond Fund',
      assetClass: 'Singapore Bond',
      reason: 'Invests in high-quality Singapore bonds with steady income.',
      ytd: '+3.5%',
    },
  ],
  Balanced: [
    {
      name: 'Nikko AM Shenton Global Opportunities Fund',
      assetClass: 'Global Equity',
      reason: 'Diversified global equity exposure with professional management.',
      ytd: '+7.4%',
    },
    {
      name: 'LionGlobal All Seasons Fund',
      assetClass: 'Multi-Asset',
      reason: 'Balanced across stocks and bonds to smooth out market swings.',
      ytd: '+5.9%',
    },
    {
      name: 'Fullerton Asian Bonds & Currencies Fund',
      assetClass: 'Asian Fixed Income',
      reason: 'Captures Asian growth through bonds with moderate risk.',
      ytd: '+4.6%',
    },
  ],
  Growth: [
    {
      name: 'Nikko AM Asia Ex-Japan Equity Fund',
      assetClass: 'Asia Equity',
      reason: 'High-growth potential across Asia-Pacific markets.',
      ytd: '+12.1%',
    },
    {
      name: 'LionGlobal Technology & Innovation Fund',
      assetClass: 'Technology Equity',
      reason: 'Concentrated in tech leaders driving next-decade growth.',
      ytd: '+15.3%',
    },
    {
      name: 'Fullerton Global Equity Fund',
      assetClass: 'Global Equity',
      reason: 'Actively managed global portfolio targeting above-market returns.',
      ytd: '+10.8%',
    },
  ],
};

// ─── AI Assistant Mock Replies ────────────────────────────────────────────────
export const MOCK_AI_REPLIES: Array<{keywords: string[]; reply: string}> = [
  {
    keywords: ['premier', 'tier', 'upgrade', 'unlock'],
    reply: 'Premier Banking is unlocked at SGD 200,000 in total AUM. You\'re currently at SGD 148,000 — just SGD 52,000 away! Regular monthly investments are the fastest path.',
  },
  {
    keywords: ['risk', 'safe', 'conservative', 'volatile'],
    reply: 'Your risk profile suggests you prefer stability. I\'d focus on capital-protected products like SGS bonds or structured deposits while still growing your AUM.',
  },
  {
    keywords: ['unit trust', 'fund', 'returns', 'performance'],
    reply: 'Unit Trusts are professionally managed funds. Historical returns vary, but Singapore-focused funds have averaged 5–8% p.a. over 10 years. Past performance doesn\'t guarantee future results.',
  },
  {
    keywords: ['invest', 'start', 'begin', 'how much'],
    reply: 'You can start from as little as SGD 100 with RoboInvest, or SGD 1,000 for most Unit Trusts. Starting small is better than not starting at all!',
  },
  {
    keywords: ['time', 'years', 'how long', 'when'],
    reply: 'Based on your target investment amount and the expected returns, you could reach Premier Banking tier in approximately 2–3 years with consistent monthly contributions.',
  },
  {
    keywords: ['benefit', 'perk', 'advantage', 'premier banking'],
    reply: 'Premier Banking gives you a dedicated relationship manager, priority service, preferential foreign exchange rates, and exclusive access to structured products not available to standard customers.',
  },
];

export const DEFAULT_AI_REPLY = 'That\'s a great question! As your wealth grows, you get closer to Premier Banking. I\'d recommend speaking with a licensed financial advisor for personalised advice. Is there anything specific about the products or your tier progress I can help clarify?';

// ─── Growth Rate by Risk Profile ──────────────────────────────────────────────
export const GROWTH_RATE: Record<string, number> = {
  Conservative: 0.04,
  Balanced: 0.06,
  Growth: 0.08,
};

// ─── Amount midpoints by invest range ────────────────────────────────────────
export const AMOUNT_MIDPOINT: Record<string, number> = {
  'SGD 1–5k': 3000,
  'SGD 5–20k': 10000,
  'SGD 20–50k': 35000,
  'SGD 50k+': 75000,
};

// ─── Dynamic Product Selection & Rationale ──────────────────────────────────
export function getRankingExplanation(productId: string, riskProfile: 'Conservative' | 'Balanced' | 'Growth'): string {
  const mapping: Record<string, Record<string, string>> = {
    'unit-trust': {
      Conservative: 'Higher risk than your profile — shown here for diversification and capital appreciation.',
      Balanced: 'Ranked #3: Matches your profile with balanced equity and bond exposure.',
      Growth: 'Ranked #1: Excellent match for your growth profile to maximize long-term equity returns.',
    },
    'blue-chip': {
      Conservative: 'Higher risk than your profile, but offers stable dividends from top Singapore companies.',
      Balanced: 'Ranked #2: Steady monthly contributions align with your balanced accumulation goals.',
      Growth: 'Ranked #2: Helps build core equity exposure in blue-chip Singapore corporates.',
    },
    'roboinvest': {
      Conservative: 'Low-Medium risk. A solid option for automated, low-cost theme diversification.',
      Balanced: 'Ranked #1: Matches your profile with automated risk-balancing and theme selection.',
      Growth: 'Ranked #3: Moderate risk with automated themed portfolios for satellite growth.',
    },
    'precious-metals': {
      Conservative: 'A stable choice to diversify your capital and hedge against inflation.',
      Balanced: 'Good for diversification, though growth potential is lower than your balanced target.',
      Growth: 'Lower growth potential than your profile, but acts as a solid hedge during high volatility.',
    },
    'sgs': {
      Conservative: 'Ranked #1: Near risk-free Singapore Government backing matches your safety priority.',
      Balanced: 'Lower yield than your profile target, but provides a risk-free foundation for your assets.',
      Growth: 'Lower risk and yield than your growth profile — shown for defensive capital allocation.',
    },
    'structured-deposits': {
      Conservative: 'Ranked #2: Capital-protected structure offering stable returns with index upside.',
      Balanced: 'Protects principal capital while offering equity-linked growth potential.',
      Growth: 'Very conservative choice, but useful if you want to protect your principal capital.',
    },
    'e-securities': {
      Conservative: 'Ranked #3: Fixed income payments offer stable and predictable capital growth.',
      Balanced: 'Provides steady yield, helping buffer equity volatility in your portfolio.',
      Growth: 'Provides steady yield, but with lower capital appreciation than your growth profile.',
    },
  };
  return mapping[productId]?.[riskProfile] ?? 'Selected based on your preferences.';
}

export function getTopPicks(riskProfile: 'Conservative' | 'Balanced' | 'Growth'): string[] {
  if (riskProfile === 'Conservative') {
    return ['sgs', 'structured-deposits', 'e-securities'];
  } else if (riskProfile === 'Growth') {
    return ['unit-trust', 'blue-chip', 'roboinvest'];
  } else {
    return ['roboinvest', 'blue-chip', 'unit-trust'];
  }
}
