import test from 'node:test';
import assert from 'node:assert/strict';
import { completeOpportunityLifecycle, createOpportunityLifecycle } from '../src/lib/opportunityLifecycle.js';

test('routes a deposit to exactly one experience', () => {
  assert.equal(createOpportunityLifecycle(false, '2026-08-02T00:00:00.000Z').route, 'standalone');
  assert.equal(createOpportunityLifecycle(true, '2026-08-02T00:00:00.000Z').route, 'healer');
});

test('handling preserves the original route without reopening it', () => {
  const handled = completeOpportunityLifecycle(createOpportunityLifecycle(true, '2026-08-02T00:00:00.000Z'));
  assert.equal(handled.state, 'handled');
  assert.equal(handled.route, 'healer');
});
