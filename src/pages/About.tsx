import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, PageHeader } from '../components/ui';

const PORTFOLIO_URL = 'https://mahabdulkhaliq.github.io';
const GITHUB_URL = 'https://github.com/MahAbdulKhaliq';
const REPO_URL = 'https://github.com/MahAbdulKhaliq/finance-toolkit';

const STACK = ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts', 'Zustand', 'Vitest', 'GitHub Actions'];

function ExternalLink({ href, children, icon }: { href: string; children: ReactNode; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium transition hover:border-accent hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
        {icon}
      </svg>
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

const globeIcon = (
  <path
    d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9m0-18C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9M3.5 9h17M3.5 15h17"
    stroke="currentColor"
    strokeWidth="1.6"
    fill="none"
    strokeLinecap="round"
  />
);

const githubIcon = (
  <path
    fill="currentColor"
    d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0022 12.25C22 6.58 17.52 2 12 2z"
  />
);

export default function About() {
  return (
    <>
      <PageHeader title="About" intro="Who built this, and why." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-xl font-bold text-accent-ink"
              aria-hidden
            >
              MA
            </div>
            <div>
              <h2 className="text-xl font-semibold">Mahmood Abdul-Khaliq</h2>
              <p className="text-sm text-muted">Developer of Finance Toolkit</p>
            </div>
          </div>
          <p className="mt-4 leading-relaxed text-muted">
            Hi, I'm Mahmood. I built Finance Toolkit to make the long-term cost of everyday money
            decisions easy to see, from fund fees that quietly compound to the trade-offs of buying a
            home instead of renting.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ExternalLink href={PORTFOLIO_URL} icon={globeIcon}>Portfolio website</ExternalLink>
            <ExternalLink href={GITHUB_URL} icon={githubIcon}>GitHub</ExternalLink>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">About this project</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Many financial calculators only answer one question at a time. This toolkit connects
            four of them through a shared fund library: you can turn a historical CAGR into a fund,
            compare its fees against others, then use it as the investment a renter would hold or
            the one you'd save for retirement in. It
            supports both Canadian and US rules (semi-annual mortgage compounding and CMHC insurance
            vs. monthly compounding and PMI).
          </p>
          <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted">
            <li>
              <strong className="text-ink">Tested finance engine:</strong> the calculations are plain
              TypeScript functions with unit tests checked against known reference values.
            </li>
            <li>
              <strong className="text-ink">No backend:</strong> everything runs in your browser. Your
              funds are saved locally, and any scenario can be shared as a link.
            </li>
            <li>
              <strong className="text-ink">Accessible and responsive:</strong> works with a keyboard,
              in light and dark mode, and down to phone width.
            </li>
          </ul>
          <h3 className="mt-5 text-sm font-semibold">Built with</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tech stack">
            {STACK.map((s) => (
              <li key={s} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium ring-1 ring-line">
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <ExternalLink href={REPO_URL} icon={githubIcon}>View the source code</ExternalLink>
            <Link to="/methodology" className="text-sm font-medium text-accent underline-offset-2 hover:underline">
              Read the methodology →
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
