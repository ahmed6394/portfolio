---
title: kind on GitHub Codespaces — a Free Kubernetes Lab
summary: A free, browser-reachable Kubernetes playground on Codespaces — and why every pod hits ImagePullBackOff until you fix stale iptables rules and node DNS.
tags: [Kubernetes, kind, Codespaces, DevOps]
date: 2026-09
---

# Running kind on GitHub Codespaces: Building a Free Kubernetes Lab (and Fixing the ImagePullBackOff Trap)

## Why this post exists

I wanted a throwaway Kubernetes playground that:

- Doesn't eat my laptop's RAM
- Is reachable from a browser (for testing web apps on NodePort)
- Resets cleanly whenever I break it

GitHub Codespaces seemed perfect: a real Linux VM with Docker preinstalled, 60 free hours a month, and a browser-based terminal. And `kind create cluster` *did* work… until I deployed my first app and every pod went into `ImagePullBackOff`.

This post walks through the full setup — and more importantly, **why** vanilla kind breaks inside Codespaces, what `ImagePullBackOff` actually means, and the exact scripts that fix it.

By the end you'll have three files in your repo:

| File | Purpose |
|---|---|
| `setup.sh` | Installs kind (architecture-aware) |
| `kind-config.yaml` | Cluster config with port mappings |
| `fix-node-egress.sh` | Fixes node egress + DNS **after** cluster creation |

---

## The anatomy of the beast (read this first)

A GitHub Codespace is itself a **Docker container running on an Azure VM**. When you run Docker inside it (Docker-in-Docker), and kind on top of that, you get containers within containers:

![Anatomy of the container nesting](/blog/anatomy.png)

Two consequences of this nesting cause all our pain:

1. **Every kind node is a Docker container.** For a pod to pull an image, the node container must make an HTTPS connection to Docker Hub — which means the packet must successfully traverse the codespace's iptables rules.
2. **Node DNS is inherited, not magic.** Whatever resolver setup the inner Docker daemon has gets baked into the node's `/etc/resolv.conf`. If that's broken inside Codespaces, the node can't even resolve `registry-1.docker.io`.

Keep this picture in mind. Everything below is one of these two things failing.

---

## Step 1 — Install kind with `setup.sh`

The default Codespace universal image already ships Docker and kubectl, so the only missing tool is kind. One gotcha: Codespaces can run on **x86_64 or ARM (aarch64)** machines, so the installer must detect the architecture:

```bash
# ----------------------------
#  Install Kind (based on architecture)
# ----------------------------
if ! command -v kind &>/dev/null; then
  echo "Installing Kind..."

  ARCH=$(uname -m)
  if [ "$ARCH" = "x86_64" ]; then
    curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-amd64
  elif [ "$ARCH" = "aarch64" ]; then
    curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-arm64
  else
    echo "❌ Unsupported architecture: $ARCH"
    exit 1
  fi

  chmod +x ./kind
  sudo mv ./kind /usr/local/bin/kind
  echo "Kind installed successfully"
else
  echo "Kind is already installed"
fi
```

> **Note:** kind is pinned to `v0.29.0` here for reproducibility — check the [kind releases page](https://github.com/kubernetes-sigs/kind/releases) and bump if you want a newer version.

Make it executable: `chmod +x setup.sh`, then run `./setup.sh`.

---

## Step 2 — `kind-config.yaml`: port mappings before cluster creation

By default, kind nodes are unreachable from outside Docker. Since I want to hit my apps in the browser via NodePort, the config maps two ports at cluster-creation time:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 30080   # NodePort range start
    hostPort: 30080
    protocol: TCP
  - containerPort: 5000    # app port
    hostPort: 5000
    protocol: TCP
```

`extraPortMappings` is the key — it's Docker-level port publishing from the node container to the codespace, and it **cannot be added after the cluster exists**. (Then the Codespaces Ports panel makes those ports browser-accessible — more on that in Step 6.)

---

## Step 3 — Create the cluster

```bash
kind create cluster --config=kind-config.yaml --name=my-cluster
kubectl cluster-info --context kind-my-cluster
kubectl get nodes
```

You should see `my-cluster-control-plane` in `Ready` status. Everything looks perfect.

And then you deploy something. And it breaks.

---

## Step 4 — The trap: `ImagePullBackOff`

Deploy any image from a public registry and watch:

```bash
kubectl get pods
# NAME                     READY   STATUS             RESTARTS   AGE
# my-app-5d7b8f6c4-kx2lp   0/1     ImagePullBackOff   0          90s
```

### What `ImagePullBackOff` actually means

When a pod is scheduled, the **kubelet on the node** asks the container runtime (containerd, inside the kind node) to pull the image. If the pull fails, the kubelet retries with exponential backoff — 10s, 20s, 40s… capped at 5 minutes. That retry loop *is* the status: `ErrImagePull` on the first attempt, then `ImagePullBackOff` while backing off.

`ImagePullBackOff` is not a diagnosis — it's a symptom wrapper. The real reason is always in the events:

```bash
kubectl describe pod <pod-name> | grep -A 10 Events
```

Here's the decoder ring:

| Event message | Actual problem |
|---|---|
| `manifest unknown` / `not found` | Typo in image name or tag |
| `401 Unauthorized` / `authentication required` | Private registry, missing `imagePullSecrets` |
| `toomanyrequests` (HTTP 429) | Docker Hub anonymous rate limit |
| `dial tcp: lookup registry-1.docker.io: no such host` | **Node DNS is broken** |
| `i/o timeout` / `context deadline exceeded` | **Node egress is blocked** |

Notice the last two. Those aren't Kubernetes problems, registry problems, or manifest problems — the node simply cannot reach the internet. And in GitHub Codespaces, that's *exactly* what you get. Run the describe and you'll see one of those two errors staring back at you.

---

## Step 5 — Root cause: why kind nodes can't reach the internet in Codespaces

Two independent things are broken. Confirm both before applying the fix:

### Culprit 1: A stale `iptables-legacy` ruleset is dropping node traffic

Linux has two iptables backends that can hold rules **at the same time**: the legacy `x_tables` interface and the newer nftables backend. Docker manages its rules in one; Codespace images carry stale rules in the other — including a default **DROP policy on the FORWARD chain**.

Check it yourself:

```bash
sudo iptables-legacy -S FORWARD
# -P FORWARD DROP
# ... no mention of any br-xxxx interface
```

Here's the nasty part: an ACCEPT rule in Docker's ruleset does **not** override a DROP in the legacy ruleset — the kernel evaluates both, and a DROP in either kills the packet. So when kind creates its bridge network (`br-xxxxxxxxxxxx`), Docker happily installs its NAT and forwarding rules… and node traffic still dies at the legacy FORWARD chain, because **nothing in that stale ruleset knows the kind bridge is allowed to talk to the outside world.**

Result: packets from the kind nodes get dropped → no egress → `i/o timeout` on every image pull.

### Culprit 2: The node's DNS resolver is useless

Look inside the node:

```bash
docker exec my-cluster-control-plane cat /etc/resolv.conf
docker exec my-cluster-control-plane getent hosts registry-1.docker.io
```

The `getent` command comes back **empty** — the node can't resolve Docker Hub at all. That's because the node inherited a resolver configuration from the inner Docker daemon that doesn't work from within the node container's network namespace.

Codespaces run on Azure, and Azure provides an internal recursive resolver at **`168.63.129.16`** that's reachable from any network namespace on the VM (once NAT works). That's our nameserver.

---

## Step 6 — The fix: `fix-node-egress.sh`

```bash
#!/usr/bin/env bash
set -e

BR="br-$(docker network inspect kind -f '{{.Id}}' | cut -c1-12)"
NODE="${1:-my-cluster-control-plane}"

# 1. Whitelist kind bridge in the stale iptables-legacy ruleset
if ! sudo iptables-legacy -S FORWARD 2>/dev/null | grep -q -- "-i $BR"; then
  sudo iptables-legacy -A FORWARD -i "$BR" ! -o "$BR" -j ACCEPT
  sudo iptables-legacy -A FORWARD -o "$BR" -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
  sudo iptables-legacy -t nat -A POSTROUTING -s 172.18.0.0/16 ! -o "$BR" -j MASQUERADE
  echo "✅ firewall patched ($BR)"
else
  echo "✅ firewall already patched"
fi

# 2. Fix the node's resolver
docker exec "$NODE" bash -c 'echo "nameserver 168.63.129.16" > /etc/resolv.conf'
echo "✅ node resolver set"

# 3. Verify
docker exec "$NODE" getent hosts registry-1.docker.io >/dev/null \
  && echo "🎉 node egress + DNS working" \
  || { echo "❌ still broken"; exit 1; }
```

### What each piece does

**The bridge name.** Docker names the Linux bridge interface for every user-defined network `br-` + the first 12 characters of the network ID. `docker network inspect kind -f '{{.Id}}' | cut -c1-12` fetches exactly that.

**Rule 1 — outbound from nodes:**
```bash
-A FORWARD -i "$BR" ! -o "$BR" -j ACCEPT
```
Traffic entering the host *from* the bridge (`-i $BR`) and leaving through anything that *isn't* the bridge (`! -o $BR`) — i.e., nodes reaching the internet — is accepted.

**Rule 2 — return traffic:**
```bash
-A FORWARD -o "$BR" -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
```
Without this, reply packets flowing back *into* the bridge would hit the DROP policy. Conntrack only allows responses to connections the nodes initiated — not unsolicited inbound traffic.

**Rule 3 — NAT:**
```bash
-t nat -A POSTROUTING -s 172.18.0.0/16 ! -o "$BR" -j MASQUERADE
```
`172.18.0.0/16` is the subnet of kind's default Docker network (the node IPs — not the Kubernetes pod CIDR, a common confusion). MASQUERADE rewrites node traffic to the host's IP so the internet knows how to route replies back.

The `grep` guard makes the whole thing **idempotent** — running it twice won't stack duplicate rules.

**The resolver fix.** Overwriting `/etc/resolv.conf` inside the node container with `nameserver 168.63.129.16` gives every pod on that node working DNS. (`168.63.129.16` is Azure-specific; if you port this setup to a non-Azure environment, substitute a resolver that's actually reachable there, e.g. `1.1.1.1`.)

**The verification.** If `getent hosts registry-1.docker.io` resolves, the node can pull images. Done.

### ⚠️ Order matters: run this AFTER `kind create cluster`

This trips people up constantly, so it's worth repeating: the script depends on two things that **only exist after cluster creation**:

- The `kind` bridge network (`docker network inspect kind` fails otherwise)
- The node container (`docker exec` fails otherwise)

Right order, every time:

```bash
kind create cluster --config=kind-config.yaml --name=my-cluster
./fix-node-egress.sh
```

Running a multi-node cluster? Pass the node name:

```bash
./fix-node-egress.sh my-cluster-worker
```

---

## Step 7 — Deploy and verify

```bash
kubectl apply -f <namespace + secret manifests>
kubectl apply -f database-deployment.yaml
kubectl get pods -n my-namespace
```

Pods should move `ContainerCreating` → `Running` — no more `ImagePullBackOff`.

**For browser access:** open the **Ports** panel in Codespaces and forward ports `30080` and `5000`. GitHub gives you a public HTTPS URL for each; your NodePort services are now reachable from a browser.

---

## The fresh-session checklist

Codespaces are ephemeral. Here's the full ritual for every new Codespace or after a rebuild:

```bash
# 1. Tools
./setup.sh

# 2. Cluster
kind create cluster --config=kind-config.yaml --name=my-cluster

# 3. The fix — must come AFTER create (bridge doesn't exist before)
./fix-node-egress.sh

# 4. Deploy
kubectl apply -f <namespace + secret manifests>
kubectl apply -f database-deployment.yaml
kubectl get pods -n my-namespace

# 5. For browser access: forward ports 30080 & 5000 in the Ports panel
```

---

## Cleanup

```bash
kind delete cluster --name my-cluster
```

Or delete the whole Codespace from github.com when you're done — your scripts live in the repo, so the next lab is two minutes away.

---

## Wrapping up

The lesson from this whole adventure: `ImagePullBackOff` is rarely a Kubernetes bug — it's your node trying to tell you, through `kubectl describe`, that it can't reach the registry. In GitHub Codespaces the cause is environmental (stale legacy iptables rules + inherited DNS), and once you understand the container-in-container anatomy, the fix is three iptables rules and one `resolv.conf` line.

Happy clustering. 🚢

---
