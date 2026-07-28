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
      id: "educationStage",
      prompt: "Which education stage should this plan cover?",
      options: [
        { value: "early", label: "Preschool & childcare", detail: "Early-years fees and care" },
        { value: "school", label: "Primary & secondary", detail: "School-age education" },
        { value: "postsecondary", label: "Post-secondary", detail: "JC, ITE, poly or diploma" },
        { value: "university", label: "University", detail: "Local, private or overseas" },
        { value: "full", label: "Full education journey", detail: "Early years through university" },
      ],
    },
    {
      id: "educationPath",
      prompt: "What kind of preschool or childcare are you considering?",
      when: (answers) => answers.educationStage === "early",
      options: [
        { value: "community", label: "Community preschool", detail: "Subsidised local option" },
        { value: "private_early", label: "Private preschool", detail: "Mid-range private option" },
        { value: "premium_early", label: "Premium preschool", detail: "Higher-fee programme" },
      ],
    },
    {
      id: "educationPath",
      prompt: "What school path are you preparing for?",
      when: (answers) => answers.educationStage === "school",
      options: [
        { value: "local_school", label: "Local school", detail: "Core school costs" },
        { value: "local_enriched", label: "Local + enrichment", detail: "Includes regular enrichment" },
        { value: "international_school", label: "International school", detail: "Private international route" },
      ],
    },
    {
      id: "educationPath",
      prompt: "Which post-secondary route should we plan for?",
      when: (answers) => answers.educationStage === "postsecondary",
      options: [
        { value: "jc_ite", label: "JC or ITE", detail: "Public post-secondary route" },
        { value: "polytechnic", label: "Polytechnic", detail: "Three-year diploma route" },
        { value: "private_diploma", label: "Private diploma", detail: "Private institution route" },
      ],
    },
    {
      id: "educationPath",
      prompt: "What university path are you preparing for?",
      when: (answers) => answers.educationStage === "university",
      options: [
        { value: "local_university", label: "Local public university", detail: "Planning base: S$40,000" },
        { value: "private_university", label: "Private university", detail: "Planning base: S$80,000" },
        { value: "overseas_university", label: "Overseas university", detail: "Planning base: S$200,000" },
      ],
    },
    {
      id: "educationPath",
      prompt: "Which overall education path is most likely?",
      when: (answers) => answers.educationStage === "full",
      options: [
        { value: "local_journey", label: "Mostly local", detail: "Local route at each stage" },
        { value: "blended_journey", label: "Blended", detail: "Local and private options" },
        { value: "international_journey", label: "International", detail: "International school and overseas university" },
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
      prompt: "How much support should the fund provide?",
      options: [
        { value: "fees", label: "Core fees only", detail: "Tuition and compulsory fees" },
        { value: "broader", label: "Fees + extras", detail: "Add 25% for materials and enrichment" },
        { value: "full", label: "Full support", detail: "Add 50% for broader student costs" },
      ],
    },
    {
      id: "fundingShare",
      prompt: "How much of the estimated cost should this plan fund?",
      options: [
        { value: "all", label: "100% of costs", detail: "No existing savings offset" },
        { value: "threequarters", label: "75% of costs", detail: "Some subsidies or savings expected" },
        { value: "half", label: "50% of costs", detail: "Costs shared or partly funded" },
      ],
    },
  ],
};

const roundToThousand = (amount) => Math.round(amount / 1000) * 1000;

export function getGoalEstimationQuestions(planId, answers = {}) {
  return (GOAL_ESTIMATION_QUESTIONS[planId] || [])
    .filter((question) => !question.when || question.when(answers));
}

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
    const stageCosts = {
      early: {
        community: 24000,
        private_early: 60000,
        premium_early: 120000,
      },
      school: {
        local_school: 20000,
        local_enriched: 60000,
        international_school: 300000,
      },
      postsecondary: {
        jc_ite: 10000,
        polytechnic: 15000,
        private_diploma: 40000,
      },
      university: {
        local_university: 40000,
        private_university: 80000,
        overseas_university: 200000,
      },
      full: {
        local_journey: 99000,
        blended_journey: 240000,
        international_journey: 660000,
      },
    };
    const stageLabels = {
      early: "preschool and childcare",
      school: "primary and secondary school",
      postsecondary: "post-secondary education",
      university: "university",
      full: "the full education journey",
    };
    const pathLabels = {
      community: "a community preschool",
      private_early: "a private preschool",
      premium_early: "a premium preschool",
      local_school: "a local school",
      local_enriched: "a local school with regular enrichment",
      international_school: "an international school",
      jc_ite: "a JC or ITE route",
      polytechnic: "a polytechnic route",
      private_diploma: "a private diploma route",
      local_university: "a local public university",
      private_university: "a private university",
      overseas_university: "an overseas university",
      local_journey: "a mostly local path",
      blended_journey: "a blended local and private path",
      international_journey: "an international school and overseas university path",
    };
    const perChild = stageCosts[answers.educationStage]?.[answers.educationPath];
    const children = Number(answers.childrenCount);
    if (!perChild || !children) return null;
    const coverageMultiplier = { fees: 1, broader: 1.25, full: 1.5 }[answers.coverage] || 1;
    const fundingMultiplier = { all: 1, threequarters: 0.75, half: 0.5 }[answers.fundingShare] || 1;
    const amount = roundToThousand(perChild * children * coverageMultiplier * fundingMultiplier);
    const supportLabel = answers.coverage === "full"
      ? "full student support"
      : answers.coverage === "broader"
        ? "fees, materials and enrichment"
        : "core fees";
    const fundingLabel = Math.round(fundingMultiplier * 100);
    return {
      amount,
      summary: `This covers ${supportLabel} for ${stageLabels[answers.educationStage]}, using ${pathLabels[answers.educationPath]} planning assumptions for ${children} ${children === 1 ? "child" : "children"}. The target funds ${fundingLabel}% of the estimated cost and can be edited before you continue.`,
    };
  }

  return null;
}

export function supportsGuidedEstimate(planId) {
  return Boolean(GOAL_ESTIMATION_QUESTIONS[planId]);
}
