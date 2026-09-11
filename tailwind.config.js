/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0a0e14",
        panel: "#0d1420",
        accent: "#22d3ee",
        primary: "#e6edf3",
        muted: "#8b98a9",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(34,211,238,0.25)",
        "glow-strong": "0 0 35px rgba(34,211,238,0.45)",
      },
    },
  },
  plugins: [],
};
