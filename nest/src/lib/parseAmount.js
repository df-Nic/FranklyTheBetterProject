export function parseAmountInput(str) {
  if (!str) return 0;
  const normalized = str.trim().toLowerCase();
  
  // Match millions (m, mn, mil, million, e.g. 1M, 1m, 1 Mn, 1mn, 1mN, 1MN, 1.5M, 1.5 Mn)
  const mMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:mn|m|mil|million)\b/);
  if (mMatch) {
    return parseFloat(mMatch[1]) * 1000000;
  }
  
  // Match thousands (k, thousand, e.g. 10k, 10 K, 10.5k)
  const kMatch = normalized.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:k|thousand)\b/);
  if (kMatch) {
    return parseFloat(kMatch[1]) * 1000;
  }
  
  const num = parseFloat(normalized.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}
