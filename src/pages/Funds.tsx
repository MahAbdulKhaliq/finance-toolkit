import { useState } from 'react';
import { isStarter, useFunds, type Fund } from '../state/fundsStore';
import { useRegion } from '../state/settingsStore';
import { pct } from '../lib/format';
import { FundEditor, type FundDraft } from '../components/funds/FundEditor';
import { Button, Card, PageHeader } from '../components/ui';

/**
 * Two-step action confirmed in the page itself. Native confirm() is suppressed in some
 * embedded browsers (it returns false without showing), which made deletes silently fail.
 */
function ConfirmAction({
  label,
  prompt,
  confirmLabel,
  onConfirm,
  variant = 'danger',
}: {
  label: string;
  prompt: string;
  confirmLabel: string;
  onConfirm: () => void;
  variant?: 'danger' | 'ghost';
}) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return <Button variant={variant} onClick={() => setAsking(true)}>{label}</Button>;
  }
  return (
    <span className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label={prompt}>
      <span className="text-muted">{prompt}</span>
      <Button
        variant="danger"
        className="border border-current"
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" onClick={() => setAsking(false)} autoFocus>Cancel</Button>
    </span>
  );
}

export default function FundsPage() {
  const { funds, remove, resetStarterValues } = useFunds();
  const region = useRegion();
  const [editing, setEditing] = useState<Partial<FundDraft> | null>(null);

  return (
    <>
      <PageHeader
        title="My Funds"
        intro={
          <>
            Your fund library is saved in this browser and shared by every calculator. Compare
            funds in <em>Growth &amp; Fees</em>, save a historical CAGR as a fund's expected return, or
            pick one as the place the renter invests in <em>Rent vs. Buy</em>.
          </>
        }
        actions={
          <>
            <ConfirmAction
              variant="ghost"
              label="Reset starter values"
              prompt={`Restore starter ${region.feeLabelInline}s and returns?`}
              confirmLabel="Reset"
              onConfirm={resetStarterValues}
            />
            <Button variant="primary" onClick={() => setEditing({})}>+ New fund</Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {funds.map((f: Fund) => {
          const starter = isStarter(f);
          return (
            <Card key={f.id} className="flex flex-col">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: f.color }} />
                <div className="min-w-0 flex-1">
                  <h3 className="flex min-w-0 items-center gap-2 font-semibold">
                    <span className="truncate">{f.name}</span>
                    {starter && (
                      <span
                        className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted ring-1 ring-line"
                        title="Starter funds can't be deleted or renamed, but you can adjust their fee and return."
                      >
                        Starter
                      </span>
                    )}
                  </h3>
                  {f.notes && <p className="mt-0.5 text-sm text-muted">{f.notes}</p>}
                </div>
              </div>
              <dl className="tabular mt-4 mb-4 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-muted">{region.feeLabel}</dt>
                  <dd className="font-semibold">{pct(f.fee)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Gross return</dt>
                  <dd className="font-semibold">{pct(f.annualReturn)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Net return</dt>
                  <dd className="font-semibold">{pct(f.annualReturn - f.fee)}</dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <Button onClick={() => setEditing(f)}>Edit</Button>
                {!starter && (
                  <ConfirmAction
                    label="Delete"
                    prompt={`Delete "${f.name}"?`}
                    confirmLabel="Delete"
                    onConfirm={() => remove(f.id)}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted">
        Tip: funds are stored only on this device. Use <strong>Share scenario</strong> on any
        calculator to send a link that includes the funds it uses.
      </p>
      <FundEditor open={editing !== null} initial={editing ?? undefined} onClose={() => setEditing(null)} />
    </>
  );
}
