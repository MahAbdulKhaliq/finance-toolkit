import { useMemo } from 'react';
import {
  CartesianGrid, Legend, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { MAX_YEARS, retirementPlan, savingsRate, savingsRateCurve } from '../lib/finance/retirement';
import { realRate } from '../lib/finance/inflation';
import { money, moneyShort, num, pct } from '../lib/format';
import { useInflation, useRegion, useSettings } from '../state/settingsStore';
import { useShareFunds, useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { STARTER_FUNDS } from '../state/fundsStore';
import { FundMultiPicker, ImportSharedFunds, useAvailableFunds } from '../components/funds/FundPicker';
import { ShareButton } from '../components/Toolbar';
import {
  Button, Card, CardTitle, Details, NumberField, PageHeader, PercentField, Segmented, Stat, Table,
} from '../components/ui';

interface Inputs {
  income: number; // per year, after tax
  expenses: number; // per year
  portfolio: number;
  withdrawalRate: number;
  period: 'year' | 'month';
  fundIds: string[];
}

const DEFAULTS: Inputs = {
  income: 70_000,
  expenses: 40_000,
  portfolio: 25_000,
  withdrawalRate: 0.04,
  period: 'year',
  fundIds: [STARTER_FUNDS[1].id, STARTER_FUNDS[0].id],
};

const fmtYears = (y: number | null) => (y === null ? `${MAX_YEARS}+ years` : `${num(y, 1)} years`);

export default function RetirementCalculator() {
  const region = useRegion();
  const inflation = useInflation();
  const setInflation = useSettings((s) => s.setInflation);
  const chart = useChartTheme();
  const tip = tooltipStyle(chart);

  const url = useUrlState<Inputs>(DEFAULTS);
  const { inputs, update, reset } = url;
  const { all, missing } = useAvailableFunds(url.sharedFunds);
  const selected = inputs.fundIds
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));
  useShareFunds(url.setShareFunds, selected);

  const perMonth = inputs.period === 'month';
  const periodScale = perMonth ? 1 / 12 : 1;
  const periodLabel = perMonth ? '/mo' : '/yr';
  const savings = inputs.income - inputs.expenses;
  const rate = savingsRate(inputs.income, inputs.expenses);

  // First pass finds each fund's answer; the second runs every fund to a shared chart horizon.
  const results = useMemo(() => {
    const base = selected.map((fund) => {
      const real = realRate(fund.annualReturn - fund.fee, inflation);
      return { fund, real, plan: retirementPlan({ ...inputs, realReturn: real }) };
    });
    const longest = Math.max(5, ...base.map((b) => b.plan.yearsToRetire ?? 40));
    const horizon = Math.min(MAX_YEARS, Math.ceil(longest) + 2);
    return {
      horizon,
      funds: base.map((b) => ({ ...b, plan: retirementPlan({ ...inputs, realReturn: b.real }, horizon) })),
    };
  }, [inputs, selected, inflation]);

  const primary = results.funds[0];
  const goal = primary?.plan.goal ?? inputs.expenses / inputs.withdrawalRate;

  const lineData = useMemo(() => {
    const rows: Record<string, number>[] = [];
    for (let y = 0; y <= results.horizon; y++) {
      const row: Record<string, number> = { year: y };
      results.funds.forEach(({ fund, plan }) => {
        if (plan.years[y]) row[fund.id] = plan.years[y].netWorth;
      });
      rows.push(row);
    }
    return rows;
  }, [results]);

  const curve = useMemo(
    () =>
      primary
        ? savingsRateCurve({ income: inputs.income, portfolio: inputs.portfolio, realReturn: primary.real, withdrawalRate: inputs.withdrawalRate }, 0.01)
            .map((p) => ({ rate: Math.round(p.rate * 100), years: p.years }))
        : [],
    [primary, inputs.income, inputs.portfolio, inputs.withdrawalRate],
  );

  const sorted = [...results.funds].sort((a, b) => (a.plan.yearsToRetire ?? Infinity) - (b.plan.yearsToRetire ?? Infinity));
  const fastest = sorted[0];
  const slowest = sorted[sorted.length - 1];
  const gap =
    fastest && slowest && fastest !== slowest && fastest.plan.yearsToRetire !== null
      ? (slowest.plan.yearsToRetire ?? MAX_YEARS) - fastest.plan.yearsToRetire
      : 0;

  const pension = region.code === 'CA' ? 'CPP/OAS' : 'Social Security';

  return (
    <>
      <PageHeader
        title="Retirement"
        intro="Find out when your investments could cover your spending. Your savings rate matters most: the more of your income you invest, the faster you get there and the less you need."
        actions={<ShareButton />}
      />
      <ImportSharedFunds missing={missing} />

      <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
        <div className="flex flex-col gap-5">
          <Card>
            <CardTitle action={<Button variant="ghost" onClick={reset}>Reset</Button>}>Your situation</CardTitle>
            <Segmented
              label="Enter amounts"
              value={inputs.period}
              onChange={(period) => update({ period })}
              options={[
                { value: 'year', label: 'Yearly' },
                { value: 'month', label: 'Monthly' },
              ]}
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <NumberField label={`After-tax income ${periodLabel}`} prefix="$" min={0} decimals={0} scale={periodScale} value={inputs.income} onChange={(income) => update({ income })} />
              </div>
              <NumberField label={`Expenses ${periodLabel}`} prefix="$" min={0} decimals={0} scale={periodScale} value={inputs.expenses} onChange={(expenses) => update({ expenses })} />
              <NumberField
                label={`Savings ${periodLabel}`}
                prefix="$"
                decimals={0}
                scale={periodScale}
                value={savings}
                onChange={(s) => update({ expenses: Math.max(0, inputs.income - s) })}
              />
              <PercentField
                label="Savings rate"
                max={1}
                decimals={1}
                value={rate}
                onChange={(r) => update({ expenses: Math.max(0, inputs.income * (1 - r)) })}
                hint="Savings ÷ income"
              />
              <NumberField label="Invested today" prefix="$" min={0} decimals={0} value={inputs.portfolio} onChange={(portfolio) => update({ portfolio })} />
            </div>
          </Card>

          <Card>
            <CardTitle>Assumptions</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <PercentField
                label="Withdrawal rate"
                min={0.005}
                max={0.2}
                decimals={2}
                value={inputs.withdrawalRate}
                onChange={(withdrawalRate) => update({ withdrawalRate })}
                hint="The 4% rule is a common starting point"
              />
              <PercentField
                label="Inflation"
                min={0}
                max={0.2}
                decimals={2}
                value={inflation}
                onChange={(v) => setInflation(v)}
                hint="Shared with the other calculators"
              />
            </div>
          </Card>

          <Card>
            <CardTitle>Invest in</CardTitle>
            <FundMultiPicker funds={all} selected={inputs.fundIds} onChange={(fundIds) => update({ fundIds })} />
            <p className="mt-3 text-xs text-muted">
              Each fund grows at its return minus its {region.feeLabelInline}, minus inflation. Pick
              more than one to see how fees change your retirement date. The first one selected is
              used for the savings-rate chart and table.
            </p>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          {!primary ? (
            <Card className="text-center text-muted">Pick at least one fund to see results.</Card>
          ) : (
            <>
              <Card className="border-accent/40 bg-accent-soft/40">
                {primary.plan.yearsToRetire === 0 ? (
                  <p className="text-lg"><strong>You can already retire.</strong> Your portfolio covers your expenses at a {pct(inputs.withdrawalRate, 1)} withdrawal rate.</p>
                ) : primary.plan.yearsToRetire === null ? (
                  <p className="text-lg">At this savings rate, <strong>you won't reach your goal within {MAX_YEARS} years</strong> with {primary.fund.name}. Try saving more or spending less.</p>
                ) : (
                  <p className="text-lg">
                    You can retire in <strong className="text-2xl text-good">{num(primary.plan.yearsToRetire, 1)} years</strong>{' '}
                    with a {pct(rate, 0)} savings rate, investing in <strong>{primary.fund.name}</strong>.
                  </p>
                )}
                <p className="mt-1 text-sm text-muted">
                  Your goal is <strong className="text-ink">{money(goal, region)}</strong>, which covers{' '}
                  {money(inputs.expenses, region)} a year at a {pct(inputs.withdrawalRate, 1)} withdrawal rate.
                  {gap > 0.05 && slowest && fastest && (
                    <> With <strong className="text-ink">{slowest.fund.name}</strong> instead of {fastest.fund.name}, it takes <strong className="text-bad">{num(gap, 1)} years longer</strong>.</>
                  )}
                </p>
              </Card>

              {results.funds.length > 1 && (
                <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                  {results.funds.map(({ fund, real, plan }) => (
                    <Stat
                      key={fund.id}
                      label={fund.name}
                      value={fmtYears(plan.yearsToRetire)}
                      sub={`${pct(real)} real return after ${pct(fund.fee)} ${region.feeLabelInline}`}
                      tone={fund === fastest.fund ? 'good' : undefined}
                    />
                  ))}
                </div>
              )}

              <Card>
                <CardTitle>Net worth until retirement</CardTitle>
                <p className="-mt-1 mb-3 text-sm text-muted">In today's dollars. The dashed line is your goal.</p>
                <div className="h-80">
                  <ResponsiveContainer>
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke={chart.grid} vertical={false} />
                      <XAxis dataKey="year" stroke={chart.axis} fontSize={12} tickLine={false} />
                      <YAxis stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                      <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y) => `Year ${y}`} />
                      <Legend wrapperStyle={{ fontSize: 13 }} />
                      <ReferenceLine y={goal} stroke={chart.axis} strokeDasharray="5 4" label={{ value: `Goal ${moneyShort(goal, region)}`, position: 'insideTopLeft', fill: chart.text, fontSize: 12 }} />
                      {results.funds.map(({ fund }) => (
                        <Line key={fund.id} dataKey={fund.id} name={fund.name} stroke={fund.color} strokeWidth={2.5} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardTitle>Explore different savings rates</CardTitle>
                <p className="-mt-1 mb-3 text-sm text-muted">
                  Years to retirement with {primary.fund.name}. Click the chart to try a different savings rate.
                </p>
                <div className="h-72">
                  <ResponsiveContainer>
                    <LineChart
                      data={curve}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      onClick={(e) => {
                        const r = Number(e?.activeLabel);
                        if (Number.isFinite(r)) update({ expenses: inputs.income * (1 - r / 100) });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <CartesianGrid stroke={chart.grid} vertical={false} />
                      <XAxis dataKey="rate" type="number" domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} tickFormatter={(v) => `${v}%`} stroke={chart.axis} fontSize={12} tickLine={false} />
                      <YAxis stroke={chart.axis} fontSize={12} width={40} axisLine={false} tickLine={false} domain={[0, (max: number) => Math.min(MAX_YEARS, Math.ceil(max / 10) * 10)]} />
                      <Tooltip {...tip} formatter={(v: number) => fmtYears(v)} labelFormatter={(r) => `Savings rate ${r}%`} />
                      <Line dataKey="years" name="Years to retire" stroke={primary.fund.color} strokeWidth={2.5} dot={false} connectNulls={false} />
                      {primary.plan.yearsToRetire !== null && rate >= 0 && rate <= 1 && (
                        <ReferenceDot
                          x={Math.round(rate * 100)}
                          y={primary.plan.yearsToRetire}
                          r={6}
                          fill={primary.fund.color}
                          stroke={chart.tooltipBg}
                          strokeWidth={2}
                          label={{ value: `${num(primary.plan.yearsToRetire, 1)} yrs`, position: 'top', fill: chart.text, fontSize: 12 }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Details summary={`Year-by-year breakdown (${primary.fund.name})`}>
                <Table
                  headers={['Year', 'Income', 'Expenses', `${pct(primary.real, 1)} real return`, 'Savings + return', 'Net worth', 'Expenses covered']}
                  rows={primary.plan.years
                    .filter((y) => y.year > 0 && y.year <= Math.ceil(primary.plan.yearsToRetire ?? results.horizon))
                    .map((y) => [
                      y.year,
                      money(y.income, region),
                      money(y.expenses, region),
                      money(y.investmentReturn, region),
                      money(y.savings + y.investmentReturn, region),
                      money(y.netWorth, region),
                      <span key="c" className={y.expensesCovered >= 1 ? 'font-semibold text-good' : ''}>{pct(y.expensesCovered, 0)}</span>,
                    ])}
                />
              </Details>

              <p className="text-xs text-muted">
                All amounts are in today's dollars: income and expenses are assumed to rise with
                inflation. Taxes on withdrawals and government benefits like {pension} aren't included.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
