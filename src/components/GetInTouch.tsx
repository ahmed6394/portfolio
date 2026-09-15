import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import CopyEmailButton from "./CopyEmailButton";
import { personalInfo } from "../data/content";

export default function GetInTouch() {
  return (
    <section id="contact" className="py-24 max-w-4xl mx-auto px-4 text-center">
      <Reveal>
        <SectionHeader index="05" title="Get in Touch" />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <CopyEmailButton variant="outline" />
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-sm border border-accent text-accent px-5 py-2.5 rounded hover:bg-accent hover:text-base transition-colors shadow-glow"
          >
            LinkedIn
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-sm border border-accent text-accent px-5 py-2.5 rounded hover:bg-accent hover:text-base transition-colors shadow-glow"
          >
            GitHub
          </a>
        </div>
      </Reveal>
    </section>
  );
}
