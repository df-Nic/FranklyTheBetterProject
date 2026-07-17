import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Coins,
  TrendingUp,
  ShieldCheck,
  Gift,
  Scissors,
  ShieldAlert,
  Compass
} from 'lucide-react';

const cardVariants = {
  front: {
    scale: 1,
    y: 0,
    opacity: 1,
    rotate: 0,
    transition: { 
      type: "spring", stiffness: 300, damping: 25
    }
  },
  middle: {
    scale: 0.94,
    y: 12,
    opacity: 0.9,
    rotate: 0,
    transition: { 
      type: "spring", stiffness: 300, damping: 25
    }
  },
  bottom: {
    scale: 0.88,
    y: 24,
    opacity: 0.7,
    rotate: 0,
    transition: { 
      type: "spring", stiffness: 300, damping: 25
    }
  }
};

// Sub-component to manage local drag coordinates and layout animation cycles
const DeckCard = ({ 
  cat, 
  stackIdx, 
  pendingExcluded, 
  toggleAction, 
  onSwipeRight, 
  onSwipeLeft, 
  incomingCardId, 
  outgoingCardId,
  isAnimating,
  registerMotionValue,
  getBottomCardX,
  isReadOnly = false
}) => {
  const isFront = stackIdx === 0;
  const isMiddle = stackIdx === 1;
  const isBottom = stackIdx === 2;
  const isOutgoing = cat.id === outgoingCardId;
  const isIncoming = cat.id === incomingCardId;

  // Local motion value for horizontal offsets
  const x = useMotionValue(0);

  // Register motion value with parent on mount/change
  useEffect(() => {
    registerMotionValue(cat.id, x);
    return () => {
      registerMotionValue(cat.id, null);
    };
  }, [cat.id, x, registerMotionValue]);

  // Imperatively animate coordinates
  useEffect(() => {
    if (isOutgoing) {
      // Animate off-screen right
      animate(x, 350, { type: "spring", stiffness: 300, damping: 26 });
    } else if (isIncoming && isFront) {
      // Set to off-screen left instantly if not already positioned by drag, then spring in
      x.stop();
      if (x.get() === 0) {
        x.set(-350);
      }
      animate(x, 0, { type: "spring", stiffness: 300, damping: 26 });
    } else if (!isFront) {
      // For background cards, animate back to 0 if they were offset,
      // or snap to 0 if they just transitioned to bottom from outgoing.
      if (x.get() !== 0) {
        if (x.get() > 300 || x.get() < -300) {
          x.stop();
          x.set(0);
        } else {
          animate(x, 0, { type: "spring", stiffness: 300, damping: 26 });
        }
      }
    }
  }, [stackIdx, isOutgoing, isIncoming, isFront, cat.id, x]);

  const handleDrag = (event, info) => {
    if (isFront) {
      const bottomCardX = getBottomCardX();
      if (bottomCardX) {
        if (info.offset.x < 0) {
          // Slide bottom card in from left interactively
          const targetX = Math.min(0, -350 - info.offset.x * 2.2);
          bottomCardX.set(targetX);
        } else {
          // When swiping right, keep the bottom card centered in the stack
          bottomCardX.set(0);
        }
      }
    }
  };

  const handleDragEnd = (event, info) => {
    const threshold = 60;
    const velocityThreshold = 150;
    
    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipeRight();
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipeLeft();
    } else {
      // If drag is canceled, animate both cards back to center (0)
      const bottomCardX = getBottomCardX();
      if (bottomCardX) {
        animate(bottomCardX, 0, { type: "spring", stiffness: 300, damping: 26 });
      }
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Coins': return <Coins className="w-[18px] h-[18px] stroke-[2.2]" />;
      case 'TrendingUp': return <TrendingUp className="w-[18px] h-[18px] stroke-[2.2]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-[18px] h-[18px] stroke-[2.2]" />;
      case 'Gift': return <Gift className="w-[18px] h-[18px] stroke-[2.2]" />;
      case 'Scissors': return <Scissors className="w-[18px] h-[18px] stroke-[2.2]" />;
      case 'ShieldAlert': return <ShieldAlert className="w-[18px] h-[18px] stroke-[2.2]" />;
      default: return <Compass className="w-[18px] h-[18px] stroke-[2.2]" />;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      animate={isFront ? "front" : isMiddle ? "middle" : "bottom"}
      drag={isFront && !isAnimating ? "x" : false}
      dragConstraints={isFront ? { left: 0, right: 350 } : { left: 0, right: 0 }}
      dragElastic={isFront ? { left: 0, right: 0.6 } : 0.6}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      style={{
        position: 'absolute',
        width: '100%',
        height: '245px',
        top: 0,
        x, // Bind to local motion value
        zIndex: isFront ? 30 : isMiddle ? 20 : 10,
        pointerEvents: isFront ? 'auto' : 'none',
        transformOrigin: 'bottom center',
      }}
      className="bg-white border border-zinc-200/40 rounded-[28px] p-4.5 shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between"
    >
      {/* Card Category Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            {renderCategoryIcon(cat.icon)}
          </div>
          <div className="flex flex-col">
            <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest leading-none">RECOMMENDATIONS</span>
            <span className="text-xs font-black text-zinc-900 tracking-tight mt-0.5">{cat.name}</span>
          </div>
        </div>
        <div className="px-2.5 py-1 bg-zinc-100/70 border border-zinc-200/30 rounded-full text-[8.5px] font-extrabold text-zinc-500">
          {cat.actions.filter(a => !pendingExcluded.has(a.id)).length}/{cat.actions.length} Active
        </div>
      </div>

      {/* Card Actions List */}
      <div className="flex flex-col gap-2.5 mt-3 flex-1 justify-center overflow-visible">
        {cat.actions.map(action => {
          const isExcluded = pendingExcluded.has(action.id);
          return (
            <div
              key={action.id}
              onClick={() => !isReadOnly && toggleAction(action.id)}
              className={`p-2.5 rounded-2xl border text-left flex gap-3 items-start transition-all duration-300 ${
                isExcluded
                  ? 'bg-zinc-200/20 border-zinc-300/20 opacity-40 grayscale blur-[0.4px]'
                  : `bg-white border-zinc-200/50 ${isReadOnly ? '' : 'hover:border-zinc-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] cursor-pointer'}`
              }`}
            >
              {/* Visual Toggle Circle */}
              {!isReadOnly ? (
                <div className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                  isExcluded
                    ? 'bg-zinc-300 border-zinc-400 text-transparent'
                    : 'bg-brand-primary border-brand-primary text-white'
                }`}>
                  {!isExcluded && <CheckCircle2 className="w-3.5 h-3.5 fill-current stroke-[2.5]" />}
                </div>
              ) : (
                <div className="w-[18px] h-[18px] rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-brand-primary">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-current stroke-[2.5]" />
                </div>
              )}

              {/* Action text content */}
              <div className="flex flex-col">
                <span className={`text-[10px] font-extrabold tracking-tight ${isExcluded ? 'text-zinc-400 line-through' : 'text-zinc-800'}`}>
                  {action.name}
                </span>
                <p className="text-[9px] text-zinc-400 font-semibold leading-snug mt-0.5">
                  {action.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const PlanCardDeck = ({ categories, pendingExcluded, toggleAction, isReadOnly = false }) => {
  // Track stack ordering locally
  const [stack, setStack] = useState(() => categories.map(c => c.id));
  const [incomingCardId, setIncomingCardId] = useState(null);
  const [outgoingCardId, setOutgoingCardId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Maintain references to children's motion values
  const cardMotionValues = useRef({});
  const registerMotionValue = (id, mv) => {
    if (mv) {
      cardMotionValues.current[id] = mv;
    } else {
      delete cardMotionValues.current[id];
    }
  };

  const getBottomCardX = () => {
    const bottomCardId = stack[2];
    return cardMotionValues.current[bottomCardId];
  };

  // Sync stack ordering if active goal categories change
  useEffect(() => {
    setStack(categories.map(c => c.id));
    setIncomingCardId(null);
    setOutgoingCardId(null);
    setIsAnimating(false);
  }, [categories]);

  const cycleForward = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const currentTopId = stack[0];
    setOutgoingCardId(currentTopId);
    
    setTimeout(() => {
      setStack(prev => [prev[1], prev[2], prev[0]]);
      setOutgoingCardId(null);
      setIsAnimating(false);
    }, 300);
  };

  const cycleBackward = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const bottomCardId = stack[2];
    setIncomingCardId(bottomCardId);
    
    // Synchronously position the incoming card offscreen-left before stack state update to prevent rendering flicker
    const bottomCardX = cardMotionValues.current[bottomCardId];
    if (bottomCardX) {
      bottomCardX.stop();
      if (bottomCardX.get() === 0) {
        bottomCardX.set(-350);
      }
    }
    
    setStack(prev => [prev[2], prev[0], prev[1]]);
    
    setTimeout(() => {
      setIncomingCardId(null);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-3 shrink-0">
      {/* 3D Stack Frame Container */}
      <div className="relative w-full h-[285px] mt-1 shrink-0 select-none">
        {[...categories]
          .sort((a, b) => {
            const idxA = stack.indexOf(a.id);
            const idxB = stack.indexOf(b.id);
            return idxB - idxA; // Render bottom card first, top card last in DOM order for mobile WebKit GPU stacking compatibility
          })
          .map((cat) => {
            const stackIdx = stack.indexOf(cat.id);
            if (stackIdx === -1) return null;

            return (
              <DeckCard
                key={cat.id}
                cat={cat}
                stackIdx={stackIdx}
                pendingExcluded={pendingExcluded}
                toggleAction={toggleAction}
                onSwipeRight={cycleForward}
                onSwipeLeft={cycleBackward}
                incomingCardId={incomingCardId}
                outgoingCardId={outgoingCardId}
                isAnimating={isAnimating}
                registerMotionValue={registerMotionValue}
                getBottomCardX={getBottomCardX}
                isReadOnly={isReadOnly}
              />
            );
          })}
      </div>

      {/* Pagination Dot Navigation */}
      <div className="flex items-center justify-between px-2 z-20 relative shrink-0">
        <button
          onClick={cycleBackward}
          disabled={isAnimating}
          className="w-8 h-8 rounded-full bg-white border border-zinc-200/50 flex items-center justify-center text-zinc-700 active:scale-90 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
        </button>
        
        {/* Pagination Dots */}
        <div className="flex gap-1.5 items-center">
          {categories.map((cat) => {
            const stackIndex = stack.indexOf(cat.id);
            return (
              <span
                key={cat.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  stackIndex === 0
                    ? 'w-5 bg-brand-primary'
                    : 'w-1.5 bg-zinc-300'
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={cycleForward}
          disabled={isAnimating}
          className="w-8 h-8 rounded-full bg-white border border-zinc-200/50 flex items-center justify-center text-zinc-700 active:scale-90 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
};

export default PlanCardDeck;
