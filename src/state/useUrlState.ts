import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import type { Fund } from './fundsStore';

export interface SharedPayload<T> {
  v: 1;
  inputs: T;
  funds?: Fund[];
}

export function decodePayload<T>(s: string | null): SharedPayload<T> | null {
  if (!s) return null;
  try {
    const json = decompressFromEncodedURIComponent(s);
    if (!json) return null;
    const p = JSON.parse(json) as SharedPayload<T>;
    return p && p.v === 1 && typeof p.inputs === 'object' ? p : null;
  } catch {
    return null;
  }
}

export function encodePayload<T>(p: SharedPayload<T>): string {
  return compressToEncodedURIComponent(JSON.stringify(p));
}

/**
 * Calculator inputs that live in the URL (?s=…) so any scenario can be bookmarked or shared.
 * Initial state comes from the URL if present, else from `defaults`. Call `useShareFunds` with
 * the funds the scenario uses so the link also works for someone with a different library.
 */
export function useUrlState<T extends object>(defaults: T) {
  const [params, setParams] = useSearchParams();
  const initial = useRef(decodePayload<T>(params.get('s')));
  const [inputs, setInputs] = useState<T>(() => ({ ...defaults, ...(initial.current?.inputs ?? {}) }));
  const [shareFunds, setShareFunds] = useState<string>('[]'); // JSON, for cheap equality
  const sharedFunds = initial.current?.funds ?? [];

  useEffect(() => {
    const t = setTimeout(() => {
      const payload: SharedPayload<T> = { v: 1, inputs };
      const f = JSON.parse(shareFunds) as Fund[];
      if (f.length) payload.funds = f;
      const s = encodePayload(payload);
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('s', s);
          return next;
        },
        { replace: true },
      );
    }, 300);
    return () => clearTimeout(t);
  }, [inputs, shareFunds, setParams]);

  const update = (patch: Partial<T>) => setInputs((prev) => ({ ...prev, ...patch }));
  const reset = () => setInputs(defaults);

  return { inputs, update, reset, sharedFunds, setShareFunds };
}

/** Embeds the given funds in the share link whenever they change. */
export function useShareFunds(setShareFunds: (json: string) => void, funds: Fund[]) {
  const key = JSON.stringify(funds);
  useEffect(() => {
    setShareFunds(key);
  }, [key, setShareFunds]);
}
