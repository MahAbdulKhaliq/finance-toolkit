export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
export type Timing = 'start' | 'end';

export const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
  annually: 1,
};

export interface ContributionPlan {
  initial: number;
  contribution: number;
  frequency: Frequency;
  timing: Timing;
  /** Yearly increase of the contribution amount, decimal (0.02 = 2%). */
  annualIncrease: number;
  years: number;
}

export interface FundParams {
  /** Expected gross annual return, decimal. */
  annualReturn: number;
  /** Annual fee (MER / expense ratio), decimal. */
  fee: number;
}

export interface GrowthPoint {
  year: number;
  balance: number;
  contributed: number;
  feesPaid: number;
  /** Same plan with a 0% fee, used to measure the full cost of fees incl. lost growth. */
  noFeeBalance: number;
}

export interface GrowthResult {
  points: GrowthPoint[];
  finalBalance: number;
  totalContributed: number;
  totalFeesPaid: number;
  /** noFeeBalance − balance: direct fees plus the growth those fees would have earned. */
  totalFeeCost: number;
}

/**
 * Simulates a portfolio step by step. The step is the contribution period when that is finer
 * than monthly, otherwise one month. Growth compounds to the stated annual return; the fee is
 * charged pro rata on the balance each step (approximating daily accrual inside a fund).
 */
export function simulateGrowth(plan: ContributionPlan, fund: FundParams): GrowthResult {
  const ppy = PERIODS_PER_YEAR[plan.frequency];
  const steps = Math.max(12, ppy);
  const every = steps / ppy; // contribute every N steps
  const g = Math.pow(1 + fund.annualReturn, 1 / steps) - 1;
  const f = fund.fee / steps;
  const years = Math.max(0, Math.round(plan.years));

  let bal = plan.initial;
  let shadow = plan.initial;
  let contributed = plan.initial;
  let fees = 0;
  const points: GrowthPoint[] = [
    { year: 0, balance: bal, contributed, feesPaid: 0, noFeeBalance: shadow },
  ];

  for (let y = 0; y < years; y++) {
    const amount = plan.contribution * Math.pow(1 + plan.annualIncrease, y);
    for (let s = 0; s < steps; s++) {
      const contributeNow =
        plan.contribution > 0 &&
        (plan.timing === 'start' ? s % every === 0 : (s + 1) % every === 0);
      if (contributeNow && plan.timing === 'start') {
        bal += amount;
        shadow += amount;
        contributed += amount;
      }
      bal *= 1 + g;
      shadow *= 1 + g;
      const fee = bal * f;
      bal -= fee;
      fees += fee;
      if (contributeNow && plan.timing === 'end') {
        bal += amount;
        shadow += amount;
        contributed += amount;
      }
    }
    points.push({ year: y + 1, balance: bal, contributed, feesPaid: fees, noFeeBalance: shadow });
  }

  return {
    points,
    finalBalance: bal,
    totalContributed: contributed,
    totalFeesPaid: fees,
    totalFeeCost: shadow - bal,
  };
}
