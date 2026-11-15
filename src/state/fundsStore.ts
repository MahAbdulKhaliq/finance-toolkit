import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Fund {
  id: string;
  name: string;
  /** Annual fee, decimal (0.0025 = 0.25%). */
  fee: number;
  /** Expected gross annual return, decimal. */
  annualReturn: number;
  color: string;
  notes?: string;
}

export const FUND_COLORS = [
  '#0d9488', '#6366f1', '#e11d48', '#d97706', '#0284c7', '#7c3aed', '#16a34a', '#db2777',
];

export const STARTER_FUNDS: Fund[] = [
  { id: 'starter-mutual', name: 'Big-bank mutual fund', fee: 0.022, annualReturn: 0.07, color: FUND_COLORS[2], notes: 'Typical actively managed balanced fund.' },
  { id: 'starter-index', name: 'Broad index ETF', fee: 0.002, annualReturn: 0.07, color: FUND_COLORS[0], notes: 'Low-cost index tracker.' },
  { id: 'starter-allinone', name: 'All-in-one ETF', fee: 0.0024, annualReturn: 0.068, color: FUND_COLORS[1], notes: 'Globally diversified, auto-rebalanced.' },
  { id: 'starter-robo', name: 'Robo-advisor portfolio', fee: 0.007, annualReturn: 0.068, color: FUND_COLORS[3], notes: 'ETF fees plus management fee.' },
];

export const newId = () => Math.random().toString(36).slice(2, 10);

const STARTER_IDS = new Set(STARTER_FUNDS.map((f) => f.id));

/**
 * Starter funds are permanent: they can't be deleted and only their fee and return
 * (plus color) can be edited. Name and notes stay as shipped.
 */
export const isStarter = (f: Pick<Fund, 'id'>) => STARTER_IDS.has(f.id);

const STARTER_EDITABLE: (keyof Fund)[] = ['fee', 'annualReturn', 'color'];

interface FundsState {
  funds: Fund[];
  add: (f: Omit<Fund, 'id'> & { id?: string }) => Fund;
  update: (id: string, patch: Partial<Fund>) => void;
  remove: (id: string) => void;
  /** Restores starter funds' fee and return to their defaults; custom funds are untouched. */
  resetStarterValues: () => void;
}

export const useFunds = create<FundsState>()(
  persist(
    (set, get) => ({
      funds: STARTER_FUNDS,
      add: (f) => {
        const fund: Fund = { ...f, id: f.id ?? newId() };
        if (get().funds.some((x) => x.id === fund.id)) return fund; // e.g. re-importing a shared starter
        set({ funds: [...get().funds, fund] });
        return fund;
      },
      update: (id, patch) => {
        const allowed = STARTER_IDS.has(id)
          ? Object.fromEntries(Object.entries(patch).filter(([k]) => STARTER_EDITABLE.includes(k as keyof Fund)))
          : patch;
        set({ funds: get().funds.map((f) => (f.id === id ? { ...f, ...allowed, id } : f)) });
      },
      remove: (id) => {
        if (STARTER_IDS.has(id)) return;
        set({ funds: get().funds.filter((f) => f.id !== id) });
      },
      resetStarterValues: () =>
        set({
          funds: get().funds.map((f) => {
            const s = STARTER_FUNDS.find((x) => x.id === f.id);
            return s ? { ...f, fee: s.fee, annualReturn: s.annualReturn } : f;
          }),
        }),
    }),
    {
      name: 'ft-funds',
      // Saved libraries from before starters were protected may be missing some, or have
      // renamed ones: put back any missing starters and restore their name and notes.
      merge: (persisted, current) => {
        const saved = ((persisted as Partial<FundsState> | undefined)?.funds ?? []) as Fund[];
        const restored = STARTER_FUNDS.map((s) => {
          const mine = saved.find((f) => f.id === s.id);
          return mine ? { ...mine, name: s.name, notes: s.notes } : s;
        });
        return { ...current, funds: [...restored, ...saved.filter((f) => !STARTER_IDS.has(f.id))] };
      },
    },
  ),
);

export function nextColor(funds: Fund[]): string {
  const used = new Set(funds.map((f) => f.color));
  return FUND_COLORS.find((c) => !used.has(c)) ?? FUND_COLORS[funds.length % FUND_COLORS.length];
}
