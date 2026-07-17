import { useState } from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import { destinations } from '../data/destinations';
import DestinationCard from './DestinationCard';

const SCENERY_OPTIONS = [
  { value: 'beaches', label: 'Beaches & Islands' },
  { value: 'mountains', label: 'Mountains & Adventure' },
  { value: 'culture', label: 'City & Culture' },
  { value: 'food-nightlife', label: 'Food & Nightlife' },
];

const LENGTH_OPTIONS = [
  { value: 'short', label: 'A quick trip (up to a week)' },
  { value: 'long', label: 'A longer adventure (a week or more)' },
];

const DENSITY_OPTIONS = [
  { value: 'light', label: 'Just the essentials' },
  { value: 'packed', label: 'As much as possible' },
];

function parseAvgDays(idealStay) {
  const nums = (idealStay?.match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return 6;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// Scores every destination against the three answers and returns the top
// matches — themes are weighted highest since that's the strongest signal,
// with trip length and activity density as honest tiebreakers pulled from
// real fields already on each destination (idealStay, mustTryExperiences).
function scoreDestinations({ scenery, length, density }) {
  return destinations
    .map((d) => {
      let score = 0;
      if (d.themes?.includes(scenery)) score += 3;

      const avgDays = parseAvgDays(d.idealStay);
      const isShort = avgDays <= 6.5;
      if ((length === 'short' && isShort) || (length === 'long' && !isShort)) score += 1;

      const expCount = d.mustTryExperiences?.length || 0;
      const isLight = expCount <= 6;
      if ((density === 'light' && isLight) || (density === 'packed' && !isLight)) score += 1;

      return { destination: d, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.destination);
}

function QuestionBlock({ title, options, value, onChange }) {
  return (
    <div>
      <p className="text-sm font-medium text-(--text-primary)">{title}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
              value === opt.value
                ? 'border-(--border-mid) bg-(--surface-card-hover) text-(--text-primary)'
                : 'border-(--border-soft) text-(--text-secondary) hover:border-(--border-mid)'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DestinationQuiz() {
  const [scenery, setScenery] = useState(null);
  const [length, setLength] = useState(null);
  const [density, setDensity] = useState(null);
  const [results, setResults] = useState(null);

  const canSubmit = scenery && length && density;

  function handleSubmit() {
    if (!canSubmit) return;
    setResults(scoreDestinations({ scenery, length, density }));
  }

  function reset() {
    setScenery(null);
    setLength(null);
    setDensity(null);
    setResults(null);
  }

  return (
    <div className="rounded-3xl border border-(--border-soft) bg-(--surface-card) p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Compass size={18} className="text-sky-400" />
        <h2 className="font-display text-lg font-semibold text-(--text-primary)">
          Not sure where to go?
        </h2>
      </div>
      <p className="mt-1.5 text-sm text-(--text-secondary)">
        Answer three quick questions and we'll match you against real Voyora guides.
      </p>

      {results === null ? (
        <div className="mt-6 space-y-6">
          <QuestionBlock
            title="What kind of scenery are you after?"
            options={SCENERY_OPTIONS}
            value={scenery}
            onChange={setScenery}
          />
          <QuestionBlock
            title="How long do you want to travel?"
            options={LENGTH_OPTIONS}
            value={length}
            onChange={setLength}
          />
          <QuestionBlock
            title="How much do you want to fit in?"
            options={DENSITY_OPTIONS}
            value={density}
            onChange={setDensity}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="btn-gradient w-full rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
          >
            Find my destination
          </button>
        </div>
      ) : (
        <div className="page-transition mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-(--text-primary)">Your best matches</p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)"
            >
              <RotateCcw size={12} />
              Retake quiz
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {results.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
