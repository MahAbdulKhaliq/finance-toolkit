import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFunds } from '../state/fundsStore';
import { useRegion } from '../state/settingsStore';
import { pct } from '../lib/format';

/*
 * The Fund Line: the fund library drawn as one transit line, each calculator a station on it.
 * Geometry lives in one 1200 x 620 coordinate space. Lines and rings are SVG; every label is real
 * HTML positioned by percentage, so text stays at reading size and stations are ordinary links.
 */
const W = 1200;
const H = 620;
const LINE_START = 24;
const LINE_END = 1176;
const MAIN_LINE = `M ${LINE_START} 500 H 250 L 370 380 H 830 L 950 260 H ${LINE_END}`;
const HUB = { x: 660, y: 380, w: 176, h: 46 };
const MAX_BRANCHES = 6;
/** Branch lines bend at 45° onto this row before rising into the interchange. */
const BRANCH_JOIN_Y = 450;
/** Fund lines start at their own terminus near the bottom of the map. */
const BRANCH_START_Y = 596;

type StationId = 'growth' | 'cagr' | 'rent' | 'retirement';
interface Station {
  id: StationId;
  to: string;
  name: string;
  question: string;
  x: number;
  y: number;
  /** This station's stretch of the main line, lit while the station is hovered or focused. */
  segment: string;
  /** Where the label sits relative to the ring. */
  place: 'below' | 'above-right';
}

const at = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

export default function Home() {
  const region = useRegion();
  const funds = useFunds((s) => s.funds);
  const [active, setActive] = useState<StationId | null>(null);

  const stations: Station[] = [
    { id: 'growth', to: '/growth', name: 'Growth & Fees', question: `What a ${region.feeLabelInline} really costs over decades`, x: 140, y: 500, segment: `M ${LINE_START} 500 H 250 L 370 380`, place: 'below' },
    { id: 'cagr', to: '/cagr', name: 'CAGR', question: 'The true yearly growth of any investment', x: 480, y: 380, segment: `M 370 380 H ${HUB.x - HUB.w / 2}`, place: 'below' },
    { id: 'rent', to: '/rent-vs-buy', name: 'Rent vs. Buy', question: `Mortgage and ${region.code === 'CA' ? 'CMHC' : 'PMI'} vs. renting and investing`, x: 1010, y: 260, segment: `M ${HUB.x + HUB.w / 2} 380 H 830 L 950 260 H 1065`, place: 'below' },
    { id: 'retirement', to: '/retirement', name: 'Retirement', question: 'When your funds cover your spending', x: 1120, y: 260, segment: `M 1065 260 H ${LINE_END}`, place: 'above-right' },
  ];
  const lit = stations.find((s) => s.id === active);

  const branches = funds.slice(0, MAX_BRANCHES);
  const extra = funds.length - branches.length;
  const mid = (branches.length - 1) / 2;
  // Each fund line enters the pill at its own point and starts from its own spot on the map's
  // bottom edge; the horizontal gap is closed with a 45° run, so dx and dy are equal.
  const spread = branches.length > 1 ? Math.min(130, 380 / (branches.length - 1)) : 0;
  const branchPath = (i: number) => {
    const entry = branches.length === 1 ? HUB.x : HUB.x - 54 + (108 * i) / (branches.length - 1);
    const origin = HUB.x + (i - mid) * spread;
    const dx = Math.abs(entry - origin);
    return `M ${origin} ${BRANCH_START_Y} V ${BRANCH_JOIN_Y + dx} L ${entry} ${BRANCH_JOIN_Y} V ${HUB.y}`;
  };
  const fundCount = `${funds.length} ${funds.length === 1 ? 'fund' : 'funds'} saved`;

  const hover = (id: StationId) => ({
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
  });

  return (
    <div className="flex flex-col gap-14">
      {/* Map: wide screens */}
      <section aria-labelledby="home-title" className="relative hidden aspect-[1200/620] lg:block">
        <div className="absolute top-0 left-0 z-10 max-w-[33rem]">
          <h1 id="home-title" className="text-6xl leading-[0.95] font-extrabold tracking-[-0.03em] xl:text-7xl">
            Small numbers, big decisions.
          </h1>
          <p className="mt-4 text-lg text-muted">
            Define a fund once, then ride it through four calculators that show what fees, down
            payments and savings rates really cost over decades.
          </p>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-hidden" aria-hidden>
          {branches.map((f, i) => (
            <path key={f.id} d={branchPath(i)} stroke={f.color} strokeWidth="10" strokeLinejoin="round" fill="none" />
          ))}
          {branches.map((f, i) => (
            <rect key={f.id} x={HUB.x + (i - mid) * spread - 14} y={BRANCH_START_Y - 5} width={28} height={12} rx={6} className="fill-ink dark:fill-muted" />
          ))}
          <path
            d={MAIN_LINE}
            pathLength={1}
            className={`fund-line-draw stroke-accent transition-opacity duration-200 ${lit ? 'opacity-35' : ''}`}
            strokeWidth="22"
            strokeLinejoin="round"
            fill="none"
          />
          {lit && <path d={lit.segment} className="stroke-accent" strokeWidth="22" strokeLinejoin="round" fill="none" />}
          {/* Terminus caps */}
          <rect x={LINE_START - 6} y={478} width={12} height={44} rx={6} className="fill-ink dark:fill-muted" />
          <rect x={LINE_END - 6} y={238} width={12} height={44} rx={6} className="fill-ink dark:fill-muted" />
          <rect
            x={HUB.x - HUB.w / 2}
            y={HUB.y - HUB.h / 2}
            width={HUB.w}
            height={HUB.h}
            rx={HUB.h / 2}
            className="fill-surface stroke-ink"
            strokeWidth="6"
          />
          {stations.map((s) => (
            <circle
              key={s.id}
              cx={s.x}
              cy={s.y}
              r={active === s.id ? 20 : 16}
              className={`${active === s.id ? 'fill-accent' : 'fill-surface'} stroke-ink transition-all duration-200`}
              strokeWidth="6"
            />
          ))}
        </svg>

        {/* Fund legend: the lines on this map, in the empty lower band beside the branches */}
        <div className="absolute right-0 bottom-0 w-80 text-sm">
          <p className="font-semibold">Your fund lines</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {branches.map((f) => (
              <li key={f.id} className="flex items-center gap-2">
                <span className="h-2 w-6 shrink-0 rounded-full" style={{ background: f.color }} />
                <span className="min-w-0 break-words">{f.name}</span>
                <span className="tabular ml-auto shrink-0 text-xs text-muted">{pct(f.fee)} {region.feeLabel}</span>
              </li>
            ))}
            {extra > 0 && <li className="text-xs text-muted">+ {extra} more in My Funds</li>}
          </ul>
        </div>

        {/* Interchange: My Funds */}
        <div className="absolute z-10 -translate-x-1/2 -translate-y-full pb-9 text-center" style={at(HUB.x, HUB.y)}>
          <Link
            to="/funds"
            className="group inline-flex flex-col items-center rounded-lg px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="text-3xl font-extrabold tracking-tight group-hover:underline group-hover:decoration-accent group-hover:decoration-4 group-hover:underline-offset-4">
              My Funds
            </span>
            <span className="mt-1 text-sm text-muted">Interchange · {fundCount}</span>
          </Link>
        </div>
        <Link
          to="/funds"
          tabIndex={-1}
          aria-hidden
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-ink"
          style={at(HUB.x, HUB.y)}
        >
          Start here
        </Link>

        {stations.map((s) => (
          <div
            key={s.id}
            className={`absolute z-10 w-56 ${
              s.place === 'below' ? '-translate-x-1/2 pt-8 text-center' : '-translate-x-full -translate-y-full pb-8 text-right'
            }`}
            style={s.place === 'below' ? at(s.x, s.y) : at(s.x + 40, s.y)}
          >
            <Link
              to={s.to}
              {...hover(s.id)}
              className="inline-block rounded-lg px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span
                className={`block text-2xl leading-none font-extrabold tracking-tight decoration-accent decoration-4 underline-offset-[6px] ${
                  active === s.id ? 'underline' : ''
                }`}
              >
                {s.name}
              </span>
              <span className="mt-2 block text-sm text-muted">{s.question}</span>
            </Link>
          </div>
        ))}
      </section>

      {/* Stop list: narrow screens. The line runs down the page. */}
      <section aria-labelledby="home-title-sm" className="lg:hidden">
        <h1 id="home-title-sm" className="text-4xl leading-[0.95] font-extrabold tracking-[-0.03em] sm:text-6xl">
          Small numbers, big decisions.
        </h1>
        <p className="mt-4 text-muted sm:text-lg">
          Define a fund once, then ride it through four calculators that show what fees, down
          payments and savings rates really cost over decades.
        </p>

        <ol className="relative mt-8 flex flex-col gap-7 pl-12">
          <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-2.5 rounded-full bg-accent" />
          {[stations[0], stations[1]].map((s) => (
            <StopRow key={s.id} station={s} />
          ))}
          <li className="relative">
            {/* The interchange keeps its pill shape, stood upright along the vertical line. */}
            <span aria-hidden className="absolute -top-2 -left-12 h-12 w-8 rounded-full border-[5px] border-ink bg-surface" />
            <Link to="/funds" className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-2xl leading-none font-extrabold tracking-tight">My Funds</span>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-ink">Start here</span>
              </span>
              <span className="mt-1.5 block text-sm text-muted">Interchange · {fundCount}, used on every line</span>
            </Link>
            <span aria-hidden className="mt-2 flex flex-wrap gap-1.5">
              {branches.map((f) => (
                <span key={f.id} className="h-2 w-6 rounded-full" style={{ background: f.color }} />
              ))}
            </span>
          </li>
          {[stations[2], stations[3]].map((s) => (
            <StopRow key={s.id} station={s} />
          ))}
        </ol>
      </section>

      {/* How the line works */}
      <section className="border-t border-line pt-8" aria-labelledby="how-title">
        <h2 id="how-title" className="text-2xl font-extrabold tracking-tight">One fund library, used everywhere</h2>
        <ol className="relative mt-6 grid grid-cols-1 gap-6 pl-12 sm:grid-cols-3 sm:pl-0">
          <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-2.5 rounded-full bg-accent sm:hidden" />
          <span aria-hidden className="absolute top-[9px] right-0 left-0 hidden h-2.5 rounded-full bg-accent sm:block" />
          <HowStop title="Define your funds">
            Add funds with their {region.feeLabelInline} and expected return in{' '}
            <Link className="font-medium text-accent underline" to="/funds">My Funds</Link>, or
            create one from a historical CAGR.
          </HowStop>
          <HowStop title="Compare the fees">
            Pick any number of them in Growth &amp; Fees to see how fees change the outcome.
          </HowStop>
          <HowStop title="Put them to work">
            Choose the fund a renter would invest in, or the funds you'd save for retirement in, and
            see how the answer changes.
          </HowStop>
        </ol>
        <p className="mt-8 text-sm text-muted">
          Switch between Canada and the US in the header. It changes the currency, terminology and
          mortgage rules (semi-annual compounding and CMHC vs. monthly compounding and PMI). Every
          scenario can be shared with a link.
        </p>
      </section>
    </div>
  );
}

function StopRow({ station }: { station: Station }) {
  return (
    <li className="relative">
      <span aria-hidden className="absolute top-0.5 -left-12 h-8 w-8 rounded-full border-[5px] border-ink bg-surface" />
      <Link
        to={station.to}
        className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="block text-2xl leading-none font-extrabold tracking-tight">{station.name}</span>
        <span className="mt-1.5 block text-sm text-muted">{station.question}</span>
      </Link>
    </li>
  );
}

function HowStop({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="relative">
      <span aria-hidden className="absolute top-0 -left-12 z-10 block h-8 w-8 rounded-full border-[5px] border-ink bg-surface sm:relative sm:left-0 sm:h-7 sm:w-7" />
      <h3 className="text-lg font-extrabold tracking-tight sm:mt-3">{title}</h3>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </li>
  );
}
