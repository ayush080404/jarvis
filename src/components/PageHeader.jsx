export default function PageHeader({ icon: Icon, eyebrow, title, subtitle, images }) {
  if (images && images.length > 0) {
    return (
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-(--surface)">
        <div className="grid h-full grid-cols-4">
          {images.slice(0, 4).map((src) => (
            <img key={src} src={src} alt="" className="h-full w-full object-cover opacity-70" />
          ))}
        </div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to top, var(--surface) 5%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.25) 100%)',
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-24 text-center sm:pt-28">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl font-extrabold text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-md text-sm text-white/80 sm:text-base">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

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
