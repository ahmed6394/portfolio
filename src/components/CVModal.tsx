import { useEffect } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "../data/content";

type CVModalProps = {
  onClose: () => void;
};

export default function CVModal({ onClose }: CVModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        role="dialog"
        aria-modal="true"
        aria-label="Mahabub Ahmed's CV"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-base border border-accent/30 rounded-lg shadow-glow overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-accent/20 bg-panel">
            <div className="flex gap-1.5" aria-hidden>
              <span className="w-3 h-3 rounded-full bg-red-400/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
            <span className="font-mono text-xs text-muted truncate">
              ~/Mahabub_Ahmed_CV.pdf
            </span>
            <div className="ml-auto flex items-center gap-2">
              <a
                href={personalInfo.cvUrl}
                download
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Download Mahabub Ahmed's CV (PDF)"
                className="font-mono text-xs border border-accent text-accent px-2.5 py-1 rounded hover:bg-accent hover:text-base transition-colors"
              >
                Download ↓
              </a>
              <button
                onClick={onClose}
                aria-label="Close CV"
                className="font-mono text-sm text-muted hover:text-accent transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0 bg-white">
            <iframe
              src={personalInfo.cvUrl}
              title="Mahabub Ahmed's CV (PDF)"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
