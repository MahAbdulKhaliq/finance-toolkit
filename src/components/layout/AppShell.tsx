import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSettings, type Theme } from '../../state/settingsStore';
import { REGIONS, type RegionCode } from '../../lib/region';
import { useIsDark } from '../../state/useTheme';

const NAV = [
  { to: '/growth', label: 'Growth & Fees' },
  { to: '/cagr', label: 'CAGR' },
  { to: '/rent-vs-buy', label: 'Rent vs. Buy' },
  { to: '/funds', label: 'My Funds' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/about', label: 'About' },
];

const THEME_NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
const THEME_ICON: Record<Theme, string> = { system: '◐', light: '☀', dark: '☾' };

export function AppShell() {
  const { region, setRegion, theme, setTheme } = useSettings();
  useIsDark();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // On narrow screens the nav scrolls sideways; keep the current page's link visible.
    document.querySelector('nav[aria-label="Calculators"] a[aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
          <NavLink to="/" className="flex shrink-0 items-center gap-2 font-bold">
            <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
              <rect width="32" height="32" rx="7" fill="var(--accent)" />
              <path d="M7 22l6-6 4 4 8-9" stroke="var(--accent-text)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Finance Toolkit</span>
          </NavLink>
          <nav className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto px-1" aria-label="Calculators">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                    isActive ? 'bg-accent-soft text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <label className="sr-only" htmlFor="region">Region</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionCode)}
            className="shrink-0 cursor-pointer rounded-lg border border-line bg-surface px-2 py-1.5 text-sm"
            title="Region: changes currency, terminology and mortgage rules"
          >
            {Object.values(REGIONS).map((r) => (
              <option key={r.code} value={r.code}>
                {r.flag} {r.currency}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setTheme(THEME_NEXT[theme])}
            className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 text-sm hover:bg-surface-2"
            aria-label={`Theme: ${theme}. Click to change.`}
            title={`Theme: ${theme}`}
          >
            {THEME_ICON[theme]}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted">
          Educational estimates only, not financial, tax or legal advice. Returns are not guaranteed
          and past performance doesn't predict future results. Everything runs in your browser;
          nothing you enter is sent anywhere.
        </div>
      </footer>
    </div>
  );
}
