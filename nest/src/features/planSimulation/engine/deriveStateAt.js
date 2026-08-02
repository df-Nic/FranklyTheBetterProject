import { ET } from './eventTypes.js';
import { AGENT_ORDER } from '../data/agents.js';

function latestEvent(events, elapsed, predicate) {
  let latest = null;
  for (const current of events) {
    if (current.t > elapsed) break;
    if (predicate(current)) latest = current;
  }
  return latest;
}

function lerp(a, b, amount) {
  const t = Math.max(0, Math.min(1, amount));
  return a + (b - a) * t;
}

export function deriveStateAt(script, elapsedMs) {
  const elapsed = Math.max(0, Math.min(elapsedMs, script.durationMs));
  const events = script.events;

  const phaseEvent = latestEvent(events, elapsed, (item) => item.type === ET.PHASE);
  const judgingHasStarted = phaseEvent?.payload.phase === 'judging'
    || phaseEvent?.payload.phase === 'complete';
  const judgingPhase = events.find((item) => item.type === ET.PHASE && item.payload.phase === 'judging');
  const evidenceElapsed = judgingHasStarted && judgingPhase ? judgingPhase.t : elapsed;
  const leaderboardEvent = latestEvent(events, evidenceElapsed, (item) => item.type === ET.LEADERBOARD);
  const takeawayEvent = latestEvent(events, evidenceElapsed, (item) => item.type === ET.TAKEAWAY);
  const stressEvent = latestEvent(events, evidenceElapsed, (item) => item.type === ET.STRESS);
  const judgeEvent = latestEvent(events, elapsed, (item) => item.type === ET.JUDGE);

  let activeAgent = null;
  let activeTelemetryTime = -1;
  const telemetry = {};

  for (const agent of AGENT_ORDER) {
    const keyframes = events.filter(
      (item) => item.type === ET.TELEMETRY
        && item.payload.agent === agent
        && (!judgingHasStarted || item.t <= evidenceElapsed),
    );
    const prev = [...keyframes].reverse().find((item) => item.t <= evidenceElapsed);
    const next = keyframes.find((item) => item.t > evidenceElapsed);
    let value = 0;

    if (prev && next) {
      value = lerp(prev.payload.value, next.payload.value, (evidenceElapsed - prev.t) / (next.t - prev.t));
    } else if (prev) {
      value = prev.payload.value;
    }

    telemetry[agent] = {
      value,
      displayPct: `${Math.round(value * 100)}%`,
      status: prev?.payload.status ?? '',
    };

    if (prev && prev.t > activeTelemetryTime) {
      activeAgent = agent;
      activeTelemetryTime = prev.t;
    }
  }

  const leaderboard = leaderboardEvent
    ? leaderboardEvent.payload.order.map((agentId, index) => ({
        agentId,
        rank: index + 1,
        reason: leaderboardEvent.payload.reasons[agentId],
        trend: leaderboardEvent.payload.trends[agentId],
      }))
    : [];

  const transcript = events
    .filter((item) => item.type === ET.DEBATE && item.t <= evidenceElapsed)
    .map(({ payload }) => payload);

  return {
    phase: phaseEvent?.payload.phase ?? 'idle',
    winner: phaseEvent?.payload.winner ?? null,
    activeAgent,
    telemetry,
    stress: stressEvent?.payload ?? null,
    leaderboard,
    transcript,
    takeaway: takeawayEvent?.payload ?? null,
    judge: {
      progress: judgeEvent?.payload.progress ?? 0,
      visible: Boolean(judgeEvent || judgingHasStarted),
    },
  };
}
