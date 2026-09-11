# Mission Control Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Mahabub Ahmed's single-page "Mission Control" portfolio (React + Vite + TS + Tailwind + Framer Motion) with 6 sections, project detail placeholder routes, and Netlify-ready static build.

**Architecture:** Content centralized in `src/data/content.ts`; components render from that data. Landing page at `/`, project detail placeholder at `/projects/:slug`, unknown routes redirect home. Cluster map is pure SVG/CSS (no canvas). Deploy target is Netlify static hosting with `_redirects` SPA rule.

**Tech Stack:** React 18, Vite 5, TypeScript, Tailwind CSS 3, Framer Motion 11, react-router-dom 6.

## Global Constraints

- Colors: bg `#0a0e14`, panel `#0d1420`, accent cyan `#22d3ee`, text `#e6edf3`, muted `#8b98a9` (exact values, defined once in `tailwind.config.js`)
- Fonts: Space Grotesk (headings), JetBrains Mono (labels/CLI) via Google Fonts in `index.html`
- Section headers use monospace format: `// 01. NAME`, `// 02. TECH STACK`, `// 03. PROJECTS`, `// 04. PRODUCTION MINDSET`, `// 05. MINDSET`, `// 06. GET IN TOUCH`
- GitHub/LinkedIn URLs are `TODO`-marked placeholders in `content.ts`
- `prefers-reduced-motion` must disable animations (Framer Motion `useReducedMotion` + CSS media query)
- Mobile breakpoint: cluster map falls back to category grid below 768px
- Email: ahmed.mahabub.063@gmail.com; Phone: +4915215137473; Location: Heilbronn, Germany
- Repo root: `E:\opencode-project\portfolio` (not yet a git repo — Task 1 inits it)
- Every task ends with `npm run build` passing (zero TS errors) and a commit

---

### Task 1: Scaffold Vite project + Tailwind + fonts + Netlify config

**Files:**
- Create: `index.html`, `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `public/_redirects`, `.gitignore`

**Interfaces:**
- Produces: runnable Vite app shell that later tasks fill in; Tailwind theme tokens `bg-base`, `bg-panel`, `text-primary`, `text-muted`, `text-accent`, `accent` (border/glow) available to all components

- [ ] **Step 1: Scaffold Vite react-ts**

```bash
cd E:\opencode-project\portfolio
npm create vite@latest . -- --template react-ts
npm install
```

If `npm create` refuses non-empty dir (CV PDF exists), scaffold into `temp-scaffold/` then move files up:

```bash
npm create vite@latest temp-scaffold -- --template react-ts
Move-Item temp-scaffold\* . -Force
Move-Item temp-scaffold\.gitignore . -Force -ErrorAction SilentlyContinue
Remove-Item temp-scaffold -Recurse -Force
npm install
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom framer-motion
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Note: Tailwind is pinned to v3 — v4 removed the `init` CLI and uses a different config format; the config and classes in this plan target v3.

- [ ] **Step 3: Configure Tailwind**

`tailwind.config.js`:
```js
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
```

`src/index.css` (replace contents):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }
body { @apply bg-base text-primary font-heading; }

::selection { background: rgba(34, 211, 238, 0.35); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Fonts + title in index.html**

Replace `<head>` contents accordingly:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<title>Mahabub Ahmed — Cloud & DevOps Engineer</title>
<meta name="description" content="Portfolio of Mahabub Ahmed, Cloud & DevOps Engineer. AWS, Kubernetes, Terraform, CI/CD automation." />
```

- [ ] **Step 5: Netlify SPA redirects**

`public/_redirects`:
```
/* /index.html 200
```

- [ ] **Step 6: Git init + first commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Vite React-TS app with Tailwind, fonts, Netlify redirects"
```

---

### Task 2: Content data layer

**Files:**
- Create: `src/data/content.ts`

**Interfaces:**
- Produces (all later tasks consume these):
  - `personalInfo: { name, role, tagline, location, email, phone, linkedin, github, status, languages: string[] }`
  - `about: { intro: string, highlights: {label, value}[] }`
  - `experience: { role, company, period, points: string[] }[]`
  - `education: { school, program, period }[]`
  - `stackCategories: { id, label, icon, techs: string[] }[]`
  - `projects: { slug, name, tagline, chips: string[], githubUrl }[]`
  - `productionMindset: { icon, title, line }[]`
  - `mindset: { icon, title, line }[]`
  - `NAV_SECTIONS: { id, label }[]`

- [ ] **Step 1: Create content.ts with all CV-derived data**

```ts
// src/data/content.ts
// All site content lives here. TODO-marked URLs must be replaced before publishing.

export const personalInfo = {
  name: "Mahabub Ahmed",
  role: "Cloud & DevOps Engineer",
  tagline: "I build automated, observable, production-ready cloud infrastructure.",
  location: "Heilbronn, Germany",
  email: "ahmed.mahabub.063@gmail.com",
  phone: "+49 1521 5137473",
  linkedin: "https://linkedin.com/in/TODO-REPLACE", // TODO: replace with real LinkedIn URL
  github: "https://github.com/TODO-REPLACE", // TODO: replace with real GitHub URL
  status: "open to work",
  languages: ["English — Fluent", "German — B1 (learning)", "Bengali — Native"],
};

export const NAV_SECTIONS = [
  { id: "about", label: "About" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "projects", label: "Projects" },
  { id: "production-mindset", label: "Productions" },
  { id: "mindset", label: "Mindset" },
  { id: "contact", label: "Get in Touch" },
];

export const about = {
  intro:
    "Cloud and DevOps-focused Software Engineer with hands-on experience in AWS, Kubernetes, Terraform, Docker, and CI/CD automation. Currently working remotely as a Software Engineering Intern at PixScrib, contributing to deployment automation and production support. I moved from electrical engineering into cloud engineering — and that systems thinking is my edge: I treat infrastructure like a circuit, where every component must be reliable, observable, and designed to fail safely.",
  highlights: [
    { label: "Location", value: "Heilbronn, Germany" },
    { label: "Status", value: "Open to Cloud / DevOps / Platform roles" },
    { label: "Education", value: "Software Engineering — 42 Heilbronn (2024–2026)" },
    { label: "Background", value: "B.Sc. Electrical & Electronic Engineering — AUST" },
  ],
};

export const experience = [
  {
    role: "Software Engineering Intern",
    company: "PixScrib (Gaming Platform Startup)",
    period: "Apr 2026 — Present",
    points: [
      "Developed backend features, resolved production issues, and contributed to platform maintenance.",
      "Implemented GitHub webhook integrations for automated development and deployment workflows.",
      "Automated deployment workflows, improving release consistency and reducing manual effort.",
      "Supported monitoring, troubleshooting, and production operations to improve reliability.",
    ],
  },
  {
    role: "Assistant Engineer",
    company: "Vicar Electricals Ltd, Bangladesh",
    period: "Mar 2018 — May 2020",
    points: [
      "Improved QC processes, reducing defects through troubleshooting and process optimization.",
      "Worked in team-based industrial environments, strengthening collaboration and execution discipline.",
    ],
  },
];

export const education = [
  {
    school: "42 Heilbronn gGmbH, Germany",
    program: "Software Engineering Program",
    period: "Oct 2024 — Oct 2026",
  },
  {
    school: "Ahsanullah University of Science & Technology (AUST)",
    program: "B.Sc. in Electrical & Electronic Engineering",
    period: "Graduated Dec 2017",
  },
];

export const stackCategories = [
  {
    id: "cloud",
    label: "Cloud & Infrastructure",
    icon: "☁",
    techs: ["AWS EC2", "S3", "IAM", "RDS", "EKS", "ECR", "VPC", "Terraform", "Linux"],
  },
  {
    id: "containers",
    label: "Containerization & Orchestration",
    icon: "▣",
    techs: ["Docker", "Kubernetes (kind, kubeadm, EKS)", "Helm", "Docker Compose", "Calico CNI"],
  },
  {
    id: "cicd",
    label: "CI/CD & Automation",
    icon: "⚙",
    techs: ["GitHub Actions", "Jenkins", "Bash", "SonarQube", "Trivy"],
  },
  {
    id: "networking",
    label: "Networking & Security",
    icon: "🔒",
    techs: ["VPC", "Security Groups", "AWS ALB", "Nginx", "TLS/SSL", "DNS", "HTTP/HTTPS"],
  },
  {
    id: "monitoring",
    label: "Monitoring & Observability",
    icon: "📈",
    techs: ["Prometheus", "Grafana", "ELK Stack"],
  },
  {
    id: "programming",
    label: "Programming",
    icon: "⌨",
    techs: ["Python", "Go", "TypeScript", "JavaScript", "C", "C++"],
  },
  {
    id: "backend",
    label: "Backend & Databases",
    icon: "🗄",
    techs: ["FastAPI", "Node.js", "REST API Design", "PostgreSQL", "MySQL", "MongoDB"],
  },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  chips: string[];
  githubUrl: string;
};

export const projects: Project[] = [
  {
    slug: "cloud-native-platform",
    name: "Cloud-Native Application Deployment Platform",
    tagline: "Full-stack app deployed on AWS EKS with fully reproducible infrastructure.",
    chips: ["Angular", "FastAPI", "Kubernetes", "Terraform"],
    githubUrl: "https://github.com/TODO-REPLACE/cloud-native-platform", // TODO: replace
  },
  {
    slug: "incident-management-platform",
    name: "DevOps Incident Management Platform",
    tagline: "Containerized full-stack app with automated quality gates and security scanning.",
    chips: ["React", "Node.js", "Docker Compose", "GitHub Actions"],
    githubUrl: "https://github.com/TODO-REPLACE/incident-management-platform", // TODO: replace
  },
];

export const productionMindset = [
  {
    icon: "⚙",
    title: "Automate the boring",
    line: "Deployment automation at PixScrib cut manual effort and made releases consistent.",
  },
  {
    icon: "📈",
    title: "Monitor everything",
    line: "Prometheus + Grafana dashboards give infrastructure and services a voice.",
  },
  {
    icon: "🔒",
    title: "Security built-in, not bolted on",
    line: "Trivy and SonarQube quality gates in every pipeline — vulnerabilities never reach production silently.",
  },
  {
    icon: "♻",
    title: "Reproducible environments",
    line: "Terraform modules and reusable Helm charts mean dev, staging, and prod differ only by values.",
  },
  {
    icon: "🩺",
    title: "Observability is reliability",
    line: "Production support taught me: you can't fix what you can't see.",
  },
  {
    icon: "🧪",
    title: "Small, safe changes",
    line: "Smoke tests, health checks, and staged releases — momentum without meltdowns.",
  },
];

export const mindset = [
  {
    icon: "🎯",
    title: "Ownership",
    line: "From QC engineering in industry to production support at a startup — I treat every system I touch as mine to keep healthy.",
  },
  {
    icon: "🔍",
    title: "Curiosity",
    line: "I moved from electrical engineering into cloud platforms by relentlessly asking how systems really work underneath.",
  },
  {
    icon: "📚",
    title: "Continuous learning",
    line: "42 Heilbronn's project-based curriculum taught me to learn fast, learn deep, and learn by shipping.",
  },
  {
    icon: "🛠",
    title: "Disciplined execution",
    line: "Two years in industrial QC ingrained a habit: measure, optimize, verify — then measure again.",
  },
  {
    icon: "🤝",
    title: "Collaboration",
    line: "Teams ship; heroes stall. Peer learning and cross-team work shaped how I communicate and build.",
  },
];
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: build passes (content.ts compiles with no unused-var errors).

- [ ] **Step 3: Commit**

```bash
git add src/data/content.ts
git commit -m "feat: centralize all CV-derived site content in content.ts"
```

---

### Task 3: App shell — routing, navbar, landing/detail stubs, footer

**Files:**
- Modify: `src/main.tsx`, `src/App.tsx`
- Create: `src/pages/Landing.tsx`, `src/pages/ProjectDetail.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/SectionHeader.tsx`

**Interfaces:**
- Consumes: `NAV_SECTIONS`, `personalInfo`, `projects` from `content.ts`
- Produces: `<Navbar />`, `<Footer />`, `<SectionHeader index={string} title={string} />` (used by all section components); routes `/` (Landing) and `/projects/:slug` (ProjectDetail)

- [ ] **Step 1: Router setup in main.tsx**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 2: App.tsx with routes**

```tsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import ProjectDetail from "./pages/ProjectDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-base text-primary">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: SectionHeader component**

```tsx
type Props = { index: string; title: string };

export default function SectionHeader({ index, title }: Props) {
  return (
    <div className="mb-10 font-mono">
      <p className="text-accent text-sm">// {index}. {title.toUpperCase()}</p>
      <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2">{title}</h2>
    </div>
  );
}
```

- [ ] **Step 4: Navbar with active-section glow + mobile hamburger**

```tsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_SECTIONS, personalInfo } from "../data/content";

export default function Navbar() {
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

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-base/90 backdrop-blur border-b border-accent/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        <Link to="/" className="font-mono text-sm text-accent">
          ~/mahabub
        </Link>
        <div className="hidden md:flex gap-6">
          {onLanding ? (
            NAV_SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={linkClass(s.id)}>
                {s.label}
              </a>
            ))
          ) : (
            <Link to="/" className="font-mono text-sm text-muted hover:text-accent">
              ← Back to home
            </Link>
          )}
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
          {onLanding ? (
            NAV_SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={linkClass(s.id)} onClick={() => setOpen(false)}>
                {s.label}
              </a>
            ))
          ) : (
            <Link to="/" className="font-mono text-sm text-muted" onClick={() => setOpen(false)}>
              ← Back to home
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 5: Footer**

```tsx
import { personalInfo } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-accent/10 py-6 text-center font-mono text-xs text-muted">
      © 2026 {personalInfo.name} · built with React, Vite & Tailwind · deployed on Netlify
    </footer>
  );
}
```

- [ ] **Step 6: Landing page stub (sections wired in later tasks)**

```tsx
import Hero from "../components/Hero";

export default function Landing() {
  return (
    <main>
      <Hero />
      {/* Sections added in later tasks: About, TechStack, Projects,
          ProductionMindset, MindsetSection, GetInTouch */}
    </main>
  );
}
```

Create minimal `src/components/Hero.tsx` placeholder so build passes:
```tsx
export default function Hero() {
  return <section id="hero" className="min-h-screen" />;
}
```

- [ ] **Step 7: ProjectDetail placeholder page**

```tsx
import { Link, useParams } from "react-router-dom";
import { projects } from "../data/content";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center">
        <p className="font-mono text-accent">// 404</p>
        <h1 className="font-heading text-3xl font-bold mt-2">Project not found</h1>
        <Link to="/" className="inline-block mt-6 font-mono text-sm text-muted hover:text-accent underline">
          ← Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 max-w-3xl mx-auto px-4">
      <Link to="/" className="font-mono text-sm text-muted hover:text-accent">← Back to home</Link>
      <p className="font-mono text-accent text-sm mt-8">// project</p>
      <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2">{project.name}</h1>
      <p className="text-muted mt-4">{project.tagline}</p>
      <div className="flex flex-wrap gap-2 mt-6">
        {project.chips.map((c) => (
          <span key={c} className="font-mono text-xs border border-accent/30 text-accent px-2 py-1 rounded">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-10 border border-accent/20 bg-panel rounded-lg p-6 font-mono text-sm text-muted">
        <p><span className="text-accent">$</span> status: detailed write-up &amp; screenshots coming soon</p>
        <p className="mt-2"><span className="text-accent">$</span> this page is reserved — check back later</p>
      </div>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-block mt-8 font-mono text-sm text-accent hover:underline"
      >
        View on GitHub →
      </a>
    </main>
  );
}
```

- [ ] **Step 8: Verify in browser + build**

```bash
npm run dev
```
Verify: `/` renders empty hero stub; `/projects/cloud-native-platform` shows placeholder; `/projects/unknown` shows not-found; `/anything` redirects home.
```bash
npm run build
```
Expected: build passes.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: app shell with routing, navbar, footer, project detail placeholder"
```

---

### Task 4: Hero section

**Files:**
- Modify: `src/components/Hero.tsx` (replace stub)
- Create: `src/components/StatusPill.tsx`

**Interfaces:**
- Consumes: `personalInfo` from `content.ts`
- Produces: `<StatusPill label={string} />` — pulsing `●` + label, reused by GetInTouch if desired

- [ ] **Step 1: StatusPill**

```tsx
type Props = { label: string };

export default function StatusPill({ label }: Props) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs border border-accent/40 text-accent px-3 py-1.5 rounded-full bg-panel shadow-glow">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
      </span>
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Hero with grid backdrop, /whoami block, contact buttons**

```tsx
import { motion, useReducedMotion } from "framer-motion";
import { personalInfo } from "../data/content";
import StatusPill from "./StatusPill";

export default function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay } };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* grid backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div {...fade(0)}>
          <StatusPill label={`operational · ${personalInfo.status}`} />
        </motion.div>
        <motion.h1 {...fade(0.15)} className="font-heading text-5xl md:text-7xl font-bold mt-6">
          {personalInfo.name}
        </motion.h1>
        <motion.p {...fade(0.3)} className="font-mono text-accent text-lg md:text-2xl mt-3">
          {personalInfo.role}
        </motion.p>
        <motion.p {...fade(0.45)} className="text-muted max-w-xl mx-auto mt-4">
          {personalInfo.tagline}
        </motion.p>

        <motion.div {...fade(0.6)} className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${personalInfo.email}`} className="font-mono text-sm border border-accent text-accent px-4 py-2 rounded hover:bg-accent hover:text-base transition-colors shadow-glow">
            Email
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noreferrer noopener" className="font-mono text-sm border border-accent/40 text-muted px-4 py-2 rounded hover:border-accent hover:text-accent transition-colors">
            LinkedIn
          </a>
          <a href={personalInfo.github} target="_blank" rel="noreferrer noopener" className="font-mono text-sm border border-accent/40 text-muted px-4 py-2 rounded hover:border-accent hover:text-accent transition-colors">
            GitHub
          </a>
        </motion.div>

        <motion.div {...fade(0.75)} className="mt-12 inline-block text-left font-mono text-xs md:text-sm text-muted border border-accent/20 bg-panel rounded-lg px-5 py-4 shadow-glow">
          <p><span className="text-accent">$</span> whoami</p>
          <p className="mt-1">location: {personalInfo.location}</p>
          <p className="mt-1">languages: {personalInfo.languages.map((l) => l.split(" — ")[0]).join(", ")}</p>
          <p className="mt-1">status: <span className="text-accent">{personalInfo.status}</span></p>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify + build + commit**

```bash
npm run dev   # visual check: grid, glow pill, buttons, whoami block
npm run build
git add -A
git commit -m "feat: mission-control hero with grid backdrop and whoami block"
```

---

### Task 5: About section

**Files:**
- Modify: `src/pages/Landing.tsx`
- Create: `src/components/About.tsx`, `src/components/Reveal.tsx`

**Interfaces:**
- Consumes: `about`, `experience`, `education` from `content.ts`
- Produces: `<Reveal children delay={number} />` scroll-reveal wrapper used by all later sections

- [ ] **Step 1: Reveal wrapper**

```tsx
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = { children: ReactNode; delay?: number };

export default function Reveal({ children, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: About component**

```tsx
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { about, experience, education, personalInfo } from "../data/content";

export default function About() {
  return (
    <section id="about" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal>
        <SectionHeader index="01" title="About" />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-10">
        <Reveal delay={0.1}>
          <div>
            <p className="text-primary/90 leading-relaxed">{about.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {personalInfo.languages.map((l) => (
                <span key={l} className="font-mono text-xs border border-accent/30 text-accent px-2 py-1 rounded">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="border border-accent/20 bg-panel rounded-lg p-6 font-mono text-sm shadow-glow">
            <p className="text-accent">$ at-a-glance</p>
            <dl className="mt-4 space-y-3">
              {about.highlights.map((h) => (
                <div key={h.label}>
                  <dt className="text-muted text-xs">{h.label}</dt>
                  <dd className="text-primary">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-10">
        <Reveal delay={0.1}>
          <h3 className="font-mono text-accent text-sm mb-4">// experience</h3>
          <div className="space-y-8">
            {experience.map((e) => (
              <div key={e.role} className="border-l-2 border-accent/40 pl-4">
                <p className="font-heading font-semibold">{e.role}</p>
                <p className="font-mono text-xs text-accent">{e.company} · {e.period}</p>
                <ul className="mt-2 list-disc list-inside text-sm text-muted space-y-1">
                  {e.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <h3 className="font-mono text-accent text-sm mb-4">// education</h3>
          <div className="space-y-8">
            {education.map((ed) => (
              <div key={ed.school} className="border-l-2 border-accent/40 pl-4">
                <p className="font-heading font-semibold">{ed.program}</p>
                <p className="font-mono text-xs text-accent">{ed.school} · {ed.period}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into Landing.tsx**

```tsx
import Hero from "../components/Hero";
import About from "../components/About";

export default function Landing() {
  return (
    <main>
      <Hero />
      <About />
      {/* Later: TechStack, Projects, ProductionMindset, MindsetSection, GetInTouch */}
    </main>
  );
}
```

- [ ] **Step 4: Verify + build + commit**

```bash
npm run dev   # two columns, timeline blocks, at-a-glance panel
npm run build
git add -A
git commit -m "feat: about section with experience timeline and at-a-glance panel"
```

---

### Task 6: Tech Stack cluster map

**Files:**
- Modify: `src/pages/Landing.tsx`
- Create: `src/components/TechStack.tsx`, `src/components/ClusterMap.tsx`, `src/components/CategoryGrid.tsx`

**Interfaces:**
- Consumes: `stackCategories` from `content.ts`
- Produces: `<TechStack />` (self-contained: renders ClusterMap ≥768px, CategoryGrid below)

- [ ] **Step 1: ClusterMap (desktop, pure SVG, hover via props)**

Layout: center node + 7 category nodes on a circle. Animated dashed lines via CSS `stroke-dashoffset` animation. Hover state is owned by the parent (`TechStack`) so the side panel and map stay in sync.

```tsx
import { stackCategories } from "../data/content";

const SIZE = 640;
const CENTER = SIZE / 2;
const RADIUS = 240;

type Props = { hovered: string | null; onHover: (id: string | null) => void };

export default function ClusterMap({ hovered, onHover }: Props) {
  const nodes = stackCategories.map((c, i) => {
    const angle = (i / stackCategories.length) * Math.PI * 2 - Math.PI / 2;
    return { ...c, x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
  });

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Technology cluster map">
      {nodes.map((n) => (
        <line
          key={n.id}
          x1={CENTER} y1={CENTER} x2={n.x} y2={n.y}
          stroke="#22d3ee"
          strokeOpacity={hovered === n.id ? 0.9 : 0.25}
          strokeWidth={hovered === n.id ? 2 : 1}
          strokeDasharray="6 6"
          className="connection-line"
        />
      ))}
      {nodes.map((n) => (
        <g
          key={n.id}
          onMouseEnter={() => onHover(n.id)}
          onFocus={() => onHover(n.id)}
          onMouseLeave={() => onHover(null)}
          onBlur={() => onHover(null)}
          className="cursor-pointer"
          tabIndex={0}
          role="button"
          aria-label={n.label}
        >
          <circle cx={n.x} cy={n.y} r={hovered === n.id ? 14 : 10} fill="#0d1420" stroke="#22d3ee" strokeWidth={1.5} />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={12} fill="#22d3ee">
            {n.icon}
          </text>
          <text
            x={n.x}
            y={n.y + (n.y > CENTER ? 32 : -22)}
            textAnchor="middle"
            fontSize={11}
            fill={hovered === n.id ? "#22d3ee" : "#8b98a9"}
            fontFamily="'JetBrains Mono', monospace"
          >
            {n.label}
          </text>
        </g>
      ))}
      <circle cx={CENTER} cy={CENTER} r={48} fill="#0d1420" stroke="#22d3ee" strokeWidth={2} />
      <text x={CENTER} y={CENTER + 5} textAnchor="middle" fontSize={14} fill="#e6edf3" fontFamily="'JetBrains Mono', monospace">
        platform
      </text>
    </svg>
  );
}
```

Add to `src/index.css`:
```css
.connection-line {
  animation: dash 1.2s linear infinite;
}
@keyframes dash {
  to { stroke-dashoffset: -12; }
}
```

- [ ] **Step 2: Expanded badge panel + CategoryGrid (mobile fallback)**

```tsx
import { stackCategories } from "../data/content";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stackCategories.map((c) => (
        <div key={c.id} className="border border-accent/20 bg-panel rounded-lg p-4">
          <p className="font-mono text-accent text-sm">{c.icon} {c.label}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {c.techs.map((t) => (
              <span key={t} className="font-mono text-xs border border-accent/30 text-muted px-2 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: TechStack section (map + badge panel on desktop, grid on mobile)**

```tsx
import { useState } from "react";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import ClusterMap from "./ClusterMap";
import CategoryGrid from "./CategoryGrid";
import { stackCategories } from "../data/content";

export default function TechStack() {
  const [active, setActive] = useState<string | null>(null);
  const activeCat = stackCategories.find((c) => c.id === active);

  return (
    <section id="tech-stack" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal><SectionHeader index="02" title="Tech Stack" /></Reveal>
      <Reveal delay={0.1}>
        <p className="font-mono text-xs text-muted mb-8">// hover a node to inspect the cluster</p>
        <div className="hidden md:block">
          <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
            <ClusterMap hovered={active} onHover={setActive} />
            <div className="border border-accent/20 bg-panel rounded-lg p-5 min-h-[160px] font-mono text-sm">
              {activeCat ? (
                <>
                  <p className="text-accent">{activeCat.icon} {activeCat.label}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeCat.techs.map((t) => (
                      <span key={t} className="text-xs border border-accent/30 text-muted px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted">$ hover a cluster node…</p>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden"><CategoryGrid /></div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Wire into Landing.tsx**

```tsx
import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";

export default function Landing() {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      {/* Later: Projects, ProductionMindset, MindsetSection, GetInTouch */}
    </main>
  );
}
```

- [ ] **Step 5: Verify + build + commit**

```bash
npm run dev   # desktop: map + hover panel; resize <768px: grid fallback
npm run build
git add -A
git commit -m "feat: tech stack cluster map with mobile grid fallback"
```

---

### Task 7: Projects section (minimal cards + detail routes already exist)

**Files:**
- Modify: `src/pages/Landing.tsx`
- Create: `src/components/Projects.tsx`

**Interfaces:**
- Consumes: `projects` from `content.ts`; `Link` from react-router-dom (routes from Task 3)
- Produces: none (leaf component)

- [ ] **Step 1: Projects release cards**

```tsx
import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { projects } from "../data/content";

export default function Projects() {
  return (
    <section id="projects" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal><SectionHeader index="03" title="Projects" /></Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={0.1 + i * 0.1}>
            <div className="group h-full border border-accent/20 bg-panel rounded-lg p-6 transition-all hover:border-accent hover:shadow-glow-strong flex flex-col">
              <p className="font-mono text-xs text-muted">release/{p.slug}</p>
              <h3 className="font-heading text-xl font-bold mt-2 group-hover:text-accent transition-colors">
                {p.name}
              </h3>
              <p className="text-muted text-sm mt-3 flex-1">{p.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.chips.map((c) => (
                  <span key={c} className="font-mono text-xs border border-accent/30 text-accent px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between">
                <Link
                  to={`/projects/${p.slug}`}
                  className="font-mono text-sm text-accent hover:underline"
                >
                  Details →
                </Link>
                <a href={p.githubUrl} target="_blank" rel="noreferrer noopener" className="font-mono text-xs text-muted hover:text-accent">
                  GitHub
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into Landing.tsx (add import + element after TechStack)**

```tsx
import Projects from "../components/Projects";
// ...inside <main>, after <TechStack />:
<Projects />
```

- [ ] **Step 3: Verify + build + commit**

```bash
npm run dev   # two cards, Details → routes to placeholder pages
npm run build
git add -A
git commit -m "feat: minimal project release cards linking to detail placeholders"
```

---

### Task 8: Production Mindset + Mindset sections

**Files:**
- Modify: `src/pages/Landing.tsx`
- Create: `src/components/ProductionMindset.tsx`, `src/components/MindsetSection.tsx`, `src/components/PrincipleCard.tsx`

**Interfaces:**
- Consumes: `productionMindset`, `mindset` from `content.ts`
- Produces: `<PrincipleCard icon title line />` shared by both sections

- [ ] **Step 1: PrincipleCard**

```tsx
type Props = { icon: string; title: string; line: string };

export default function PrincipleCard({ icon, title, line }: Props) {
  return (
    <div className="border border-accent/20 bg-panel rounded-lg p-5 transition-all hover:border-accent hover:shadow-glow h-full">
      <p className="text-2xl">{icon}</p>
      <h3 className="font-heading font-semibold mt-3">{title}</h3>
      <p className="text-muted text-sm mt-2">{line}</p>
    </div>
  );
}
```

- [ ] **Step 2: ProductionMindset**

```tsx
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import PrincipleCard from "./PrincipleCard";
import { productionMindset } from "../data/content";

export default function ProductionMindset() {
  return (
    <section id="production-mindset" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal><SectionHeader index="04" title="Production Mindset" /></Reveal>
      <Reveal delay={0.1}>
        <p className="font-mono text-xs text-muted mb-8">// how I think about production systems</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productionMindset.map((p, i) => (
            <Reveal key={p.title} delay={0.1 + i * 0.05}>
              <PrincipleCard icon={p.icon} title={p.title} line={p.line} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: MindsetSection (same pattern, id="mindset", index 05)**

```tsx
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import PrincipleCard from "./PrincipleCard";
import { mindset } from "../data/content";

export default function MindsetSection() {
  return (
    <section id="mindset" className="py-24 max-w-6xl mx-auto px-4">
      <Reveal><SectionHeader index="05" title="Mindset" /></Reveal>
      <Reveal delay={0.1}>
        <p className="font-mono text-xs text-muted mb-8">// my general engineering philosophy</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mindset.map((p, i) => (
            <Reveal key={p.title} delay={0.1 + i * 0.05}>
              <PrincipleCard icon={p.icon} title={p.title} line={p.line} />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 4: Wire both into Landing.tsx (after Projects)**

```tsx
import ProductionMindset from "../components/ProductionMindset";
import MindsetSection from "../components/MindsetSection";
// ...after <Projects />:
<ProductionMindset />
<MindsetSection />
```

- [ ] **Step 5: Verify + build + commit**

```bash
npm run dev   # both card grids render, staggered reveals
npm run build
git add -A
git commit -m "feat: production mindset and mindset principle card sections"
```

---

### Task 9: Get in Touch, final polish, Lighthouse, deploy artifacts

**Files:**
- Modify: `src/pages/Landing.tsx`, `src/index.css`
- Create: `src/components/GetInTouch.tsx`

**Interfaces:**
- Consumes: `personalInfo` from `content.ts`; `StatusPill` from Task 4

- [ ] **Step 1: GetInTouch**

```tsx
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import StatusPill from "./StatusPill";
import { personalInfo } from "../data/content";

export default function GetInTouch() {
  return (
    <section id="contact" className="py-24 max-w-4xl mx-auto px-4 text-center">
      <Reveal><SectionHeader index="06" title="Get in Touch" /></Reveal>
      <Reveal delay={0.1}>
        <p className="text-muted max-w-xl mx-auto">
          Looking for a Cloud, DevOps, or Platform engineer? Let's talk — I respond fast.
        </p>
        <div className="mt-6"><StatusPill label={personalInfo.status} /></div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`mailto:${personalInfo.email}`} className="font-mono text-sm border border-accent text-accent px-5 py-2.5 rounded hover:bg-accent hover:text-base transition-colors shadow-glow">
            ahmed.mahabub.063@gmail.com
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noreferrer noopener" className="font-mono text-sm border border-accent/40 text-muted px-5 py-2.5 rounded hover:border-accent hover:text-accent transition-colors">
            LinkedIn
          </a>
          <a href={personalInfo.github} target="_blank" rel="noreferrer noopener" className="font-mono text-sm border border-accent/40 text-muted px-5 py-2.5 rounded hover:border-accent hover:text-accent transition-colors">
            GitHub
          </a>
        </div>
        <p className="font-mono text-xs text-muted mt-6">
          {personalInfo.location} · open to remote
        </p>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 2: Wire into Landing.tsx (final)**

```tsx
import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import ProductionMindset from "../components/ProductionMindset";
import MindsetSection from "../components/MindsetSection";
import GetInTouch from "../components/GetInTouch";

export default function Landing() {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <ProductionMindset />
      <MindsetSection />
      <GetInTouch />
    </main>
  );
}
```

- [ ] **Step 3: Full visual verification at 1440px, 768px, 375px**

```bash
npm run dev
```
Use chrome-devtools MCP: open page, screenshot at 3 widths; check nav smooth-scroll, active glow, hamburger, cluster map hover, Details routing, back link, 404 page, reduced-motion (emulate `prefers-reduced-motion`).

- [ ] **Step 4: Lighthouse a11y pass via chrome-devtools MCP**

Run Lighthouse audit (desktop, navigation). Fix any critical accessibility errors found (contrast, aria labels). Re-run until no critical a11y issues.

- [ ] **Step 5: Final build + commit**

```bash
npm run build
```
Expected: zero TS errors, dist/ contains `_redirects`.

```bash
git add -A
git commit -m "feat: get in touch section, final polish and deploy readiness"
```

---

## Post-plan notes (not tasks)

- User replaces `TODO` URLs in `content.ts` before publishing
- Netlify deploy: connect repo, build command `npm run build`, publish dir `dist`
