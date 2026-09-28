# PLAN.md — ReVeluv Hub roadmap

This build shipped a static, fixture-data preview of the site: a home page, a
filterable discography, one fully-built song page (embed, spectrum bar,
distribution chart, stubbed rating widget), a leaderboard with a scatter
chart, a news feed with tab filtering, and a videos placeholder. Nothing is
persisted yet — there is no database, no auth, and no live data pipeline.
This document lays out what's left, in the order it should be built.

## Phase 1 — Data layer (Netlify DB + Drizzle)

- Provision Netlify DB (Postgres). Add `@netlify/neon` / `drizzle-orm@beta` +
  `drizzle-kit@beta`.
- Schema (see below). Write migrations, then a seed script that loads the
  current `src/data/songs.ts` / `src/data/news.ts` fixtures into real rows —
  this keeps today's content but makes it queryable/editable.
- Switch Astro's `output` from static to `server` (or `hybrid`) via the
  `@astrojs/netlify` adapter. This is required before any page can read from
  the database or check a session at request time.

### Schema

```sql
albums (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  era           text not null,
  release_type  text not null check (release_type in ('single','ep','album','compilation')),
  release_date  date not null,
  label         text not null
)

songs (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  title_ko        text,
  artist          text not null,
  unit            text not null check (unit in ('group','irene-seulgi','solo')),
  album_id        uuid references albums(id),
  concept         text not null check (concept in ('red','velvet','hybrid')),
  genres          text[] not null default '{}',
  youtube_video_id text,
  spotify_track_id text,
  created_at      timestamptz not null default now()
)

users (
  id            uuid primary key references auth.users(id), -- Supabase-managed
  display_name  text,
  created_at    timestamptz not null default now()
)

ratings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  song_id     uuid not null references songs(id) on delete cascade,
  quality     smallint not null check (quality between 1 and 10),
  spectrum    smallint not null check (spectrum between 0 and 100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, song_id) -- one editable rating per user per song
)

news_items (
  id            uuid primary key default gen_random_uuid(),
  external_id   text unique not null, -- dedupe key: source + source's own id/url
  headline      text not null,
  url           text not null,
  source        text not null,
  source_type   text not null check (source_type in ('official','news','social')),
  item_type     text not null check (item_type in ('release','video','social','news')),
  published_at  timestamptz not null,
  fetched_at    timestamptz not null default now()
)
```

Song page aggregates (`avg_quality`, `avg_spectrum`, `count`, `distribution`)
become a view or a materialized query over `ratings`, not stored columns —
avoids write-time fan-out bugs.

## Phase 2 — Auth (Supabase, email + Google)

- Add `@supabase/supabase-js` + `@supabase/ssr`. Env vars: `SUPABASE_URL`,
  `SUPABASE_ANON_KEY` (client-safe), `SUPABASE_SERVICE_ROLE_KEY` (server-only,
  Netlify Function env, never shipped to the browser).
- Email/password + Google OAuth via Supabase Auth UI or a hand-rolled form;
  session stored in an httpOnly cookie, read in Astro middleware so
  `Astro.locals.user` is available on every server-rendered route.
- Replace the header's disabled "Sign in" button and the rating widget's
  "preview only" message once real sessions exist.
- Row-level security: `ratings` insert/update restricted to `auth.uid() =
  user_id`.

## Phase 3 — Rating API + abuse protection

- Netlify Function `POST /api/ratings` — upsert on `(user_id, song_id)`,
  validates `quality` (1–10 int) and `spectrum` (0–100 int) server-side
  regardless of client validation.
- Rate limiting: a simple `ratings_rate_limit` table (or Netlify's edge rate
  limiting if available on plan) capping writes per user per minute — one
  account can still only ever hold one row per song by the unique constraint,
  so abuse protection here is about write *frequency*, not duplicate votes.
- Song/leaderboard pages move from the static fixture import to a server-side
  DB query once this ships.

## Phase 4 — News aggregation (Scheduled Function)

- `netlify/functions/aggregate-news.mts`, exporting
  `export const config: Config = { schedule: "0 */4 * * *" }`.
- Sources: official YouTube channel RSS
  (`https://www.youtube.com/feeds/videos.xml?channel_id=...`) for uploads,
  an RSS bridge or official API for social posts, and a curated list of
  K-pop news RSS feeds.
- Parse → normalize → dedupe on `external_id` → upsert into `news_items`.
  No full-article storage — headline, source, link, timestamp only, per the
  no-republishing constraint.
- `/news` switches from the static fixture to a paginated DB query; tab
  filter becomes a query param instead of client-side `useState` filtering.

## Phase 5 — Videos hub

- YouTube Data API (channel `playlistItems` for uploads) or channel RSS,
  tagged by type (MV / performance / variety / vlog) — likely a manual
  tag map at first, since the API doesn't expose this distinction natively.
- Same Scheduled Function pattern as news, or its own function on a longer
  interval.
- Real grid with the official embedded player replaces the current
  "coming soon" placeholder at `/videos`.

## Phase 6 — Leaderboard on real data + polish

- Scatter chart and ranked list read live aggregates instead of
  `src/data/songs.ts`.
- Accessibility/perf pass: Lighthouse pass on all routes, verify focus order
  through the rating widget and chart hover/keyboard interactions with real
  async data (loading and error states didn't exist when data was static).
- SEO: per-song OG images (could reuse the gradient-tile concept, rendered
  server-side as an OG image endpoint instead of a live component).

## Environment variables (target state)

| Var | Used by | Notes |
|---|---|---|
| `SUPABASE_URL` | client + server | public |
| `SUPABASE_ANON_KEY` | client + server | public |
| `SUPABASE_SERVICE_ROLE_KEY` | Netlify Functions only | secret, never exposed to browser |
| `DATABASE_URL` (or Netlify DB's injected equivalent) | Drizzle, server only | secret |
| `YOUTUBE_API_KEY` | videos + news functions | secret |
| `NETLIFY_AI_GATEWAY_KEY` / `NETLIFY_AI_GATEWAY_BASE_URL` | one-off asset generation (already used to make `public/img/hero-velvet.png`) | provided by Netlify, not something to hardcode |

None of these are read by any code in this build — they're documented now so
Phase 1–4 don't have to rediscover the list.
