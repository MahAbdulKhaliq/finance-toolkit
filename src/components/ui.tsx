import { useEffect, useId, useState, type ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-line bg-surface p-4 sm:p-5 ${className}`}>
      {children}
    </section>
  );
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-base font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function PageHeader({ title, intro, actions }: { title: string; intro: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-muted">{intro}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  const styles: Record<BtnVariant, string> = {
    primary: 'bg-accent text-accent-ink hover:opacity-90',
    secondary: 'border border-line bg-surface hover:bg-surface-2',
    ghost: 'hover:bg-surface-2 text-muted hover:text-ink',
    danger: 'text-bad hover:bg-surface-2',
  };
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 ${styles[variant]} ${className}`}
    />
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

const inputBox =
  'flex items-center rounded-lg border border-line bg-surface focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25';
const inputEl = 'tabular w-full min-w-0 bg-transparent px-3 py-2 text-sm outline-none';

/**
 * Numeric input that tolerates in-progress typing ("1.", "", "-") and only commits valid numbers.
 * `scale` converts between stored and displayed values (100 for percentages).
 */
export function NumberField({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  scale = 1,
  min,
  max,
  step,
  decimals = 2,
  disabled = false,
}: {
  label: string;
  hint?: ReactNode;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  scale?: number;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  /** Shows a computed value the user can't edit. */
  disabled?: boolean;
}) {
  const id = useId();
  const display = (v: number) => (Number.isFinite(v) ? String(+(v * scale).toFixed(decimals)) : '');
  const [text, setText] = useState(display(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(display(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, focused, scale]);

  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className={`${inputBox} ${disabled ? 'bg-surface-2 text-muted' : ''}`}>
        {prefix && <span className="pl-3 text-sm text-muted">{prefix}</span>}
        <input
          id={id}
          disabled={disabled}
          type="number"
          inputMode="decimal"
          className={inputEl}
          value={text}
          min={min !== undefined ? min * scale : undefined}
          max={max !== undefined ? max * scale : undefined}
          step={step ?? 'any'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setText(e.target.value);
            const n = parseFloat(e.target.value);
            if (Number.isFinite(n)) {
              let v = n / scale;
              if (min !== undefined) v = Math.max(min, v);
              if (max !== undefined) v = Math.min(max, v);
              onChange(v);
            }
          }}
        />
        {suffix && <span className="pr-3 text-sm text-muted">{suffix}</span>}
      </div>
    </Field>
  );
}

export function MoneyField(props: Omit<Parameters<typeof NumberField>[0], 'prefix' | 'scale'>) {
  return <NumberField prefix="$" min={0} decimals={2} {...props} />;
}

export function PercentField(props: Omit<Parameters<typeof NumberField>[0], 'suffix' | 'scale'>) {
  return <NumberField suffix="%" scale={100} decimals={3} {...props} />;
}

export function SelectField<T extends string>({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: ReactNode;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className={inputBox}>
        <select
          id={id}
          className={`${inputEl} cursor-pointer bg-surface`}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-lg border border-line bg-surface-2 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-md px-3 py-1 text-sm font-medium transition ${
            value === o.value ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: 'good' | 'bad';
}) {
  return (
    <div className="rounded-lg border border-line bg-surface-2/50 p-3">
      <div className="text-xs font-medium text-muted">{label}</div>
      <div className={`tabular mt-1 text-xl font-semibold ${tone === 'good' ? 'text-good' : tone === 'bad' ? 'text-bad' : ''}`}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function Notice({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-warn-bg px-4 py-3 text-sm text-warn-ink">
      <div>{children}</div>
      {action}
    </div>
  );
}

export function Details({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-line bg-surface">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold sm:px-5">
        <span className="mr-2 inline-block transition group-open:rotate-90">▸</span>
        {summary}
      </summary>
      <div className="border-t border-line p-2 sm:p-3">{children}</div>
    </details>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: ReactNode[];
  rows: ReactNode[][];
}) {
  return (
    <div className="max-h-[28rem] overflow-auto">
      <table className="tabular w-full text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`border-b border-line px-3 py-2 font-semibold whitespace-nowrap ${i === 0 ? 'text-left' : 'text-right'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-surface-2/40">
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-1.5 whitespace-nowrap ${j === 0 ? 'text-left' : 'text-right'}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
