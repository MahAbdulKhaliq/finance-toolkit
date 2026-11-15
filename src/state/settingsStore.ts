import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { REGIONS, type RegionCode } from '../lib/region';

export type Theme = 'system' | 'light' | 'dark';

interface SettingsState {
  region: RegionCode;
  theme: Theme;
  /** null = use the region default */
  inflation: number | null;
  realDollars: boolean;
  setRegion: (r: RegionCode) => void;
  setTheme: (t: Theme) => void;
  setInflation: (v: number | null) => void;
  setRealDollars: (v: boolean) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      region: 'CA',
      theme: 'system',
      inflation: null,
      realDollars: false,
      setRegion: (region) => set({ region }),
      setTheme: (theme) => set({ theme }),
      setInflation: (inflation) => set({ inflation }),
      setRealDollars: (realDollars) => set({ realDollars }),
    }),
    { name: 'ft-settings' },
  ),
);

export function useRegion() {
  return REGIONS[useSettings((s) => s.region)];
}

export function useInflation() {
  const region = useRegion();
  const v = useSettings((s) => s.inflation);
  return v ?? region.defaults.inflation;
}
