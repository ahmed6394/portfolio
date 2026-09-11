type Props = { label: string };

export default function StatusPill({ label }: Props) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs border border-accent/40 text-accent px-3 py-1.5 rounded-full bg-panel shadow-glow">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
      </span>
      {label}
    </span>
  );
}
