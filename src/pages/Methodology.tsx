import type { ReactNode } from 'react';
import { Card, PageHeader } from '../components/ui';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted [&_strong]:text-ink">{children}</div>
    </Card>
  );
}

function F({ children }: { children: ReactNode }) {
  return <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-ink">{children}</code>;
}

export default function Methodology() {
  return (
    <>
      <PageHeader
        title="Methodology"
        intro="How each calculator works, and the assumptions behind the numbers. The math is plain TypeScript, unit-tested against known reference values."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section title="Growth & Fees">
          <p>
            The portfolio is simulated in monthly steps, or weekly/bi-weekly when contributions are
            that frequent. Growth compounds to the stated annual return: <F>g = (1 + R)^(1/n) − 1</F>.
          </p>
          <p>
            The fee (MER / expense ratio) is charged pro rata on the balance each step,{' '}
            <F>fee = balance × MER / n</F>. That's close to how funds accrue fees daily inside the unit
            price.
          </p>
          <p>
            A shadow portfolio with a 0% fee runs alongside. <strong>Total cost of fees</strong> = shadow
            balance − actual balance. It counts the fees themselves plus the growth those dollars would
            have earned.
          </p>
          <p>
            <strong>Where the gap comes from.</strong> The gap between the best and worst fund is split
            into a fee part and a return part. The two interact (a fee costs more on a faster-growing
            balance), so the split averages both orders: changing the fee first and then the return, and
            the reverse. With <F>B(return, fee)</F> as the final balance, the fee part is{' '}
            <F>½[(B(r₂, f₂) − B(r₂, f₁)) + (B(r₁, f₂) − B(r₁, f₁))]</F>, and the return part is
            the rest of the gap. The parts always add up to the gap. One can be negative, for example when
            the better fund charges more but grows faster.
          </p>
        </Section>

        <Section title="CAGR">
          <p>
            <F>CAGR = (End / Start)^(1 / years) − 1</F>. The other modes rearrange the same formula,
            for example <F>years = ln(End / Start) / ln(1 + r)</F>. Date ranges use 365.25-day years.
          </p>
          <p>
            Real CAGR uses the Fisher equation: <F>(1 + r) / (1 + inflation) − 1</F>.
          </p>
          <p>
            <strong>Saving a CAGR as a fund:</strong> historical fund returns are usually already net of
            fees. If so, either leave the fee at 0% or add the fee back to the return, so it isn't
            counted twice.
          </p>
        </Section>

        <Section title="Rent vs. Buy">
          <p>
            Simulated month by month. Each month the buyer pays the mortgage, property tax, maintenance
            (both as a share of the current home value), insurance and condo/HOA fees. The renter pays
            rent and renter's insurance.
          </p>
          <p>
            <strong>Fair comparison:</strong> both households spend the same cash. The renter invests the
            down payment and closing costs on day one. After that, whichever side has lower housing
            costs that month invests the difference in the chosen fund, which grows at its return net
            of fees.
          </p>
          <p>
            Buyer's net worth = home value × (1 − selling costs) − mortgage balance + invested savings.
            The break-even year is the first year this is at least the renter's portfolio.
          </p>
          <p>
            Insurance and condo/HOA fees rise with inflation. Rent rises at its own rate. Taxes on
            investment gains, rental income and mortgage-interest deductions are not modeled.
          </p>
        </Section>

        <Section title="Retirement">
          <p>
            Each year you invest <F>income − expenses</F>. The portfolio earns its real return on the
            balance at the start of the year, and the year's savings are added at the end. You can
            retire once it reaches <F>goal = expenses / withdrawal rate</F> (e.g. 25× spending at 4%).
            The answer is interpolated within the year, so it can be fractional (e.g. 12.4 years).
          </p>
          <p>
            Everything is in today's dollars: each fund grows at its real return,{' '}
            <F>(1 + return − fee) / (1 + inflation) − 1</F>, and income and expenses are assumed to
            rise with inflation. Taxes on withdrawals and government benefits (CPP/OAS, Social
            Security) aren't included.
          </p>
        </Section>

        <Section title="Canada vs. US rules">
          <p>
            <strong>🇨🇦 Canada:</strong> fixed mortgage rates compound semi-annually,{' '}
            <F>i = (1 + r/2)^(1/6) − 1</F>. Below 20% down, a CMHC premium is added to the mortgage:
            4.00% (5–9.99% down), 3.10% (10–14.99%), 2.80% (15–19.99%), plus 0.20% for amortizations
            over 25 years (insured mortgages max out at 30). It's a one-time cost: it doesn't end once you
            reach 20% equity, and it's counted under "money you don't get back". The minimum down payment is
            5% of the first $500k and 10% of the rest. Homes at $1.5M or more need 20%. A principal
            residence is exempt from capital gains tax.
          </p>
          <p>
            <strong>🇺🇸 US:</strong> monthly compounding, <F>i = r / 12</F>. Below 20% down, PMI is
            charged as an annual percentage of the original loan and drops off automatically once the
            balance reaches 78% of the purchase price. The net worth chart marks that point. The
            home-sale capital gains exclusion is not modeled.
          </p>
          <p>
            The region toggle changes rules, labels and currency. It never converts your numbers.
          </p>
        </Section>

        <Section title="Today's dollars">
          <p>
            With <strong>Today's $</strong> on, an amount in year <em>t</em> is shown as{' '}
            <F>value / (1 + inflation)^t</F>, so results from different years can be compared fairly.
            The inflation rate defaults to 2% (CA) or 2.5% (US) and can be edited.
          </p>
        </Section>

        <Section title="Privacy & sharing">
          <p>
            There's no backend. Your fund library and settings are stored in your browser's
            localStorage. A share link encodes the scenario (and the funds it uses) in the URL itself,
            compressed with lz-string.
          </p>
          <p>
            Nothing here is financial advice. These are simplified models meant to help you build
            intuition and compare scenarios.
          </p>
        </Section>
      </div>
    </>
  );
}
