---
version: 1
slug: "src-pages-retirementcalculator-tsx"
primary_target: "src/pages/RetirementCalculator.tsx"
related_targets: []
---

## Scope
Retirement calculator (`src/pages/RetirementCalculator.tsx`, route `/retirement`). Mode: Operate. Fourth surface of the site redesign, inside the established world (DESIGN.md: Ledger Teal, Inter, cards, a light Fund Line touch), using the sentence pattern of Growth & Fees and Rent vs. Buy.

## Audience and job
People estimating when their investments could cover their spending (FIRE-style, in today's dollars); portfolio reviewers trying a calculator. Success: the visitor leaves with the age they could retire at, what their goal is, and how much a fund's fee moves that age (the cost you can't see). When the goal is never reached, the savings rate it would take to retire by 65.

## User answers (2026-11-16)
- Two sentences: the plan (age, income, spending, savings rate shown) and the money (invested today, a fund pair, withdrawal rate). Exactly two funds, as on Growth & Fees.
- Answer stated as an age ("At 45"); adds an age input (URL state, old links default to 30).
- Keep: net worth chart with the goal line, the savings-rate explorer, the year-by-year table, yearly/monthly entry (as a word in the sentence).
- Withdrawal rate lives in the sentence; inflation goes in the "Also assumed" line with a disclosure.

## Must keep
- The yearly real-terms model (`retirement.ts`), each fund's real return `realRate(return − fee, inflation)`, inflation shared with the other calculators.
- Inputs in the URL (old links decode; `fundIds` with more than two funds keep the first two). Share button removed, as on the other sentence pages.
- Notes that taxes on withdrawals and CPP/OAS / Social Security are not modeled.

## Must not feel like
A form rail with a verdict card; a page foreign to Growth & Fees and Rent vs. Buy.

## Direction contract
THESIS: Your life and your money in two sentences you edit in place, answered by the age you could stop working, and what a fee costs you in years. Refuses the category default of a settings column beside a progress meter.

OWN-WORLD: The site's world unchanged: Ledger Teal for action, each fund in its own library colour (chip dots, chart lines), cool neutrals, Inter with tabular figures, 12px cards, 1px hairlines, Plan Sentence inputs. Fund Line echo: each fund's net-worth line ends in an ink terminus cap where it reaches the goal.

STORY: The visitor reads "I'm 30, and earn $70,000 a year after tax and spend $40,000, saving 43%. / I have $25,000 invested in [fund], compared with [fund], and would live on 4% of it a year.", changes a value, and watches the retirement age answer; the chart shows the climb to the goal and the explorer shows what saving more would do.

FIRST VIEWPORT: (h1 sr-only) a full-width card with the two sentences at 24px; under them the "Also assumed" line (inflation, today's dollars) with an "Edit 1 more assumption" disclosure and a ghost Reset. Then the Answer: "At 45" at Answer size in ink (an age is neither gain nor cost) with its sentence ("is when you could retire, in 13.2 years with Fund A. Your goal is $1,000,000: $40,000 a year at 4%.") and a muted clause comparing the other fund ("With Fund B you'd retire at 47, 2.1 years later."). "Now" when already there; "Never" with the savings rate needed to retire by 65 when the goal is out of reach. Then the net-worth chart by age (3fr) beside the savings-rate explorer (2fr). Primary action: editing a value in the sentence.

FORM: Two-sentence editable plan; seed: none (pinned) by the user's "let's do the Retirement page. I'm liking the two-sentence approach." inside the established world, with the fund pair moved to its own line ("Invest in [A] compared with [B]") so phone chips never start a line with a comma. Code-led from the Rent vs. Buy build; no new sketch round. Signature interaction: any inline value change moves the age, both lines' terminus caps on the goal line and the explorer dot; clicking the explorer sets the savings rate in the sentence. Mobile: the sentence wraps, the answer stacks, chart then explorer then table.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
