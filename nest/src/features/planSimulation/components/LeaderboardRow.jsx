import { GitCommitHorizontal, Shield, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import AgentOwl from './AgentOwl.jsx';

const RANK_COLORS = { 1: 'bg-[#1F7A4D] text-white', 2: 'bg-[#8B1A22] text-white', 3: 'bg-[#B4632A] text-white' };
const TREND_ICONS = {
  up: <TrendingUp size={13} className="text-[#1F7A4D]" />,
  shield: <Shield size={13} className="text-[#1F7A4D]" />,
  dots: <GitCommitHorizontal size={13} className="text-[#B4632A]" />,
};
const AGENT_NAMES = { cashflow: 'Cashflow', yield: 'Asset Yield', sequencing: 'Sequencing' };

export default function LeaderboardRow({ row }) {
  const reduce = useReducedMotion();
  const isRanked = Number.isInteger(row.rank);

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: -16 }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
      className="flex items-center gap-1.5"
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isRanked ? RANK_COLORS[row.rank] : 'bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-200'}`}
        aria-label={isRanked ? `Rank ${row.rank}` : 'Not yet ranked'}
      >
        {isRanked ? row.rank : '—'}
      </div>
      <AgentOwl variant={row.agentId} size={32} crop="head" title={AGENT_NAMES[row.agentId]} />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-gray-900 leading-tight">{AGENT_NAMES[row.agentId]}</p>
        <p className="mt-0.5 text-[9px] leading-snug text-gray-500">{row.reason}</p>
      </div>
      <div className="shrink-0">{row.trend ? TREND_ICONS[row.trend] : null}</div>
    </motion.div>
  );
}
