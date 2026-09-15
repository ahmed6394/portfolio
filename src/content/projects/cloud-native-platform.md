---
title: Cloud-Native Application Deployment Platform
subtitle: Full-stack Task Manager
summary: A full-stack Task Manager app — Angular + FastAPI + Postgres — containerized, deployed on Kubernetes via Helm, provisioned on AWS with Terraform, delivered by GitHub Actions CI/CD, and observed with Prometheus/Grafana.
tags: [Angular, FastAPI, Kubernetes, Helm, Terraform, GitHub Actions, Grafana, Prometheus]
---

## Architecture

```
Browser → Angular SPA → Nginx (reverse proxy) → FastAPI Backend → PostgreSQL
```

**Deployment path:** Docker images → ECR → Helm chart → EKS cluster → AWS

Everything below came from one Terraform run and one GitHub Actions pipeline — the app, its Kubernetes manifests, and its entire AWS footprint are reproducible from source.

---

## 1. Frontend (Angular 14)

| File | Purpose |
|------|---------|
| `Todo.model.ts` | Interface: `{ id, content, status }` |
| `todo.service.ts` | HTTP client — CRUD calls to `/api/todos` |
| `todo.component.ts` | Main component — load, save, done, remove, reset |
| `app-routing.module.ts` | Routes: `/todos` (default), `/health` |
| `environment.prod.ts` | Relative `apiUrl` — Nginx proxies `/api` |

**Key concepts:** Two-way binding (`[(ngModel)]`), `*ngFor`, RxJS `subscribe()`.

---

## 2. Backend (FastAPI + Python 3.13)

| File | Purpose |
|------|---------|
| `app.py` | FastAPI app — CORS, `/health`, includes router |
| `database.py` | SQLAlchemy engine + `get_db()` dependency |
| `models.py` | `Todo` ORM model with `created_at` / `updated_at` |
| `schemas.py` | Pydantic `TodoCreate`, `TodoUpdate`, `TodoResponse` |
| `routers/todos.py` | `/api/todos` — full CRUD + delete-all |
| `tests/test_todos.py` | 6 tests — health, create, get, get-by-id, update, delete |

**Key concepts:** Dependency injection (`Depends(get_db)`), `pool_pre_ping=True`, Pydantic `from_attributes`.

---

## 3. Docker

- **Frontend** — multi-stage: `node:18-alpine` build → `nginx:1.27-alpine` runtime
- **Backend** — single-stage `python:3.13-slim`, installed via `uv`
- **nginx.conf** — SPA routing (`try_files`), `/assets/` 30d cache, `/api/` proxy to `backend:8000`

---

## 4. Helm (Kubernetes)

Chart `todo-app` ships 14 templates covering the full app topology:

| Template | What it creates |
|----------|----------------|
| `frontend-deployment` | 2 replicas, NodePort 30080 |
| `backend-deployment` | 2 replicas, `DATABASE_URL` from Secret, resource limits |
| `postgres-deployment` | 1 replica, `postgres:15`, credentials from Secret |
| `secret.yaml` / `postgres-secret.yaml` | DB connection details |
| `ingress.yaml` | Routes `/` → frontend, `/api` → backend (conditional) |
| `hpa.yaml` | HPA — min 2, max 5, 70% CPU target (conditional) |

---

## 5. Terraform (AWS, eu-north-1)

Provisions the entire AWS footprint from scratch:

| Module | Resources |
|--------|-----------|
| `eks` | EKS cluster v1.29, node group (`t3.medium`, 1–3), OIDC provider, security groups |
| `rds` | PostgreSQL 16, private subnet group, SG open to EKS nodes only |
| `ecr` | Two repos (frontend + backend), immutable tags, scan-on-push |
| `iam` | Load Balancer Controller IRSA role + GitHub Actions OIDC role — no static keys |

**State:** S3 backend, encrypted, lockfile, environment-isolated (`dev/`).

---

## 6. CI/CD (GitHub Actions)

Three sequential jobs on push to `main`:

1. **`test-backend`** — checkout → `pytest`
2. **`build-and-push`** — AWS OIDC auth → ECR login → build frontend + backend images → push with SHA tag + `latest`
3. **`deploy`** — AWS OIDC → `aws eks update-kubeconfig` → `helm upgrade --install` with image-tag override

**Auth** is OIDC end-to-end — no static AWS keys anywhere.

---

## 7. Monitoring & Observability

A full stack of **Prometheus**, **Node Exporter**, **Blackbox Exporter**, and **Grafana**:

![Monitoring & Observability architecture](/projects/monitoring&observability.png)

• **Infrastructure**: Node Exporter: CPU, memory, disk, network, load

  ![Node Exporter Dashboard](https://i.ibb.co/tM1kD1XV/node-exporter-cpu-mem-traffic-dashboard.png)

• **Endpoints & uptime**: Blackbox: HTTP status, response time, DNS, SSL validity

  ![Blackbox Exporter Dashboard](https://i.ibb.co/v4KFXLDD/blackbox-dashboards-fullpage.png)

• **Verification**: Prometheus target health: exporters up, scrapes successful

  ![Prometheus Targets](https://i.ibb.co/zT4H918x/prometheus.png)

### Operational impact

| Tool | What it delivers |
|------|-----------------|
| **Docker** | Reproducible environments — same container runs locally, in CI, and in production. Multi-stage builds cut image size from ~900 MB to ~150 MB. |
| **Helm** | Templated Kubernetes manifests — one chart deploys frontend, backend, and Postgres with secrets, resource limits, and ingress wired automatically. |
| **Terraform** | Entire AWS footprint (EKS, RDS, ECR, IAM) reproducible from source. `terraform destroy` + `terraform apply` rebuilds the stack in under 10 minutes. |
| **GitHub Actions** | Push to `main` triggers test → build → deploy. OIDC auth means zero static AWS keys in the pipeline. |
| **Prometheus + Grafana** | Real-time visibility into infrastructure health, endpoint uptime, SSL validity, and response times — before users notice. |