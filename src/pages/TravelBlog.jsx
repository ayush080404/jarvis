import { Newspaper } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const posts = [
  { title: '48 hours in Lisbon, done right', tag: 'City guide', readTime: '6 min read' },
  { title: 'Packing light for a 3-week Asia trip', tag: 'Tips', readTime: '8 min read' },
  { title: 'The best shoulder-season destinations for 2026', tag: 'Trends', readTime: '5 min read' },
];

export default function TravelBlog() {
  return (
    <>
      <PageHeader
        icon={Newspaper}
        eyebrow="Read"
        title="Stories from the road"
        subtitle="Guides and notes from travelers and locals, updated regularly."
      />
      <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-10">
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 transition-colors hover:border-(--border-mid)"
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-sky-500">
                {post.tag}
              </p>
              <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-(--text-secondary)">{post.readTime}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
