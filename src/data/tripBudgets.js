// Rough daily per-person cost estimates in USD, by travel style, for each
// destination. Covers accommodation + food + local transport + one
// activity/day — NOT flights, which vary too much by origin city to
// estimate meaningfully here.
//
// These are indicative planning figures based on general typical-traveler
// costs, not live pricing data — actual costs shift with season, exact
// dates, and personal spending habits. The UI must make this clear rather
// than presenting numbers as precise quotes.
export const tripBudgets = {
  paris: { budget: 65, midRange: 160, luxury: 380 },
  tokyo: { budget: 60, midRange: 150, luxury: 350 },
  dubai: { budget: 80, midRange: 200, luxury: 450 },
  sydney: { budget: 75, midRange: 190, luxury: 420 },
  'new-york': { budget: 90, midRange: 220, luxury: 480 },
  'rio-de-janeiro': { budget: 30, midRange: 75, luxury: 180 },
  spain: { budget: 45, midRange: 110, luxury: 250 },
  italy: { budget: 55, midRange: 140, luxury: 320 },
  turkiye: { budget: 30, midRange: 70, luxury: 170 },
  mexico: { budget: 30, midRange: 75, luxury: 180 },
  'united-kingdom': { budget: 75, midRange: 190, luxury: 420 },
  germany: { budget: 55, midRange: 135, luxury: 300 },
  greece: { budget: 45, midRange: 105, luxury: 240 },
  austria: { budget: 55, midRange: 135, luxury: 300 },
  thailand: { budget: 20, midRange: 50, luxury: 130 },
  'saudi-arabia': { budget: 55, midRange: 140, luxury: 320 },
  portugal: { budget: 35, midRange: 90, luxury: 210 },
  malaysia: { budget: 22, midRange: 55, luxury: 140 },
  netherlands: { budget: 65, midRange: 165, luxury: 370 },
  'hong-kong': { budget: 60, midRange: 150, luxury: 350 },
  india: { budget: 18, midRange: 45, luxury: 120 },
  vietnam: { budget: 18, midRange: 45, luxury: 120 },
  'south-korea': { budget: 45, midRange: 115, luxury: 260 },
  singapore: { budget: 55, midRange: 140, luxury: 320 },
  croatia: { budget: 40, midRange: 100, luxury: 230 },
  indonesia: { budget: 22, midRange: 55, luxury: 140 },
  poland: { budget: 30, midRange: 75, luxury: 175 },
  canada: { budget: 60, midRange: 150, luxury: 340 },
  switzerland: { budget: 90, midRange: 230, luxury: 500 },
  ireland: { budget: 65, midRange: 165, luxury: 370 },
  morocco: { budget: 25, midRange: 65, luxury: 160 },
  egypt: { budget: 20, midRange: 50, luxury: 130 },
};

// Rough split of the daily total across categories, purely illustrative —
// used to break the estimate into a visual chart, not a claim of precision.
export const BUDGET_SPLIT = {
  accommodation: 0.4,
  food: 0.28,
  transport: 0.14,
  activities: 0.18,
};

export const TIERS = [
  { key: 'budget', label: 'Budget', desc: 'Hostels, street food, public transport' },
  { key: 'midRange', label: 'Mid-range', desc: '3-star hotels, sit-down meals, some tours' },
  { key: 'luxury', label: 'Luxury', desc: '4-5 star stays, fine dining, private transport' },
];
