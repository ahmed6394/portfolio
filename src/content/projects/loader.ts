import { parseFrontMatter, parseTags } from "../frontmatter";

export type ProjectPage = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  content: string;
};

const modules = import.meta.glob("./*.md", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;

export const projectPages: ProjectPage[] = Object.entries(modules).map(([path, raw]) => {
  const { data, content } = parseFrontMatter(raw);
  return {
    slug: path.replace(/^\.?\//, "").replace(/\.md$/, ""),
    title: data.title ?? "Untitled Project",
    subtitle: data.subtitle ?? "",
    summary: data.summary ?? "",
    tags: parseTags(data.tags),
    content,
  };
});

export function getProjectPage(slug: string | undefined): ProjectPage | undefined {
  return projectPages.find((p) => p.slug === slug);
}