const DAY_MS = 86_400_000;

/** Compound annual growth rate as a decimal. */
export function cagr(start: number, end: number, years: number): number {
  if (start <= 0 || end < 0 || years <= 0) return NaN;
  return Math.pow(end / start, 1 / years) - 1;
}

export function endValue(start: number, rate: number, years: number): number {
  return start * Math.pow(1 + rate, years);
}

export function startValue(end: number, rate: number, years: number): number {
  return end / Math.pow(1 + rate, years);
}

/** Years needed to grow start → end at the given rate. */
export function yearsToReach(start: number, end: number, rate: number): number {
  if (start <= 0 || end <= 0 || rate <= -1 || rate === 0) return NaN;
  const y = Math.log(end / start) / Math.log(1 + rate);
  return y >= 0 ? y : NaN;
}

/** Fractional years between two ISO dates (yyyy-mm-dd). */
export function yearsBetween(from: string, to: string): number {
  const a = Date.parse(from);
  const b = Date.parse(to);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return (b - a) / (DAY_MS * 365.25);
}
