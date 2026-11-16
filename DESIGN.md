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
  section: "40px"
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

**Key Characteristics:**
- One accent (Ledger Teal) on a cool neutral ground; colour elsewhere means data or meaning (gain, cost, caution, a fund's identity).
- Tabular numerals for every figure, so columns of money line up and changes are easy to compare.
- Flat bordered surfaces at rest; lift and shadow only on intent or overlay.
- Soft, consistent corners (8px controls, 12px containers, pill-like chips).
- Paired light and dark palettes with matching roles; charts take concrete hex values from the same palette.

## Colors

A cool, low-chroma neutral system with one teal voice, plus a small set of semantic and data colours that always mean something.

### Primary
- **Ledger Teal** (`ledger-teal`; `ledger-teal-dark` in dark mode): the single interactive accent. Primary buttons, the logo tile, focus rings and focused input borders, links, numbered step badges, the selected chip border, and the "Buy" or first-fund series in charts. Text on it uses `ledger-teal-ink` / `ledger-teal-ink-dark`.
- **Ledger Teal Soft** (`ledger-teal-soft`; `ledger-teal-soft-dark`): the selected-state wash. Active nav link, selected fund chips, icon tiles on Home, and the winning-outcome card tint in Rent vs. Buy.

### Secondary
- **Rent Indigo** (`rent-indigo`; `rent-indigo-dark`; CSS `--rent`, Tailwind `rent`): the counter-voice to teal in comparisons. The "Rent + invest" line, the Rent bar and the renting outcome card in Rent vs. Buy, and the second default fund colour. Use it only where two options are being weighed against each other.

### Tertiary (semantic)
- **Gain Green** (`gain-green`; `gain-green-dark`): favourable figures, such as the amount one fund ends up ahead.
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
Funds carry their own identity colour, chosen from a fixed set of eight in `src/state/fundsStore.ts` (teal 600, indigo, rose, amber, sky, violet, green, pink). A fund's colour is stored with the fund, so it is the same in both themes; all eight keep at least 3:1 against the surface in both. Fixed chart series (buy, rent, cost, lost growth, mortgage insurance, the Rent vs. Buy cost categories, the "contributed" reference line) live in `useChartTheme().series` / `.muted` in `src/state/useTheme.ts` as light/dark pairs with at least 3:1 against their surface; pages never write a chart hex literal. These are data colours, not UI colours: they appear as swatch dots, chart lines and bars, never as button or surface fills. Legend and marker labels are set in ink, not in the series colour, because several data colours fall below 4.5:1 as text.

### Named Rules
**The One Voice Rule.** Ledger Teal is the only colour that signals "you can act here." Data and semantic colours never appear on buttons, links or nav.

**The Meaning-Only Rule.** Green, rose and amber are reserved for gain, cost and caution. A number turns green or rose only because of what it means, never for emphasis.

**The Twin Palette Rule.** Every colour role has a light and a dark value with the same meaning. A new colour isn't done until both exist; Recharts gets the concrete hex values through `useChartTheme()`, not CSS variables.

## Typography

**Body Font:** Inter Variable, self-hosted (with ui-sans-serif, system-ui, Segoe UI, Roboto fallback)

**Character:** One neutral sans for everything, carried by weight and size rather than by a second family. Inter Variable is self-hosted from the `@fontsource-variable/inter` package (imported in `src/main.tsx`, `font-display: swap`, split by script so visitors download only the latin file, about 48 kB). No font is fetched from a third party, which keeps the "nothing is sent anywhere" promise. The system fonts after it in the stack are only a fallback while it loads.

### Hierarchy
- **Display** (700, 3rem from 640px up, 1.875rem below; tight tracking): the Home hero line only.
- **Headline** (700, 1.875rem from 640px up, 1.5rem below; tight tracking): one page title per calculator (`PageHeader`).
- **Title** (600, 1rem): card titles. Home cards and section headings step up to 1.125rem.
- **Figure** (600, 1.25rem, tabular numerals): stat-tile values. Coloured by the Meaning-Only Rule.
- **Body** (400, 0.875rem): inputs, buttons, nav, tables, explanatory text. Page intros run at the base size (1rem, muted); the Home lede is 1.125rem. Every paragraph is capped at 34em (about 75 characters of Inter) with `text-wrap: pretty` (a base rule in `src/index.css`).
- **Label** (500, 0.75rem): stat labels, field hints, chip metadata, the footer disclaimer. Field labels use 0.875rem at 500.

### Named Rules
**The Tabular Rule.** Every number a user compares (inputs, stat values, tables, chip metadata) uses tabular numerals (`.tabular`). Proportional digits in a money column are a bug.

**The Sentence Lead Rule.** The headline result is written as a plain sentence ("After 30 years, X ends up $209,821 ahead of Y.") at 1.125rem in its own card, with only the fund names and the key figure in bold. Lead with the consequence in words; tiles and charts follow.

## Layout

A centred container (max 1280px) with a 16px side gutter, a sticky header and a muted footer disclaimer. Calculator pages use a two-column grid from 1024px up: a fixed ~22rem input column on the left and a fluid results column on the right (20px gap). Below 1024px everything stacks, inputs first. Within cards, fields sit in a 2-column grid with 12px gaps, and stat tiles reflow from 2 to 3 columns as width allows.

Spacing follows a 4px base: 12px between fields and tiles, 16–20px card padding (16px on phones, 20px from 640px up), 24px below page headers, 40px between Home sections. The header nav scrolls sideways on narrow screens and keeps the current link in view; it never wraps. Long fund names and notes wrap anywhere rather than overflowing. The layout must reflow cleanly to 375px.

**The Inputs-Left Rule.** On wide screens, inputs stay in the left column and results stay right, on every calculator. A visitor moving between calculators always knows where to look.

## Elevation & Depth

Flat at rest, lift on intent. Depth comes from tonal layering (paper ground → white surface → mist tiles) and hairline borders, not shadows. Shadows appear only in response to intent or for things that float above the page.

### Shadow Vocabulary
- **Selection nudge** (`shadow-sm`, `0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): the selected option in a segmented control, raising it off its mist track.
- **Intent lift** (`shadow-lg`, `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`, with a 2px upward translate and a teal border): hover on navigational cards (the Home calculator cards).
- **Overlay** (`shadow-2xl`, `0 25px 50px -12px rgb(0 0 0 / 0.25)`, over a 50% black backdrop): the Fund Editor dialog.
- **Header glass**: the sticky header uses its surface colour at 90% with backdrop blur and a hairline bottom border; no shadow.

### Named Rules
**The Flat-By-Default Rule.** No card or input carries a shadow at rest. If something lifts, it is because the user is reaching for it or because it is floating over the page.

## Shapes

Soft, consistent rounding with no sharp corners and no decorative geometry. Controls (buttons, inputs, selects, nav links, stat tiles, notices) use 8px. Containers (cards, details panels, dialog, Home cards) use 12px. Segmented-control options use 6px to nest inside their 8px track. Fund chips use 16px so they read as pills that can still wrap to two lines. Swatches, step badges, the avatar and skill tags are full circles or pills. Borders are always 1px hairlines; the one dashed border marks the "+ New fund" affordance. Icons are simple 2px-stroke SVG line icons on a 24px grid (round caps and joins), usually set in a soft-teal 8px tile; never Unicode glyphs or emoji standing in for an icon.

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
- **Shadow Strategy:** none at rest (see Flat-By-Default); Home cards take the Intent lift on hover.
- **Border:** 1px hairline. Outcome cards may tint with the winner's colour at low opacity (teal soft at 40%, or indigo at 10% with a 40% border).
- **Internal Padding:** 16px on phones, 20px from 640px up. Card titles sit 12px above content with an optional right-aligned action.

### Stat tiles
The signature result unit. An 8px-rounded tile on Surface Mist at 50% with a hairline border and 12px padding: a muted label, a Figure-size tabular value (coloured by meaning), and an optional muted sub-line ("35.8% of what you'd have").

### Inputs / Fields
- **Style:** 8px-rounded box, hairline border on surface; 8px × 12px text padding; label above (0.875rem, 500), muted hint below (0.75rem). Prefix ($) and suffix (%, yrs) units sit inside the box in muted text. Number spinners are removed.
- **Focus:** border turns Ledger Teal with a 2px teal ring at 25% opacity, applied to the whole box (`focus-within`).
- **Disabled / computed:** Surface Mist fill with muted text.

### Segmented control
A mist track with a hairline border and 2px inset; options are 6px-rounded, muted at rest, and the selected one becomes a surface "key" with the Selection nudge shadow. Used for Future $ / Today's $ and similar binary or ternary toggles; exposed as a radiogroup.

### Navigation
A sticky 90%-opaque header with backdrop blur and a hairline bottom border. Left: the teal logo tile with a white rising line, plus the wordmark from 640px up. Centre: text nav links (body, 500, 8px-rounded); inactive links are muted with a mist hover, and the active link gets the Teal Soft wash with ink text. Right: a compact region select (flag + currency) and a theme cycle button with 16px SVG line icons (half-filled circle for system, sun, moon). On phones the link row scrolls horizontally.

### Notice
A full-width Caution Amber panel (8px, 12px × 16px) with dark amber ink and an optional right-aligned action. It is used for shared-fund imports and input warnings.

### Tables and details
Disclosure panels (`Details`) are 12px cards whose summary row has a muted 16px SVG chevron that rotates 90° when open; the body is separated by a hairline. Tables use tabular numerals, a sticky surface header with a hairline under it, zebra rows on mist at 40%, left-aligned first column and right-aligned figures, capped at ~28rem tall with internal scroll. Every chart has a table or stat equivalent.

### Charts
Recharts on the same palette: hairline-coloured grid, muted axis text, an 8px-rounded tooltip on surface with a hairline border, 2.5px series lines without dots for long horizons, and a dashed muted line for "contributed." Reference markers (Break-even, PMI ends) use a labelled dot or line in the relevant series colour.

## Do's and Don'ts

### Do:
- **Do** keep Ledger Teal as the only accent for interactive and selected states, and use the soft wash rather than the full fill for selection.
- **Do** set every compared number in tabular numerals and right-align figures in tables.
- **Do** lead each result with a plain sentence, then stat tiles, then the chart, then the table.
- **Do** define every new colour as a light/dark pair in `src/index.css`, and pass concrete hex values to charts through `useChartTheme()`.
- **Do** keep surfaces flat with 1px hairline borders; reserve lift for hover on navigational cards and shadow for overlays.
- **Do** use 8px corners on controls and 12px on containers.
- **Do** make sure every chart's key figures also appear as text or in a table.

### Don't:
- **Don't** use green, rose or amber for emphasis or decoration; they mean gain, cost and caution only.
- **Don't** put data colours (fund swatches, chart series) on buttons, links or surfaces.
- **Don't** add shadows to cards or inputs at rest.
- **Don't** introduce a second typeface or a display font; hierarchy comes from weight and size.
- **Don't** use `var(--…)` for Recharts SVG attributes; they need concrete hex values.
- **Don't** let long fund names or notes overflow; wrap them.
