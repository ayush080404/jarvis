import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }) {
  return (
    <div className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-10 text-center">
      {Icon && (
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-(--surface-card-hover) text-(--text-secondary)">
          <Icon size={20} />
        </span>
      )}
      <p className="text-(--text-primary)">{title}</p>
      {description && <p className="mt-1.5 text-sm text-(--text-secondary)">{description}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
