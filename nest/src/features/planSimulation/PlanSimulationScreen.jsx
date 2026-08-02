import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { useSimulationRunner } from './hooks/useSimulationRunner.js';
import { useAutoScrollFocus } from './hooks/useAutoScrollFocus.js';
import { preloadOwls } from './components/AgentOwl.jsx';
import SimulationHeader from './components/SimulationHeader.jsx';
import TournamentCard from './components/TournamentCard.jsx';
import TelemetryPanel from './components/TelemetryPanel.jsx';
import LeaderboardPanel from './components/LeaderboardPanel.jsx';
import DebateTranscript from './components/DebateTranscript.jsx';
import JudgeProgressCard from './components/JudgeProgressCard.jsx';
import { saveReasoningLog } from '../../lib/reasoningLogStore.js';
import StressCheckRow from './components/StressCheckRow.jsx';
import ConfidenceScoreNote from './components/ConfidenceScoreNote.jsx';

const IDLE_STATE = {
  phase: 'proposing',
  activeAgent: null,
  winner: null,
  telemetry: {
    cashflow: { value: 0, displayPct: '0%', status: 'Initialising...' },
    yield: { value: 0, displayPct: '0%', status: 'Initialising...' },
    sequencing: { value: 0, displayPct: '0%', status: 'Initialising...' },
  },
  stress: null,
  leaderboard: [],
  transcript: [],
  takeaway: null,
  judge: { progress: 0, visible: false },
};

export default function PlanSimulationScreen() {
  const { pendingPlan, navigate } = useApp();

  useEffect(() => {
    if (!pendingPlan?.script) navigate('home');
  }, [navigate, pendingPlan]);

  useEffect(() => {
    preloadOwls();
  }, []);

  const { state: liveState } = useSimulationRunner(
    pendingPlan?.script ?? null,
    {
      onComplete: (completedScript) => {
        saveReasoningLog({
          scriptId: completedScript.id,
          script: completedScript,
        });
        navigate('plan-details');
      },
    },
  );
  const state = liveState ?? IDLE_STATE;

  const telemetryRef = useRef(null);
  const debateRef = useRef(null);
  const judgeRef = useRef(null);

  useAutoScrollFocus(state.phase, {
    telemetry: telemetryRef,
    debate: debateRef,
    judge: judgeRef,
  });

  return (
    <div className="min-h-full bg-[#FBF7F2]">
      <div className="max-w-[430px] mx-auto px-4 pt-6 pb-24 flex flex-col gap-4">
        <SimulationHeader
          onBack={() => navigate(pendingPlan?.result?.returnPage || 'home')}
        />
        <TournamentCard
          activeAgent={state.activeAgent}
          speech={state.phase === 'debating' ? state.transcript.at(-1) ?? null : null}
        />
        <div
          ref={telemetryRef}
          className="bg-white rounded-[--radius-card] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <TelemetryPanel telemetry={state.telemetry} />
            <LeaderboardPanel leaderboard={state.leaderboard} />
          </div>
          <ConfidenceScoreNote />
          {state.stress && <StressCheckRow stress={state.stress} />}
        </div>
        <div ref={debateRef}>
          <DebateTranscript transcript={state.transcript} takeaway={state.takeaway} />
        </div>
        <div ref={judgeRef}>
          <JudgeProgressCard judge={state.judge} />
        </div>
      </div>
    </div>
  );
}
