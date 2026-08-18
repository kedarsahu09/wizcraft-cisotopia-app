# 🧸 Wiztopia Cyber Security Toy Store

A playful **e-commerce security demo** showcasing common backend and infrastructure security patterns in a cyber-themed toy shop.
 This version highlights clear data flow between the **frontend, backend API, Redis (sessions + cart)**, and **Cloud SQL** on GCP — including intentionally insecure service account permissions for educational purposes.

------

## 🧩 Tech Stack

- **Frontend:** Next.js (React + JSX)
- **Backend:** Node.js (Express API)
- **Database:** Cloud SQL (PostgreSQL)
- **Cache:** Redis — for **sessions** and **cart data**
- **Container Orchestration:** Docker Compose (local dev) + Kubernetes manifests (GKE ready)
- **Identity:** Backend runs under a **GCP service account** (deliberately over-privileged)
   → used to demonstrate lateral access risks to other GCP resources (Pub/Sub, Storage, Secret Manager, etc.)

------

## 🏗️ Architecture



```mermaid


flowchart TD
  %% Frontend
  B[Browser] -->|"HTTP / Fetch"| FE[Frontend Next.js]

  %% Backend connection
  FE -->|"Fetch (REST)"| BE[Backend API - Node.js]

  %% Backend storage
  BE -->|"Sessions"| RS[(Redis Session)]
  BE -->|"Cart Data"| RC[(Redis Cart)]
  BE -->|"Product & Order Data"| SQL[(Cloud SQL - GCP)]
  BE -.->|"Overprivileged Service Account\naccess to other GCP resources"| SA[(GCP Services: Storage / PubSub / Secret Manager / etc.)]

  %% Cloud SQL tables
  subgraph "Cloud SQL Tables"
    SQL --- PT[Products Table]
    SQL --- OT[Orders Table (fake)]
  end

  %% Redis keys
  subgraph "Redis Keys"
    RS --- SK[Session Keys]
    RC --- CK[Cart Keys (per session)]
  end

```

------

## 🚀 Quickstart (Local Dev)

### Prerequisites

- Node.js 20+
- Docker + Docker Compose (for Redis + PostgreSQL)
- GCP CLI (optional, for local emulation)

### Setup

1. **Clone & Install:**

   ```
   git clone <repo-url>
   cd wiztopia
   npm install # Install root deps (if any)
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Environment Variables:**

   - Create `.env` in `backend/`:
     ```
     PORT=4000
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wiztopia
     REDIS_URL=redis://localhost:6379
     SESSION_SECRET=your_session_secret_here # Generate a secure key
     ```

   - Create `.env.local` in `frontend/`:
     ```
     BASE_URL_STR=http://localhost:4000
     ```

3. **Start Services (Docker Compose):**

   ```
   docker compose up -d # Starts Redis + PostgreSQL
   ```

4. **Migrate & Seed Database:**

   ```
   cd backend
   npm run migrate # Create tables
   npm run seed # Insert demo data
   ```

5. **Run Servers:**

   - Backend API: `cd backend && npm start` (runs on `4000`)
   - Frontend: `cd frontend && npm run dev` (runs on `3000`)

6. **Access:**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api/toys
   - Redis: localhost:6379
   - PostgreSQL: localhost:5432 (Populated with demo data (`wiztopia` schema))

------

## 🧠 Application Flow

1. **Browser → Frontend:** React components render pages, useEffect sends fetch calls to backend.
2. **Frontend → Backend:** REST requests handled by Express.
3. **Backend → Redis:** Stores user sessions and cart info for user.
4. **Backend → Cloud SQL:** Reads product *and holds fake order data*.

If Redis is unreachable, sessions and cart memory are unavailable.

If SQL is unavailable, the API returns `503 Service Unavailable`.

------

## 🧰 Configuration

- `DATABASE_URL` — Connection string for Cloud SQL / PostgreSQL.
- `REDIS_URL` — Session cache endpoint (local or managed Redis)
- `SESSION_SECRET` — Required for signing session cookies
- Frontend and backend both read from `.env` files for now.

------

## 🧪 Testing

- **Backend:** Vitest + Supertest suite (`npm test` inside `backend/`)
- **Integration tests:** Testcontainers spins up Redis + SQLite automatically
- **Manual sanity checks:**

```
curl http://localhost:4000/healthz
curl 'http://localhost:4000/api/toys'
curl -c cookies.txt -d '{"toyId":1}' http://localhost:4000/cart
```

------

## 🚀 Deployment

- Deploy frontend , backend, and redis dbs as separate containers to GKE
- Use **Cloud SQL Auth Proxy** for secure database connectivity
- [Optional] Redis may remain containerized or be swapped with **GCP Memorystore**