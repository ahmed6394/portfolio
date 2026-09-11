import { Link, useParams } from "react-router-dom";
import { projects } from "../data/content";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono text-accent">// 404</p>
        <h1 className="font-heading text-3xl font-bold mt-2">Project not found</h1>
        <Link to="/" className="inline-block mt-6 font-mono text-sm text-muted hover:text-accent underline">
          ← Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
      <Link to="/" className="font-mono text-sm text-muted hover:text-accent">
        ← Back to home
      </Link>
      <p className="font-mono text-accent text-sm mt-8">// project</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2">{project.name}</h1>
      <p className="text-muted mt-4">{project.tagline}</p>
      <div className="flex flex-wrap gap-2 mt-6">
        {project.chips.map((c) => (
          <span key={c} className="font-mono text-xs border border-accent/30 text-accent px-2 py-1 rounded">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-10 border border-accent/20 bg-panel rounded-lg p-6 font-mono text-sm text-muted">
        <p>
          <span className="text-accent">$</span> status: detailed write-up &amp; screenshots coming soon
        </p>
        <p className="mt-2">
          <span className="text-accent">$</span> this page is reserved — check back later
        </p>
      </div>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block mt-8 font-mono text-sm text-accent hover:underline"
      >
        View on GitHub →
      </a>
    </main>
  );
}
