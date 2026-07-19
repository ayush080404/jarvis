import { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function ShareButton({ title, className, iconSize = 15 }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — Voyora`, url });
      } catch {
        /* user cancelled — no-op */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <button
        onClick={handleShare}
        aria-label="Share"
        className={
          className ||
          'grid h-9 w-9 place-items-center rounded-full border border-(--border-soft) text-(--text-secondary) transition-colors hover:border-(--border-mid) hover:text-(--text-primary)'
        }
      >
        <Share2 size={iconSize} />
      </button>
      {copied && (
        <span className="absolute left-full ml-2 whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          Link copied
        </span>
      )}
    </div>
  );
}
