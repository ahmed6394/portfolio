import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { projects } from "../data/content";

export default function Projects() {
  return (
    <section id="projects" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal>
        <SectionHeader index="03" title="Projects" />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={0.1 + i * 0.1}>
            <div className="group h-full border border-accent/20 bg-panel rounded-lg p-6 transition-all hover:border-accent hover:shadow-glow-strong flex flex-col">
              <p className="font-mono text-xs text-muted">release/{p.slug}</p>
              <h3 className="font-heading text-xl font-bold mt-2 group-hover:text-accent transition-colors">
                {p.name}
              </h3>
              <p className="text-muted text-sm mt-3 flex-1">{p.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.chips.map((c) => (
                  <span key={c} className="font-mono text-xs border border-accent/30 text-accent px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Link to={`/projects/${p.slug}`} className="font-mono text-sm text-accent hover:underline">
                  Details →
                </Link>
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-xs text-muted hover:text-accent"
                >
                  GitHub
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
