# Task Plan: Mission Control Portfolio

Use this file as the durable roadmap for the task. Create it before complex work and keep it current as phases change.

## Goal

Deliver a deployed, recruiter-ready single-page "Mission Control" portfolio for Mahabub Ahmed (Cloud & DevOps Engineer) with 5 landing sections, markdown case studies, and reserved blog/project pages on Netlify.

## Next Step

Replace `TODO-REPLACE` URLs (GitHub, LinkedIn, project repos) in `src/data/content.ts` — required before Netlify deployment.

## Current Phase

Phase 5

## Phases

### Phase 1: Requirements & Discovery

- [x] Understand user intent (single-page portfolio from CV, 6 sections, black + neon cyan, recruiter-focused)
- [x] Identify constraints (Netlify static hosting, React + Vite, placeholder URLs until user provides real ones)
- [x] Extract CV content from `Mahabub_Ahmed_CV.pdf`
- **Status:** complete

### Phase 2: Planning & Structure

- [x] Define technical approach (Mission Control console aesthetic, spec + implementation plan docs in `docs/superpowers/`)
- [x] Create project structure (Vite + React + TS + Tailwind + Framer Motion + react-router-dom)
- [x] Document decisions with rationale (spec: `docs/superpowers/specs/2026-09-11-mission-control-portfolio-design.md`)
- **Status:** complete

### Phase 3: Implementation

- [x] Scaffold + content layer (`src/data/content.ts`)
- [x] App shell: routing, navbar, footer, project detail placeholder
- [x] Hero (grid backdrop, status pill, whoami block)
- [x] About (intro, at-a-glance, experience/education timelines)
- [x] Tech Stack cluster map — 10 nodes (Cloud, IaC, Containers, CI/CD, Networking, DevSecOps, Monitoring, Programming, Backend, AI Engineering) + mobile grid fallback
- [x] Projects release cards + "Details →" placeholder routes
- [x] Production Mindset (merged single section, 2 sub-groups)
- [x] Get in Touch + footer + robots.txt
- [x] Blog + Case Study placeholder pages + nav buttons
- [x] Floating cluster popover fix (anchors above bottom nodes)
- [x] Markdown case-study system (front-matter loader, themed renderer, index cards, detail pages)
- **Status:** complete

### Phase 4: Testing & Verification

- [x] Build passes with zero TS errors
- [x] All routes verified (landing, project detail/404, blog, case studies index/detail/404, SPA redirects)
- [x] Responsive verified at 1440px / 768px / 375px (hamburger, grid fallback)
- [x] Lighthouse: Accessibility 100, Best Practices 100, SEO 100
- [ ] Fix any issues found post-deploy (smoke test on Netlify URL)
- **Status:** in_progress

### Phase 5: Delivery

- [ ] Replace `TODO-REPLACE` URLs in `src/data/content.ts` (GitHub, LinkedIn, project repos)
- [ ] Netlify deployment (connect repo, build `npm run build`, publish `dist`)
- [ ] Post-deploy smoke test
- [ ] Cleanup: remove `dev-server.log`; decide CV PDF location
- **Status:** pending

## Key Questions

Record important questions and replace them with answers as they are resolved.

1. ~~What should "Productions" section contain?~~ → Production mindset: how I think about production systems (separate from general Mindset, later merged per user request).
2. ~~How should projects appear on the landing page?~~ → Minimal release cards; details on dedicated future pages.
3. ~~Case studies: PDF vs HTML?~~ → Markdown rendered in-app with themed components; standard for modern portfolios.
4. ~~Can the markdown files and images be deleted?~~ → No — they were moved (not copied) into `src/content/case-studies/` and `public/case-studies/`; they are the live source.
5. What are the real GitHub/LinkedIn/project URLs? → Awaiting user input (only remaining blocker for deploy).

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| React + Vite + TS + Tailwind | User wants multi-page growth + Netlify static deploy; industry standard |
| Black `#0a0e14` + neon cyan `#22d3ee` "Mission Control" theme | User preference (black + neon); fits Cloud/DevOps identity |
| Tailwind pinned to v3 | v4 removed `init` CLI and changed config format |
| react-router-dom from v1 | User explicitly plans project detail pages; avoids dead buttons + refactor later |
| Minimal project cards on landing | User request — keep landing scannable, details on future pages |
| Merge Mindset into Production Mindset | User request — single section, two sub-groups (production systems + general philosophy) |
| Markdown case studies via `import.meta.glob` loader | Drop-in `.md` files = new case studies with zero code changes |
| Short labels on cluster map nodes | 10 nodes cause label collisions with full names; popover/grid keep full labels |
| "AI Engineering" as cluster name | Modern, recruiter-searchable; user approved default |

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| PDF read failed (model lacks PDF input) | 1 | Extracted text via `pypdf` Python script |
| `npm create vite` refuses non-empty dir | 1 | Scaffolded to `temp-scaffold/`, then moved files up |
| Build failed: `./App.tsx` not found (Task 2 commit) | 1 | Expected — App.tsx arrives in Task 3; content.ts verified next build |
| Synthetic `mouseenter` didn't trigger React hover handlers | 1 | React delegates via `mouseover`; test with `mouseover` + real browser interactions |
| Snapshot/eval raced navigation (stale results) | 1–2 | Re-run script after navigation settles; add small delays |
| Cluster glob picked up `README.md` (`/*.md` matched root) | 1 | Changed pattern to `./*.md` (relative to loader dir) |
| Slug regex left `.md` in URL (paths are `./name.md`) | 1 | Replace `^\.?\/` and `\.md$` separately |

## Notes

- Update phase status as work progresses: `pending` to `in_progress` to `complete`.
- Re-read the goal and next step before major decisions.
- Log errors promptly so failed approaches are not repeated.
- Adding case studies: drop a `.md` file with front-matter (title, summary, tags, date) into `src/content/case-studies/` — no code changes needed.
- Blog can reuse the case-study markdown pipeline (different folder, same pattern).
