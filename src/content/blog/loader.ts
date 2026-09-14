import { parseFrontMatter, parseTags, readingMinutes } from "../frontmatter";

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  readingMinutes: number;
  content: string;
};

const modules = import.meta.glob("./*.md", { query: "?raw", import: "default", eager: true }) as Record<
  string,
  string
>;

export const blogPosts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    return {
      slug: path.replace(/^\.?\//, "").replace(/\.md$/, ""),
      title: data.title ?? "Untitled Post",
      summary: data.summary ?? "",
      tags: parseTags(data.tags),
      date: data.date ?? "",
      readingMinutes: readingMinutes(content),
      content,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getBlogPost(slug: string | undefined): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
