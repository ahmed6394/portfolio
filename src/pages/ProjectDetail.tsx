import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownBody from "../components/MarkdownBody";
import { projects } from "../data/content";
import { getProjectPage } from "../content/projects/loader";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const page = getProjectPage(slug);

  useEffect(() => {
    document.title = project
      ? `${project.name} — Mahabub Ahmed`
      : "Project Not Found — Mahabub Ahmed";
    return () => {
      document.title = "Mahabub Ahmed — Cloud & DevOps Engineer";
    };
  }, [project]);

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
      <p className="font-mono text-accent text-sm mt-8">// project/{project.slug}</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2">{project.name}</h1>
      {page?.subtitle && <p className="font-mono text-muted text-sm mt-1">({page.subtitle})</p>}
      <p className="text-muted mt-4">{project.tagline}</p>
      <div className="flex flex-wrap gap-2 mt-6">
        {project.chips.map((c) => (
          <span key={c} className="font-mono text-xs border border-accent/30 text-accent px-2 py-1 rounded">
            {c}
          </span>
        ))}
      </div>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block mt-6 font-mono text-sm text-accent hover:underline"
      >
        View on GitHub →
      </a>
      <article className="mt-10">{page ? <MarkdownBody content={page.content} /> : null}</article>
    </main>
  );
}