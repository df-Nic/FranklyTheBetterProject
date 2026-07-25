import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';

const SCENARIOS = [
  {
    id: 'market-dip',
    headline: 'Market Dip Correction',
    description: "Your S$100,000 investment portfolio drops by S$20,000 during a sharp market correction. Do you keep holding your assets and buy more shares at a discount?"
  },
  {
    id: 'windfall',
    headline: 'Windfall Bonus allocation',
    description: "You receive an unexpected S$10,000 cash bonus. Do you invest it all in high-growth global equity Robo portfolios instead of safe deposits?"
  },
  {
    id: 'speculative',
    headline: 'Speculative Asset Growth',
    description: "A high-risk asset class offers a potential 50% return in 3 months, with a high risk of dropping to zero. Do you allocate a portion of your portfolio to it?"
  }
];

const SwipeCardComponent = ({ scenario, stackIndex, isTop, onSwipe }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Interpolations based on x drag distance
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const borderWidth = useTransform(x, [-100, 0, 100], [2.5, 1, 2.5]);
  const contentOpacity = useTransform(x, [-15, 0, 15], [0, 1, 0]);
  const borderColor = useTransform(x, [-100, 0, 100], [
    'rgba(225, 37, 27, 0.8)', // brand red for left swipe
    'rgba(0, 0, 0, 0.07)',
    'rgba(76, 175, 80, 0.8)' // green for right swipe
  ]);

  const stackScale = 1 - stackIndex * 0.04;
  const stackTranslateY = stackIndex * 14;

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    const velocityThreshold = 200;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      // Swipe Right: Agree / Yes
      animate(x, 400, { duration: 0.2 }).then(() => {
        onSwipe(scenario.id, 'right');
      });
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      // Swipe Left: Disagree / No
      animate(x, -400, { duration: 0.2 }).then(() => {
        onSwipe(scenario.id, 'left');
      });
    } else {
      // Snap back to center
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 26 });
      animate(y, 0, { type: 'spring', stiffness: 300, damping: 26 });
    }
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '100%',
        x: isTop ? x : 0,
        y: isTop ? y : stackTranslateY,
        rotate: isTop ? rotate : 0,
        scale: isTop ? 1 : stackScale,
        zIndex: 10 - stackIndex,
        transformOrigin: 'bottom center',
        pointerEvents: isTop ? 'auto' : 'none'
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: -300, right: 300 }}
      onDragEnd={handleDragEnd}
      animate={!isTop ? { y: stackTranslateY, scale: stackScale } : undefined}
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
  const { navigate, setPage, activePlanId, activePlanTitle, setClickPos, setPlanDetailOrigin } = useApp();
  const [cards, setCards] = useState(SCENARIOS);
  const [decisions, setDecisions] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const handleSwipe = (id, direction) => {
    setDecisions(prev => ({ ...prev, [id]: direction }));
    setCards(prev => {
      const remaining = prev.filter(c => c.id !== id);
      if (remaining.length === 0) {
        setIsComplete(true);
      }
      return remaining;
    });
  };

  const getRiskProfile = () => {
    const agreeCount = Object.values(decisions).filter(d => d === 'right').length;
    if (agreeCount === 3) {
      return {
        badge: 'Aggressive Growth',
        description: 'You prioritize long-term growth and are comfortable riding out high market volatility for maximum returns.',
        color: 'from-orange-500 to-red-600',
        text: 'text-red-500'
      };
    } else if (agreeCount >= 1) {
      return {
        badge: 'Balanced Wealth',
        description: 'You seek a stable mix of capital growth and income, accepting moderate market fluctuations.',
        color: 'from-amber-500 to-orange-500',
        text: 'text-amber-500'
      };
    } else {
      return {
        badge: 'Conservative Safety',
        description: 'You prioritize wealth preservation, preferring steady capital and low-risk interest yields.',
        color: 'from-emerald-500 to-teal-600',
        text: 'text-emerald-500'
      };
    }
  };

  const profile = getRiskProfile();

  const handleProceedToPlanDetails = (e) => {
    if (e) {
      setClickPos({ x: e.clientX, y: e.clientY });
    } else {
      setClickPos({ x: 195, y: 422 });
    }
    setPlanDetailOrigin('home');
    setPage('plan-details');
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative px-6 py-6 overflow-y-auto no-scrollbar select-none text-zinc-800">
      {/* Background Orb */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <BackgroundOrb color="peach" size="300px" className="-top-12 -right-12" />
      </div>

      {/* Header */}
      <div className="w-full flex items-center justify-between z-10 shrink-0 mb-6">
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
      <div className="flex-1 flex flex-col justify-center z-10">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-4 text-center items-center"
            >
              <div className="mb-2">
                <h2 className="text-2xl font-black text-zinc-950 leading-tight">Swipe Scenarios</h2>
                <p className="text-xs text-zinc-400 font-bold mt-1.5 leading-normal max-w-[280px]">
                  Swipe cards to indicate your financial decisions in different market scenarios
                </p>
              </div>

              {/* Tinder Card Stack */}
              <div className="relative w-full max-w-[320px] h-[340px] mt-4 flex items-center justify-center">
                {cards.map((scenario, index) => (
                  <SwipeCardComponent
                    key={scenario.id}
                    scenario={scenario}
                    stackIndex={index}
                    isTop={index === 0}
                    onSwipe={handleSwipe}
                  />
                ))}
                {cards.length === 0 && (
                  <div className="text-zinc-300 font-bold text-sm flex flex-col items-center gap-2">
                    <ShieldAlert className="w-12 h-12 stroke-[1.5]" />
                    <span>Analyzing results...</span>
                  </div>
                )}
              </div>
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
