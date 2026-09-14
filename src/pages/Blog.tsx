import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { blogPosts } from "../content/blog/loader";

export default function Blog() {
  return (
    <main className="pt-28 pb-20 max-w-6xl mx-auto px-4">
      <Link to="/" className="font-mono text-sm text-muted hover:text-accent">
        ← Back to home
      </Link>
      <p className="font-mono text-accent text-sm mt-8">// blog</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2">Blog</h1>
      <p className="text-muted mt-4 max-w-2xl">
        Notes on cloud infrastructure, Kubernetes, CI/CD pipelines, and the things I break in
        homelabs.
      </p>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {blogPosts.map((post, i) => (
          <Reveal key={post.slug} delay={0.1 + i * 0.1}>
            <div className="group h-full border border-accent/20 bg-panel rounded-lg p-6 transition-all hover:border-accent hover:shadow-glow-strong flex flex-col">
              <p className="font-mono text-xs text-muted">
                post/{post.slug} · {post.date} · ~{post.readingMinutes} min read
              </p>
              <h2 className="font-heading text-xl font-bold mt-2 group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-muted text-sm mt-3 flex-1">{post.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs border border-accent/30 text-accent px-2 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <Link to={`/blog/${post.slug}`} className="font-mono text-sm text-accent hover:underline">
                  Read →
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
