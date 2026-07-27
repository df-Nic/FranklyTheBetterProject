// OCBC Credit Cards dataset & Recommendation Engine

export const OCBC_CARDS = [
  {
    id: 'ocbc-365',
    name: 'OCBC 365 Credit Card',
    tagline: 'Everyday Cashback for Living & Household Spending',
    category: 'Cashback',
    bgGradient: 'from-[#1A1C20] via-[#2A2D34] to-[#121316]',
    cardColor: '#D32F2F', // OCBC Red accent
    textColor: 'text-white',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    chipColor: '#E2B13C',
    network: 'VISA',
    headlineRate: 'Up to 6% Cashback',
    subText: 'S$1,200 max cashback per year',
    primaryBenefit: '6% on Dining & Food Delivery, 3% on Groceries, Utilities & Petrol',
    minSpend: 'S$800/month',
    annualFeeWaiver: '2 Years Fee Waiver',
    privileges: [
      '6% cashback on all local & overseas dining + food delivery (GrabFood, Foodpanda)',
      '3% cashback on land transport (SimplyGo MRT/bus, Grab, Gojek, petrol)',
      '3% cashback on online groceries (NTUC FairPrice, Cold Storage, RedMart)',
      '3% cashback on recurring telco and utility bills (Singtel, StarHub, M1, SP Group)',
      'Complimentary travel personal accident insurance up to S$500,000'
    ],
    rewardsType: 'cashback',
    baseEstAnnualValue: 840, // S$840/yr cashback average
    planMatches: {
      housing: {
        score: 96,
        timeSavedMonths: 3,
        extraContributions: 'S$840/yr',
        headline: 'Accelerate Downpayment by 3 Months via Household Bill Cashback',
        reasons: [
          'Redirect monthly dining and grocery savings straight into your HDB downpayment fund.',
          'Earn 3% cashback on recurring utility & telco bills while accumulating BTO savings.',
          'Automatically credits up to S$80 cashback monthly directly into your OCBC 360 savings account.'
        ]
      },
      retirement: {
        score: 92,
        timeSavedMonths: 5,
        extraContributions: 'S$960/yr',
        headline: 'Boost SRS/CPF Top-Ups with Guaranteed Living Cashback',
        reasons: [
          'Compound S$960 in annual cashback over your 20-year horizon for an extra S$28,000+ nest egg.',
          'Pairs seamlessly with OCBC 360 Account for bonus interest categories.',
          'Consolidates all everyday groceries & dining into maximum cash return.'
        ]
      },
      emergency: {
        score: 95,
        timeSavedMonths: 2,
        extraContributions: 'S$720/yr',
        headline: 'Automate Emergency Fund Building via Daily Expenditure',
        reasons: [
          'Every dollar spent on meals and groceries generates liquid cash reserves.',
          'Protects emergency buffer from inflation through steady 3%–6% cashback yield.'
        ]
      },
      default: {
        score: 90,
        timeSavedMonths: 3,
        extraContributions: 'S$800/yr',
        headline: 'All-Round Daily Living Cashback Champion',
        reasons: [
          'Maximized returns on dining, delivery, groceries, and public transport.',
          'Simple spend tiering designed for consistent monthly contribution growth.'
        ]
      }
    }
  },
  {
    id: 'ocbc-frank',
    name: 'OCBC FRANK Credit Card',
    tagline: '8% Cashback on Online Spend, Mobile Contactless & Eco-Merchants',
    category: 'Digital & Lifestyle',
    bgGradient: 'from-[#0D1B2A] via-[#1B263B] to-[#415A77]',
    cardColor: '#00B4D8', // Electric Cyan
    textColor: 'text-white',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    chipColor: '#E2B13C',
    network: 'VISA',
    headlineRate: 'Up to 8% Cashback',
    subText: 'S$100 cashback cap monthly',
    primaryBenefit: '8% on Apple Pay, Google Pay, Shopee, Lazada, Foreign FX & Eco Merchants',
    minSpend: 'S$800/month',
    annualFeeWaiver: '2 Years Fee Waiver',
    privileges: [
      '8% cashback on foreign currency transactions (Online & Overseas)',
      '8% cashback on Apple Pay, Google Pay & Samsung Pay mobile contactless spend',
      '8% cashback on Eco-certified green merchants & public transit',
      'Choose from 60+ customizable card face designs or eco-friendly bio-sourced card',
      'Exclusive dining and tech gadget discounts at partner stores'
    ],
    rewardsType: 'cashback',
    baseEstAnnualValue: 960,
    planMatches: {
      'wedding-fund': {
        score: 98,
        timeSavedMonths: 4,
        extraContributions: 'S$960/yr',
        headline: 'Earn 8% Cashback on Wedding Prep, Outfits & Online Vendors',
        reasons: [
          'Use mobile contactless & online payments for bridal deposits, photography, and decor to max out S$960/yr in cash rebates.',
          '8% FX cashback saves significantly on overseas pre-wedding photoshoots & honeymoon bookings.',
          'Customizable card design to match your celebration mood board.'
        ]
      },
      'career-break': {
        score: 94,
        timeSavedMonths: 3,
        extraContributions: 'S$840/yr',
        headline: 'Optimize Subscriptions & Digital Courses Before Your Sabbatical',
        reasons: [
          '8% cashback on online learning, tech subscriptions, and digital tools during upskilling.',
          'Reduces digital burn rate to prolong your freedom runway.'
        ]
      },
      housing: {
        score: 89,
        timeSavedMonths: 2,
        extraContributions: 'S$780/yr',
        headline: 'Max Cashback on E-Commerce Furnishings & Appliances',
        reasons: [
          'Tap 8% cashback on Shopee, Taobao, Lazada, and online furniture orders.',
          'Mobile contactless payment integration across all major retail stores.'
        ]
      },
      default: {
        score: 91,
        timeSavedMonths: 3,
        extraContributions: 'S$880/yr',
        headline: 'Digital Native & Smart Mobile Contactless Optimization',
        reasons: [
          'Highest cashback rate (8%) for tap-and-go mobile payments.',
          'Zero hassle FX rebates for overseas online shopping.'
        ]
      }
    }
  },
  {
    id: 'ocbc-90n',
    name: 'OCBC 90°N Credit Card',
    tagline: 'Miles That Never Expire for Travel & Flight Milestones',
    category: 'Miles & Travel',
    bgGradient: 'from-[#0B0C10] via-[#1F2833] to-[#0B0C10]',
    cardColor: '#66FCF1', // Neon Ice Blue
    textColor: 'text-white',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    chipColor: '#E2B13C',
    network: 'Mastercard',
    headlineRate: 'Up to 7 mpd / No Expiry',
    subText: 'Travel$ convert 1:1 to KrisFlyer Miles',
    primaryBenefit: '7 mpd on Agoda bookings, 2.1 mpd Overseas FX, 1.3 mpd Local spend',
    minSpend: 'No minimum spend requirement',
    annualFeeWaiver: 'First Year Fee Waived',
    privileges: [
      'Earn Travel$ that NEVER expire with zero conversion fee to 9 airline & hotel partners',
      'Up to 7 mpd (Travel$) on Agoda international flight and hotel bookings',
      '2.1 mpd on foreign currency spend (in-person & online foreign websites)',
      '1.3 mpd on all local qualifying spend with no cap',
      'Exclusive travel insurance coverage + zero point transfer block fees'
    ],
    rewardsType: 'miles',
    baseEstAnnualValue: 48000, // 48,000 KrisFlyer Miles / yr (~S$1,200 travel value)
    planMatches: {
      'career-break': {
        score: 99,
        timeSavedMonths: 6,
        extraContributions: '48,000 Miles/yr',
        headline: 'Fund Overseas Travel & Sabbatical Flights via Non-Expiring Miles',
        reasons: [
          'Accumulate 48,000+ non-expiring KrisFlyer miles for your planned sabbatical trips.',
          '7 mpd Agoda rate dramatically cuts hotel stay costs during long travel breaks.',
          'Zero minimum spend allows effortless flexibility while taking time off.'
        ]
      },
      'wedding-fund': {
        score: 97,
        timeSavedMonths: 4,
        extraContributions: '52,000 Miles/yr',
        headline: 'Redeem Business Class Honeymoon Flights for 2',
        reasons: [
          'Turn wedding expenses and venue payments into luxury flight redemptions.',
          'No mile expiry date ensures you can lock in optimal award flight availability.'
        ]
      },
      retirement: {
        score: 88,
        timeSavedMonths: 4,
        extraContributions: '40,000 Miles/yr',
        headline: 'Build a Post-Retirement World Tour Travel Chest',
        reasons: [
          'Accumulate miles stress-free over multiple years without worrying about points expiry.',
          'Convert miles at 1:1 ratio to KrisFlyer, Asia Miles, and Marriott Bonvoy.'
        ]
      },
      default: {
        score: 92,
        timeSavedMonths: 4,
        extraContributions: '45,000 Miles/yr',
        headline: 'Premier Non-Expiring Miles Accelerator',
        reasons: [
          'Flexibility to hold miles indefinitely until your target trip milestone date.',
          'High 2.1 mpd rate on foreign currency spend for global lifestyle.'
        ]
      }
    }
  },
  {
    id: 'ocbc-titanium',
    name: 'OCBC Titanium Rewards Card',
    tagline: '10x OCBC$ (4 mpd or 2.78% Cash Value) on Retail & Tech Shopping',
    category: 'Shopping & Electronics',
    bgGradient: 'from-[#3A0CA3] via-[#4361EE] to-[#4CC9F0]',
    cardColor: '#F72585', // Electric Pink/Purple
    textColor: 'text-white',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    chipColor: '#E2B13C',
    network: 'Mastercard',
    headlineRate: '10x OCBC$ (4 mpd)',
    subText: '120,000 OCBC$ annual bonus cap',
    primaryBenefit: '10x OCBC$ on Clothes, Shoes, Department Stores, Electronics & E-Commerce',
    minSpend: 'No minimum spend',
    annualFeeWaiver: 'First Year Fee Waived',
    privileges: [
      '10x OCBC$ (4 mpd) on local and overseas shopping (online & offline retail stores)',
      '10x OCBC$ on major department stores (Tangs, Takashimaya, IKEA, Courts, Harvey Norman)',
      '10x OCBC$ on e-commerce platforms (Amazon, Lazada, Shopee, Taobao, Qoo10)',
      'Protection against online shopping fraud & damaged goods delivery warranty',
      'Convert points to cash rebates, vouchers, or miles flexibly'
    ],
    rewardsType: 'points',
    baseEstAnnualValue: 120000, // 120,000 OCBC$ (~S$960 voucher/cash equivalent)
    planMatches: {
      housing: {
        score: 97,
        timeSavedMonths: 4,
        extraContributions: 'S$960 vouchers/yr',
        headline: 'Massive Points Booster for New BTO Electronics & Furniture',
        reasons: [
          'Earn 10x OCBC$ when purchasing appliances from Harvey Norman, Courts, IKEA, and Best Denki.',
          'Redeem points for Robinsons or IKEA vouchers to lower renovation out-of-pocket costs.',
          'Protection coverage included for high-value home appliances.'
        ]
      },
      'children-education': {
        score: 93,
        timeSavedMonths: 3,
        extraContributions: 'S$800/yr value',
        headline: '10x Rewards on Laptops, School Supplies & Books',
        reasons: [
          'Collect 4 mpd on laptops, iPads, textbooks, and back-to-school retail shopping.',
          'Redeem rewards for bookstore vouchers or cash back into education savings.'
        ]
      },
      default: {
        score: 90,
        timeSavedMonths: 3,
        extraContributions: 'S$850/yr value',
        headline: 'Shopping & Home Furnishing Points Engine',
        reasons: [
          '4 mpd / 10x points cap of 120,000 OCBC$ per annual year.',
          'Covers both physical department stores and top online platforms.'
        ]
      }
    }
  },
  {
    id: 'ocbc-voyage',
    name: 'OCBC VOYAGE Card',
    tagline: 'Bespoke Luxury Travel, Unlimited Airport Lounge Access & Butler Service',
    category: 'Ultra Premium',
    bgGradient: 'from-[#111111] via-[#1C1C1C] to-[#0A0A0A]',
    cardColor: '#D4AF37', // Metallic Gold / Titanium Charcoal
    textColor: 'text-white',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    chipColor: '#D4AF37',
    network: 'VISA Infinite',
    headlineRate: '2.2 mpd FX / VIP Concierge',
    subText: 'Full Metal Card / Unlimited Lounge Access',
    primaryBenefit: 'Unlimited Plaza Premium Airport Lounge Access, 24/7 VOYAGE Concierge Service',
    minSpend: 'Income eligibility: S$120,000 p.a.',
    annualFeeWaiver: 'Includes 15,000 VOYAGE Miles upon renewal',
    privileges: [
      '2.2 VOYAGE Miles per S$1 on foreign currency transactions',
      '1.3 VOYAGE Miles per S$1 on local spend with no caps',
      'Unlimited complimentary access to over 1,300 airport lounges worldwide for cardholder + guest',
      '24/7 VOYAGE Concierge: Book full-revenue flights on ANY airline with VOYAGE Miles',
      'Complimentary luxury limousine airport transfers & fine dining privileges'
    ],
    rewardsType: 'miles',
    baseEstAnnualValue: 75000, // 75,000 VOYAGE Miles (~S$2,200 luxury travel value)
    planMatches: {
      retirement: {
        score: 96,
        timeSavedMonths: 6,
        extraContributions: '75,000 Miles/yr',
        headline: 'VIP Concierge & Unlimited Lounge Comfort for Retirement Travels',
        reasons: [
          'Redeem ANY flight on ANY airline with zero award blackout dates via VOYAGE Concierge.',
          'Unlimited airport lounge access ensures seamless VIP travel comfort.',
          '15,000 bonus VOYAGE miles granted annually upon card renewal.'
        ]
      },
      'parents-retirement': {
        score: 95,
        timeSavedMonths: 5,
        extraContributions: '65,000 Miles/yr',
        headline: 'Treat Parents to First Class Flights & Airport Limo Transfers',
        reasons: [
          'Pamper parents with complimentary airport limo pick-ups and lounge access.',
          'Dedicated 24/7 concierge assists with medical travel, premium dining, and hotel bookings.'
        ]
      },
      default: {
        score: 91,
        timeSavedMonths: 5,
        extraContributions: '70,000 Miles/yr',
        headline: 'The Ultimate Metal Card for High-Earners & Global Travelers',
        reasons: [
          'Uncapped mile earning potential on both local and international transactions.',
          'Instant conversion to cash credit, luxury rewards, or airline miles.'
        ]
      }
    }
  }
];

// Helper: Calculate custom optimization metrics based on user active plan context
export function getOptimizedCardsForPlan(planId, planData) {
  const selectedPlanId = planId || 'housing';
  
  return OCBC_CARDS.map(card => {
    const match = card.planMatches[selectedPlanId] || card.planMatches.default;
    
    // Estimate target completion date impact
    const targetDate = planData?.timelineAll || '2028';
    
    return {
      ...card,
      matchScore: match.score,
      timeSavedMonths: match.timeSavedMonths,
      extraContributions: match.extraContributions,
      headlineReason: match.headline,
      specificReasons: match.reasons,
      targetDateContext: targetDate
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
