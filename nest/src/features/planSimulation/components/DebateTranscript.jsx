import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LITERACY_TAKEAWAYS } from '../data/literacyTakeaways.js';
import DebateBubble from './DebateBubble.jsx';
import LiteracyTakeaway from './LiteracyTakeaway.jsx';

export default function DebateTranscript({ transcript, takeaway, completed = false }) {
  const reduce = useReducedMotion();
  const concept = takeaway ? LITERACY_TAKEAWAYS[takeaway.conceptId] : null;

  return (
    <div className="bg-white rounded-[--radius-card] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold text-[#8B1A22] tracking-[0.12em] uppercase">{completed ? 'Agent Decision Record' : 'Agent Debate Transcript'}</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-100">
          <span className={`w-1.5 h-1.5 rounded-full ${completed ? 'bg-[#1F7A4D]' : 'bg-[#8B1A22]'}`} />
          <span className={`text-[10px] font-semibold ${completed ? 'text-[#1F7A4D]' : 'text-[#8B1A22]'}`}>{completed ? 'COMPLETE' : 'LIVE CHAT'}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {transcript.map((entry, index) => (
              <DebateBubble key={`${entry.agentId}-${index}`} entry={entry} />
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {concept && (
            <motion.div
              key={concept.conceptId}
              className="w-full"
              initial={reduce ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
              transition={reduce ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
            >
              <LiteracyTakeaway concept={concept} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
