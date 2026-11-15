export type RegionCode = 'CA' | 'US';

export interface RegionConfig {
  code: RegionCode;
  label: string;
  flag: string;
  locale: string;
  currency: string;
  feeLabel: string; // "MER" | "Expense ratio"
  feeLabelInline: string; // for use mid-sentence

  feeLabelLong: string;
  mortgageCompounding: string;
  mortgageInsuranceLabel: string;
  closingCostsHint: string;
  defaults: {
    inflation: number;
    amortizationYears: number;
    mortgageRate: number;
    price: number;
    downPct: number;
    propertyTaxRate: number;
    homeInsurance: number;
    buyClosingRate: number;
    sellingCostRate: number;
    rent: number;
    rentersInsurance: number;
  };
}

export const REGIONS: Record<RegionCode, RegionConfig> = {
  CA: {
    code: 'CA',
    label: 'Canada',
    flag: '🇨🇦',
    locale: 'en-CA',
    currency: 'CAD',
    feeLabel: 'MER',
    feeLabelInline: 'MER',
    feeLabelLong: 'Management expense ratio (MER)',
    mortgageCompounding: 'Semi-annual compounding (Canadian standard)',
    mortgageInsuranceLabel: 'CMHC insurance premium',
    closingCostsHint: 'Legal fees, inspection and land transfer tax. ~1.5% + LTT; Ontario/Toronto buyers often pay 3–4%.',
    defaults: {
      inflation: 0.02,
      amortizationYears: 25,
      mortgageRate: 0.045,
      price: 750_000,
      downPct: 0.2,
      propertyTaxRate: 0.007,
      homeInsurance: 1_800,
      buyClosingRate: 0.03,
      sellingCostRate: 0.05,
      rent: 2_800,
      rentersInsurance: 300,
    },
  },
  US: {
    code: 'US',
    label: 'United States',
    flag: '🇺🇸',
    locale: 'en-US',
    currency: 'USD',
    feeLabel: 'Expense ratio',
    feeLabelInline: 'expense ratio',
    feeLabelLong: 'Expense ratio',
    mortgageCompounding: 'Monthly compounding (US standard)',
    mortgageInsuranceLabel: 'PMI',
    closingCostsHint: 'Lender fees, title insurance, escrow and recording. Typically 2–5% of the price.',
    defaults: {
      inflation: 0.025,
      amortizationYears: 30,
      mortgageRate: 0.065,
      price: 450_000,
      downPct: 0.2,
      propertyTaxRate: 0.011,
      homeInsurance: 2_000,
      buyClosingRate: 0.03,
      sellingCostRate: 0.06,
      rent: 2_300,
      rentersInsurance: 200,
    },
  },
};
