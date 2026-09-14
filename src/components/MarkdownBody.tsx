import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { ReactNode } from "react";

type Props = { content: string };

export default function MarkdownBody({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ children }) => (
          <h1 className="font-heading text-3xl md:text-4xl font-bold mt-10 mb-6">{children as ReactNode}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="font-heading text-2xl font-semibold mt-12 mb-4 text-accent">
            {children as ReactNode}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-heading text-xl font-semibold mt-8 mb-3">{children as ReactNode}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-mono text-sm text-accent mt-6 mb-2">{children as ReactNode}</h4>
        ),
        p: ({ children }) => <p className="text-primary/90 leading-relaxed mb-4">{children as ReactNode}</p>,
        strong: ({ children }) => <strong className="text-primary font-semibold">{children as ReactNode}</strong>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1.5 text-primary/90 mb-4">{children as ReactNode}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1.5 text-primary/90 mb-4">{children as ReactNode}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children as ReactNode}</li>,
        code: ({ className, children }) => {
          const isBlock = /language-/.test(className ?? "");
          if (isBlock) {
            return (
              <code className={`hljs font-mono text-sm block leading-relaxed ${className ?? ""}`}>
                {children as ReactNode}
              </code>
            );
          }
          return (
            <code className="font-mono text-sm text-accent bg-panel border border-accent/20 rounded px-1.5 py-0.5">
              {children as ReactNode}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="border border-accent/30 bg-panel rounded-lg p-4 md:p-5 shadow-glow overflow-x-auto mb-6 mt-2">
            {children as ReactNode}
          </pre>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto mb-6 mt-2">
            <table className="w-full text-sm border-collapse border border-accent/30 rounded-lg overflow-hidden">
              {children as ReactNode}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-panel font-heading">{children as ReactNode}</thead>,
        th: ({ children }) => (
          <th className="border border-accent/30 px-3 py-2 text-left text-accent">{children as ReactNode}</th>
        ),
        td: ({ children }) => (
          <td className="border border-accent/20 px-3 py-2 text-primary/90">{children as ReactNode}</td>
        ),
        img: ({ src, alt }) => (
          <img
            src={typeof src === "string" ? src : undefined}
            alt={alt ?? ""}
            className="max-w-full max-h-[75vh] h-auto w-auto object-contain rounded-lg border border-accent/20 shadow-glow my-6 mx-auto block"
            loading="lazy"
          />
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-accent underline decoration-accent/40 hover:decoration-accent hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            {children as ReactNode}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-accent/50 pl-4 text-muted italic mb-4">
            {children as ReactNode}
          </blockquote>
        ),
        hr: () => <hr className="border-accent/20 my-10" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
