---
name: Finance Toolkit
description: Four connected calculators that make the long-term cost of everyday money decisions visible.
colors:
  ledger-teal: "#0f766e"
  ledger-teal-soft: "#ccfbf1"
  ledger-teal-ink: "#ffffff"
  ledger-teal-dark: "#2dd4bf"
  ledger-teal-soft-dark: "#134e4a"
  ledger-teal-ink-dark: "#04201d"
  rent-indigo: "#6366f1"
  rent-indigo-dark: "#818cf8"
  gain-green: "#15803d"
  gain-green-dark: "#4ade80"
  cost-rose: "#be123c"
  cost-rose-dark: "#fb7185"
  caution-amber-bg: "#fef3c7"
  caution-amber-ink: "#92400e"
  caution-amber-bg-dark: "#422006"
  caution-amber-ink-dark: "#fcd34d"
  morning-paper: "#f6f7f9"
  surface-white: "#ffffff"
  surface-mist: "#f1f3f6"
  hairline: "#e3e6eb"
  chart-grid: "#e5e7eb"
  scroll-thumb: "#c5cbd3"
  scroll-thumb-hover: "#8e98a5"
  ink: "#14171c"
  slate-muted: "#5d6673"
  night-ground: "#0d1014"
  night-surface: "#151a20"
  night-surface-2: "#1c232b"
  night-hairline: "#2a323c"
  night-grid: "#262e38"
  night-scroll-thumb: "#3a444f"
  night-scroll-thumb-hover: "#5b6775"
  night-ink: "#e8ecf1"
  night-muted: "#98a2b0"
typography:
  display:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  display-home:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  station:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.025em"
  answer:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  plan-sentence:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 2
  headline:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  figure:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    fontFeature: "tnum"
  body:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "'Inter Variable', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ledger-teal}"
    textColor: "{colors.ledger-teal-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-mist}"
  button-ghost:
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  button-danger:
    textColor: "{colors.cost-rose}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  input:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.xl}"
    padding: "20px"
  stat-tile:
    backgroundColor: "{colors.surface-mist}"
    rounded: "{rounded.lg}"
    padding: "12px"
  nav-link:
    textColor: "{colors.slate-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  nav-link-active:
    backgroundColor: "{colors.ledger-teal-soft}"
    textColor: "{colors.ink}"
  fund-chip:
    textColor: "{colors.slate-muted}"
    rounded: "{rounded.2xl}"
    padding: "6px 12px"
  fund-chip-selected:
    backgroundColor: "{colors.ledger-teal-soft}"
    textColor: "{colors.ink}"
  start-here-badge:
    backgroundColor: "{colors.ledger-teal}"
    textColor: "{colors.ledger-teal-ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  station-label:
    textColor: "{colors.ink}"
    typography: "{typography.station}"
  inline-input:
    backgroundColor: "{colors.surface-mist}"
    textColor: "{colors.ink}"
    typography: "{typography.plan-sentence}"
    rounded: "{rounded.lg}"
    padding: "0 8px"
  sentence-fund-pill:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 12px"
  answer-figure:
    textColor: "{colors.gain-green}"
    typography: "{typography.answer}"
  answer-figure-year:
    textColor: "{colors.ink}"
    typography: "{typography.answer}"
  answer-figure-age:
    textColor: "{colors.ink}"
    typography: "{typography.answer}"
  sensitivity-cell:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "4px 8px"
  notice:
    backgroundColor: "{colors.caution-amber-bg}"
    textColor: "{colors.caution-amber-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
---

# Design System: Finance Toolkit

## Overview

**Creative North Star: "The Long View"**

Finance Toolkit is about decades, not days. Its visual system is built so a small number, such as a 0.2% fee, can be followed patiently out to its 30-year consequence. The interface stays calm and out of the way: cool paper-grey ground, white surfaces with hairline borders, one teal accent, and type that steps back so the figures and the curves carry the page. Nothing pulses, nothing shouts. Emphasis comes from the outcome sentence and the chart, never from decoration.

Density is that of a working tool. On all four calculators (Growth & Fees, CAGR, Rent vs. Buy, Retirement) the inputs are an editable sentence at the top with results below. Surfaces are flat at rest and respond to intent: interactive cards lift slightly, controls shift tone on hover, and the focused field gains a teal ring. Light and dark themes are equal citizens. Dark mode is a deep blue-black night ground, not an inverted afterthought, and every token has a counterpart in both.

The mood is calm, patient and clear. Components feel calm and tactile: restrained at rest, with a gentle physical response when you reach for them.

Home is where the long view is drawn literally. It is **the Fund Line**: the fund library as one bold Ledger Teal transit line, each calculator a ring station on it, and My Funds the pill interchange where every fund boards. The page gets louder type and heavier strokes than the calculators, but the same palette, the same single accent and the same calm motion. It is the one place the system draws its own flow.

Calculators echo the line at instrument size, and only in their charts. Growth & Fees is laid out as a **Plan Sentence**: the plan is one sentence with its values as inline inputs, and the answer is a single large gain-green number under it. Rent vs. Buy uses the same pattern as a **Two-Path Sentence**: two sentences, one per way to live (buy, or rent and invest), plus how long you'd stay, answered by the year buying breaks even. Retirement is the third Plan Sentence: your age, income, spending and savings, then the pair of funds, answered by the age you could retire. CAGR is the fourth: what an investment grew from and to over a span, where any one value can be the unknown, answered by the solved value. All four charts borrow the map's ink terminus caps. The voice stays at calculator weight (700 and below).

**Key Characteristics:**
- One accent (Ledger Teal) on a cool neutral ground; colour elsewhere means data or meaning (gain, cost, caution, a fund's identity).
- Tabular numerals for every figure, so columns of money line up and changes are easy to compare.
- Flat bordered surfaces at rest; lift and shadow only on intent or overlay.
- Soft, consistent corners (8px controls, 12px containers, pill-like chips).
- Paired light and dark palettes with matching roles; charts take concrete hex values from the same palette.
- On Home, a transit-map diagram (teal line, ink ring stations, pill interchange, fund-coloured branch lines) that maps the product's real flow; calculators echo it only with terminus-capped chart lines.
- On every calculator (Growth & Fees, CAGR, Rent vs. Buy, Retirement), an editable plan sentence in place of a labelled form rail, answered by one display-size figure.

## Colors

A cool, low-chroma neutral system with one teal voice, plus a small set of semantic and data colours that always mean something.

### Primary
- **Ledger Teal** (`ledger-teal`; `ledger-teal-dark` in dark mode): the single interactive accent. Primary buttons, the logo tile, focus rings and focused input borders, links, numbered step badges, the selected chip border, and the "Buy" or first-fund series in charts. On Home it is the Fund Line itself, the lit station segment and ring fill, the hover underline on station names, and the "Start here" badge. Text on it uses `ledger-teal-ink` / `ledger-teal-ink-dark`.
- **Ledger Teal Soft** (`ledger-teal-soft`; `ledger-teal-soft-dark`): the selected-state wash. Active nav link and selected fund chips.

### Secondary
- **Rent Indigo** (`rent-indigo`; `rent-indigo-dark`; CSS `--rent`, Tailwind `rent`): the counter-voice to teal in comparisons. The "Rent + invest" line, the Rent bar, and the path dot that starts the rent line of the Two-Path Sentence in Rent vs. Buy (the buy line's dot is Ledger Teal), and the second default fund colour. Use it only where two options are being weighed against each other.

### Tertiary (semantic)
- **Gain Green** (`gain-green`; `gain-green-dark`): favourable figures, such as the amount one fund ends up ahead. On Growth & Fees it is the Answer figure (the fee gap, money you keep) and the chart's gap bracket and label (`series.gain`).
- **Cost Rose** (`cost-rose`; `cost-rose-dark`): costs and losses, such as fees paid, total cost of fees, and destructive actions (the danger button).
- **Caution Amber** (`caution-amber-bg` / `caution-amber-ink`, plus dark pair): notices and sanity warnings (shared-fund import, unusual inputs, CMHC/price-cap warnings). Always as a tinted panel with dark ink, never as a bright fill.

### Neutral
- **Morning Paper** (`morning-paper`) / **Night Ground** (`night-ground`): the page background.
- **Surface White** (`surface-white`) / **Night Surface** (`night-surface`): cards, inputs, header (at 90% with backdrop blur), table header.
- **Surface Mist** (`surface-mist`) / **Night Surface 2** (`night-surface-2`): second tonal layer. Stat tiles (at 50%), segmented-control track, hover fills, zebra table rows (at 40%), disabled inputs.
- **Hairline** (`hairline`) / **Night Hairline** (`night-hairline`): every border and divider.
- **Ink** (`ink`) / **Night Ink** (`night-ink`): primary text.
- **Slate Muted** (`slate-muted`) / **Night Muted** (`night-muted`): secondary text, intros, hints, units, inactive nav and chip text, chart axes.
- **Chart Grid** (`chart-grid`) / **Night Grid** (`night-grid`): chart gridlines only.
- **Scroll Thumb** (`scroll-thumb`, hover `scroll-thumb-hover`) / **Night Scroll Thumb** (`night-scroll-thumb`, hover `night-scroll-thumb-hover`): scrollbar thumbs only.

### Data palette
Funds carry their own identity colour, chosen from a fixed set of eight in `src/state/fundsStore.ts` (teal 600, indigo, rose, amber, sky, violet, green, pink). A fund's colour is stored with the fund, so it is the same in both themes; all eight keep at least 3:1 against the surface in both. Fixed chart series (buy, rent, cost, lost growth, mortgage insurance, the Rent vs. Buy cost categories, the "contributed" reference line) live in `useChartTheme().series` / `.muted` in `src/state/useTheme.ts` as light/dark pairs with at least 3:1 against their surface; pages never write a chart hex literal. There are no fee-breakdown series: the Growth & Fees yearly fee bars draw each fund's fee layers as tints of that fund's own colour (see Charts). `series.gain` (`#15803d` / `#4ade80`) mirrors Gain Green for the gap bracket. `series.maintenance` is olive (`#4d7c0f` / `#a3e635`), chosen to stay clear of Rent Indigo so the maintenance layer of the Buy cost bar never reads as rent; a new Rent vs. Buy cost series must likewise keep its distance from both teal and indigo. These are data colours, not UI colours: they appear as swatch dots, chart lines and bars, and on Home as each fund's branch line and legend swatch, never as button or surface fills. Legend and marker labels are set in ink, not in the series colour, because several data colours fall below 4.5:1 as text.

### Named Rules
**The One Voice Rule.** Ledger Teal is the only colour that signals "you can act here." Data and semantic colours never appear on buttons, links or nav. On the Fund Line, the fund branch lines are data (which funds you have), never the hover or focus signal; a station lights in teal whatever funds feed it.

**The Meaning-Only Rule.** Green, rose and amber are reserved for gain, cost and caution. A number turns green or rose only because of what it means, never for emphasis. Rose marks the cost figures as text (fees paid, lost growth, total fee cost); it never fills a chart part. A per-fund stacked bar may show its fee layers as tints of that fund's own colour (fees paid and lost growth as fainter layers above the balance), because those layers belong to that fund; it never borrows another fund's colour or a second semantic colour for them.

**The Twin Palette Rule.** Every colour role has a light and a dark value with the same meaning. A new colour isn't done until both exist; Recharts gets the concrete hex values through `useChartTheme()`, not CSS variables.

## Typography

**Body Font:** Inter Variable, self-hosted (with ui-sans-serif, system-ui, Segoe UI, Roboto fallback)

**Character:** One neutral sans for everything, carried by weight and size rather than by a second family. Inter Variable is self-hosted from the `@fontsource-variable/inter` package (imported in `src/main.tsx`, `font-display: swap`, split by script so visitors download only the latin file, about 48 kB). No font is fetched from a third party, which keeps the "nothing is sent anywhere" promise. The system fonts after it in the stack are only a fallback while it loads.

### Hierarchy
- **Display** (700, 3rem from 640px up, 1.875rem below; tight tracking): the display step for any non-Home hero line. Calculators never use it; they top out at Headline.
- **Home Display** (`display-home`: 800, 3.75rem at 1024px up and 4.5rem from 1280px; on the stop list 2.25rem, 3.75rem from 640px; 0.95 leading, -0.03em tracking): the Home headline only. A deliberate Home-scoped exception, so the Fund Line's heavy station names have a headline above them; it does not change the calculators' type.
- **Station** (`station`: 800, 1.5rem, leading 1, tight tracking): station names on the Fund Line and the stop list. The map's interchange name ("My Funds") steps up to 1.875rem. The "how it works" heading is 1.5rem at 800 and its stop titles 1.125rem at 800, the same Home voice.
- **Answer** (`answer`: 700, 3.75rem from 640px up, 3rem below; leading 1, -0.03em tracking, tabular): the one result figure on a Plan Sentence page, with its answer sentence beside it at 1.25rem (1.125rem on phones, max 26em on Growth & Fees, 30em on Rent vs. Buy and Retirement). The largest calculator type, still at 700. On Growth & Fees it is the fee gap, coloured by the Meaning-Only Rule. On Rent vs. Buy it is a year ("Year 7", or "40+ years" when buying never catches up within the 40-year horizon) and stays in ink, because a year is neither gain nor cost (`answer-figure-year`); the dollar gap inside its sentence carries Gain Green, and the sentence ends in a muted clause on what would flip the answer (the home-price growth at which it changes by the move-out year). On Retirement it is an age ("At 49", "Now", or "Never" when the goal isn't reached by 100), also in ink for the same reason (`answer-figure-age`). On CAGR it is the solved value (a rate, a dollar amount or a number of years), in ink, with its sentence at max 30em ending in a muted tail on total growth and the after-inflation rate. Ages round down. Its sentence names the years to go, the fund, and the goal in bold with how it was worked out ("$40,000 a year at 4%", spending in the period the plan uses and the withdrawal rate as typed), then a muted clause on the other fund whose difference is bold in Cost Rose when later and Gain Green when sooner. "Never" instead ends in a muted clause giving the savings rate that would retire you by 65.
- **Plan Sentence** (`plan-sentence`: 500, 1.5rem from 640px up, 1.125rem below; leading 2 so inline inputs fit between lines, 1.9 on phones on Rent vs. Buy and Retirement; muted text, input values in ink at 600): the editable plan sentence. A value the sentence works out rather than asks for (Retirement's savings rate) is set like an input value, tabular in ink at 600, but with no box.
- **Headline** (700, 1.875rem from 640px up, 1.5rem below; tight tracking): one page title per calculator (`PageHeader`). A Plan Sentence page keeps an `sr-only` h1 instead, so the sentence leads the page.
- **Title** (600, 1rem): card titles. Section headings step up to 1.125rem.
- **Figure** (600, 1.25rem, tabular numerals): stat-tile values. Coloured by the Meaning-Only Rule.
- **Body** (400, 0.875rem): inputs, buttons, nav, tables, explanatory text. Page intros run at the base size (1rem, muted); the Home lede is 1.125rem. Every paragraph is capped at 34em (about 75 characters of Inter) with `text-wrap: pretty` (a base rule in `src/index.css`).
- **Label** (500, 0.75rem): stat labels, field hints, chip metadata, the footer disclaimer. Field labels use 0.875rem at 500.

### Named Rules
**The Tabular Rule.** Every number a user compares (inputs, stat values, tables, chip metadata) uses tabular numerals (`.tabular`). Proportional digits in a money column are a bug. Gotcha: `tnum` also widens Inter's hyphen, so prose that shares a line with tabular figures (e.g. "of the no-fee balance") is wrapped in `normal-nums`.

**The Home Weight Rule.** Weight 800 belongs to Home: the headline, station names and the "how it works" stops. Calculator pages stay at 700 and below, so the tools read as calm instruments under a bolder front door. The Answer figure is 700.

**The Sentence Lead Rule.** The headline result is written as a plain sentence ("After 30 years, X ends up $209,821 ahead of Y.") at 1.125rem in its own card, with only the fund names and the key figure in bold. Lead with the consequence in words; tiles and charts follow. On a Plan Sentence page the plan itself is the sentence, and the answer leads with its figure at Answer size, followed by a 1.25rem sentence with the fund names in bold.

## Layout

A centred container (max 1280px) with a 16px side gutter, a sticky header and a muted footer disclaimer. Calculator pages use a two-column grid from 1024px up: a fixed ~22rem input column on the left and a fluid results column on the right (20px gap). Below 1024px everything stacks, inputs first. Within cards, fields sit in a 2-column grid with 12px gaps, and stat tiles reflow from 2 to 3 columns as width allows.

Spacing follows a 4px base: 12px between fields and tiles, 16–20px card padding (16px on phones, 20px from 640px up), 24px below page headers, 56px between Home sections. The header never scrolls or wraps: from 640px up it holds three items, and below that a menu button opens the side nav. Long fund names and notes wrap anywhere rather than overflowing. The layout must reflow cleanly to 375px.

Home has its own layout. From 1024px up it is a transit map: one section with a fixed 1200:620 aspect ratio, SVG geometry in a 1200 × 620 coordinate space for the lines, rings and caps, and real HTML labels positioned over it by percentage (`left: x/1200`, `top: y/620`), so text stays at reading size and every station is an ordinary link. The headline and lede sit top-left (max 33rem), the fund legend sits in the empty lower-right band (20rem wide). Below 1024px the map becomes a vertical stop list down the page. The "how it works" section is a three-stop line under a hairline rule: a horizontal teal bar across a three-column grid from 640px up, and the same vertical bar and ring stops on phones.

Growth & Fees uses the **Plan Sentence** layout instead of the two-column grid, with an `sr-only` h1 so the sentence leads (the header nav already lists the calculators): a full-width card holding the plan sentence and a second line of exactly two fund pills ("Compare [fund] with [fund]"; the page measures one gap, so it compares one pair), either of which opens a panel inside the card with a fund select per slot (including "+ New fund…") and per-fund fee/return overrides, where choosing the fund already in the other slot swaps the two; a muted overrides note with a ghost Reset under it; the Answer figure and sentence (ending in a muted clause on where the gap comes from, e.g. "46% comes from the MER difference and 54% from the return difference."); a grid of the balance chart beside the "After N years" summary table (3fr / 2fr from 1280px up, stacked below with the chart first); the full-width "What fees take, year by year" bar chart card; and the year table in a collapsed `Details` (fund-swatched headers, plus a Gap column with the absolute difference between the two balances). This page has no Share button (removed at the user's request); its inputs still live in the URL.

Rent vs. Buy uses the same layout as a **Two-Path Sentence**, again with an `sr-only` h1. A full-width plan card (24px padding from 640px up) holds three sentence lines: a teal-dot buy line (price, down %, mortgage rate, amortization, appreciation), an indigo-dot rent line (rent, rent increase, and the fund chip naming its net return, e.g. "6.56% after MER", which opens a panel inside the card with the fund select and a ghost Done), and "I'd stay N years." A hairline footer row under the sentence carries a muted "Also assumed:" summary of the other assumptions (each item kept on one line with `nowrap`, separated by middots), an "Edit N more assumptions" disclosure in teal with a chevron (it opens a 2-column grid of ordinary fields, 4 columns from 1024px up, and hides the summary while open), and a ghost "Reset to Canadian/US defaults" pushed right from 640px up. Region warnings follow the card as Notices. Then the Answer row (stacked with an 8px gap below 1024px, a row with a 20px gap from 1024px up); a grid of the net-worth chart beside the "Cost of buying" card (3fr / 2fr from 1280px up, stacked below with the chart first), where the card holds four stat tiles in two columns and the "What would change the answer?" sensitivity grid; the full-width "Money you don't get back" card of horizontal stacked bars, with both totals as text in its intro and an HTML legend that names each category's short value; and the year table in a collapsed `Details`. Like Growth & Fees it has no Share button; inputs stay in the URL.

Retirement is the third **Plan Sentence** page, again with an `sr-only` h1. A full-width plan card (24px padding from 640px up) holds three lines: "I'm [age], and earn [$income] [a year/a month] after tax and spend [$spending], saving 43%." (the savings rate is derived; when spending exceeds income the clause becomes "[$X] more than I earn" with the amount in Cost Rose); "I have [$invested] invested and would live on [4%] of it a year."; and "Invest in [fund] compared with [fund]". The fund pair has its own line with no punctuation beside the chips, because on phones each chip takes a full line and a comma would start the next one. Each chip names the fund's real return ("4.71% real"); either one opens a panel inside the card with two fund selects ("Invested in", "Compared with") and a ghost Done, where choosing the other slot's fund swaps the two. It always compares exactly two funds. The hairline footer row reads "Also assumed: inflation 2.00% · income and spending rise with it, so everything is in today's dollars", with the same teal "Edit 1 more assumption" disclosure (the shared inflation field) and a ghost Reset. Then the Answer row, laid out as on Rent vs. Buy, with a visually hidden one-line live region announcing the result (the visible answer is not a live region); a grid of "Net worth until retirement" beside "What if you saved more?" (3fr / 2fr from 1280px up, stacked below with the net-worth chart first); the year table in a collapsed `Details` with an Age column; and a muted 0.75rem footnote on what isn't modelled. No Share button; inputs stay in the URL.

CAGR is the fourth and last sentence page, again with an `sr-only` h1. A full-width plan card (24px padding from 640px up) opens with "Solve for the [growth rate ▾]." (growth rate, end value, start value or time needed). The investment line follows: a 12px colour dot in its line colour, an editable name (`InlineText`), then "grew from [$start] to [$end] [over ▾] [N] years, at [rate] a year." The span select switches to "between [date] and [date]" (`InlineDate`). Whichever value is being solved is not an input: it is set in ink at 700 with a 2px Ledger Teal underline (0.25em offset) in the input's place. Each compared investment is a further line in the same grammar with its own dot and editable name, its rate always solved, and a 32px ghost × to remove it; under them a teal "+ Compare with another investment" text button. The hairline footer row reads "Also assumed: inflation 2.00% for the after-inflation rate", with the teal disclosure (the shared inflation field) and a ghost Reset. Then the Answer: the solved figure and its sentence, the muted tail on total growth and the after-inflation rate, and below it a primary "Save X% as a fund" button with a muted status line beside it (it opens `FundEditor` pre-filled). With one investment the chart card ("Growth path", the investment's actual path) is full width alone. When comparing it sits at 3fr beside a 2fr "Ranked by growth rate" card from 1280px up (stacked below, chart first); the ranked card is `xl:self-start`, so it hugs its rows rather than stretching to the chart. Each ranked row has a 10px dot, the name at 600 over "x% after inflation · +y% in total" (muted, 0.75rem, tabular), the rate at 1.25rem/600 and a secondary "Save as fund" button; the list is a container query (`@container`), so on a narrow card the button wraps under the name. There is no mode tab bar, no Compare tab and no year table. No Share button; inputs stay in the URL.

**The Inputs-Left Rule.** On wide screens, inputs stay in the left column and results stay right, on every two-column calculator. A visitor moving between calculators always knows where to look. Every calculator is now a sentence page (Growth & Fees, CAGR, Rent vs. Buy and Retirement), so on them the inputs are the sentence at the top and results always follow below it; the rule still governs any future two-column tool page.

## Elevation & Depth

Flat at rest, lift on intent. Depth comes from tonal layering (paper ground → white surface → mist tiles) and hairline borders, not shadows. Shadows appear only in response to intent or for things that float above the page.

### Shadow Vocabulary
- **Selection nudge** (`shadow-sm`, `0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): the selected option in a segmented control, raising it off its mist track; also the gap split panel where it floats over the chart.
- **Intent lift** (`shadow-lg`, `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`, with a 2px upward translate and a teal border): hover on navigational cards. Home no longer uses cards (its stations light the line instead), so no current surface uses it; keep it for any future navigational card.
- **Overlay** (`shadow-2xl`, `0 25px 50px -12px rgb(0 0 0 / 0.25)`, over a 50% black backdrop): the Fund Editor dialog.
- **Header glass**: the sticky header uses its surface colour at 90% with backdrop blur and a hairline bottom border; no shadow.

### Named Rules
**The Flat-By-Default Rule.** No card or input carries a shadow at rest. If something lifts, it is because the user is reaching for it or because it is floating over the page. The Fund Line is flat too: it responds to intent with colour and stroke (the lit segment, the growing ring), never with shadow.

## Shapes

Soft, consistent rounding with no sharp corners and no decorative geometry. Controls (buttons, inputs, selects, nav links, stat tiles, notices) use 8px. Containers (cards, details panels, dialog) use 12px. Segmented-control options use 6px to nest inside their 8px track. Fund chips use 16px so they read as pills that can still wrap to two lines. Swatches, step badges, the avatar and skill tags are full circles or pills. Borders are always 1px hairlines; dashed borders mark only the add-a-fund affordance ("+ New fund"). Icons are simple 2px-stroke SVG line icons on a 24px grid (round caps and joins); never Unicode glyphs or emoji standing in for an icon.

The Fund Line's diagram geometry is the one exception to "no decorative geometry", because it is not decoration: it maps the product's real flow (funds board at My Funds and ride through four calculators). Its form language is transit-diagram: thick strokes, 45° bends only, round joins, rounded terminus caps, ring stations and a pill interchange. Use it where the diagram carries meaning, never as ornament. One calculator-scale echo qualifies because it carries the same meaning: ink terminus caps on chart lines where a path ends (a fund's line at the final year on Growth & Fees, each investment's line at its own final year on CAGR, the buy and rent lines at the move-out year on Rent vs. Buy, a fund's line where it reaches the goal on Retirement).

**The Meaningful Geometry Rule.** Lines, rings and pills appear only where they map a real relationship in the product (which calculator follows which, which funds feed the library). A teal line that connects nothing is decoration and is out.

## Components

### Buttons
Calm and tactile: compact, quietly bordered, and responsive to the pointer.
- **Shape:** gently rounded (8px), 6px × 12px padding, body size at weight 500, optional 6px icon gap.
- **Primary:** Ledger Teal fill with teal-ink text; hover drops to 90% opacity. Use for the one commit action in a context (save a fund, import shared funds).
- **Secondary (default):** surface fill with a hairline border; hover shifts to Surface Mist. Use for Share scenario, Reset and similar.
- **Ghost:** no fill, muted text; hover fills mist and darkens text to ink.
- **Danger:** Cost Rose text, no fill; hover fills mist. Destructive actions confirm in-page, never with `window.confirm`.
- **Focus:** 2px Ledger Teal outline offset by 2px. **Disabled:** 50% opacity.

### Chips (fund chips)
- **Style:** 16px-rounded pills with a hairline border, a coloured swatch dot, the fund name (500), and tabular metadata at 75% opacity ("7.00% return · 0.20% MER").
- **State:** unselected is muted text with hover to ink; selected gets a Ledger Teal border and Teal Soft wash, toggled with `aria-pressed`. The "+ New fund" chip is dashed and turns its border teal on hover.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Surface White / Night Surface on the paper ground.
- **Shadow Strategy:** none at rest (see Flat-By-Default); a navigational card would take the Intent lift on hover.
- **Border:** 1px hairline.
- **Internal Padding:** 16px on phones, 20px from 640px up. Card titles sit 12px above content with an optional right-aligned action.

### Stat tiles
The signature result unit. An 8px-rounded tile on Surface Mist at 50% with a hairline border and 12px padding: a muted label, a Figure-size tabular value (coloured by meaning), and an optional muted sub-line ("35.8% of what you'd have").

### Inputs / Fields
- **Style:** 8px-rounded box, hairline border on surface; 8px × 12px text padding; label above (0.875rem, 500), muted hint below (0.75rem). Prefix ($) and suffix (%, yrs) units sit inside the box in muted text. Number spinners are removed.
- **Focus:** border turns Ledger Teal with a 2px teal ring at 25% opacity, applied to the whole box (`focus-within`).
- **Disabled / computed:** Surface Mist fill with muted text.

### Plan Sentence inputs
`InlineNumber` / `InlineSelect` / `InlineText` / `InlineDate` in `src/components/PlanSentence.tsx`: values inside a sentence ("Invest $10,000, then $500 every month…").
- **Style:** inherits the sentence's type size; an 8px-rounded Surface Mist box with a 1px hairline border all round, 8px side padding, value at 600 in ink. No accent bottom border (the audit flags a one-side accent border on a rounded box).
- **Hover / focus:** the border turns Ledger Teal; focus adds the 2px teal ring at 25% (`focus-within`).
- **Width:** an invisible tabular copy of the text in the same grid cell sizes the box, so it hugs the value at any size.
- **Values:** grouped digits at rest (10,000), raw digits while focused (10000). Units ($, %) sit inside the box. Each input carries its own `aria-label`.
- **InlineSelect:** sized to the chosen label (not the longest option) by an invisible copy in the same grid cell; the native arrow is removed (`appearance-none`) and a drawn 0.55em muted chevron sits at the right, so every inline box is the same height in every browser.
- **InlineText:** free text (an investment's name) in the same box, sized to its content by an invisible copy, capped at the line width.
- **InlineDate:** a native date input in the same box, value at 600. It does not use tabular figures, because they widen the date's hyphens.
- **Fund chips in the sentence:** buttons on surface with a hairline border, a 10px swatch dot and the name at 600, then both numbers named in muted tabular text: "2.20% MER · 7.00% return" (the fee label from `region.feeLabelInline`). From 640px up the chip is one full-pill line; on phones the details drop to a second line under the name and the chip rounds to 16px (`rounded-2xl`). Hover turns the border teal. A small teal SVG chevron ends the chip to show it opens the fund picker; it flips while the panel is open. On Rent vs. Buy the chip names one number, the fund's net return after fees ("6.56% after MER"), since that is the rate the renter's savings earn. On Retirement it names the fund's real return ("4.71% real", after fees and inflation), since the plan is in today's dollars.
- **Path dots:** on a Two-Path Sentence each line starts with a 12px circle in that path's chart series colour (buy in `series.primary`, rent in `series.rent`), set 8px before the first word. They are data colour, so they are decorative (`aria-hidden`) and never interactive. The "I'd stay" line has no dot because it belongs to both paths.

### Sensitivity grid
The "What would change the answer?" table on Rent vs. Buy: a 3 × 3 grid of break-even outcomes as home-price growth (rows) and the fund's net return (columns) move 1% either way. A spanning muted 0.75rem column-group header ("Fund return, after MER", from `region.feeLabelInline`) sits over the three return values (600, tabular); the row-header column is titled "Home prices rise" in the same muted style, with each rate at 600. Each cell is an 8px-rounded block (4px × 8px padding, 6px side padding on phones): the break-even year at 600 ("Year 9", or "40+ yrs") over a 0.75rem signed gap after the stay ("+$31.6K" in Gain Green, "−$12K" in Cost Rose). The current-inputs cell (the centre) is ringed with a 2px inset Ledger Teal ring. The table scrolls sideways rather than overflowing on narrow screens.

### Segmented control
A mist track with a hairline border and 2px inset; options are 6px-rounded, muted at rest, and the selected one becomes a surface "key" with the Selection nudge shadow. Used for Future $ / Today's $ and similar binary or ternary toggles; exposed as a radiogroup.

### Navigation
A sticky 90%-opaque header with backdrop blur and a hairline bottom border. Left: the teal logo tile with a white rising line, plus the wordmark (hidden only below 360px). Then three top-level items (body, 500, 8px-rounded; inactive muted with a mist hover, active on the Teal Soft wash with ink text): **Calculators**, **My Funds** and **About**. Calculators is a disclosure button with a 16px SVG chevron that flips when open; it is active on any calculator or Methodology page. Its dropdown is a 12px surface card (20rem, hairline border, `shadow-lg`) that drops in over 150ms (`.nav-pop`, off under reduced motion) and lists the four calculators, each as a 600 name over a muted one-line blurb, then a hairline and a muted "How the math works" link to Methodology. It closes on Escape (focus returns to the button), an outside press, focus leaving it, or navigation. Right: a compact region select (flag + currency) and a theme cycle button with 16px SVG line icons (half-filled circle for system, sun, moon).

Below 640px the three items collapse into a bordered menu button (16px three-line SVG icon) at the far left, before the logo. It opens a side nav built on a modal `<dialog>` (focus trap, Escape, top layer): a 40% black scrim fades in while a surface panel (`min(20rem, 86vw)`, hairline right border, `shadow-xl`) slides in from the left, under the button, over 280ms on an ease-out curve (`cubic-bezier(0.22, 1, 0.36, 1)`); both run in reverse on close. Under reduced motion the panel does not move: it and the scrim fade over 150ms instead. The panel has a "Menu" title row with a bordered close button, then Calculators as an expandable group (chevron; the list grows by animating its grid row from 0fr to 1fr, set off by a 2px hairline rule on the left, open by default on calculator pages), followed by My Funds and About. Page scroll is locked while it is open, and choosing a link closes it.

### Scrollbars
Every scrollbar (the page and internal scrollers such as tables and the side nav) is the native one, restyled: a 6px rounded pill (12px track, 3px transparent inset) in Scroll Thumb on a transparent track, so it sits on whatever is behind it, darkening to the hover tone in light mode and lightening in dark. Firefox gets `scrollbar-width: thin` with the same colours. Scrollers reserve their gutter (`scrollbar-gutter: stable`), so short and long pages and the side nav's scroll lock never shift the layout. With a mouse or trackpad (`pointer: fine`) the window doesn't scroll: the shell is a 100dvh column and the region under the header scrolls, so the page scrollbar starts below the header rather than running beside it. The header is padded by the measured gutter width so its row stays centred on the page column, and each new page focuses `<main>` so the keyboard scrolls it. Touch screens keep window scrolling with the sticky translucent header, so the browser chrome still collapses and their overlay scrollbars never cross the header anyway.

### Notice
A full-width Caution Amber panel (8px, 12px × 16px) with dark amber ink and an optional right-aligned action. It is used for shared-fund imports and input warnings.

### Tables and details
Disclosure panels (`Details`) are 12px cards whose summary row has a muted 16px SVG chevron that rotates 90° when open; the body is separated by a hairline. Tables use tabular numerals, a sticky surface header with a hairline under it, zebra rows on mist at 40%, left-aligned first column and right-aligned figures, capped at ~28rem tall with internal scroll. Every chart has a table or stat equivalent.

### The Fund Line (Home signature)
The Home page as a transit map: bold, diagrammatic and still calm, with one gesture of motion.
- **Main line:** a 22-unit Ledger Teal stroke with 45° bends and round joins, crossing the full map width through four stations (Growth & Fees, CAGR, Rent vs. Buy, Retirement). It ends in ink terminus caps (12 × 44, 6 radius), which switch to Night Muted in dark mode.
- **Stations:** rings of radius 16 with a 6-unit ink stroke and a surface fill. Each station name is a real link in the Station style with its one-line question below in muted 0.875rem, always visible.
- **Interchange (My Funds):** a 176 × 46 pill with a 6-unit ink stroke and surface fill, carrying the "Start here" badge (Ledger Teal fill, teal-ink text, 0.875rem bold, full pill, 4px × 12px). The interchange name sits above it at 1.875rem/800 with "Interchange · N funds saved" in muted text; hover underlines the name in teal.
- **Fund branch lines:** 10 units wide, each in its fund's own colour, at most 6 drawn. Each starts at its own small horizontal ink terminus cap (28 × 12, 6 radius) near the bottom of the map, rises, bends 45° and enters the pill at its own point. They are data, not interaction.
- **Fund legend:** plain rows in the lower-right band under a normal-case semibold title ("Your fund lines"): an 8 × 24 colour swatch pill, the fund name (truncated with a title tooltip), and the fee in muted tabular 0.75rem. Extra funds collapse to "+ N more in My Funds". No uppercase kicker.
- **Signature interaction:** on hover or keyboard focus of a station, the main line dims to 35% opacity, that station's stretch is redrawn at full teal over it, the ring grows to radius 20 with a teal fill, and the name gets a 4px teal underline (6px offset). Transitions run 200ms.
- **Load motion:** the main line draws itself once, a 1.4s `stroke-dashoffset` animation on `cubic-bezier(0.16, 1, 0.3, 1)` (`.fund-line-draw` in `src/index.css`). Its resting state is fully drawn, and it is static under `prefers-reduced-motion`.
- **Below 1024px (stop list):** the line runs down the page as a 10px teal bar with stations as 32px rings with 5px ink borders on surface, and the interchange stood upright as a 48 × 32 pill with the "Start here" badge (0.75rem) beside its name and a row of fund-colour swatch pills under it.
- **How it works:** the same language at small scale: a three-stop line (28px rings from 640px up on a horizontal 10px teal bar, 32px rings on a vertical bar on phones) with 1.125rem/800 stop titles and muted body text.

### Charts
Recharts on the same palette: hairline-coloured grid, muted axis text, an 8px-rounded tooltip on surface with a hairline border, 2.5px series lines without dots for long horizons, and a dashed muted line for "contributed." Reference markers use a dot or line in the relevant series colour (the PMI ends line is dashed in the mortgage-insurance series), with their labels set in the chart text colour at 12px. A label drawn over lines or grid gets a halo: a 4px stroke in the tooltip background colour painted under the fill (`paint-order: stroke`).
- **Terminus caps (Growth & Fees):** fund lines are drawn 4px with round joins and end at the final year in an ink terminus cap (8 × 22, 4 radius, in the chart text colour), echoing the Home map.
- **Terminus caps (Rent vs. Buy):** the buy and rent net-worth lines are 4px with round joins and end at the move-out year in a slimmer ink cap (6 × 16, 3 radius), so the cap reads as a stop on the path rather than the end of the chart.
- **Terminus caps and goal line (Retirement, "Net worth until retirement"):** net worth by age on a numeric x-axis, ticked at the current age and then round ages in steps of 5 (10 over spans past 30 years), with no axis titles because the caption names both axes. The goal is a dashed muted line (5 4) labelled "Goal $1M" (12px, chart text colour) at its top left. Each fund's line is 4px in the fund's colour with round joins and stops exactly on the goal line at its fractional retirement age, ending in the slim ink cap (6 × 16, 3 radius). A fund that never reaches the goal runs to the chart's end with no cap.
- **Terminus caps (CAGR):** each line is 4px in its colour with round joins and ends at its own final (fractional) year in the slim ink cap (6 × 16, 3 radius). With one investment the chart is its actual path ("Growth path"). When comparing, every rate is normalized to $10,000 over that investment's own span ("Growth of $10,000 at each rate"), so lines of different lengths end at different years, each with its cap.
- **Savings-rate explorer (Retirement, "What if you saved more?"):** retirement age (y, from the current decade to 100, ticks every 10) against savings rate (x, 0–100%, ticks every 20) with income fixed, one 3px line per fund and no dots. Clicking the chart sets the savings rate (it rewrites spending). The user's point is a 6px dot in the primary fund's colour with a 2px stroke in the tooltip background colour, labelled "You · 43% → 49" (12px, 600, haloed) below and left of the dot, in the empty space under the falling curves, held clear of the y-axis at low rates.
- **Break-even marker (Rent vs. Buy):** a 7px-radius Ledger Teal dot on the buy line where buying overtakes renting, with a 3px stroke in the tooltip background colour, labelled "Break-even · year N" (12px, 600, haloed) below-right of the dot, where lines rising to the right leave space. When break-even comes after the stay, the chart runs on to two years past it (at most 40) and a dashed ink line (5 4) marks the stay, labelled "You move out" (12px, 600) at the top. When the lines don't cross on the chart, a haloed label above the upper cap says who is ahead and by how much ("Renting ahead $X · year N").
- **Cost bars (Rent vs. Buy, "Money you don't get back"):** two horizontal bars (Buy, Rent) on a 160px chart, the Buy bar stacked from the cost-category series and the Rent bar in Rent Indigo, with a vertical-only grid. Its legend is an HTML row of 10px rounded squares, each category name followed by its short total in muted tabular text, so every figure is readable without hovering.
- **Gap bracket:** a 2px Gain Green bracket just right of the caps spans the best and worst fund at the final year, with end ticks and a label in the same colour: the short dollar value (13px, 700, e.g. "$209.8K") over "gap" (11px, 600). It is a button: hover or focus highlights it (a 12% Gain Green tint behind it, 3px stroke) and opens the gap split panel; click, Enter or Space pins the panel open, Escape unpins it.
- **Gap split panel:** a 12px-rounded surface panel with a hairline border and `shadow-sm`, Body size. A "Gap after N years" row with the full gap in bold Gain Green; a 10px full-pill two-part bar (fee part solid Gain Green, return part at 40%), drawn only when both parts are positive; two rows ("Lower/Higher MER", "Higher/Lower return") with a matching swatch, the dollar part and its share, and old → new values in muted 0.75rem. A negative part is Cost Rose with a minus sign. A muted footnote says the split averages both orders (a Shapley split, `splitGap` in `src/lib/finance/growth.ts`). From 640px up it overlays the chart's top-left; on phones it sits below the chart.
- **Legend:** an HTML row under the chart: a 4px × 20px colour bar per fund (on Rent vs. Buy, per path) and a dashed muted mark for "Contributed", labels in ink. Both Retirement charts use the same row, funds only.
- **Summary table ("After N years"):** a compact tabular comparison card beside the balance chart. One column per fund, headed by a 10px swatch and the name at 600 (headers in `normal-nums`, since `tnum` widens Inter's hyphen in names). Rows: Contributed, Investment growth, Final balance (600); a hairline rule; Fees paid, Lost growth and Total fee cost (600), all in Cost Rose; a rule; Balance with no fees in muted. A muted 0.75rem note under it defines Fees paid and Lost growth.
- **Yearly fee bars ("What fees take, year by year"):** a full-width Recharts BarChart of grouped stacked bars, one stack per fund per year, all in that fund's own colour: balance at opacity 1, fees paid at 0.62, lost growth at 0.36, stacking to the no-fee balance; the top layer has 3px top corners. The intro calls the layers "the solid part", "the stronger tint" and "the faintest tint" (never darker or lighter, so the wording holds in both themes). Legend: a swatch per fund, then a generic key of three ink swatches at the same opacities. A custom tooltip lists, per fund, Balance, Fees paid, Lost growth and With no fees. Below 640px it shows every Nth year so there are at most 12 groups (at most 40 from 640px up), counted back from the final year, and the intro adds "Showing every N years."

## Do's and Don'ts

### Do:
- **Do** keep Ledger Teal as the only accent for interactive and selected states, and use the soft wash rather than the full fill for selection.
- **Do** set every compared number in tabular numerals and right-align figures in tables.
- **Do** lead each result with a plain sentence (or, on a Plan Sentence page, the Answer figure and its sentence), then stat tiles or a breakdown, then the chart, then the table.
- **Do** define every new colour as a light/dark pair in `src/index.css`, and pass concrete hex values to charts through `useChartTheme()`.
- **Do** keep surfaces flat with 1px hairline borders; reserve lift for hover on navigational cards and shadow for overlays.
- **Do** use 8px corners on controls and 12px on containers.
- **Do** make sure every chart's key figures also appear as text or in a table.
- **Do** draw Fund Line geometry with 45° bends, round joins and ink terminus caps, and keep its labels as real HTML links positioned over the SVG, not SVG text.
- **Do** keep any draw-on motion one-shot, fully drawn at rest, and static under `prefers-reduced-motion`.
- **Do** set prose that shares a line with tabular figures in `normal-nums`.
- **Do** mark inline sentence inputs with a full hairline box that turns teal on hover or focus.
- **Do** halo any SVG chart label that sits over lines or grid with a 4px stroke in the tooltip background colour (`paint-order: stroke`).

### Don't:
- **Don't** use green, rose or amber for emphasis or decoration; they mean gain, cost and caution only.
- **Don't** put data colours (fund swatches, chart series) on buttons, links or surfaces.
- **Don't** add shadows to cards or inputs at rest.
- **Don't** introduce a second typeface or a display font; hierarchy comes from weight and size.
- **Don't** use `var(--…)` for Recharts SVG attributes; they need concrete hex values.
- **Don't** let long fund names or notes overflow; wrap them.
- **Don't** add lines, rings or pills that map nothing in the product; transit geometry is for the Fund Line and its one echo (chart terminus caps), not ornament.
- **Don't** colour the fee layers of a fund's bar in another fund's colour or a second semantic colour; they are tints of that fund's own colour, and Cost Rose stays on the cost figures as text.
- **Don't** put an accent bottom border on a rounded input box.
- **Don't** use weight 800 or the Home Display size on calculator pages.
- **Don't** light a station or signal hover in a fund's colour; the hover signal is always Ledger Teal.
