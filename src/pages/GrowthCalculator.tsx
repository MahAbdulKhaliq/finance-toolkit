import { Fragment, useMemo, useState } from 'react';
import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { simulateGrowth, splitGap, type Frequency, type Timing } from '../lib/finance/growth';
import { money, moneyShort, pct } from '../lib/format';
import { useRegion, useSettings } from '../state/settingsStore';
import { useShareFunds, useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { feeIsHigh, FUND_LIMITS, returnIsHigh, STARTER_FUNDS } from '../state/fundsStore';
import { FundSelect, ImportSharedFunds, useAvailableFunds } from '../components/funds/FundPicker';
import { DollarsToggle, useDeflator } from '../components/Toolbar';
import { InlineNumber, InlineSelect } from '../components/PlanSentence';
import { Button, Card, CardTitle, Details, PercentField, Table } from '../components/ui';

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

// Worded to read inside the plan sentence ("then $500 every month").
const FREQS: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'every week' },
  { value: 'biweekly', label: 'every 2 weeks' },
  { value: 'monthly', label: 'every month' },
  { value: 'quarterly', label: 'every quarter' },
  { value: 'annually', label: 'every year' },
];
const TIMINGS: { value: Timing; label: string }[] = [
  { value: 'start', label: 'start' },
  { value: 'end', label: 'end' },
];

const FUNDS_PANEL = 'growth-funds-panel';

/** One plain sentence on where the gap comes from, e.g. "All of it comes from the lower MER." */
function splitSentence(s: { fee: number; ret: number; feeShare: number; retShare: number }, feeName: string) {
  // Parts pulling in opposite directions: one difference outweighs the other.
  if (s.fee < 0 || s.ret < 0)
    return s.ret > 0
      ? `The higher return more than makes up for the higher ${feeName}.`
      : `The lower ${feeName} more than makes up for the lower return.`;
  if (s.feeShare >= 0.995) return `All of it comes from the ${feeName} difference.`;
  if (s.retShare >= 0.995) return 'All of it comes from the return difference.';
  return `${pct(s.feeShare, 0)} comes from the ${feeName} difference and ${pct(s.retShare, 0)} from the return difference.`;
}

export default function GrowthCalculator() {
  const region = useRegion();
  const real = useSettings((s) => s.realDollars);
  const deflate = useDeflator();
  const chart = useChartTheme();
  const [fundsOpen, setFundsOpen] = useState(false);

  const url = useUrlState<Inputs>(DEFAULTS);
  const { all, missing } = useAvailableFunds(url.sharedFunds);
  // Exactly two slots: the page compares one fund with another. Older links with more funds keep
  // the first two; a missing or duplicate slot falls back to the defaults, then any other fund.
  const selectedFunds = useMemo(() => {
    const picked: typeof all = [];
    for (const id of [...url.inputs.fundIds, ...DEFAULTS.fundIds, ...all.map((f) => f.id)]) {
      const f = all.find((x) => x.id === id);
      if (f && !picked.includes(f)) picked.push(f);
      if (picked.length === 2) break;
    }
    return picked;
  }, [url.inputs.fundIds, all]);
  // Choosing the fund already in the other slot swaps the two.
  const setSlot = (slot: number, id: string) => {
    const ids = selectedFunds.map((f) => f.id);
    const other = 1 - slot;
    if (ids[other] === id) ids[other] = ids[slot];
    ids[slot] = id;
    url.update({ fundIds: ids });
  };
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
  const hasGap = results.length > 1 && best && worst && best.r.finalBalance - worst.r.finalBalance >= 0.5;
  const gap = best && worst ? deflate(best.r.finalBalance - worst.r.finalBalance, years) : 0;
  const inToday = real ? ", in today's dollars" : '';

  // How much of the gap comes from fees vs. returns (deflated the same way as the gap).
  const split = useMemo(() => {
    if (!hasGap || !best || !worst) return null;
    const s = splitGap(inputs, worst, best);
    const k = s.gap ? gap / s.gap : 0;
    return { fee: s.feeEffect * k, ret: s.returnEffect * k, feeShare: s.feeEffect / s.gap, retShare: s.returnEffect / s.gap };
  }, [hasGap, best, worst, inputs, gap]);
  const [gapPinned, setGapPinned] = useState(false);
  const [gapHover, setGapHover] = useState(false);
  const gapOpen = Boolean(split) && (gapPinned || gapHover);

  const costs = results.map(({ fund, fee, r }) => ({
    fund,
    fee,
    fees: deflate(r.totalFeesPaid, years),
    lost: deflate(r.totalFeeCost - r.totalFeesPaid, years),
    total: deflate(r.totalFeeCost, years),
    final: deflate(r.finalBalance, years),
    share: r.totalFeeCost / (r.finalBalance + r.totalFeeCost),
  }));
  const maxCost = Math.max(1, ...costs.map((c) => c.total));

  const fmtAxis = (v: number) => moneyShort(v, region);
  const tip = tooltipStyle(chart);
  const lastIndex = lineData.length - 1;

  // Each fund line ends in an ink terminus cap, as on the Home map.
  const terminus = (props: { cx?: number; cy?: number; index?: number }) => {
    const { cx, cy, index } = props;
    if (index !== lastIndex || cx === undefined || cy === undefined) return <g key={`t-${index}`} />;
    return <rect key={`t-${index}`} x={cx - 4} y={cy - 11} width={8} height={22} rx={4} fill={chart.text} />;
  };

  // The gap, measured: a bracket set just right of the terminus caps, labelled with its value.
  // Hover, focus or click it to see how the gap splits between fees and returns.
  const gapBracket = (props: { x1?: number; y1?: number; x2?: number; y2?: number }) => {
    const { x1, y1, y2 } = props;
    if (x1 === undefined || y1 === undefined || y2 === undefined) return <g />;
    const x = x1 + 12;
    const top = Math.min(y1, y2);
    const mid = (y1 + y2) / 2;
    return (
      <g
        role="button"
        tabIndex={0}
        aria-label={`Gap of ${money(gap, region)}. Show how it splits between fees and returns.`}
        aria-expanded={gapOpen}
        aria-controls="gap-split"
        style={{ cursor: 'pointer', outline: 'none' }}
        onMouseEnter={() => setGapHover(true)}
        onMouseLeave={() => setGapHover(false)}
        onFocus={() => setGapHover(true)}
        onBlur={() => setGapHover(false)}
        onClick={() => setGapPinned((p) => !p)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setGapPinned((p) => !p);
          } else if (e.key === 'Escape') setGapPinned(false);
        }}
      >
        <rect
          x={x - 6}
          y={top - 8}
          width={76}
          height={Math.abs(y2 - y1) + 16}
          rx={6}
          fill={chart.series.gain}
          fillOpacity={gapOpen ? 0.12 : 0}
        />
        <path d={`M ${x} ${y1} h 6 V ${y2} h -6`} fill="none" stroke={chart.series.gain} strokeWidth={gapOpen ? 3 : 2} />
        <text x={x + 12} y={mid} dy="-0.2em" fill={chart.series.gain} fontSize={13} fontWeight={700}>
          {moneyShort(gap, region)}
        </text>
        <text x={x + 12} y={mid} dy="1.05em" fill={chart.series.gain} fontSize={11} fontWeight={600}>
          gap
        </text>
      </g>
    );
  };

  const fundChip = (f: (typeof selectedFunds)[number]) => {
    const o = inputs.overrides[f.id] ?? {};
    return (
      <button
        key={f.id}
        type="button"
        aria-expanded={fundsOpen}
        aria-controls={FUNDS_PANEL}
        onClick={() => setFundsOpen((open) => !open)}
        // On phones the details drop under the name; from sm up the chip is one line in the sentence.
        className="inline-flex max-w-full flex-wrap items-baseline gap-x-2 rounded-2xl border border-line bg-surface px-3 py-1.5 text-left leading-snug font-semibold text-ink transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:rounded-full sm:py-0 sm:leading-[inherit]"
      >
        <span className="wrap-anywhere">
          <span aria-hidden className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-[0.05em]" style={{ background: f.color }} />
          {f.name}
        </span>
        {/* Both numbers carry their names: the fee label (MER / expense ratio) and the return. */}
        <span className="basis-full pl-[1.125rem] text-base font-normal text-muted sm:basis-auto sm:pl-0 sm:text-lg">
          <span className="tabular">{pct(o.fee ?? f.fee)}</span> {region.feeLabelInline} ·{' '}
          <span className="tabular">{pct(o.annualReturn ?? f.annualReturn)}</span> return
          <svg aria-hidden viewBox="0 0 12 12" className={`ml-1.5 inline-block h-3 w-3 align-[0.05em] text-accent transition ${fundsOpen ? 'rotate-180' : ''}`}>
            <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    );
  };

  return (
    <>
      <h1 className="sr-only">Growth &amp; Fees</h1>
      <ImportSharedFunds missing={missing} />

      {/* The plan, as one sentence you edit in place */}
      <Card className="sm:p-6!">
        <p className="max-w-none text-lg leading-[2.1] font-medium text-muted sm:text-2xl sm:leading-[2]">
          Invest <InlineNumber label="Initial investment" prefix="$" value={inputs.initial} min={0} onChange={(initial) => update({ initial })} />,
          then <InlineNumber label="Contribution" prefix="$" value={inputs.contribution} min={0} onChange={(contribution) => update({ contribution })} />{' '}
          <InlineSelect label="Contribution frequency" value={inputs.frequency} options={FREQS} onChange={(frequency) => update({ frequency })} />{' '}
          at the <InlineSelect label="Contribution timing" value={inputs.timing} options={TIMINGS} onChange={(timing) => update({ timing })} /> of
          each period, raising it{' '}
          <InlineNumber label="Yearly raise (%)" suffix="%" scale={100} decimals={2} value={inputs.annualIncrease} min={0} max={0.5} onChange={(annualIncrease) => update({ annualIncrease })} />{' '}
          a year, for{' '}
          <InlineNumber label="Years" value={inputs.years} decimals={0} min={1} max={70} onChange={(y) => update({ years: Math.round(y) })} />{' '}
          years.
        </p>
        <p className="mt-1 max-w-none text-lg leading-[2.1] font-medium text-muted sm:text-2xl sm:leading-[2]">
          Compare{' '}
          {selectedFunds.map((f, i) => (
            <Fragment key={f.id}>
              {i > 0 && ' with '}
              {fundChip(f)}
            </Fragment>
          ))}
        </p>

        {fundsOpen && (
          <div id={FUNDS_PANEL} className="mt-4 border-t border-line pt-4">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {selectedFunds.map((f, slot) => {
                  const o = inputs.overrides[f.id] ?? {};
                  const set = (patch: { fee?: number; annualReturn?: number }) =>
                    update({ overrides: { ...inputs.overrides, [f.id]: { ...o, ...patch } } });
                  return (
                    <div key={slot} className="flex flex-col gap-2">
                      <FundSelect
                        label={slot === 0 ? 'Compare' : 'With'}
                        funds={all}
                        value={f.id}
                        onChange={(id) => setSlot(slot, id)}
                      />
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
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => setFundsOpen(false)}>Done</Button>
            </div>
          </div>
        )}
      </Card>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <p className="max-w-none min-w-0 flex-1">Fee and return changes apply to this comparison only. Your library isn't changed.</p>
        <Button variant="ghost" onClick={() => { reset(); setGapPinned(false); }}>Reset</Button>
      </div>

      {/* The answer */}
      <div aria-live="polite" className="mt-6 mb-6">
        {results.length === 0 ? (
          <p className="text-lg text-muted">Choose at least one fund to see what its fees cost.</p>
        ) : hasGap && best && worst ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <span className="tabular text-5xl leading-none font-bold tracking-[-0.03em] text-good sm:text-6xl">
              {money(gap, region)}
            </span>
            <p className="max-w-[26em] text-lg sm:text-xl">
              more with <strong>{best.fund.name}</strong> than with <strong>{worst.fund.name}</strong> after {years}{' '}
              years{inToday}.{split && <span className="text-muted"> {splitSentence(split, region.feeLabelInline)}</span>}
            </p>
          </div>
        ) : (
          best && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
              <span className="tabular text-5xl leading-none font-bold tracking-[-0.03em] sm:text-6xl">
                {money(deflate(best.r.finalBalance, years), region)}
              </span>
              <p className="max-w-[26em] text-lg sm:text-xl">
                is what <strong>{best.fund.name}</strong> grows to after {years} years{inToday}. Fees and the growth
                they'd have earned cost <strong className="text-bad">{money(deflate(best.r.totalFeeCost, years), region)}</strong>.
              </p>
            </div>
          )
        )}
      </div>

      {results.length > 0 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[3fr_2fr]">
            <Card className="min-w-0">
              <CardTitle action={<DollarsToggle />}>Portfolio value over time</CardTitle>
              <div className="relative flex flex-col-reverse sm:block">
                {split && best && worst && gapOpen && (
                  <div
                    id="gap-split"
                    className="mt-3 rounded-xl sm:pointer-events-none sm:absolute sm:top-1 sm:left-[72px] sm:z-10 sm:mt-0 sm:w-[min(21rem,calc(100%-96px))] border border-line bg-surface p-3 text-sm shadow-sm"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold">Gap after {years} years</span>
                      <span className="tabular font-bold text-good">{money(gap, region)}</span>
                    </div>
                    {split.fee >= 0 && split.ret >= 0 && (
                      <div aria-hidden className="mt-2 flex h-2.5 overflow-hidden rounded-full">
                        <div style={{ width: `${split.feeShare * 100}%`, background: chart.series.gain }} />
                        <div className="flex-1" style={{ background: chart.series.gain, opacity: 0.4 }} />
                      </div>
                    )}
                    <dl className="mt-2 flex flex-col gap-1.5">
                      {[
                        {
                          key: 'fee',
                          label: `${best.fee <= worst.fee ? 'Lower' : 'Higher'} ${region.feeLabelInline}`,
                          detail: `${pct(worst.fee)} → ${pct(best.fee)}`,
                          value: split.fee,
                          share: split.feeShare,
                          opacity: 1,
                        },
                        {
                          key: 'ret',
                          label: `${best.annualReturn >= worst.annualReturn ? 'Higher' : 'Lower'} return`,
                          detail: `${pct(worst.annualReturn)} → ${pct(best.annualReturn)}`,
                          value: split.ret,
                          share: split.retShare,
                          opacity: 0.4,
                        },
                      ].map((row) => (
                        <div key={row.key} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-2">
                          <span aria-hidden className="h-2.5 w-2.5 self-center rounded-sm" style={{ background: chart.series.gain, opacity: row.opacity }} />
                          <dt>{row.label}</dt>
                          <dd className={`tabular text-right font-semibold ${row.value < 0 ? 'text-bad' : ''}`}>
                            {row.value < 0 ? '−' : ''}{money(Math.abs(row.value), region)}
                            {split.fee >= 0 && split.ret >= 0 && <span className="font-normal text-muted"> · {pct(row.share, 0)}</span>}
                          </dd>
                          <dd className="tabular col-start-2 col-end-4 text-xs text-muted">{row.detail}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2 text-xs text-muted">
                      Fees and returns compound together, so the split averages both orders.{' '}
                      {gapPinned ? 'Click or tap the bracket to close.' : 'Click or tap the bracket to keep this open.'}
                    </p>
                  </div>
                )}
                <div className="h-80"><ResponsiveContainer>
                  <LineChart data={lineData} margin={{ top: 12, right: 84, left: 0, bottom: 18 }}>
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis dataKey="year" type="number" domain={[0, years]} allowDecimals={false} stroke={chart.axis} tickLine={false} fontSize={12} label={{ value: 'Year', position: 'insideBottomRight', offset: -14, fill: chart.axis, fontSize: 12 }} />
                    <YAxis stroke={chart.axis} tickFormatter={fmtAxis} tickLine={false} axisLine={false} fontSize={12} width={64} />
                    <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y) => `Year ${y}`} />
                    <Line dataKey="contributed" name="Contributed" stroke={chart.muted} strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    {results.map(({ fund }) => (
                      <Line key={fund.id} dataKey={fund.id} name={fund.name} stroke={fund.color} strokeWidth={4} strokeLinejoin="round" dot={terminus} activeDot={{ r: 5 }} isAnimationActive={false} />
                    ))}
                    {hasGap && best && worst && (
                      <ReferenceLine
                        segment={[
                          { x: years, y: deflate(worst.r.finalBalance, years) },
                          { x: years, y: deflate(best.r.finalBalance, years) },
                        ]}
                        ifOverflow="visible"
                        shape={gapBracket}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer></div>
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {results.map(({ fund }) => (
                  <li key={fund.id} className="flex items-center gap-2">
                    <span aria-hidden className="h-1 w-5 rounded-full" style={{ background: fund.color }} />
                    {fund.name}
                  </li>
                ))}
                <li className="flex items-center gap-2 text-muted">
                  <span aria-hidden className="w-5 border-t-2 border-dashed" style={{ borderColor: chart.muted }} />
                  Contributed
                </li>
              </ul>
            </Card>

            <Card className="min-w-0">
              <CardTitle>What fees cost you</CardTitle>
              <p className="-mt-1 text-sm text-muted">
                <strong className="text-ink">Fees paid</strong> is what the fund charged.{' '}
                <strong className="text-ink">Lost growth</strong> is what that money would have earned if it had stayed invested.
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                {costs.map((c) => (
                  <li key={c.fund.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 font-semibold">
                        <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.fund.color }} />
                        <span className="wrap-anywhere">{c.fund.name}</span>
                      </span>
                      <span className="tabular shrink-0 font-semibold text-bad">{money(c.total, region)}</span>
                    </div>
                    <div
                      aria-hidden
                      className="mt-1.5 flex h-5 overflow-hidden rounded"
                      style={{ width: `${Math.max(2, (c.total / maxCost) * 100)}%` }}
                    >
                      <div style={{ width: `${(c.fees / Math.max(1, c.total)) * 100}%`, background: chart.series.feePaid }} />
                      <div className="flex-1" style={{ background: chart.series.feeLost }} />
                    </div>
                    <p className="tabular mt-1.5 text-xs text-muted">
                      {money(c.fees, region)} fees paid · {money(c.lost, region)} lost growth
                    </p>
                    <p className="tabular text-xs text-muted">
                      {pct(c.share, 1)} <span className="normal-nums">of the no-fee balance</span> · ends at {money(c.final, region)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5"><span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: chart.series.feePaid }} />Fees paid</span>
                <span className="flex items-center gap-1.5"><span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: chart.series.feeLost }} />Lost growth</span>
              </div>
            </Card>
          </div>

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
        </div>
      )}
    </>
  );
}
