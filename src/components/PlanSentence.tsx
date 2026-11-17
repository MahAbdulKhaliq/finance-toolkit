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
  const current = options.find((o) => o.value === value)?.label ?? '';
  return (
    <span className={box}>
      {/* An invisible copy of the chosen label sets the width, so the box hugs the word you see
          instead of the longest option. The chevron is drawn so its room is the same in every browser. */}
      <span className="relative inline-grid">
        <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre pr-[1.1em]">
          {current}
        </span>
        <select
          aria-label={label}
          className="col-start-1 row-start-1 w-0 min-w-full cursor-pointer appearance-none bg-transparent pr-[1.1em] outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="pointer-events-none absolute right-0 top-1/2 h-[0.55em] w-[0.55em] -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </span>
    </span>
  );
}

/** Free text inside a sentence (a name), sized to its content. */
export function InlineText({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  return (
    <span className={`${box} max-w-full`}>
      {/* An invisible copy of the text sets the width, as in InlineNumber. */}
      <span className="inline-grid max-w-full">
        <span aria-hidden className="invisible col-start-1 row-start-1 overflow-hidden whitespace-pre pr-px">
          {value || ' '}
        </span>
        <input
          type="text"
          aria-label={label}
          maxLength={maxLength}
          className="col-start-1 row-start-1 w-0 min-w-full bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </span>
  );
}

/** A date inside a sentence, as a native date input. */
export function InlineDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <span className={box}>
      <input
        type="date"
        aria-label={label}
        className="cursor-pointer bg-transparent outline-none [&::-webkit-datetime-edit]:font-semibold [&::-webkit-datetime-edit-fields-wrapper]:p-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </span>
  );
}
