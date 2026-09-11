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
  { id: "contact", label: "Get in Touch" },
];

export const NAV_PAGES = [
  { path: "/blog", label: "Blog" },
  { path: "/case-studies", label: "Case Study" },
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
    short: "Cloud",
    icon: "☁",
    techs: ["AWS EC2", "S3", "IAM", "RDS", "EKS", "ECR", "VPC", "Terraform", "Linux"],
  },
  {
    id: "containers",
    label: "Containerization & Orchestration",
    short: "Containers",
    icon: "▣",
    techs: ["Docker", "Kubernetes (kind, kubeadm, EKS)", "Helm", "Docker Compose", "Calico CNI"],
  },
  {
    id: "cicd",
    label: "CI/CD & Automation",
    short: "CI/CD",
    icon: "⚙",
    techs: ["GitHub Actions", "Jenkins", "ArgoCD", "Bash"],
  },
  {
    id: "networking",
    label: "Networking & Security",
    short: "Networking",
    icon: "🔒",
    techs: ["VPC", "Security Groups", "AWS ALB", "Nginx", "TLS/SSL", "DNS", "HTTP/HTTPS"],
  },
  {
    id: "devsecops",
    label: "DevSecOps",
    short: "DevSecOps",
    icon: "🛡",
    techs: ["SonarQube", "Trivy", "CodeQL"],
  },
  {
    id: "monitoring",
    label: "Monitoring & Observability",
    short: "Monitoring",
    icon: "📈",
    techs: ["Prometheus", "Grafana", "ELK Stack"],
  },
  {
    id: "programming",
    label: "Programming",
    short: "Programming",
    icon: "⌨",
    techs: ["Python", "Go", "TypeScript", "JavaScript", "C", "C++"],
  },
  {
    id: "backend",
    label: "Backend & Databases",
    short: "Backend",
    icon: "🗄",
    techs: ["FastAPI", "Node.js", "REST API Design", "PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    id: "ai",
    label: "AI Engineering",
    short: "AI",
    icon: "🧠",
    techs: ["LangGraph", "LangChain", "AI Agents", "Prompt Engineering", "Hugging Face", "OpenCode"],
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
