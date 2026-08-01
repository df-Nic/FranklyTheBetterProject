import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const POSITIONS = {
  cashflow: 'left-3 top-[42%]',
  yield: 'right-3 top-[42%]',
  sequencing: 'left-3 bottom-3',
};

export default function ArenaSpeechBubble({ speech }) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {speech?.shortText && (
        <motion.div
          key={`${speech.agentId}-${speech.clock}`}
          className={`pointer-events-none absolute z-20 max-w-[132px] rounded-xl border border-white/80 bg-white/95 px-2.5 py-2 shadow-[0_4px_14px_rgba(44,34,28,0.14)] ${POSITIONS[speech.agentId]}`}
          initial={reduce ? false : { opacity: 0, y: 5, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: -3, scale: 0.98 }}
          transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
          role="status"
        >
          <span className="block text-[8px] font-black uppercase tracking-[0.1em] text-[#8B1A22]">
            {speech.agentId === 'yield' ? 'Asset Yield' : speech.agentId === 'cashflow' ? 'Cashflow' : 'Sequencing'}
          </span>
          <span className="mt-0.5 block text-[10px] font-bold leading-snug text-[#2B2320]">{speech.shortText}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
