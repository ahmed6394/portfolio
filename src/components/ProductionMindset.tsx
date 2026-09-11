import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import PrincipleCard from "./PrincipleCard";
import { productionMindset } from "../data/content";

export default function ProductionMindset() {
  return (
    <section id="production-mindset" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal>
        <SectionHeader index="04" title="Production Mindset" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-mono text-xs text-muted mb-8">// how I think about production systems</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productionMindset.map((p, i) => (
            <Reveal key={p.title} delay={0.1 + i * 0.05}>
              <PrincipleCard icon={p.icon} title={p.title} line={p.line} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
