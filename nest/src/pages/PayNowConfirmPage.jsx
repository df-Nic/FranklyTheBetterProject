import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronsRight, Sparkles, Check } from 'lucide-react';
import { getMilestonePlan } from '../data/milestonePlans';
import { useApp } from '../context/AppContext';
import BackgroundOrb from '../components/ui/BackgroundOrb';
import GlassCard from '../components/ui/GlassCard';

const PayNowConfirmPage = () => {
  const {
    navigate,
    paynowContact,
    paynowAmount,
    paynowReference,
    paynowSourceAccount,
    accountsData,
    setPage,
    createdPlans,
    activePlanId,
    adjustPlan
  } = useApp();

  const [sliderWidth, setSliderWidth] = useState(0);
  const [isHealing, setIsHealing] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);
  const [healingStepText, setHealingStepText] = useState('');
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  // Dynamic selection of plan and course of action once per checkout page mount
  const [selectedPlanId] = useState(() => {
    if (createdPlans && createdPlans.length > 0) {
      const idx = Math.floor(Math.random() * createdPlans.length);
      return createdPlans[idx];
    }
    return 'wedding-fund';
  });

  const [chosenStrategy] = useState(() => {
    const strategies = ['deposit', 'timeline', 'yield', 'sweep'];
    return strategies[Math.floor(Math.random() * strategies.length)];
  });

  // Recipient details
  const name = paynowContact?.name || 'Ivan Heng';
  const detailString = paynowContact
    ? `${paynowContact.phone}${paynowContact.vpa ? ` • ${paynowContact.vpa}` : ''}`
    : '+65 88888888 • Ivanhengsj';

  const amountDisplay = parseFloat(paynowAmount || '0').toFixed(2);

  // Framer motion drag setup
  const dragX = useMotionValue(0);
  const handleWidth = 48; // width of drag handle is 48px (w-12)
  const padding = 6; // track padding p-1.5 is 6px
  const maxDrag = sliderWidth - handleWidth - padding * 2;

  const targetMax = maxDrag > 0 ? maxDrag : 1;

  // Transform drag distance into progress width
  // At x = 0, width is 0px (no red background visible at all)
  // At x > 0, width follows the right edge of the circle (dragX + handleWidth + padding)
  // At x = maxDrag, width is the full sliderWidth to completely fill the track
  const progressWidth = useTransform(
    dragX,
    [0, 1, targetMax],
    [0, 55, sliderWidth]
  );

  // Transform drag distance into text opacity (fade out text as slider moves right)
  const textOpacity = useTransform(dragX, [0, targetMax * 0.7], [1, 0]);

  // Transform drag distance into "Make payment" text opacity (fade in as slider moves right)
  const makePaymentOpacity = useTransform(dragX, [targetMax * 0.3, targetMax * 0.8], [0, 1]);

  // Update slider width on mount / resize
  useEffect(() => {
    if (trackRef.current) {
      setSliderWidth(trackRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (trackRef.current) {
        setSliderWidth(trackRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasPlan = createdPlans && createdPlans.length > 0;
  const isTargetAmount = parseFloat(paynowAmount || '0') >= 3000;
  const showHealerWarning = hasPlan && isTargetAmount;

  const selectedPlan = getMilestonePlan(selectedPlanId);
  const planName = selectedPlan.goalName || 'Wedding Fund';
  const baseContribution = selectedPlan.monthlyContribution || 1200;
  const baseDate = selectedPlan.goalDate || 'Dec 2027';

  const numPaynowAmount = parseFloat(paynowAmount || '0');
  const dynamicNewContribution = Math.round(baseContribution + numPaynowAmount * 0.06);
  const formattedNewContribution = dynamicNewContribution.toLocaleString('en-SG');

  const EXTENDED_DATES = {
    'wedding-fund': '15 Feb 2028',
    'savings': 'May 2028',
    'retirement': 'Dec 2045',
    'emergency': 'Feb 2027',
    'default': 'Mar 2030'
  };
  const extendedDate = EXTENDED_DATES[selectedPlanId] || '2 months delayed';

  const healerStrategies = [
    {
      id: 'deposit',
      title: 'Adjust Monthly Deposit (AI Recommended)',
      description: `Increase monthly savings from S$${baseContribution.toLocaleString('en-SG')} to S$${formattedNewContribution} to secure your target date of ${baseDate}.`,
    },
    {
      id: 'timeline',
      title: 'Extend Plan Duration',
      description: `Maintain S$${baseContribution.toLocaleString('en-SG')}/mo savings, but extend the target goal date by 2 months (from ${baseDate} to ${extendedDate}).`,
    },
    {
      id: 'yield',
      title: 'Optimize Asset Yields',
      description: `Reallocate S$${numPaynowAmount.toLocaleString('en-SG')} from lower-yield savings (0.05% p.a.) to OCBC 360 Account (4.65% p.a.) to earn the difference.`,
    },
    {
      id: 'sweep',
      title: 'Enable Cash-Flow Auto-Sweeps',
      description: `Link everyday spending accounts to sweep extra cashback (est. S$85/mo) into your ${planName} to absorb the gap.`,
    }
  ];

  const handleDragEnd = (event, info) => {
    // If user dragged it to at least 92% of the way, confirm transaction
    if (dragX.get() >= maxDrag * 0.92) {
      // Complete transaction: subtract balance from source account
      if (paynowSourceAccount) {
        paynowSourceAccount.balance -= parseFloat(paynowAmount);
      }
      
      if (showHealerWarning) {
        setIsHealing(true);
        setHealingProgress(10);
        setHealingStepText("Intercepting transaction impact...");

        const activeStrategy = healerStrategies.find(s => s.id === chosenStrategy);
        const steps = [
          { text: `Detecting S$${amountDisplay} funding gap on ${planName}...`, progress: 30 },
          { text: "Evaluating 4 recovery models...", progress: 50 },
          { text: `Executing Selected Strategy: ${activeStrategy.title}...`, progress: 85 },
          { text: "Applying final plan updates...", progress: 100 }
        ];

        steps.forEach((step, idx) => {
          setTimeout(() => {
            setHealingStepText(step.text);
            setHealingProgress(step.progress);
            if (step.progress === 100) {
              // Persist healer action in context
              adjustPlan(selectedPlanId, {
                healed: true,
                strategy: chosenStrategy,
                monthlyContribution: dynamicNewContribution,
                goalDate: extendedDate,
                selectedPlanId: selectedPlanId
              });
              setTimeout(() => {
                setIsHealing(false);
                navigate('paynow-success');
              }, 600);
            }
          }, (idx + 1) * 800);
        });
      } else {
        // Navigate to success page
        navigate('paynow-success');
      }
    } else {
      // Smoothly animate back to start using Framer Motion's spring animate
      animate(dragX, 0, { type: 'spring', damping: 25, stiffness: 220 });
    }
  };

  return (
    <div className="flex-1 w-full bg-[#F5F5F7] flex flex-col relative overflow-hidden select-none">
      {/* Background Orbs */}
      <BackgroundOrb color="pink" size="320px" className="-top-10 -right-10" />
      <BackgroundOrb color="peach" size="240px" className="bottom-10 -left-10" />

      {/* Header */}
      <header className="pt-6 pb-4 h-auto w-full bg-white/40 backdrop-blur-xl border-b border-white/30 px-4 flex items-center justify-between z-40 shrink-0 sticky top-0">
        <button
          onClick={() => navigate('paynow-amount')}
          className="w-9 h-9 rounded-full bg-white border border-zinc-200/60 flex items-center justify-center text-zinc-700 active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeft className="w-[18px] h-[18px] stroke-[2.5]" />
        </button>
        <div className="w-9 h-9" /> {/* Spacer */}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 flex flex-col gap-6 z-10">
        
        {/* Review amount block */}
        <div className="flex flex-col gap-1 px-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Review payment of</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-4xl font-black text-zinc-900 tracking-tight">{amountDisplay}</span>
            <span className="text-base font-black text-zinc-400 tracking-tight">SGD</span>
          </div>
        </div>

        {/* Transaction Cards details */}
        <div className="flex flex-col gap-4">
          
          {/* Target Card: has standard red vertical highlight on left */}
          <div className="flex items-stretch bg-white border border-zinc-200/50 rounded-2xl overflow-hidden shadow-sm shadow-zinc-200/20">
            {/* The vertical red bar on left side matching Screenshot 3! */}
            <div className="w-1.5 bg-brand-primary" />
            
            <div className="p-4 flex flex-col gap-1.5 flex-1 justify-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Pay to</span>
              <h4 className="text-sm font-black text-zinc-900 leading-tight tracking-tight mt-0.5">{name}</h4>
              <p className="text-[10px] font-semibold text-zinc-400 leading-none">{detailString}</p>
            </div>
          </div>

          {/* Source Card */}
          <GlassCard className="p-4 border-white/70 flex flex-col gap-1.5 justify-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">From</span>
            <h4 className="text-sm font-black text-zinc-900 leading-tight tracking-tight mt-0.5">
              {paynowSourceAccount?.name || '360 Account'}
            </h4>
            <p className="text-[10px] font-semibold text-zinc-400 leading-none">
              {paynowSourceAccount?.number || '001-23456-789'}
            </p>
          </GlassCard>

          {/* Reference Card (if provided) */}
          {paynowReference && (
            <GlassCard className="p-4 border-white/70 flex flex-col gap-1.5 justify-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none">Reference</span>
              <h4 className="text-xs font-bold text-zinc-800 leading-tight">{paynowReference}</h4>
            </GlassCard>
          )}

        </div>

        {/* Striking Warning Card */}
        {showHealerWarning && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/30 rounded-2xl p-4 flex flex-col gap-2.5 relative overflow-hidden shadow-md shrink-0 animate-fade-in"
          >
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-500/20 flex items-center justify-center text-brand-primary animate-pulse shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest leading-none">Nest AI Healer Alert</span>
                <span className="text-xs font-black text-zinc-900 tracking-tight mt-0.5">Plan Impact Detected</span>
              </div>
            </div>

            <p className="text-[11px] font-bold text-zinc-700 leading-relaxed">
              This transaction of <span className="text-zinc-950 font-black">S$${amountDisplay}</span> will reduce your savings balance below the required threshold for your active <span className="text-zinc-950 font-black">{planName}</span>.
            </p>

            <div className="bg-white/70 rounded-xl p-3 border border-red-500/10 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 border-b border-zinc-200/50 pb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-zinc-800">
                  Impact: <span className="text-brand-primary font-extrabold">Off-Track (Behind by S$${amountDisplay})</span>
                </span>
              </div>

              {/* Healer Selected Strategy Card */}
              {(() => {
                const strat = healerStrategies.find(s => s.id === chosenStrategy);
                if (!strat) return null;
                return (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">AI Recommended Course of Action:</span>
                    <div className="p-3 rounded-xl border border-emerald-500 bg-emerald-500/[0.03] shadow-sm shadow-emerald-500/5 flex flex-col gap-1.5 relative">
                      <span className="absolute top-2.5 right-2.5 text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-emerald-500 text-white rounded flex items-center gap-0.5 animate-pulse">
                        <Check className="w-2 h-2 stroke-[4]" />
                        <span>AI Selection</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[9.5px] font-black text-zinc-800">{strat.title}</span>
                      </div>
                      <p className="text-[9.5px] text-zinc-500 font-semibold leading-relaxed pl-3 pr-10">
                        {strat.description}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* Warning text */}
        <div className="mt-auto pt-6 flex flex-col gap-4 items-center">
          <p className="text-[10px] font-semibold text-zinc-400 text-center max-w-[250px] leading-normal">
            Please check that all details are correct before proceeding.
          </p>

          {/* Custom Slide to Pay Component */}
          <div
            ref={trackRef}
            className="w-full h-[58px] bg-brand-secondary rounded-full relative flex items-center p-1.5 select-none overflow-hidden shadow-md shadow-brand-secondary/20"
          >
            {/* Sliding background progress indicator */}
            <motion.div 
              className="absolute top-0 bottom-0 bg-brand-primary rounded-full pointer-events-none z-0"
              style={{ left: '0px', width: progressWidth }}
            />

            {/* Slider track text - default */}
            <motion.div
              style={{ opacity: textOpacity }}
              className="absolute inset-0 flex items-center justify-center text-white text-[12px] font-black tracking-wider pointer-events-none z-10"
            >
              Slide to pay
            </motion.div>

            {/* Slider track text - active drag */}
            <motion.div
              style={{ opacity: makePaymentOpacity }}
              className="absolute inset-0 flex items-center justify-center text-white text-[12px] font-black tracking-wider pointer-events-none z-10"
            >
              Make payment
            </motion.div>

            {/* Draggable thumb/handle */}
            <motion.div
              ref={handleRef}
              drag="x"
              dragConstraints={{ left: 0, right: maxDrag }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              style={{ x: dragX }}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-secondary cursor-pointer shadow-md z-10 shrink-0"
            >
              <ChevronsRight className="w-5 h-5 stroke-[2.8]" />
            </motion.div>
          </div>
        </div>

      </div>

      {/* Full screen AI Progress Recalculator Overlay */}
      <AnimatePresence>
        {isHealing && (
          <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 90, damping: 20 }}
              className="absolute inset-0 bg-[#E1251B] pointer-events-auto flex flex-col items-center justify-center p-6 text-center shadow-2xl"
            >
              {/* Pulsing Sparkles Icon */}
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 shadow-lg border border-white/20 animate-pulse">
                <Sparkles className="w-7 h-7 text-white" />
              </div>

              {/* Replan Status Headers */}
              <h3 className="text-xl font-black text-white tracking-tight leading-snug">
                AI Healer Replanning
              </h3>
              <p className="text-xs text-white font-bold tracking-tight mt-2.5 max-w-[280px] leading-relaxed">
                Recalculating your {planName} to absorb the S$${amountDisplay} transaction impact.
              </p>
              <p className="text-xs text-white/70 font-semibold tracking-tight mt-2 max-w-[280px] italic">
                {healingStepText}
              </p>

              {/* Loading Progress Bar */}
              <div className="w-[240px] mt-8 flex flex-col gap-2">
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${healingProgress}%` }}
                    className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-white/90 font-bold tracking-wider px-0.5">
                  <span>HEALING PLAN</span>
                  <span>{healingProgress}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PayNowConfirmPage;
