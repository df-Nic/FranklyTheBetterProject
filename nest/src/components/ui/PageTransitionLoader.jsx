import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, animate, stagger } from 'framer-motion';

const LETTERS = ['N', 'E', 'S', 'T'];

const WavyLetter = ({ char, index }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const staggerDelay = 0.12;

    const controls = animate(
      [ref.current],
      { y: [-14, 14] },
      {
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        duration: 0.8,
        delay: stagger(staggerDelay, { startDelay: -staggerDelay * LETTERS.length })(index, LETTERS.length),
      }
    );

    return () => controls.stop();
  }, [index]);

  return (
    <span
      ref={ref}
      style={{ display: 'inline-block', willChange: 'transform' }}
      className="text-3xl font-black tracking-[0.15em] text-zinc-900"
    >
      {char}
    </span>
  );
};

const PageTransitionLoader = ({ visible }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm gap-6 pointer-events-auto"
        >
          {/* Wavy NEST letters */}
          <div className="flex items-center gap-0.5" aria-hidden="true">
            {LETTERS.map((char, i) => (
              <WavyLetter key={char} char={char} index={i} />
            ))}
          </div>

          {/* Thicker, wider progress bar */}
          <div className="w-36 h-1.5 rounded-full bg-zinc-200 overflow-hidden">
            <motion.div
              className="h-full bg-red-500 rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: '110%' }}
              transition={{ duration: 0.6, ease: 'easeInOut', repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransitionLoader;
