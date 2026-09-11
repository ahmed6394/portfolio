import { Link } from "react-router-dom";

export default function Blog() {
  return (
    <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
      <Link to="/" className="font-mono text-sm text-muted hover:text-accent">
        ← Back to home
      </Link>
      <p className="font-mono text-accent text-sm mt-8">// blog</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2">Blog</h1>
      <p className="text-muted mt-4">
        Notes on cloud infrastructure, Kubernetes, CI/CD pipelines, and the things I break in
        homelabs.
      </p>
      <div className="mt-10 border border-accent/20 bg-panel rounded-lg p-6 font-mono text-sm text-muted">
        <p>
          <span className="text-accent">$</span> status: posts coming soon
        </p>
        <p className="mt-2">
          <span className="text-accent">$</span> this page is reserved — check back later
        </p>
      </div>
    </main>
  );
}
