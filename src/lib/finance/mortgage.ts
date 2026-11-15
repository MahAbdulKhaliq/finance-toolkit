export type Compounding = 'semiannual' | 'monthly';

/**
 * Effective monthly rate. Canadian fixed-rate mortgages compound semi-annually
 * (Interest Act); US mortgages compound monthly.
 */
export function monthlyRate(annualRate: number, compounding: Compounding): number {
  if (compounding === 'semiannual') return Math.pow(1 + annualRate / 2, 1 / 6) - 1;
  return annualRate / 12;
}

export function monthlyPayment(principal: number, rate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  if (rate === 0) return principal / months;
  return (principal * rate) / (1 - Math.pow(1 + rate, -months));
}

export interface AmortizationYear {
  year: number;
  interest: number;
  principal: number;
  endBalance: number;
}

export function amortizationByYear(
  principal: number,
  rate: number,
  months: number,
): AmortizationYear[] {
  const pmt = monthlyPayment(principal, rate, months);
  const rows: AmortizationYear[] = [];
  let bal = principal;
  for (let y = 0; y * 12 < months; y++) {
    let interest = 0;
    let princ = 0;
    for (let m = 0; m < 12 && y * 12 + m < months; m++) {
      const i = bal * rate;
      const p = Math.min(pmt - i, bal);
      interest += i;
      princ += p;
      bal -= p;
    }
    rows.push({ year: y + 1, interest, principal: princ, endBalance: Math.max(0, bal) });
  }
  return rows;
}

/** CMHC premium rate (as a share of the loan) for a given down-payment ratio. */
export function cmhcPremiumRate(downRatio: number): number {
  if (downRatio >= 0.2) return 0;
  if (downRatio >= 0.15) return 0.028;
  if (downRatio >= 0.1) return 0.031;
  return 0.04;
}

/** Minimum down payment in Canada (rules effective Dec 15, 2024). */
export function canadaMinimumDown(price: number): number {
  if (price >= 1_500_000) return price * 0.2;
  if (price <= 500_000) return price * 0.05;
  return 500_000 * 0.05 + (price - 500_000) * 0.1;
}
