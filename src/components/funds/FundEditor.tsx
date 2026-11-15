import { useEffect, useRef, useState } from 'react';
import { isStarter, nextColor, useFunds, FUND_COLORS, type Fund } from '../../state/fundsStore';
import { useRegion } from '../../state/settingsStore';
import { Button, PercentField } from '../ui';

export type FundDraft = Omit<Fund, 'id'> & { id?: string };

/**
 * Modal for creating or editing a library fund. Pass `initial` with an id to edit, or a partial
 * draft (e.g. from the CAGR page) to create a pre-filled fund.
 */
export function FundEditor({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean;
  initial?: Partial<FundDraft>;
  onClose: () => void;
  onSaved?: (f: Fund) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { funds, add, update } = useFunds();
  const region = useRegion();
  const blank = (): FundDraft => ({
    name: '',
    fee: 0.002,
    annualReturn: 0.07,
    color: nextColor(funds),
    notes: '',
  });
  const [draft, setDraft] = useState<FundDraft>(blank);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open) {
      setDraft({ ...blank(), ...initial });
      if (!d.open) d.showModal();
    } else if (d.open) d.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const editing = Boolean(initial?.id && funds.some((f) => f.id === initial.id));
  const locked = editing && isStarter({ id: initial!.id! });
  const lockedInput = 'cursor-not-allowed bg-surface-2 text-muted';

  const save = () => {
    const clean = { ...draft, name: draft.name.trim() || 'Untitled fund' };
    let saved: Fund;
    if (editing && clean.id) {
      update(clean.id, clean);
      saved = clean as Fund;
    } else {
      saved = add({ ...clean, id: undefined });
    }
    onSaved?.(saved);
    onClose();
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/50"
    >
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="flex flex-col gap-4 p-5"
      >
        <h2 className="text-lg font-semibold">{editing ? 'Edit fund' : 'New fund'}</h2>
        {locked && (
          <p className="-mt-2 text-sm text-muted">
            This is a starter fund. You can adjust its {region.feeLabelInline}, return and color, but not its name or notes.
          </p>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="fund-name" className="text-sm font-medium">Name</label>
          <input
            id="fund-name"
            autoFocus={!locked}
            readOnly={locked}
            aria-readonly={locked}
            className={`rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent ${locked ? lockedInput : ''}`}
            value={draft.name}
            placeholder="e.g. My TFSA index ETF"
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PercentField
            label={region.feeLabel}
            value={draft.fee}
            min={0}
            max={0.1}
            onChange={(fee) => setDraft({ ...draft, fee })}
          />
          <PercentField
            label="Expected return"
            hint="Gross, before fees"
            value={draft.annualReturn}
            min={-0.5}
            max={0.5}
            onChange={(annualReturn) => setDraft({ ...draft, annualReturn })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Color</span>
          <div className="flex flex-wrap gap-2">
            {FUND_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => setDraft({ ...draft, color: c })}
                className={`h-7 w-7 rounded-full ring-offset-2 ring-offset-surface ${draft.color === c ? 'ring-2 ring-ink' : ''}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="fund-notes" className="text-sm font-medium">Notes <span className="font-normal text-muted">(optional)</span></label>
          <input
            id="fund-notes"
            readOnly={locked}
            aria-readonly={locked}
            className={`rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent ${locked ? lockedInput : ''}`}
            value={draft.notes ?? ''}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">
            {editing ? 'Save changes' : 'Add to My Funds'}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
