import { personalInfo } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-accent/10 py-6 text-center font-mono text-xs text-muted">
      © 2026 {personalInfo.name} · built with React, Vite &amp; Tailwind · deployed on Netlify
    </footer>
  );
}
