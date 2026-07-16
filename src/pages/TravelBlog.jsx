import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import blogPosts from '../data/blogPosts';

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
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/travel-blog/${post.slug}`}
              className="group block rounded-2xl border border-(--border-soft) bg-(--surface-card) p-6 transition-colors hover:border-(--border-mid)"
            >
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-sky-500">
                {post.tag}
              </p>
              <h3 className="font-display text-lg font-semibold text-(--text-primary)">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-(--text-secondary)">{post.excerpt}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-(--text-secondary)">{post.readTime}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-(--text-secondary) transition-colors group-hover:text-(--text-primary)">
                  Read
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
