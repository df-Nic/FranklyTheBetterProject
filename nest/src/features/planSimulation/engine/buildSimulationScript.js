import { ET } from './eventTypes.js';
import { DEBATE_EXCHANGES } from '../data/debateLines.js';
import { TAKEAWAY_BY_GOAL } from '../data/literacyTakeaways.js';

const BASE_DURATION_MS = 16000;
const SIMULATION_DURATION_MS = 24000;
const TIMELINE_SCALE = SIMULATION_DURATION_MS / BASE_DURATION_MS;

const baseLeaderboardPayload = {
  order: ['yield', 'cashflow', 'sequencing'],
  reasons: {
    yield: 'leads on return',
    cashflow: 'leads on safety buffer',
    sequencing: 'leads on timeline recovery',
  },
  trends: {
    yield: 'up',
    cashflow: 'shield',
    sequencing: 'dots',
  },
};

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
  const winnerByGoal = {
    home_deposit: 'sequencing',
    retirement: 'yield',
    education: 'sequencing',
    emergency_fund: 'cashflow',
    general: 'sequencing',
  };
  const winner = winnerByGoal[goalType] ?? 'sequencing';
  const leaderboardPayload = {
    ...baseLeaderboardPayload,
    order: [winner, ...baseLeaderboardPayload.order.filter((agent) => agent !== winner)],
  };
  const debateTimes = [5000, 6200, 7400, 8600, 9800, 11000];
  const debateClocks = ['10:42:15', '10:42:17', '10:42:19', '10:42:21', '10:42:23', '10:42:25'];

  const events = [
    event(0, ET.PHASE, { phase: 'proposing' }),
    event(350, ET.TELEMETRY, { agent: 'cashflow', value: 0.06, status: 'Running 1,000 Monte Carlo runs' }),
    event(700, ET.TELEMETRY, { agent: 'yield', value: 0.08, status: 'Testing 2008 recession scenario' }),
    event(1050, ET.TELEMETRY, { agent: 'sequencing', value: 0.05, status: 'Simulating 6% inflation spike' }),
    event(1500, ET.PHASE, { phase: 'simulating' }),
    event(2200, ET.TELEMETRY, { agent: 'cashflow', value: 0.34, status: 'Running 1,000 Monte Carlo runs' }),
    event(2800, ET.TELEMETRY, { agent: 'yield', value: 0.48, status: 'Testing 2008 recession scenario' }),
    event(3400, ET.TELEMETRY, { agent: 'sequencing', value: 0.28, status: 'Simulating 6% inflation spike' }),
    event(4000, ET.LEADERBOARD, leaderboardPayload),
    event(4800, ET.PHASE, { phase: 'debating' }),
    ...debateLines.map((line, index) => event(debateTimes[index], ET.DEBATE, {
      ...line,
      clock: debateClocks[index],
      text: processDebateLine(line, planRequest),
    })),
    event(7800, ET.TELEMETRY, { agent: 'cashflow', value: 0.72, status: 'Running 1,000 Monte Carlo runs' }),
    event(8400, ET.TELEMETRY, { agent: 'yield', value: 0.84, status: 'Testing 2008 recession scenario' }),
    event(9000, ET.TELEMETRY, { agent: 'sequencing', value: 0.68, status: 'Simulating 6% inflation spike' }),
    event(10800, ET.STRESS, { label: 'Checking emergency-buffer resilience', result: 'OK' }),
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
    request: planRequest,
    events,
  };
}
