# Wiztopia Frontend

Next.js/React UI that consumes the Wiztopia Toy Store API. It renders a simple catalogue experience for demos and lives alongside the backend in Docker Compose.

## Scripts
- `npm run dev` – run the development server.
- `npm start` – run the production server (after `npm run build`).

## Environment
Copy `.env.local.example` to `.env.local` for overrides. The defaults are:

```
BASE_URL_STR=http://localhost:4000
```

When running under Docker Compose the container listens on port 3000 and targets the backend service at `http://backend:4000`.

## Running Locally
```
npm install
npm run dev
```

The server serves static assets from `public/` and React components from `components/` and `pages/`. Adjust styles and scripts there as the design evolves.
