# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally:

- **People in Canada and the US making long-horizon money decisions.** They are choosing between funds with different fees, deciding whether to buy a home or keep renting, or estimating when they could retire. They usually arrive with one question and benefit from carrying their assumptions (their funds) into the next one.
- **Portfolio reviewers** (recruiters, hiring managers, other developers) assessing Mahmood Abdul-Khaliq's work. They skim, try a calculator or two, and check the About and Methodology pages and the source code.

The tool has to be genuinely useful to the first group, and that usefulness is what impresses the second.

## Product Purpose

Finance Toolkit is a set of four connected calculators (Growth & Fees, CAGR, Rent vs. Buy, Retirement) tied together by a shared fund library. It exists to make the hidden long-term cost of everyday money decisions visible: fees that quietly compound, the opportunity cost of a down payment, how a savings rate or a fee moves a retirement date.

Success means a visitor leaves with clearer intuition about a trade-off they are facing, not a single "answer" to act on.

## Positioning

Most finance calculators answer one question in isolation. Here, a fund defined once (or created from a historical CAGR) is reused across every calculator: compared on fees, held by the renter in Rent vs. Buy, and used for retirement savings. Canadian and US rules are both first-class, with real mechanical differences (semi-annual mortgage compounding and CMHC vs. monthly compounding and PMI), not just a currency swap.

## Operating Context

- A static site on GitHub Pages with hash routes; there are no accounts.
- The fund library and settings live in the visitor's browser (localStorage). Scenarios are shared as links that embed their inputs and the funds they use; opening one offers to import those funds.
- A region toggle (Canada / US) and a "today's dollars" toggle apply across calculators. Light and dark mode are supported.
- The Methodology page documents every formula and assumption; the About page introduces the author and the project.

## Capabilities and Constraints

- **No backend, data stays local.** Nothing is sent to a server; sharing happens only through the URL.
- **Not financial advice.** Results are educational estimates from simplified models. The product never recommends real financial products; starter funds use generic names, not tickers. Methodology must stay transparent and match the code.
- **CA and US parity.** Both regions remain fully supported. The region toggle changes rules, labels and formatting, never the user's numbers.
- Calculation logic is pure, unit-tested TypeScript checked against known reference values.
- Terminology follows the region: "MER" in Canada, "expense ratio" in the US.
- Not modeled (stated, not hidden): taxes on investment gains and withdrawals, government benefits, mortgage-interest deductions, the US home-sale exclusion.

## Brand Commitments

- Name: **Finance Toolkit**. Author: Mahmood Abdul-Khaliq, linking to the portfolio site (https://mahabdulkhaliq.github.io) and GitHub (https://github.com/MahAbdulKhaliq).
- Voice: plain, direct and explanatory; no hype and no advice-giving.

## Evidence on Hand

- Live site: https://mahabdulkhaliq.github.io/finance-toolkit/
- README screenshots: `docs/growth.png`, `docs/rent-vs-buy.png`.
- Reference-value unit tests in `src/lib/finance/` (e.g. US $300k at 6% over 30 years = $1,798.65/month).
- There are no testimonials, user counts, press or usage analytics. Future work must not invent any.

## Product Principles

1. **Show the cost you can't see.** Lead with the long-term consequence (fees plus lost growth, opportunity cost), not just the immediate number.
2. **Define once, use everywhere.** The fund library is the connective tissue; new features should read from it and feed back into it.
3. **Transparent over authoritative.** Every number can be traced to a documented formula; assumptions are stated where they matter.
4. **Private by construction.** No accounts, no tracking of inputs, no server.
5. **Two regions, one product.** A feature isn't done until it is correct for both Canada and the US.

## Accessibility & Inclusion

WCAG 2.2 AA: full keyboard operation, visible focus, reflow down to phone width (long text wraps rather than overflowing), and sufficient contrast in both light and dark mode. Charts must not be the only way to read a result; key figures also appear as text and in tables.
