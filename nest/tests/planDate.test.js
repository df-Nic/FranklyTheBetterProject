import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePlanTargetDate } from '../src/lib/planDate.js';

const NOW = new Date(2026, 7, 2);

test('normalizes clear and fuzzy month-year dates', () => {
  for (const input of ['Dec 2029', 'December 2029', 'December2029', 'Dec2029', 'Dec-2029', 'Dec/2029', 'Decmber 2029', 'decmber2029']) {
    assert.equal(parsePlanTargetDate(input, NOW).formatted, 'Dec 2029');
  }
});

test('returns a partial result for year-only input', () => {
  assert.deepEqual(parsePlanTargetDate('2029', NOW), { status: 'needs-month', year: 2029 });
  assert.equal(parsePlanTargetDate('March 2029', NOW).formatted, 'Mar 2029');
});

test('accepts relative dates and rejects elapsed months', () => {
  assert.equal(parsePlanTargetDate('18 months', NOW).formatted, 'Feb 2028');
  assert.equal(parsePlanTargetDate('Aug 2026', NOW).error, 'past');
  assert.equal(parsePlanTargetDate('Jul 2026', NOW).error, 'past');
});
