# 🚨 Panic Protocol — EthGlobal HackMoney 2026

Emergency stop button for hacked wallets that still works after your ETH is drained: prepaid PANIC tokens + gasless relay.

**Problem**: No ETH → no gas → locked out of your own rescue.  
**Solution**: Buy PANIC tokens upfront; when drained, sign once (no gas), relay executes and burns PANIC.

→ **Full project overview**: [PROJECT.md](./PROJECT.md) — problem, solution, dual-path system, contracts, token economics, relay, user flows, demo script, roadmap.

---

## Project overview (this repo)

- **Stack:** React Router 7, React 19, TypeScript, Vite, Tailwind CSS 4
- **UI:** Radix UI primitives, shadcn/ui (Button), Lucide icons, Tailwind + tw-animate
- **Rendering:** Server-side rendering (SSR) by default; configurable in `react-router.config.ts`

## Repository structure

```text
panic-protocol/
├── app/
│   ├── root.tsx           # Root layout, links, meta
│   ├── routes.ts          # Route manifest
│   ├── routes/
│   │   └── home.tsx       # Home route
│   ├── welcome/           # Welcome / landing UI
│   ├── components/ui/     # Shared UI (e.g. Button)
│   ├── lib/               # Utilities
│   └── app.css            # Global styles (Tailwind)
├── public/                # Static assets
├── react-router.config.ts # React Router (SSR, etc.)
├── vite.config.ts        # Vite + React Router + Tailwind + path aliases
├── tsconfig.json          # TypeScript (includes .react-router/types)
├── package.json
├── Dockerfile             # Production image
└── README.md              # This file
```

## Scripts and build

| Command | Description |
|--------|-------------|
| `pnpm run dev` | Start dev server with HMR at `http://localhost:5173` |
| `pnpm run build` | Production build (client + server) into `build/` |
| `pnpm run start` | Serve production build (e.g. `react-router-serve ./build/server/index.js`) |
| `pnpm run typecheck` | Generate route types (`react-router typegen`) and run `tsc` |

### Build output

- **`build/client/`** — Static assets (JS, CSS, images) for the browser.
- **`build/server/`** — Server bundle (e.g. `index.js`) for SSR and serving the app.

Route types are generated under `.react-router/types/` (gitignored). Run `pnpm run typecheck` or `pnpm exec react-router typegen` after cloning or changing routes so the IDE and TypeScript resolve `./+types/*` imports.

## Development

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm run dev`
3. Open **<http://localhost:5173>**

## Production and Docker

- **Local production run:** `pnpm run build` then `pnpm run start`
- **Docker:** `docker build -t panic-protocol .` then `docker run -p 3000:3000 panic-protocol`

The app can be deployed to any Node-friendly or Docker-friendly platform (e.g. AWS, GCP, Fly.io, Railway).

## Environment

- Use `.env` for environment variables (see `.gitignore`). Do not commit secrets.

---

*Panic Protocol — emergency stop for compromised wallets.*
