import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { about, experience, education, personalInfo } from "../data/content";

export default function About() {
  return (
    <section id="about" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal>
        <SectionHeader index="01" title="About" />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-10">
        <Reveal delay={0.1}>
          <div>
            <p className="text-primary/90 leading-relaxed">{about.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {personalInfo.languages.map((l) => (
                <span key={l} className="font-mono text-xs border border-accent/30 text-accent px-2 py-1 rounded">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="border border-accent/20 bg-panel rounded-lg p-6 font-mono text-sm shadow-glow">
            <p className="text-accent">$ at-a-glance</p>
            <dl className="mt-4 space-y-3">
              {about.highlights.map((h) => (
                <div key={h.label}>
                  <dt className="text-muted text-xs">{h.label}</dt>
                  <dd className="text-primary">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-10">
        <Reveal delay={0.1}>
          <h3 className="font-mono text-accent text-sm mb-4">// experience</h3>
          <div className="space-y-8">
            {experience.map((e) => (
              <div key={e.role} className="border-l-2 border-accent/40 pl-4">
                <p className="font-heading font-semibold">{e.role}</p>
                <p className="font-mono text-xs text-accent">
                  {e.company} · {e.period}
                </p>
                <ul className="mt-2 list-disc list-inside text-sm text-muted space-y-1">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <h3 className="font-mono text-accent text-sm mb-4">// education</h3>
          <div className="space-y-8">
            {education.map((ed) => (
              <div key={ed.school} className="border-l-2 border-accent/40 pl-4">
                <p className="font-heading font-semibold">{ed.program}</p>
                <p className="font-mono text-xs text-accent">
                  {ed.school}
                  {ed.periodOnNewLine ? (
                    <>
                      <br />
                      {ed.period}
                    </>
                  ) : (
                    ` · ${ed.period}`
                  )}
                </p>
                {ed.note && (
                  <p className="font-mono text-xs text-muted mt-1">{ed.note}</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
