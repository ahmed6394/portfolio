import { stackCategories } from "../data/content";

const SIZE = 640;
const CENTER = SIZE / 2;
const RADIUS = 240;

export type NodeHover = { id: string; x: number; y: number } | null;

type Props = { hovered: string | null; onHover: (hover: NodeHover) => void };

export default function ClusterMap({ hovered, onHover }: Props) {
  const nodes = stackCategories.map((c, i) => {
    const angle = (i / stackCategories.length) * Math.PI * 2 - Math.PI / 2;
    return { ...c, x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
  });

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Technology cluster map">
      {nodes.map((n) => (
        <line
          key={n.id}
          x1={CENTER}
          y1={CENTER}
          x2={n.x}
          y2={n.y}
          stroke="#22d3ee"
          strokeOpacity={hovered === n.id ? 0.9 : 0.25}
          strokeWidth={hovered === n.id ? 2 : 1}
          strokeDasharray="6 6"
          className="connection-line"
        />
      ))}
      {nodes.map((n) => (
        <g
          key={n.id}
          onMouseEnter={() => onHover({ id: n.id, x: n.x, y: n.y })}
          onFocus={() => onHover({ id: n.id, x: n.x, y: n.y })}
          onMouseLeave={() => onHover(null)}
          onBlur={() => onHover(null)}
          className="cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label={n.label}
        >
          <circle cx={n.x} cy={n.y} r={hovered === n.id ? 14 : 10} fill="#0d1420" stroke="#22d3ee" strokeWidth={1.5} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={12} fill="#22d3ee">
            {n.icon}
          </text>
          <text
            x={n.x}
            y={n.y + (n.y > CENTER ? 32 : -22)}
            textAnchor="middle"
            fontSize={11}
            fill={hovered === n.id ? "#22d3ee" : "#8b98a9"}
            fontFamily="'JetBrains Mono', monospace"
          >
            {n.short}
          </text>
        </g>
      ))}
      <circle cx={CENTER} cy={CENTER} r={48} fill="#0d1420" stroke="#22d3ee" strokeWidth={2} />
      <text
        x={CENTER}
        y={CENTER + 5}
        textAnchor="middle"
        fontSize={14}
        fill="#e6edf3"
        fontFamily="'JetBrains Mono', monospace"
      >
        platform
      </text>
    </svg>
  );
}
