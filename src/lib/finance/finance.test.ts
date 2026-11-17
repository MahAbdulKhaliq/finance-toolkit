import { describe, expect, it } from 'vitest';
import { simulateGrowth, splitGap, type ContributionPlan } from './growth';
import { cagr, endValue, startValue, yearsBetween, yearsToReach } from './cagr';
import {
  amortizationByYear,
  canadaMinimumDown,
  cmhcPremiumRate,
  monthlyPayment,
  monthlyRate,
} from './mortgage';
import { realRate, toReal } from './inflation';
import { breakEvenAppreciation, rentVsBuy, type RentVsBuyInput } from './rentVsBuy';

const plan = (o: Partial<ContributionPlan> = {}): ContributionPlan => ({
  initial: 10_000,
  contribution: 0,
  frequency: 'monthly',
  timing: 'end',
  annualIncrease: 0,
  years: 10,
  ...o,
});

describe('growth', () => {
  it('compounds a lump sum to the stated annual return', () => {
    const r = simulateGrowth(plan(), { annualReturn: 0.07, fee: 0 });
    expect(r.finalBalance).toBeCloseTo(19_671.51, 1);
    expect(r.totalFeesPaid).toBe(0);
    expect(r.points).toHaveLength(11);
  });

  it('charges the fee monthly on the balance', () => {
    const r = simulateGrowth(plan(), { annualReturn: 0.07, fee: 0.01 });
    const expected = 10_000 * Math.pow(Math.pow(1.07, 1 / 12) * (1 - 0.01 / 12), 120);
    expect(r.finalBalance).toBeCloseTo(expected, 6);
    expect(r.totalFeeCost).toBeCloseTo(r.points[10].noFeeBalance - r.finalBalance, 6);
    expect(r.totalFeeCost).toBeGreaterThan(r.totalFeesPaid); // includes lost growth
  });

  it('end-of-month contributions match the annuity formula at 0 fee', () => {
    const r = simulateGrowth(plan({ initial: 0, contribution: 100 }), { annualReturn: 0.06, fee: 0 });
    const i = Math.pow(1.06, 1 / 12) - 1;
    expect(r.finalBalance).toBeCloseTo((100 * (Math.pow(1 + i, 120) - 1)) / i, 6);
    expect(r.totalContributed).toBe(12_000);
  });

  it('start timing beats end timing; frequency counts are right', () => {
    const start = simulateGrowth(plan({ contribution: 100, timing: 'start' }), { annualReturn: 0.05, fee: 0 });
    const end = simulateGrowth(plan({ contribution: 100 }), { annualReturn: 0.05, fee: 0 });
    expect(start.finalBalance).toBeGreaterThan(end.finalBalance);
    const weekly = simulateGrowth(
      plan({ initial: 0, contribution: 10, frequency: 'weekly', years: 1 }),
      { annualReturn: 0, fee: 0 },
    );
    expect(weekly.totalContributed).toBe(520);
    const q = simulateGrowth(
      plan({ initial: 0, contribution: 10, frequency: 'quarterly', years: 2, timing: 'start' }),
      { annualReturn: 0, fee: 0 },
    );
    expect(q.totalContributed).toBe(80);
  });

  it('applies annual contribution increases', () => {
    const r = simulateGrowth(
      plan({ initial: 0, contribution: 100, frequency: 'annually', annualIncrease: 0.1, years: 3 }),
      { annualReturn: 0, fee: 0 },
    );
    expect(r.totalContributed).toBeCloseTo(100 + 110 + 121, 6);
  });
});

describe('cagr', () => {
  it('computes and round-trips', () => {
    const r = cagr(100, 200, 5);
    expect(r).toBeCloseTo(0.148698, 5);
    expect(endValue(100, r, 5)).toBeCloseTo(200, 8);
    expect(startValue(200, r, 5)).toBeCloseTo(100, 8);
    expect(yearsToReach(100, 200, r)).toBeCloseTo(5, 8);
  });
  it('handles invalid input and dates', () => {
    expect(cagr(0, 100, 5)).toBeNaN();
    expect(yearsToReach(100, 50, 0.05)).toBeNaN();
    expect(yearsBetween('2020-01-01', '2025-01-01')).toBeCloseTo(5, 2);
  });
});

describe('mortgage', () => {
  it('US monthly compounding payment', () => {
    expect(monthlyPayment(300_000, monthlyRate(0.06, 'monthly'), 360)).toBeCloseTo(1798.65, 2);
  });
  it('Canadian semi-annual compounding payment', () => {
    expect(monthlyPayment(500_000, monthlyRate(0.05, 'semiannual'), 300)).toBeCloseTo(2908, 0);
  });
  it('amortization pays off the loan', () => {
    const rows = amortizationByYear(300_000, monthlyRate(0.06, 'monthly'), 360);
    expect(rows).toHaveLength(30);
    expect(rows[29].endBalance).toBeLessThan(0.01);
    expect(rows.reduce((s, r) => s + r.principal, 0)).toBeCloseTo(300_000, 2);
  });
  it('CMHC tiers and minimum down', () => {
    expect(cmhcPremiumRate(0.05)).toBe(0.04);
    expect(cmhcPremiumRate(0.1)).toBe(0.031);
    expect(cmhcPremiumRate(0.15)).toBe(0.028);
    expect(cmhcPremiumRate(0.2)).toBe(0);
    expect(canadaMinimumDown(400_000)).toBe(20_000);
    expect(canadaMinimumDown(800_000)).toBe(55_000);
    expect(canadaMinimumDown(2_000_000)).toBe(400_000);
  });
});

describe('inflation', () => {
  it('converts to real terms', () => {
    expect(toReal(110, 0.1, 1)).toBeCloseTo(100, 8);
    expect(realRate(0.07, 0.02)).toBeCloseTo(0.04902, 4);
  });
});

const base: RentVsBuyInput = {
  region: 'US', years: 10, price: 400_000, downPayment: 80_000, mortgageRate: 0,
  amortizationYears: 30, propertyTaxRate: 0, homeInsurance: 0, maintenanceRate: 0, hoaMonthly: 0,
  buyClosingRate: 0, sellingCostRate: 0, appreciation: 0, pmiRate: 0.005, rent: 0,
  rentIncrease: 0, rentersInsurance: 0, investReturn: 0, inflation: 0,
};

describe('rent vs buy', () => {
  const pmt = 320_000 / 360;

  it('with zero rates and rent = payment, buyer is ahead by exactly the principal repaid', () => {
    const r = rentVsBuy({ ...base, rent: pmt });
    const last = r.years[9];
    expect(last.renterNetWorth).toBeCloseTo(80_000, 6);
    expect(last.buyerNetWorth - last.renterNetWorth).toBeCloseTo(pmt * 120, 4);
    expect(r.breakEvenYear).toBe(1);
  });

  it('accounts for transaction costs and invests the cheaper side’s savings', () => {
    const r = rentVsBuy({ ...base, rent: pmt * 2, buyClosingRate: 0.03, sellingCostRate: 0.05 });
    const y1 = r.years[0];
    expect(y1.renterNetWorth).toBeCloseTo(80_000 + 12_000, 6);
    expect(y1.buyerNetWorth).toBeCloseTo(400_000 * 0.95 - (320_000 - pmt * 12) + pmt * 12, 4);
  });

  it('adds CMHC premium in Canada and drops US PMI at 78% LTV', () => {
    const ca = rentVsBuy({ ...base, region: 'CA', downPayment: 40_000, mortgageRate: 0.05, amortizationYears: 25 });
    expect(ca.cmhcPremium).toBeCloseTo(360_000 * 0.031, 6);
    expect(ca.loanAmount).toBeCloseTo(360_000 * 1.031, 6);
    const us = rentVsBuy({ ...base, downPayment: 40_000, mortgageRate: 0.06, years: 30 });
    expect(us.years[0].mortgageInsurance).toBeCloseTo(360_000 * 0.005, 6);
    expect(us.years[29].mortgageInsurance).toBe(0);
  });

  it('adds the 0.20% CMHC surcharge past 25 years and warns past 30', () => {
    expect(cmhcPremiumRate(0.1, 25)).toBe(0.031);
    expect(cmhcPremiumRate(0.1, 30)).toBeCloseTo(0.033, 10);
    expect(cmhcPremiumRate(0.2, 30)).toBe(0);
    const r30 = rentVsBuy({ ...base, region: 'CA', downPayment: 40_000, mortgageRate: 0.05, amortizationYears: 30 });
    expect(r30.cmhcPremiumRate).toBeCloseTo(0.033, 10);
    expect(r30.warnings).toHaveLength(0);
    const r35 = rentVsBuy({ ...base, region: 'CA', downPayment: 40_000, mortgageRate: 0.05, amortizationYears: 35 });
    expect(r35.warnings.some((w) => w.includes('30 years'))).toBe(true);
    // 20% down: no premium, and long amortizations are allowed
    const r20 = rentVsBuy({ ...base, region: 'CA', downPayment: 80_000, mortgageRate: 0.05, amortizationYears: 35 });
    expect(r20.cmhcPremium).toBe(0);
    expect(r20.warnings).toHaveLength(0);
  });

  it('reports when US PMI ends, and charges it exactly until then', () => {
    const us = rentVsBuy({ ...base, downPayment: 40_000, mortgageRate: 0.06, years: 30 });
    expect(us.pmiEndMonth).not.toBeNull();
    const totalPmi = us.years.reduce((s, y) => s + y.mortgageInsurance, 0);
    expect(totalPmi).toBeCloseTo(us.pmiEndMonth! * ((360_000 * 0.005) / 12), 6);
    // horizon shorter than the PMI period → no end reported
    expect(rentVsBuy({ ...base, downPayment: 40_000, mortgageRate: 0.06, years: 3 }).pmiEndMonth).toBeNull();
    // 20% down → never charged
    expect(rentVsBuy({ ...base, mortgageRate: 0.06, years: 30 }).pmiEndMonth).toBeNull();
  });

  it('warns when the Canadian minimum down payment is not met', () => {
    const r = rentVsBuy({ ...base, region: 'CA', price: 800_000, downPayment: 40_000 });
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it('finds the appreciation at which buying breaks even at a given year', () => {
    const inp: RentVsBuyInput = {
      ...base, region: 'CA', price: 750_000, downPayment: 150_000, mortgageRate: 0.045, amortizationYears: 25,
      propertyTaxRate: 0.007, homeInsurance: 1800, maintenanceRate: 0.01, buyClosingRate: 0.03, sellingCostRate: 0.05,
      appreciation: 0.03, rent: 2800, rentIncrease: 0.03, rentersInsurance: 300, investReturn: 0.0656, inflation: 0.02,
    };
    // At 3% renting is ahead after 10 years; at 4% buying is (break-even in year 7).
    const a = breakEvenAppreciation(inp, 10)!;
    expect(a).toBeGreaterThan(0.03);
    expect(a).toBeLessThan(0.04);
    const at = rentVsBuy({ ...inp, appreciation: a }).years[9];
    expect(Math.abs(at.buyerNetWorth - at.renterNetWorth)).toBeLessThan(0.01);
    expect(rentVsBuy({ ...inp, appreciation: a + 0.001 }).breakEvenYear).not.toBeNull();
    // Buying already ahead at -10%: nothing to solve for.
    expect(breakEvenAppreciation({ ...base, rent: 5000 }, 10)).toBeNull();
  });
});

describe('splitGap', () => {
  it('puts the whole gap on fees when returns match', () => {
    const s = splitGap(plan(), { annualReturn: 0.07, fee: 0.022 }, { annualReturn: 0.07, fee: 0.002 });
    expect(s.returnEffect).toBeCloseTo(0, 6);
    expect(s.feeEffect).toBeCloseTo(s.gap, 6);
    expect(s.gap).toBeGreaterThan(0);
  });

  it('puts the whole gap on returns when fees match', () => {
    const s = splitGap(plan(), { annualReturn: 0.05, fee: 0.005 }, { annualReturn: 0.07, fee: 0.005 });
    expect(s.feeEffect).toBeCloseTo(0, 6);
    expect(s.returnEffect).toBeCloseTo(s.gap, 6);
  });

  it('parts add up to the gap and can pull in opposite directions', () => {
    const p = plan({ contribution: 500, years: 30 });
    const worse = { annualReturn: 0.06, fee: 0.002 };
    const better = { annualReturn: 0.08, fee: 0.01 };
    const s = splitGap(p, worse, better);
    const gap = simulateGrowth(p, better).finalBalance - simulateGrowth(p, worse).finalBalance;
    expect(s.gap).toBeCloseTo(gap, 6);
    expect(s.feeEffect + s.returnEffect).toBeCloseTo(gap, 6);
    expect(s.feeEffect).toBeLessThan(0); // the better fund charges more
    expect(s.returnEffect).toBeGreaterThan(gap);
  });
});
