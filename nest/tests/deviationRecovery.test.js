import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTimelineRevision,
  calculateTimelineDelayMonths,
  createRecoveryBatch,
  getDeviationStatus,
  getTimelineAutoCoverage,
  shiftPlanDate,
} from '../src/lib/deviationRecovery.js';

test('partial recovery does not resolve the remaining plan', () => {
  assert.equal(getDeviationStatus([{ status: 'applied' }, { status: 'pending' }]), 'partially-resolved');
  assert.equal(getDeviationStatus([{ status: 'applied' }, { status: 'timeline-extended' }]), 'resolved');
});

test('a single-plan recovery batch concentrates recovery and covers unselected plans', () => {
  const batch = createRecoveryBatch([
    { planId: 'housing', status: 'pending', gap: 4000 },
    { planId: 'education', status: 'pending', gap: 2500 },
  ], ['housing'], '2026-08-04T00:00:00.000Z');

  assert.deepEqual(batch.recoveryBatchPlanIds, ['housing']);
  assert.equal(batch.affectedPlans[0].status, 'pending');
  assert.equal(batch.affectedPlans[1].status, 'covered');
  assert.equal(batch.affectedPlans[1].resolution, 'recovery-concentrated-elsewhere');
  assert.equal(batch.affectedPlans[1].gap, 0);

  const resolvedPlans = batch.affectedPlans.map((plan) =>
    plan.planId === 'housing' ? { ...plan, status: 'timeline-extended' } : plan);
  assert.equal(getDeviationStatus(resolvedPlans), 'resolved');
});

test('a multi-plan recovery batch keeps every selected plan actionable', () => {
  const batch = createRecoveryBatch([
    { planId: 'housing', status: 'pending', gap: 4000 },
    { planId: 'education', status: 'pending', gap: 2500 },
    { planId: 'retirement', status: 'pending', gap: 1000 },
  ], ['housing', 'education'], '2026-08-04T00:00:00.000Z');

  assert.deepEqual(batch.recoveryBatchPlanIds, ['housing', 'education']);
  assert.equal(batch.affectedPlans.find((plan) => plan.planId === 'retirement').status, 'covered');

  const partiallyResolvedPlans = batch.affectedPlans.map((plan) =>
    plan.planId === 'housing' ? { ...plan, status: 'timeline-extended' } : plan);
  assert.equal(getDeviationStatus(partiallyResolvedPlans), 'partially-resolved');
  assert.equal(partiallyResolvedPlans.find((plan) => plan.planId === 'education').status, 'pending');

  const fullyResolvedPlans = partiallyResolvedPlans.map((plan) =>
    plan.planId === 'education' ? { ...plan, status: 'applied' } : plan);
  assert.equal(getDeviationStatus(fullyResolvedPlans), 'resolved');
});

test('an existing multi-plan batch remains stable while alternatives are reviewed', () => {
  const batch = createRecoveryBatch([
    { planId: 'housing', status: 'timeline-extended', gap: 4000 },
    { planId: 'education', status: 'pending', gap: 2500 },
    { planId: 'retirement', status: 'covered', gap: 0 },
  ], ['housing', 'education'], '2026-08-04T00:00:00.000Z');

  assert.deepEqual(batch.recoveryBatchPlanIds, ['housing', 'education']);
  assert.equal(batch.affectedPlans.find((plan) => plan.planId === 'education').status, 'pending');
  assert.equal(batch.affectedPlans.find((plan) => plan.planId === 'retirement').status, 'covered');
});

test('a timeline choice automatically covers selected plans within its recovery capacity', () => {
  const coverage = getTimelineAutoCoverage([
    { planId: 'housing', status: 'pending', gap: 5000 },
    { planId: 'education', status: 'pending', gap: 3200 },
    { planId: 'retirement', status: 'pending', gap: 6200 },
  ], ['housing', 'education', 'retirement'], {
    housing: 'timeline',
    education: 'deposit',
    retirement: 'deposit',
  });

  assert.equal(coverage.sourcePlanId, 'housing');
  assert.equal(coverage.capacity, 5000);
  assert.deepEqual(coverage.autoCoveredPlanIds, ['education']);
});

test('uncovered plans retain their explicit recovery choice', () => {
  const coverage = getTimelineAutoCoverage([
    { planId: 'housing', status: 'pending', gap: 3000 },
    { planId: 'education', status: 'pending', gap: 4500 },
  ], ['housing', 'education'], {
    housing: 'timeline',
    education: 'deposit',
  });

  assert.deepEqual(coverage.autoCoveredPlanIds, []);
});

test('timeline delay is based on the remaining gap and contribution', () => {
  assert.equal(calculateTimelineDelayMonths(2501, 1000), 3);
  assert.equal(calculateTimelineDelayMonths(2501, 0), null);
});

test('timeline revision shifts only incomplete milestones', () => {
  const revision = buildTimelineRevision({
    goalDate: '15 Dec 2027',
    monthlyContribution: 1000,
    milestones: [
      { id: 'done', date: '2 Jan 2026', state: 'completed' },
      { id: 'next', date: '30 Sep 2027', state: 'next' },
      { id: 'goal', date: '15 Dec 2027', state: 'goal' },
    ],
  }, 2501);
  assert.equal(revision.delayMonths, 3);
  assert.equal(revision.revisedGoalDate, '15 Mar 2028');
  assert.equal(revision.milestones[0].date, '2 Jan 2026');
  assert.equal(revision.milestones[1].date, '30 Dec 2027');
  assert.equal(shiftPlanDate('Oct 2045', 4), 'Feb 2046');
});
