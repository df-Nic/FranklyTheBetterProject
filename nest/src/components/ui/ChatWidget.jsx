import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Compass, Coins, TrendingUp, ShieldCheck, Gift, Scissors, ShieldAlert, ArrowRight, RotateCcw } from 'lucide-react';
import ocbcOwl from '../../assets/images/OCBC Owl.jpg';
import { useApp } from '../../context/AppContext';
import { PLANS_DATA } from '../../data/planTemplates';
import { estimateGoalAmount, getGoalEstimationQuestions, supportsGuidedEstimate } from '../../data/goalEstimators';

const HOUSING_SUBGOALS_BY_TYPE = {
  hdb: [
    { name: "First down payment (Agreement to Lease)", pct: 0.25, icon: "Coins" },
    { name: "Second down payment (Key Collection)", pct: 0.35, icon: "TrendingUp" },
    { name: "Full Home Ownership & Mortgage Cleared", pct: 0.40, icon: "Gift" }
  ],
  condo: [
    { name: "OTP Booking Cash Deposit (5%)", pct: 0.20, icon: "Coins" },
    { name: "S&P Agreement & Stamp Duties (BSD)", pct: 0.35, icon: "TrendingUp" },
    { name: "Full Mortgage Payoff & Condo Ownership", pct: 0.45, icon: "Gift" }
  ],
  landed: [
    { name: "OTP Booking Cash Deposit (5%)", pct: 0.15, icon: "Coins" },
    { name: "Full Downpayment & Stamp Duty (BSD)", pct: 0.40, icon: "TrendingUp" },
    { name: "Full Mortgage Settlement & Landed Title", pct: 0.45, icon: "Gift" }
  ]
};

const PLAN_SUBGOALS = {
  'housing': HOUSING_SUBGOALS_BY_TYPE.hdb,
  'savings': [
    { name: "Emergency Buffer Deposit Goal", pct: 0.30, icon: "Coins" },
    { name: "High-Yield Vault Target", pct: 0.30, icon: "TrendingUp" },
    { name: "Growth Reserves Allocation Goal", pct: 0.40, icon: "Gift" }
  ],
  'retirement': [
    { name: "SRS & CPF Retirement Sum Target", pct: 0.15, icon: "Coins" },
    { name: "Strategic Wealth Growth Target", pct: 0.35, icon: "TrendingUp" },
    { name: "GE Lifetime Payout Annuity Target", pct: 0.50, icon: "ShieldCheck" }
  ],
  'wedding-fund': [
    { name: "Venue Booking Savings Target", pct: 0.40, icon: "Coins" },
    { name: "Catering & Banquet Downpayment Goal", pct: 0.30, icon: "TrendingUp" },
    { name: "Honeymoon & Outfits Savings Goal", pct: 0.30, icon: "Gift" }
  ],
  'children-education': [
    { name: "CDA Account Savings Target", pct: 0.15, icon: "Coins" },
    { name: "Secondary School Savings Goal", pct: 0.35, icon: "TrendingUp" },
    { name: "University Tuition Fees Target", pct: 0.50, icon: "Gift" }
  ],
  'career-break': [
    { name: "Living Expenses Savings Target", pct: 0.60, icon: "Coins" },
    { name: "Upskilling & Course Fee Goal", pct: 0.20, icon: "TrendingUp" },
    { name: "Transition Emergency Cash Goal", pct: 0.20, icon: "ShieldCheck" }
  ],
  'parents-retirement': [
    { name: "Parents' Retirement Sum Target", pct: 0.50, icon: "Coins" },
    { name: "Senior Healthcare Protection Goal", pct: 0.25, icon: "ShieldCheck" },
    { name: "Elderly Care Living Fund Goal", pct: 0.25, icon: "Gift" }
  ]
};

const EDUCATION_STAGE_SUBGOALS = {
  early: [
    { name: "Preschool Fee Fund", pct: 0.60, icon: "Coins" },
    { name: "Childcare & Learning Materials", pct: 0.25, icon: "Gift" },
    { name: "Primary School Transition Reserve", pct: 0.15, icon: "ShieldCheck" },
  ],
  school: [
    { name: "Primary School Cost Fund", pct: 0.35, icon: "Coins" },
    { name: "Secondary School Cost Fund", pct: 0.45, icon: "TrendingUp" },
    { name: "Activities & Enrichment Reserve", pct: 0.20, icon: "Gift" },
  ],
  postsecondary: [
    { name: "Admission & Equipment Fund", pct: 0.25, icon: "Coins" },
    { name: "Post-secondary Tuition Fund", pct: 0.55, icon: "TrendingUp" },
    { name: "Completion & Transition Reserve", pct: 0.20, icon: "ShieldCheck" },
  ],
  university: [
    { name: "University Admission Fund", pct: 0.15, icon: "Coins" },
    { name: "University Tuition Fund", pct: 0.55, icon: "TrendingUp" },
    { name: "Student Living Cost Reserve", pct: 0.30, icon: "Gift" },
  ],
  full: [
    { name: "Early Years Education Fund", pct: 0.20, icon: "Coins" },
    { name: "Primary & Secondary School Fund", pct: 0.30, icon: "TrendingUp" },
    { name: "Post-secondary Education Fund", pct: 0.15, icon: "ShieldCheck" },
    { name: "University Education Fund", pct: 0.35, icon: "Gift" },
  ],
};

const ChatWidget = () => {
  const { setPage, setClickPos, setActivePlanTitle, setActivePlanId, setPlanDetailOrigin, hasCreatedFirstPlan, setHasCreatedFirstPlan, updatePlanDraft, discardPlanDraft, planChatRequest, consumePlanChatRequest, housingPropertyType, setHousingPropertyType } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasInitialized, setHasInitialized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [safeBottom, setSafeBottom] = useState(0);
  const [scrollProgress, setScrollProgress] = useState({ left: 0, width: 100 });

  // Conversational planning flow states
  const [flowState, setFlowState] = useState('idle');
  const [planGoal, setPlanGoal] = useState(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState('hdb');
  const [planTitle, setPlanTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  const [paymentStrategy, setPaymentStrategy] = useState('');
  const [generatedSubgoals, setGeneratedSubgoals] = useState([]);
  const [inferredDefaults, setInferredDefaults] = useState(null);
  const [unsureFields, setUnsureFields] = useState([]);
  const [estimationStep, setEstimationStep] = useState(0);
  const [estimationAnswers, setEstimationAnswers] = useState({});
  const [pendingEstimate, setPendingEstimate] = useState(null);
  const [isRestartConfirming, setIsRestartConfirming] = useState(false);
  const isUnsure = (value) => /not sure|don't know|dont know|you decide|no idea/i.test(value);
  const isChangePlanIntent = (value) => /\b(change|redo|replan|re-plan|restart|start\s*over|reset|different\s*goal|new\s*plan|another\s*(goal|plan))\b/i.test(value);
  const inferDefaults = (planId) => {
    const defaults = {
      retirement: [1500000, 'Oct 2045', 2400],
      housing: [500000, 'Aug 2030', 2500],
      savings: [50000, 'Jan 2030', 900],
      emergency: [30000, 'Dec 2026', 4000],
      'wedding-fund': [35000, 'Dec 2027', 1200],
      'children-education': [80000, 'Oct 2035', 500],
      'career-break': [25000, 'Jun 2028', 800],
      'parents-retirement': [120000, 'Dec 2032', 1000],
      default: [100000, 'Jan 2030', 900],
    };
    const [amount, date, monthly] = defaults[planId] || defaults.default;
    return { amount, date, monthly, strategy: 'staggered' };
  };

  const confirmInferredPlan = () => {
    const proposal = inferredDefaults;
    if (!proposal) return;
    setTargetAmount(proposal.amount);
    setTargetDate(proposal.date);
    setPaymentStrategy(proposal.strategy);
    updatePlanDraft(planGoal, {
      targetAmount: proposal.amount,
      targetDate: proposal.date,
      paymentStrategy: proposal.strategy,
      inferredByOwl: true,
    });
    setMessages(prev => [...prev, {
      id: Date.now(), sender: 'bot', isReturningUserConfirmation: true, planTitle,
      text: <span>Your Owl-assisted starting point is ready. Review the full breakdown before accepting it.</span>,
    }]);
    setFlowState('idle');
  };

  const editInferredPlan = () => {
    setInferredDefaults(null);
    setUnsureFields([]);
    setInputText('');
    setFlowState('asking_amount');
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'bot',
      text: (
        <span>
          No problem. Let’s set it manually. <span className="text-brand-primary font-black">What total target amount would you like to use?</span>
        </span>
      ),
    }]);
    setTimeout(() => chatInputRef.current?.focus(), 0);
  };

  const parseAmountInput = (str) => {
    if (!str) return 0;
    const normalized = str.trim().toLowerCase();
    const kMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*k\b/);
    if (kMatch) {
      return parseFloat(kMatch[1]) * 1000;
    }
    const mMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*m\b/);
    if (mMatch) {
      return parseFloat(mMatch[1]) * 1000000;
    }
    const num = parseFloat(normalized.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const parseDateInput = (str) => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    const normalized = str.toLowerCase();
    const relativeYears = normalized.match(/\b(?:in\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+years?\b/);
    const relativeMonths = normalized.match(/\b(?:in\s+)?(\d+)\s+months?\b/);
    const wordNumbers = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

    const yearMatch = str.match(/\b(202[6-9]|203[0-9]|204[0-9]|205[0-9])\b/);
    if (yearMatch) {
      year = parseInt(yearMatch[1], 10);
    } else if (relativeYears) {
      year += Number(relativeYears[1]) || wordNumbers[relativeYears[1]];
    } else if (relativeMonths) {
      const date = new Date(now.getFullYear(), now.getMonth() + Number(relativeMonths[1]), 1);
      return date;
    } else {
      year = now.getFullYear() + 2;
    }

    const months = [
      ['jan', 'january'], ['feb', 'february'], ['mar', 'march'],
      ['apr', 'april'], ['may'], ['jun', 'june'],
      ['jul', 'july'], ['aug', 'august'], ['sep', 'september'],
      ['oct', 'october'], ['nov', 'november'], ['dec', 'december']
    ];
    const s = normalized;
    let foundMonth = false;
    for (let i = 0; i < 12; i++) {
      if (months[i].some(m => s.includes(m))) {
        month = i;
        foundMonth = true;
        break;
      }
    }
    if (!foundMonth && !relativeYears) {
      month = 11;
    }

    return new Date(year, month, 1);
  };

  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Coins': return <Coins className="w-3.5 h-3.5" />;
      case 'TrendingUp': return <TrendingUp className="w-3.5 h-3.5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'Gift': return <Gift className="w-3.5 h-3.5" />;
      case 'Scissors': return <Scissors className="w-3.5 h-3.5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-3.5 h-3.5" />;
      default: return <Compass className="w-3.5 h-3.5" />;
    }
  };
  const suggestionsRef = useRef(null);

  const bubbleRef = useRef(null);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const chatInputRef = useRef(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const consumedChatRequest = useRef(0);
  const isDragging = useRef(false);
  const flowSessionRef = useRef(0);

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: (
        <span>
          Hi! I am your Nest Planner. What financial goals can we plan together today? <span className="text-brand-primary font-black">Tap a suggestion below or write your plan here!</span>
        </span>
      )
    }
  ]);

  const handleSelectHousingPropertyType = (propType) => {
    setSelectedPropertyType(propType);
    setHousingPropertyType(propType);
    setEstimationAnswers(prev => ({ ...prev, propertyType: propType }));
    const titleMap = {
      hdb: 'OCBC HDB (BTO) Housing Plan',
      condo: 'OCBC Condominium Housing Plan',
      landed: 'OCBC Landed Property Plan',
    };
    const title = titleMap[propType] || 'OCBC Housing Plan';
    setPlanTitle(title);
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: propType === 'hdb' ? 'HDB (BTO)' : propType === 'condo' ? 'Condominium' : 'Landed Property' },
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: (
          <span>
            Great! Let's build your strategy for: <span className="text-brand-primary font-black">"{title}"</span>. What is the total target financial amount or budget you'll need? (If you're not sure, reply <span className="text-brand-primary font-black font-mono">"not sure"</span> for guided estimation).
          </span>
        ),
      }
    ]);
    setFlowState('asking_amount');
  };

  const restartPlanningFlow = () => {
    flowSessionRef.current += 1;
    discardPlanDraft(planGoal);
    setFlowState('idle');
    setPlanGoal(null);
    setSelectedPropertyType('hdb');
    setPlanTitle('');
    setTargetAmount(0);
    setTargetDate('');
    setPaymentStrategy('');
    setGeneratedSubgoals([]);
    setInferredDefaults(null);
    setUnsureFields([]);
    setEstimationStep(0);
    setEstimationAnswers({});
    setPendingEstimate(null);
    setInputText('');
    setIsRestartConfirming(false);
    setMessages([{
      id: Date.now(),
      sender: 'bot',
      text: (
        <span>
          No problem. What would you like to plan for instead? <span className="text-brand-primary font-black">Choose a suggestion below or describe another savings or life goal.</span>
        </span>
      ),
    }]);
    setTimeout(() => chatInputRef.current?.focus(), 0);
  };

  const estimationQuestions = getGoalEstimationQuestions(planGoal, estimationAnswers);
  const currentEstimationQuestion = estimationQuestions[estimationStep];

  const startGuidedEstimation = () => {
    const firstQuestion = getGoalEstimationQuestions(planGoal)[0];
    if (!firstQuestion) return false;
    setEstimationStep(0);
    setEstimationAnswers({});
    setPendingEstimate(null);
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'bot',
      text: (
        <span>
          I won't guess. I'll ask a few questions and show you how the estimate is calculated. <span className="text-brand-primary font-black">{firstQuestion.prompt}</span>
        </span>
      ),
    }]);
    setFlowState('estimating_amount');
    return true;
  };

  const handleEstimationAnswer = (option) => {
    const question = currentEstimationQuestion;
    if (!question) return;
    const nextAnswers = { ...estimationAnswers, [question.id]: option.value };
    setEstimationAnswers(nextAnswers);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: option.label }]);

    const nextQuestions = getGoalEstimationQuestions(planGoal, nextAnswers);
    const nextStep = estimationStep + 1;
    const nextQuestion = nextQuestions[nextStep];
    if (nextQuestion) {
      setEstimationStep(nextStep);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: <span><span className="text-brand-primary font-black">{nextQuestion.prompt}</span></span>,
      }]);
      return;
    }

    const estimate = estimateGoalAmount(planGoal, nextAnswers);
    if (!estimate) {
      setFlowState('asking_amount');
      return;
    }
    setPendingEstimate(estimate);
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'bot',
      text: (
        <span>
          Based on your answers, your estimated personal target is <span className="text-brand-primary font-black">S${estimate.amount.toLocaleString('en-SG')}</span>. {estimate.summary} Review it before continuing.
        </span>
      ),
    }]);
    setFlowState('reviewing_estimate');
  };

  const acceptGuidedEstimate = () => {
    if (!pendingEstimate) return;
    setTargetAmount(pendingEstimate.amount);
    updatePlanDraft(planGoal, {
      targetAmount: pendingEstimate.amount,
      estimationAnswers,
      estimationSummary: pendingEstimate.summary,
    });
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: `Use S$${pendingEstimate.amount.toLocaleString('en-SG')}`,
    }, {
      id: Date.now() + 1,
      sender: 'bot',
      text: (
        <span>
          Target saved. When would you like to achieve this goal? Please <span className="text-brand-primary font-black">specify an overall target date (e.g. Dec 2027)</span>.
        </span>
      ),
    }]);
    setFlowState('asking_date');
  };

  const editGuidedEstimate = () => {
    setPendingEstimate(null);
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'bot',
      text: <span>Enter the target amount you would prefer to use.</span>,
    }]);
    setFlowState('asking_amount');
    setTimeout(() => chatInputRef.current?.focus(), 0);
  };

  const planningSuggestions = [
    "Plan for Retirement",
    "Children's Education Plan",
    "Career Break Savings"
  ];

  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Resolve container ref on mount and measure safe bottom area
  useEffect(() => {
    // Dynamically measure the bottom safe area inset in pixels
    const tempDiv = document.createElement('div');
    tempDiv.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
    document.body.appendChild(tempDiv);
    const measuredSafeBottom = parseInt(window.getComputedStyle(tempDiv).paddingBottom, 10) || 0;
    document.body.removeChild(tempDiv);
    setSafeBottom(measuredSafeBottom);

    const parent = bubbleRef.current?.parentElement;
    if (parent) {
      containerRef.current = parent;

      const initializePosition = () => {
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;
        const bubbleWidth = 56;
        const bubbleHeight = 56;

        // Initial position: snap to right edge with 16px padding, offset by safe bottom inset & navbar clearance
        const initX = parentWidth - bubbleWidth - 16;
        const initY = parentHeight - bubbleHeight - 180 - measuredSafeBottom;

        setPosition({ x: initX, y: initY });
        setHasInitialized(true);
      };

      // Run immediately
      initializePosition();

      // Recalculate after 100ms to ensure transitions/layouts have completed
      const timer = setTimeout(initializePosition, 100);

      // Handle window resize dynamically
      const handleResize = () => {
        if (!isOpenRef.current && bubbleRef.current) {
          const parentWidth = parent.offsetWidth;
          const parentHeight = parent.offsetHeight;
          const bubbleWidth = 56;
          const bubbleHeight = 56;

          setPosition(prev => {
            const paddingX = 16;
            const paddingY = 96 + measuredSafeBottom;

            // Check if the previous X was closer to the right side of the screen
            const isRightSnapped = prev.x > (parentWidth / 2) - (bubbleWidth / 2);
            let targetX = isRightSnapped ? (parentWidth - bubbleWidth - paddingX) : paddingX;

            let targetY = prev.y;
            const minY = 16;
            const maxY = parentHeight - bubbleHeight - paddingY;
            if (targetY < minY) targetY = minY;
            if (targetY > maxY) targetY = maxY;

            return { x: targetX, y: targetY };
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (suggestionsRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = suggestionsRef.current;
          if (scrollWidth > clientWidth) {
            setScrollProgress({
              left: (scrollLeft / scrollWidth) * 100,
              width: (clientWidth / scrollWidth) * 100
            });
          } else {
            setScrollProgress({ left: 0, width: 100 });
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSuggestionsScroll = (e) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    if (scrollWidth > clientWidth) {
      const widthPct = (clientWidth / scrollWidth) * 100;
      const leftPct = (scrollLeft / scrollWidth) * 100;
      setScrollProgress({ left: leftPct, width: widthPct });
    }
  };

  // Scroll to bottom when messages list changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleOpen = () => {
    if (!containerRef.current) return;

    const parent = containerRef.current;
    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;
    const bubbleSize = 56;

    // Save previous drag coordinates
    lastPosition.current = { x: position.x, y: position.y };

    // Target position: horizontally centered in the input bar gap, vertically centered with the text input
    const targetX = parentWidth - bubbleSize - 28;
    const targetY = parentHeight - bubbleSize - 100 - safeBottom;

    setPosition({ x: targetX, y: targetY });
    setIsOpen(true);
  };

  useEffect(() => {
    if (!planChatRequest || planChatRequest === consumedChatRequest.current) return;
    consumedChatRequest.current = planChatRequest;
    consumePlanChatRequest();
    flowSessionRef.current += 1;
    discardPlanDraft(planGoal);
    setIsRestartConfirming(false);
    setFlowState('idle');
    setPlanGoal(null);
    setPlanTitle('');
    setTargetAmount(0);
    setTargetDate('');
    setPaymentStrategy('');
    setGeneratedSubgoals([]);
    setUnsureFields([]);
    setMessages([{
      id: Date.now(),
      sender: 'bot',
      text: (
        <span>
          Let’s create a new plan. Tell me the goal in your own words—you can also say <span className="text-brand-primary font-black">“I’m not sure”</span> for budget or timing and I’ll suggest a starting point.
        </span>
      ),
    }]);
    requestAnimationFrame(handleOpen);
  }, [planChatRequest]);

  const handleClose = () => {
    // Restore the bubble back to its last snap coordinate before it was opened
    setPosition({ x: lastPosition.current.x, y: lastPosition.current.y });
    setIsOpen(false);
  };

  const handleDragEnd = (event, info) => {
    if (!containerRef.current || !bubbleRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const bubbleRect = bubbleRef.current.getBoundingClientRect();

    const paddingX = 16;
    const paddingY = 96 + safeBottom; // clearance for bottom navbar and safe inset

    // Find current horizontal position and snap to closest vertical side edge
    const bubbleCenterX = bubbleRect.left + bubbleRect.width / 2;
    const parentCenterX = parentRect.left + parentRect.width / 2;

    let targetX = 0;
    if (bubbleCenterX < parentCenterX) {
      targetX = paddingX; // snap to left edge
    } else {
      targetX = parentRect.width - bubbleRect.width - paddingX; // snap to right edge
    }

    // Compute current Y relative to the parent container
    let targetY = bubbleRect.top - parentRect.top;

    // Ensure Y bounds are respected
    const minY = 16;
    const maxY = parentRect.height - bubbleRect.height - paddingY;
    if (targetY < minY) targetY = minY;
    if (targetY > maxY) targetY = maxY;

    setPosition({ x: targetX, y: targetY });

    // Set to false in the next tick to prevent drag release from triggering tap/click
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  const handleTap = () => {
    if (isDragging.current) return;
    if (isRestartConfirming) return;

    if (isOpen) {
      if (inputText.trim()) {
        handleSend();
      } else {
        handleClose();
      }
    } else {
      handleOpen();
    }
  };

  // Resolve a stable planId from natural language plan title
  const resolvePlanId = (title) => {
    const t = (title || '').toLowerCase();

    const scores = {
      'retirement': 0,
      'wedding-fund': 0,
      'housing': 0,
      'savings': 0,
      'emergency': 0,
      'children-education': 0,
      'career-break': 0,
      'parents-retirement': 0
    };

    if (t.includes('retire') || t.includes('retirement')) {
      if (t.includes('parent') || t.includes('father') || t.includes('mother') || t.includes('parents')) {
        scores['parents-retirement'] += 10;
      } else {
        scores['retirement'] += 10;
      }
    }
    if (t.includes('wed') || t.includes('wedding') || t.includes('marry') || t.includes('marriage')) scores['wedding-fund'] += 10;
    if (t.includes('emerg') || t.includes('emergency')) scores['emergency'] += 10;
    if (t.includes('hdb') || t.includes('bto') || t.includes('condo') || t.includes('condominium') || t.includes('landed') || t.includes('terrace') || t.includes('bungalow') || t.includes('semi-d') || t.includes('semid') || t.includes('downpayment') || t.includes('flat') || t.includes('house') || t.includes('housing') || t.includes('property')) scores['housing'] += 10;
    if (t.includes('save') || t.includes('savings') || t.includes('vault') || t.includes('buffer')) scores['savings'] += 10;
    if (t.includes('child') || t.includes('children') || t.includes('education') || t.includes('school') || t.includes('uni') || t.includes('university') || t.includes('tuition')) scores['children-education'] += 10;
    if (t.includes('career') || t.includes('break') || t.includes('sabbatical') || t.includes('transition')) scores['career-break'] += 10;
    if (t.includes('parent') || t.includes('parents') || t.includes('elderly')) scores['parents-retirement'] += 10;

    let highestScore = 0;
    let resolvedId = 'default';

    for (const [planId, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score;
        resolvedId = planId;
      }
    }

    return resolvedId;
  };

  // Preview only — does NOT save to dashboard
  const handleReviewPlanClick = (e, planTitle, generatedSubgoals = []) => {
    e.stopPropagation();
    if (containerRef.current) {
      const parentRect = containerRef.current.getBoundingClientRect();
      setClickPos({ x: e.clientX - parentRect.left, y: e.clientY - parentRect.top });
    } else {
      setClickPos({ x: 195, y: 422 });
    }
    const planId = resolvePlanId(planTitle);

    // Save custom user parameters to AppContext
    if (targetAmount > 0 || targetDate) {
      updatePlanDraft(planId, {
        targetAmount: targetAmount,
        targetDate: targetDate,
        subgoals: generatedSubgoals,
        paymentStrategy: paymentStrategy
      });
    }

    setActivePlanTitle(planTitle);
    setActivePlanId(planId);
    setPlanDetailOrigin('home'); // back button returns to home
    setIsOpen(false);
    setTimeout(() => { setPage('plan-details'); }, 50);
  };
  const handleRiskPromptSelect = (agree, e) => {
    const sessionId = flowSessionRef.current;
    setFlowState('processing');
    // If user agrees to redo risk profiling (Yes), navigate immediately with Iris curtain
    if (agree) {
      // Capture real click position for the Iris origin
      if (e && containerRef.current) {
        const parentRect = containerRef.current.getBoundingClientRect();
        setClickPos({ x: e.clientX - parentRect.left, y: e.clientY - parentRect.top });
      } else {
        setClickPos({ x: 195, y: 422 });
      }
      // Pre-set the plan data so plan-details renders correctly after risk profiling
      const planId = resolvePlanId(planTitle);
      setActivePlanTitle(planTitle);
      setActivePlanId(planId);
      setIsOpen(false);
      setHasCreatedFirstPlan(true);
      setTimeout(() => setPage('risk-profiling'), 50);
      return;
    }

    // For No (user does not redo), show "No" message and bot typing, then display plan review
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: 'No' }]);
    setHasCreatedFirstPlan(true);
    setMessages(prev => [...prev, { id: 'typing', sender: 'bot', isTyping: true }]);

    setTimeout(() => {
      if (sessionId !== flowSessionRef.current) return;
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          isFirstPlanReview: true,
          planTitle: planTitle,
          text: (
            <span>
              No problem! Your custom wealth plan is ready. <span className="text-brand-primary font-black">Tap below to review your plan details and activate it.</span>
            </span>
          ),
        },
      ]);
      setFlowState('idle');
    }, 1500);
  };


  const handleSend = (textToSend = inputText) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;
    const sessionId = flowSessionRef.current;
    const currentFlowState = flowState;

    if (currentFlowState === 'asking_strategy') {
      setFlowState('processing');
    }

    // 1. Add user message
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: trimmed }
    ]);

    setInputText('');

    // 2. Add loading typing indicator after a short delay
    setMessages(prev => [
      ...prev,
      { id: 'typing', sender: 'bot', isTyping: true }
    ]);

    // 3. Process state machine transition after 1.5 seconds
    setTimeout(() => {
      if (sessionId !== flowSessionRef.current) return;
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));

      if (isChangePlanIntent(trimmed)) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: (
              <span>
                Would you like to discard this plan draft and choose a different goal?
              </span>
            ),
          }
        ]);
        setIsRestartConfirming(true);
        return;
      }

      if (flowState === 'idle') {
        const planId = resolvePlanId(trimmed);
        setPlanGoal(planId);

        if (planId === 'housing') {
          const lower = trimmed.toLowerCase();
          let explicitType = null;
          if (lower.includes('bto') || lower.includes('hdb') || lower.includes('public')) {
            explicitType = 'hdb';
          } else if (lower.includes('condo') || lower.includes('condominium') || lower.includes('private')) {
            explicitType = 'condo';
          } else if (lower.includes('landed') || lower.includes('terrace') || lower.includes('bungalow') || lower.includes('semi-d') || lower.includes('semid')) {
            explicitType = 'landed';
          }

          if (explicitType) {
            setSelectedPropertyType(explicitType);
            setHousingPropertyType(explicitType);
            setEstimationAnswers(prev => ({ ...prev, propertyType: explicitType }));
            const titleMap = {
              hdb: 'OCBC HDB (BTO) Housing Plan',
              condo: 'OCBC Condominium Housing Plan',
              landed: 'OCBC Landed Property Plan',
            };
            const title = titleMap[explicitType] || 'OCBC Housing Plan';
            setPlanTitle(title);
            setMessages(prev => [
              ...prev,
              {
                id: Date.now(),
                sender: 'bot',
                text: (
                  <span>
                    Great choice! Let's build your custom strategy for: <span className="text-brand-primary font-black">"{title}"</span>. To start, <span className="text-brand-primary font-black">what is the total target financial amount or budget you'll need?</span>
                  </span>
                )
              }
            ]);
            setFlowState('asking_amount');
          } else {
            setMessages(prev => [
              ...prev,
              {
                id: Date.now(),
                sender: 'bot',
                text: (
                  <span>
                    Great! What type of property are you planning to purchase? <span className="text-brand-primary font-black">Select one of the 3 property categories below to customize your plan.</span>
                  </span>
                )
              }
            ]);
            setFlowState('asking_property_type');
          }
          return;
        }

        const planObj = PLANS_DATA[planId] || PLANS_DATA.default;
        setPlanTitle(planObj.title);

        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: (
              <span>
                Great choice! Let's build your custom strategy for: "{planObj.title}". To start, <span className="text-brand-primary font-black">what is the total target financial amount or budget you'll need?</span>
              </span>
            )
          }
        ]);
        setFlowState('asking_amount');

      } else if (flowState === 'asking_amount') {
        if (isUnsure(trimmed)) {
          if (supportsGuidedEstimate(planGoal)) {
            startGuidedEstimation();
            return;
          }
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'bot',
            text: "Guided estimation is currently available for Retirement, Wedding, House, and Children's Education goals. I won't guess for this goal—please enter the target amount you would like to use.",
          }]);
          setFlowState('asking_amount');
          return;
          setUnsureFields(current => [...new Set([...current, 'amount'])]);
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'bot',
            text: (
              <span>
                That’s okay—I’ll estimate a suitable target. Next, <span className="text-brand-primary font-black">when would you ideally like to achieve this goal?</span>
              </span>
            ),
          }]);
          setFlowState('asking_date');
          return;
        }
        const num = parseAmountInput(trimmed);
        if (isNaN(num) || num <= 0) {
          setMessages(prev => [
            ...prev,
            { id: Date.now(), sender: 'bot', text: "Please enter a valid target amount (e.g. S$35,000)." }
          ]);
          return;
        }

        setTargetAmount(num);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'bot',
            text: (
              <span>
                Understood, S${num.toLocaleString()}. When would you like to achieve this goal? Please <span className="text-brand-primary font-black">specify an overall target date (e.g. Dec 2027)</span>.
              </span>
            )
          }
        ]);
        setFlowState('asking_date');

      } else if (flowState === 'asking_date') {
        if (isUnsure(trimmed)) {
          setUnsureFields(current => [...new Set([...current, 'date'])]);
        } else {
          const parsedDate = parseDateInput(trimmed);
          const formattedTargetDate = formatDate(parsedDate);
          setTargetDate(formattedTargetDate);
        }

        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: 'bot',
          text: (
            <span>
              Got it. One last question: would you prefer <span className="text-brand-primary font-black">staggered payments or one lump sum?</span>
            </span>
          ),
        }]);
        setFlowState('asking_strategy');

      } else if (currentFlowState === 'asking_strategy' || flowState === 'asking_strategy') {
        const strategyUnsure = isUnsure(trimmed);
        const normalizedStrategy = strategyUnsure ? 'staggered' : (/stagger/i.test(trimmed) ? 'staggered' : 'lump-sum');
        setPaymentStrategy(normalizedStrategy);

        if (unsureFields.length > 0 || strategyUnsure) {
          const defaults = inferDefaults(planGoal);
          const proposal = {
            ...defaults,
            amount: unsureFields.includes('amount') ? defaults.amount : targetAmount,
            date: unsureFields.includes('date') ? defaults.date : targetDate,
            strategy: strategyUnsure ? defaults.strategy : normalizedStrategy,
          };
          setUnsureFields(current => [...new Set([...current, ...(strategyUnsure ? ['strategy'] : [])])]);
          setInferredDefaults(proposal);
          setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', isInferredDefaults: true, proposal }]);
          setFlowState('confirming_inference');
          return;
        }

        const now = new Date();
        const effectiveDateStr = targetDate || 'Dec 2028';
        const parsedDate = parseDateInput(effectiveDateStr);
        const formattedTargetDate = formatDate(parsedDate);
        const totalMonths = (parsedDate.getFullYear() - now.getFullYear()) * 12 + (parsedDate.getMonth() - now.getMonth());
        const validMonths = totalMonths > 0 ? totalMonths : 24;

        const planObj = PLANS_DATA[planGoal] || PLANS_DATA.default;

        const activePropType = selectedPropertyType || housingPropertyType || 'hdb';
        const subgoals = planGoal === 'children-education'
          ? (EDUCATION_STAGE_SUBGOALS[estimationAnswers.educationStage] || PLAN_SUBGOALS[planGoal] || PLAN_SUBGOALS.savings)
          : planGoal === 'housing'
            ? (HOUSING_SUBGOALS_BY_TYPE[activePropType] || HOUSING_SUBGOALS_BY_TYPE.hdb)
            : (PLAN_SUBGOALS[planGoal] || PLAN_SUBGOALS.savings);
        let messagePayload = {
          id: Date.now(),
          sender: 'bot',
          planTitle: planObj.title,
          targetAmount: targetAmount,
          targetDate: formattedTargetDate
        };

        if (subgoals) {
          const K = subgoals.length;
          const breakdownSubgoals = subgoals.map((sub, i) => {
            const allocated = Math.round(sub.pct * targetAmount);
            let milestoneDate;
            if (i === K - 1) {
              milestoneDate = parsedDate;
            } else {
              const milestoneOffsetMonths = Math.round((validMonths * (i + 1)) / K);
              milestoneDate = new Date();
              milestoneDate.setMonth(now.getMonth() + milestoneOffsetMonths);
            }

            return {
              id: i + 1,
              name: sub.name,
              icon: sub.icon,
              amount: allocated,
              date: normalizedStrategy === 'staggered' ? formatDate(milestoneDate) : null
            };
          });
          messagePayload.isPlanBreakdown = true;
          messagePayload.categories = breakdownSubgoals;

          setGeneratedSubgoals(breakdownSubgoals);

          updatePlanDraft(planGoal, {
            targetAmount: targetAmount,
            targetDate: formattedTargetDate,
            subgoals: breakdownSubgoals,
            paymentStrategy: normalizedStrategy
          });
        } else {
          messagePayload.isSimpleSummary = true;
          updatePlanDraft(planGoal, {
            targetAmount: targetAmount,
            targetDate: formattedTargetDate,
            paymentStrategy: normalizedStrategy
          });
        }

        // Add plan breakdown card or summary after strategy is chosen
        setMessages(prev => [
          ...prev,
          messagePayload
        ]);

        // Post-plan Routing decision
        setTimeout(() => {
          if (sessionId !== flowSessionRef.current) return;
          setMessages(prev => [
            ...prev,
            { id: 'typing-strategy', sender: 'bot', isTyping: true }
          ]);

          setTimeout(() => {
            if (sessionId !== flowSessionRef.current) return;
            if (!hasCreatedFirstPlan) {
              // First time user risk profiling prompt
              setMessages(prev => [
                ...prev.filter(m => m.id !== 'typing-strategy'),
                {
                  id: Date.now(),
                  sender: 'bot',
                  text: (
                    <span>
                      We haven't heard from you in a while! <span className="text-brand-primary font-black">Would you like to redo your risk profile?</span>
                    </span>
                  )
                }
              ]);
              setFlowState('asking_risk_prompt');
            } else {
              // Returning user
              setMessages(prev => [
                ...prev.filter(m => m.id !== 'typing-strategy'),
                {
                  id: Date.now(),
                  sender: 'bot',
                  isReturningUserConfirmation: true,
                  planTitle: planTitle,
                  text: (
                    <span>
                      Your plan has been generated successfully! <span className="text-brand-primary font-black">Tap the button below to view and customize your Plan Details.</span>
                    </span>
                  )
                }
              ]);
              setFlowState('idle');
            }
          }, 1000);
        }, 1200);
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const isMascotVisible = !isOpen || (flowState !== 'asking_strategy' && flowState !== 'asking_risk_prompt');

  return (
    <>
      {/* Cinematic Blur Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30 cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}
            className="absolute top-20 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="h-14 px-4 bg-white border-b border-zinc-200/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full border border-brand-primary overflow-hidden bg-white shrink-0">
                  <img src={ocbcOwl} alt="Mascot" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-zinc-900 leading-tight">Nest Planner</h3>
                  <span className="text-[10px] font-semibold text-zinc-400">Personal Wealth Advisory</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-700 active:scale-95 transition-all cursor-pointer"
                  aria-label="Close Nest Planner"
                >
                  <X className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Scrollable Message Box */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.sender === 'user'
                      ? 'bg-brand-primary text-white font-medium rounded-tr-none shadow-md shadow-brand-primary/10'
                      : 'bg-white text-zinc-800 font-medium rounded-tl-none border border-zinc-200/40 shadow-sm'
                      }`}
                  >
                    {msg.isTyping ? (
                      <div className="flex items-center gap-1.5 py-1 px-1">
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
                          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: 0.24 }}
                          className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                        />
                      </div>
                    ) : msg.isInferredDefaults ? (
                      <div className="w-full min-w-[220px] text-zinc-800">
                        <div className="text-[9px] font-black uppercase tracking-wider text-brand-primary">Owl’s suggested starting point</div>
                        <div className="mt-2 space-y-1.5 rounded-xl bg-zinc-50 p-2.5 text-[9.5px]">
                          <div className="flex justify-between"><span>Target</span><strong>S${msg.proposal.amount.toLocaleString()}</strong></div>
                          <div className="flex justify-between"><span>Goal date</span><strong>{msg.proposal.date}</strong></div>
                          <div className="flex justify-between"><span>Monthly amount</span><strong>S${msg.proposal.monthly.toLocaleString()}</strong></div>
                          <div className="flex justify-between"><span>Payment style</span><strong>Staggered</strong></div>
                        </div>
                        <p className="mt-2 text-[9px] leading-relaxed text-zinc-500">Based on this goal type, your linked balances, and a contribution that preserves flexibility.</p>
                        <button onClick={confirmInferredPlan} className="mt-2.5 w-full rounded-lg bg-brand-primary py-2 text-[9px] font-black text-white">Use these suggestions</button>
                        <button onClick={editInferredPlan} className="mt-1.5 w-full rounded-lg border border-zinc-200 py-2 text-[9px] font-black">Edit values</button>
                      </div>
                    ) : msg.isPlanBreakdown ? (
                      <div className="flex flex-col gap-2.5 w-full min-w-0 text-zinc-800">
                        <div className="flex items-center gap-1.5 text-zinc-900 font-bold border-b border-zinc-100/50 pb-1.5 shrink-0">
                          <Compass className="w-3.5 h-3.5 text-brand-primary animate-pulse shrink-0" />
                          <span className="text-[10px] uppercase tracking-wider font-extrabold">Plan Subgoals</span>
                        </div>
                        <div className="flex flex-col gap-2 pl-1">
                          {msg.categories.map((c, idx) => (
                            <div key={idx} className="flex flex-col border-l-2 border-brand-primary/20 pl-2 text-left">
                              <span className="font-extrabold text-[10px] text-zinc-800 leading-tight">{c.name}</span>
                              <div className="flex justify-between items-center text-[8.5px] font-bold text-zinc-400 mt-0.5">
                                {c.date ? <span>Milestone: {c.date}</span> : <span />}
                                <span className="text-zinc-800 font-extrabold">S${c.amount.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-[8px] text-zinc-400 font-bold border-t border-zinc-200/50 pt-2 flex justify-between px-0.5 shrink-0">
                          <span>Total: S${msg.targetAmount.toLocaleString()}</span>
                          <span>Target: {msg.targetDate}</span>
                        </div>
                        <p className="text-[11px] leading-normal text-brand-primary font-black mt-2 text-left italic">
                          * You can edit these individual subgoals later before confirming your plan.
                        </p>
                      </div>
                    ) : msg.isSimpleSummary ? (
                      <div className="flex flex-col gap-2.5 w-full min-w-0 text-zinc-800">
                        <div className="flex items-center gap-1.5 text-zinc-900 font-bold border-b border-zinc-100/50 pb-1.5 shrink-0">
                          <Compass className="w-3.5 h-3.5 text-brand-primary animate-pulse shrink-0" />
                          <span className="text-[10px] uppercase tracking-wider font-extrabold">Plan Summary</span>
                        </div>
                        <div className="bg-zinc-50 border border-zinc-200/50 rounded-xl p-2.5 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[9.5px] font-bold">
                            <span className="text-zinc-500">Target Goal:</span>
                            <span className="text-zinc-900 font-black">S${msg.targetAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-[9.5px] font-bold">
                            <span className="text-zinc-500">Target Date:</span>
                            <span className="text-zinc-900 font-black">{msg.targetDate}</span>
                          </div>
                        </div>
                        <p className="text-[11px] leading-normal text-brand-primary font-black mt-2 text-left italic">
                          * You can customize and add subgoals later before confirming your plan.
                        </p>
                      </div>
                    ) : msg.isFirstPlanReview ? (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <p className="text-zinc-600 font-medium leading-relaxed text-[11px]">
                          {msg.text}
                        </p>
                        <button
                          onClick={(e) => handleReviewPlanClick(e, msg.planTitle)}
                          className="mt-2.5 w-full py-2 bg-brand-primary hover:bg-[#c11e15] text-white font-bold rounded-xl text-[10px] tracking-wide uppercase transition-all duration-150 active:scale-95 shadow-md shadow-brand-primary/25 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Review Plan Details</span>
                          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : msg.isReturningUserConfirmation ? (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        <p className="text-zinc-600 font-medium leading-relaxed text-[11.5px]">
                          {msg.text}
                        </p>
                        <button
                          onClick={(e) => handleReviewPlanClick(e, msg.planTitle)}
                          className="mt-2.5 w-full py-2 bg-brand-primary hover:bg-[#c11e15] text-white font-bold rounded-xl text-[10px] tracking-wide uppercase transition-all duration-150 active:scale-95 shadow-md shadow-brand-primary/25 cursor-pointer flex items-center justify-center gap-1"
                        >
                          <span>Review Plan Details</span>
                          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>
                    ) : msg.isPlanProposal ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-zinc-900 font-bold border-b border-zinc-100 pb-1">
                          <Compass className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                          <span>{msg.planTitle} Ready</span>
                        </div>
                        <p className="text-zinc-600 font-medium leading-relaxed text-[11.5px]">
                          I have compiled a customized wealth strategy: <strong className="text-brand-primary font-bold">"{msg.planTitle}"</strong> for your target: *"{msg.originalQuery}"*.
                        </p>
                        <button
                          onClick={(e) => handleReviewPlanClick(e, msg.originalQuery)}
                          className="mt-1.5 w-full py-2 bg-brand-primary hover:bg-[#c11e15] text-white font-bold rounded-xl text-[10px] tracking-wide uppercase transition-all duration-150 active:scale-95 shadow-md shadow-brand-primary/25 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Review Plan</span>
                        </button>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Pills Container */}
            {flowState === 'idle' && (
              <div className="px-4 py-3 border-t border-zinc-200/40 bg-zinc-50/50 shrink-0 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Compass className="w-3.5 h-3.5 text-brand-primary" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Plan suggestions based on your portfolio</span>
                </div>
                <div
                  ref={suggestionsRef}
                  onScroll={handleSuggestionsScroll}
                  className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
                >
                  {planningSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="flex-shrink-0 bg-white hover:bg-zinc-50 border border-zinc-200/60 shadow-sm text-zinc-700 font-bold px-3.5 py-2 rounded-full text-[10px] transition-colors cursor-pointer active:scale-95"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                {scrollProgress.width < 100 && (
                  <div className="w-full h-[3px] bg-zinc-200/40 rounded-full overflow-hidden relative mt-1">
                    <div
                      className="h-full bg-brand-primary/45 rounded-full absolute top-0 transition-all duration-75"
                      style={{
                        width: `${scrollProgress.width}%`,
                        left: `${scrollProgress.left}%`
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Input Bar / Action Buttons */}
            <div className={`${isMascotVisible && isOpen ? 'pl-4 pr-20' : 'px-4'} pb-3 pt-3 bg-white/95 border-t border-zinc-200/50 flex items-center gap-3 shrink-0 min-h-[56px]`}>
              {isRestartConfirming ? (
                <div className="w-full">
                  <p className="mb-2 text-[10px] font-bold leading-snug text-zinc-700">
                    Discard this draft and choose a different goal?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRestartConfirming(false)}
                      className="h-9 flex-1 rounded-xl border border-zinc-200 bg-white text-[10px] font-bold text-zinc-700 shadow-sm active:scale-95"
                    >
                      Continue plan
                    </button>
                    <button
                      type="button"
                      onClick={restartPlanningFlow}
                      className="h-9 flex-1 rounded-xl bg-brand-primary text-[10px] font-bold text-white shadow-sm shadow-brand-primary/15 active:scale-95"
                    >
                      Start over
                    </button>
                  </div>
                </div>
              ) : flowState === 'asking_property_type' ? (
                <div className="grid w-full grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectHousingPropertyType('hdb')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-zinc-200 bg-white hover:border-brand-primary/40 active:scale-95 shadow-sm transition-all"
                  >
                    <span className="text-[10px] font-black text-zinc-800">HDB (BTO)</span>
                    <span className="text-[8px] text-zinc-400 font-medium text-center">Public / BTO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectHousingPropertyType('condo')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-zinc-200 bg-white hover:border-brand-primary/40 active:scale-95 shadow-sm transition-all"
                  >
                    <span className="text-[10px] font-black text-zinc-800">Condo</span>
                    <span className="text-[8px] text-zinc-400 font-medium text-center">Private / EC</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectHousingPropertyType('landed')}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-zinc-200 bg-white hover:border-brand-primary/40 active:scale-95 shadow-sm transition-all"
                  >
                    <span className="text-[10px] font-black text-zinc-800">Landed</span>
                    <span className="text-[8px] text-zinc-400 font-medium text-center">Freehold Title</span>
                  </button>
                </div>
              ) : flowState === 'estimating_amount' && currentEstimationQuestion ? (
                <div className="grid w-full grid-cols-1 gap-1.5">
                  {currentEstimationQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleEstimationAnswer(option)}
                      className="flex min-h-10 w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-left shadow-sm transition-all active:scale-[0.98] hover:border-brand-primary/40"
                    >
                      <span className="text-[10px] font-black text-zinc-800">{option.label}</span>
                      <span className="text-right text-[8.5px] font-semibold text-zinc-400">{option.detail}</span>
                    </button>
                  ))}
                </div>
              ) : flowState === 'reviewing_estimate' ? (
                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    onClick={editGuidedEstimate}
                    className="h-10 flex-1 rounded-xl border border-zinc-200 bg-white text-[10px] font-bold text-zinc-700 shadow-sm active:scale-95"
                  >
                    Edit amount
                  </button>
                  <button
                    type="button"
                    onClick={acceptGuidedEstimate}
                    className="h-10 flex-1 rounded-xl bg-brand-primary text-[10px] font-bold text-white shadow-sm shadow-brand-primary/15 active:scale-95"
                  >
                    Use estimate
                  </button>
                </div>
              ) : flowState === 'asking_strategy' ? (
                <div className="flex gap-2 w-full justify-between">
                  <button
                    onClick={() => handleSend('Staggered')}
                    className="flex-1 h-10 bg-white border border-zinc-200 shadow-sm text-zinc-700 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer hover:bg-zinc-50"
                  >
                    Staggered
                  </button>
                  <button
                    onClick={() => handleSend('1-Lump Sum')}
                    className="flex-1 h-10 bg-brand-primary hover:bg-[#c11e15] text-white font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer shadow-sm shadow-brand-primary/10"
                  >
                    1-Lump Sum
                  </button>
                </div>
              ) : flowState === 'asking_risk_prompt' ? (
                <div className="flex gap-2 w-full justify-between">
                  <button
                    onClick={(e) => handleRiskPromptSelect(false, e)}
                    className="flex-1 h-10 bg-white border border-zinc-200 shadow-sm text-zinc-700 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer hover:bg-zinc-50"
                  >
                    No, skip it
                  </button>
                  <button
                    onClick={(e) => handleRiskPromptSelect(true, e)}
                    className="flex-1 h-10 bg-brand-primary hover:bg-[#c11e15] text-white font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer shadow-sm shadow-brand-primary/10"
                  >
                    Yes, update
                  </button>
                </div>
              ) : (
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    flowState === 'asking_amount'
                      ? "Enter total target amount..."
                      : flowState === 'asking_date'
                        ? "Enter target achievement date..."
                        : "Type any savings/life goals you have"
                  }
                  className="flex-1 h-10 px-3.5 bg-zinc-100 border border-zinc-200/50 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-zinc-400 transition-all duration-150"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Mascot Bubble */}
      <AnimatePresence>
        {isMascotVisible && (
          <motion.div
            ref={bubbleRef}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={hasInitialized ? { opacity: 1, scale: 1, x: position.x, y: position.y } : { opacity: 0, scale: 0.6 }}
            exit={{ opacity: 0, scale: 0.6 }}
            drag={!isOpen}
            dragConstraints={containerRef}
            dragElastic={0.12}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTap={handleTap}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              touchAction: 'none'
            }}
            whileHover={!isOpen || inputText.trim() ? { scale: 1.05 } : { scale: 1 }}
            whileTap={!isOpen || inputText.trim() ? { scale: 0.95 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className={`w-14 h-14 rounded-full border-2 border-brand-primary bg-white shadow-xl flex items-center justify-center overflow-hidden select-none z-50 ${isOpen
              ? 'pointer-events-auto cursor-pointer shadow-md'
              : 'pointer-events-auto cursor-grab active:cursor-grabbing'
              }`}
          >
            <img
              src={ocbcOwl}
              alt="OCBC Owl Mascot"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Send Action Overlay when user is typing */}
            <AnimatePresence>
              {isOpen && inputText.trim() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 bg-brand-primary flex items-center justify-center text-white"
                >
                  <Send className="w-5 h-5 stroke-[2.5]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
