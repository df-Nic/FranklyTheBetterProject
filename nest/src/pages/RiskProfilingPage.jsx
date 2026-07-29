import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';

const SCENARIOS = [
  {
    id: 'weather',
    headline: 'Weather Forecast',
    description: "The morning forecast predicts a 30% chance of rain, but the sky is completely clear. Do you leave your umbrella at home to avoid carrying it?"
  },
  {
    id: 'dining',
    headline: 'Menu Experiment',
    description: "You are at a popular restaurant with friends. Do you order a completely unknown 'Chef's Special' instead of the classic dish you always get?"
  },
  {
    id: 'commute',
    headline: 'Airport Commute',
    description: "You are running slightly late for a flight. Do you take a traffic-prone shortcut that could save you 20 minutes, or stay on the slow but steady highway?"
  },
  {
    id: 'career',
    headline: 'Startup Offer',
    description: "A brand-new startup offers you a role with high potential bonuses but low job security. Do you resign from your stable corporate job to join them?"
  },
  {
    id: 'shopping',
    headline: 'Mystery Box',
    description: "An online store is selling a 'Mystery Box' worth up to $100 for just $30, with a risk of getting items you don't need. Do you buy it?"
  },
  {
    id: 'recreation',
    headline: 'Roller Coaster',
    description: "Your friends invite you to ride a massive, high-speed roller coaster. Do you join them despite feeling nervous about the heights and speed?"
  }
];

const SwipeCardComponent = ({ scenario, stackIndex, isTop, onSwipe, swipeTopCardRef, onSwipeStart }) => {
  const x = useMotionValue(0);

  // Interpolations based on x drag distance
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const borderWidth = useTransform(x, [-100, 0, 100], [2.5, 1, 2.5]);
  const contentOpacity = useTransform(x, [-15, 0, 15], [0, 1, 0]);
  const borderColor = useTransform(x, [-100, 0, 100], [
    'rgba(225, 37, 27, 0.8)', // brand red for left swipe
    'rgba(0, 0, 0, 0.07)',
    'rgba(76, 175, 80, 0.8)' // green for right swipe
  ]);

  const visualIndex = Math.min(stackIndex, 2);
  const stackScale = 1 - visualIndex * 0.05;
  const stackTranslateY = visualIndex * 12;
  const stackOpacity = stackIndex > 2 ? 0 : 1;

  useEffect(() => {
    if (isTop && swipeTopCardRef) {
      swipeTopCardRef.current = (direction) => {
        onSwipeStart();
        const targetX = direction === 'right' ? 400 : -400;
        animate(x, targetX, { duration: 0.2 }).then(() => {
          onSwipe(scenario.id, direction);
        });
      };
    }
    return () => {
      if (isTop && swipeTopCardRef) {
        swipeTopCardRef.current = null;
      }
    };
  }, [isTop, scenario.id, onSwipe, x, swipeTopCardRef, onSwipeStart]);

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    const velocityThreshold = 200;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      // Swipe Right: Agree / Yes
      onSwipeStart();
      animate(x, 400, { duration: 0.2 }).then(() => {
        onSwipe(scenario.id, 'right');
      });
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      // Swipe Left: Disagree / No
      onSwipeStart();
      animate(x, -400, { duration: 0.2 }).then(() => {
        onSwipe(scenario.id, 'left');
      });
    } else {
      // Snap back to center
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 26 });
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '100%',
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - stackIndex,
        transformOrigin: 'bottom center',
        pointerEvents: isTop ? 'auto' : 'none'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: -300, right: 300 }}
      onDragEnd={handleDragEnd}
      animate={{
        y: isTop ? 0 : stackTranslateY,
        scale: isTop ? 1 : stackScale,
        opacity: stackOpacity
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
    >
      <motion.div
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 24,
          minHeight: 290,
          borderWidth,
          borderColor,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
        }}
        className="flex flex-col justify-between h-[300px]"
      >
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="bg-brand-primary/8 px-3 py-1.5 rounded-lg self-start inline-block mb-4">
              <span className="text-[11px] font-bold text-brand-primary tracking-wider uppercase">
                SCENARIO
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 leading-snug mb-3">
              {scenario.headline}
            </h3>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              {scenario.description}
            </p>
          </div>

          {isTop && (
            <motion.div style={{ opacity: contentOpacity }} className="mt-6 flex justify-between items-center text-xs font-bold">
              <div className="flex items-center gap-1.5 text-brand-primary/70">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Not for me</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500/70">
                <span>I'd do this</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const RiskProfilingPage = () => {
  const { navigate, setPage, activePlanId, activePlanTitle, setClickPos, setPlanDetailOrigin, setRiskProfile, setHasAssessedRisk } = useApp();
  const [cards, setCards] = useState(SCENARIOS);
  const [decisions, setDecisions] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeTopCardRef = useRef(null);

  const handleSwipe = (id, direction) => {
    setDecisions(prev => ({ ...prev, [id]: direction }));
    const remaining = cards.filter(c => c.id !== id);
    setCards(remaining);
    if (remaining.length === 0) {
      setIsComplete(true);
    }
    setIsSwiping(false);
  };

  const handleButtonClick = (direction) => {
    if (isSwiping || cards.length === 0) return;
    if (swipeTopCardRef.current) {
      swipeTopCardRef.current(direction);
    }
  };

  const getRiskProfile = () => {
    const agreeCount = Object.values(decisions).filter(d => d === 'right').length;
    if (agreeCount >= 6) {
      return {
        badge: 'Aggressive Growth',
        description: 'Maximum long-term compounding through tech, megatrends, and equity growth.',
        color: 'from-orange-500 to-red-600',
        text: 'text-red-500'
      };
    } else if (agreeCount >= 4) {
      return {
        badge: 'Growth',
        description: 'Higher long-term returns through market index & diversified equity exposure.',
        color: 'from-purple-500 to-indigo-600',
        text: 'text-purple-600'
      };
    } else if (agreeCount >= 2) {
      return {
        badge: 'Balanced',
        description: 'Steady growth with lower ups & downs, balancing high-yield cash and core investments.',
        color: 'from-amber-500 to-orange-500',
        text: 'text-amber-500'
      };
    } else {
      return {
        badge: 'Capital Safety',
        description: 'Preserves money with zero market risk and guaranteed interest yields.',
        color: 'from-emerald-500 to-teal-600',
        text: 'text-emerald-600'
      };
    }
  };

  const profile = getRiskProfile();

  const handleProceedToPlanDetails = (e) => {
    setRiskProfile(profile.badge);
    setHasAssessedRisk(true);
    if (e) {
      setClickPos({ x: e.clientX, y: e.clientY });
    } else {
      // Center of screen for a smooth Iris expansion
      setClickPos({ x: 195, y: 422 });
    }
    setPlanDetailOrigin('risk-profiling');
    setPage('plan-details');
  };
// Auto-redirect after risk profiling is complete
useEffect(() => {
  if (isComplete) {
    handleProceedToPlanDetails();
  }
}, [isComplete]);

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative px-6 py-6 overflow-y-auto no-scrollbar select-none text-zinc-800">
      {/* Background Orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <BackgroundOrb color="peach" size="300px" className="-top-12 -right-12" />
      </div>

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 shrink-0 mb-4">
        <button
          onClick={() => navigate('home')}
          className="w-10 h-10 rounded-full bg-white/60 border border-white/80 backdrop-blur-md flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>
        <span className="text-sm font-black text-zinc-850 tracking-tight">Risk Profiling</span>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col justify-start pt-2 items-center z-10">
        <AnimatePresence>
          {!isComplete ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-4 text-center items-center w-full"
            >
              <div className="mb-2">
                <h2 className="text-2xl font-black text-zinc-950 leading-tight">Swipe Scenarios</h2>
                <p className="text-xs text-zinc-400 font-bold mt-1.5 leading-normal max-w-[280px]">
                  Swipe left/right, or tap the buttons below to make your decision.
                </p>
              </div>

              {/* Card Progress Indicator */}
              <div className="flex flex-col items-center gap-1.5 mb-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  {cards.length} {cards.length === 1 ? 'card' : 'cards'} remaining
                </span>
                <div className="flex gap-1.5 mt-1">
                  {SCENARIOS.map((_, i) => {
                    const isCompleted = i < SCENARIOS.length - cards.length;
                    const isCurrent = i === SCENARIOS.length - cards.length;
                    return (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isCurrent
                            ? 'w-6 bg-brand-primary'
                            : isCompleted
                            ? 'w-2 bg-emerald-500'
                            : 'w-2 bg-zinc-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Tinder Card Stack */}
              <div className="relative w-full max-w-[320px] h-[320px] mt-2 flex items-center justify-center">
                {cards.map((scenario, index) => (
                  <SwipeCardComponent
                    key={scenario.id}
                    scenario={scenario}
                    stackIndex={index}
                    isTop={index === 0}
                    onSwipe={handleSwipe}
                    swipeTopCardRef={swipeTopCardRef}
                    onSwipeStart={() => setIsSwiping(true)}
                  />
                ))}
                {cards.length === 0 && (
                  <div className="text-zinc-300 font-bold text-sm flex flex-col items-center gap-2">
                    <ShieldAlert className="w-12 h-12 stroke-[1.5]" />
                    <span>Analyzing results...</span>
                  </div>
                )}
              </div>

              {/* Swipe / Action Buttons */}
              {cards.length > 0 && (
                <div className="flex justify-center items-center gap-6 mt-6 z-20">
                  <button
                    onClick={() => handleButtonClick('left')}
                    disabled={isSwiping}
                    className="w-14 h-14 rounded-full bg-white hover:bg-red-50 text-red-500 border border-zinc-200 hover:border-red-200 shadow-md flex items-center justify-center transition-all active:scale-90 duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    aria-label="Not for me"
                  >
                    <X className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => handleButtonClick('right')}
                    disabled={isSwiping}
                    className="w-14 h-14 rounded-full bg-white hover:bg-emerald-50 text-emerald-500 border border-zinc-200 hover:border-emerald-200 shadow-md flex items-center justify-center transition-all active:scale-90 duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    aria-label="I'd do this"
                  >
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-[340px] mx-auto"
            >
              <GlassCard className="px-6 py-8 text-center flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-bounce">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-zinc-900 leading-tight">Profile Analyzed</h2>
                  <p className="text-xs text-zinc-400 font-semibold mt-1">
                    Based on your scenario decisions, your profile is:
                  </p>
                </div>

                <div className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${profile.color} text-white font-black text-base shadow-md uppercase tracking-wider`}>
                  {profile.badge}
                </div>

                <p className="text-xs text-zinc-500 font-semibold leading-relaxed px-2">
                  {profile.description}
                </p>

                <button
                  onClick={handleProceedToPlanDetails}
                  className="w-full h-12 mt-2 bg-brand-primary hover:bg-[#c11e15] text-white font-bold rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-md shadow-brand-primary/20 flex items-center justify-center gap-1.5"
                >
                  <span>View Plan Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RiskProfilingPage;
