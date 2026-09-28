import { useState } from "preact/hooks";
import type { ItemType, NewsItem, SourceType } from "../data/news";
import { formatDate, timeAgo } from "../lib/format";

interface Props {
  items: NewsItem[];
}

const TABS: { key: SourceType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "official", label: "Official" },
  { key: "news", label: "News" },
  { key: "social", label: "Social" },
];

const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  release: "Release",
  video: "Video",
  social: "Social",
  news: "News",
};

export default function NewsTabs({ items }: Props) {
  const [tab, setTab] = useState<SourceType | "all">("all");
  const sorted = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const filtered = tab === "all" ? sorted : sorted.filter((i) => i.sourceType === tab);

  return (
    <div>
      <div class="flex gap-1 rounded-full border border-white/10 bg-velvet-900/60 p-1 w-fit" role="tablist" aria-label="Filter news by source">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            class={
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
              (tab === t.key ? "bg-red-500 text-cream-50" : "text-cream-100/60 hover:text-cream-50")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul class="mt-6 space-y-3">
        {filtered.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              class="flex flex-col gap-1 rounded-xl border border-white/10 bg-velvet-900/50 p-4 hover:border-white/25 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div class="flex items-center gap-2 text-xs">
                  <span class="rounded-full bg-white/10 px-2 py-0.5 font-medium text-cream-100/70">{ITEM_TYPE_LABEL[item.itemType]}</span>
                  <span class="text-cream-100/45">{item.source}</span>
                </div>
                <p class="mt-1.5 text-sm font-medium text-cream-50">{item.headline}</p>
              </div>
              <time dateTime={item.publishedAt} title={formatDate(item.publishedAt)} class="shrink-0 text-xs text-cream-100/40">
                {timeAgo(item.publishedAt)}
              </time>
            </a>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <p class="mt-8 text-sm text-cream-100/50">No items in this category yet.</p>}
    </div>
  );
}
