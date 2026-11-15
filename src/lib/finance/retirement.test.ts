import { describe, expect, it } from 'vitest';
import { retirementPlan, savingsRate, savingsRateCurve } from './retirement';

const base = { income: 50_000, expenses: 20_000, portfolio: 0, realReturn: 0.05, withdrawalRate: 0.04 };

describe('retirement', () => {
  it('matches the reference example: 60% savings rate, 5% return, 4% rule → 12.4 years', () => {
    const r = retirementPlan(base);
    expect(r.goal).toBe(500_000);
    expect(r.savingsRate).toBeCloseTo(0.6, 10);
    expect(r.yearsToRetire).toBeCloseTo(12.42, 2);
    expect(r.years[1].netWorth).toBe(30_000);
    expect(r.years[2].investmentReturn).toBeCloseTo(1_500, 6);
    expect(r.years[13].netWorth).toBeCloseTo(531_389, 0);
    expect(r.years[1].expensesCovered).toBeCloseTo(0.06, 10);
  });

  it('is 0 years when the portfolio already covers expenses', () => {
    expect(retirementPlan({ ...base, portfolio: 600_000 }).yearsToRetire).toBe(0);
  });

  it('never retires when spending everything with no portfolio growth', () => {
    const r = retirementPlan({ ...base, expenses: 50_000, realReturn: 0 });
    expect(r.yearsToRetire).toBeNull();
  });

  it('a higher return or lower fee fund retires sooner', () => {
    const cheap = retirementPlan({ ...base, realReturn: 0.047 }).yearsToRetire!;
    const pricey = retirementPlan({ ...base, realReturn: 0.0275 }).yearsToRetire!;
    expect(cheap).toBeLessThan(pricey);
  });

  it('savings-rate curve falls as the savings rate rises', () => {
    const curve = savingsRateCurve({ income: 50_000, portfolio: 0, realReturn: 0.05, withdrawalRate: 0.04 }, 0.1);
    expect(curve).toHaveLength(11);
    expect(curve[0].years).toBeNull(); // 0% saved: never
    expect(curve[10].years).toBe(0); // 100% saved: no expenses to cover
    const finite = curve.filter((p) => p.years !== null).map((p) => p.years!);
    for (let i = 1; i < finite.length; i++) expect(finite[i]).toBeLessThanOrEqual(finite[i - 1]);
  });

  it('computes savings rate', () => {
    expect(savingsRate(100, 25)).toBe(0.75);
    expect(savingsRate(0, 25)).toBe(0);
  });
});
