import { AnimatePresence } from 'framer-motion';
import LeaderboardRow from './LeaderboardRow.jsx';

const UNRANKED_AGENTS = [
  { agentId: 'cashflow', rank: null, reason: 'Running first-round tests', trend: null },
  { agentId: 'yield', rank: null, reason: 'Running first-round tests', trend: null },
  { agentId: 'sequencing', rank: null, reason: 'Running first-round tests', trend: null },
];

export default function LeaderboardPanel({ leaderboard, completed = false }) {
  const rows = leaderboard.length ? leaderboard : UNRANKED_AGENTS;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-semibold text-[#8B1A22] tracking-[0.10em] uppercase">{completed ? 'Final Leaderboard' : 'Live Leaderboard'}</span>
      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {rows.map((row) => <LeaderboardRow key={row.agentId} row={row} />)}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-1 pt-1">
        {completed ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-[#1F7A4D]" />
            <span className="text-[9px] font-medium text-[#1F7A4D]">Evaluation complete</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-[#8B1A22] animate-spin motion-reduce:animate-none" />
            <span className="text-[9px] text-gray-400">Results updating in real time...</span>
          </>
        )}
      </div>
    </div>
  );
}
