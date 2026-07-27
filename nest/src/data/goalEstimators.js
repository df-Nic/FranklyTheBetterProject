export const GOAL_ESTIMATION_QUESTIONS = {
  retirement: [
    {
      id: "lifestyle",
      prompt: "What retirement lifestyle are you aiming for?",
      options: [
        { value: "basic", label: "Basic", detail: "About S$900–S$1,050/month" },
        { value: "full", label: "Full", detail: "About S$1,650–S$1,800/month" },
        { value: "enhanced", label: "Enhanced", detail: "About S$3,180–S$3,410/month" },
      ],
    },
    {
      id: "dependents",
      prompt: "Are you also prioritizing savings for dependents?",
      options: [
        { value: "yes", label: "Yes", detail: "Children or aging parents" },
        { value: "no", label: "No", detail: "Retirement needs only" },
      ],
    },
    {
      id: "partTime",
      prompt: "Do you plan to earn income after retirement?",
      options: [
        { value: "yes", label: "Yes", detail: "Part-time or other income" },
        { value: "no", label: "No", detail: "No planned earned income" },
      ],
    },
  ],
  "wedding-fund": [
    {
      id: "scale",
      prompt: "What scale of wedding are you planning?",
      options: [
        { value: "small", label: "50 or fewer", detail: "About S$25,000" },
        { value: "medium", label: "50–150 people", detail: "About S$40,000" },
        { value: "large", label: "More than 150", detail: "About S$75,000" },
      ],
    },
    {
      id: "split",
      prompt: "How will you fund the wedding?",
      options: [
        { value: "alone", label: "Saving alone", detail: "You fund the full amount" },
        { value: "evenly", label: "Splitting evenly", detail: "Your personal half" },
      ],
    },
    {
      id: "honeymoon",
      prompt: "Should the budget include a honeymoon?",
      options: [
        { value: "yes", label: "Yes", detail: "Add S$10,000" },
        { value: "no", label: "No", detail: "Wedding only" },
      ],
    },
  ],
  housing: [
    {
      id: "flatType",
      prompt: "What type of flat are you considering?",
      options: [
        { value: "bto3", label: "BTO 3-room", detail: "About S$300,000" },
        { value: "bto4", label: "BTO 4-room", detail: "About S$420,000" },
        { value: "resale", label: "Resale flat", detail: "2025 median S$628,000" },
      ],
    },
    {
      id: "loanType",
      prompt: "Which loan type are you considering?",
      options: [
        { value: "hdb", label: "HDB loan", detail: "20% downpayment" },
        { value: "bank", label: "Bank loan", detail: "25% downpayment" },
      ],
    },
    {
      id: "ownership",
      prompt: "Will you buy jointly or on your own?",
      options: [
        { value: "joint", label: "Joint", detail: "Your half of the downpayment" },
        { value: "solo", label: "Solo", detail: "Full downpayment" },
      ],
    },
  ],
  "children-education": [
    {
      id: "studyPath",
      prompt: "What education path are you preparing for?",
      options: [
        { value: "local", label: "Local public university", detail: "About S$40,000 per child" },
        { value: "private", label: "Private university", detail: "About S$80,000 per child" },
        { value: "overseas", label: "Overseas university", detail: "About S$200,000 per child" },
      ],
    },
    {
      id: "childrenCount",
      prompt: "How many children should this goal cover?",
      options: [
        { value: "1", label: "1 child", detail: "One education fund" },
        { value: "2", label: "2 children", detail: "Two education funds" },
        { value: "3", label: "3 or more", detail: "Estimate based on 3 children" },
      ],
    },
    {
      id: "coverage",
      prompt: "What should the education fund cover?",
      options: [
        { value: "tuition", label: "Tuition only", detail: "Course fees" },
        { value: "living", label: "Tuition + living costs", detail: "Add a 40% allowance" },
        { value: "full", label: "Full student support", detail: "Add 70% for living and housing" },
      ],
    },
  ],
};

const roundToThousand = (amount) => Math.round(amount / 1000) * 1000;

export function estimateGoalAmount(planId, answers) {
  if (planId === "retirement") {
    const monthly = { basic: 975, full: 1725, enhanced: 3295 }[answers.lifestyle];
    if (!monthly) return null;
    const base = monthly * 12 * 25;
    const multiplier = 1 + (answers.dependents === "yes" ? 0.2 : 0) - (answers.partTime === "yes" ? 0.15 : 0);
    const amount = roundToThousand(base * multiplier);
    return {
      amount,
      summary: `25 years of ${answers.lifestyle} retirement spending${answers.dependents === "yes" ? ", including a dependent buffer" : ""}${answers.partTime === "yes" ? ", adjusted for planned income" : ""}.`,
    };
  }

  if (planId === "wedding-fund") {
    const weddingBase = { small: 25000, medium: 40000, large: 75000 }[answers.scale];
    if (!weddingBase) return null;
    const total = weddingBase + (answers.honeymoon === "yes" ? 10000 : 0);
    const amount = answers.split === "evenly" ? total / 2 : total;
    return {
      amount,
      summary: `${answers.scale} wedding${answers.honeymoon === "yes" ? " with a S$10,000 honeymoon" : ""}${answers.split === "evenly" ? ", showing your half" : ""}.`,
    };
  }

  if (planId === "housing") {
    const propertyPrice = { bto3: 300000, bto4: 420000, resale: 628000 }[answers.flatType];
    if (!propertyPrice) return null;
    const downpaymentRate = answers.loanType === "bank" ? 0.25 : 0.2;
    const fullDownpayment = propertyPrice * downpaymentRate;
    const amount = answers.ownership === "joint" ? fullDownpayment / 2 : fullDownpayment;
    return {
      amount,
      summary: `${Math.round(downpaymentRate * 100)}% downpayment on a ${answers.flatType === "resale" ? "resale flat" : answers.flatType === "bto4" ? "BTO 4-room flat" : "BTO 3-room flat"}${answers.ownership === "joint" ? ", showing your half" : ""}.`,
    };
  }

  if (planId === "children-education") {
    const perChild = { local: 40000, private: 80000, overseas: 200000 }[answers.studyPath];
    const children = Number(answers.childrenCount);
    if (!perChild || !children) return null;
    const coverageMultiplier = { tuition: 1, living: 1.4, full: 1.7 }[answers.coverage] || 1;
    const amount = roundToThousand(perChild * children * coverageMultiplier);
    const pathLabel = answers.studyPath === "overseas"
      ? "overseas university"
      : answers.studyPath === "private"
        ? "private university"
        : "local public university";
    const coverageLabel = answers.coverage === "full"
      ? "tuition, living and housing"
      : answers.coverage === "living"
        ? "tuition and living costs"
        : "tuition";
    return {
      amount,
      summary: `${coverageLabel} for ${children} ${children === 1 ? "child" : "children"} following ${answers.studyPath === "overseas" ? "an" : "a"} ${pathLabel} path.`,
    };
  }

  return null;
}

export function supportsGuidedEstimate(planId) {
  return Boolean(GOAL_ESTIMATION_QUESTIONS[planId]);
}
