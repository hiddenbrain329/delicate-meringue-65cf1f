# AGENTS.md

Notes for whoever (human or agent) picks this up next.

## What this is

A Red Velvet fan hub. Astro + Preact islands, Tailwind v4, deployed to
Netlify. Currently a **static preview build on fixture data** — no database,
no auth. The full roadmap to a live, database-backed, authenticated version
is in `PLAN.md`; read that before starting new work, since it defines the
phase order (data layer → auth → rating API → news/video aggregation) and
each phase depends on the one before it.

## Architecture

- Static-output Astro (`astro.config.mjs` has no adapter yet). Every page in
  `src/pages/` is prerendered at build time. The one dynamic-looking route,
  `src/pages/music/[slug].astro`, uses `getStaticPaths()` to prerender one
  page per fixture song — it is NOT server-rendered.
- Interactive pieces are Preact islands (`.tsx` files in `src/components/`),
  hydrated with `client:load`. Everything else is a `.astro` component
  (server-rendered markup only, no client JS shipped).
- **Phase 1 of PLAN.md requires switching `output` to `server`/`hybrid` via
  `@astrojs/netlify`** the moment any page needs to read the database or
  check a session — the current all-static setup can't do either.

## Non-obvious decisions

- **No real cover art.** `SongCard.astro` and `MusicBrowser.tsx` both compute
  a CSS gradient tile from `song.ratings.avgSpectrum` instead of using a real
  album cover, to avoid hosting copyrighted images. If you add real content,
  keep this — don't swap in cover art.
- **`video: null` is deliberate, not a TODO to autofill blindly.** Only
  YouTube IDs that were independently verified during this build are set in
  `src/data/songs.ts`. Several plausible-looking IDs were found during
  research but discarded because they weren't confidently confirmed. Don't
  fill in a `null` video with a guessed ID — verify it first, the same way
  the song page already handles `null` gracefully (falls back to a YouTube
  search link).
- **Ratings/news fixtures are explicitly labeled placeholder data** in
  header comments in `src/data/songs.ts` and `src/data/news.ts`. Once Phase 1
  (database) and Phase 4 (news aggregator) in `PLAN.md` land, those files'
  role is fully replaced by real queries — don't keep extending the fixture
  arrays as a substitute for building the real pipeline.
- **The rating widget (`RatingWidget.tsx`) is honestly stubbed.** Clicking
  "Save rating" shows a message explaining nothing is persisted yet, rather
  than faking a success state. Don't make it *look* like it saved until
  Phase 3's rating API actually exists.
- **Chart colors are validated, not eyeballed.** The scatter plot
  (`ScatterChart.tsx`), concept badges (`ConceptBadge.astro` /
  `src/lib/palette.ts`), and distribution bars (`DistributionBars.astro`)
  use hex values that were run through the dataviz skill's
  `validate_palette.js` (categorical palette: light+dark mode, CVD
  separation, contrast) or checked against WCAG contrast directly for the
  single-hue histogram bar. If you change these colors, re-validate — don't
  just pick something that looks nice.
- **Netlify Image CDN** is used for the hero image
  (`/.netlify/images?url=/img/hero-velvet.png&w=...`). `netlify.toml`'s
  `[images] remote_images` allowlist is only for *external* domains
  (YouTube thumbnails) — it's not needed for local `/img` assets.

## Where things are

- Fixture data: `src/data/songs.ts` (discography), `src/data/news.ts` (news feed)
- Shared helpers: `src/lib/format.ts` (dates), `src/lib/palette.ts` (concept colors)
- Roadmap: `PLAN.md`
- Setup/env vars: `README.md`
