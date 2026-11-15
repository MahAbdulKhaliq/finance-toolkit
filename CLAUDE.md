# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                                   # Vite dev server on http://localhost:5173
npm test                                      # Vitest, run once (node env, src/**/*.test.ts)
npx vitest run -t "rent vs buy"               # run tests whose name matches
npm run build                                 # tsc -b (strict type-check) then vite build → dist/
npm run preview                               # serve the production build
```

There is no linter configured; `npm run build` is the correctness gate (strict TS with `noUnusedLocals`/`noUnusedParameters`). The local Node is 21.x, which is why Vite is pinned to 6 (Vite 7 does not support Node 21). CI uses Node 22.

## What this is

A static, backend-free personal-finance site for GitHub Pages: four calculators (Growth & Fees / MER comparison, CAGR, Rent vs. Buy, Retirement) tied together by a shared **fund library**. React 18 + TypeScript + Tailwind v4 + Recharts + Zustand + React Router (HashRouter).

Deploy: `.github/workflows/deploy.yml` runs tests + build on push to `main` and publishes `dist/` via `actions/deploy-pages` (repo Settings → Pages → Source must be "GitHub Actions"). `vite.config.ts` uses `base: './'` and routes are hash-based, so the site works under any repo name. Don't switch to BrowserRouter or an absolute base.

## Architecture

**Pure math vs. UI.** All finance logic lives in `src/lib/finance/` as pure, React-free functions with unit tests in `finance.test.ts`, which are checked against known reference values (e.g. US $300k/6%/30y → $1,798.65). Pages call these functions and only handle inputs, formatting and charts. Put any new calculation here, with tests.

- `growth.ts` simulates in steps of max(12, contributions-per-year) per year. The fee is charged pro rata on the balance each step, and a parallel 0%-fee "shadow" balance gives `totalFeeCost` (fees plus the growth they would have earned).
- `retirement.ts` is a yearly FIRE model in **real** terms (today's dollars): goal = expenses / withdrawal rate, return on start-of-year balance, savings added at year end, years interpolated. The page converts each fund to a real return with `realRate(annualReturn − fee, inflation)`.
- `rentVsBuy.ts` is a monthly simulation built on an **equal-cash-outlay** model. The renter starts with the down payment and closing costs invested. Each month, whichever side has lower housing costs invests the difference at the chosen fund's net return (`annualReturn − fee`). Region changes the mechanics: CA uses semi-annual compounding (`mortgage.monthlyRate`), adds the CMHC premium to the loan, and checks minimum-down-payment and $1.5M-cap warnings. US uses monthly compounding, with PMI on the original loan until the balance reaches 78% of the price.

**Global state (Zustand, persisted to localStorage):**
- `state/fundsStore.ts` (`ft-funds`): the fund library. `Fund.fee` and `annualReturn` are **decimals** (0.0025 = 0.25%). Pages refer to funds **by id**; the starter funds have stable ids (`starter-*`) that page defaults depend on.
- `state/settingsStore.ts` (`ft-settings`): region (`CA`/`US`), theme, inflation override (`null` = region default), and the nominal/real-dollars toggle. `index.html` has an inline script that reads `ft-settings` to apply the `dark` class before React mounts, so keep the storage key and shape in sync with it.

**Region config.** `src/lib/region.ts` holds every CA/US difference that isn't mechanical: labels (`feeLabel`, `feeLabelInline` for mid-sentence use), currency/locale, and the defaults for the Rent vs. Buy page. The region toggle never converts the user's numbers. It only changes rules, labels and formatting.

**URL-shareable state.** Each calculator keeps its inputs in `useUrlState(defaults)` (`state/useUrlState.ts`) rather than in component state. Inputs are lz-string-compressed into `?s=` (debounced, `replace: true`). Pages call `useShareFunds(url.setShareFunds, fundsInUse)` so the link embeds the funds it needs. When a link is opened, `useAvailableFunds(url.sharedFunds)` in `components/funds/FundPicker.tsx` merges library funds with funds from the link that aren't in the library, and `<ImportSharedFunds>` offers to add them. When you add an input to a page, add it to that page's `Inputs` interface and `DEFAULTS`. Old links still work because decoding merges onto the defaults.

**Percent and number inputs.** `components/ui.tsx` `NumberField` stores the real value and displays `value × scale`. `PercentField` uses scale 100, so state always holds decimals. It keeps the raw text while focused so partial typing ("1.") isn't clobbered.

**Theming and charts.** Colors are CSS variables in `src/index.css` (`:root` and `.dark`), exposed to Tailwind through `@theme inline` (`bg-surface`, `text-muted`, `border-line`, `text-accent`, …). Dark mode is class-based (`@custom-variant dark`). Recharts SVG attributes get **concrete hex colors** from `useChartTheme()` / `tooltipStyle()` in `state/useTheme.ts`, not `var(--…)`. Today's-dollars display goes through `useDeflator()` in `components/Toolbar.tsx`, which divides a value by `(1+π)^years`.

**Cross-calculator links (keep these working):**
- CAGR "Save as fund" opens `FundEditor` pre-filled with the CAGR as `annualReturn`.
- Growth & Fees uses `FundMultiPicker` and allows per-page fee/return overrides that don't change the library.
- Rent vs. Buy uses `FundSelect` for the renter's investment.
- Both pickers can create a fund inline through `FundEditor` (a native `<dialog>`).

Pages other than Home are lazy-loaded in `src/main.tsx`. The Methodology page (`pages/Methodology.tsx`, route `/methodology`) documents every formula and assumption, so update it when you change calculation behavior.
