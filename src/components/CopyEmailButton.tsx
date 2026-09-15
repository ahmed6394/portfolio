import { useState } from "react";
import { personalInfo } from "../data/content";

export default function CopyEmailButton({ variant = "hero" }: { variant?: "hero" | "outline" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy Mahabub Ahmed's email address to the clipboard"
      className={
        variant === "hero"
          ? "font-mono text-sm border border-accent text-accent px-4 py-2 rounded hover:bg-accent hover:text-base transition-colors shadow-glow cursor-pointer"
          : "font-mono text-sm border border-accent text-accent px-5 py-2.5 rounded hover:bg-accent hover:text-base transition-colors shadow-glow cursor-pointer"
      }
    >
      {copied ? "Copied ✓" : "Email"}
    </button>
  );
}
