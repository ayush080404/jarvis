import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '../data/blogPosts';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <Navigate to="/travel-blog" replace />;

  return (
    <section className="mx-auto max-w-2xl px-6 pb-24 pt-32 lg:px-10 lg:pt-40">
      <Link
        to="/travel-blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)"
      >
        <ArrowLeft size={15} />
        Back to Travel Blog
      </Link>

      <p className="mt-8 text-xs font-medium uppercase tracking-widest text-sky-500">
        {post.tag}
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-(--text-primary) sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-(--text-secondary)">{post.readTime}</p>

      <div className="mt-8 space-y-7">
        {post.body.map((section) => (
          <div key={section.heading}>
            <h2 className="font-display text-lg font-semibold text-(--text-primary)">
              {section.heading}
            </h2>
            <p className="mt-2.5 leading-relaxed text-(--text-secondary)">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
