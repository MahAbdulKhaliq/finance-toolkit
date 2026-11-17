---
version: 1
slug: "src-pages-cagrcalculator-tsx"
primary_target: "src/pages/CagrCalculator.tsx"
related_targets: ["src/components/PlanSentence.tsx"]
---

## Scope
CAGR calculator (`src/pages/CagrCalculator.tsx`, route `/cagr`). Mode: Operate. Fourth and last calculator in the sentence-page redesign, inside the established world (DESIGN.md), beside Growth & Fees, Rent vs. Buy and Retirement.

## Audience and job
People turning a past result ("my $10,000 became $25,000 in 10 years") into a steady yearly rate, or solving for the end value, start value or time at a rate; portfolio reviewers. Success: the visitor leaves with the rate (or the solved value), knows what it is after inflation and in total, and can save the rate as a fund for the other calculators in one click.

## User answers (2026-11-16)
- One sentence, any blank: "[$10,000] grew to [$25,000] over [10] years, at [7%] a year." A "Solve for" word at the start picks which value is the answer; that value shows in ink where its input was. All four modes stay.
- Compare becomes more sentence lines in the card ("[Bond index] grew from [$10,000] to [$12,200] over [10] years: 2.01%") with "+ Compare with another investment"; the separate tab goes. A ranked list gives each line's CAGR.
- Keep: the growth path chart, the after-inflation rate, total growth, the date-range option ("over N years" ↔ "between [date] and [date]").
- "Save as a fund" is the page's primary teal button, under the answer.

## Must keep
- `cagr.ts` maths; Save opens `FundEditor` pre-filled with the rate (cross-calculator link).
- Inputs in the URL; old links decode (old Compare-view links show their rows as compare lines). Share button removed, as on the other sentence pages.

## Must not feel like
A form with a mode switch above it; a spreadsheet of rows.

## Direction contract
THESIS: What really happened to your money, written as one sentence where any value can be the unknown, answered by the steady rate that explains it. Refuses the category default of a mode tab bar over a stack of labelled fields.

OWN-WORLD: The site's world unchanged: Ledger Teal for action (the Save button, Solve-for word), each investment in its own fund colour (line dots, chart lines), cool neutrals, Inter tabular, 12px cards, 1px hairlines, Plan Sentence inputs, the solved value set in ink at 700 with a teal underline where its input would be. Fund Line echo: the growth path ends in an ink terminus cap at the end value.

STORY: The visitor reads "Solve for the growth rate. $10,000 grew to $25,000 over 10 years, at 9.60% a year.", edits a value, sees "9.60%" answer with what it means after inflation and in total, and saves it as a fund; or adds a second line to rank two investments.

FIRST VIEWPORT: (h1 sr-only) a full-width card: "Solve for the [growth rate ▾]." then the investment sentence with its colour dot, then any compare lines, then "+ Compare with another investment"; a footer with the Also-assumed inflation line, its disclosure and a ghost Reset. Then the Answer: the solved value at Answer size in ink with its sentence ("a year, compounded, takes $10,000 to $25,000 in 10 years. That's +150% in total, or 7.45% a year after 2% inflation.") and the primary "Save 9.60% as a fund" button. Then the growth chart (full width alone; 3fr beside a 2fr ranked list when comparing).

FORM: One sentence with a movable blank; seed: none (pinned) by the user's answers ("One sentence, any blank", "Lines in the sentence card") inside the established sentence-page world. Code-led. Signature interaction: changing the Solve-for word swaps which value is the boxed input and which is the inked answer, carrying the current numbers over so nothing jumps. Mobile: the sentence wraps, compare lines stack, the answer and button stack, chart then ranking.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
