import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

export default function AuthLayout({ visual, eyebrow, heading, subheading, children }) {
  return (
    <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        {visual}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/50" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12 xl:p-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-sky-300">
            {eyebrow}
          </p>
          <h2 className="max-w-md font-display text-4xl font-bold leading-tight text-white">
            {heading}
          </h2>
          {subheading && <p className="mt-4 max-w-sm text-white/70">{subheading}</p>}
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-(--surface) px-6 py-16 pt-32 lg:pt-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500">
              <Globe2 size={18} strokeWidth={2} className="text-white" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-(--text-primary)">
              Voyora
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
