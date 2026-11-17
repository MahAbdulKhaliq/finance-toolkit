import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFunds, type Fund } from '../../state/fundsStore';
import { useRegion } from '../../state/settingsStore';
import { pct } from '../../lib/format';
import { FundEditor } from './FundEditor';
import { Button, Notice } from '../ui';

/** Library funds plus any funds that arrived in a shared link but weren't imported. */
export function useAvailableFunds(shared: Fund[]) {
  const library = useFunds((s) => s.funds);
  const ids = new Set(library.map((f) => f.id));
  const missing = shared.filter((f) => !ids.has(f.id));
  return { all: [...library, ...missing], missing };
}

export function ImportSharedFunds({ missing }: { missing: Fund[] }) {
  const add = useFunds((s) => s.add);
  const [done, setDone] = useState(false);
  if (!missing.length || done) return null;
  return (
    <Notice
      action={
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => { missing.forEach((f) => add(f)); setDone(true); }}>
            Add to My Funds
          </Button>
          <Button variant="ghost" onClick={() => setDone(true)}>Dismiss</Button>
        </div>
      }
    >
      This shared scenario uses {missing.length} fund{missing.length > 1 ? 's' : ''} you don't have:{' '}
      <strong>{missing.map((f) => f.name).join(', ')}</strong>.
    </Notice>
  );
}

function Swatch({ color }: { color: string }) {
  return <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />;
}

/** Toggleable chips for choosing several funds, with an inline "new fund" button. */
export function FundMultiPicker({
  funds,
  selected,
  onChange,
}: {
  funds: Fund[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const region = useRegion();
  const [editorOpen, setEditorOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {funds.map((f) => {
          const on = selected.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? selected.filter((id) => id !== f.id) : [...selected, f.id])}
              className={`flex max-w-full items-center gap-2 rounded-2xl border px-3 py-1.5 text-left text-sm transition ${
                on ? 'border-accent bg-accent-soft' : 'border-line text-muted hover:text-ink'
              }`}
            >
              <Swatch color={f.color} />
              <span className="min-w-0 font-medium wrap-anywhere">{f.name}</span>
              <span className={`tabular text-xs ${on ? '' : 'text-muted'}`}>
                {pct(f.annualReturn)} return · {pct(f.fee)} {region.feeLabelInline}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setEditorOpen(true)}
          className="rounded-full border border-dashed border-line px-3 py-1.5 text-sm text-muted hover:border-accent hover:text-ink"
        >
          + New fund
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        Funds come from your library. <Link to="/funds" className="underline">Manage My Funds</Link>
      </p>
      <FundEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={(f) => onChange([...selected, f.id])}
      />
    </div>
  );
}

/** Single-fund dropdown with inline creation. */
export function FundSelect({
  funds,
  value,
  onChange,
  label,
  hint,
}: {
  funds: Fund[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  hint?: string;
}) {
  const region = useRegion();
  const [editorOpen, setEditorOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="fund-select" className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <select
          id="fund-select"
          className="min-w-0 flex-1 cursor-pointer rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          value={value}
          onChange={(e) => (e.target.value === '__new' ? setEditorOpen(true) : onChange(e.target.value))}
        >
          {funds.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}: {pct(f.annualReturn)} return, {pct(f.fee)} {region.feeLabelInline}
            </option>
          ))}
          <option value="__new">+ New fund…</option>
        </select>
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      <FundEditor open={editorOpen} onClose={() => setEditorOpen(false)} onSaved={(f) => onChange(f.id)} />
    </div>
  );
}
