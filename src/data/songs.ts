// Fixture data for the first build phase. Every field here is real public
// discography fact (title, era, release date, concept) sourced from official
// release info. Rating aggregates and distributions are placeholder demo
// data — real numbers arrive once the rating API + database ship (see PLAN.md).
// Songwriting/production credits are intentionally kept high-level rather than
// asserting specific songwriter names we can't fully verify; a later phase
// syncs verified per-song credits.

export type Concept = "red" | "velvet" | "hybrid";
export type Unit = "group" | "irene-seulgi" | "solo";
export type ReleaseType = "single" | "ep" | "album" | "compilation";

export interface OfficialVideo {
  provider: "youtube";
  id: string;
}

export interface RatingFixture {
  avgQuality: number; // 1-10
  avgSpectrum: number; // 0 (Red) - 100 (Velvet)
  count: number;
  /** counts for quality buckets 1..10, index 0 = score 1 */
  distribution: number[];
}

export interface Song {
  slug: string;
  title: string;
  titleKo?: string;
  artist: string;
  unit: Unit;
  album: string;
  era: string;
  releaseType: ReleaseType;
  releaseDate: string; // ISO date
  concept: Concept;
  genres: string[];
  label: string;
  video: OfficialVideo | null;
  spotifyEmbedId?: string;
  ratings: RatingFixture;
}

export const songs: Song[] = [
  {
    slug: "happiness",
    title: "Happiness",
    titleKo: "행복",
    artist: "Red Velvet",
    unit: "group",
    album: "Happiness",
    era: "Happiness",
    releaseType: "single",
    releaseDate: "2014-08-01",
    concept: "red",
    genres: ["dance-pop"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 7.1, avgSpectrum: 12, count: 214, distribution: [3, 4, 6, 9, 14, 22, 38, 51, 44, 23] },
  },
  {
    slug: "ice-cream-cake",
    title: "Ice Cream Cake",
    artist: "Red Velvet",
    unit: "group",
    album: "Ice Cream Cake",
    era: "Ice Cream Cake",
    releaseType: "ep",
    releaseDate: "2015-03-18",
    concept: "red",
    genres: ["dance-pop", "electropop"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 7.6, avgSpectrum: 18, count: 331, distribution: [2, 5, 7, 10, 16, 27, 46, 79, 88, 51] },
  },
  {
    slug: "dumb-dumb",
    title: "Dumb Dumb",
    artist: "Red Velvet",
    unit: "group",
    album: "The Red",
    era: "The Red",
    releaseType: "album",
    releaseDate: "2015-09-09",
    concept: "red",
    genres: ["moombahton", "dance-pop"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 8.0, avgSpectrum: 9, count: 402, distribution: [2, 3, 5, 8, 12, 21, 39, 88, 132, 92] },
  },
  {
    slug: "one-of-these-nights",
    title: "One of These Nights",
    titleKo: "그 밤",
    artist: "Red Velvet",
    unit: "group",
    album: "The Velvet",
    era: "The Velvet",
    releaseType: "ep",
    releaseDate: "2016-03-17",
    concept: "velvet",
    genres: ["r&b", "ballad"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 8.4, avgSpectrum: 88, count: 358, distribution: [1, 2, 3, 5, 9, 14, 27, 61, 118, 118] },
  },
  {
    slug: "russian-roulette",
    title: "Russian Roulette",
    artist: "Red Velvet",
    unit: "group",
    album: "Russian Roulette",
    era: "Russian Roulette",
    releaseType: "ep",
    releaseDate: "2016-09-07",
    concept: "red",
    genres: ["dance-pop", "tropical house"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 7.8, avgSpectrum: 22, count: 289, distribution: [2, 4, 6, 9, 14, 24, 41, 74, 79, 36] },
  },
  {
    slug: "red-flavor",
    title: "Red Flavor",
    titleKo: "빨간 맛",
    artist: "Red Velvet",
    unit: "group",
    album: "The Red Summer",
    era: "The Red Summer",
    releaseType: "ep",
    releaseDate: "2017-07-10",
    concept: "red",
    genres: ["dance-pop", "electropop"],
    label: "SM Entertainment",
    video: { provider: "youtube", id: "WyiIGEHQP8o" },
    ratings: { avgQuality: 9.1, avgSpectrum: 6, count: 611, distribution: [1, 1, 2, 3, 5, 9, 18, 46, 168, 358] },
  },
  {
    slug: "peek-a-boo",
    title: "Peek-A-Boo",
    artist: "Red Velvet",
    unit: "group",
    album: "Perfect Velvet",
    era: "Perfect Velvet",
    releaseType: "album",
    releaseDate: "2017-11-17",
    concept: "velvet",
    genres: ["dark trap", "r&b"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 8.7, avgSpectrum: 81, count: 447, distribution: [1, 2, 3, 5, 8, 13, 24, 55, 141, 195] },
  },
  {
    slug: "rbb",
    title: "RBB (Really Bad Boy)",
    titleKo: "really bad boy",
    artist: "Red Velvet",
    unit: "group",
    album: "RBB",
    era: "RBB",
    releaseType: "ep",
    releaseDate: "2018-11-30",
    concept: "velvet",
    genres: ["swing", "big band", "trap"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 8.2, avgSpectrum: 70, count: 276, distribution: [1, 3, 4, 6, 10, 17, 29, 58, 91, 57] },
  },
  {
    slug: "umpah-umpah",
    title: "Umpah Umpah",
    titleKo: "음파음파",
    artist: "Red Velvet",
    unit: "group",
    album: "The ReVe Festival: Day 2",
    era: "The ReVe Festival: Day 2",
    releaseType: "ep",
    releaseDate: "2019-08-20",
    concept: "red",
    genres: ["dance-pop"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 6.9, avgSpectrum: 15, count: 233, distribution: [4, 6, 9, 13, 19, 27, 41, 56, 42, 16] },
  },
  {
    slug: "psycho",
    title: "Psycho",
    artist: "Red Velvet",
    unit: "group",
    album: "The ReVe Festival: Finale",
    era: "The ReVe Festival: Finale",
    releaseType: "compilation",
    releaseDate: "2019-12-23",
    concept: "velvet",
    genres: ["r&b", "synth-pop"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 9.3, avgSpectrum: 84, count: 589, distribution: [1, 1, 1, 2, 4, 7, 14, 39, 152, 368] },
  },
  {
    slug: "feel-my-rhythm",
    title: "Feel My Rhythm",
    artist: "Red Velvet",
    unit: "group",
    album: "The ReVe Festival 2022 – Feel My Rhythm",
    era: "The ReVe Festival 2022",
    releaseType: "ep",
    releaseDate: "2022-03-21",
    concept: "velvet",
    genres: ["baroque pop", "dance-pop"],
    label: "SM Entertainment",
    video: { provider: "youtube", id: "R9At2ICm4LQ" },
    ratings: { avgQuality: 8.9, avgSpectrum: 76, count: 401, distribution: [1, 1, 2, 4, 7, 12, 22, 51, 138, 163] },
  },
  {
    slug: "chill-kill",
    title: "Chill Kill",
    artist: "Red Velvet",
    unit: "group",
    album: "Chill Kill",
    era: "Chill Kill",
    releaseType: "album",
    releaseDate: "2023-11-13",
    concept: "velvet",
    genres: ["orchestral pop", "r&b"],
    label: "SM Entertainment",
    video: { provider: "youtube", id: "xlyrt5eAtKI" },
    ratings: { avgQuality: 8.3, avgSpectrum: 79, count: 198, distribution: [1, 2, 3, 5, 8, 14, 22, 39, 62, 42] },
  },
  {
    slug: "cosmic",
    title: "Cosmic",
    artist: "Red Velvet",
    unit: "group",
    album: "Cosmic",
    era: "Cosmic",
    releaseType: "ep",
    releaseDate: "2024-06-24",
    concept: "red",
    genres: ["dance-pop", "synth-pop"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 7.4, avgSpectrum: 29, count: 152, distribution: [2, 4, 6, 9, 13, 20, 29, 36, 25, 8] },
  },
  {
    slug: "surfin-boy",
    title: "Surfin' Boy",
    artist: "Red Velvet",
    unit: "group",
    album: "Velvet Summer",
    era: "Velvet Summer",
    releaseType: "ep",
    releaseDate: "2026-08-03",
    concept: "velvet",
    genres: ["dream pop", "synth-pop"],
    label: "SM Entertainment",
    video: { provider: "youtube", id: "NZP153MUpHY" },
    ratings: { avgQuality: 8.0, avgSpectrum: 68, count: 87, distribution: [1, 1, 2, 3, 5, 8, 13, 21, 22, 11] },
  },
  {
    slug: "monster",
    title: "Monster",
    artist: "Red Velvet – Irene & Seulgi",
    unit: "irene-seulgi",
    album: "Monster",
    era: "Irene & Seulgi: Monster",
    releaseType: "ep",
    releaseDate: "2020-07-06",
    concept: "velvet",
    genres: ["moombahton", "tropical house"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 8.6, avgSpectrum: 73, count: 264, distribution: [1, 2, 3, 4, 7, 12, 21, 47, 92, 75] },
  },
  {
    slug: "tilt",
    title: "Tilt",
    artist: "Red Velvet – Irene & Seulgi",
    unit: "irene-seulgi",
    album: "Tilt",
    era: "Irene & Seulgi: Tilt",
    releaseType: "ep",
    releaseDate: "2025-05-26",
    concept: "hybrid",
    genres: ["dance-pop", "r&b"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 7.9, avgSpectrum: 55, count: 96, distribution: [1, 2, 3, 4, 6, 10, 16, 24, 21, 9] },
  },
  {
    slug: "like-water",
    title: "Like Water",
    artist: "Wendy",
    unit: "solo",
    album: "Like Water",
    era: "Wendy: Like Water",
    releaseType: "ep",
    releaseDate: "2021-04-05",
    concept: "velvet",
    genres: ["r&b", "ballad"],
    label: "SM Entertainment",
    video: null,
    ratings: { avgQuality: 8.5, avgSpectrum: 92, count: 178, distribution: [1, 1, 2, 3, 5, 8, 14, 29, 58, 57] },
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((s) => s.slug === slug);
}

export const eras: string[] = Array.from(new Set(songs.map((s) => s.era)));

export function conceptLabel(concept: Concept): string {
  if (concept === "red") return "Red";
  if (concept === "velvet") return "Velvet";
  return "Red × Velvet";
}
