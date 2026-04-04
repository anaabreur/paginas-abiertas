# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the **Páginas Abiertas** book club portal — a community landing page for a literary exploration club for girls aged 12-17.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion

## Artifacts

### `artifacts/paginas-abiertas` — Main Web App (at `/`)
The public landing page for Páginas Abiertas book club. Single-page scroll with:
- **Hero** section with dark navy background and paper airplane decoration
- **El Club** — club description and feature cards
- **7 Países Literarios** — genre cards styled as passport stamps
- **Votación** — interactive voting with code validation and confetti celebration
- **Exploradoras** — leaderboard with identity modal (alias + one of 8 custom SVG character avatars stored by id in localStorage)
- **En Ruta Ahora** — current book being read by the club
- **Footer** with quick links and social icons
- **Admin panel** at `/admin` (password: `paginas2026`) — manage voting sessions, leaderboard, current book

### `artifacts/api-server` — API Server (at `/api`)
Express 5 backend with:
- `/api/voting/session` — current voting session
- `/api/voting/books` — candidate books with vote counts
- `/api/voting/vote` — cast vote with code
- `/api/leaderboard` — public ranked leaderboard
- `/api/current-book` — current book info
- `/api/admin/*` — admin endpoints (verify password, manage voting/leaderboard/book)

## Brand Colors
- Coral Primary: `#E8523A`
- Sky Blue Active: `#4DC8E0`
- Vibrant Yellow: `#F5E642`
- Night Blue: `#0F1F3D`
- Typography Black: `#1A1A1A`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/paginas-abiertas run dev` — run frontend locally

## Admin Panel

URL: `/admin`  
Password: `paginas2026` (hardcoded, not exposed publicly)

Features:
- Create/open/close voting sessions with deadline
- Add candidate books (title, author, genre, cover URL, synopsis)
- Generate standard (1 vote) and premium (2 votes) codes
- View/copy all voting codes with used/available status
- Edit member points, alias, avatar; archive members
- Update current book being read (all fields)

## Rank System

| Rank | Points |
|---|---|
| Novata | 0–150 |
| Viajera | 151–400 |
| Aventurera | 401–800 |
| Embajadora | 801–1,500 |
| Leyenda Literaria | 1,500+ |

## Privacy

- No real names or personal data exposed publicly
- Members use self-chosen aliases + avatars stored in localStorage
- No user accounts, no email collection, no cookies
- Admin panel only accessible via direct URL + password

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
