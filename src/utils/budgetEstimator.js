import { tripBudgets, BUDGET_SPLIT } from '../data/tripBudgets';

// Parses idealStay strings like "4–6 days" or "5-7 days" into a reasonable
// default number of days (the midpoint), falling back to 5 if the format
// doesn't match — this only ever seeds the day input, never blocks it.
export function parseIdealStayDays(idealStay) {
  if (!idealStay) return 5;
  const match = String(idealStay).match(/(\d+)\s*[–-]\s*(\d+)/);
  if (match) {
    const low = parseInt(match[1], 10);
    const high = parseInt(match[2], 10);
    return Math.round((low + high) / 2);
  }
  const single = String(idealStay).match(/(\d+)/);
  return single ? parseInt(single[1], 10) : 5;
}

// Computes a rough trip cost estimate. Returns null if the slug has no
// budget data yet, so the UI can handle that explicitly rather than
// silently showing $0.
export function estimateTripCost({ slug, days, travelers, tier }) {
  const rates = tripBudgets[slug];
  if (!rates) return null;

  const safeDays = Math.max(1, Number(days) || 1);
  const safeTravelers = Math.max(1, Number(travelers) || 1);
  const perPersonPerDay = rates[tier] ?? rates.midRange;

  const perDayTotal = perPersonPerDay * safeTravelers;
  const totalUSD = perDayTotal * safeDays;

  const breakdown = Object.fromEntries(
    Object.entries(BUDGET_SPLIT).map(([category, share]) => [
      category,
      Math.round(totalUSD * share),
    ])
  );

  return {
    perPersonPerDay,
    perDayTotal: Math.round(perDayTotal),
    totalUSD: Math.round(totalUSD),
    days: safeDays,
    travelers: safeTravelers,
    breakdown,
  };
}
