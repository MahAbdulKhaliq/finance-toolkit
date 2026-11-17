import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cagr, endValue, startValue, yearsBetween, yearsToReach } from '../lib/finance/cagr';
import { realRate } from '../lib/finance/inflation';
import { money, moneyShort, num, pct } from '../lib/format';
import { useInflation, useRegion, useSettings } from '../state/settingsStore';
import { useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { FUND_COLORS, FUND_LIMITS, newId } from '../state/fundsStore';
import { FundEditor, type FundDraft } from '../components/funds/FundEditor';
import { InlineDate, InlineNumber, InlineSelect, InlineText } from '../components/PlanSentence';
import { Button, Card, CardTitle, PercentField } from '../components/ui';

type Mode = 'cagr' | 'end' | 'start' | 'years';

interface Row {
  id: string;
  name: string;
  start: number;
  end: number;
  years: number;
}

interface Inputs {
  /** Old links only: 'compare' was the separate Compare view, whose `rows` now become compare lines. */
  view: 'single' | 'compare';
  mode: Mode;
  name: string;
  start: number;
  end: number;
  rate: number;
  years: number;
  useDates: boolean;
  from: string;
  to: string;
  /** The old Compare view's rows, kept so old links decode. */
  rows: Row[];
  /** Investments compared with the first, each one more line in the sentence card. */
  compare: Row[];
}

const DEFAULTS: Inputs = {
  view: 'single',
  mode: 'cagr',
  name: 'My investment',
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
  compare: [],
};

// Worded to read inside the sentence ("Solve for the growth rate.").
const SOLVE: { value: Mode; label: string }[] = [
  { value: 'cagr', label: 'growth rate' },
  { value: 'end', label: 'end value' },
  { value: 'start', label: 'start value' },
  { value: 'years', label: 'time needed' },
];
const SPANS: { value: 'years' | 'dates'; label: string }[] = [
  { value: 'years', label: 'over' },
  { value: 'dates', label: 'between' },
];

const MORE_PANEL = 'cagr-more-panel';
const NORMAL = 10_000; // compared investments all start from this amount on the chart

/** The sentence's type: 1.125rem on phones, 1.5rem from 640px up, tall leading so inline inputs fit. */
const SENTENCE = 'max-w-none text-lg leading-[1.9] font-medium text-muted sm:text-2xl sm:leading-[2]';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={`inline-block h-3 w-3 text-accent transition ${open ? 'rotate-180' : ''}`}>
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A line marker in the investment's chart colour. */
function Dot({ color }: { color: string }) {
  return <span aria-hidden className="mr-2 inline-block h-3 w-3 rounded-full align-[0.05em]" style={{ background: color }} />;
}

/** The value the sentence solves for: set in ink where its input would be, underlined in teal. */
function Solved({ children }: { children: React.ReactNode }) {
  return (
    <span className="tabular font-bold text-ink underline decoration-accent decoration-2 underline-offset-[0.25em]">{children}</span>
  );
}

const round = (v: number, d: number) => +v.toFixed(d);

/** Round-number axis ticks from 0 to just above max (steps of 1, 2, 2.5 or 5 × a power of 10). */
function niceTicks(max: number, count = 5): number[] {
  if (!(max > 0)) return [0];
  const raw = max / count;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= raw) ?? 10 * p;
  return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => round(i * step, 6));
}

export default function CagrCalculator() {
  const region = useRegion();
  const inflation = useInflation();
  const setInflation = useSettings((s) => s.setInflation);
  const chart = useChartTheme();
  const tip = tooltipStyle(chart);
  const { inputs, update, reset } = useUrlState<Inputs>(DEFAULTS);
  const [saveDraft, setSaveDraft] = useState<Partial<FundDraft> | null>(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);

  const { mode } = inputs;
  const datesOn = inputs.useDates && mode !== 'years';
  const years = datesOn ? yearsBetween(inputs.from, inputs.to) : inputs.years;

  // Solve for whichever value the mode asks for, then derive a complete (start, end, rate, years).
  const solved = useMemo(() => {
    const { start, end, rate } = inputs;
    switch (mode) {
      case 'cagr': return { start, end, years, rate: cagr(start, end, years) };
      case 'end': return { start, rate, years, end: endValue(start, rate, years) };
      case 'start': return { end, rate, years, start: startValue(end, rate, years) };
      case 'years': return { start, end, rate, years: yearsToReach(start, end, rate) };
    }
  }, [inputs, mode, years]);
  const valid = [solved.start, solved.end, solved.rate, solved.years].every(Number.isFinite) && solved.years > 0 && solved.start > 0;

  // Changing what to solve for carries the current numbers over, so the sentence doesn't jump.
  const setMode = (next: Mode) => {
    if (next === mode) return;
    if (!valid) return update({ mode: next });
    update({
      mode: next,
      start: round(solved.start, 2),
      end: round(solved.end, 2),
      rate: round(solved.rate, 6),
      years: round(solved.years, 2),
      // Leaving "time needed" keeps the solved years rather than returning to old dates.
      ...(mode === 'years' ? { useDates: false } : {}),
    });
  };

  // Compared investments. Old Compare-view links bring their rows in as lines.
  const others = inputs.view === 'compare' && inputs.compare.length === 0 ? inputs.rows : inputs.compare;
  const setOthers = (compare: Row[]) => update({ compare, view: 'single' });
  const setOther = (id: string, patch: Partial<Row>) => setOthers(others.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const lines = useMemo(() => {
    const first = { id: 'main', name: inputs.name, start: solved.start, end: solved.end, years: solved.years, rate: valid ? solved.rate : NaN };
    return [first, ...others.map((r) => ({ ...r, rate: cagr(r.start, r.end, r.years) }))].map((l, i) => ({
      ...l,
      color: FUND_COLORS[i % FUND_COLORS.length],
      real: realRate(l.rate, inflation),
      total: l.end / l.start - 1,
    }));
  }, [inputs.name, solved, valid, others, inflation]);
  const comparing = lines.length > 1;
  const ranked = [...lines].sort((a, b) => (Number.isFinite(b.rate) ? b.rate : -Infinity) - (Number.isFinite(a.rate) ? a.rate : -Infinity));

  // The chart: the first investment's actual path, or, when comparing, every investment's steady
  // rate applied to the same starting amount. Each line ends at its own (fractional) year.
  const chartData = useMemo(() => {
    const rows = new Map<number, Record<string, number>>();
    const row = (t: number) => rows.get(t) ?? rows.set(t, { year: t }).get(t)!;
    lines.forEach((l) => {
      if (!Number.isFinite(l.rate) || !(l.years > 0)) return;
      const from = comparing ? NORMAL : l.start;
      for (let y = 0; y < l.years; y++) row(y)[l.id] = from * Math.pow(1 + l.rate, y);
      row(round(l.years, 4))[l.id] = from * Math.pow(1 + l.rate, l.years);
    });
    return [...rows.values()].sort((a, b) => a.year - b.year);
  }, [lines, comparing]);
  const lastYear = chartData.length ? chartData[chartData.length - 1].year : 1;
  const yTicks = niceTicks(Math.max(0, ...chartData.flatMap((r) => Object.entries(r).filter(([k]) => k !== 'year').map(([, v]) => v))));

  // Each line ends in an ink terminus cap, as on the Home map.
  const terminus = (id: string, end: number) => (props: { cx?: number; cy?: number; payload?: Record<string, number> }) => {
    const { cx, cy, payload } = props;
    const key = `t-${id}-${payload?.year}`;
    if (payload?.year !== round(end, 4) || cx === undefined || cy === undefined) return <g key={key} />;
    return <rect key={key} x={cx - 3} y={cy - 8} width={6} height={16} rx={3} fill={chart.text} />;
  };

  const openSave = (name: string, rate: number) => {
    setSavedMsg('');
    setSaveDraft({ name, annualReturn: +rate.toFixed(4), fee: 0, notes: `Expected return from a ${pct(rate)} historical CAGR.` });
  };

  const rateText = pct(solved.rate);
  const inflText = `${+(inflation * 100).toFixed(2)}%`;
  const yearsText = `${num(solved.years, Number.isInteger(round(solved.years, 2)) ? 0 : 1)} years`;
  const figure: Record<Mode, string> = {
    cagr: rateText,
    end: money(solved.end, region),
    start: money(solved.start, region),
    years: yearsText,
  };
  const lead: Record<Mode, string> = {
    cagr: `a year, compounded, takes ${money(solved.start, region)} to ${money(solved.end, region)} in ${yearsText}.`,
    end: `is what ${money(solved.start, region)} grows to in ${yearsText} at ${rateText} a year.`,
    start: `grows to ${money(solved.end, region)} in ${yearsText} at ${rateText} a year.`,
    years: `to grow ${money(solved.start, region)} to ${money(solved.end, region)} at ${rateText} a year.`,
  };
  const total = solved.end / solved.start - 1;

  // The first investment's sentence pieces: each is an input, or the solved value in its place.
  const startEl = mode === 'start'
    ? <Solved>{money(solved.start, region)}</Solved>
    : <InlineNumber label="Start value" prefix="$" decimals={2} value={inputs.start} min={0} onChange={(start) => update({ start })} />;
  const endEl = mode === 'end'
    ? <Solved>{money(solved.end, region)}</Solved>
    : <InlineNumber label="End value" prefix="$" decimals={2} value={inputs.end} min={0} onChange={(end) => update({ end })} />;
  const rateEl = mode === 'cagr'
    ? <Solved>{valid ? rateText : '—'}</Solved>
    : <InlineNumber label="Growth rate per year (%)" suffix="%" scale={100} decimals={2} value={inputs.rate} min={-0.99} max={10} onChange={(rate) => update({ rate })} />;
  const spanEl =
    mode === 'years' ? (
      <>over <Solved>{Number.isFinite(solved.years) ? num(solved.years, 1) : '—'}</Solved> years</>
    ) : (
      <>
        <InlineSelect label="Time span as" value={datesOn ? 'dates' : 'years'} options={SPANS} onChange={(v) => update({ useDates: v === 'dates' })} />{' '}
        {datesOn ? (
          <>
            <InlineDate label="Start date" value={inputs.from} onChange={(from) => update({ from })} /> and{' '}
            <InlineDate label="End date" value={inputs.to} onChange={(to) => update({ to })} />
          </>
        ) : (
          <>
            <InlineNumber label="Years" decimals={2} value={inputs.years} min={0.01} max={200} onChange={(y) => update({ years: y })} /> years
          </>
        )}
      </>
    );

  return (
    <>
      <h1 className="sr-only">CAGR Calculator</h1>

      {/* What happened to the money, as a sentence where any value can be the unknown */}
      <Card className="sm:p-6!">
        <p className={SENTENCE}>
          Solve for the <InlineSelect label="Solve for" value={mode} options={SOLVE} onChange={setMode} />.
        </p>
        <p className={`mt-1 ${SENTENCE}`}>
          <Dot color={lines[0].color} />
          <InlineText label="Investment name" value={inputs.name} maxLength={FUND_LIMITS.nameMax} onChange={(name) => update({ name })} /> grew
          from {startEl} to {endEl} {spanEl}, at {rateEl} a year.
        </p>
        {others.map((r, i) => (
          <p key={r.id} className={`mt-1 ${SENTENCE}`}>
            <Dot color={lines[i + 1].color} />
            <InlineText label={`Investment ${i + 2} name`} value={r.name} maxLength={FUND_LIMITS.nameMax} onChange={(name) => setOther(r.id, { name })} /> grew
            from{' '}
            <InlineNumber label={`${r.name} start value`} prefix="$" decimals={2} value={r.start} min={0} onChange={(start) => setOther(r.id, { start })} /> to{' '}
            <InlineNumber label={`${r.name} end value`} prefix="$" decimals={2} value={r.end} min={0} onChange={(end) => setOther(r.id, { end })} /> over{' '}
            <InlineNumber label={`${r.name} years`} decimals={2} value={r.years} min={0.01} max={200} onChange={(years) => setOther(r.id, { years })} /> years,
            at <Solved>{Number.isFinite(lines[i + 1].rate) ? pct(lines[i + 1].rate) : '—'}</Solved> a year.{' '}
            <button
              type="button"
              aria-label={`Remove ${r.name}`}
              title="Remove"
              onClick={() => setOthers(others.filter((x) => x.id !== r.id))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg align-middle text-muted transition hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
              </svg>
            </button>
          </p>
        ))}
        <button
          type="button"
          onClick={() => setOthers([...others, { id: newId(), name: `Investment ${lines.length + 1}`, start: 10_000, end: 20_000, years: 10 }])}
          className="-ml-2 mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-accent transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
          </svg>
          Compare with another investment
        </button>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-3 text-sm text-muted">
          {!moreOpen && (
            <p className="tabular max-w-none min-w-0 basis-full lg:basis-0 lg:flex-1">
              <span className="normal-nums">Also assumed: </span>
              <span className="whitespace-nowrap">inflation {inflText}</span>
              <span className="normal-nums"> for the after-inflation rate</span>
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
          <Button variant="ghost" className="-ml-3 sm:ml-auto" onClick={() => { reset(); setSavedMsg(''); }}>
            Reset
          </Button>
        </div>
        {moreOpen && (
          <div id={MORE_PANEL} className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <PercentField label="Inflation" min={0} max={0.2} decimals={2} value={inflation} onChange={(v) => setInflation(v)} hint="Shared with the other calculators" />
          </div>
        )}
      </Card>

      {/* The answer */}
      <p className="sr-only" aria-live="polite">
        {valid ? `${figure[mode]} ${lead[mode]}` : 'No valid answer for these values.'}
      </p>
      <div className="mt-6 mb-6">
        {valid ? (
          <>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
              <span className="tabular shrink-0 text-5xl leading-none font-bold tracking-[-0.03em] sm:text-6xl">{figure[mode]}</span>
              <p className="max-w-[30em] text-lg sm:text-xl">
                {lead[mode]}{' '}
                <span className="text-muted">
                  That's <strong className="tabular text-ink">{total >= 0 ? '+' : '−'}{pct(Math.abs(total), 0)}</strong> in total, or{' '}
                  <strong className="tabular text-ink">{pct(realRate(solved.rate, inflation))}</strong> a year after {inflText} inflation.
                </span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Button variant="primary" onClick={() => openSave(inputs.name || 'My investment', solved.rate)}>
                Save {rateText} as a fund
              </Button>
              <p className="text-sm text-muted" role="status">
                {savedMsg || 'Use it as the expected return in Growth & Fees, Rent vs. Buy and Retirement.'}
              </p>
            </div>
          </>
        ) : (
          <p className="max-w-[40em] text-lg text-muted">
            {datesOn && !(years > 0)
              ? 'The second date needs to come after the first.'
              : "Those values don't have an answer. Check that they're positive and, when solving for time, that the rate moves the start value toward the end value."}
          </p>
        )}
      </div>

      {chartData.length > 1 && (
        <div className={`grid grid-cols-1 gap-5 ${comparing ? 'xl:grid-cols-[3fr_2fr]' : ''}`}>
          <Card className="flex min-w-0 flex-col">
            <CardTitle>{comparing ? `Growth of ${money(NORMAL, region)} at each rate` : 'Growth path'}</CardTitle>
            <p className="-mt-1 mb-3 text-sm text-muted">
              {comparing
                ? "Each investment's steady yearly rate, applied to the same starting amount over its own time span."
                : `The smooth path at a steady ${rateText} a year. A real investment wobbles, but ends at the same place.`}
            </p>
            <div className="h-72 xl:h-auto xl:min-h-72 xl:flex-1">
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={chart.grid} vertical={false} />
                  <XAxis dataKey="year" type="number" domain={[0, lastYear]} allowDecimals={false} tickCount={Math.min(Math.ceil(lastYear) + 1, 11)} stroke={chart.axis} fontSize={12} tickLine={false} />
                  <YAxis stroke={chart.axis} ticks={yTicks} domain={[0, yTicks[yTicks.length - 1]]} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y: number) => `Year ${Number.isInteger(y) ? y : num(y, 2)}`} />
                  {lines.map((l) => (
                    <Line
                      key={l.id}
                      dataKey={l.id}
                      name={l.name}
                      stroke={l.color}
                      strokeWidth={4}
                      strokeLinejoin="round"
                      connectNulls
                      dot={terminus(l.id, l.years)}
                      activeDot={{ r: 5 }}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            {comparing && (
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {lines.map((l) => (
                  <li key={l.id} className="flex items-center gap-2">
                    <span aria-hidden className="h-1 w-5 shrink-0 rounded-full" style={{ background: l.color }} />
                    <span className="wrap-anywhere">{l.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {comparing && (
            <Card className="min-w-0 xl:self-start">
              <CardTitle>Ranked by growth rate</CardTitle>
              <ol className="@container flex flex-col">
                {ranked.map((l) => (
                  <li key={l.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-t border-line py-3 first:border-t-0 first:pt-0 @md:grid-cols-[auto_minmax(0,1fr)_auto_auto]">
                    <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: l.color }} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold wrap-anywhere">{l.name}</span>
                      <span className="tabular block text-xs text-muted">
                        {Number.isFinite(l.rate)
                          ? `${pct(l.real)} after inflation · ${l.total >= 0 ? '+' : '−'}${pct(Math.abs(l.total), 0)} in total`
                          : 'No valid rate for these values'}
                      </span>
                    </span>
                    <span className="tabular text-xl font-semibold">{Number.isFinite(l.rate) ? pct(l.rate) : '—'}</span>
                    <Button disabled={!Number.isFinite(l.rate)} onClick={() => openSave(l.name, l.rate)} title={`Save ${l.name} as a fund`} className="col-start-2 justify-self-start @md:col-start-auto">
                      Save as fund
                    </Button>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      )}

      <FundEditor
        open={saveDraft !== null}
        initial={saveDraft ?? undefined}
        onClose={() => setSaveDraft(null)}
        onSaved={(f) => setSavedMsg(`Saved "${f.name}" to My Funds. It's now in Growth & Fees, Rent vs. Buy and Retirement.`)}
      />
    </>
  );
}
