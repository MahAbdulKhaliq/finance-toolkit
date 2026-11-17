import { useEffect, useId, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/*
 * Site navigation: three top-level items (Calculators, My Funds, About). From 640px up they sit in
 * the header, with Calculators opening a dropdown. Below 640px a menu button opens a side nav that
 * slides in from the left, with Calculators as an expandable group.
 */

export const CALCULATORS = [
  { to: '/growth', label: 'Growth & Fees', blurb: 'What fees cost over the years' },
  { to: '/cagr', label: 'CAGR', blurb: 'The yearly growth rate between two values' },
  { to: '/rent-vs-buy', label: 'Rent vs. Buy', blurb: 'Owning a home against renting and investing' },
  { to: '/retirement', label: 'Retirement', blurb: 'When your savings can cover your spending' },
];
const METHODOLOGY = { to: '/methodology', label: 'How the math works' };
const TOP = [
  { to: '/funds', label: 'My Funds' },
  { to: '/about', label: 'About' },
];

const isCalcPath = (p: string) => CALCULATORS.some((c) => p.startsWith(c.to)) || p.startsWith(METHODOLOGY.to);

const topItem = (active: boolean) =>
  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
    active ? 'bg-accent-soft text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`;

function Chevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''} ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Header nav for 640px and up: a Calculators dropdown, then My Funds and About. */
export function DesktopNav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  // Close on navigation, outside press, and Escape (returning focus to the button).
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
      <div
        ref={wrap}
        className="relative"
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        <button
          ref={button}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
          className={topItem(isCalcPath(pathname))}
        >
          Calculators
          <Chevron open={open} />
        </button>
        <div
          id={menuId}
          hidden={!open}
          className="nav-pop absolute top-full left-0 z-30 mt-2 w-80 rounded-xl border border-line bg-surface p-1.5 shadow-lg"
        >
          <ul>
            {CALCULATORS.map((c) => (
              <li key={c.to}>
                <NavLink
                  to={c.to}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 transition focus-visible:outline-2 focus-visible:outline-accent ${
                      isActive ? 'bg-accent-soft' : 'hover:bg-surface-2'
                    }`
                  }
                >
                  <span className="block text-sm font-semibold text-ink">{c.label}</span>
                  <span className="block text-xs text-muted">{c.blurb}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-1.5 border-t border-line pt-1.5">
            <NavLink
              to={METHODOLOGY.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-accent ${
                  isActive ? 'bg-accent-soft text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
                }`
              }
            >
              {METHODOLOGY.label}
            </NavLink>
          </div>
        </div>
      </div>
      {TOP.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => topItem(isActive)}>
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}

const SLIDE_MS = 280;
const FADE_MS = 150; // reduced motion: a short fade replaces the slide
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Menu button and slide-in side nav for screens under 640px. */
export function MobileNav() {
  const { pathname } = useLocation();
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false); // drives the slide/fade classes
  const [calcOpen, setCalcOpen] = useState(() => isCalcPath(pathname));
  const groupId = useId();

  const open = () => {
    const d = dialog.current;
    if (!d || d.open) return;
    setCalcOpen(isCalcPath(pathname));
    d.showModal();
    document.documentElement.style.overflow = 'hidden';
    // Flush styles at the closed position (reading layout forces it), so the change to `shown`
    // starts a transition instead of jumping straight to the open position.
    void panel.current?.offsetWidth;
    setShown(true);
  };

  const close = () => {
    const d = dialog.current;
    if (!d || !d.open) return;
    setShown(false);
    window.setTimeout(() => {
      d.close();
      document.documentElement.style.overflow = '';
    }, reducedMotion() ? FADE_MS : SLIDE_MS);
  };

  // Navigating from the side nav closes it.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const sideLink = ({ isActive }: { isActive: boolean }) =>
    `flex items-center rounded-lg px-3 py-2.5 font-medium transition focus-visible:outline-2 focus-visible:outline-accent ${
      isActive ? 'bg-accent-soft text-ink' : 'text-ink hover:bg-surface-2'
    }`;

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Open menu"
        aria-haspopup="dialog"
        className="shrink-0 rounded-lg border border-line px-2.5 py-1.5 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:hidden"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <dialog
        ref={dialog}
        aria-label="Menu"
        onCancel={(e) => {
          e.preventDefault(); // animate out instead of vanishing
          close();
        }}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-transparent"
      >
        <div
          aria-hidden
          onClick={close}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-[280ms] motion-reduce:duration-150 ${shown ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Slides in from the left, under the menu button. With reduced motion it fades instead. */}
        <aside
          ref={panel}
          className={`absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col border-r border-line bg-surface shadow-xl transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-opacity motion-reduce:duration-150 ${
            shown ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-100 motion-reduce:translate-x-0 motion-reduce:opacity-0'
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="font-bold">Menu</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="rounded-lg border border-line px-2.5 py-1.5 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Site menu" className="flex-1 overflow-y-auto p-3">
            <button
              type="button"
              aria-expanded={calcOpen}
              aria-controls={groupId}
              onClick={() => setCalcOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-medium text-ink transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
            >
              Calculators
              <Chevron open={calcOpen} className="text-muted" />
            </button>
            {/* Expands by animating the grid row from 0fr to 1fr. */}
            <div
              id={groupId}
              aria-hidden={!calcOpen}
              className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${calcOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <ul className="min-h-0 overflow-hidden border-l-2 border-line ml-4 pl-2">
                {CALCULATORS.map((c) => (
                  <li key={c.to}>
                    <NavLink to={c.to} className={sideLink} tabIndex={calcOpen ? undefined : -1}>
                      {c.label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <NavLink
                    to={METHODOLOGY.to}
                    tabIndex={calcOpen ? undefined : -1}
                    className={({ isActive }) =>
                      `flex rounded-lg px-3 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-accent ${
                        isActive ? 'bg-accent-soft text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink'
                      }`
                    }
                  >
                    {METHODOLOGY.label}
                  </NavLink>
                </li>
              </ul>
            </div>
            {TOP.map((t) => (
              <NavLink key={t.to} to={t.to} className={sideLink}>
                {t.label}
              </NavLink>
            ))}
          </nav>
        </aside>
      </dialog>
    </>
  );
}
