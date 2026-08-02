const MONTHS = [
  ['jan', 'january'], ['feb', 'february'], ['mar', 'march'],
  ['apr', 'april'], ['may'], ['jun', 'june'],
  ['jul', 'july'], ['aug', 'august'], ['sep', 'sept', 'september'],
  ['oct', 'october'], ['nov', 'november'], ['dec', 'december'],
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WORD_NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

function editDistance(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, index) => [index]);
  rows[0] = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return rows[a.length][b.length];
}

function resolveMonth(token) {
  const value = token.toLowerCase();
  const exact = MONTHS.findIndex((aliases) => aliases.includes(value));
  if (exact >= 0) return { month: exact, corrected: false };
  if (value.length < 4) return null;

  const candidates = MONTHS.map((aliases, month) => ({
    month,
    distance: Math.min(...aliases.map((alias) => editDistance(value, alias))),
  })).sort((a, b) => a.distance - b.distance);
  if (candidates[0].distance > 2 || candidates[0].distance === candidates[1].distance) return null;
  return { month: candidates[0].month, corrected: true };
}

function complete(date, corrected = false) {
  return {
    status: 'complete',
    date,
    formatted: `${MONTH_LABELS[date.getMonth()]} ${date.getFullYear()}`,
    corrected,
  };
}

function validateFuture(date, now) {
  const minimum = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return date >= minimum ? complete(date) : { status: 'error', error: 'past' };
}

export function parsePlanTargetDate(input, now = new Date()) {
  const raw = String(input ?? '').trim();
  if (!raw) return { status: 'error', error: 'invalid' };
  const normalized = raw.toLowerCase().replace(/[,]/g, ' ').replace(/\s+/g, ' ').trim();

  const relativeYears = normalized.match(/^(?:in\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+years?$/);
  if (relativeYears) {
    const amount = Number(relativeYears[1]) || WORD_NUMBERS[relativeYears[1]];
    if (!amount) return { status: 'error', error: 'invalid' };
    return validateFuture(new Date(now.getFullYear() + amount, now.getMonth(), 1), now);
  }

  const relativeMonths = normalized.match(/^(?:in\s+)?(\d+)\s+months?$/);
  if (relativeMonths) {
    const amount = Number(relativeMonths[1]);
    if (!amount) return { status: 'error', error: 'invalid' };
    return validateFuture(new Date(now.getFullYear(), now.getMonth() + amount, 1), now);
  }

  if (/^\d{4}$/.test(normalized)) {
    const year = Number(normalized);
    if (year < now.getFullYear()) return { status: 'error', error: 'past' };
    return { status: 'needs-month', year };
  }

  const compact = normalized.replace(/[\s\-/.]+/g, '');
  const match = compact.match(/^([a-z]+)(\d{4})$/);
  if (!match) {
    if (/^[a-z]+$/.test(compact)) return { status: 'error', error: 'missing-year' };
    return { status: 'error', error: 'invalid' };
  }

  const monthResult = resolveMonth(match[1]);
  if (!monthResult) return { status: 'error', error: 'ambiguous-month' };
  const date = new Date(Number(match[2]), monthResult.month, 1);
  const result = validateFuture(date, now);
  return result.status === 'complete' ? { ...result, corrected: monthResult.corrected } : result;
}

export function getPlanHorizonMonths(value, now = new Date()) {
  const parsed = value instanceof Date ? complete(value) : parsePlanTargetDate(value, now);
  if (parsed.status !== 'complete') return null;
  return Math.max(1, (parsed.date.getFullYear() - now.getFullYear()) * 12 + parsed.date.getMonth() - now.getMonth());
}
