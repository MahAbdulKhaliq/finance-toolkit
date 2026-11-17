import { Fragment, useMemo, useState } from 'react';
import {
  CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { retirementPlan, savingsRate, savingsRateCurve, savingsRateToRetireIn } from '../lib/finance/retirement';
import { realRate } from '../lib/finance/inflation';
import { money, moneyShort, num, pct } from '../lib/format';
import { useInflation, useRegion, useSettings } from '../state/settingsStore';
import { useShareFunds, useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { STARTER_FUNDS } from '../state/fundsStore';
import { FundSelect, ImportSharedFunds, useAvailableFunds } from '../components/funds/FundPicker';
import { InlineNumber, InlineSelect } from '../components/PlanSentence';
import { Button, Card, CardTitle, Details, PercentField, Table } from '../components/ui';

interface Inputs {
  age: number;
  income: number; // per year, after tax
  expenses: number; // per year
  portfolio: number;
  withdrawalRate: number;
  period: 'year' | 'month';
  fundIds: string[];
}

const DEFAULTS: Inputs = {
  age: 30,
  income: 70_000,
  expenses: 40_000,
  portfolio: 25_000,
  withdrawalRate: 0.04,
  period: 'year',
  fundIds: [STARTER_FUNDS[1].id, STARTER_FUNDS[0].id],
};

// Worded to read inside the sentence ("earn $70,000 a year").
const PERIODS: { value: Inputs['period']; label: string }[] = [
  { value: 'year', label: 'a year' },
  { value: 'month', label: 'a month' },
];

/** Past this age a plan counts as never reaching the goal. */
const LAST_AGE = 100;

const FUND_PANEL = 'ret-fund-panel';
const MORE_PANEL = 'ret-more-panel';

/** The sentence's type: 1.125rem on phones, 1.5rem from 640px up, tall leading so inline inputs fit. */
const SENTENCE = 'max-w-none text-lg leading-[1.9] font-medium text-muted sm:text-2xl sm:leading-[2]';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={`inline-block h-3 w-3 text-accent transition ${open ? 'rotate-180' : ''}`}>
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A value the sentence works out for you, set like an input value but not editable. */
function Derived({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`tabular font-semibold text-ink ${className}`}>{children}</span>;
}

export default function RetirementCalculator() {
  const region = useRegion();
  const inflation = useInflation();
  const setInflation = useSettings((s) => s.setInflation);
  const chart = useChartTheme();
  const tip = tooltipStyle(chart);
  const [fundsOpen, setFundsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const url = useUrlState<Inputs>(DEFAULTS);
  const { inputs, update, reset } = url;
  const { all, missing } = useAvailableFunds(url.sharedFunds);
  // Exactly two slots: the page measures what one fund costs against another. Older links with
  // more funds keep the first two; a missing or duplicate slot falls back to the defaults, then any
  // other fund.
  const funds = useMemo(() => {
    const picked: typeof all = [];
    for (const id of [...inputs.fundIds, ...DEFAULTS.fundIds, ...all.map((f) => f.id)]) {
      const f = all.find((x) => x.id === id);
      if (f && !picked.includes(f)) picked.push(f);
      if (picked.length === 2) break;
    }
    return picked;
  }, [inputs.fundIds, all]);
  // Choosing the fund already in the other slot swaps the two.
  const setSlot = (slot: number, id: string) => {
    const ids = funds.map((f) => f.id);
    const other = 1 - slot;
    if (ids[other] === id) ids[other] = ids[slot];
    ids[slot] = id;
    update({ fundIds: ids });
  };
  useShareFunds(url.setShareFunds, funds);

  const age = Math.round(inputs.age);
  const periodScale = inputs.period === 'month' ? 1 / 12 : 1;
  const rate = savingsRate(inputs.income, inputs.expenses);

  const results = useMemo(
    () =>
      funds.map((fund) => {
        const real = realRate(fund.annualReturn - fund.fee, inflation);
        const plan = retirementPlan({ ...inputs, realReturn: real });
        const t = plan.yearsToRetire;
        // Years until the goal, or null when it isn't reached by LAST_AGE.
        const years = t !== null && age + t <= LAST_AGE ? t : null;
        return { fund, real, plan, years };
      }),
    [funds, inputs, inflation, age],
  );
  const [primary, other] = results;
  const goal = primary?.plan.goal ?? inputs.expenses / inputs.withdrawalRate;

  // The chart runs a little past the later of the two retirements (or 40 years if one never gets
  // there), never past LAST_AGE.
  const longest = Math.max(5, ...results.map((r) => r.years ?? 40));
  const horizon = Math.max(1, Math.min(LAST_AGE - age, Math.ceil(longest) + 2));

  // Each fund's line runs year by year and stops exactly on the goal, at its fractional
  // retirement age, where an ink terminus cap marks it.
  const lineData = useMemo(() => {
    const rows = new Map<number, Record<string, number>>();
    const row = (a: number) => rows.get(a) ?? rows.set(a, { age: a }).get(a)!;
    results.forEach(({ fund, plan, years }) => {
      plan.years.forEach((y) => {
        if (y.year > horizon || (years !== null && y.year > years)) return;
        row(age + y.year)[fund.id] = y.netWorth;
      });
      if (years !== null && years > 0) row(age + years)[fund.id] = plan.goal;
    });
    return [...rows.values()].sort((a, b) => a.age - b.age);
  }, [results, horizon, age]);

  // Retirement age across savings rates (income fixed), for both funds.
  const curve = useMemo(() => {
    const rows: Record<string, number | null>[] = [];
    results.forEach(({ fund, real }) => {
      savingsRateCurve({ income: inputs.income, portfolio: inputs.portfolio, realReturn: real, withdrawalRate: inputs.withdrawalRate }, 0.01)
        .forEach((p, i) => {
          rows[i] ??= { rate: Math.round(p.rate * 100) };
          rows[i][fund.id] = p.years !== null && age + p.years <= LAST_AGE ? age + p.years : null;
        });
    });
    return rows;
  }, [results, inputs.income, inputs.portfolio, inputs.withdrawalRate, age]);

  // When the goal is out of reach: the savings rate that would retire you by 65 (or within 5 years
  // when you're already past 60).
  const targetAge = Math.max(65, age + 5);
  const needed = useMemo(
    () =>
      primary && primary.years === null
        ? savingsRateToRetireIn({ income: inputs.income, portfolio: inputs.portfolio, realReturn: primary.real, withdrawalRate: inputs.withdrawalRate }, targetAge - age)
        : null,
    [primary, inputs.income, inputs.portfolio, inputs.withdrawalRate, targetAge, age],
  );

  const pension = region.code === 'CA' ? 'CPP/OAS' : 'Social Security';
  const retireAt = (years: number) => Math.floor(age + years);
  // The withdrawal rate as typed: "4%", not "4.00%".
  // Spending as the sentence states it ("$3,333 a month" when amounts are monthly).
  const spendText = `${money(inputs.expenses * periodScale, region)} ${inputs.period === 'month' ? 'a month' : 'a year'}`;
  const wr = `${+(inputs.withdrawalRate * 100).toFixed(2)}%`;
  // Ages on the explorer in steps of 10, from the decade you're in to LAST_AGE.
  const ageFloor = Math.floor(age / 10) * 10;
  // Net worth chart: your age, then every 5th (or 10th, over long spans) age to the end.
  const ageStep = horizon > 30 ? 10 : 5;
  const ageAxis = [age, ...Array.from({ length: Math.floor((age + horizon) / ageStep) }, (_, i) => (i + 1) * ageStep).filter((a) => a > age + 1 && a <= age + horizon)];
  const ageTicks = Array.from({ length: (LAST_AGE - ageFloor) / 10 + 1 }, (_, i) => ageFloor + i * 10);

  /** The muted clause comparing the other fund. */
  const compareSentence = () => {
    if (!primary || !other || primary.years === null || primary.years === 0) return null;
    const name = <strong className="text-ink">{other.fund.name}</strong>;
    if (other.years === null) return <> With {name} you wouldn't get there by {LAST_AGE}.</>;
    const d = other.years - primary.years;
    if (Math.abs(d) < 0.05) return <> {name} gets you there at the same time.</>;
    return (
      <>
        {' '}With {name} you'd retire at {retireAt(other.years)},{' '}
        <strong className={d > 0 ? 'text-bad' : 'text-good'}>
          {num(Math.abs(d), 1)} years {d > 0 ? 'later' : 'sooner'}
        </strong>
        .
      </>
    );
  };

  const fundChip = (r: (typeof results)[number]) => (
    <button
      key={r.fund.id}
      type="button"
      aria-expanded={fundsOpen}
      aria-controls={FUND_PANEL}
      onClick={() => setFundsOpen((o) => !o)}
      // On phones the return drops under the name; from sm up the chip is one line in the sentence.
      className="inline-flex max-w-full flex-wrap items-baseline gap-x-2 rounded-2xl border border-line bg-surface px-3 py-1.5 text-left leading-snug font-semibold text-ink transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:rounded-full sm:py-0 sm:leading-[inherit]"
    >
      <span className="wrap-anywhere">
        <span aria-hidden className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-[0.05em]" style={{ background: r.fund.color }} />
        {r.fund.name}
      </span>
      <span className="basis-full pl-[1.125rem] text-base font-normal text-muted sm:basis-auto sm:pl-0 sm:text-lg">
        <span className="tabular">{pct(r.real)}</span> real <Chevron open={fundsOpen} />
      </span>
    </button>
  );

  // Each fund's line ends where it reaches the goal, in an ink terminus cap, as on the Home map.
  const terminus = (fundId: string, years: number | null) => (props: { cx?: number; cy?: number; payload?: Record<string, number> }) => {
    const { cx, cy, payload } = props;
    const key = `t-${fundId}-${payload?.age}`;
    if (years === null || years === 0 || payload?.age !== age + years || cx === undefined || cy === undefined) return <g key={key} />;
    return <rect key={key} x={cx - 3} y={cy - 8} width={6} height={16} rx={3} fill={chart.text} />;
  };

  // One line for screen readers on each change, rather than re-reading the whole answer.
  const announce = !primary
    ? ''
    : primary.years === null
      ? `Not by ${LAST_AGE} with ${primary.fund.name}.`
      : primary.years === 0
        ? 'You could retire now.'
        : `Retire at ${retireAt(primary.years)} with ${primary.fund.name}.`;

  // Fund key under each chart: a 4 × 20 colour bar per fund, names in ink.
  const legend = (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
      {results.map(({ fund }) => (
        <li key={fund.id} className="flex items-center gap-2">
          <span aria-hidden className="h-1 w-5 shrink-0 rounded-full" style={{ background: fund.color }} />
          <span className="wrap-anywhere">{fund.name}</span>
        </li>
      ))}
    </ul>
  );

  const tableYears = primary
    ? primary.plan.years.filter((y) => y.year > 0 && y.year <= (primary.years !== null ? Math.ceil(primary.years) : horizon))
    : [];

  return (
    <>
      <h1 className="sr-only">Retirement</h1>
      <ImportSharedFunds missing={missing} />

      {/* Your life and your money, as two sentences you edit in place */}
      <Card className="sm:p-6!">
        <p className={SENTENCE}>
          I'm <InlineNumber label="Your age" decimals={0} value={inputs.age} min={15} max={90} onChange={(v) => update({ age: Math.round(v) })} />,
          and earn{' '}
          <InlineNumber label="After-tax income" prefix="$" decimals={0} scale={periodScale} value={inputs.income} min={0} onChange={(income) => update({ income })} />{' '}
          <InlineSelect label="Amounts per" value={inputs.period} options={PERIODS} onChange={(period) => update({ period })} /> after
          tax and spend{' '}
          <InlineNumber label="Spending" prefix="$" decimals={0} scale={periodScale} value={inputs.expenses} min={0} onChange={(expenses) => update({ expenses })} />
          {rate >= 0 ? (
            <>, saving <Derived>{pct(rate, 0)}</Derived>.</>
          ) : (
            <>, <Derived className="text-bad">{money((inputs.expenses - inputs.income) * periodScale, region)}</Derived> more than I earn.</>
          )}
        </p>
        <p className={`mt-1 ${SENTENCE}`}>
          I have{' '}
          <InlineNumber label="Invested today" prefix="$" decimals={0} value={inputs.portfolio} min={0} onChange={(portfolio) => update({ portfolio })} />{' '}
          invested and would live on{' '}
          <InlineNumber label="Withdrawal rate (%)" suffix="%" scale={100} decimals={2} value={inputs.withdrawalRate} min={0.005} max={0.2} onChange={(withdrawalRate) => update({ withdrawalRate })} />{' '}
          of it a year.
        </p>
        {/* The fund pair on its own line, with no punctuation beside the chips: on phones each chip
            takes a full line, and a comma would start the next one. */}
        <p className={`mt-1 ${SENTENCE}`}>
          Invest in{' '}
          {results.map((r, i) => (
            <Fragment key={r.fund.id}>
              {i > 0 && ' compared with '}
              {fundChip(r)}
            </Fragment>
          ))}
        </p>

        {fundsOpen && (
          <div id={FUND_PANEL} className="mt-4 border-t border-line pt-4">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {funds.map((f, slot) => (
                <FundSelect
                  key={slot}
                  label={slot === 0 ? 'Invested in' : 'Compared with'}
                  funds={all}
                  value={f.id}
                  onChange={(id) => setSlot(slot, id)}
                  hint={slot === 0 ? `Real return = return − ${region.feeLabelInline} − inflation.` : undefined}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => setFundsOpen(false)}>Done</Button>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-3 text-sm text-muted">
          {!moreOpen && (
            <p className="tabular max-w-none min-w-0 basis-full lg:basis-0 lg:flex-1">
              <span className="normal-nums">Also assumed: </span>
              <span className="whitespace-nowrap">inflation {pct(inflation)}</span>
              {' · '}
              <span className="normal-nums">income and spending rise with it, so everything is in today's dollars</span>
            </p>
          )}
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls={MORE_PANEL}
            onClick={() => setMoreOpen((o) => !o)}
            className="-ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-accent transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:ml-0"
          >
            {moreOpen ? 'Hide' : 'Edit'} 1 more assumption <Chevron open={moreOpen} />
          </button>
          <Button variant="ghost" className="-ml-3 sm:ml-auto" onClick={reset}>
            Reset
          </Button>
        </div>

        {moreOpen && (
          <div id={MORE_PANEL} className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <PercentField label="Inflation" min={0} max={0.2} decimals={2} value={inflation} onChange={(v) => setInflation(v)} hint="Shared with the other calculators" />
          </div>
        )}
      </Card>

      {/* The answer: the age you could stop working */}
      <p className="sr-only" aria-live="polite">{announce}</p>
      <div className="mt-6 mb-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
        {!primary ? (
          <p className="text-lg text-muted">Add a fund to your library to see when you could retire.</p>
        ) : (
          <>
            <span className="tabular shrink-0 text-5xl leading-none font-bold tracking-[-0.03em] sm:text-6xl">
              {primary.years === null ? 'Never' : primary.years === 0 ? 'Now' : `At ${retireAt(primary.years)}`}
            </span>
            <p className="max-w-[30em] text-lg sm:text-xl">
              {primary.years === null ? (
                <>
                  at this savings rate: <strong>{primary.fund.name}</strong> doesn't reach your{' '}
                  <strong className="tabular">{money(goal, region)}</strong> goal by {LAST_AGE}.
                  {needed !== null && (
                    <span className="text-muted">
                      {' '}To retire by {targetAge} you'd need to save <strong className="tabular text-ink">{pct(needed, 0)}</strong> of your income.
                    </span>
                  )}
                </>
              ) : primary.years === 0 ? (
                <>
                  you could retire: <strong className="tabular">{money(inputs.portfolio, region)}</strong> already covers{' '}
                  {spendText} at {wr}.
                </>
              ) : (
                <>
                  is when you could retire, in <span className="tabular">{num(primary.years, 1)}</span> years with{' '}
                  <strong>{primary.fund.name}</strong>. Your goal is <strong className="tabular">{money(goal, region)}</strong>:{' '}
                  {spendText} at {wr}.
                  <span className="text-muted">{compareSentence()}</span>
                </>
              )}
            </p>
          </>
        )}
      </div>

      {primary && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[3fr_2fr]">
            <Card className="flex min-w-0 flex-col">
              <CardTitle>Net worth until retirement</CardTitle>
              <p className="-mt-1 mb-3 text-sm text-muted">
                In today's dollars, by age. Each line stops where it reaches your goal (dashed).
              </p>
              <div className="h-80 xl:h-auto xl:min-h-80 xl:flex-1">
                <ResponsiveContainer>
                  <LineChart data={lineData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis
                      dataKey="age"
                      type="number"
                      domain={[age, age + horizon]}
                      ticks={ageAxis}
                      stroke={chart.axis}
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                    <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(a: number) => `Age ${Number.isInteger(a) ? a : num(a, 1)}`} />
                    <ReferenceLine
                      y={goal}
                      stroke={chart.axis}
                      strokeDasharray="5 4"
                      label={{ value: `Goal ${moneyShort(goal, region)}`, position: 'insideTopLeft', fill: chart.text, fontSize: 12 }}
                    />
                    {results.map(({ fund, years }) => (
                      <Line
                        key={fund.id}
                        dataKey={fund.id}
                        name={fund.name}
                        stroke={fund.color}
                        strokeWidth={4}
                        strokeLinejoin="round"
                        connectNulls
                        dot={terminus(fund.id, years)}
                        activeDot={{ r: 5 }}
                        isAnimationActive={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {legend}
            </Card>

            <Card className="flex min-w-0 flex-col">
              <CardTitle>What if you saved more?</CardTitle>
              <p className="-mt-1 mb-3 text-sm text-muted">
                The age you could retire at for each savings rate, with income fixed. Click to use a rate.
              </p>
              <div className="h-72 xl:h-auto xl:min-h-72 xl:flex-1">
                <ResponsiveContainer>
                  <LineChart
                    data={curve}
                    margin={{ top: 20, right: 16, left: 0, bottom: 0 }}
                    onClick={(e) => {
                      const r = Number(e?.activeLabel);
                      if (Number.isFinite(r)) update({ expenses: inputs.income * (1 - r / 100) });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis dataKey="rate" type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} tickFormatter={(v) => `${v}%`} stroke={chart.axis} fontSize={12} tickLine={false} />
                    <YAxis stroke={chart.axis} fontSize={12} width={40} axisLine={false} tickLine={false} domain={[ageFloor, LAST_AGE]} ticks={ageTicks} allowDataOverflow />
                    <Tooltip {...tip} formatter={(v: number) => `Retire at ${Math.floor(v)}`} labelFormatter={(r) => `Saving ${r}%`} />
                    {results.map(({ fund }) => (
                      <Line key={fund.id} dataKey={fund.id} name={fund.name} stroke={fund.color} strokeWidth={3} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                    ))}
                    {primary.years !== null && rate >= 0 && rate <= 1 && (
                      <ReferenceDot
                        x={Math.round(rate * 100)}
                        y={age + primary.years}
                        r={6}
                        fill={primary.fund.color}
                        stroke={chart.tooltipBg}
                        strokeWidth={2}
                        // Below and to the left, in the empty space under both falling curves, haloed in the
                        // card colour; held clear of the y-axis at low savings rates.
                        label={({ viewBox }: { viewBox?: { x?: number; y?: number } }) => (
                          <text
                            x={Math.max((viewBox?.x ?? 0) - 12, 150)}
                            y={(viewBox?.y ?? 0) + 24}
                            textAnchor="end"
                            fill={chart.text}
                            stroke={chart.tooltipBg}
                            strokeWidth={4}
                            paintOrder="stroke"
                            fontSize={12}
                            fontWeight={600}
                          >
                            You · {pct(rate, 0)} → {retireAt(primary.years ?? 0)}
                          </text>
                        )}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {legend}
            </Card>
          </div>

          <Details summary={`Year by year with ${primary.fund.name}`}>
            <Table
              headers={['Age', 'Income', 'Spending', `${pct(primary.real, 1)} real return`, 'Saved + return', 'Net worth', 'Spending covered']}
              rows={tableYears.map((y) => [
                age + y.year,
                money(y.income, region),
                money(y.expenses, region),
                money(y.investmentReturn, region),
                money(y.savings + y.investmentReturn, region),
                money(y.netWorth, region),
                <span key="c" className={y.expensesCovered >= 1 ? 'font-semibold text-good' : ''}>{pct(y.expensesCovered, 0)}</span>,
              ])}
            />
          </Details>

          <p className="max-w-[75ch] text-xs text-muted">
            Returns are after fees and inflation. Taxes on withdrawals and government benefits like {pension} aren't
            included. A plan that doesn't reach the goal by {LAST_AGE} counts as never.
          </p>
        </div>
      )}
    </>
  );
}
