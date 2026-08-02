import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSimulationScript } from '../src/features/planSimulation/engine/buildSimulationScript.js';
import { deriveStateAt } from '../src/features/planSimulation/engine/deriveStateAt.js';
import { ET } from '../src/features/planSimulation/engine/eventTypes.js';
import { buildPortfolioSnapshot } from '../src/features/planSimulation/data/portfolioSnapshot.js';

test('simulation persists canonical plan evidence from all three agents', () => {
  const script = buildSimulationScript({
    planId: 'housing',
    goalType: 'home_deposit',
    goalLabel: 'OCBC HDB Housing Plan',
    targetAmount: 500000,
    targetDate: 'Dec 2029',
    horizonMonths: 40,
    monthlyContribution: 2500,
    paymentStrategy: 'staggered',
    propertyType: 'hdb',
    riskProfile: 'balanced',
    milestones: [{ id: 1, name: 'First down payment', amount: 125000, date: 'Dec 2027' }],
  });
  const snapshot = script.request.strategySnapshot;
  assert.equal(snapshot.targetAmount, 500000);
  assert.equal(snapshot.targetDate, 'Dec 2029');
  assert.equal(snapshot.leadAgent, 'sequencing');
  assert.ok(snapshot.contributions.cashflow.length > 0);
  assert.ok(snapshot.contributions.yield.length > 0);
  assert.ok(snapshot.contributions.sequencing.length > 0);
});

test('judge evaluates a frozen evidence snapshot', () => {
  const script = buildSimulationScript({ planId: 'housing', goalType: 'general', goalLabel: 'Housing', targetAmount: 500000, targetDate: 'Dec 2029' });
  const judgingStart = script.events.find((event) => event.type === ET.PHASE && event.payload.phase === 'judging').t;
  const atStart = deriveStateAt(script, judgingStart);
  const alteredScript = {
    ...script,
    events: [...script.events, {
      t: judgingStart + 100,
      type: ET.TELEMETRY,
      payload: { agent: 'cashflow', value: 0.01, status: 'late update' },
    }].sort((a, b) => a.t - b.t),
  };
  const duringJudge = deriveStateAt(alteredScript, judgingStart + 500);
  assert.deepEqual(duringJudge.telemetry, atStart.telemetry);
  assert.deepEqual(duringJudge.leaderboard, atStart.leaderboard);
});

test('simulation coordinates a new goal with existing plans without mutating them', () => {
  const existing = [{
    id: 'housing', goalName: 'HDB Downpayment', goalDate: 'Dec 2029', monthlyContribution: 2500,
    strategy: 'Cash savings', milestones: [{ name: 'Downpayment Ready', date: 'Dec 2029', state: 'next' }],
  }];
  const before = structuredClone(existing);
  const request = { planId: 'retirement', goalType: 'retirement', goalLabel: 'Retirement', targetDate: 'Oct 2045', monthlyContribution: 2400 };
  const portfolioSnapshot = buildPortfolioSnapshot({ request, plans: existing });
  const script = buildSimulationScript({ ...request, portfolioSnapshot });

  assert.equal(script.request.strategySnapshot.portfolio.existingPlans[0].name, 'HDB Downpayment');
  assert.match(script.request.strategySnapshot.synthesis, /existing commitments/i);
  assert.deepEqual(existing, before);
});
