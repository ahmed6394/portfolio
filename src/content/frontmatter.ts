export type FrontMatter = { data: Record<string, string>; content: string };

export function parseFrontMatter(raw: string): FrontMatter {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return { data, content: match[2] };
}

export function parseTags(raw: string | undefined): string[] {
  return raw ? raw.replace(/[\[\]]/g, "").split(",").map((t) => t.trim()) : [];
}

export function readingMinutes(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
