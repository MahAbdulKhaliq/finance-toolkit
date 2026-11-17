import { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
  BREAK_EVEN_HORIZON, breakEvenAppreciation, rentVsBuy, type RentVsBuyInput, type RentVsBuyYear,
} from '../lib/finance/rentVsBuy';
import { canadaMinimumDown } from '../lib/finance/mortgage';
import { money, moneyShort, pct } from '../lib/format';
import { REGIONS, type RegionConfig } from '../lib/region';
import { useInflation, useRegion, useSettings } from '../state/settingsStore';
import { useShareFunds, useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { STARTER_FUNDS } from '../state/fundsStore';
import { FundSelect, ImportSharedFunds, useAvailableFunds } from '../components/funds/FundPicker';
import { DollarsToggle, useDeflator } from '../components/Toolbar';
import { InlineNumber } from '../components/PlanSentence';
import { Button, Card, CardTitle, Details, MoneyField, Notice, PercentField, Stat, Table } from '../components/ui';

interface Inputs {
  years: number;
  price: number;
  downPct: number;
  mortgageRate: number;
  amortizationYears: number;
  propertyTaxRate: number;
  homeInsurance: number;
  maintenanceRate: number;
  hoaMonthly: number;
  buyClosingRate: number;
  sellingCostRate: number;
  appreciation: number;
  pmiRate: number;
  rent: number;
  rentIncrease: number;
  rentersInsurance: number;
  fundId: string;
}

function defaultsFor(r: RegionConfig): Inputs {
  const d = r.defaults;
  return {
    years: 10,
    price: d.price,
    downPct: d.downPct,
    mortgageRate: d.mortgageRate,
    amortizationYears: d.amortizationYears,
    propertyTaxRate: d.propertyTaxRate,
    homeInsurance: d.homeInsurance,
    maintenanceRate: 0.01,
    hoaMonthly: 0,
    buyClosingRate: d.buyClosingRate,
    sellingCostRate: d.sellingCostRate,
    appreciation: 0.03,
    pmiRate: 0.005,
    rent: d.rent,
    rentIncrease: 0.03,
    rentersInsurance: d.rentersInsurance,
    fundId: STARTER_FUNDS[2].id,
  };
}

const FUND_PANEL = 'rvb-fund-panel';
const MORE_PANEL = 'rvb-more-panel';
const DELTAS = [-0.01, 0, 0.01];

/** The sentence's type: 1.125rem on phones, 1.5rem from 640px up, tall leading so inline inputs fit. */
const SENTENCE = 'max-w-none text-lg leading-[1.9] font-medium text-muted sm:text-2xl sm:leading-[2]';

/** A path marker at the start of each sentence line, in that path's chart colour. */
function PathDot({ color }: { color: string }) {
  return <span aria-hidden className="mr-2 inline-block h-3 w-3 rounded-full align-[0.05em]" style={{ background: color }} />;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={`inline-block h-3 w-3 text-accent transition ${open ? 'rotate-180' : ''}`}>
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function RentVsBuy() {
  const region = useRegion();
  const regionCode = useSettings((s) => s.region);
  const real = useSettings((s) => s.realDollars);
  const inflation = useInflation();
  const deflate = useDeflator();
  const chart = useChartTheme();
  const tip = tooltipStyle(chart);
  const s = chart.series;
  const [fundOpen, setFundOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const url = useUrlState<Inputs>(defaultsFor(region));
  const { inputs, update } = url;
  const { all, missing } = useAvailableFunds(url.sharedFunds);
  const fund = all.find((f) => f.id === inputs.fundId) ?? all[0];
  useShareFunds(url.setShareFunds, fund ? [fund] : []);

  const stay = Math.max(1, Math.round(inputs.years));
  const netReturn = fund ? fund.annualReturn - fund.fee : 0.05;
  const engineInput = (patch: Partial<RentVsBuyInput> = {}): RentVsBuyInput => ({
    ...inputs,
    years: stay,
    region: regionCode,
    downPayment: inputs.price * inputs.downPct,
    investReturn: netReturn,
    inflation,
    ...patch,
  });

  // The stay drives the stats and costs; a 40-year run finds the break-even year even when it
  // falls after the move. The simulation is causal, so its first `stay` years match.
  const result = useMemo(() => rentVsBuy(engineInput()), [inputs, regionCode, netReturn, inflation]); // eslint-disable-line react-hooks/exhaustive-deps
  const long = useMemo(() => rentVsBuy(engineInput({ years: BREAK_EVEN_HORIZON })), [inputs, regionCode, netReturn, inflation]); // eslint-disable-line react-hooks/exhaustive-deps
  const breakEven = long.breakEvenYear;
  const last = result.years[stay - 1];
  const diff = deflate(last.buyerNetWorth - last.renterNetWorth, stay);
  const buyAhead = diff >= 0;
  // The yearly home-price growth at which the answer flips at the move-out year.
  const flipAt = useMemo(() => breakEvenAppreciation(engineInput(), stay), [inputs, regionCode, netReturn, inflation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show the chart to the move-out year, or on to break-even when that comes later.
  const horizon = breakEven && breakEven > stay ? Math.min(BREAK_EVEN_HORIZON, breakEven + 2) : stay;
  const nwData = useMemo(
    () => [
      { year: 0, buy: inputs.price * (1 - inputs.sellingCostRate) - long.loanAmount, rent: inputs.price * inputs.downPct + long.closingCosts },
      ...long.years.slice(0, horizon).map((y) => ({ year: y.year, buy: deflate(y.buyerNetWorth, y.year), rent: deflate(y.renterNetWorth, y.year) })),
    ],
    [long, horizon, deflate, inputs.price, inputs.sellingCostRate, inputs.downPct],
  );
  const be = breakEven && breakEven <= horizon ? nwData[breakEven] : null;

  const sum = (k: keyof RentVsBuyYear) => result.years.reduce((t, y) => t + deflate(y[k] as number, y.year - 0.5), 0);
  const buyCosts = [
    { key: 'Interest', value: sum('interest'), color: s.cost },
    { key: 'Property tax', value: sum('propertyTax'), color: s.propertyTax },
    { key: 'Maintenance', value: sum('maintenance'), color: s.maintenance },
    { key: 'Home insurance & fees', value: sum('insurance') + sum('hoa'), color: s.homeInsurance },
    // CMHC is a one-time premium financed into the loan; PMI is paid monthly until it drops off.
    { key: 'Mortgage insurance', value: result.cmhcPremium + sum('mortgageInsurance'), color: s.insurance },
    { key: 'Closing & selling', value: result.closingCosts + deflate(last.homeValue * inputs.sellingCostRate, stay), color: s.closing },
  ].filter((c) => c.value > 0.5);
  const rentTotal = sum('rent');
  const buyTotal = buyCosts.reduce((t, c) => t + c.value, 0);
  const costRows = [
    { name: 'Buy', ...Object.fromEntries(buyCosts.map((c) => [c.key, c.value])) },
    { name: 'Rent', Rent: rentTotal },
  ];

  // What would change the answer: home appreciation and fund return, each ±1%.
  const sensitivity = useMemo(
    () =>
      DELTAS.map((da) =>
        DELTAS.map((dr) => {
          const r = rentVsBuy(engineInput({ years: BREAK_EVEN_HORIZON, appreciation: inputs.appreciation + da, investReturn: netReturn + dr }));
          const y = r.years[stay - 1];
          return { breakEven: r.breakEvenYear, gap: deflate(y.buyerNetWorth - y.renterNetWorth, stay) };
        }),
      ),
    [inputs, regionCode, netReturn, inflation, stay, deflate], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const downAmt = inputs.price * inputs.downPct;
  // CA: insured only when a premium applies (homes $1.5M+ can't be insured). US: PMI below 20% down.
  const insured = regionCode === 'CA' ? result.cmhcPremium > 0 : inputs.downPct < 0.2;
  const pmiEndYear = long.pmiEndMonth ? long.pmiEndMonth / 12 : null;
  const minDown = regionCode === 'CA' ? canadaMinimumDown(inputs.price) : inputs.price * 0.03;
  const unrecoverable = (y: RentVsBuyYear) => y.interest + y.propertyTax + y.maintenance + y.insurance + y.hoa + y.mortgageInsurance;
  const hoaLabel = regionCode === 'CA' ? 'Condo fees' : 'HOA fees';
  const inToday = real ? " in today's dollars" : '';
  const winner = buyAhead ? 'buying' : 'renting and investing';

  // The assumptions that don't fit the sentence, summarised on one line.
  const moreSummary = [
    `property tax ${pct(inputs.propertyTaxRate)}`,
    `maintenance ${pct(inputs.maintenanceRate)}`,
    `home insurance ${money(inputs.homeInsurance, region)}/yr`,
    inputs.hoaMonthly > 0 ? `${hoaLabel.toLowerCase()} ${money(inputs.hoaMonthly, region)}/mo` : null,
    `closing ${pct(inputs.buyClosingRate)}`,
    `selling ${pct(inputs.sellingCostRate)}`,
    `renter's insurance ${money(inputs.rentersInsurance, region)}/yr`,
  ].filter((x): x is string => Boolean(x));
  // The disabled CMHC field (CA) and PMI field without PMI (US) are shown but not editable.
  const editableMore = 7 + (regionCode === 'US' && insured ? 1 : 0);

  /** The sentence on what would flip the answer at the move-out year. */
  const flipSentence = () => {
    if (flipAt === null)
      return buyAhead
        ? ` Even falling home prices wouldn't change that.`
        : ` Even 20% a year in home prices wouldn't make buying break even by year ${stay}.`;
    return buyAhead
      ? ` If homes rose less than ${pct(flipAt)} a year, renting would come out ahead.`
      : ` Buying would break even by year ${stay} if homes rose ${pct(flipAt)} a year instead of ${pct(inputs.appreciation)}.`;
  };

  // Each path's line ends at the move-out year in an ink terminus cap, as on the Home map.
  const terminus = (props: { cx?: number; cy?: number; index?: number }) => {
    const { cx, cy, index } = props;
    if (index !== stay || cx === undefined || cy === undefined) return <g key={`t-${index}`} />;
    return <rect key={`t-${index}`} x={cx - 3} y={cy - 8} width={6} height={16} rx={3} fill={chart.text} />;
  };

  return (
    <>
      <h1 className="sr-only">Rent vs. Buy</h1>
      <ImportSharedFunds missing={missing} />

      {/* The two paths, as sentences you edit in place */}
      <Card className="sm:p-6!">
        <p className={SENTENCE}>
          <PathDot color={s.primary} />
          Buy a <InlineNumber label="Home price" prefix="$" decimals={0} value={inputs.price} min={0} onChange={(price) => update({ price })} /> home
          with{' '}
          <InlineNumber label="Down payment (%)" suffix="%" scale={100} decimals={2} value={inputs.downPct} min={0} max={1} onChange={(downPct) => update({ downPct })} />{' '}
          down at{' '}
          <InlineNumber label="Mortgage rate (%)" suffix="%" scale={100} decimals={2} value={inputs.mortgageRate} min={0} max={0.3} onChange={(mortgageRate) => update({ mortgageRate })} />{' '}
          over{' '}
          <InlineNumber label="Amortization (years)" decimals={0} value={inputs.amortizationYears} min={1} max={40} onChange={(v) => update({ amortizationYears: Math.round(v) })} />{' '}
          years, and expect it to rise{' '}
          <InlineNumber label="Home appreciation per year (%)" suffix="%" scale={100} decimals={2} value={inputs.appreciation} min={-0.2} max={0.3} onChange={(appreciation) => update({ appreciation })} />{' '}
          a year.
        </p>
        <p className={`mt-1 ${SENTENCE}`}>
          <PathDot color={s.rent} />
          Or rent for <InlineNumber label="Monthly rent" prefix="$" decimals={0} value={inputs.rent} min={0} onChange={(rent) => update({ rent })} /> a
          month, rising{' '}
          <InlineNumber label="Rent increase per year (%)" suffix="%" scale={100} decimals={2} value={inputs.rentIncrease} min={-0.1} max={0.3} onChange={(rentIncrease) => update({ rentIncrease })} />{' '}
          a year, and invest the difference in{' '}
          {fund && (
            <button
              type="button"
              aria-expanded={fundOpen}
              aria-controls={FUND_PANEL}
              onClick={() => setFundOpen((o) => !o)}
              className="inline-flex max-w-full flex-wrap items-baseline gap-x-2 rounded-2xl border border-line bg-surface px-3 py-1.5 text-left leading-snug font-semibold text-ink transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:rounded-full sm:py-0 sm:leading-[inherit]"
            >
              <span className="wrap-anywhere">
                <span aria-hidden className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-[0.05em]" style={{ background: fund.color }} />
                {fund.name}
              </span>
              <span className="basis-full pl-[1.125rem] text-base font-normal text-muted sm:basis-auto sm:pl-0 sm:text-lg">
                <span className="tabular">{pct(netReturn)}</span> after {region.feeLabelInline} <Chevron open={fundOpen} />
              </span>
            </button>
          )}
        </p>
        <p className={`mt-1 ${SENTENCE}`}>
          I'd stay <InlineNumber label="Years you'll stay" decimals={0} value={inputs.years} min={1} max={BREAK_EVEN_HORIZON} onChange={(v) => update({ years: Math.round(v) })} />{' '}
          years.
        </p>

        {fundOpen && (
          <div id={FUND_PANEL} className="mt-4 border-t border-line pt-4">
            <div className="max-w-md">
              <FundSelect
                label="Invest the savings in"
                funds={all}
                value={fund?.id ?? ''}
                onChange={(fundId) => update({ fundId })}
                hint="Taxes on investment gains are not modeled."
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => setFundOpen(false)}>Done</Button>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-line pt-3 text-sm text-muted">
          {!moreOpen && (
            <p className="tabular max-w-none min-w-0 basis-full lg:basis-0 lg:flex-1">
            <span className="normal-nums">Also assumed: </span>
            {moreSummary.map((item, i) => (
              <span key={item}>
                {i > 0 && ' · '}
                <span className="whitespace-nowrap">{item}</span>
              </span>
            ))}
          </p>
          )}
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls={MORE_PANEL}
            onClick={() => setMoreOpen((o) => !o)}
            className="-ml-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-accent lg:ml-0 transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {moreOpen ? 'Hide' : 'Edit'} {editableMore} more assumptions <Chevron open={moreOpen} />
          </button>
          <Button variant="ghost" className="-ml-3 sm:ml-auto" onClick={() => update(defaultsFor(REGIONS[regionCode]))}>
            Reset to {regionCode === 'CA' ? 'Canadian' : 'US'} defaults
          </Button>
        </div>

        {moreOpen && (
          <div id={MORE_PANEL} className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <PercentField label="Property tax" hint="of value / yr" value={inputs.propertyTaxRate} min={0} max={0.1} onChange={(propertyTaxRate) => update({ propertyTaxRate })} />
            <PercentField label="Maintenance" hint="of value / yr" value={inputs.maintenanceRate} min={0} max={0.1} onChange={(maintenanceRate) => update({ maintenanceRate })} />
            <MoneyField label="Home insurance" hint="per year" value={inputs.homeInsurance} onChange={(homeInsurance) => update({ homeInsurance })} />
            <MoneyField label={hoaLabel} hint="per month" value={inputs.hoaMonthly} onChange={(hoaMonthly) => update({ hoaMonthly })} />
            <PercentField label="Closing costs" hint={region.closingCostsHint} value={inputs.buyClosingRate} min={0} max={0.2} onChange={(buyClosingRate) => update({ buyClosingRate })} />
            <PercentField label="Selling costs" hint="Agent commissions + legal" value={inputs.sellingCostRate} min={0} max={0.2} onChange={(sellingCostRate) => update({ sellingCostRate })} />
            {regionCode === 'CA' ? (
              <PercentField
                label="CMHC premium"
                disabled
                value={result.cmhcPremiumRate}
                onChange={() => {}}
                hint={
                  insured
                    ? `${money(result.cmhcPremium, region)} added to the mortgage${inputs.amortizationYears > 25 ? ' (incl. 0.20% for 25+ yrs)' : ''}. ON, QC & SK add sales tax at closing.`
                    : inputs.downPct < 0.2
                      ? 'Not available on homes $1.5M+; 20% down needed'
                      : 'Not required with 20%+ down'
                }
              />
            ) : (
              <PercentField
                label="PMI rate"
                disabled={!insured}
                value={insured ? inputs.pmiRate : 0}
                min={0}
                max={0.03}
                onChange={(pmiRate) => update({ pmiRate })}
                hint={!insured ? 'Not required with 20%+ down' : 'per year · until the loan is 78% of the price'}
              />
            )}
            <MoneyField label="Renter's insurance" hint="per year" value={inputs.rentersInsurance} onChange={(rentersInsurance) => update({ rentersInsurance })} />
          </div>
        )}
      </Card>
      {result.warnings.length > 0 && (
        <div className="mt-4">
          {result.warnings.map((w) => <Notice key={w}>{w}</Notice>)}
        </div>
      )}

      {/* The answer: when buying catches up, against how long you'll stay */}
      <div aria-live="polite" className="mt-6 mb-6 flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
        <span className="tabular shrink-0 text-5xl leading-none font-bold tracking-[-0.03em] sm:text-6xl">
          {breakEven ? `Year ${breakEven}` : `${BREAK_EVEN_HORIZON}+ years`}
        </span>
        <p className="max-w-[30em] text-lg sm:text-xl">
          {breakEven === null
            ? `before buying catches up with renting and investing, if it ever does. `
            : breakEven <= stay
              ? 'is when buying breaks even. '
              : `is when buying would break even, but you'd move out in year ${stay}. `}
          Staying {stay} years, <strong>{winner}</strong> leaves you{' '}
          <strong className="tabular text-good">{money(Math.abs(diff), region)}</strong> ahead{inToday}.
          <span className="text-muted">{flipSentence()}</span>
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[3fr_2fr]">
          <Card className="flex min-w-0 flex-col">
            <CardTitle action={<DollarsToggle />}>Net worth: buy vs. rent</CardTitle>
            <p className="-mt-1 mb-3 text-sm text-muted">
              Both sides spend the same cash: the renter invests what the buyer puts down, and whoever pays less each month invests the difference.
            </p>
            <div className="h-80 xl:h-auto xl:min-h-80 xl:flex-1">
              <ResponsiveContainer>
                <LineChart data={nwData} margin={{ top: 22, right: 16, left: 0, bottom: 18 }}>
                  <CartesianGrid stroke={chart.grid} vertical={false} />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[0, horizon]}
                    allowDecimals={false}
                    tickCount={Math.min(horizon + 1, 11)}
                    stroke={chart.axis}
                    fontSize={12}
                    tickLine={false}
                    label={{ value: 'Year', position: 'insideBottomRight', offset: -14, fill: chart.axis, fontSize: 12 }}
                  />
                  <YAxis stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y) => `Year ${y}`} />
                  {horizon > stay && (
                    <ReferenceLine
                      x={stay}
                      stroke={chart.text}
                      strokeDasharray="5 4"
                      label={{ value: 'You move out', position: 'top', fill: chart.text, fontSize: 12, fontWeight: 600 }}
                    />
                  )}
                  {pmiEndYear !== null && pmiEndYear <= horizon && (
                    <ReferenceLine
                      x={pmiEndYear}
                      stroke={s.insurance}
                      strokeDasharray="4 3"
                      label={{ value: 'PMI ends', position: 'insideTopLeft', fill: chart.text, fontSize: 12 }}
                    />
                  )}
                  <Line dataKey="rent" name={`Rent + invest (${fund?.name ?? 'fund'})`} stroke={s.rent} strokeWidth={4} strokeLinejoin="round" dot={terminus} activeDot={{ r: 5 }} isAnimationActive={false} />
                  <Line dataKey="buy" name="Buy" stroke={s.primary} strokeWidth={4} strokeLinejoin="round" dot={terminus} activeDot={{ r: 5 }} isAnimationActive={false} />
                  {/* No crossing on the chart: say who is ahead where the lines end, above the upper cap. */}
                  {!be && (
                    <ReferenceDot
                      x={stay}
                      y={Math.max(nwData[stay].buy, nwData[stay].rent)}
                      r={0}
                      label={({ viewBox }: { viewBox?: { x?: number; y?: number } }) => (
                        <text
                          x={(viewBox?.x ?? 0) - 10}
                          y={(viewBox?.y ?? 0) - 14}
                          textAnchor="end"
                          fill={chart.text}
                          stroke={chart.tooltipBg}
                          strokeWidth={4}
                          paintOrder="stroke"
                          fontSize={12}
                          fontWeight={600}
                        >
                          {buyAhead ? 'Buying' : 'Renting'} ahead {moneyShort(Math.abs(diff), region)} · year {stay}
                        </text>
                      )}
                    />
                  )}
                  {be && (
                    <ReferenceDot
                      x={be.year}
                      y={be.buy}
                      r={7}
                      fill={s.primary}
                      stroke={chart.tooltipBg}
                      strokeWidth={3}
                      // Set below-right of the dot, where the lines (rising to the right) leave clear space,
                      // with a halo in the card colour so it stays readable over the grid.
                      label={({ viewBox }: { viewBox?: { x?: number; y?: number } }) => (
                        <text
                          x={(viewBox?.x ?? 0) + 10}
                          y={(viewBox?.y ?? 0) + 24}
                          fill={chart.text}
                          stroke={chart.tooltipBg}
                          strokeWidth={4}
                          paintOrder="stroke"
                          fontSize={12}
                          fontWeight={600}
                        >
                          Break-even · year {be.year}
                        </text>
                      )}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-5 rounded-full" style={{ background: s.primary }} />
                Buy
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-1 w-5 rounded-full" style={{ background: s.rent }} />
                <span className="wrap-anywhere">Rent + invest ({fund?.name ?? 'fund'})</span>
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted">
              Buyer: home equity after selling costs, plus any invested savings. Renter: the invested portfolio.
            </p>
          </Card>

          <Card className="min-w-0">
            <CardTitle>Cost of buying</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Monthly mortgage" value={money(result.monthlyMortgage, region)} sub={region.mortgageCompounding} />
              <Stat label="Cash needed upfront" value={money(downAmt + result.closingCosts, region)} sub={`${money(downAmt, region)} down (min ${money(minDown, region)}) + closing`} />
              {regionCode === 'CA' ? (
                <Stat label={region.mortgageInsuranceLabel} value={money(result.cmhcPremium, region)} sub={result.cmhcPremium ? 'Added to the mortgage' : '20%+ down, none needed'} />
              ) : (
                <Stat
                  label={region.mortgageInsuranceLabel}
                  value={money(result.years[0].mortgageInsurance / 12, region)}
                  sub={!insured ? '20%+ down, none needed' : pmiEndYear !== null ? `per month, until year ${Math.ceil(pmiEndYear)}` : 'per month, for 40+ years'}
                />
              )}
              <Stat label="Year-1 costs you don't get back" value={money(unrecoverable(result.years[0]) / 12, region)} sub={`/mo vs ${money(inputs.rent, region)} rent`} />
            </div>

            <h3 className="mt-5 text-base font-semibold">What would change the answer?</h3>
            <p className="mt-1 text-sm text-muted">
              Break-even year, and how far buying is ahead after {stay} years, if homes rise (rows) or the fund returns (columns) 1% more or less.
            </p>
            <div className="mt-2 overflow-x-auto">
              <table className="tabular w-full text-sm">
                <thead>
                  <tr>
                    <td />
                    <th scope="colgroup" colSpan={3} className="px-2 pt-1 text-right text-xs font-medium text-muted normal-nums">
                      Fund return, after {region.feeLabelInline}
                    </th>
                  </tr>
                  <tr>
                    <th scope="col" className="p-2 text-left text-xs font-medium text-muted normal-nums">Home prices rise</th>
                    {DELTAS.map((d) => (
                      <th key={d} scope="col" className="p-2 text-right font-semibold">{pct(netReturn + d, 1)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensitivity.map((row, i) => (
                    <tr key={i}>
                      <th scope="row" className="p-2 text-left font-semibold">{pct(inputs.appreciation + DELTAS[i], 1)}</th>
                      {row.map((cell, j) => (
                        <td key={j} className="p-0.5 text-right whitespace-nowrap sm:p-1">
                          <div className={`rounded-lg px-1.5 py-1 sm:px-2 ${i === 1 && j === 1 ? 'ring-2 ring-accent ring-inset' : ''}`}>
                            <div className="font-semibold">{cell.breakEven ? `Year ${cell.breakEven}` : `${BREAK_EVEN_HORIZON}+ yrs`}</div>
                            <div className={`text-xs ${cell.gap >= 0 ? 'text-good' : 'text-bad'}`}>
                              {cell.gap >= 0 ? '+' : '−'}{moneyShort(Math.abs(cell.gap), region)}
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card className="min-w-0">
          <CardTitle>Money you don't get back</CardTitle>
          <p className="-mt-1 text-sm text-muted">
            Totals over {stay} years{inToday}: buying <strong className="tabular text-ink">{money(buyTotal, region)}</strong>, renting{' '}
            <strong className="tabular text-ink">{money(rentTotal, region)}</strong>. Mortgage principal isn't included because it becomes equity.
          </p>
          <div className="mt-3 h-40">
            <ResponsiveContainer>
              <BarChart data={costRows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }} barCategoryGap="22%">
                <CartesianGrid stroke={chart.grid} horizontal={false} />
                <XAxis type="number" stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke={chart.axis} fontSize={12} width={44} axisLine={false} tickLine={false} />
                <Tooltip {...tip} formatter={(v: number) => money(v, region)} cursor={{ fill: chart.grid, opacity: 0.4 }} />
                {buyCosts.map((c) => (
                  <Bar key={c.key} dataKey={c.key} stackId="a" fill={c.color} isAnimationActive={false} />
                ))}
                <Bar dataKey="Rent" stackId="a" fill={s.rent} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
            {[...buyCosts, { key: 'Rent', value: rentTotal, color: s.rent }].map((c) => (
              <li key={c.key} className="flex items-center gap-2">
                <span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                {c.key} <span className="tabular text-muted">{moneyShort(c.value, region)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Details summary="Year-by-year table">
          <Table
            headers={['Year', 'Home value', 'Mortgage left', 'Buy: housing cost', 'Rent: housing cost', 'Buy net worth', 'Rent net worth']}
            rows={result.years.map((y) => [
              y.year,
              money(deflate(y.homeValue, y.year), region),
              money(deflate(y.mortgageBalance, y.year), region),
              money(deflate(y.buyerSpend, y.year), region),
              money(deflate(y.renterSpend, y.year), region),
              money(deflate(y.buyerNetWorth, y.year), region),
              money(deflate(y.renterNetWorth, y.year), region),
            ])}
          />
        </Details>
      </div>
    </>
  );
}
