import { useState } from "react";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import ClusterMap from "./ClusterMap";
import CategoryGrid from "./CategoryGrid";
import { stackCategories } from "../data/content";

export default function TechStack() {
  const [active, setActive] = useState<string | null>(null);
  const activeCat = stackCategories.find((c) => c.id === active);

  return (
    <section id="tech-stack" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal>
        <SectionHeader index="02" title="Tech Stack" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-mono text-xs text-muted mb-8">// hover a node to inspect the cluster</p>
        <div className="hidden md:block">
          <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
            <ClusterMap hovered={active} onHover={setActive} />
            <div className="border border-accent/20 bg-panel rounded-lg p-5 min-h-[160px] font-mono text-sm">
              {activeCat ? (
                <>
                  <p className="text-accent">
                    {activeCat.icon} {activeCat.label}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeCat.techs.map((t) => (
                      <span key={t} className="text-xs border border-accent/30 text-muted px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted">$ hover a cluster node…</p>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <CategoryGrid />
        </div>
      </Reveal>
    </section>
  );
}
