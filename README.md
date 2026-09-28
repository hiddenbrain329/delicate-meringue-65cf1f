# ReVeluv Hub

An unofficial fan hub for Red Velvet — discography, official video, a news
feed, and a fan-voted "Red vs. Velvet" song leaderboard.

Not affiliated with or endorsed by SM Entertainment. No music, video,
lyrics, or cover art is hosted here — only official embeds and link-outs.

## Status

This is a **static preview build**: real pages and interactions, running on
fixture data (`src/data/songs.ts`, `src/data/news.ts`). There is no database,
no auth, and no live data pipeline yet — see [`PLAN.md`](./PLAN.md) for the
full roadmap to get there.

What's live right now:

- `/` — home page
- `/music` — filterable discography (era, release type, artist, Red/Velvet concept)
- `/music/[slug]` — a song page with official embed (where verified), release
  info, fan-rating summary, and a rating widget (preview only — not persisted)
- `/leaderboard` — ranked list + an accessible quality-vs-spectrum scatter plot
- `/news` — tabbed news feed (All / Official / News / Social) over seed data
- `/videos` — placeholder pending the real video-hub sync

## Tech stack

- **Framework**: [Astro](https://astro.build) with [Preact](https://preactjs.com) islands for interactive UI
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Hosting**: Netlify (static output today; `netlify.toml` configured)
- **Planned**: Netlify DB (Postgres) + Drizzle ORM, Supabase Auth (email + Google), Netlify Scheduled Functions for news/video aggregation — see `PLAN.md`

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
  components/     Astro components (static) and Preact islands (interactive, *.tsx)
  data/           Fixture datasets — songs.ts, news.ts (stand-ins for the DB, see PLAN.md)
  layouts/        Shared page shell (Layout.astro)
  lib/            Small helpers: date formatting, color palette
  pages/          File-based routes
  styles/         global.css — Tailwind v4 theme tokens (brand colors, fonts)
public/
  img/            Static image assets (generated hero art, no copyrighted media)
netlify.toml      Build, functions, and Image CDN config
```

## Environment variables

None are required to run this preview build. The variables below are the
target state once the phases in `PLAN.md` land — documented now so they
don't need rediscovering later:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL (auth) |
| `SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for Netlify Functions (never expose to the client) |
| `DATABASE_URL` | Postgres connection string (Netlify DB) |
| `YOUTUBE_API_KEY` | YouTube Data API access for the videos hub and news aggregator |

## Content & copyright policy

- No album cover art is stored or displayed — song/album tiles use a computed
  gradient (interpolated from the community's Red↔Velvet vote) instead.
- Only YouTube video IDs that were independently verified are embedded;
  everything else links out to a YouTube search instead of guessing an ID.
- The news feed shows headline, source, and a link out — never full article
  text.
- Song credits are kept high-level until a verified-credits data source is
  wired in (see `PLAN.md`, Phase 1).

## Roadmap

See [`PLAN.md`](./PLAN.md) for the full phase-by-phase plan: data layer,
auth, the rating API and its abuse protections, the news/video aggregation
Scheduled Functions, and final accessibility/perf/SEO polish.
