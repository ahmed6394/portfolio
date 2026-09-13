export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  content: string;
};

function parseFrontMatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return { data, content: match[2] };
}

const modules = import.meta.glob("./*.md", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;

export const caseStudies: CaseStudy[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    return {
      slug: path.replace(/^\.?\//, "").replace(/\.md$/, ""),
      title: data.title ?? "Untitled Case Study",
      summary: data.summary ?? "",
      tags: data.tags ? data.tags.replace(/[\[\]]/g, "").split(",").map((t) => t.trim()) : [],
      date: data.date ?? "",
      content,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getCaseStudy(slug: string | undefined): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
