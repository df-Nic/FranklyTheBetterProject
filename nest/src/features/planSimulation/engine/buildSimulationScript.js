import { ET } from './eventTypes.js';
import { DEBATE_EXCHANGES } from '../data/debateLines.js';
import { TAKEAWAY_BY_GOAL } from '../data/literacyTakeaways.js';
import { buildStrategySnapshot, getAgentEvidence } from '../data/strategySnapshot.js';

const BASE_DURATION_MS = 16000;
const SIMULATION_DURATION_MS = 24000;
const TIMELINE_SCALE = SIMULATION_DURATION_MS / BASE_DURATION_MS;

function event(t, type, payload) {
  return { t, type, payload };
}

function processDebateLine(line, planRequest) {
  return line.text
    .replaceAll('{goal}', planRequest.goalLabel)
    .replaceAll('{horizon}', String(planRequest.horizonMonths));
}

export function buildSimulationScript(planRequest) {
  const now = Date.now();
  const goalType = DEBATE_EXCHANGES[planRequest.goalType]
    ? planRequest.goalType
    : 'general';
  const debateLines = DEBATE_EXCHANGES[goalType];
  const takeaway = TAKEAWAY_BY_GOAL[goalType];
  const strategySnapshot = planRequest.strategySnapshot ?? buildStrategySnapshot(planRequest);
  const winner = strategySnapshot.leadAgent;
  const leaderboardPayload = {
    order: [winner, ...['cashflow', 'yield', 'sequencing'].filter((agent) => agent !== winner)],
    reasons: {
      cashflow: `supports ${getAgentEvidence(strategySnapshot, 'cashflow')}`,
      yield: `supports ${getAgentEvidence(strategySnapshot, 'yield')}`,
      sequencing: `supports ${getAgentEvidence(strategySnapshot, 'sequencing')}`,
    },
    trends: { yield: 'up', cashflow: 'shield', sequencing: 'dots' },
  };
  const confidence = strategySnapshot.confidence;
  const status = {
    cashflow: `Stress-testing ${getAgentEvidence(strategySnapshot, 'cashflow')} liquidity`,
    yield: `Projecting ${getAgentEvidence(strategySnapshot, 'yield')} through recession`,
    sequencing: `Validating ${getAgentEvidence(strategySnapshot, 'sequencing')} under inflation shock`,
  };
  const debateTimes = [5000, 6200, 7400, 8600, 9800, 11000];
  const debateClocks = ['10:42:15', '10:42:17', '10:42:19', '10:42:21', '10:42:23', '10:42:25'];

  const events = [
    event(0, ET.PHASE, { phase: 'proposing' }),
    event(350, ET.TELEMETRY, { agent: 'cashflow', value: confidence.cashflow * 0.1, status: status.cashflow }),
    event(700, ET.TELEMETRY, { agent: 'yield', value: confidence.yield * 0.1, status: status.yield }),
    event(1050, ET.TELEMETRY, { agent: 'sequencing', value: confidence.sequencing * 0.1, status: status.sequencing }),
    event(1500, ET.PHASE, { phase: 'simulating' }),
    event(2200, ET.TELEMETRY, { agent: 'cashflow', value: confidence.cashflow * 0.5, status: status.cashflow }),
    event(2800, ET.TELEMETRY, { agent: 'yield', value: confidence.yield * 0.55, status: status.yield }),
    event(3400, ET.TELEMETRY, { agent: 'sequencing', value: confidence.sequencing * 0.5, status: status.sequencing }),
    event(4000, ET.LEADERBOARD, leaderboardPayload),
    event(4800, ET.PHASE, { phase: 'debating' }),
    ...debateLines.map((line, index) => event(debateTimes[index], ET.DEBATE, {
      ...line,
      clock: debateClocks[index],
      text: processDebateLine(line, planRequest),
    })),
    event(7800, ET.TELEMETRY, { agent: 'cashflow', value: confidence.cashflow, status: status.cashflow }),
    event(8400, ET.TELEMETRY, { agent: 'yield', value: confidence.yield, status: status.yield }),
    event(9000, ET.TELEMETRY, { agent: 'sequencing', value: confidence.sequencing, status: status.sequencing }),
    event(10800, ET.STRESS, { label: `Checking ${strategySnapshot.planTitle} liquidity and deadline resilience`, result: 'OK' }),
    event(11200, ET.TAKEAWAY, { conceptId: takeaway }),
    event(11400, ET.LEADERBOARD, leaderboardPayload),
    event(12500, ET.PHASE, { phase: 'judging' }),
    event(13000, ET.JUDGE, { progress: 0.2 }),
    event(14000, ET.JUDGE, { progress: 0.45 }),
    event(15000, ET.JUDGE, { progress: 0.7 }),
    event(15800, ET.JUDGE, { progress: 1 }),
    event(16000, ET.PHASE, { phase: 'complete', winner }),
  ]
    .map((item) => ({ ...item, t: Math.round(item.t * TIMELINE_SCALE) }))
    .sort((a, b) => a.t - b.t);

  return {
    id: `sim_${now}`,
    planId: planRequest.planId ?? '',
    createdAt: now,
    durationMs: SIMULATION_DURATION_MS,
    request: { ...planRequest, strategySnapshot },
    events,
  };
}
