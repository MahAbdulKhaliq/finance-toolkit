import {
  CA_INSURED_MAX_AMORTIZATION,
  canadaMinimumDown,
  cmhcPremiumRate,
  monthlyPayment,
  monthlyRate,
  type Compounding,
} from './mortgage';

export interface RentVsBuyInput {
  region: 'CA' | 'US';
  years: number;
  // Buy
  price: number;
  downPayment: number;
  mortgageRate: number;
  amortizationYears: number;
  propertyTaxRate: number; // annual, share of home value
  homeInsurance: number; // annual $
  maintenanceRate: number; // annual, share of home value
  hoaMonthly: number;
  buyClosingRate: number; // share of price
  sellingCostRate: number; // share of sale price
  appreciation: number;
  pmiRate: number; // US only, annual share of original loan
  // Rent
  rent: number;
  rentIncrease: number;
  rentersInsurance: number; // annual $
  // Shared
  investReturn: number; // net of fees
  inflation: number; // grows insurance and HOA/condo fees
}

export interface RentVsBuyYear {
  year: number;
  homeValue: number;
  mortgageBalance: number;
  buyerPortfolio: number;
  renterPortfolio: number;
  buyerNetWorth: number;
  renterNetWorth: number;
  // Cash spent during the year
  interest: number;
  principal: number;
  propertyTax: number;
  maintenance: number;
  insurance: number;
  hoa: number;
  mortgageInsurance: number;
  rent: number;
  buyerSpend: number;
  renterSpend: number;
}

export interface RentVsBuyResult {
  years: RentVsBuyYear[];
  loanAmount: number;
  cmhcPremium: number;
  /** CMHC premium rate applied to the loan (CA), 0 if not insured. */
  cmhcPremiumRate: number;
  /** Month (1-based) of the last PMI charge before it drops off (US), or null if none/never. */
  pmiEndMonth: number | null;
  monthlyMortgage: number;
  closingCosts: number;
  /** First year in which buying's net worth catches up with renting's, or null. */
  breakEvenYear: number | null;
  warnings: string[];
}

/**
 * Month-by-month comparison. Both households spend the same cash each month: whichever side's
 * housing costs are lower invests the difference in the chosen fund. The renter starts by
 * investing what the buyer spent on the down payment and closing costs.
 */
export function rentVsBuy(inp: RentVsBuyInput): RentVsBuyResult {
  const warnings: string[] = [];
  const down = Math.min(Math.max(inp.downPayment, 0), inp.price);
  const downRatio = inp.price > 0 ? down / inp.price : 0;
  const baseLoan = inp.price - down;
  let cmhcPremium = 0;
  let premiumRate = 0;
  let pmiMonthly = 0;
  let pmiEndMonth: number | null = null;

  if (inp.region === 'CA') {
    const minDown = canadaMinimumDown(inp.price);
    if (down + 0.5 < minDown) {
      warnings.push(
        `Down payment is below the Canadian minimum of $${Math.round(minDown).toLocaleString('en-CA')}.`,
      );
    }
    if (downRatio < 0.2) {
      if (inp.price >= 1_500_000) {
        warnings.push('Homes priced at $1.5M or more cannot be insured; at least 20% down is required.');
      } else {
        premiumRate = cmhcPremiumRate(downRatio, inp.amortizationYears);
        cmhcPremium = baseLoan * premiumRate;
        if (inp.amortizationYears > CA_INSURED_MAX_AMORTIZATION) {
          warnings.push(
            `Insured mortgages (under 20% down) can be amortized over at most ${CA_INSURED_MAX_AMORTIZATION} years.`,
          );
        }
      }
    }
  } else if (downRatio < 0.2) {
    pmiMonthly = (baseLoan * inp.pmiRate) / 12;
  }

  const loan = baseLoan + cmhcPremium;
  const compounding: Compounding = inp.region === 'CA' ? 'semiannual' : 'monthly';
  const i = monthlyRate(inp.mortgageRate, compounding);
  const n = Math.round(inp.amortizationYears * 12);
  const pmt = monthlyPayment(loan, i, n);
  const closingCosts = inp.price * inp.buyClosingRate;

  const appM = Math.pow(1 + inp.appreciation, 1 / 12) - 1;
  const invM = Math.pow(1 + inp.investReturn, 1 / 12) - 1;

  let home = inp.price;
  let bal = loan;
  let buyerPf = 0;
  let renterPf = down + closingCosts;
  const rows: RentVsBuyYear[] = [];
  const years = Math.max(1, Math.round(inp.years));

  for (let y = 0; y < years; y++) {
    const infl = Math.pow(1 + inp.inflation, y);
    const rentM = inp.rent * Math.pow(1 + inp.rentIncrease, y);
    const acc = { interest: 0, principal: 0, tax: 0, maint: 0, ins: 0, hoa: 0, mi: 0, rent: 0, buy: 0 };

    for (let m = 0; m < 12; m++) {
      let interest = 0;
      let principal = 0;
      if (bal > 0.005) {
        interest = bal * i;
        principal = Math.min(pmt - interest, bal);
        bal -= principal;
      }
      const tax = (home * inp.propertyTaxRate) / 12;
      const maint = (home * inp.maintenanceRate) / 12;
      const ins = (inp.homeInsurance / 12) * infl;
      const hoa = inp.hoaMonthly * infl;
      // PMI is charged on this month's starting balance; it stops once the loan reaches 78% of price.
      const mi = pmiMonthly > 0 && (bal + principal) / inp.price > 0.78 ? pmiMonthly : 0;
      if (mi > 0) pmiEndMonth = y * 12 + m + 1;
      const buyCost = interest + principal + tax + maint + ins + hoa + mi;
      const rentCost = rentM + (inp.rentersInsurance / 12) * infl;

      // Portfolios grow, then whoever spent less this month invests the difference.
      buyerPf *= 1 + invM;
      renterPf *= 1 + invM;
      const diff = buyCost - rentCost;
      if (diff > 0) renterPf += diff;
      else buyerPf -= diff;
      home *= 1 + appM;

      acc.interest += interest;
      acc.principal += principal;
      acc.tax += tax;
      acc.maint += maint;
      acc.ins += ins;
      acc.hoa += hoa;
      acc.mi += mi;
      acc.rent += rentCost;
      acc.buy += buyCost;
    }

    rows.push({
      year: y + 1,
      homeValue: home,
      mortgageBalance: Math.max(0, bal),
      buyerPortfolio: buyerPf,
      renterPortfolio: renterPf,
      buyerNetWorth: home * (1 - inp.sellingCostRate) - Math.max(0, bal) + buyerPf,
      renterNetWorth: renterPf,
      interest: acc.interest,
      principal: acc.principal,
      propertyTax: acc.tax,
      maintenance: acc.maint,
      insurance: acc.ins,
      hoa: acc.hoa,
      mortgageInsurance: acc.mi,
      rent: acc.rent,
      buyerSpend: acc.buy,
      renterSpend: acc.rent,
    });
  }

  const be = rows.find((r) => r.buyerNetWorth >= r.renterNetWorth);
  return {
    years: rows,
    loanAmount: loan,
    cmhcPremium,
    cmhcPremiumRate: premiumRate,
    // Only report an end if PMI actually stopped within the horizon.
    pmiEndMonth: pmiEndMonth !== null && pmiEndMonth < years * 12 ? pmiEndMonth : null,
    monthlyMortgage: pmt,
    closingCosts,
    breakEvenYear: be ? be.year : null,
    warnings,
  };
}
