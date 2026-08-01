import { useEffect, useState } from 'react';
import { ChevronRight, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { getReasoningLog, listReasoningLogs } from '../../../lib/reasoningLogStore.js';
import { deriveStateAt } from '../engine/deriveStateAt.js';
import { AGENTS } from '../data/agents.js';
import { LITERACY_TAKEAWAYS } from '../data/literacyTakeaways.js';
import { buildCompletedPlanScript } from '../engine/buildCompletedPlanScript.js';

export default function ReasoningLogCard({ scriptId, planId, plan, onOpen }) {
  const [log, setLog] = useState(null);

  useEffect(() => {
    const exact = scriptId ? getReasoningLog(scriptId) : null;
    const latestForPlan = planId
      ? listReasoningLogs().find((candidate) => candidate.script?.planId === planId)
      : null;
    const completedPlanScript = buildCompletedPlanScript(plan);
    setLog(exact ?? latestForPlan ?? (completedPlanScript ? { script: completedPlanScript } : null));
  }, [plan, planId, scriptId]);

  if (!log?.script) return null;

  const finalState = deriveStateAt(log.script, log.script.durationMs);
  const winnerName = finalState.winner ? AGENTS[finalState.winner]?.name : 'Agent';
  const concept = finalState.takeaway
    ? LITERACY_TAKEAWAYS[finalState.takeaway.conceptId]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-[16px] border border-[#E4D8CE] bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C2230]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3E9EA]">
          <Scale size={17} className="text-[#7C2230]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-[#8A7F78]">Plan decision record</span>
          <span className="mt-0.5 block text-[12.5px] font-extrabold text-[#2B2320]">{log.script.request?.goalLabel ?? 'Your plan'}</span>
          <span className="mt-0.5 block truncate text-[9.5px] text-[#8A7F78]">
            {winnerName} won · {concept?.title ?? 'Trade-off analysis'}
          </span>
        </span>
        <ChevronRight size={16} className="shrink-0 text-[#C88A2E]" strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}
