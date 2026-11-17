import { useEffect, useState } from 'react';
import { useSettings } from './settingsStore';

const mq = () => window.matchMedia('(prefers-color-scheme: dark)');

/** Resolves the theme setting and keeps the `dark` class on <html> in sync. */
export function useIsDark() {
  const theme = useSettings((s) => s.theme);
  const [systemDark, setSystemDark] = useState(() => mq().matches);

  useEffect(() => {
    const m = mq();
    const on = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);

  const dark = theme === 'dark' || (theme === 'system' && systemDark);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  return dark;
}

/**
 * Fixed chart series colours (not user fund colours), as light/dark pairs. Every value keeps at
 * least 3:1 against its theme's surface so lines and bars stay visible.
 */
const SERIES = {
  light: {
    primary: '#0d9488', // buy, single-series lines (Ledger Teal family)
    rent: '#6366f1', // rent + invest (Rent Indigo)
    cost: '#e11d48', // fees paid, interest
    lostGrowth: '#ea580c',
    insurance: '#db2777', // CMHC / PMI
    propertyTax: '#d97706',
    maintenance: '#4d7c0f',
    homeInsurance: '#0284c7',
    closing: '#64748b',
    gain: '#15803d', // the fee gap, money you keep
  },
  dark: {
    primary: '#2dd4bf',
    rent: '#818cf8',
    cost: '#fb7185',
    lostGrowth: '#fb923c',
    insurance: '#f472b6',
    propertyTax: '#fbbf24',
    maintenance: '#a3e635',
    homeInsurance: '#38bdf8',
    closing: '#94a3b8',
    gain: '#4ade80',
  },
};

/** Concrete colors for Recharts (SVG attributes can't reliably use CSS variables). */
export function useChartTheme() {
  const dark = useIsDark();
  return dark
    ? { grid: '#262e38', axis: '#98a2b0', tooltipBg: '#1c232b', tooltipBorder: '#2a323c', text: '#e8ecf1', muted: '#64748b', series: SERIES.dark }
    : { grid: '#e5e7eb', axis: '#5d6673', tooltipBg: '#ffffff', tooltipBorder: '#e3e6eb', text: '#14171c', muted: '#64748b', series: SERIES.light };
}

export function tooltipStyle(t: ReturnType<typeof useChartTheme>) {
  return {
    contentStyle: {
      background: t.tooltipBg,
      border: `1px solid ${t.tooltipBorder}`,
      borderRadius: 8,
      color: t.text,
      fontSize: 13,
    },
    labelStyle: { color: t.text, fontWeight: 600 },
    itemStyle: { padding: 0 },
  };
}
