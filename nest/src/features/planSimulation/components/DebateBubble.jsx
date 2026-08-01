import { motion, useReducedMotion } from 'framer-motion';
import AgentOwl from './AgentOwl.jsx';

const AGENT_NAMES = { cashflow: 'Cashflow Lever', yield: 'Asset Yield Lever', sequencing: 'Sequencing Lever' };

export default function DebateBubble({ entry }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="flex gap-2"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }}
    >
      <AgentOwl variant={entry.agentId} size={32} crop="head" title={AGENT_NAMES[entry.agentId]} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className="text-[11px] font-semibold text-gray-900">{AGENT_NAMES[entry.agentId]}</span>
          <span className="text-[9px] text-gray-400">{entry.clock}</span>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl rounded-tl-sm px-2.5 py-2">
          <p className="text-[11px] text-gray-700 leading-snug">{entry.text}</p>
        </div>
      </div>
    </motion.div>
  );
}
