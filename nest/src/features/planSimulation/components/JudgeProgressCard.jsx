import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AgentOwl from './AgentOwl.jsx';

export default function JudgeProgressCard({ judge, completed = false }) {
  const reduce = useReducedMotion();
  const pct = completed ? 100 : Math.round((judge.progress ?? 0) * 100);
  const evaluationMessage = pct < 35
    ? 'Comparing each agent\u2019s proposed strategy'
    : pct < 65
      ? 'Checking returns against the stress-test evidence'
      : pct < 85
        ? 'Weighing safety, growth, and timing trade-offs'
        : 'Combining all three agents\u2019 evidence into the final strategy';

  return (
    <AnimatePresence>
      {judge.visible && (
        <motion.div
          className="bg-white rounded-[--radius-card] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 12 }}
          transition={reduce ? { duration: 0 } : { duration: 0.45, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3 mb-3">
            <AgentOwl variant="judge" size={64} title="Judge Agent" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-gray-900 leading-snug">{completed ? 'Judge Agent completed the evaluation.' : 'Judge Agent is evaluating the evidence'}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{completed ? 'Strategy selected using evidence from all three agents.' : evaluationMessage}</p>
            </div>
            <div className="shrink-0 text-right">
              <motion.p
                className="text-[28px] font-black text-[#8B1A22] leading-none"
                animate={reduce || completed ? { opacity: 1 } : { opacity: [0.7, 1, 0.7] }}
                transition={reduce || completed ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                {pct}%
              </motion.p>
              <p className="text-[11px] text-gray-400">Complete</p>
            </div>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#8B1A22]"
              animate={{ width: `${pct}%` }}
              transition={reduce || completed ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
