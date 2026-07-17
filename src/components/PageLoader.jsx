export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-(--border-soft) border-t-sky-500"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}
