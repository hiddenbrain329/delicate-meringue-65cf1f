import { useState } from "preact/hooks";
import type { Concept, Song } from "../data/songs";

interface Props {
  songs: Song[];
}

const CONCEPT_COLOR: Record<Concept, string> = { red: "#f0518c", velvet: "#a878d4", hybrid: "#b8892f" };
const CONCEPT_LABEL: Record<Concept, string> = { red: "Red", velvet: "Velvet", hybrid: "Red × Velvet" };

const WIDTH = 680;
const HEIGHT = 380;
const PAD = { top: 20, right: 24, bottom: 44, left: 44 };

function xPos(spectrum: number) {
  return PAD.left + (spectrum / 100) * (WIDTH - PAD.left - PAD.right);
}
function yPos(quality: number) {
  const t = (quality - 1) / 9;
  return HEIGHT - PAD.bottom - t * (HEIGHT - PAD.top - PAD.bottom);
}

export default function ScatterChart({ songs }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = songs.find((s) => s.slug === activeSlug) ?? null;

  return (
    <div class="relative">
      <div class="flex flex-wrap items-center gap-4 mb-3 text-xs text-cream-100/70">
        {(Object.keys(CONCEPT_LABEL) as Concept[]).map((c) => (
          <span key={c} class="inline-flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full" style={{ background: CONCEPT_COLOR[c] }}></span>
            {CONCEPT_LABEL[c]}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Scatter plot of songs by fan quality score and Red-to-Velvet spectrum position"
        class="w-full h-auto"
      >
        {/* gridlines */}
        {[1, 3, 5, 7, 9, 10].map((q) => (
          <line key={q} x1={PAD.left} x2={WIDTH - PAD.right} y1={yPos(q)} y2={yPos(q)} stroke="#ffffff14" stroke-width="1" />
        ))}
        {[0, 25, 50, 75, 100].map((s) => (
          <line key={s} x1={xPos(s)} x2={xPos(s)} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="#ffffff14" stroke-width="1" />
        ))}

        {/* axes */}
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={HEIGHT - PAD.bottom} y2={HEIGHT - PAD.bottom} stroke="#c3c2b7" stroke-width="1" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="#c3c2b7" stroke-width="1" />

        {/* y ticks */}
        {[1, 3, 5, 7, 9].map((q) => (
          <text key={q} x={PAD.left - 10} y={yPos(q) + 4} text-anchor="end" font-size="11" fill="#c3c2b7">
            {q}
          </text>
        ))}
        {/* x ticks */}
        {[0, 50, 100].map((s) => (
          <text key={s} x={xPos(s)} y={HEIGHT - PAD.bottom + 18} text-anchor="middle" font-size="11" fill="#c3c2b7">
            {s === 0 ? "Red 0" : s === 100 ? "Velvet 100" : s}
          </text>
        ))}
        <text x={12} y={PAD.top + 4} font-size="11" fill="#898781" transform={`rotate(-90 12 ${PAD.top + 4})`}>
          Quality
        </text>

        {songs.map((s) => (
          <circle
            key={s.slug}
            cx={xPos(s.ratings.avgSpectrum)}
            cy={yPos(s.ratings.avgQuality)}
            r={activeSlug === s.slug ? 8 : 6}
            fill={CONCEPT_COLOR[s.concept]}
            stroke="#180a1c"
            stroke-width="1.5"
            tabIndex={0}
            role="button"
            aria-label={`${s.title}: quality ${s.ratings.avgQuality.toFixed(1)} of 10, ${s.ratings.avgSpectrum} of 100 toward Velvet`}
            onMouseEnter={() => setActiveSlug(s.slug)}
            onMouseLeave={() => setActiveSlug((cur) => (cur === s.slug ? null : cur))}
            onFocus={() => setActiveSlug(s.slug)}
            onBlur={() => setActiveSlug((cur) => (cur === s.slug ? null : cur))}
            style={{ cursor: "pointer", outline: "none" }}
          />
        ))}
      </svg>

      {active && (
        <div
          class="pointer-events-none absolute z-10 max-w-[200px] rounded-lg border border-white/15 bg-velvet-950 px-3 py-2 text-xs shadow-xl"
          style={{
            left: `${(xPos(active.ratings.avgSpectrum) / WIDTH) * 100}%`,
            top: `${(yPos(active.ratings.avgQuality) / HEIGHT) * 100}%`,
            transform: "translate(-50%, -120%)",
          }}
        >
          <p class="font-semibold text-cream-50">{active.title}</p>
          <p class="text-cream-100/60">{active.artist}</p>
          <p class="mt-1 text-cream-100/80">
            Quality {active.ratings.avgQuality.toFixed(1)} · {active.ratings.avgSpectrum}/100 Velvet
          </p>
        </div>
      )}

      <details class="mt-4">
        <summary class="cursor-pointer text-xs text-cream-100/60 hover:underline">View as table</summary>
        <div class="mt-2 overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-cream-100/60">
                <th scope="col" class="text-left font-medium py-1 pr-3">Song</th>
                <th scope="col" class="text-left font-medium py-1 pr-3">Concept</th>
                <th scope="col" class="text-left font-medium py-1 pr-3">Quality</th>
                <th scope="col" class="text-left font-medium py-1">Spectrum</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((s) => (
                <tr key={s.slug} class="border-t border-white/5">
                  <td class="py-1 pr-3 text-cream-50">{s.title}</td>
                  <td class="py-1 pr-3 text-cream-100/70">{CONCEPT_LABEL[s.concept]}</td>
                  <td class="py-1 pr-3 text-cream-100/70">{s.ratings.avgQuality.toFixed(1)}</td>
                  <td class="py-1 text-cream-100/70">{s.ratings.avgSpectrum}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
