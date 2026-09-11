type Props = { icon: string; title: string; line: string };

export default function PrincipleCard({ icon, title, line }: Props) {
  return (
    <div className="border border-accent/20 bg-panel rounded-lg p-5 transition-all hover:border-accent hover:shadow-glow h-full">
      <p className="text-2xl">{icon}</p>
      <h3 className="font-heading font-semibold mt-3">{title}</h3>
      <p className="text-muted text-sm mt-2">{line}</p>
    </div>
  );
}
