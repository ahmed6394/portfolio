import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={
        "fixed bottom-6 right-6 z-40 font-mono text-xs border border-accent text-accent px-3 py-2 rounded transition-colors duration-300 hover:bg-accent hover:text-base shadow-glow " +
        (visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2")
      }
    >
      TOP ↑
    </button>
  );
}