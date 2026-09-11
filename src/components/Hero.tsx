import { motion, useReducedMotion } from "framer-motion";
import { personalInfo } from "../data/content";
import StatusPill from "./StatusPill";

export default function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay } };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div {...fade(0)}>
          <StatusPill label={`operational · ${personalInfo.status}`} />
        </motion.div>
        <motion.h1 {...fade(0.15)} className="font-heading text-5xl md:text-7xl font-bold mt-6">
          {personalInfo.name}
        </motion.h1>
        <motion.p {...fade(0.3)} className="font-mono text-accent text-lg md:text-2xl mt-3">
          {personalInfo.role}
        </motion.p>
        <motion.p {...fade(0.45)} className="text-muted max-w-xl mx-auto mt-4">
          {personalInfo.tagline}
        </motion.p>

        <motion.div {...fade(0.6)} className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${personalInfo.email}`}
            className="font-mono text-sm border border-accent text-accent px-4 py-2 rounded hover:bg-accent hover:text-base transition-colors shadow-glow"
          >
            Email
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-sm border border-accent/40 text-muted px-4 py-2 rounded hover:border-accent hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-sm border border-accent/40 text-muted px-4 py-2 rounded hover:border-accent hover:text-accent transition-colors"
          >
            GitHub
          </a>
        </motion.div>

        <motion.div
          {...fade(0.75)}
          className="mt-12 inline-block text-left font-mono text-xs md:text-sm text-muted border border-accent/20 bg-panel rounded-lg px-5 py-4 shadow-glow"
        >
          <p>
            <span className="text-accent">$</span> whoami
          </p>
          <p className="mt-1">location: {personalInfo.location}</p>
          <p className="mt-1">
            languages: {personalInfo.languages.map((l) => l.split(" — ")[0]).join(", ")}
          </p>
          <p className="mt-1">
            status: <span className="text-accent">{personalInfo.status}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
