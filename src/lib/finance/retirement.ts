/**
 * Early-retirement ("financial independence") model, in today's dollars.
 *
 * Each year you earn `income`, spend `expenses` and invest the difference. The portfolio earns
 * `realReturn` (after fees and inflation) on its balance at the start of the year, and the year's
 * savings are added at the end. You can retire once the portfolio reaches
 * `expenses / withdrawalRate`, i.e. when a `withdrawalRate` draw covers your spending.
 */
export interface RetirementInput {
  income: number;
  expenses: number;
  portfolio: number;
  /** Annual return after fees and inflation, decimal. */
  realReturn: number;
  /** Safe withdrawal rate, decimal (0.04 = the "4% rule"). */
  withdrawalRate: number;
}

export interface RetirementYear {
  year: number;
  income: number;
  expenses: number;
  investmentReturn: number;
  savings: number;
  netWorth: number;
  /** Share of expenses a `withdrawalRate` draw on this year's net worth would cover. */
  expensesCovered: number;
}

export interface RetirementResult {
  goal: number;
  savingsRate: number;
  /** Fractional years until the goal is reached; 0 if already there; null if never (within the cap). */
  yearsToRetire: number | null;
  years: RetirementYear[];
}

export const MAX_YEARS = 100;

export function savingsRate(income: number, expenses: number): number {
  return income > 0 ? (income - expenses) / income : 0;
}

export function retirementPlan(inp: RetirementInput, minYears = 0): RetirementResult {
  const wr = Math.max(inp.withdrawalRate, 1e-6);
  const goal = Math.max(0, inp.expenses) / wr;
  const savings = inp.income - inp.expenses;
  const years: RetirementYear[] = [
    {
      year: 0,
      income: 0,
      expenses: 0,
      investmentReturn: 0,
      savings: 0,
      netWorth: inp.portfolio,
      expensesCovered: covered(inp.portfolio, wr, inp.expenses),
    },
  ];

  let yearsToRetire: number | null = inp.portfolio >= goal ? 0 : null;
  let bal = inp.portfolio;
  for (let y = 1; y <= MAX_YEARS; y++) {
    if (yearsToRetire !== null && y > Math.max(minYears, Math.ceil(yearsToRetire))) break;
    const ret = bal * inp.realReturn;
    const prev = bal;
    bal += savings + ret;
    years.push({
      year: y,
      income: inp.income,
      expenses: inp.expenses,
      investmentReturn: ret,
      savings,
      netWorth: bal,
      expensesCovered: covered(bal, wr, inp.expenses),
    });
    if (yearsToRetire === null && bal >= goal) {
      // Interpolate within the year for a fractional answer (e.g. 12.4 years).
      yearsToRetire = y - 1 + (goal - prev) / (bal - prev);
    }
    // Stop early if the portfolio can never grow (no savings and no positive return).
    if (yearsToRetire === null && bal <= prev && savings <= 0 && y > 1) break;
  }

  return { goal, savingsRate: savingsRate(inp.income, inp.expenses), yearsToRetire, years };
}

function covered(netWorth: number, wr: number, expenses: number) {
  return expenses > 0 ? (netWorth * wr) / expenses : 1;
}

/** Years to retirement across savings rates (0–100%), keeping income fixed. */
export function savingsRateCurve(inp: Omit<RetirementInput, 'expenses'>, step = 0.05) {
  const points: { rate: number; years: number | null }[] = [];
  for (let i = 0; i <= Math.round(1 / step); i++) {
    const rate = Math.min(1, i * step);
    const r = retirementPlan({ ...inp, expenses: inp.income * (1 - rate) });
    points.push({ rate, years: r.yearsToRetire });
  }
  return points;
}

/**
 * The lowest savings rate (share of income, keeping income fixed) that reaches the goal within
 * `years`. Years to retire fall as the savings rate rises, so a bisection finds it. Saving all of
 * your income means spending, and so the goal, is zero, so a rate always exists.
 */
export function savingsRateToRetireIn(inp: Omit<RetirementInput, 'expenses'>, years: number): number {
  const reaches = (rate: number) => {
    const t = retirementPlan({ ...inp, expenses: inp.income * (1 - rate) }).yearsToRetire;
    return t !== null && t <= years;
  };
  if (reaches(0)) return 0;
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 40; k++) {
    const mid = (lo + hi) / 2;
    if (reaches(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
}
