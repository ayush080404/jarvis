export default function SkeletonCard() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-2xl border border-(--border-soft) bg-(--surface-card)"
      aria-hidden="true"
    >
      <div className="h-36 w-full bg-(--surface-card-hover)" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-20 rounded bg-(--surface-card-hover)" />
        <div className="h-5 w-2/3 rounded bg-(--surface-card-hover)" />
        <div className="h-3 w-1/2 rounded bg-(--surface-card-hover)" />
      </div>
    </div>
  );
}
