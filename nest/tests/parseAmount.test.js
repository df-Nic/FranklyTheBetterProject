import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAmountInput } from '../src/lib/parseAmount.js';

test('parseAmountInput handles thousand suffixes (k, K, k with space, thousand)', () => {
  assert.equal(parseAmountInput('10k'), 10000);
  assert.equal(parseAmountInput('10K'), 10000);
  assert.equal(parseAmountInput('10 k'), 10000);
  assert.equal(parseAmountInput('10.5k'), 10500);
  assert.equal(parseAmountInput('S$ 25k'), 25000);
  assert.equal(parseAmountInput('5 thousand'), 5000);
});

test('parseAmountInput handles million suffixes (M, m, Mn, mn, mN, MN, mil, million)', () => {
  assert.equal(parseAmountInput('1M'), 1000000);
  assert.equal(parseAmountInput('1m'), 1000000);
  assert.equal(parseAmountInput('1 M'), 1000000);
  assert.equal(parseAmountInput('1 m'), 1000000);
  assert.equal(parseAmountInput('1Mn'), 1000000);
  assert.equal(parseAmountInput('1mn'), 1000000);
  assert.equal(parseAmountInput('1mN'), 1000000);
  assert.equal(parseAmountInput('1MN'), 1000000);
  assert.equal(parseAmountInput('1 Mn'), 1000000);
  assert.equal(parseAmountInput('1 mn'), 1000000);
  assert.equal(parseAmountInput('1.5M'), 1500000);
  assert.equal(parseAmountInput('1.5 Mn'), 1500000);
  assert.equal(parseAmountInput('2.5mn'), 2500000);
  assert.equal(parseAmountInput('S$ 2M'), 2000000);
  assert.equal(parseAmountInput('2 million'), 2000000);
});

test('parseAmountInput handles raw numbers and formatted currency without suffixes', () => {
  assert.equal(parseAmountInput('50000'), 50000);
  assert.equal(parseAmountInput('S$35,000'), 35000);
  assert.equal(parseAmountInput('$1,000,000'), 1000000);
  assert.equal(parseAmountInput(''), 0);
  assert.equal(parseAmountInput(null), 0);
});
