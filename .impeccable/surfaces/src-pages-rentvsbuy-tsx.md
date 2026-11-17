---
version: 1
slug: "src-pages-rentvsbuy-tsx"
primary_target: "src/pages/RentVsBuy.tsx"
related_targets: []
---

## Scope
Rent vs. Buy calculator (`src/pages/RentVsBuy.tsx`, route `/rent-vs-buy`). Mode: Operate. Third surface of the site redesign, inside the established world (DESIGN.md: Ledger Teal, Inter, cards, a light Fund Line touch).

## Audience and job
People deciding whether to buy a home or keep renting and investing; portfolio reviewers trying a calculator. Success: the visitor leaves with the break-even year (when buying catches up) set against how long they plan to stay, and, when buying never catches up, what it would take (the home-price growth that makes it break even by their move-out year).

## Must keep
- Equal-cash-outlay model, CA/US mechanics (CMHC, PMI, semi-annual compounding), region warnings.
- Stat tiles (monthly mortgage, cash upfront, CMHC/PMI, year-1 unrecoverable costs).
- "Money you don't get back" cost bars; the appreciation x return sensitivity grid; the year-by-year table.
- Nominal / today's-dollars switch. Inputs stay in the URL (old links still decode). Share button removed (as on Growth & Fees).
- All 17 inputs remain editable: six main ones up front, the rest in an assumptions disclosure.

## Must not feel like
A long form rail with a chart bolted on; a page foreign to Growth & Fees.

## Direction contract
THESIS: Two ways to live, written as two sentences you edit in place, answered by the year one overtakes the other. Refuses the category default of a 17-field form rail beside a verdict card.

OWN-WORLD: The site's world unchanged: Ledger Teal marks the buy path and action, Rent Indigo the rent path, cool neutrals, Inter with tabular figures, 12px cards, 1px hairlines, Plan Sentence inputs. Fund Line echo: chart lines end in ink terminus caps at the move-out year.

STORY: The visitor reads "Buy a $750,000 home… / Or rent for $2,800 a month… / I'd stay 10 years", changes a value, and watches the break-even year answer; the chart, cost tiles, sensitivity grid and cost bars explain why.

FIRST VIEWPORT: (h1 sr-only) a full-width card with the two-path sentence at 24px: a teal-dot buy line (price, down %, rate, amortization, appreciation), an indigo-dot rent line (rent, rent increase, fund chip naming its net return), and "I'd stay N years". Under it a muted one-line summary of the other assumptions with an "N more assumptions" disclosure and a ghost Reset. Then the Answer: "Year 7" at Answer size in ink with its sentence ("is when buying breaks even. Staying 10 years, buying leaves you $31,556 ahead.", gap in gain green) and a muted clause on what would flip it; when buying never catches up in 40 years, "40+ years" and the appreciation it would take. Then the net-worth chart (3fr) beside a "Cost of buying" card of four tiles and a break-even-year sensitivity grid (2fr). Primary action: editing a value in the sentence.

FORM: Two-path editable sentence, position 1 on the ordered grounded list (the user switched from the dealt lead). seed:25559b56d75d3323. Code-led; the chosen sketch is `.impeccable/mocks/decision/sentence-rvb.html`. Signature interaction: any inline value change moves the break-even year, the break-even dot on the chart and the move-out caps; when break-even falls after the stay, the chart extends past it and marks "You move out" with a dashed line. Mobile: the sentence wraps naturally, the answer stacks, chart then tiles then grid.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
