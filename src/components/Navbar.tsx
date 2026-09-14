import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_SECTIONS, NAV_PAGES } from "../data/content";

export default function Navbar({ onOpenCV }: { onOpenCV: () => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const location = useLocation();
  const onLanding = location.pathname === "/";

  useEffect(() => {
    if (!onLanding) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onLanding]);

  const linkClass = (id: string) =>
    `font-mono text-xs md:text-sm transition-colors ${
      active === id && onLanding
        ? "text-accent drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]"
        : "text-muted hover:text-primary"
    }`;

  const pageLinkClass = (path: string) =>
    `font-mono text-xs md:text-sm transition-colors ${
      location.pathname === path ? "text-accent drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" : "text-muted hover:text-primary"
    }`;

  const sectionLinks = onLanding ? (
    NAV_SECTIONS.map((s) => (
      <a key={s.id} href={`#${s.id}`} className={linkClass(s.id)}>
        {s.label}
      </a>
    ))
  ) : (
    <Link to="/" className="font-mono text-xs md:text-sm text-muted hover:text-accent">
      ← Back to home
    </Link>
  );

  const pageLinks = NAV_PAGES.map((p) => (
    <Link key={p.path} to={p.path} className={pageLinkClass(p.path)}>
      {p.label}
    </Link>
  ));

  const cvLink = (
    <button
      key="cv"
      type="button"
      onClick={onOpenCV}
      aria-label="View Mahabub Ahmed's CV (PDF)"
      className="font-mono text-xs md:text-sm text-muted hover:text-accent transition-colors cursor-pointer"
    >
      CV ↓
    </button>
  );

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-base/90 backdrop-blur border-b border-accent/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link to="/" className="font-mono text-sm text-accent">
          ~/mahabub
        </Link>
        <div className="hidden md:flex gap-4 lg:gap-6 items-center">
          {sectionLinks}
          {pageLinks}
          {cvLink}
        </div>
        <button
          className="md:hidden font-mono text-accent text-sm"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕ close" : "☰ menu"}
        </button>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 bg-base/95 border-b border-accent/10">
          {sectionLinks}
          {pageLinks}
          {cvLink}
        </div>
      )}
    </nav>
  );
}
