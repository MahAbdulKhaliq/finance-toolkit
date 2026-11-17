import { useEffect, useState } from 'react';

/*
 * Inputs that sit inside a sentence ("Invest $10,000, then $500 every month…"). They inherit the
 * sentence's type size, carry their own accessible label, and read as values you can change.
 */
const box =
  'inline-flex items-baseline rounded-lg border border-line bg-surface-2 px-2 font-semibold text-ink transition hover:border-accent focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25';

/** A number inside a sentence. Shows grouped digits at rest and the raw number while editing. */
export function InlineNumber({
  label,
  value,
  onChange,
  prefix,
  suffix,
  scale = 1,
  min,
  max,
  decimals = 2,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  scale?: number;
  min?: number;
  max?: number;
  decimals?: number;
}) {
  const raw = (v: number) => (Number.isFinite(v) ? String(+(v * scale).toFixed(decimals)) : '');
  const grouped = (v: number) =>
    Number.isFinite(v) ? (v * scale).toLocaleString('en-US', { maximumFractionDigits: decimals }) : '';
  const [text, setText] = useState(grouped(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(grouped(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, focused, scale]);

  return (
    <span className={box}>
      {prefix && <span aria-hidden>{prefix}</span>}
      {/* An invisible copy of the text sets the width, so the box hugs the value at any size. */}
      <span className="inline-grid">
        <span aria-hidden className="tabular invisible col-start-1 row-start-1 whitespace-pre pr-px">
          {text || '0'}
        </span>
      <input
        type="text"
        inputMode="decimal"
        aria-label={label}
        className="tabular col-start-1 row-start-1 w-0 min-w-full bg-transparent outline-none"
        value={text}
        onFocus={() => {
          setFocused(true);
          setText(raw(value));
        }}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setText(e.target.value);
          const n = parseFloat(e.target.value.replace(/,/g, ''));
          if (Number.isFinite(n)) {
            let v = n / scale;
            if (min !== undefined) v = Math.max(min, v);
            if (max !== undefined) v = Math.min(max, v);
            onChange(v);
          }
        }}
      />
      </span>
      {suffix && <span aria-hidden>{suffix}</span>}
    </span>
  );
}

/** A choice inside a sentence, as a native select. */
export function InlineSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <span className={box}>
      <select
        aria-label={label}
        className="cursor-pointer bg-transparent outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  );
}
