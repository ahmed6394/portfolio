import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import MarkdownBody from "../components/MarkdownBody";
import { getCaseStudy } from "../content/case-studies/loader";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const study = getCaseStudy(slug);

  useEffect(() => {
    document.title = study
      ? `${study.title} — Mahabub Ahmed`
      : "Case Study Not Found — Mahabub Ahmed";
    return () => {
      document.title = "Mahabub Ahmed — Cloud & DevOps Engineer";
    };
  }, [study]);

  if (!study) {
    return (
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono text-accent">// 404</p>
        <h1 className="font-heading text-3xl font-bold mt-2">Case study not found</h1>
        <Link
          to="/case-studies"
          className="inline-block mt-6 font-mono text-sm text-muted hover:text-accent underline"
        >
          ← Back to case studies
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
      <Link to="/case-studies" className="font-mono text-sm text-muted hover:text-accent">
        ← Back to case studies
      </Link>
      <p className="font-mono text-accent text-sm mt-8">
        // case-study/{study.slug} · {study.date}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {study.tags.map((t) => (
          <span key={t} className="font-mono text-xs border border-accent/30 text-accent px-2 py-1 rounded">
            {t}
          </span>
        ))}
      </div>
      <article className="mt-6">
        <MarkdownBody content={study.content} />
      </article>
    </main>
  );
}
