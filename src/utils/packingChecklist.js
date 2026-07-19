// Builds a packing checklist purely from fields already on the destination
// object — keyword-matches mustTryExperiences/mustTryFood/tag/themes against
// a small rule set, plus a universal baseline everyone needs. This is
// honest pattern-matching, not an AI guess: every suggestion traces back to
// something actually listed on that destination's guide.

const KEYWORD_RULES = [
  { pattern: /dive|diving|snorkel|reef|coral/i, items: ['Snorkel/dive gear (or check rental options)', 'Reef-safe sunscreen'] },
  { pattern: /hik|trek|trail|mountain|alpine/i, items: ['Sturdy hiking boots', 'Daypack'] },
  { pattern: /ski|snow|glacier/i, items: ['Warm layers', 'Waterproof gloves'] },
  { pattern: /beach|island|lagoon|coast/i, items: ['Swimwear', 'Sandals'] },
  { pattern: /desert|safari|dune/i, items: ['Sun protection (hat, scarf)', 'Reusable water bottle'] },
  { pattern: /temple|mosque|church|shrine|palace|cathedral/i, items: ['Modest clothing (shoulders/knees covered)'] },
  { pattern: /market|street food|night market|bazaar/i, items: ['Small cash bills', 'Reusable tote bag'] },
  { pattern: /rain|monsoon|waterfall/i, items: ['Light rain jacket'] },
];

const BASELINE = [
  'Passport (valid 6+ months from travel date)',
  'Universal power adapter',
  'Phone charger and a power bank',
  'Basic first-aid kit',
  'Digital + printed copies of key documents',
];

export function buildPackingChecklist(destination) {
  if (!destination) return [];

  const searchText = [
    destination.tag,
    destination.themes?.join(' '),
    destination.mustTryExperiences?.join(' '),
    destination.mustTryFood?.join(' '),
  ]
    .filter(Boolean)
    .join(' ');

  const matched = new Set();
  KEYWORD_RULES.forEach(({ pattern, items }) => {
    if (pattern.test(searchText)) {
      items.forEach((item) => matched.add(item));
    }
  });

  const items = [...BASELINE];

  if (destination.currency) {
    items.push(`Some cash in ${destination.currency}`);
  }
  if (destination.visaNote) {
    items.push('Visa documents / entry paperwork for your nationality');
  }

  items.push(...matched);

  return items;
}
