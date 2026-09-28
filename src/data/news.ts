export type SourceType = "official" | "news" | "social";
export type ItemType = "release" | "video" | "social" | "news";

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  sourceType: SourceType;
  itemType: ItemType;
  url: string;
  publishedAt: string; // ISO date
}

// Sample seed items built from real, verifiable public events — standing in for the
// live feed until the Scheduled Function aggregator ships (see PLAN.md, Phase 3).
// The aggregator will replace this file's role entirely, reading from the database instead.
export const newsItems: NewsItem[] = [
  {
    id: "1",
    headline: "Red Velvet release \"Velvet Summer\" EP, led by \"Surfin' Boy\"",
    source: "SMTOWN (YouTube)",
    sourceType: "official",
    itemType: "release",
    url: "https://www.youtube.com/watch?v=NZP153MUpHY",
    publishedAt: "2026-08-03",
  },
  {
    id: "2",
    headline: "\"Surfin' Boy\" MV teaser drops ahead of the group's 12th-anniversary comeback",
    source: "SMTOWN (YouTube)",
    sourceType: "official",
    itemType: "video",
    url: "https://www.youtube.com/watch?v=5pJftO9Mhss",
    publishedAt: "2026-07-30",
  },
  {
    id: "3",
    headline: "Irene & Seulgi announce comeback with second mini album \"Tilt\"",
    source: "K-pop News Desk",
    sourceType: "news",
    itemType: "release",
    url: "https://en.wikipedia.org/wiki/Tilt_(EP)",
    publishedAt: "2025-05-13",
  },
  {
    id: "4",
    headline: "Wendy and Yeri confirmed to remain active Red Velvet members after SM contract non-renewal",
    source: "Korea Herald",
    sourceType: "news",
    itemType: "news",
    url: "https://www.koreaherald.com",
    publishedAt: "2025-04-15",
  },
  {
    id: "5",
    headline: "ReVeluvs mark the group's 12th debut anniversary online",
    source: "Fan community roundup",
    sourceType: "social",
    itemType: "social",
    url: "https://x.com/RVsmtown",
    publishedAt: "2026-08-01",
  },
  {
    id: "6",
    headline: "\"Chill Kill\" music video released alongside third studio album",
    source: "SMTOWN (YouTube)",
    sourceType: "official",
    itemType: "video",
    url: "https://www.youtube.com/watch?v=xlyrt5eAtKI",
    publishedAt: "2023-11-13",
  },
];
