import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useSettings, type Theme } from '../../state/settingsStore';
import { REGIONS, type RegionCode } from '../../lib/region';
import { useIsDark } from '../../state/useTheme';
import { DesktopNav, MobileNav } from './SiteNav';


const THEME_NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };
// 24px line icons in the same 2px stroke as the logo and Home icons.
const THEME_ICON: Record<Theme, React.ReactNode> = {
  // Half-filled circle: follows the system setting.
  system: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 010 16z" fill="currentColor" stroke="none" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4l1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  dark: <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />,
};

export function AppShell() {
  const { region, setRegion, theme, setTheme } = useSettings();
  useIsDark();
  const { pathname } = useLocation();
  const scroller = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  // New page starts at the top. The window scrolls on touch screens, .app-scroller otherwise.
  // Focus moves to <main> (unless something in it already has focus) so Page Down, Space and the
  // arrow keys scroll the content: with the window not scrolling, focus left on <body> or a header
  // link would scroll nothing.
  useEffect(() => {
    window.scrollTo(0, 0);
    scroller.current?.scrollTo(0, 0);
    if (!main.current?.contains(document.activeElement)) main.current?.focus({ preventScroll: true });
  }, [pathname]);
  // The header sits beside the scroller's gutter, not above it; padding it by the gutter's width
  // keeps the header row centred on the same column as the page.
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const sc = scroller.current;
    if (!sc) return;
    const sync = () => header.current?.style.setProperty('padding-right', `${sc.offsetWidth - sc.clientWidth}px`);
    const ro = new ResizeObserver(sync);
    ro.observe(sc);
    // The pointer type switches the scroller on and off; measure once the new layout has settled.
    const fine = window.matchMedia('(pointer: fine)');
    const later = () => requestAnimationFrame(() => requestAnimationFrame(sync));
    fine.addEventListener('change', later);
    sync();
    return () => {
      ro.disconnect();
      fine.removeEventListener('change', later);
    };
  }, []);

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <header ref={header} className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:gap-3">
          <MobileNav />
          <NavLink to="/" className="flex shrink-0 items-center gap-2 font-bold">
            <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
              <rect width="32" height="32" rx="7" fill="var(--accent)" />
              <path d="M7 22l6-6 4 4 8-9" stroke="var(--accent-text)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden min-[360px]:inline">Finance Toolkit</span>
          </NavLink>
          <DesktopNav />
          <label className="sr-only" htmlFor="region">Region</label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionCode)}
            className="ml-auto shrink-0 cursor-pointer rounded-lg border border-line bg-surface px-2 py-1.5 text-sm"
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
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {THEME_ICON[theme]}
            </svg>
          </button>
        </div>
      </header>

      <div ref={scroller} className="app-scroller flex flex-1 flex-col">
        <main ref={main} tabIndex={-1} className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 outline-none sm:py-8">
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
    </div>
  );
}
