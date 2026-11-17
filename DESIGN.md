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
  ink: "#14171c"
  slate-muted: "#5d6673"
  night-ground: "#0d1014"
  night-surface: "#151a20"
  night-surface-2: "#1c232b"
  night-hairline: "#2a323c"
  night-grid: "#262e38"
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
  add-fund-pill:
    textColor: "{colors.ledger-teal}"
    rounded: "{rounded.full}"
    padding: "0 12px"
  station-strip-current:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  answer-figure:
    textColor: "{colors.gain-green}"
    typography: "{typography.answer}"
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

Density is that of a working tool. Inputs sit in a narrow left column, and results, stat tiles and charts fill the wide right column. Surfaces are flat at rest and respond to intent: interactive cards lift slightly, controls shift tone on hover, and the focused field gains a teal ring. Light and dark themes are equal citizens. Dark mode is a deep blue-black night ground, not an inverted afterthought, and every token has a counterpart in both.

The mood is calm, patient and clear. Components feel calm and tactile: restrained at rest, with a gentle physical response when you reach for them.

Home is where the long view is drawn literally. It is **the Fund Line**: the fund library as one bold Ledger Teal transit line, each calculator a ring station on it, and My Funds the pill interchange where every fund boards. The page gets louder type and heavier strokes than the calculators, but the same palette, the same single accent and the same calm motion. It is the one place the system draws its own flow.

Calculators echo the line at instrument size. Growth & Fees opens with a **station strip** (the Fund Line in miniature, its own stop lit) and is laid out as a **Plan Sentence**: the plan is one sentence with its values as inline inputs, and the answer is a single large gain-green number under it. Its chart borrows the map's ink terminus caps. The voice stays at calculator weight (700 and below).

**Key Characteristics:**
- One accent (Ledger Teal) on a cool neutral ground; colour elsewhere means data or meaning (gain, cost, caution, a fund's identity).
- Tabular numerals for every figure, so columns of money line up and changes are easy to compare.
- Flat bordered surfaces at rest; lift and shadow only on intent or overlay.
- Soft, consistent corners (8px controls, 12px containers, pill-like chips).
- Paired light and dark palettes with matching roles; charts take concrete hex values from the same palette.
- On Home, a transit-map diagram (teal line, ink ring stations, pill interchange, fund-coloured branch lines) that maps the product's real flow; calculators echo it with a station strip and terminus-capped chart lines.
- On Growth & Fees, an editable plan sentence in place of a labelled form rail, answered by one display-size figure.

## Colors

A cool, low-chroma neutral system with one teal voice, plus a small set of semantic and data colours that always mean something.

### Primary
- **Ledger Teal** (`ledger-teal`; `ledger-teal-dark` in dark mode): the single interactive accent. Primary buttons, the logo tile, focus rings and focused input borders, links, numbered step badges, the selected chip border, and the "Buy" or first-fund series in charts. On Home it is the Fund Line itself, the lit station segment and ring fill, the hover underline on station names, and the "Start here" badge. Text on it uses `ledger-teal-ink` / `ledger-teal-ink-dark`.
- **Ledger Teal Soft** (`ledger-teal-soft`; `ledger-teal-soft-dark`): the selected-state wash. Active nav link, selected fund chips, and the winning-outcome card tint (Growth & Fees, Retirement, and Rent vs. Buy when buying wins).

### Secondary
- **Rent Indigo** (`rent-indigo`; `rent-indigo-dark`; CSS `--rent`, Tailwind `rent`): the counter-voice to teal in comparisons. The "Rent + invest" line, the Rent bar and the renting outcome card in Rent vs. Buy, and the second default fund colour. Use it only where two options are being weighed against each other.

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

### Data palette
Funds carry their own identity colour, chosen from a fixed set of eight in `src/state/fundsStore.ts` (teal 600, indigo, rose, amber, sky, violet, green, pink). A fund's colour is stored with the fund, so it is the same in both themes; all eight keep at least 3:1 against the surface in both. Fixed chart series (buy, rent, cost, lost growth, mortgage insurance, the Rent vs. Buy cost categories, the "contributed" reference line) live in `useChartTheme().series` / `.muted` in `src/state/useTheme.ts` as light/dark pairs with at least 3:1 against their surface; pages never write a chart hex literal. The fee-cost breakdown uses two neutrals, `series.feePaid` (`#334155` / `#e2e8f0`) and `series.feeLost` (`#64748b` / `#94a3b8`), so a breakdown bar never reads as one of the funds' own colours; `series.gain` (`#15803d` / `#4ade80`) mirrors Gain Green for the gap bracket. These are data colours, not UI colours: they appear as swatch dots, chart lines and bars, and on Home as each fund's branch line and legend swatch, never as button or surface fills. Legend and marker labels are set in ink, not in the series colour, because several data colours fall below 4.5:1 as text.

### Named Rules
**The One Voice Rule.** Ledger Teal is the only colour that signals "you can act here." Data and semantic colours never appear on buttons, links or nav. On the Fund Line, the fund branch lines are data (which funds you have), never the hover or focus signal; a station lights in teal whatever funds feed it.

**The Meaning-Only Rule.** Green, rose and amber are reserved for gain, cost and caution. A number turns green or rose only because of what it means, never for emphasis. A breakdown that splits one cost into parts (fees paid vs. lost growth) uses neutrals, not a fund or second semantic colour; the total carries the meaning colour.

**The Twin Palette Rule.** Every colour role has a light and a dark value with the same meaning. A new colour isn't done until both exist; Recharts gets the concrete hex values through `useChartTheme()`, not CSS variables.

## Typography

**Body Font:** Inter Variable, self-hosted (with ui-sans-serif, system-ui, Segoe UI, Roboto fallback)

**Character:** One neutral sans for everything, carried by weight and size rather than by a second family. Inter Variable is self-hosted from the `@fontsource-variable/inter` package (imported in `src/main.tsx`, `font-display: swap`, split by script so visitors download only the latin file, about 48 kB). No font is fetched from a third party, which keeps the "nothing is sent anywhere" promise. The system fonts after it in the stack are only a fallback while it loads.

### Hierarchy
- **Display** (700, 3rem from 640px up, 1.875rem below; tight tracking): the display step for any non-Home hero line. Calculators never use it; they top out at Headline.
- **Home Display** (`display-home`: 800, 3.75rem at 1024px up and 4.5rem from 1280px; on the stop list 2.25rem, 3.75rem from 640px; 0.95 leading, -0.03em tracking): the Home headline only. A deliberate Home-scoped exception, so the Fund Line's heavy station names have a headline above them; it does not change the calculators' type.
- **Station** (`station`: 800, 1.5rem, leading 1, tight tracking): station names on the Fund Line and the stop list. The map's interchange name ("My Funds") steps up to 1.875rem. The "how it works" heading is 1.5rem at 800 and its stop titles 1.125rem at 800, the same Home voice.
- **Answer** (`answer`: 700, 3.75rem from 640px up, 3rem below; leading 1, -0.03em tracking, tabular): the one result figure on a Plan Sentence page (the Growth & Fees fee gap), coloured by the Meaning-Only Rule, with its answer sentence beside it at 1.25rem (1.125rem on phones, max 26em). The largest calculator type, still at 700.
- **Plan Sentence** (`plan-sentence`: 500, 1.5rem from 640px up, 1.125rem below; leading 2 so inline inputs fit between lines; muted text, input values in ink at 600): the editable plan sentence.
- **Headline** (700, 1.875rem from 640px up, 1.5rem below; tight tracking): one page title per calculator (`PageHeader`). A page that opens with the station strip uses the lit stop as its visible title and keeps an `sr-only` h1 instead.
- **Title** (600, 1rem): card titles. Section headings step up to 1.125rem.
- **Figure** (600, 1.25rem, tabular numerals): stat-tile values. Coloured by the Meaning-Only Rule.
- **Body** (400, 0.875rem): inputs, buttons, nav, tables, explanatory text. Page intros run at the base size (1rem, muted); the Home lede is 1.125rem. Every paragraph is capped at 34em (about 75 characters of Inter) with `text-wrap: pretty` (a base rule in `src/index.css`).
- **Label** (500, 0.75rem): stat labels, field hints, chip metadata, the footer disclaimer, station-strip stops (the lit stop at 700). Field labels use 0.875rem at 500.

### Named Rules
**The Tabular Rule.** Every number a user compares (inputs, stat values, tables, chip metadata) uses tabular numerals (`.tabular`). Proportional digits in a money column are a bug. Gotcha: `tnum` also widens Inter's hyphen, so prose that shares a line with tabular figures (e.g. "of the no-fee balance") is wrapped in `normal-nums`.

**The Home Weight Rule.** Weight 800 belongs to Home: the headline, station names and the "how it works" stops. Calculator pages stay at 700 and below, so the tools read as calm instruments under a bolder front door. The station strip lights its current stop at 700, not 800, and the Answer figure is 700.

**The Sentence Lead Rule.** The headline result is written as a plain sentence ("After 30 years, X ends up $209,821 ahead of Y.") at 1.125rem in its own card, with only the fund names and the key figure in bold. Lead with the consequence in words; tiles and charts follow. On a Plan Sentence page the plan itself is the sentence, and the answer leads with its figure at Answer size, followed by a 1.25rem sentence with the fund names in bold.

## Layout

A centred container (max 1280px) with a 16px side gutter, a sticky header and a muted footer disclaimer. Calculator pages use a two-column grid from 1024px up: a fixed ~22rem input column on the left and a fluid results column on the right (20px gap). Below 1024px everything stacks, inputs first. Within cards, fields sit in a 2-column grid with 12px gaps, and stat tiles reflow from 2 to 3 columns as width allows.

Spacing follows a 4px base: 12px between fields and tiles, 16–20px card padding (16px on phones, 20px from 640px up), 24px below page headers, 56px between Home sections. The header nav scrolls sideways on narrow screens and keeps the current link in view; it never wraps. Long fund names and notes wrap anywhere rather than overflowing. The layout must reflow cleanly to 375px.

Home has its own layout. From 1024px up it is a transit map: one section with a fixed 1200:620 aspect ratio, SVG geometry in a 1200 × 620 coordinate space for the lines, rings and caps, and real HTML labels positioned over it by percentage (`left: x/1200`, `top: y/620`), so text stays at reading size and every station is an ordinary link. The headline and lede sit top-left (max 33rem), the fund legend sits in the empty lower-right band (20rem wide). Below 1024px the map becomes a vertical stop list down the page. The "how it works" section is a three-stop line under a hairline rule: a horizontal teal bar across a three-column grid from 640px up, and the same vertical bar and ring stops on phones.

Growth & Fees uses the **Plan Sentence** layout instead of the two-column grid: station strip; a full-width card holding the plan sentence and a second line of fund pills ("Compare [fund] with [fund] + Add a fund"), with per-fund fee/return overrides opening in a panel inside the card; a muted overrides note with a ghost Reset under it; the Answer figure and sentence; a grid of the balance chart beside "What fees cost you" (3fr / 2fr from 1280px up, stacked below with the chart first); and the year table in a collapsed `Details`. This page has no Share button (removed at the user's request); its inputs still live in the URL.

**The Inputs-Left Rule.** On wide screens, inputs stay in the left column and results stay right, on every two-column calculator. A visitor moving between calculators always knows where to look. A Plan Sentence page is the one exception: its inputs are the sentence at the top, and results always follow below it.

## Elevation & Depth

Flat at rest, lift on intent. Depth comes from tonal layering (paper ground → white surface → mist tiles) and hairline borders, not shadows. Shadows appear only in response to intent or for things that float above the page.

### Shadow Vocabulary
- **Selection nudge** (`shadow-sm`, `0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): the selected option in a segmented control, raising it off its mist track.
- **Intent lift** (`shadow-lg`, `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`, with a 2px upward translate and a teal border): hover on navigational cards. Home no longer uses cards (its stations light the line instead), so no current surface uses it; keep it for any future navigational card.
- **Overlay** (`shadow-2xl`, `0 25px 50px -12px rgb(0 0 0 / 0.25)`, over a 50% black backdrop): the Fund Editor dialog.
- **Header glass**: the sticky header uses its surface colour at 90% with backdrop blur and a hairline bottom border; no shadow.

### Named Rules
**The Flat-By-Default Rule.** No card or input carries a shadow at rest. If something lifts, it is because the user is reaching for it or because it is floating over the page. The Fund Line is flat too: it responds to intent with colour and stroke (the lit segment, the growing ring), never with shadow.

## Shapes

Soft, consistent rounding with no sharp corners and no decorative geometry. Controls (buttons, inputs, selects, nav links, stat tiles, notices) use 8px. Containers (cards, details panels, dialog) use 12px. Segmented-control options use 6px to nest inside their 8px track. Fund chips use 16px so they read as pills that can still wrap to two lines. Swatches, step badges, the avatar and skill tags are full circles or pills. Borders are always 1px hairlines; dashed borders mark only the add-a-fund affordances ("+ New fund", "+ Add a fund"). Icons are simple 2px-stroke SVG line icons on a 24px grid (round caps and joins); never Unicode glyphs or emoji standing in for an icon.

The Fund Line's diagram geometry is the one exception to "no decorative geometry", because it is not decoration: it maps the product's real flow (funds board at My Funds and ride through four calculators). Its form language is transit-diagram: thick strokes, 45° bends only, round joins, rounded terminus caps, ring stations and a pill interchange. Use it where the diagram carries meaning, never as ornament. Two calculator-scale echoes qualify because they carry the same meaning: the station strip (the real order of the calculators, each stop a link) and ink terminus caps on chart fund lines (where a fund's line ends).

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
- **Border:** 1px hairline. Outcome cards may tint with the winner's colour at low opacity (teal soft at 40%, or indigo at 10% with a 40% border).
- **Internal Padding:** 16px on phones, 20px from 640px up. Card titles sit 12px above content with an optional right-aligned action.

### Stat tiles
The signature result unit. An 8px-rounded tile on Surface Mist at 50% with a hairline border and 12px padding: a muted label, a Figure-size tabular value (coloured by meaning), and an optional muted sub-line ("35.8% of what you'd have").

### Inputs / Fields
- **Style:** 8px-rounded box, hairline border on surface; 8px × 12px text padding; label above (0.875rem, 500), muted hint below (0.75rem). Prefix ($) and suffix (%, yrs) units sit inside the box in muted text. Number spinners are removed.
- **Focus:** border turns Ledger Teal with a 2px teal ring at 25% opacity, applied to the whole box (`focus-within`).
- **Disabled / computed:** Surface Mist fill with muted text.

### Plan Sentence inputs
`InlineNumber` / `InlineSelect` in `src/components/PlanSentence.tsx`: values inside a sentence ("Invest $10,000, then $500 every month…").
- **Style:** inherits the sentence's type size; an 8px-rounded Surface Mist box with a 1px hairline border all round, 8px side padding, value at 600 in ink. No accent bottom border (the audit flags a one-side accent border on a rounded box).
- **Hover / focus:** the border turns Ledger Teal; focus adds the 2px teal ring at 25% (`focus-within`).
- **Width:** an invisible tabular copy of the text in the same grid cell sizes the box, so it hugs the value at any size.
- **Values:** grouped digits at rest (10,000), raw digits while focused (10000). Units ($, %) sit inside the box. Each input carries its own `aria-label`.
- **Fund pills in the sentence:** full-pill buttons on surface with a hairline border, a 10px swatch dot, the name at 600 and the fee in muted tabular text; hover turns the border teal. The "+ Add a fund" pill is dashed with teal text.

### Segmented control
A mist track with a hairline border and 2px inset; options are 6px-rounded, muted at rest, and the selected one becomes a surface "key" with the Selection nudge shadow. Used for Future $ / Today's $ and similar binary or ternary toggles; exposed as a radiogroup.

### Navigation
A sticky 90%-opaque header with backdrop blur and a hairline bottom border. Left: the teal logo tile with a white rising line, plus the wordmark from 640px up. Centre: text nav links (body, 500, 8px-rounded); inactive links are muted with a mist hover, and the active link gets the Teal Soft wash with ink text. Right: a compact region select (flag + currency) and a theme cycle button with 16px SVG line icons (half-filled circle for system, sun, moon). On phones the link row scrolls horizontally.

### Station strip
`src/components/StationStrip.tsx`: the Fund Line in miniature at the top of a calculator (My Funds → Growth & Fees → CAGR → Rent vs. Buy → Retirement), a labelled `nav` of Label-size stops.
- **Stops:** 14px rings with a 3px ink border on surface; every stop except the current one is a link (muted, hover to ink, teal focus outline).
- **Current stop:** an 18px teal-filled ring with a 3px ink border and the name at 700 in ink, `aria-current="page"`. Never 800 (Home Weight Rule).
- **Segments:** 6px-tall full-pill teal bars (32px wide, 48px from 640px up). Segments up to the current stop are full teal; later ones sit at 35% opacity.
- **Phones:** the strip scrolls sideways and fades out at the right edge (mask from 85% to transparent); no fade from 640px up.

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
Recharts on the same palette: hairline-coloured grid, muted axis text, an 8px-rounded tooltip on surface with a hairline border, 2.5px series lines without dots for long horizons, and a dashed muted line for "contributed." Reference markers (Break-even, PMI ends) use a labelled dot or line in the relevant series colour.
- **Terminus caps (Growth & Fees):** fund lines are drawn 4px with round joins and end at the final year in an ink terminus cap (8 × 22, 4 radius, in the chart text colour), echoing the Home map.
- **Gap bracket:** a 2px Gain Green bracket just right of the caps spans the best and worst fund at the final year, with end ticks and a "gap" label (13px, 700) in the same colour.
- **Legend:** an HTML row under the chart: a 4px × 20px colour bar per fund and a dashed muted mark for "Contributed", labels in ink.
- **Fee breakdown ("What fees cost you"):** one row per fund: swatch and name, the total in Cost Rose, then a 20px, 4px-rounded stacked bar of fees paid (`series.feePaid`) and lost growth (`series.feeLost`) scaled to the largest total, then muted tabular sub-lines and a two-swatch key. Neutral, never fund-coloured.

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

### Don't:
- **Don't** use green, rose or amber for emphasis or decoration; they mean gain, cost and caution only.
- **Don't** put data colours (fund swatches, chart series) on buttons, links or surfaces.
- **Don't** add shadows to cards or inputs at rest.
- **Don't** introduce a second typeface or a display font; hierarchy comes from weight and size.
- **Don't** use `var(--…)` for Recharts SVG attributes; they need concrete hex values.
- **Don't** let long fund names or notes overflow; wrap them.
- **Don't** add lines, rings or pills that map nothing in the product; transit geometry is for the Fund Line and its echoes (station strip, chart terminus caps), not ornament.
- **Don't** colour the parts of a cost breakdown in fund or extra semantic colours; the parts are neutrals.
- **Don't** put an accent bottom border on a rounded input box.
- **Don't** use weight 800 or the Home Display size on calculator pages.
- **Don't** light a station or signal hover in a fund's colour; the hover signal is always Ledger Teal.
