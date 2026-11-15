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

/** Concrete colors for Recharts (SVG attributes can't reliably use CSS variables). */
export function useChartTheme() {
  const dark = useIsDark();
  return dark
    ? { grid: '#262e38', axis: '#98a2b0', tooltipBg: '#1c232b', tooltipBorder: '#2a323c', text: '#e8ecf1', muted: '#64748b' }
    : { grid: '#e5e7eb', axis: '#5d6673', tooltipBg: '#ffffff', tooltipBorder: '#e3e6eb', text: '#14171c', muted: '#94a3b8' };
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
