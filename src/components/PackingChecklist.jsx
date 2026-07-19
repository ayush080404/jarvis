import { useEffect, useState } from 'react';
import { Luggage, Check } from 'lucide-react';
import { buildPackingChecklist } from '../utils/packingChecklist';

export default function PackingChecklist({ destination }) {
  const items = buildPackingChecklist(destination);
  const storageKey = `voyora:packing:${destination.slug}`;
  const [checked, setChecked] = useState({});

  useEffect(() => {
    try {
      setChecked(JSON.parse(localStorage.getItem(storageKey) || '{}'));
    } catch {
      setChecked({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination.slug]);

  function toggle(item) {
    const next = { ...checked, [item]: !checked[item] };
    setChecked(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  if (items.length === 0) return null;

  const checkedCount = items.filter((i) => checked[i]).length;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Luggage size={18} style={{ color: destination.accentColor }} />
        <h2 className="font-display text-lg font-semibold text-(--text-primary)">
          Packing checklist
        </h2>
      </div>
      <p className="mt-1.5 text-sm text-(--text-secondary)">
        Built from this guide's activities and details — {checkedCount}/{items.length} packed.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => toggle(item)}
            className="flex items-start gap-3 rounded-xl border border-(--border-soft) bg-(--surface-card) p-3.5 text-left transition-colors hover:border-(--border-mid)"
          >
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                checked[item] ? 'border-transparent' : 'border-(--border-mid)'
              }`}
              style={checked[item] ? { backgroundColor: destination.accentColor } : undefined}
            >
              {checked[item] && <Check size={12} className="text-white" />}
            </span>
            <span
              className={`text-sm ${
                checked[item] ? 'text-(--text-secondary) line-through' : 'text-(--text-primary)'
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
