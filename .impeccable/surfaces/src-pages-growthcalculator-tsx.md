---
version: 1
slug: "src-pages-growthcalculator-tsx"
primary_target: "src/pages/GrowthCalculator.tsx"
related_targets: []
---

## Scope
Growth & Fees calculator (`src/pages/GrowthCalculator.tsx`, route `/growth`). Mode: Operate. Second surface of the site redesign, inside the established world (DESIGN.md: Ledger Teal, Inter, cards, a light Fund Line touch).

## Audience and job
People comparing funds on fees; portfolio reviewers trying a calculator. Success: the visitor leaves with the fee-gap number (how much more the cheaper fund leaves after N years) and why it is that large.

## Must keep
- Per-page fee/return overrides that don't change the library.
- The fees-paid vs. lost-growth split.
- The year-by-year table (also the non-chart reading).
- The nominal / today's-dollars switch.
- Inputs stay in the URL (old links still decode). The Share button is removed at the user's request.

## Must not feel like
A form with a chart bolted on; a page foreign to the rest of the site.

## Direction contract
THESIS: Your plan is one sentence you edit in place, and the answer is the sentence under it. Refuses the category default of a labelled form rail beside stat cards.

OWN-WORLD: The site's world unchanged: Ledger Teal accent on cool neutrals, Inter with tabular figures, 12px cards, 1px hairlines. Fund Line touch: a station strip under the nav with Growth & Fees lit, and fund lines in the chart drawn thick with ink terminus caps.

STORY: The visitor reads their plan as a sentence, changes a value inside it, and watches the gap number answer; the chart and the fees breakdown explain why.

FIRST VIEWPORT: Station strip; a full-width card holding the plan sentence at about 24px with each value an inline input, and a second line "Compare [fund chip] with [fund chip] + Add a fund"; under it a Reset action and the overrides note; then the gap number at display size (about 64px, gain green) with its answer sentence; then the balance chart (wide) beside "What fees cost you" (stacked fees-paid / lost-growth bars per fund). Primary action: editing a value in the sentence.

FORM: Editable-sentence calculator, position 4 on the ordered grounded list. seed:d8822dd602f71865. Code-led; the chosen sketch is `.impeccable/mocks/decision/sentence.html`. Signature interaction: the gap number and its bracket on the chart update as any inline value changes; chart fund lines end in terminus caps with a "gap" bracket between best and worst at the final year. Mobile: the sentence wraps naturally, the panels stack, the chart leads the breakdown.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
