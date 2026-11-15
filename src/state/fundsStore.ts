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

interface FundsState {
  funds: Fund[];
  add: (f: Omit<Fund, 'id'> & { id?: string }) => Fund;
  update: (id: string, patch: Partial<Fund>) => void;
  remove: (id: string) => void;
  resetToStarters: () => void;
}

export const useFunds = create<FundsState>()(
  persist(
    (set, get) => ({
      funds: STARTER_FUNDS,
      add: (f) => {
        const fund: Fund = { ...f, id: f.id ?? newId() };
        set({ funds: [...get().funds, fund] });
        return fund;
      },
      update: (id, patch) =>
        set({ funds: get().funds.map((f) => (f.id === id ? { ...f, ...patch } : f)) }),
      remove: (id) => set({ funds: get().funds.filter((f) => f.id !== id) }),
      resetToStarters: () => set({ funds: STARTER_FUNDS }),
    }),
    { name: 'ft-funds' },
  ),
);

export function nextColor(funds: Fund[]): string {
  const used = new Set(funds.map((f) => f.color));
  return FUND_COLORS.find((c) => !used.has(c)) ?? FUND_COLORS[funds.length % FUND_COLORS.length];
}
