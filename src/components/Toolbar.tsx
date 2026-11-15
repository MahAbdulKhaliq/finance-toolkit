import { useState } from 'react';
import { useInflation, useRegion, useSettings } from '../state/settingsStore';
import { Button, Segmented } from './ui';

/** Nominal / today's-dollars switch with an editable inflation rate (shared across pages). */
export function DollarsToggle() {
  const { realDollars, setRealDollars, setInflation } = useSettings();
  const inflation = useInflation();
  const region = useRegion();
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Segmented
        label="Dollar basis"
        value={realDollars ? 'real' : 'nominal'}
        onChange={(v) => setRealDollars(v === 'real')}
        options={[
          { value: 'nominal', label: 'Future $' },
          { value: 'real', label: "Today's $" },
        ]}
      />
      {realDollars && (
        <label className="flex items-center gap-1 text-muted">
          at
          <input
            type="number"
            step="0.1"
            className="tabular w-16 rounded-md border border-line bg-surface px-2 py-1 text-ink"
            value={+(inflation * 100).toFixed(2)}
            onChange={(e) => {
              const n = parseFloat(e.target.value);
              if (Number.isFinite(n)) setInflation(n / 100);
            }}
            aria-label="Inflation rate (%)"
          />
          % inflation
          {inflation !== region.defaults.inflation && (
            <button className="ml-1 underline" onClick={() => setInflation(null)} type="button">
              reset
            </button>
          )}
        </label>
      )}
    </div>
  );
}

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          window.prompt('Copy this link:', window.location.href);
        }
      }}
      title="Copy a link to this exact scenario"
    >
      {copied ? '✓ Link copied' : '🔗 Share scenario'}
    </Button>
  );
}

/** Returns a function that deflates a value at year t when "today's dollars" is on. */
export function useDeflator() {
  const real = useSettings((s) => s.realDollars);
  const inflation = useInflation();
  return (value: number, years: number) => (real ? value / Math.pow(1 + inflation, years) : value);
}
