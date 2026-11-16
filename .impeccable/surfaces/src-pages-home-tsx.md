---
version: 1
slug: "src-pages-home-tsx"
primary_target: "src/pages/Home.tsx"
related_targets: []
---

## Scope
Home page (`src/pages/Home.tsx`, route `/`). Mode: Persuade. This is the first surface of a site-wide redesign; the calculators adopt the world later.

## Audience and job
Portfolio reviewers first (the user chose "be impressed by the craft"); people making CA/US money decisions second. The visitor should see a connected, carefully built system and step into a calculator.

## Must keep
- All four calculators reachable from Home (Growth & Fees, CAGR, Rent vs. Buy, Retirement).
- The fund-library story ("define once, use everywhere") with the My Funds link and live saved count.

## Must not feel like
A bank or broker; a page so foreign that the calculators feel like another site.

## Direction contract
THESIS: The fund library is a transit line, and every calculator is a station on it. Refuses the category default of a hero headline over four identical icon cards.

OWN-WORLD: White enamel ground; one bold Ledger Teal line (#0f766e) drawn in 45° diagram geometry; black station rings and a pill interchange; secondary fund lines in each fund's own colour; heavy black grotesque station names (Inter at 800). Recognisable with all content removed: thick teal line, ring stations, pill interchange.

STORY: The visitor sees that one fund travels through four tools, understands that My Funds is where it starts, and boards a calculator station.

FIRST VIEWPORT: Top-left: the headline "Small numbers, big decisions." at about 76px, with a one-sentence lede under it. Behind and right: the teal line crossing the full width through four stations (Growth & Fees, CAGR, Rent vs. Buy, Retirement), with the My Funds interchange in the middle carrying the "Start here" badge and the saved-fund count. Branch lines in the starter funds' colours join at the interchange; a fund legend sits in the lower-right band (bottom-left holds the Growth & Fees label; moved at finish review). Each station is a working link; the primary action is the Growth & Fees station plus the interchange badge.

FORM: Transit network diagram, position 1 on the ordered grounded list (chosen as Impeccable's pick). seed:0cbf31ac172546e0. Code-led build; the chosen sketch is `.impeccable/sketches/decision/model-pick.html`. Signature interaction: hovering or focusing a station lights its stretch of line and shows its one-line question; the line draws itself once on load (static under reduced motion). Mobile: the line turns vertical, a stop list down the page.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
