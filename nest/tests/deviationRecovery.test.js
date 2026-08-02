import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTimelineRevision,
  calculateTimelineDelayMonths,
  getDeviationStatus,
  shiftPlanDate,
} from '../src/lib/deviationRecovery.js';

test('partial recovery does not resolve the remaining plan', () => {
  assert.equal(getDeviationStatus([{ status: 'applied' }, { status: 'pending' }]), 'partially-resolved');
  assert.equal(getDeviationStatus([{ status: 'applied' }, { status: 'timeline-extended' }]), 'resolved');
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
