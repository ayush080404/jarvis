import { Sparkles, MessageSquare, Send } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function AIGuide() {
  return (
    <>
      <PageHeader
        icon={Sparkles}
        eyebrow="AI Guide"
        title="Your personal travel assistant"
        subtitle="Ask about visas, packing, itineraries, or where to eat — get answers built from real traveler guides."
      />
      <section className="mx-auto max-w-2xl px-6 pb-24 lg:px-10">
        <div className="rounded-3xl border border-(--border-soft) bg-(--surface-card) p-6">
          <div className="mb-4 flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500">
              <MessageSquare size={16} className="text-white" />
            </span>
            <div className="rounded-2xl rounded-tl-sm bg-(--surface-card-hover) px-4 py-3 text-sm text-(--text-primary)">
              Hi! Tell me where you're headed and I'll help you plan the details.
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-(--border-soft) bg-(--input-bg) p-2 pl-4">
            <input
              type="text"
              placeholder="e.g. What should I pack for Tokyo in November?"
              className="w-full bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none"
            />
            <button
              type="button"
              aria-label="Send"
              className="btn-gradient grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
