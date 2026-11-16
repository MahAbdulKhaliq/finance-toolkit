import { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { cagr, endValue, startValue, yearsBetween, yearsToReach } from '../lib/finance/cagr';
import { realRate } from '../lib/finance/inflation';
import { money, moneyShort, num, pct } from '../lib/format';
import { useInflation, useRegion } from '../state/settingsStore';
import { useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { FUND_COLORS, FUND_LIMITS, newId } from '../state/fundsStore';
import { FundEditor, type FundDraft } from '../components/funds/FundEditor';
import { ShareButton } from '../components/Toolbar';
import {
  Button, Card, CardTitle, MoneyField, NumberField, PageHeader, PercentField, Segmented, Stat,
} from '../components/ui';

type Mode = 'cagr' | 'end' | 'start' | 'years';

interface Row {
  id: string;
  name: string;
  start: number;
  end: number;
  years: number;
}

interface Inputs {
  view: 'single' | 'compare';
  mode: Mode;
  start: number;
  end: number;
  rate: number;
  years: number;
  useDates: boolean;
  from: string;
  to: string;
  rows: Row[];
}

const DEFAULTS: Inputs = {
  view: 'single',
  mode: 'cagr',
  start: 10_000,
  end: 25_000,
  rate: 0.07,
  years: 10,
  useDates: false,
  from: '2015-01-01',
  to: '2025-01-01',
  rows: [
    { id: 'r1', name: 'Global equity index', start: 10_000, end: 24_500, years: 10 },
    { id: 'r2', name: 'Balanced mutual fund', start: 10_000, end: 17_900, years: 10 },
    { id: 'r3', name: 'Bond index', start: 10_000, end: 12_200, years: 10 },
  ],
};

const MODES: { value: Mode; label: string }[] = [
  { value: 'cagr', label: 'CAGR' },
  { value: 'end', label: 'End value' },
  { value: 'start', label: 'Start value' },
  { value: 'years', label: 'Time needed' },
];

export default function CagrCalculator() {
  const region = useRegion();
  const inflation = useInflation();
  const chart = useChartTheme();
  const tip = tooltipStyle(chart);
  const { inputs, update, reset } = useUrlState<Inputs>(DEFAULTS);
  const [saveDraft, setSaveDraft] = useState<Partial<FundDraft> | null>(null);
  const [savedMsg, setSavedMsg] = useState('');

  const years = inputs.useDates ? yearsBetween(inputs.from, inputs.to) : inputs.years;

  // Solve for whichever value the mode asks for, then derive a complete (start, end, rate, years).
  const solved = useMemo(() => {
    const { mode, start, end, rate } = inputs;
    switch (mode) {
      case 'cagr': return { start, end, years, rate: cagr(start, end, years) };
      case 'end': return { start, rate, years, end: endValue(start, rate, years) };
      case 'start': return { end, rate, years, start: startValue(end, rate, years) };
      case 'years': return { start, end, rate, years: yearsToReach(start, end, rate) };
    }
  }, [inputs, years]);

  const valid = [solved.start, solved.end, solved.rate, solved.years].every(Number.isFinite) && solved.years > 0;
  const pathData = useMemo(() => {
    if (!valid) return [];
    const n = Math.ceil(solved.years);
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = Math.min(i, solved.years);
      return { year: +t.toFixed(2), value: solved.start * Math.pow(1 + solved.rate, t) };
    });
  }, [solved, valid]);

  const headline: Record<Mode, { label: string; value: string }> = {
    cagr: { label: 'Compound annual growth rate', value: pct(solved.rate) },
    end: { label: 'Ending value', value: money(solved.end, region, 2) },
    start: { label: 'Starting value needed', value: money(solved.start, region, 2) },
    years: { label: 'Time needed', value: Number.isFinite(solved.years) ? `${num(solved.years, 2)} years` : '—' },
  };

  // Comparison
  const rowResults = inputs.rows.map((r, i) => {
    const c = cagr(r.start, r.end, r.years);
    return { ...r, cagr: c, real: realRate(c, inflation), color: FUND_COLORS[i % FUND_COLORS.length] };
  });
  const maxYears = Math.ceil(Math.max(1, ...rowResults.map((r) => r.years)));
  const normalized = Array.from({ length: maxYears + 1 }, (_, y) => {
    const row: Record<string, number> = { year: y };
    rowResults.forEach((r) => {
      if (y <= Math.ceil(r.years) && Number.isFinite(r.cagr)) row[r.id] = 10_000 * Math.pow(1 + r.cagr, Math.min(y, r.years));
    });
    return row;
  });
  const setRow = (id: string, patch: Partial<Row>) =>
    update({ rows: inputs.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) });

  const openSave = (name: string, rate: number) =>
    setSaveDraft({ name, annualReturn: +rate.toFixed(4), fee: 0, notes: `Expected return from a ${pct(rate)} historical CAGR.` });

  return (
    <>
      <PageHeader
        title="CAGR Calculator"
        intro="Compound annual growth rate is the steady yearly rate that would turn a starting value into an ending value. Use it to compare investments over different time spans, then save a result as a fund's expected return."
        actions={<ShareButton />}
      />
      {savedMsg && <p className="-mt-3 mb-4 text-sm text-good">{savedMsg}</p>}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Segmented
          label="View"
          value={inputs.view}
          onChange={(view) => update({ view })}
          options={[
            { value: 'single', label: 'Calculator' },
            { value: 'compare', label: 'Compare investments' },
          ]}
        />
        <Button variant="ghost" onClick={reset}>Reset</Button>
      </div>

      {inputs.view === 'single' ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[22rem_1fr]">
          <Card>
            <CardTitle>Solve for</CardTitle>
            <Segmented label="Solve for" value={inputs.mode} onChange={(mode) => update({ mode })} options={MODES} />
            <div className="mt-4 flex flex-col gap-3">
              {inputs.mode !== 'start' && (
                <MoneyField label="Starting value" value={inputs.start} onChange={(start) => update({ start })} />
              )}
              {inputs.mode !== 'end' && (
                <MoneyField label="Ending value" value={inputs.end} onChange={(end) => update({ end })} />
              )}
              {inputs.mode !== 'cagr' && (
                <PercentField label="Annual growth rate (CAGR)" value={inputs.rate} min={-0.99} max={10} onChange={(rate) => update({ rate })} />
              )}
              {inputs.mode !== 'years' && (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={inputs.useDates} onChange={(e) => update({ useDates: e.target.checked })} className="accent-[var(--accent)]" />
                    Use start and end dates
                  </label>
                  {inputs.useDates ? (
                    <div className="grid grid-cols-2 gap-2">
                      {(['from', 'to'] as const).map((k) => (
                        <div key={k} className="flex flex-col gap-1">
                          <label htmlFor={`d-${k}`} className="text-sm font-medium">{k === 'from' ? 'Start date' : 'End date'}</label>
                          <input
                            id={`d-${k}`}
                            type="date"
                            value={inputs[k]}
                            onChange={(e) => update({ [k]: e.target.value } as Partial<Inputs>)}
                            className="rounded-lg border border-line bg-surface px-2 py-2 text-sm"
                          />
                        </div>
                      ))}
                      <p className="col-span-2 text-xs text-muted">= {num(years, 3)} years</p>
                    </div>
                  ) : (
                    <NumberField label="Years" suffix="yrs" value={inputs.years} min={0.01} max={200} onChange={(y) => update({ years: y })} />
                  )}
                </>
              )}
            </div>
          </Card>

          <div className="flex min-w-0 flex-col gap-5">
            <Card>
              {valid ? (
                <>
                  <div className="text-sm text-muted">{headline[inputs.mode].label}</div>
                  <div className="tabular mt-1 text-4xl font-bold text-accent">{headline[inputs.mode].value}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <Stat label="Start" value={money(solved.start, region)} />
                    <Stat label="End" value={money(solved.end, region)} />
                    <Stat label="CAGR" value={pct(solved.rate)} sub={`${pct(realRate(solved.rate, inflation))} after ${pct(inflation, 1)} inflation`} />
                    <Stat label="Total growth" value={pct(solved.end / solved.start - 1, 1)} sub={`over ${num(solved.years, 1)} yrs`} />
                  </div>
                  {inputs.mode === 'cagr' && (
                    <Button className="mt-4" variant="primary" onClick={() => openSave('My investment', solved.rate)}>
                      Save {pct(solved.rate)} as a fund →
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-muted">Those inputs don't have a valid answer. Check that values are positive and, when solving for time, that the rate moves the start toward the end value.</p>
              )}
            </Card>
            {valid && (
              <Card>
                <CardTitle>Growth path</CardTitle>
                <div className="h-72">
                  <ResponsiveContainer>
                    <LineChart data={pathData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke={chart.grid} vertical={false} />
                      <XAxis dataKey="year" stroke={chart.axis} fontSize={12} tickLine={false} />
                      <YAxis stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                      <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y) => `Year ${y}`} />
                      <Line dataKey="value" name="Value" stroke={chart.series.primary} strokeWidth={2.5} dot={{ r: 3, fill: chart.series.primary }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <Card>
            <CardTitle
              action={
                <Button
                  onClick={() => update({ rows: [...inputs.rows, { id: newId(), name: `Investment ${inputs.rows.length + 1}`, start: 10_000, end: 20_000, years: 10 }] })}
                >
                  + Add investment
                </Button>
              }
            >
              Investments
            </CardTitle>
            <div className="flex flex-col gap-3">
              {rowResults.map((r) => (
                <div key={r.id} className="grid grid-cols-2 items-end gap-2 rounded-lg border border-line p-3 sm:grid-cols-[1.5fr_1fr_1fr_0.7fr_auto_auto]">
                  <div className="col-span-2 flex flex-col gap-1 sm:col-span-1">
                    <label className="text-sm font-medium" htmlFor={`n-${r.id}`}>
                      <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                      Name
                    </label>
                    <input
                      id={`n-${r.id}`}
                      value={r.name}
                      maxLength={FUND_LIMITS.nameMax}
                      onChange={(e) => setRow(r.id, { name: e.target.value })}
                      className="rounded-lg border border-line bg-surface px-3 py-2 text-sm"
                    />
                  </div>
                  <MoneyField label="Start" value={r.start} onChange={(start) => setRow(r.id, { start })} />
                  <MoneyField label="End" value={r.end} onChange={(end) => setRow(r.id, { end })} />
                  <NumberField label="Years" value={r.years} min={0.01} onChange={(years) => setRow(r.id, { years })} />
                  <div className="tabular pb-2 text-right sm:min-w-24">
                    <div className="text-lg font-semibold">{pct(r.cagr)}</div>
                    <div className="text-xs text-muted">{pct(r.real)} real</div>
                  </div>
                  <div className="col-span-2 flex justify-end gap-1 pb-1 sm:col-span-1">
                    <Button disabled={!Number.isFinite(r.cagr)} onClick={() => openSave(r.name, r.cagr)} title="Save as a fund in My Funds">Save as fund</Button>
                    <Button variant="danger" aria-label={`Remove ${r.name}`} onClick={() => update({ rows: inputs.rows.filter((x) => x.id !== r.id) })}>✕</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card>
              <CardTitle>CAGR by investment</CardTitle>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={rowResults} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis dataKey="name" stroke={chart.axis} fontSize={12} tickLine={false} interval={0} />
                    <YAxis stroke={chart.axis} tickFormatter={(v) => pct(v, 0)} fontSize={12} width={48} axisLine={false} tickLine={false} />
                    <Tooltip {...tip} formatter={(v: number) => pct(v)} cursor={{ fill: chart.grid, opacity: 0.4 }} />
                    <ReferenceLine y={inflation} stroke={chart.axis} strokeDasharray="4 4" label={{ value: 'Inflation', fill: chart.axis, fontSize: 11, position: 'insideTopRight' }} />
                    <Bar dataKey="cagr" name="CAGR" radius={[4, 4, 0, 0]}>
                      {rowResults.map((r) => <Cell key={r.id} fill={r.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardTitle>Growth of {money(10_000, region)}</CardTitle>
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={normalized} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis dataKey="year" stroke={chart.axis} fontSize={12} tickLine={false} />
                    <YAxis stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                    <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y) => `Year ${y}`} />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    {rowResults.map((r) => (
                      <Line key={r.id} dataKey={r.id} name={r.name} stroke={r.color} strokeWidth={2.5} dot={false} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      <FundEditor
        open={saveDraft !== null}
        initial={saveDraft ?? undefined}
        onClose={() => setSaveDraft(null)}
        onSaved={(f) => setSavedMsg(`✓ Saved "${f.name}" to My Funds. It's now available in Growth & Fees and Rent vs. Buy.`)}
      />
    </>
  );
}
