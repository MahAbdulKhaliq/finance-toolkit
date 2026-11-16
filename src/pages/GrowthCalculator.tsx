import { useMemo } from 'react';
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { simulateGrowth, type Frequency, type Timing } from '../lib/finance/growth';
import { money, moneyShort, pct } from '../lib/format';
import { useRegion, useSettings } from '../state/settingsStore';
import { useShareFunds, useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { feeIsHigh, FUND_LIMITS, returnIsHigh, STARTER_FUNDS } from '../state/fundsStore';
import { FundMultiPicker, ImportSharedFunds, useAvailableFunds } from '../components/funds/FundPicker';
import { DollarsToggle, ShareButton, useDeflator } from '../components/Toolbar';
import {
  Button, Card, CardTitle, Details, MoneyField, NumberField, PageHeader, PercentField, SelectField, Stat, Table,
} from '../components/ui';

interface Inputs {
  initial: number;
  contribution: number;
  frequency: Frequency;
  timing: Timing;
  annualIncrease: number;
  years: number;
  fundIds: string[];
  overrides: Record<string, { fee?: number; annualReturn?: number }>;
}

const DEFAULTS: Inputs = {
  initial: 10_000,
  contribution: 500,
  frequency: 'monthly',
  timing: 'end',
  annualIncrease: 0,
  years: 30,
  fundIds: [STARTER_FUNDS[0].id, STARTER_FUNDS[1].id],
  overrides: {},
};

const FREQS: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

export default function GrowthCalculator() {
  const region = useRegion();
  const real = useSettings((s) => s.realDollars);
  const deflate = useDeflator();
  const chart = useChartTheme();

  const url = useUrlState<Inputs>(DEFAULTS);
  const { all, missing } = useAvailableFunds(url.sharedFunds);
  const selectedFunds = url.inputs.fundIds
    .map((id) => all.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => Boolean(f));
  useShareFunds(url.setShareFunds, selectedFunds);
  const { inputs, update, reset } = url;

  const results = useMemo(
    () =>
      selectedFunds.map((f) => {
        const o = inputs.overrides[f.id] ?? {};
        const fee = o.fee ?? f.fee;
        const annualReturn = o.annualReturn ?? f.annualReturn;
        return { fund: f, fee, annualReturn, r: simulateGrowth(inputs, { fee, annualReturn }) };
      }),
    [inputs, selectedFunds],
  );

  const years = Math.round(inputs.years);
  const lineData = useMemo(() => {
    const rows = [];
    for (let y = 0; y <= years; y++) {
      const row: Record<string, number> = { year: y };
      results.forEach(({ fund, r }) => (row[fund.id] = deflate(r.points[y].balance, y)));
      if (results[0]) row.contributed = deflate(results[0].r.points[y].contributed, y);
      rows.push(row);
    }
    return rows;
  }, [results, years, deflate]);

  const best = results.length ? results.reduce((a, b) => (b.r.finalBalance > a.r.finalBalance ? b : a)) : null;
  const worst = results.length ? results.reduce((a, b) => (b.r.finalBalance < a.r.finalBalance ? b : a)) : null;
  const gap = best && worst ? deflate(best.r.finalBalance - worst.r.finalBalance, years) : 0;

  const costData = results.map(({ fund, r }) => ({
    name: fund.name,
    color: fund.color,
    fees: deflate(r.totalFeesPaid, years),
    lost: deflate(r.totalFeeCost - r.totalFeesPaid, years),
  }));

  const fmtAxis = (v: number) => moneyShort(v, region);
  const tip = tooltipStyle(chart);

  return (
    <>
      <PageHeader
        title="Growth & Fees"
        intro={`See how much a fund's ${region.feeLabelInline} really costs. The fee is small each year, but it also takes away the growth that money would have earned, and that compounds over decades.`}
        actions={<ShareButton />}
      />
      <ImportSharedFunds missing={missing} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[22rem_1fr]">
        <div className="flex flex-col gap-5">
          <Card>
            <CardTitle action={<Button variant="ghost" onClick={reset}>Reset</Button>}>Your plan</CardTitle>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2">
              <MoneyField label="Initial investment" value={inputs.initial} onChange={(initial) => update({ initial })} />
              <MoneyField label="Contribution" value={inputs.contribution} onChange={(contribution) => update({ contribution })} />
              <SelectField label="Frequency" value={inputs.frequency} onChange={(frequency) => update({ frequency })} options={FREQS} />
              <SelectField
                label="Timing"
                value={inputs.timing}
                onChange={(timing) => update({ timing })}
                options={[
                  { value: 'start', label: 'Start of period' },
                  { value: 'end', label: 'End of period' },
                ]}
              />
              <PercentField
                label="Yearly raise"
                hint="Grow contributions each year"
                value={inputs.annualIncrease}
                min={0}
                max={0.5}
                onChange={(annualIncrease) => update({ annualIncrease })}
              />
              <NumberField label="Years" suffix="yrs" value={inputs.years} min={1} max={70} decimals={0} onChange={(y) => update({ years: Math.round(y) })} />
            </div>
          </Card>

          <Card>
            <CardTitle>Funds to compare</CardTitle>
            <FundMultiPicker
              // Show this page's overrides on the chips so they match the results.
              funds={all.map((f) => ({ ...f, ...inputs.overrides[f.id] }))}
              selected={inputs.fundIds} onChange={(fundIds) => update({ fundIds })} />
            {selectedFunds.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
                <p className="text-xs text-muted">Adjust for this comparison only. Your library isn't changed.</p>
                {selectedFunds.map((f) => {
                  const o = inputs.overrides[f.id] ?? {};
                  const set = (patch: { fee?: number; annualReturn?: number }) =>
                    update({ overrides: { ...inputs.overrides, [f.id]: { ...o, ...patch } } });
                  return (
                    <div key={f.id}>
                      <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: f.color }} />
                        {f.name}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <PercentField
                          label={region.feeLabel}
                          value={o.fee ?? f.fee}
                          min={0}
                          max={FUND_LIMITS.feeMax}
                          onChange={(fee) => set({ fee })}
                          hint={feeIsHigh(o.fee ?? f.fee) ? <span className="text-warn-ink">Unusually high. Are you sure?</span> : undefined}
                        />
                        <PercentField
                          label="Return"
                          value={o.annualReturn ?? f.annualReturn}
                          min={FUND_LIMITS.returnMin}
                          max={FUND_LIMITS.returnMax}
                          onChange={(annualReturn) => set({ annualReturn })}
                          hint={returnIsHigh(o.annualReturn ?? f.annualReturn) ? <span className="text-warn-ink">Unusually high. Are you sure?</span> : undefined}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          {results.length === 0 ? (
            <Card className="text-center text-muted">Pick at least one fund to see results.</Card>
          ) : (
            <>
              {results.length > 1 && best && worst && best !== worst && (
                <Card className="border-accent/40 bg-accent-soft/40">
                  <p className="text-lg">
                    After {years} years, <strong>{best.fund.name}</strong> ends up{' '}
                    <strong className="text-good">{money(gap, region)}</strong> ahead of{' '}
                    <strong>{worst.fund.name}</strong>
                    {real && " in today's dollars"}.
                  </p>
                </Card>
              )}

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.map(({ fund, fee, r }) => (
                  <Card key={fund.id} className="!p-4">
                    <div className="mb-3 flex items-center gap-2 font-semibold">
                      <span className="h-3 w-3 rounded-full" style={{ background: fund.color }} />
                      <span className="truncate">{fund.name}</span>
                      <span className="ml-auto text-xs font-normal text-muted">{pct(fee)} {region.feeLabel}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Stat label="Final balance" value={money(deflate(r.finalBalance, years), region)} />
                      <Stat label="You contributed" value={money(deflate(r.totalContributed, years), region)} />
                      <Stat label="Fees paid" value={money(deflate(r.totalFeesPaid, years), region)} tone="bad" />
                      <Stat
                        label="Total cost of fees"
                        value={money(deflate(r.totalFeeCost, years), region)}
                        sub={`${pct(r.totalFeeCost / (r.finalBalance + r.totalFeeCost), 1)} of what you'd have`}
                        tone="bad"
                      />
                    </div>
                  </Card>
                ))}
              </div>

              <Card>
                <CardTitle action={<DollarsToggle />}>Portfolio value over time</CardTitle>
                <div className="h-80">
                  <ResponsiveContainer>
                    <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke={chart.grid} vertical={false} />
                      <XAxis dataKey="year" stroke={chart.axis} tickLine={false} fontSize={12} label={{ value: 'Year', position: 'insideBottomRight', offset: -2, fill: chart.axis, fontSize: 12 }} />
                      <YAxis stroke={chart.axis} tickFormatter={fmtAxis} tickLine={false} axisLine={false} fontSize={12} width={64} />
                      <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y) => `Year ${y}`} />
                      <Legend wrapperStyle={{ fontSize: 13 }} />
                      {results.map(({ fund }) => (
                        <Line key={fund.id} dataKey={fund.id} name={fund.name} stroke={fund.color} strokeWidth={2.5} dot={false} />
                      ))}
                      <Line dataKey="contributed" name="Contributed" stroke={chart.muted} strokeDasharray="5 4" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <CardTitle>What fees cost you</CardTitle>
                <p className="-mt-1 mb-3 text-sm text-muted">
                  <strong>Fees paid</strong> is what the fund charged. <strong>Lost growth</strong> is what that money would have earned if it had stayed invested.
                </p>
                <div style={{ height: Math.max(140, costData.length * 56 + 50) }}>
                  <ResponsiveContainer>
                    <BarChart data={costData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke={chart.grid} horizontal={false} />
                      <XAxis type="number" stroke={chart.axis} tickFormatter={fmtAxis} fontSize={12} />
                      <YAxis type="category" dataKey="name" stroke={chart.axis} width={130} fontSize={12} tickLine={false} />
                      <Tooltip {...tip} formatter={(v: number) => money(v, region)} cursor={{ fill: chart.grid, opacity: 0.4 }} />
                      <Legend wrapperStyle={{ fontSize: 13 }} />
                      <Bar dataKey="fees" name="Fees paid" stackId="a" fill="#e11d48" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="lost" name="Lost growth" stackId="a" fill="#fb923c" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Details summary="Year-by-year table">
                <Table
                  headers={['Year', 'Contributed', ...results.flatMap(({ fund }) => [`${fund.name}`, 'Fees to date'])]}
                  rows={lineData.map((row, y) => [
                    y,
                    money(row.contributed, region),
                    ...results.flatMap(({ fund, r }) => [
                      money(row[fund.id], region),
                      money(deflate(r.points[y].feesPaid, y), region),
                    ]),
                  ])}
                />
              </Details>
            </>
          )}
        </div>
      </div>
    </>
  );
}
