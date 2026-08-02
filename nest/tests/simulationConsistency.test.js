import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSimulationScript } from '../src/features/planSimulation/engine/buildSimulationScript.js';

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
