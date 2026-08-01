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
  const leaderboardEvent = latestEvent(events, elapsed, (item) => item.type === ET.LEADERBOARD);
  const takeawayEvent = latestEvent(events, elapsed, (item) => item.type === ET.TAKEAWAY);
  const stressEvent = latestEvent(events, elapsed, (item) => item.type === ET.STRESS);
  const judgeEvent = latestEvent(events, elapsed, (item) => item.type === ET.JUDGE);

  let activeAgent = null;
  let activeTelemetryTime = -1;
  const telemetry = {};

  for (const agent of AGENT_ORDER) {
    const keyframes = events.filter(
      (item) => item.type === ET.TELEMETRY && item.payload.agent === agent,
    );
    const prev = [...keyframes].reverse().find((item) => item.t <= elapsed);
    const next = keyframes.find((item) => item.t > elapsed);
    let value = 0;

    if (prev && next) {
      value = lerp(prev.payload.value, next.payload.value, (elapsed - prev.t) / (next.t - prev.t));
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
    .filter((item) => item.type === ET.DEBATE && item.t <= elapsed)
    .map(({ payload }) => payload);

  const judgingHasStarted = phaseEvent?.payload.phase === 'judging'
    || phaseEvent?.payload.phase === 'complete';

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
