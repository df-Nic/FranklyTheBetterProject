export const SAVINGS_BREAKDOWNS = {
  "wedding-fund": {
    asOf: "22 Jul 2026",
    items: [
      {
        id: "wedding-interest",
        title: "Higher savings interest",
        description: "Additional interest recorded after moving the wedding fund to a higher-rate savings option.",
        amount: 216,
        status: "realized",
        source: "Plan rate comparison",
        calculation: [
          { label: "Eligible balance", value: "S$12,000" },
          { label: "Rate improvement", value: "1.80% p.a." },
          { label: "Recorded period", value: "12 months" },
        ],
      },
      {
        id: "wedding-fees",
        title: "Fewer account fees",
        description: "Fees avoided after consolidating recurring wedding payments.",
        amount: 96,
        status: "realized",
        source: "Plan fee review",
        calculation: [
          { label: "Monthly fee reduction", value: "S$8" },
          { label: "Recorded period", value: "12 months" },
        ],
      },
      {
        id: "wedding-sweep",
        title: "Balance sweep interest",
        description: "Additional interest recorded from automatically moving idle balances into the goal account.",
        amount: 72,
        status: "realized",
        source: "Cash-flow assumption",
        calculation: [
          { label: "Average swept balance", value: "S$4,000" },
          { label: "Rate improvement", value: "1.80% p.a." },
        ],
      },
    ],
  },
  retirement: {
    asOf: "22 Jul 2026",
    items: [
      {
        id: "retirement-tax",
        title: "SRS tax benefit recorded",
        description: "Tax benefit recorded from the completed annual SRS contribution.",
        amount: 4500,
        status: "realized",
        source: "Plan tax assumption",
        calculation: [
          { label: "Planned SRS contribution", value: "S$15,000" },
          { label: "Illustrative marginal rate", value: "30%" },
        ],
      },
      {
        id: "retirement-fees",
        title: "Lower portfolio fees",
        description: "Fees saved after moving to the lower-cost portfolio mix in the plan.",
        amount: 1700,
        status: "realized",
        source: "Portfolio fee comparison",
        calculation: [
          { label: "Compared portfolio balance", value: "S$170,000" },
          { label: "Fee difference", value: "1.00% p.a." },
        ],
      },
      {
        id: "retirement-yield",
        title: "Improved cash allocation",
        description: "Additional return recorded after moving idle retirement cash into the planned allocation.",
        amount: 3000,
        status: "realized",
        source: "Allocation comparison",
        calculation: [
          { label: "Reallocated amount", value: "S$50,000" },
          { label: "Illustrative return difference", value: "6.00% p.a." },
        ],
      },
    ],
  },
  savings: {
    asOf: "22 Jul 2026",
    items: [
      {
        id: "hdb-interest",
        title: "Higher deposit interest",
        description: "Additional interest recorded after applying the recommended savings-account allocation.",
        amount: 720,
        status: "realized",
        source: "Deposit rate comparison",
        calculation: [
          { label: "Eligible balance", value: "S$20,000" },
          { label: "Rate improvement", value: "3.60% p.a." },
        ],
      },
      {
        id: "hdb-fixed-deposit",
        title: "Fixed-deposit yield improvement",
        description: "Interest gained from the completed short-term fixed-deposit placement.",
        amount: 240,
        status: "realized",
        source: "Plan product comparison",
        calculation: [
          { label: "Planned placement", value: "S$20,000" },
          { label: "Rate improvement", value: "1.20% p.a." },
        ],
      },
      {
        id: "hdb-grant",
        title: "Housing grant secured",
        description: "Grant value secured after Agent Owl surfaced the eligible housing support.",
        amount: 900,
        status: "realized",
        source: "Approved grant record",
        calculation: [
          { label: "Grant value applied", value: "S$900" },
          { label: "Eligibility", value: "Verified" },
        ],
      },
    ],
  },
  emergency: {
    asOf: "22 Jul 2026",
    items: [
      {
        id: "emergency-subscriptions",
        title: "Subscription reductions",
        description: "Savings recorded after cancelling unused subscriptions flagged for review.",
        amount: 360,
        status: "realized",
        source: "Spending review assumption",
        calculation: [
          { label: "Monthly estimate", value: "S$30" },
          { label: "Recorded period", value: "12 months" },
        ],
      },
      {
        id: "emergency-rebates",
        title: "Card rebate improvement",
        description: "Rebates received after routing eligible recurring expenses through the recommended card setup.",
        amount: 240,
        status: "realized",
        source: "Card-spend assumption",
        calculation: [
          { label: "Monthly estimate", value: "S$20" },
          { label: "Recorded period", value: "12 months" },
        ],
      },
      {
        id: "emergency-interest",
        title: "Emergency-fund interest",
        description: "Additional interest recorded from the higher-rate liquid account in the plan.",
        amount: 180,
        status: "realized",
        source: "Deposit rate comparison",
        calculation: [
          { label: "Average balance", value: "S$10,000" },
          { label: "Rate improvement", value: "1.80% p.a." },
        ],
      },
    ],
  },
  default: {
    asOf: "22 Jul 2026",
    items: [
      {
        id: "wealth-interest",
        title: "Improved cash yield",
        description: "Additional interest recorded after reallocating idle cash in the plan.",
        amount: 800,
        status: "realized",
        source: "Cash allocation comparison",
        calculation: [
          { label: "Reallocated amount", value: "S$20,000" },
          { label: "Rate improvement", value: "4.00% p.a." },
        ],
      },
      {
        id: "wealth-fees",
        title: "Lower investment fees",
        description: "Fees saved after adopting the diversified portfolio selected in the plan.",
        amount: 660,
        status: "realized",
        source: "Portfolio fee comparison",
        calculation: [
          { label: "Compared portfolio balance", value: "S$60,000" },
          { label: "Fee difference", value: "1.10% p.a." },
        ],
      },
      {
        id: "wealth-refinance",
        title: "Interest-cost reduction",
        description: "Interest costs avoided after accepting the refinancing option identified by the plan.",
        amount: 1000,
        status: "realized",
        source: "Loan-rate comparison",
        calculation: [
          { label: "Balance compared", value: "S$5,000" },
          { label: "Illustrative rate difference", value: "20.00% p.a." },
        ],
      },
    ],
  },
};

export function getSavingsBreakdown(planId) {
  return SAVINGS_BREAKDOWNS[planId] ?? SAVINGS_BREAKDOWNS.default;
}

export function sumSavings(items, status) {
  return items
    .filter((item) => !status || item.status === status)
    .reduce((total, item) => total + item.amount, 0);
}
