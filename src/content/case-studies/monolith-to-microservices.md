---
title: Monolith-to-Microservices Migration
summary: Rebuilding a crashed e-commerce monolith into an elastic, microservices-based architecture on AWS EKS — after a 4-hour Black Friday outage cost $3.2M.
tags: [AWS, EKS, Docker, Kubernetes, Terraform]
date: 2026-08
---

# Case Study 1: Monolith-to-Microservices Migration (E-commerce Scale)

## 1. Executive Summary & Business Context

**Company Profile:** A global online retail brand operating in high-volume fashion and electronics.

**The Trigger Event:** During a major promotional sales event (Black Friday / Cyber Monday), the company experienced a catastrophic 4-hour system outage. Transaction logs revealed that a massive spike in customer traffic on the "User Reviews and Q&A" section consumed all available memory on primary application servers. Because the application was built as a single monolithic codebase, the memory leak in the review module crashed the entire web process—including the checkout, payment gateway integration, and inventory reservation modules.

**Business Impact:** An estimated $3.2 million in lost sales, severe customer attrition, and a 40% spike in customer support ticket volume.

**Strategic Mandate:** The Chief Technology Officer (CTO) mandated an immediate architectural overhaul: transition from a single monolithic application running on static virtual machines to an elastic, highly available, microservices-based containerized architecture hosted on **AWS Elastic Kubernetes Service (EKS)**.

---

## 2. Legacy Architecture vs. Target Architecture

### Legacy Monolithic Architecture

![Monolith Architecture](/case-studies/monolith-architecture.png)

### Technical Flaws of the Legacy System

1.  **Single Point of Failure (SPOF):** A crash in a non-critical feature (Reviews) takes down critical revenue-generating features (Checkout).
2.  **Resource Inefficiency:** To handle load spikes on a single module, the entire monolithic EC2 instance must be scaled up, incurring massive compute costs for idle components.
3.  **Deployment Bottlenecks:** Over 60 engineers merge code into a single repository. A single failing test blocks the entire release pipeline, dragging release cycles from daily down to once every three weeks.
4.  **Configuration Drift:** EC2 instances were updated over time via manual SSH commands and custom bash scripts, creating non-reproducible runtime environments across Development, Staging, and Production.

### Target Microservices Architecture (EKS + Infrastructure as Code)

![Microservice Architecture](/case-studies/microservice-architecture.png)

## 3. Tool-by-Tool Implementation Breakdown

### A. Linux (Operating System Layer)
*   **Role:** Container Runtime Host Base & Security Context.

### B. Git & GitHub (Version Control & Collaboration)
*   **Role:** Source of Truth & Trunk-Based Development.
*   **Implementation Details:**
    *   The monolithic repository is broken down into separate microservice repositories (`auth-service`, `catalog-service`, `checkout-service`, `reviews-service`).
    *   Teams operate on a **Trunk-Based Development** model: short-lived feature branches are merged into `main` multiple times per day via strict Pull Request (PR) policies requiring 2 peer approvals and automated status checks.

### C. Docker (Containerization Layer)
*   **Role:** Application Packaging & Environment Parity.
*   **Implementation Details:**
    *   Each microservice contains a multi-stage `Dockerfile` to create lightweight runtime images.
    *   **Stage 1 (Build):** Compiles code and downloads build tools inside a full SDK image.
    *   **Stage 2 (Runtime):** Copies only compiled binaries or production assets into a minimal `alpine` or `distroless` base image.
    *   Applications are configured to run as dedicated non-root Linux users (e.g., `USER appuser` with UID 10001) to prevent privilege escalation attacks.

```dockerfile
# Example Multi-Stage Dockerfile Strategy
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER appuser
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### D. Amazon Web Services (AWS - Cloud Infrastructure)
*   **Role:** Core Cloud Provider & Managed Services.
*   **Implementation Details:**
    *   **Amazon ECR (Elastic Container Registry):** Serves as the private enterprise registry storing versioned, immutably tagged Docker images (`$GITHUB_SHA`).
    *   **Amazon EKS (Elastic Kubernetes Service):** Provides managed Kubernetes control plane functionality across 3 Availability Zones (AZs).
    *   **AWS IAM Roles for Service Accounts (IRSA):** Eliminates hardcoded AWS access keys inside containers. Kubernetes service accounts map directly to IAM roles via AWS Security Token Service (STS).

### E. Terraform (Infrastructure as Code)
*   **Role:** Automated Infrastructure Provisioning.
*   **Implementation Details:**
    *   Declarative HCL code defines the cloud foundation: VPCs, Public/Private Subnets, NAT Gateways, Security Groups, EKS Control Plane, and Managed Node Groups.
    *   Remote state files are stored securely in an Amazon S3 bucket with versioning enabled and locked using Amazon DynamoDB to prevent state collisions.

### F. Kubernetes (Container Orchestration)
*   **Role:** Runtime Management, Scaling, and Self-Healing.
*   **Implementation Details:**
    *   **Horizontal Pod Autoscaler (HPA):** Monitors CPU, Memory, and custom application metrics (e.g., HTTP request rate) to automatically scale pods from 3 to 50 replicas during load spikes.
    *   **Resource Requests & Limits:** Hard boundaries ensure that a single service cannot consume host node resources uncontrollably:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

*   **Probes:** `livenessProbe` restarts unresponsive containers, while `readinessProbe` removes unhealthy pods from serving load balancer traffic until initialization passes.

---

## 4. Key Architectural Trade-offs & Decisions

| Decision Area | Monolithic Approach | Microservices (EKS) | Trade-off / Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **System Complexity** | Low architectural complexity; high code complexity. | High architectural complexity; low code complexity. | Trading infrastructure simplicity for operational resilience and independent team speed. |
| **Data Architecture** | Single centralized relational database. | Decoupled data stores (Database-per-Service). | Data separation eliminates database locks but introduces challenges around distributed transactions (requires Saga pattern). |
| **Network Overhead** | In-memory function calls (sub-millisecond latency). | Network calls over gRPC/REST (adds 2-5ms per hop). | Minimal latency increase offset by massive parallel scaling capability. |