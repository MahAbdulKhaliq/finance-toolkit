/** Converts a future nominal amount into today's dollars. */
export function toReal(nominal: number, inflation: number, years: number): number {
  return nominal / Math.pow(1 + inflation, years);
}

/** Real rate of return via the Fisher equation. */
export function realRate(nominalRate: number, inflation: number): number {
  return (1 + nominalRate) / (1 + inflation) - 1;
}
