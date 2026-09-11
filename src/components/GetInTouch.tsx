import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import StatusPill from "./StatusPill";
import { personalInfo } from "../data/content";

export default function GetInTouch() {
  return (
    <section id="contact" className="py-24 max-w-4xl mx-auto px-4 text-center">
      <Reveal>
        <SectionHeader index="06" title="Get in Touch" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-muted max-w-xl mx-auto">
          Looking for a Cloud, DevOps, or Platform engineer? Let's talk — I respond fast.
        </p>
        <div className="mt-6">
          <StatusPill label={personalInfo.status} />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${personalInfo.email}`}
            className="font-mono text-sm border border-accent text-accent px-5 py-2.5 rounded hover:bg-accent hover:text-base transition-colors shadow-glow"
          >
            ahmed.mahabub.063@gmail.com
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-sm border border-accent/40 text-muted px-5 py-2.5 rounded hover:border-accent hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-sm border border-accent/40 text-muted px-5 py-2.5 rounded hover:border-accent hover:text-accent transition-colors"
          >
            GitHub
          </a>
        </div>
        <p className="font-mono text-xs text-muted mt-6">{personalInfo.location} · open to remote</p>
      </Reveal>
    </section>
  );
}
