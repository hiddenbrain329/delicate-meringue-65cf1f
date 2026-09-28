import { useMemo, useState } from "preact/hooks";
import type { Concept, ReleaseType, Song, Unit } from "../data/songs";

interface Props {
  songs: Song[];
}

const CONCEPT_LABEL: Record<Concept, string> = { red: "Red", velvet: "Velvet", hybrid: "Red × Velvet" };
const CONCEPT_COLOR_DARK: Record<Concept, string> = { red: "#f0518c", velvet: "#a878d4", hybrid: "#b8892f" };
const TYPE_LABEL: Record<ReleaseType, string> = { single: "Single", ep: "EP", album: "Album", compilation: "Compilation" };
const UNIT_LABEL: Record<Unit, string> = { group: "Group", "irene-seulgi": "Irene & Seulgi", solo: "Solo" };

function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)) as [number, number, number];
}
const RED_RGB: [number, number, number] = [224, 54, 79];
const VELVET_RGB: [number, number, number] = [61, 26, 74];
const MID_RGB: [number, number, number] = [138, 90, 160];

function tileGradient(spectrum: number) {
  const t = spectrum / 100;
  const stop1 = mix(RED_RGB, MID_RGB, t);
  const stop2 = mix([224, 54, 79], VELVET_RGB, t);
  return `linear-gradient(135deg, rgb(${stop1.join(",")}), rgb(${stop2.join(",")}))`;
}

export default function MusicBrowser({ songs }: Props) {
  const [era, setEra] = useState<string>("all");
  const [type, setType] = useState<ReleaseType | "all">("all");
  const [concept, setConcept] = useState<Concept | "all">("all");
  const [unit, setUnit] = useState<Unit | "all">("all");

  const eras = useMemo(() => Array.from(new Set(songs.map((s) => s.era))), [songs]);

  const filtered = useMemo(
    () =>
      songs.filter(
        (s) =>
          (era === "all" || s.era === era) &&
          (type === "all" || s.releaseType === type) &&
          (concept === "all" || s.concept === concept) &&
          (unit === "all" || s.unit === unit)
      ),
    [songs, era, type, concept, unit]
  );

  return (
    <div>
      <div class="flex flex-wrap gap-3" role="group" aria-label="Filter discography">
        <Select label="Era" value={era} onChange={setEra} options={[["all", "All eras"], ...eras.map((e): [string, string] => [e, e])]} />
        <Select
          label="Type"
          value={type}
          onChange={(v) => setType(v as ReleaseType | "all")}
          options={[["all", "All types"], ...Object.entries(TYPE_LABEL)] as [string, string][]}
        />
        <Select
          label="Concept"
          value={concept}
          onChange={(v) => setConcept(v as Concept | "all")}
          options={[["all", "Red vs Velvet: all"], ...Object.entries(CONCEPT_LABEL)] as [string, string][]}
        />
        <Select
          label="Artist"
          value={unit}
          onChange={(v) => setUnit(v as Unit | "all")}
          options={[["all", "All artists"], ...Object.entries(UNIT_LABEL)] as [string, string][]}
        />
        {(era !== "all" || type !== "all" || concept !== "all" || unit !== "all") && (
          <button
            type="button"
            onClick={() => {
              setEra("all");
              setType("all");
              setConcept("all");
              setUnit("all");
            }}
            class="rounded-full border border-white/15 px-3 py-1.5 text-sm text-cream-100/70 hover:bg-white/5"
          >
            Clear filters
          </button>
        )}
      </div>

      <p class="mt-4 text-sm text-cream-100/50" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "song" : "songs"}
      </p>

      <ul class="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((song) => (
          <li key={song.slug}>
            <a
              href={`/music/${song.slug}`}
              class="group block overflow-hidden rounded-2xl border border-white/10 bg-velvet-900/60 transition-transform hover:-translate-y-1 focus-visible:-translate-y-1"
            >
              <div class="relative flex h-32 items-end p-3" style={{ backgroundImage: tileGradient(song.ratings.avgSpectrum) }}>
                <div
                  class="absolute inset-0"
                  style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 55%)" }}
                ></div>
                <span class="relative rounded-full bg-black/30 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">{song.era}</span>
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <h3 class="font-display text-base font-semibold text-cream-50 group-hover:text-red-400">{song.title}</h3>
                    <p class="text-sm text-cream-100/55">
                      {song.artist} · {song.album}
                    </p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="font-display text-lg font-semibold text-cream-50">{song.ratings.avgQuality.toFixed(1)}</p>
                    <p class="text-[11px] text-cream-100/40">{song.ratings.count} votes</p>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
                    style={{
                      color: CONCEPT_COLOR_DARK[song.concept],
                      borderColor: `${CONCEPT_COLOR_DARK[song.concept]}66`,
                      background: `${CONCEPT_COLOR_DARK[song.concept]}1a`,
                    }}
                  >
                    <span class="h-1.5 w-1.5 rounded-full" style={{ background: CONCEPT_COLOR_DARK[song.concept] }}></span>
                    {CONCEPT_LABEL[song.concept]}
                  </span>
                  <span class="text-[11px] text-cream-100/40">{TYPE_LABEL[song.releaseType]}</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div class="mt-10 rounded-2xl border border-dashed border-white/15 p-10 text-center">
          <p class="font-display text-lg text-cream-50">No songs match these filters</p>
          <p class="mt-1 text-sm text-cream-100/50">Try widening your era, type, or concept filter.</p>
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label class="flex flex-col gap-1 text-xs font-medium text-cream-100/60">
      {label}
      <select
        value={value}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
        class="rounded-lg border border-white/15 bg-velvet-900 px-3 py-2 text-sm text-cream-50 focus-visible:outline-2"
      >
        {options.map(([v, l]) => (
          <option value={v} key={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
