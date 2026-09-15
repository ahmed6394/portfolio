---
title: DevOps Incident Management Platform
subtitle: Incident Management web app
summary: A containerized incident management platform with a production-style CI/CD workflow — Docker Compose orchestration, SonarQube quality gates, Trivy vulnerability scanning, smoke tests, and GitOps deployment with ArgoCD.
tags: [React, Node.js, Docker Compose, GitHub Actions, SonarQube, Trivy, Kubernetes, ArgoCD]
---

A practical DevOps engineering lab that combines a containerized full-stack application with a production-style delivery workflow. The app is a small incident management platform, but the point is the pipeline around it — containerization, orchestration, automated verification, image scanning, and release automation.

## What this project demonstrates

- Containerization of a multi-service application with Docker and Docker Compose
- Infrastructure-friendly orchestration with health checks and persistent storage
- CI/CD automation in GitHub Actions
- Vulnerability scanning with Trivy
- Static analysis and quality gates with SonarQube
- End-to-end smoke testing against the real stack

---

## Application architecture

```
User -> Frontend (React + Nginx) -> Backend (Express + Node.js) -> PostgreSQL
```

Three services run the stack:

- **Frontend** — React app served through Nginx in production mode
- **Backend** — Express API with session-based auth and incident management logic
- **Database** — PostgreSQL with persistent storage and health checks

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Nginx |
| Backend | Node.js, Express |
| Database | PostgreSQL 16 |
| Orchestration | Docker Compose, Kubernetes (KinD) |
| CI/CD | GitHub Actions |
| Security | Trivy |
| Quality | SonarQube |
| GitOps | ArgoCD |

---

## Repository structure

```
docker-lab/
├── backend/              # Express API service and Dockerfile
├── frontend/             # React frontend and Nginx config
├── kubernetes/           # KinD config, K8s manifests, and instructions
├── docs/                 # design specs and engineering notes
├── .github/workflows/    # CI/CD pipeline definition
├── docker-compose.yaml   # local multi-container environment
└── README.md             # DevOps-focused project documentation
```

---

## CI/CD pipeline

The GitHub Actions workflow in `.github/workflows/ci.yml` is a release-quality pipeline:

1. **Build** — validates the Compose configuration and builds both application images
2. **Static analysis (SonarQube)** — code quality and maintainability checks; detects bugs, vulnerabilities, and code smells early
3. **Security scanning (Trivy)** — scans backend and frontend images; fails the pipeline on CRITICAL and HIGH issues
4. **Smoke testing** — starts the full stack, verifies frontend, backend health, and API flows, then tears it down
5. **Publish** — on pushes to `main`, publishes images with `latest` and `sha-<commit>` tags

This reflects the core DevOps loop: build reliably, validate automatically, scan for vulnerabilities, test in a near-production environment, and publish verified artifacts.

---

## GitOps deployment (ArgoCD)

Kubernetes manifests are GitOps-managed — ArgoCD watches the repository and synchronizes the cluster to the declared state, so every deploy is auditable and rollback-ready:

![ArgoCD UI](https://i.ibb.co/hJ7rV3BL/Screenshot-2026-09-11-225551.png)

---

## Security & quality engineering

**Trivy** is integrated into the pipeline for container-image vulnerability scanning. The workflow stops the build when CRITICAL or HIGH issues are detected, enforcing a security gate before release.

**SonarQube** provides static code analysis, maintainability metrics, security hotspot review, and quality thresholds — keeping bugs and code smells out of the delivery path.

![SonarQube Cloud overview](https://i.ibb.co/fYrtzh29/Screenshot-2026-08-07-143700.png)

![GitHub Actions CI pipeline](https://i.ibb.co/Vpz9xt5r/Screenshot-2026-08-07-143759.png)

---

## Operational impact

| Tool | What it delivers |
|------|-----------------|
| **Docker Compose** | One command brings up the full stack (frontend, backend, Postgres) with health checks and named volumes; database state survives restarts. |
| **GitHub Actions** | Push to `main` triggers build → SonarQube → Trivy → smoke test → publish, with `sha-<commit>` image tags for reproducibility. |
| **SonarQube** | Quality gates catch bugs, security hotspots, and code smells before they reach the release path. |
| **Trivy** | Container images are scanned automatically; CRITICAL/HIGH findings fail the build, so vulnerable images never get published. |
| **Smoke tests** | The real stack is started, verified, and torn down in CI — proving frontend, backend, and API flows actually work. |
| **ArgoCD** | GitOps sync keeps the cluster at the declared state; every deploy is auditable and rollback-ready. |