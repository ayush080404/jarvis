// Approximate reference exchange rates (units of local currency per 1 USD).
// These are NOT live rates — just reasonable ballpark figures so the Budget
// Estimator can show a local-currency figure alongside USD. Rates like
// TRY and EGP move a lot; treat this purely as "roughly this many," and
// point people to a live converter for anything that actually matters
// (booking, paying, budgeting to the dollar).
export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', rateFromUSD: 1 },
  EUR: { symbol: '€', name: 'Euro', rateFromUSD: 0.92 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rateFromUSD: 1.36 },
  AED: { symbol: 'AED', name: 'UAE Dirham', rateFromUSD: 3.67 },
  EGP: { symbol: 'E£', name: 'Egyptian Pound', rateFromUSD: 49 },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', rateFromUSD: 7.8 },
  INR: { symbol: '₹', name: 'Indian Rupee', rateFromUSD: 83.5 },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', rateFromUSD: 15800 },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', rateFromUSD: 4.7 },
  MXN: { symbol: '$', name: 'Mexican Peso', rateFromUSD: 18 },
  MAD: { symbol: 'MAD', name: 'Moroccan Dirham', rateFromUSD: 10 },
  PLN: { symbol: 'zł', name: 'Polish Złoty', rateFromUSD: 4.0 },
  SAR: { symbol: 'SAR', name: 'Saudi Riyal', rateFromUSD: 3.75 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', rateFromUSD: 1.35 },
  KRW: { symbol: '₩', name: 'South Korean Won', rateFromUSD: 1370 },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', rateFromUSD: 0.88 },
  AUD: { symbol: 'AUD', name: 'Australian Dollar', rateFromUSD: 1.53 },
  THB: { symbol: '฿', name: 'Thai Baht', rateFromUSD: 35 },
  JPY: { symbol: '¥', name: 'Japanese Yen', rateFromUSD: 155 },
  TRY: { symbol: '₺', name: 'Turkish Lira', rateFromUSD: 34 },
  GBP: { symbol: '£', name: 'British Pound', rateFromUSD: 0.79 },
  VND: { symbol: '₫', name: 'Vietnamese Dong', rateFromUSD: 25400 },
  BRL: { symbol: 'R$', name: 'Brazilian Real', rateFromUSD: 5.4 },
};

// Maps each destination slug to its currency code. Several destinations
// share a currency (the Euro, mainly), so this is kept separate from
// CURRENCIES rather than duplicating the rate on every destination.
export const slugToCurrency = {
  austria: 'EUR',
  canada: 'CAD',
  croatia: 'EUR',
  dubai: 'AED',
  egypt: 'EGP',
  germany: 'EUR',
  greece: 'EUR',
  'hong-kong': 'HKD',
  india: 'INR',
  indonesia: 'IDR',
  ireland: 'EUR',
  italy: 'EUR',
  malaysia: 'MYR',
  mexico: 'MXN',
  morocco: 'MAD',
  netherlands: 'EUR',
  'new-york': 'USD',
  paris: 'EUR',
  poland: 'PLN',
  portugal: 'EUR',
  'rio-de-janeiro': 'BRL',
  'saudi-arabia': 'SAR',
  singapore: 'SGD',
  'south-korea': 'KRW',
  spain: 'EUR',
  switzerland: 'CHF',
  sydney: 'AUD',
  thailand: 'THB',
  tokyo: 'JPY',
  turkiye: 'TRY',
  'united-kingdom': 'GBP',
  vietnam: 'VND',
};

// Converts a USD amount into the destination's local currency and formats
// it with the right symbol and rounding (0-value currencies like JPY/IDR/VND
// don't use decimals; per-unit values are large enough that cents are noise
// anyway for a rough estimate).
export function formatLocalAmount(usdAmount, slug) {
  const code = slugToCurrency[slug];
  const currency = CURRENCIES[code];
  if (!currency) return null;

  const converted = usdAmount * currency.rateFromUSD;
  const rounded =
    converted >= 1000 ? Math.round(converted / 10) * 10 : Math.round(converted);

  return { code, symbol: currency.symbol, amount: rounded };
}
