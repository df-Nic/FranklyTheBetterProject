import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ReplanOverlay = ({ isOpen, stepText, progress }) => {
  const curtainVariants = {
    initial: { x: "-100%" },
    animate: { x: "0%" },
    exit: { x: "100%" }
  };

  const springTransition = { type: "spring", stiffness: 90, damping: 20 };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
          {/* Scoped Single Curtain Panel (OCBC Red) */}
          <motion.div
            variants={curtainVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={springTransition}
            className="absolute inset-0 bg-[#E1251B] pointer-events-auto flex flex-col items-center justify-center p-6 text-center shadow-2xl"
          >
            {/* Pulsing Sparkles Icon */}
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-6 shadow-lg border border-white/20 animate-pulse">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            {/* Replan Status Headers */}
            <h3 className="text-xl font-black text-white tracking-tight leading-snug">
              Optimizing Your Wealth Plan
            </h3>
            <p className="text-xs text-white font-bold tracking-tight mt-2.5 max-w-[280px] leading-relaxed">
              A new plan is being made with your suggestions in consideration.
            </p>
            <p className="text-xs text-white/70 font-semibold tracking-tight mt-2 max-w-[280px] italic">
              {stepText}
            </p>

            {/* Vue-Style Loading Progress Bar */}
            <div className="w-[240px] mt-8 flex flex-col gap-2">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-white/90 font-bold tracking-wider px-0.5">
                <span>AI REPLANNING</span>
                <span>{progress}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReplanOverlay;
