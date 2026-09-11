import { stackCategories } from "../data/content";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stackCategories.map((c) => (
        <div key={c.id} className="border border-accent/20 bg-panel rounded-lg p-4">
          <p className="font-mono text-accent text-sm">
            {c.icon} {c.label}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.techs.map((t) => (
              <span key={t} className="font-mono text-xs border border-accent/30 text-muted px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
