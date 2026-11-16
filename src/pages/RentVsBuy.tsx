import { useMemo } from 'react';
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { rentVsBuy, type RentVsBuyInput } from '../lib/finance/rentVsBuy';
import { canadaMinimumDown } from '../lib/finance/mortgage';
import { money, moneyShort, pct } from '../lib/format';
import { REGIONS, type RegionConfig } from '../lib/region';
import { useInflation, useRegion, useSettings } from '../state/settingsStore';
import { useShareFunds, useUrlState } from '../state/useUrlState';
import { tooltipStyle, useChartTheme } from '../state/useTheme';
import { STARTER_FUNDS } from '../state/fundsStore';
import { FundSelect, ImportSharedFunds, useAvailableFunds } from '../components/funds/FundPicker';
import { DollarsToggle, ShareButton, useDeflator } from '../components/Toolbar';
import {
  Button, Card, CardTitle, Details, MoneyField, Notice, NumberField, PageHeader, PercentField, Stat, Table,
} from '../components/ui';

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

export default function RentVsBuy() {
  const region = useRegion();
  const regionCode = useSettings((s) => s.region);
  const real = useSettings((s) => s.realDollars);
  const inflation = useInflation();
  const deflate = useDeflator();
  const chart = useChartTheme();
  const tip = tooltipStyle(chart);

  const url = useUrlState<Inputs>(defaultsFor(region));
  const { inputs, update } = url;
  const { all, missing } = useAvailableFunds(url.sharedFunds);
  const fund = all.find((f) => f.id === inputs.fundId) ?? all[0];
  useShareFunds(url.setShareFunds, fund ? [fund] : []);

  const netReturn = fund ? fund.annualReturn - fund.fee : 0.05;
  const engineInput = (patch: Partial<RentVsBuyInput> = {}): RentVsBuyInput => ({
    ...inputs,
    region: regionCode,
    downPayment: inputs.price * inputs.downPct,
    investReturn: netReturn,
    inflation,
    ...patch,
  });

  const result = useMemo(() => rentVsBuy(engineInput()), [inputs, regionCode, netReturn, inflation]); // eslint-disable-line react-hooks/exhaustive-deps
  const last = result.years[result.years.length - 1];
  const diff = deflate(last.buyerNetWorth - last.renterNetWorth, last.year);
  const buyWins = diff >= 0;

  const nwData = [
    { year: 0, buy: deflate(inputs.price * (1 - inputs.sellingCostRate) - result.loanAmount, 0), rent: inputs.price * inputs.downPct + result.closingCosts },
    ...result.years.map((y) => ({ year: y.year, buy: deflate(y.buyerNetWorth, y.year), rent: deflate(y.renterNetWorth, y.year) })),
  ];
  const be = result.breakEvenYear ? nwData[result.breakEvenYear] : null;

  const sum = (k: keyof (typeof result.years)[number]) =>
    result.years.reduce((s, y) => s + deflate(y[k] as number, y.year - 0.5), 0);
  const costBreakdown = [
    {
      name: 'Buy',
      Interest: sum('interest'),
      'Property tax': sum('propertyTax'),
      Maintenance: sum('maintenance'),
      'Home insurance & fees': sum('insurance') + sum('hoa'),
      // CMHC is a one-time premium financed into the loan; PMI is paid monthly until it drops off.
      'Mortgage insurance': result.cmhcPremium + sum('mortgageInsurance'),
      'Closing & selling': result.closingCosts + deflate(last.homeValue * inputs.sellingCostRate, last.year),
    },
    { name: 'Rent', Rent: sum('rent') },
  ];
  const s = chart.series;
  const COST_COLORS: Record<string, string> = {
    Interest: s.cost, 'Property tax': s.propertyTax, Maintenance: s.maintenance, 'Home insurance & fees': s.homeInsurance, 'Mortgage insurance': s.insurance, 'Closing & selling': s.closing, Rent: s.rent,
  };

  // Sensitivity: appreciation and investment return ±1%
  const deltas = [-0.01, 0, 0.01];
  const sensitivity = deltas.map((da) =>
    deltas.map((dr) => {
      const r = rentVsBuy(engineInput({ appreciation: inputs.appreciation + da, investReturn: netReturn + dr }));
      const l = r.years[r.years.length - 1];
      return deflate(l.buyerNetWorth - l.renterNetWorth, l.year);
    }),
  );

  const downAmt = inputs.price * inputs.downPct;
  // CA: insured only when a premium applies (homes $1.5M+ can't be insured). US: PMI below 20% down.
  const insured = regionCode === 'CA' ? result.cmhcPremium > 0 : inputs.downPct < 0.2;
  const pmiEndYear = result.pmiEndMonth ? result.pmiEndMonth / 12 : null;
  const minDown = regionCode === 'CA' ? canadaMinimumDown(inputs.price) : inputs.price * 0.03;
  const unrecoverable = (y: (typeof result.years)[number]) => y.interest + y.propertyTax + y.maintenance + y.insurance + y.hoa + y.mortgageInsurance;

  return (
    <>
      <PageHeader
        title="Rent vs. Buy"
        intro={`Compare buying a home with renting and investing the difference. Both sides spend the same cash: the renter invests the down payment and closing costs on day one, and whichever side has lower housing costs in a given month invests the savings in the fund you pick.`}
        actions={
          <>
            <Button variant="ghost" onClick={() => update(defaultsFor(REGIONS[regionCode]))}>Reset to {region.flag} defaults</Button>
            <ShareButton />
          </>
        }
      />
      <ImportSharedFunds missing={missing} />
      {result.warnings.map((w) => <Notice key={w}>{w}</Notice>)}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[24rem_1fr]">
        <div className="flex flex-col gap-5">
          <Card>
            <CardTitle>Buying</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <MoneyField label="Home price" value={inputs.price} onChange={(price) => update({ price })} />
              </div>
              <PercentField
                label="Down payment"
                value={inputs.downPct}
                min={0}
                max={1}
                onChange={(downPct) => update({ downPct })}
                hint={`${money(downAmt, region)} · min ${money(minDown, region)}`}
              />
              <PercentField label="Mortgage rate" value={inputs.mortgageRate} min={0} max={0.3} onChange={(mortgageRate) => update({ mortgageRate })} />
              <NumberField label="Amortization" suffix="yrs" decimals={0} value={inputs.amortizationYears} min={1} max={40} onChange={(v) => update({ amortizationYears: Math.round(v) })} />
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
                  hint={
                    !insured
                      ? 'Not required with 20%+ down'
                      : result.pmiEndMonth
                        ? `per year · stops in year ${Math.ceil(result.pmiEndMonth / 12)}`
                        : 'per year · until the loan is 78% of the price'
                  }
                />
              )}
              <PercentField label="Home appreciation" hint="per year" value={inputs.appreciation} min={-0.2} max={0.3} onChange={(appreciation) => update({ appreciation })} />
              <PercentField label="Property tax" hint="of value / yr" value={inputs.propertyTaxRate} min={0} max={0.1} onChange={(propertyTaxRate) => update({ propertyTaxRate })} />
              <PercentField label="Maintenance" hint="of value / yr" value={inputs.maintenanceRate} min={0} max={0.1} onChange={(maintenanceRate) => update({ maintenanceRate })} />
              <MoneyField label="Home insurance" hint="per year" value={inputs.homeInsurance} onChange={(homeInsurance) => update({ homeInsurance })} />
              <MoneyField label={regionCode === 'CA' ? 'Condo fees' : 'HOA fees'} hint="per month" value={inputs.hoaMonthly} onChange={(hoaMonthly) => update({ hoaMonthly })} />
              <PercentField label="Closing costs" hint={region.closingCostsHint} value={inputs.buyClosingRate} min={0} max={0.2} onChange={(buyClosingRate) => update({ buyClosingRate })} />
              <PercentField label="Selling costs" hint="Agent commissions + legal" value={inputs.sellingCostRate} min={0} max={0.2} onChange={(sellingCostRate) => update({ sellingCostRate })} />            </div>
          </Card>
          <Card>
            <CardTitle>Renting</CardTitle>
            <div className="grid grid-cols-2 gap-3">
              <MoneyField label="Monthly rent" value={inputs.rent} onChange={(rent) => update({ rent })} />
              <PercentField label="Rent increase" hint="per year" value={inputs.rentIncrease} min={-0.1} max={0.3} onChange={(rentIncrease) => update({ rentIncrease })} />
              <MoneyField label="Renter's insurance" hint="per year" value={inputs.rentersInsurance} onChange={(rentersInsurance) => update({ rentersInsurance })} />
            </div>
          </Card>
          <Card>
            <CardTitle>Investing &amp; horizon</CardTitle>
            <div className="flex flex-col gap-3">
              <FundSelect
                label="Invest savings in"
                funds={all}
                value={fund?.id ?? ''}
                onChange={(fundId) => update({ fundId })}
                hint={`Grows at ${pct(netReturn)} per year after ${region.feeLabel}. Taxes on investment gains are not modeled.`}
              />
              <NumberField label="How long you'll stay" suffix="yrs" decimals={0} value={inputs.years} min={1} max={40} onChange={(v) => update({ years: Math.round(v) })} />
            </div>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <Card className={buyWins ? 'border-accent/40! bg-accent-soft/40!' : 'border-rent/40! bg-rent/10!'}>
            <p className="text-lg">
              After {last.year} years, <strong>{buyWins ? 'buying' : 'renting and investing'}</strong> leaves you about{' '}
              <strong className="text-good">{money(Math.abs(diff), region)}</strong> wealthier{real && " in today's dollars"}.
            </p>
            <p className="mt-1 text-sm text-muted">
              {result.breakEvenYear
                ? `Buying breaks even in year ${result.breakEvenYear}, counting the costs of selling at that point.`
                : `Buying doesn't break even within ${last.year} years under these assumptions.`}
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <Stat label="Monthly mortgage" value={money(result.monthlyMortgage, region)} sub={region.mortgageCompounding} />
            <Stat label="Cash needed upfront" value={money(downAmt + result.closingCosts, region)} sub="Down payment + closing" />
            {regionCode === 'CA' ? (
              <Stat label={region.mortgageInsuranceLabel} value={money(result.cmhcPremium, region)} sub={result.cmhcPremium ? 'Added to the mortgage' : '20%+ down, none needed'} />
            ) : (
              <Stat label={region.mortgageInsuranceLabel} value={money(result.years[0].mortgageInsurance / 12, region)} sub={!insured ? '20%+ down, none needed' : pmiEndYear !== null ? `per month, until year ${Math.ceil(pmiEndYear)}` : 'per month, for the whole stay'} />
            )}
            <Stat label="Year-1 costs you don't get back" value={money(unrecoverable(result.years[0]) / 12, region)} sub={`/mo vs ${money(inputs.rent, region)} rent`} />
          </div>

          <Card>
            <CardTitle action={<DollarsToggle />}>Net worth: buy vs. rent</CardTitle>
            <p className="-mt-1 mb-3 text-sm text-muted">Buyer: home equity after selling costs plus any invested savings. Renter: investment portfolio.</p>
            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={nwData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={chart.grid} vertical={false} />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[0, last.year]}
                    allowDecimals={false}
                    tickCount={Math.min(last.year + 1, 11)}
                    stroke={chart.axis}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                  <Tooltip {...tip} formatter={(v: number) => money(v, region)} labelFormatter={(y) => `Year ${y}`} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Line dataKey="buy" name="Buy" stroke={s.primary} strokeWidth={2.5} dot={false} />
                  <Line dataKey="rent" name={`Rent + invest (${fund?.name ?? 'fund'})`} stroke={s.rent} strokeWidth={2.5} dot={false} />
                  {pmiEndYear !== null && (
                    <ReferenceLine
                      x={pmiEndYear}
                      stroke={s.insurance}
                      strokeDasharray="4 3"
                      label={{ value: 'PMI ends', position: 'insideTopLeft', fill: chart.text, fontSize: 12 }}
                    />
                  )}
                  {be && <ReferenceDot x={be.year} y={be.buy} r={6} fill={s.primary} stroke={chart.tooltipBg} strokeWidth={2} label={{ value: 'Break-even', position: 'top', fill: chart.text, fontSize: 12 }} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card>
              <CardTitle>Money you don't get back</CardTitle>
              <p className="-mt-1 mb-3 text-sm text-muted">Total over {last.year} years. Mortgage principal isn't included because it becomes equity.</p>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={costBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis dataKey="name" stroke={chart.axis} fontSize={12} tickLine={false} />
                    <YAxis stroke={chart.axis} tickFormatter={(v) => moneyShort(v, region)} fontSize={12} width={64} axisLine={false} tickLine={false} />
                    <Tooltip {...tip} formatter={(v: number) => money(v, region)} cursor={{ fill: chart.grid, opacity: 0.4 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {Object.keys(COST_COLORS).map((k) => (
                      <Bar key={k} dataKey={k} stackId="a" fill={COST_COLORS[k]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardTitle>What would change the answer?</CardTitle>
              <p className="-mt-1 mb-3 text-sm text-muted">Buy minus rent net worth after {last.year} years. Positive means buying wins.</p>
              <div className="overflow-x-auto">
                <table className="tabular w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-xs font-medium text-muted">Appreciation ↓ / Return →</th>
                      {deltas.map((d) => <th key={d} className="p-2 text-right font-semibold">{pct(netReturn + d, 1)}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivity.map((row, i) => (
                      <tr key={i}>
                        <th className="p-2 text-left font-semibold">{pct(inputs.appreciation + deltas[i], 1)}</th>
                        {row.map((v, j) => (
                          <td key={j} className={`p-2 text-right ${i === 1 && j === 1 ? 'font-bold ring-2 ring-accent ring-inset rounded' : ''} ${v >= 0 ? 'text-good' : 'text-bad'}`}>
                            {moneyShort(v, region)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <Details summary="Year-by-year breakdown">
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
      </div>
    </>
  );
}
