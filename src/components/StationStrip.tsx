import { Fragment } from 'react';
import { Link } from 'react-router-dom';

/*
 * The Fund Line in miniature: the order a fund travels through the toolkit, with the current
 * calculator lit. Every other stop is a working link. It echoes the Home map at instrument size.
 */
const STOPS = [
  { to: '/funds', name: 'My Funds' },
  { to: '/growth', name: 'Growth & Fees' },
  { to: '/cagr', name: 'CAGR' },
  { to: '/rent-vs-buy', name: 'Rent vs. Buy' },
  { to: '/retirement', name: 'Retirement' },
];

export function StationStrip({ current }: { current: string }) {
  const at = STOPS.findIndex((s) => s.to === current);
  return (
    <nav aria-label="Calculators on the fund line" className="-mx-1 mb-5 overflow-x-auto px-1 pb-1 [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:[mask-image:none]">
      <ol className="flex w-max items-center text-xs text-muted">
        {STOPS.map((s, i) => {
          const here = i === at;
          return (
            <Fragment key={s.to}>
              {i > 0 && (
                <li aria-hidden className={`h-1.5 w-8 rounded-full bg-accent sm:w-12 ${i <= at ? '' : 'opacity-35'}`} />
              )}
              <li>
                {here ? (
                  <span aria-current="page" className="flex items-center gap-1.5 px-1.5 py-1 font-bold text-ink">
                    <span className="h-[18px] w-[18px] rounded-full border-[3px] border-ink bg-accent" />
                    {s.name}
                  </span>
                ) : (
                  <Link
                    to={s.to}
                    className="flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <span className="h-3.5 w-3.5 rounded-full border-[3px] border-ink bg-surface" />
                    {s.name}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
