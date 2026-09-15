---
title: "Watching Kubernetes Scale Itself: A Live HPA Demo"
summary: "Deploy a tiny app, hammer it with traffic, and watch Kubernetes scale it from 1 to 5 pods and back — HPA theory plus a live annotated capture."
date: 2026-09-15
tags: [kubernetes, hpa, autoscaling, devops]
---

# Watching Kubernetes Scale Itself: A Live HPA Demo

The Kubernetes **Horizontal Pod Autoscaler (HPA)** automatically adds or removes
pods based on load. It sounds simple on paper — but the best way to *really*
understand it is to watch it happen live. In this post I'll walk through a small
hands-on exercise: deploy a deliberately tiny app, hammer it with traffic, and
watch Kubernetes scale it from **1 → 5 pods** and then back down to **1** — all
captured in real time with `kubectl get hpa -w`.

![The demo app under load — retro welcome page with a live request graph](https://i.ibb.co/VWC4LYBN/HPA-UI.png)

## What we're building

1. A demo app (a retro "welcome to the mainframe" page) with **tiny CPU requests**,
   so it's easy to stress
2. **metrics-server**, the data source the HPA relies on
3. An **HPA** targeting 50% average CPU utilization, `minReplicas: 1`, `maxReplicas: 5`
4. A load generator (`ab` or a busybox loop)
5. A terminal watching the HPA do its thing

## The theory: how HPA actually works

Before touching the terminal, it's worth a few minutes on *how* this thing works
under the hood — it makes the demo output much more satisfying to read.

### Three kinds of autoscaling

Kubernetes can scale in three dimensions, and they're easy to confuse:

| Autoscaler | What it changes | The question it answers |
|---|---|---|
| **HPA** — Horizontal Pod Autoscaler | number of pod replicas | "How many pods do I need?" |
| **VPA** — Vertical Pod Autoscaler | CPU/memory requests per pod | "How big should each pod be?" |
| **Cluster Autoscaler** | number of nodes | "How many nodes do I need?" |

This tutorial is about the HPA — by far the most commonly used of the three.

### The control loop

The HPA is not a separate daemon — it's a **control loop inside
kube-controller-manager**. Every **15 seconds** (configurable via
`--horizontal-pod-autoscaler-sync-period`), for every HPA object it:

1. Reads the spec: target workload, min/max replicas, metrics and their targets
2. Queries the **Metrics API** (`metrics.k8s.io`) for the current average CPU
   across the target's pods
3. Runs the scaling algorithm (below)
4. If scaling is needed, updates `spec.replicas` on the target

The target can be any resource implementing the `scale` subresource — typically
a Deployment, ReplicaSet, or StatefulSet. The metrics pipeline looks like this:

```text
kubelet (cAdvisor) → metrics-server → Metrics API (metrics.k8s.io) → HPA controller
```

Note that the HPA never talks to pods directly, and it has **no opinion about
nodes** — that's the Cluster Autoscaler's job.

### The scaling algorithm

Every sync, the HPA computes:

```text
desiredReplicas = ceil(currentReplicas × currentUtilization / targetUtilization)
```

Keep this formula in mind — the numbers in the screenshots below will match it
almost exactly. Three details the formula hides:

- **Utilization is measured against the pod's *requested* CPU** — not the node's
  capacity and not the limit. This is why `resources.requests` matters so much
  (and why a 50m request makes an app so easy to stress).
- **Tolerance**: if the current ratio is within **10%** of the target, the HPA
  does nothing. Without this, a pod hovering at 52% against a 50% target would
  cause endless one-pod-up-one-pod-down churn.
- **No metrics → no decision**: if metrics-server can't report, the HPA simply
  skips that cycle. It never guesses.

### Scale-up is fast, scale-down is slow

The defaults encode two different philosophies:

- **Scale-up** is aggressive: stabilization window of 0 — replicas can double
  every 15 seconds. When traffic spikes, you want capacity *now*.
- **Scale-down** is conservative: recommendations are stabilized over a
  **5-minute window** and applied gradually. When traffic drops, you'd rather
  pay for one extra pod than thrash the cluster.

We'll watch both behaviors live in the demo below.

## Step 1: The app — tiny on purpose

The deployment requests just **50m of CPU** (5% of a core) and 64Mi of memory,
with a limit of 100m/128Mi. Because utilization is calculated against the
*request*, even a small amount of real traffic pushes the percentage way up —
perfect for a demo.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: demo-app
  labels:
    app: demo-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: demo-app
  template:
    metadata:
      labels:
        app: demo-app
    spec:
      containers:
      - image: <your-demo-app-image>
        name: demo-app
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "50m"      # 0.05 of a CPU core (very small, easy to stress)
            memory: "64Mi"  # 64 Megabytes
          limits:
            cpu: "100m"
            memory: "128Mi"
```

With a 50m request, the HPA's 50% target translates to just **25m of real CPU
usage** — one page being served is enough to cross it.

The service exposes it:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: demo-svc
spec:
  type: NodePort
  selector:
    app: demo-app
  ports:
  - port: 8080
    targetPort: 8080
```

Apply everything:

```bash
kubectl apply -f deployment.yaml -f service.yaml -f hpa.yaml
```

## Step 2: The HPA

We're using `autoscaling/v2` — the current API (GA since Kubernetes 1.23), which
adds multiple metrics, custom/external metrics, and a `behavior` field for
tuning scale-up/scale-down (the older `v1` only supports CPU utilization).

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: demo-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: demo-app
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

Plain English: *"Keep average CPU at 50% of request. Never fewer than 1 pod,
never more than 5."*

## Step 3: Install metrics-server

As we saw in the metrics pipeline above, the HPA has no idea about CPU usage
until metrics-server is running. On playground clusters (like Killercoda),
kubelets use self-signed certs, so we also need the `--kubelet-insecure-tls`
flag:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

kubectl patch deployment metrics-server -n kube-system --type=json \
  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'

kubectl rollout restart deployment metrics-server -n kube-system
kubectl rollout status deployment metrics-server -n kube-system
```

Wait a couple of minutes, then verify metrics are flowing:

```bash
kubectl top pods
kubectl get hpa
```

## Step 4: Generate load

`ab` may not be installed — grab it:

```bash
apt-get install -y apache2-utils
```

Then fire a sustained load — as many requests as fit in 3 minutes, 20
concurrent:

```bash
ab -t 180 -c 20 https://<your-app-url>/
```

Alternatively, a busybox hammer running inside the cluster:

```bash
kubectl run load-generator \
  --image=busybox:1.36 \
  --restart=Never \
  -- /bin/sh -c 'while true; do wget -q -O- http://demo-svc:8080/ > /dev/null; done'
```

## Step 5: Watch it happen

In a second terminal:

```bash
kubectl get hpa demo-app-hpa -w

kubectl top pods   # run this DURING the load — watch CPU climb past 25m
```

Here's the capture from my run:

![kubectl get hpa -w showing replicas scale up and back down](https://i.ibb.co/nsZ0128s/HPA-output.png)

Annotated timeline:

| AGE | CPU | Replicas | What's happening |
|-------|----------|----------|-----------------------------------------------|
| 28m | 2%/50% | 1 | Idle baseline |
| 29m | 160%/50% | 1 | Load spike hits — metric way over target |
| 29m | 160%/50% | **4** | Scale-up: `ceil(1 × 160/50) = ceil(3.2) = 4` |
| 29m | 198%/50% | 4 | Still overloaded: `ceil(4 × 198/50) = 16`... |
| 30m | 172%/50% | **5** | ...but capped at `maxReplicas: 5` |
| 30m | 64%→0% | 5 | Load ends; CPU drops |
| 31–32m| 0–2% | 4→3→2→1 | Gradual scale-down to baseline |

Notice how the formula from the theory section predicts the 1 → 4 jump
*exactly*. And when 4 replicas still weren't enough (math says 16), the HPA
respects the `maxReplicas: 5` ceiling.

## Why scale-down is slow (and that's a good thing)

We saw the defaults in the theory section; here's what they look like in
`autoscaling/v2` (these are what you get if you omit `behavior` entirely):

```yaml
behavior:
  scaleUp:
    stabilizationWindowSeconds: 0
    selectPolicy: Max
    policies:
    - type: Percent
      value: 100      # double the current replicas...
      periodSeconds: 15
    - type: Pods
      value: 4        # ...or add 4 pods per 15s — whichever is larger
      periodSeconds: 15
  scaleDown:
    stabilizationWindowSeconds: 300   # 5-minute stabilization window
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
```

That's exactly what the capture shows: an aggressive 1 → 4 jump on the way up,
and a patient 5 → 4 → 3 → 2 → 1 walk on the way down. This prevents *flapping* —
constant add/remove churn caused by short-lived traffic bursts. Better to run
one extra pod for a minute than to thrash the cluster.

## Key takeaways

- **HPA utilization is relative to `resources.requests.cpu`** — tiny requests
  mean tiny workloads trigger scaling. Great for demos, dangerous to forget in
  production.
- **Scaling math is predictable** — `ceil(replicas × current/target)` explains
  the exact replica counts you'll see.
- **10% tolerance** — small deviations from the target are deliberately ignored
  to avoid churn.
- **`maxReplicas` is a hard cap** — the autoscaler will exceed the "ideal"
  number of replicas before it ever exceeds your maximum.
- **Scale-down lag is a feature**, not a bug — the stabilization window
  protects you from flapping.
- metrics-server is a **prerequisite** — no metrics, no autoscaling.

## Cleanup

```bash
kubectl delete pod load-generator --ignore-not-found
kubectl delete hpa demo-app-hpa
kubectl delete service demo-svc
kubectl delete deployment demo-app
```

---

*Thanks for reading — questions and feedback welcome!*
