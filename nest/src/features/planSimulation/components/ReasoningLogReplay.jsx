import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSimulationRunner } from '../hooks/useSimulationRunner.js';
import { deriveStateAt } from '../engine/deriveStateAt.js';
import { AGENTS } from '../data/agents.js';
import { LITERACY_TAKEAWAYS } from '../data/literacyTakeaways.js';
import AgentOwl from './AgentOwl.jsx';
import DebateTranscript from './DebateTranscript.jsx';
import JudgeProgressCard from './JudgeProgressCard.jsx';
import LeaderboardPanel from './LeaderboardPanel.jsx';
import TelemetryPanel from './TelemetryPanel.jsx';
import StressCheckRow from './StressCheckRow.jsx';
import ConfidenceScoreNote from './ConfidenceScoreNote.jsx';

export default function ReasoningLogReplay({ script, mode: initialMode = 'static' }) {
  const [replaying, setReplaying] = useState(initialMode === 'replay');
  const reduce = useReducedMotion();
  const finalState = deriveStateAt(script, script.durationMs);
  const initialState = deriveStateAt(script, 0);
  const { state: replayState } = useSimulationRunner(
    replaying ? script : null,
    { onComplete: () => setReplaying(false) },
  );
  const state = replaying ? replayState ?? initialState : finalState;
  const winner = finalState.winner;
  const winnerName = winner ? AGENTS[winner]?.name : 'Winning agent';
  const concept = finalState.takeaway
    ? LITERACY_TAKEAWAYS[finalState.takeaway.conceptId]
    : null;

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {!replaying ? (
          <motion.section
            key="evaluation-complete"
            className="rounded-[18px] border border-[#E4D8CE] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <AgentOwl variant={winner} size={52} crop="head" title={winnerName} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-[#2E7D4F]">
                  <CheckCircle2 size={12} /> Evaluation complete
                </div>
                <h2 className="mt-1 text-[15px] font-extrabold">{winnerName} led the final strategy</h2>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#6D625B]">
                  {concept?.title ?? 'Trade-off analysis'} {'\u00b7'} {script.request?.goalLabel ?? 'Your goal'}
                </p>
              </div>
            </div>
          </motion.section>
        ) : state.judge.visible ? (
          <motion.div
            key="judge-evaluation"
            layout
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduce ? 0 : 0.38, ease: 'easeOut' }}
          >
            <JudgeProgressCard judge={state.judge} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-gray-400">{replaying ? '' : 'Completed record'}</span>
        <button
          type="button"
          disabled={replaying}
          onClick={() => setReplaying(true)}
          className="text-[11px] font-semibold text-[#8B1A22] hover:underline transition-colors disabled:cursor-default disabled:text-gray-400 disabled:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1A22]"
        >
          {replaying ? 'Replaying…' : '▶ Replay simulation'}
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-[#F8F4EF] p-3">
        <section className="rounded-xl bg-white p-3 shadow-[0_1px_5px_rgba(0,0,0,0.03)]">
          <TelemetryPanel telemetry={state.telemetry} completed={!replaying} />
        </section>

        <section className="rounded-xl bg-white p-3 shadow-[0_1px_5px_rgba(0,0,0,0.03)]">
          <LeaderboardPanel leaderboard={state.leaderboard} completed={!replaying} />
        </section>

        <ConfidenceScoreNote />
        {state.stress && <StressCheckRow stress={state.stress} completed={!replaying} />}
        <DebateTranscript transcript={state.transcript} takeaway={state.takeaway} completed={!replaying} />

      </div>
    </div>
  );
}
