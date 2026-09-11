import { useRef, useState } from "react";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import ClusterMap, { type NodeHover } from "./ClusterMap";
import CategoryGrid from "./CategoryGrid";
import { stackCategories } from "../data/content";

const SIZE = 640;

export default function TechStack() {
  const [hover, setHover] = useState<NodeHover>(null);
  const activeCat = stackCategories.find((c) => c.id === hover?.id);
  const mapWrapRef = useRef<HTMLDivElement>(null);

  // Position popover relative to the map wrapper using SVG coords scaled to rendered width
  let popoverStyle: React.CSSProperties | null = null;
  if (hover && activeCat && mapWrapRef.current) {
    const rendered = mapWrapRef.current.getBoundingClientRect().width;
    const scale = rendered / SIZE;
    const cardW = 280;
    const cardH = 150;
    let left = hover.x * scale - cardW / 2;
    left = Math.max(0, Math.min(left, rendered - cardW));
    const topHalf = hover.y < SIZE / 2;
    const top = topHalf ? hover.y * scale + 28 : hover.y * scale - cardH - 28;
    popoverStyle = {
      position: "absolute",
      left,
      top: Math.max(0, top),
      width: cardW,
      pointerEvents: "none",
      zIndex: 20,
    };
  }

  return (
    <section id="tech-stack" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal>
        <SectionHeader index="02" title="Tech Stack" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-mono text-xs text-muted mb-8">// hover a node to inspect the cluster</p>
        <div className="hidden md:block">
          <div ref={mapWrapRef} className="relative max-w-2xl mx-auto">
            <ClusterMap hovered={hover?.id ?? null} onHover={setHover} />
            {activeCat && popoverStyle && (
              <div
                className="border border-accent/40 bg-panel rounded-lg p-4 font-mono text-sm shadow-glow-strong"
                style={popoverStyle}
                role="status"
              >
                <p className="text-accent">
                  {activeCat.icon} {activeCat.label}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {activeCat.techs.map((t) => (
                    <span key={t} className="text-xs border border-accent/30 text-muted px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md:hidden">
          <CategoryGrid />
        </div>
      </Reveal>
    </section>
  );
}
