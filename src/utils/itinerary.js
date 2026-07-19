// Builds a simple, honest "starter itinerary" entirely from data already in
// the destination files — no AI involved. It's a quick data-driven summary,
// not a personalized AI-generated plan (that's what the AI Guide will do
// once it's wired up).

export const TRIP_STYLES = [
  { id: 'relaxed', label: 'Relaxed', desc: 'Fewer stops, more downtime' },
  { id: 'balanced', label: 'Balanced', desc: 'A steady, comfortable pace' },
  { id: 'packed', label: 'Packed', desc: 'See as much as possible' },
];

function parseIdealDays(idealStay) {
  if (!idealStay) return 5;
  const match = idealStay.match(/(\d+)/g);
  if (!match) return 5;
  const nums = match.map(Number);
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function daysBetween(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : null;
}

function buildLeg(destination, { tripLength, style, dayOffset = 0 }) {
  const places = destination.placesToVisit?.length
    ? destination.placesToVisit.map((p) => p.name)
    : destination.highlights || [];

  const densityMultiplier = style === 'packed' ? 1.5 : style === 'relaxed' ? 0.7 : 1;
  const perDay = Math.max(1, Math.round((places.length / tripLength) * densityMultiplier) || 1);
  const days = [];
  for (let i = 0; i < tripLength; i += 1) {
    const dayPlaces = places.slice(i * perDay, i * perDay + perDay);
    if (dayPlaces.length === 0 && i > 0) break;
    days.push({
      day: dayOffset + i + 1,
      places: dayPlaces.length > 0 ? dayPlaces : ['Free day — explore at your own pace'],
    });
  }

  return {
    destination,
    days,
    foodPicks: (destination.mustTryFood || []).slice(0, 5),
    experiencePicks: (destination.mustTryExperiences || []).slice(0, 4),
  };
}

export function buildItinerary(destination, { startDate, endDate, style } = {}) {
  if (!destination) return null;

  const tripLength = daysBetween(startDate, endDate) || parseIdealDays(destination.idealStay);
  const leg = buildLeg(destination, { tripLength, style });

  return {
    legs: [leg],
    totalDays: leg.days.length,
    style: style || 'balanced',
  };
}

// Chains 2-3 destinations into one continuous trip — each destination gets
// its own leg sized by its real idealStay field (date-range splitting across
// multiple legs isn't supported yet, so multi-destination trips always use
// each destination's own ideal length rather than a custom date range).
export function buildMultiItinerary(destinationList, { style } = {}) {
  if (!destinationList || destinationList.length === 0) return null;

  let dayOffset = 0;
  const legs = destinationList.map((destination) => {
    const tripLength = parseIdealDays(destination.idealStay);
    const leg = buildLeg(destination, { tripLength, style, dayOffset });
    dayOffset += leg.days.length;
    return leg;
  });

  return {
    legs,
    totalDays: dayOffset,
    style: style || 'balanced',
  };
}
