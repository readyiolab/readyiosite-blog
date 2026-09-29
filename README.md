# Readyio blog (`blog.readyio.com`)

Next.js 16 app that renders every blog article at `https://blog.readyio.com/<slug>`, plus the blog home, category pages, RSS feed and sitemap. Content comes from the Readyio API (`../Backend`) and is written in the admin panel (`../admin-panel`).

Production deployment: see [`../deploy/DEPLOYMENT.md`](../deploy/DEPLOYMENT.md).

## Local development

Start the API first (`cd ../Backend && npm run dev`, port 4000), then:

```bash
npm install
echo REVALIDATE_SECRET=<same value as Backend/.env> > .env.local
npm run dev               # http://localhost:8081
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 8081 |
| `npm run build` | Production build; pre-renders every published article, so the API must be reachable at `CMS_API_URL` |
| `npm start` | Serve the build on port 8081 |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |

## Routes

| Path | Content |
| --- | --- |
| `/` | Featured post, latest posts, category chips; `?page=N` pagination |
| `/<slug>` | Article with author card, share buttons, related posts; old slugs permanently redirect to the new one |
| `/category/<slug>` | Articles in a category (paginated) |
| `/feed.xml` | RSS 2.0 feed |
| `/sitemap.xml`, `/robots.txt` | Search engine files |
| `POST /api/revalidate` | Called by the API after content changes (secret-protected; blocked publicly by Nginx) |

## SEO

- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards.
- JSON-LD: `Blog` on the home page, `BlogPosting` + `BreadcrumbList` (+ `FAQPage` when the article has FAQs) on articles, `Organization` site-wide.
- Article HTML is sanitized (`lib/sanitize.ts`) before rendering; YouTube/Vimeo embeds are allowed.
- Pages are statically generated and refreshed every 5 minutes, or instantly via `/api/revalidate`.

## Environment

| Variable | Dev (`.env.development`) | Prod (`.env.production`) | Used for |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:8080` | `https://readyio.com` | Links back to the main site |
| `NEXT_PUBLIC_BLOG_URL` | `http://localhost:8081` | `https://blog.readyio.com` | Canonical URLs, sitemap, RSS |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` | `https://api.readyio.com` | Newsletter signup (browser) |
| `NEXT_PUBLIC_CMS_API_URL` | `http://localhost:4000/api` | `https://api.readyio.com/api` | View counter (browser) |
| `CMS_API_URL` | `http://localhost:4000/api` | `http://127.0.0.1:4000/api` | Server-side article fetches |
| `REVALIDATE_SECRET` | `.env.local` | `.env.local` | Protects `POST /api/revalidate` |

`NEXT_PUBLIC_*` values are compiled into the bundle, so rebuild after changing them. See [`.env.example`](.env.example).

## Structure

```
app/            page.tsx, [slug]/, category/[slug]/, feed.xml/, sitemap.ts, robots.ts, api/revalidate
components/     blog/ (cards, grid, pagination, share, author, view ping), site/ (nav, footer, logo…)
lib/            cms.ts (API client), sanitize.ts, metadata.ts, site.ts (URLs), newsletter.ts
```
