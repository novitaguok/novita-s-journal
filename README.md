# Novita's Journal

Personal blog, project showcase, and guestbook built with **Next.js 16 (App Router)**, React 19, and TypeScript.

## Stack

- **Framework** — Next.js 16 App Router, React 19
- **Styling** — Tailwind CSS v4 (typography) + custom CSS variables + inline styles
- **Content** — Markdown articles served from this repo's `content/articles/` (local filesystem in dev, GitHub raw API in production)
- **Data** — GitHub API for projects, Supabase for the guestbook
- **Comments** — Giscus

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | ESLint |
| `pnpm lint:fix` | ESLint with autofix |

## Environment Variables

| Variable | Required | Used by |
| --- | --- | --- |
| `GITHUB_OWNER` | no (default `novitaguok`) | Article/project GitHub repos |
| `GITHUB_REPO` | no (default `novita-s-journal`) | Article repo |
| `GITHUB_BRANCH` | no (default `main`) | Article branch |
| `GITHUB_TOKEN` | no | GitHub API auth (higher rate limits, pinned repos via GraphQL) |
| `GITHUB_USE_LOCAL` | no (`"true"` forces local filesystem) | Article source override |
| `NEXT_PUBLIC_SUPABASE_URL` | guestbook | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | guestbook | Supabase anon key |
| `GUESTBOOK_AUTH_SECRET` | admin login | HMAC secret for admin session cookies |
| `GUESTBOOK_ADMIN_PASSWORD` | admin login | Admin password for `/api/guestbook/auth` |
| `REVALIDATE_SECRET` | article sync | Bearer token for the `/api/revalidate` webhook |
| `SITE_URL` | article sync | Used by the GitHub Actions workflow to call revalidation |

## Architecture

The app follows a clean architecture layering:

```
app routes/pages ──▶ use-cases ──▶ repository interfaces ◀── concrete repos ──▶ external
                                                            (GitHub / Supabase / local fs)
```

| Layer | Directory | Responsibility |
| --- | --- | --- |
| **domain** | `src/domain/` | Entity types and repository interfaces (`articles`, `projects`, `guestbook`) |
| **use-cases** | `src/use-cases/` | Orchestration logic, depends only on interfaces |
| **infrastructure** | `src/infrastructure/` | Concrete repository implementations (`LocalArticlesRepository`, `GitHubArticlesRepository`, `GitHubProjectsRepository`, `SupabaseGuestbookRepository`) |
| **app / components / features** | `src/app/`, `src/components/`, `src/features/` | Next.js routes/pages and React UI |

Use-cases receive their dependencies via constructor injection (see `src/infrastructure/articles/repositories.ts` for the environment-based article repository factory).

## Routes

| Route | Description |
| --- | --- |
| `/` | Home — greeting, activity feed, GitHub contribution heatmap, pinned repos, recent articles |
| `/articles` | Writing index with search + tag filters |
| `/articles/[slug]` | Article detail (server-rendered, static params, TOC, comments) |
| `/projects` | GitHub project showcase with status filter + search |
| `/about` | Profile + contact section |
| `/guestbook` | Community board — leave a note (markdown + image attachments) |

### API

| Route | Purpose |
| --- | --- |
| `GET /api/articles` | Article list (`tag`, `search`, `limit`) |
| `GET /api/projects` | Project list (`status`, `isPinned`) |
| `GET/POST/PATCH /api/guestbook` | Guestbook: list approved, create post, admin pin toggle |
| `GET/POST/DELETE /api/guestbook/auth` | Admin session check / login / logout |
| `POST /api/guestbook/upload` | Image attachment upload to Supabase Storage |
| `POST /api/revalidate` | On-demand ISR revalidation webhook (called by `.github/workflows/sync-articles.yml`) |

## Content

Articles are Markdown files with YAML frontmatter in `content/articles/`. Each file's frontmatter may include `slug`, `title`, `excerpt`, `tags`, `date`, `updatedAt`, and `isPublished`. In development the filesystem is read directly; in production the GitHub raw API is used so the repo itself is the CMS.

The `sync-articles.yml` GitHub Actions workflow moves new `.md` files from the repo root into `content/articles/` (renamed by their frontmatter `slug`) and calls `/api/revalidate` to refresh the affected article pages.
