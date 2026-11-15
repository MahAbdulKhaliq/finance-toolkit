import { useState } from 'react';
import { useFunds, type Fund } from '../state/fundsStore';
import { useRegion } from '../state/settingsStore';
import { pct } from '../lib/format';
import { FundEditor, type FundDraft } from '../components/funds/FundEditor';
import { Button, Card, PageHeader } from '../components/ui';

export default function FundsPage() {
  const { funds, remove, resetToStarters } = useFunds();
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
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('Replace your library with the starter funds? Your custom funds will be removed.')) resetToStarters();
              }}
            >
              Restore starter funds
            </Button>
            <Button variant="primary" onClick={() => setEditing({})}>+ New fund</Button>
          </>
        }
      />

      {funds.length === 0 ? (
        <Card className="text-center text-muted">No funds yet. Create one to get started.</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {funds.map((f: Fund) => (
            <Card key={f.id} className="flex flex-col">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: f.color }} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold">{f.name}</h3>
                  {f.notes && <p className="mt-0.5 text-sm text-muted">{f.notes}</p>}
                </div>
              </div>
              <dl className="tabular mt-4 grid grid-cols-3 gap-2 text-sm">
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
              <div className="mt-4 flex gap-2 border-t border-line pt-3">
                <Button onClick={() => setEditing(f)}>Edit</Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm(`Delete "${f.name}"?`)) remove(f.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <p className="mt-6 text-sm text-muted">
        Tip: funds are stored only on this device. Use <strong>Share scenario</strong> on any
        calculator to send a link that includes the funds it uses.
      </p>
      <FundEditor open={editing !== null} initial={editing ?? undefined} onClose={() => setEditing(null)} />
    </>
  );
}
