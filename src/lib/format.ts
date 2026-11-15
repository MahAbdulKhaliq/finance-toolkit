import type { RegionConfig } from './region';

const cache = new Map<string, Intl.NumberFormat>();
function nf(locale: string, opts: Intl.NumberFormatOptions) {
  const key = locale + JSON.stringify(opts);
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(locale, opts);
    cache.set(key, f);
  }
  return f;
}

export function money(value: number, region: RegionConfig, decimals = 0): string {
  if (!Number.isFinite(value)) return '—';
  return nf(region.locale, {
    style: 'currency',
    currency: region.currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Short money for chart axes: $1.2M, $350K. */
export function moneyShort(value: number, region: RegionConfig): string {
  if (!Number.isFinite(value)) return '—';
  return nf(region.locale, {
    style: 'currency',
    currency: region.currency,
    currencyDisplay: 'narrowSymbol',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function pct(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return `${(value * 100).toFixed(decimals)}%`;
}

export function num(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return '—';
  return value.toLocaleString(undefined, { maximumFractionDigits: decimals });
}
