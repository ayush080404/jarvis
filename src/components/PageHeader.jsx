export default function PageHeader({ icon: Icon, eyebrow, title, subtitle }) {
  return (
    <div className="relative overflow-hidden">
      <div className="starfield" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl transition-opacity duration-500"
        style={{ opacity: 'var(--hero-glow-opacity)' }}
      />
      <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-32 text-center lg:px-10 lg:pt-40">
        {Icon && (
          <span className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-(--glass-border) bg-(--glass-b) text-sky-400 backdrop-blur">
            <Icon size={24} />
          </span>
        )}
        {eyebrow && (
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-500">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-(--text-primary) sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-lg text-(--text-secondary)">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
