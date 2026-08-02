import test from 'node:test';
import assert from 'node:assert/strict';
import { getPlanActivity } from '../src/data/planActivity.js';

const plan = {
  id: 'test-plan',
  goalName: 'Test Plan',
  isUserCreated: true,
  milestones: [{ id: 'created', name: 'Goal Created', date: '1 Jan 2026', state: 'completed' }],
};
const opportunity = { id: 'deposit-1', title: 'Use deposit', summary: 'Deposit detected', detectedDate: '2 Jan 2026' };

test('history is newest first and hides untriggered opportunities', () => {
  const hidden = getPlanActivity({ plan, opportunity, opportunityLifecycle: { state: 'idle', route: null }, runtimeEvents: [] });
  assert.equal(hidden.some((event) => event.type === 'opportunity'), false);

  const visible = getPlanActivity({
    plan,
    opportunity,
    opportunityLifecycle: { state: 'standalone', route: 'standalone', triggeredAt: '2026-02-01T00:00:00.000Z' },
    runtimeEvents: [
      { id: 'older', planId: plan.id, type: 'saving', timestamp: '2026-02-02T00:00:00.000Z' },
      { id: 'newer', planId: plan.id, type: 'saving', timestamp: '2026-02-03T00:00:00.000Z' },
    ],
  });
  assert.deepEqual(visible.slice(0, 2).map((event) => event.id), ['newer', 'older']);
  assert.equal(visible.some((event) => event.id === 'opportunity-deposit-1'), true);
});
