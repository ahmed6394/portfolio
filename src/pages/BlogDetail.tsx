import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownBody from "../components/MarkdownBody";
import { getBlogPost } from "../content/blog/loader";

export default function BlogDetail() {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  useEffect(() => {
    document.title = post
      ? `${post.title} — Mahabub Ahmed`
      : "Post Not Found — Mahabub Ahmed";
    return () => {
      document.title = "Mahabub Ahmed — Cloud & DevOps Engineer";
    };
  }, [post]);

  if (!post) {
    return (
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono text-accent">// 404</p>
        <h1 className="font-heading text-3xl font-bold mt-2">Post not found</h1>
        <Link
          to="/blog"
          className="inline-block mt-6 font-mono text-sm text-muted hover:text-accent underline"
        >
          ← Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
      <Link to="/blog" className="font-mono text-sm text-muted hover:text-accent">
        ← Back to blog
      </Link>
      <p className="font-mono text-accent text-sm mt-8">
        // blog/{post.slug} · {post.date} · ~{post.readingMinutes} min read
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map((t) => (
          <span key={t} className="font-mono text-xs border border-accent/30 text-accent px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
      <article className="mt-6">
        <MarkdownBody content={post.content} />
      </article>
    </main>
  );
}
