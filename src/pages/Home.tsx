import { Link } from 'react-router-dom';
import { useFunds } from '../state/fundsStore';
import { useRegion } from '../state/settingsStore';

export default function Home() {
  const region = useRegion();
  const fundCount = useFunds((s) => s.funds.length);

  const tools = [
    {
      to: '/growth',
      title: 'Growth & Fees',
      body: `Compare funds side by side and see what a 2% vs 0.2% ${region.feeLabelInline} adds up to after decades of compounding.`,
      icon: (
        <path d="M4 20l5-6 4 3 7-9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ),
    },
    {
      to: '/cagr',
      title: 'CAGR',
      body: 'Find the true annual growth rate of any investment, compare several, and save one as a fund assumption.',
      icon: <path d="M4 18h4v-5H4zm6 0h4V9h-4zm6 0h4V5h-4z" fill="currentColor" />,
    },
    {
      to: '/rent-vs-buy',
      title: 'Rent vs. Buy',
      body: `Model mortgage, ${region.code === 'CA' ? 'CMHC' : 'PMI'}, taxes and upkeep against renting and investing the difference in one of your funds.`,
      icon: (
        <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <section className="max-w-3xl pt-4">
        <p className="text-sm font-semibold text-accent">{region.flag} {region.label} · {region.currency}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          Small numbers, big decisions.
        </h1>
        <p className="mt-4 text-lg text-muted">
          Three connected calculators for the money questions that compound: what your fund
          fees really cost, how fast an investment actually grew, and whether buying a home beats
          renting and investing.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
          >
            <svg viewBox="0 0 24 24" className="h-9 w-9 rounded-lg bg-accent-soft p-1.5 text-accent" aria-hidden>
              {t.icon}
            </svg>
            <h2 className="mt-4 text-lg font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted">{t.body}</p>
            <span className="mt-4 inline-block text-sm font-medium text-accent group-hover:underline">Open calculator →</span>
          </Link>
        ))}
      </section>

      <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold">One fund library, used everywhere</h2>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <Step n={1} title="Define your funds">
            Add funds with their {region.feeLabelInline} and expected return in{' '}
            <Link className="text-accent underline" to="/funds">My Funds</Link> ({fundCount} saved), or
            create one from a historical CAGR.
          </Step>
          <Step n={2} title="Compare the fees">
            Pick any number of them in Growth &amp; Fees to see how fees change the outcome.
          </Step>
          <Step n={3} title="Put them to work">
            Choose the fund a renter would invest in, and see how it changes the rent vs. buy answer.
          </Step>
        </div>
        <p className="mt-5 text-xs text-muted">
          Switch between 🇨🇦 Canada and 🇺🇸 US in the header. It changes the currency, terminology and
          mortgage rules (semi-annual compounding and CMHC vs. monthly compounding and PMI). Every
          scenario can be shared with a link.
        </p>
      </section>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">{n}</span>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-0.5 text-muted">{children}</p>
      </div>
    </div>
  );
}
