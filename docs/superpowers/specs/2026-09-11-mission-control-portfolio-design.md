# Mission Control Portfolio — Design Spec

**Date:** 2026-09-11
**Owner:** Mahabub Ahmed
**Status:** Approved design, pending spec review

## Goal

A single-page portfolio for Mahabub Ahmed (Cloud & DevOps Engineer, Heilbronn, Germany) targeting recruiters. Style: "Mission Control" — a live cloud-operations console aesthetic. Black background with neon cyan accents, monospace accents, glowing cards. Extensible to more pages later.

## Non-Goals (v1)

- Full project detail pages (screenshots, deep write-ups) — only placeholder routes
- Blog or CMS
- Backend of any kind
- Analytics integration

## Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Routing:** react-router-dom (landing at `/`, project detail routes reserved)
- **Deploy:** Static build → Netlify (includes `_redirects` SPA rule)

## Source of Truth for Content

All CV-derived content lives in `src/data/content.ts`. Editing text never requires touching components.

- CV source: `Mahabub_Ahmed_CV.pdf` (repo root)
- GitHub URLs: **placeholders** marked with `TODO` comments — user replaces before publishing
- LinkedIn URL: placeholder, user replaces before publishing

## Site Structure

### Routes

- `/` — landing page (all 6 sections + footer)
- `/projects/:slug` — ProjectDetail placeholder ("Detailed write-up & screenshots coming soon" + project name + stack chips)
- Unknown routes → redirect to `/`

### Landing Page Sections (order)

1. **Hero**
   - Always-visible name: "Mahabub Ahmed" — no typing effect
   - Role: "Cloud & DevOps Engineer"
   - Location: Heilbronn, Germany
   - `● operational` status pill (pulsing), quick contact buttons: Email (mailto), LinkedIn, GitHub
   - `/whoami`-style system-info line: location, languages, status: open-to-work
   - Subtle grid backdrop

2. **About** (`// 01. ABOUT`)
   - Two-column: intro paragraph (from CV summary) + "at a glance" panel
   - At-a-glance: education (42 Heilbronn 2024–2026 Software Engineering; AUST B.Sc. EEE 2017), languages (English fluent, German B1 learning, Bengali native), location, current role (Software Engineering Intern, PixScrib, remote)
   - Career transition EEE → Cloud/DevOps framed as strength
   - Experience timeline included (PixScrib Apr 2026–present; Vicar Electricals 2018–2020)

3. **Tech Stack** (`// 02. TECH STACK`)
   - **Cluster-map**: central node connected by animated dashed SVG lines to category nodes:
     - Cloud & Infrastructure (AWS EC2/S3/IAM/RDS/EKS/ECR/VPC, Terraform, Linux)
     - Containerization & Orchestration (Docker, K8s kind/kubeadm/EKS, Helm, Docker Compose, Calico)
     - CI/CD & Automation (GitHub Actions, Jenkins, Bash, SonarQube, Trivy)
     - Networking & Security (VPC, Security Groups, ALB, Nginx, TLS/SSL, DNS, HTTP/S)
     - Monitoring & Observability (Prometheus, Grafana, ELK)
     - Programming (Python, Go, TypeScript, JavaScript, C, C++)
     - Backend & Databases (FastAPI, Node.js, REST, PostgreSQL, MySQL, MongoDB)
   - Hover a category node → its tech badges expand
   - Mobile fallback: category grid with badges (no map)
   - Pure CSS/SVG + Framer Motion — no canvas/WebGL

4. **Projects** (`// 03. PROJECTS`) — **minimal release cards**
   - Per card: project name, one-line tagline, 3–4 key stack chips, "Details →" button → route
   - Card 1: Cloud-Native Application Deployment Platform — "Full-stack app deployed on AWS EKS with fully reproducible infrastructure" — chips: Angular, FastAPI, Kubernetes, Terraform
   - Card 2: DevOps Incident Management Platform — "Containerized full-stack app with automated quality gates and security scanning" — chips: React, Node.js, Docker Compose, GitHub Actions
   - No bullet lists on cards — details reserved for detail pages

5. **Production Mindset** (`// 04. PRODUCTION MINDSET`)
   - Incident-response style principle cards, each icon + title + one-liner, drawn from CV experience:
     - Automate the boring (deployment automation reduced manual effort at PixScrib)
     - Monitor everything (Prometheus/Grafana dashboards on EKS platform)
     - Security built-in (Trivy + SonarQube gates in CI pipelines)
     - Reproducible environments (Terraform modules, reusable Helm charts)
     - Reliability through observability (production support, monitoring at PixScrib)
     - Small safe changes (smoke tests, health checks, staged releases)

6. **Mindset** (`// 05. MINDSET`) — general engineering philosophy, distinct from Production Mindset
   - Ownership, Curiosity, Continuous learning, Disciplined execution (industrial QC background), Collaboration
   - Short punchy cards

7. **Get in Touch** (`// 06. GET IN TOUCH`)
   - Big CTA, email button (mailto:ahmed.mahabub.063@gmail.com), LinkedIn, GitHub
   - Note: "Heilbronn, Germany · open to remote"
   - Footer: © 2026 Mahabub Ahmed

### Navigation

- Sticky top nav: logo/name left, section links right, active section glows
- Smooth-scroll to sections; on mobile collapses to hamburger menu
- On detail pages, nav shows "← Back to home"

## Visual Language

- **Colors:** background `#0a0e14`, panel `#0d1420`-ish, accent cyan `#22d3ee` (glow via box-shadow), text `#e6edf3`, muted `#8b98a9`
- **Fonts:** headings — Space Grotesk; labels/CLI text — JetBrains Mono (Google Fonts)
- Section headers: `// 01. NAME` monospace + cyan
- Cards: dark panel, 1px border, cyan glow on hover, rounded-lg
- Status dots pulse; animated dashed connection lines in cluster map
- Subtle animated grid background on hero (CSS only)
- `prefers-reduced-motion`: disable all animations

## Component Structure

```
src/
  main.tsx (router setup)
  App.tsx (layout: Navbar + Routes + Footer)
  index.css (tailwind + fonts + global styles)
  data/content.ts (ALL content: personal info, stack categories, projects with slugs, principles, contact links)
  components/
    Navbar.tsx
    SectionHeader.tsx
    Hero.tsx
    About.tsx
    TechStack.tsx (cluster map + mobile fallback)
    Projects.tsx (release cards)
    ProductionMindset.tsx
    MindsetSection.tsx
    GetInTouch.tsx
    Footer.tsx
  pages/
    Landing.tsx
    ProjectDetail.tsx (placeholder)
```

## Error Handling / Edge Cases

- Placeholder URLs clearly marked `// TODO` in `content.ts`; user swaps before deploy
- Invalid `/projects/:slug` → "Project not found" message + link home
- SPA routes on Netlify via `_redirects` (`/* /index.html 200`)
- Cluster map degrades to grid below ~768px
- Reduced motion: `@media (prefers-reduced-motion)` disables animations

## Testing / Verification

- `npm run build` passes with zero TS errors
- Manual pass: all nav links scroll to correct sections; Details buttons route correctly; back navigation works; mobile layout (hamburger, grid stack map) verified at 375px width; reduced-motion works
- Lighthouse accessibility check via chrome-devtools (aim: no critical a11y errors)

## Future Extensions (explicitly planned by user)

- Full project detail pages with screenshots — reserved routes + `details` field in project data make this content-only work
- Additional pages if user likes the style
