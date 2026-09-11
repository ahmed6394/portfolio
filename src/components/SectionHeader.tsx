type Props = { index: string; title: string };

export default function SectionHeader({ index, title }: Props) {
  return (
    <div className="mb-10 font-mono">
      <p className="text-accent text-sm">
        // {index}. {title.toUpperCase()}
      </p>
      <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">{title}</h2>
    </div>
  );
}
