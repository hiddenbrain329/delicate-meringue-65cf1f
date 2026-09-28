import { useState } from "preact/hooks";
import type { Concept, Song } from "../data/songs";
import { CONCEPT_COLOR, CONCEPT_SHAPE, type Shape } from "../lib/palette";

interface Props {
  songs: Song[];
}

const CONCEPTS = Object.keys(CONCEPT_COLOR) as Concept[];

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

function Marker({ shape, cx, cy, r, fill, ...rest }: { shape: Shape; cx: number; cy: number; r: number; fill: string; [k: string]: unknown }) {
  const common = { style: { fill, stroke: "var(--rv-black)", strokeWidth: 1.5, cursor: "pointer", outline: "none" }, ...rest };
  if (shape === "square") return <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} {...common} />;
  if (shape === "diamond") {
    const d = r * 1.35;
    return <polygon points={`${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`} {...common} />;
  }
  return <circle cx={cx} cy={cy} r={r} {...common} />;
}

export default function ScatterChart({ songs }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const active = songs.find((s) => s.slug === activeSlug) ?? null;

  return (
    <div class="chart-panel relative">
      <div class="mb-3 flex flex-wrap items-center gap-4 text-xs text-cream-100">
        {CONCEPTS.map((c) => (
          <span key={c} class="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <Marker shape={CONCEPT_SHAPE[c]} cx={7} cy={7} r={5} fill={CONCEPT_COLOR[c].dark} />
            </svg>
            {CONCEPT_COLOR[c].label.toLowerCase()}
          </span>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Scatter plot of songs by fan quality score and Red-to-Velvet spectrum position"
        class="h-auto w-full"
      >
        {/* gridlines */}
        {[1, 3, 5, 7, 9, 10].map((q) => (
          <line key={q} x1={PAD.left} x2={WIDTH - PAD.right} y1={yPos(q)} y2={yPos(q)} style={{ stroke: "var(--rv-cream)", strokeOpacity: 0.15 }} stroke-width="1" />
        ))}
        {[0, 25, 50, 75, 100].map((s) => (
          <line key={s} x1={xPos(s)} x2={xPos(s)} y1={PAD.top} y2={HEIGHT - PAD.bottom} style={{ stroke: "var(--rv-cream)", strokeOpacity: 0.15 }} stroke-width="1" />
        ))}

        {/* axes */}
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={HEIGHT - PAD.bottom} y2={HEIGHT - PAD.bottom} style={{ stroke: "var(--rv-cream)" }} stroke-width="1.5" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={HEIGHT - PAD.bottom} style={{ stroke: "var(--rv-cream)" }} stroke-width="1.5" />

        {/* y ticks */}
        {[1, 3, 5, 7, 9].map((q) => (
          <text key={q} x={PAD.left - 10} y={yPos(q) + 4} text-anchor="end" font-size="12" style={{ fill: "var(--rv-cream)" }}>
            {q}
          </text>
        ))}
        {/* x ticks */}
        {[0, 50, 100].map((s) => (
          <text key={s} x={xPos(s)} y={HEIGHT - PAD.bottom + 18} text-anchor="middle" font-size="12" style={{ fill: "var(--rv-cream)" }}>
            {s === 0 ? "red 0" : s === 100 ? "velvet 100" : s}
          </text>
        ))}
        <text x={12} y={PAD.top + 4} font-size="12" style={{ fill: "var(--rv-cream)" }} transform={`rotate(-90 12 ${PAD.top + 4})`}>
          quality
        </text>

        {songs.map((s) => (
          <Marker
            key={s.slug}
            shape={CONCEPT_SHAPE[s.concept]}
            cx={xPos(s.ratings.avgSpectrum)}
            cy={yPos(s.ratings.avgQuality)}
            r={activeSlug === s.slug ? 8 : 6}
            fill={CONCEPT_COLOR[s.concept].dark}
            tabIndex={0}
            role="button"
            aria-label={`${s.title}: quality ${s.ratings.avgQuality.toFixed(1)} of 10, ${s.ratings.avgSpectrum} of 100 toward Velvet`}
            onMouseEnter={() => setActiveSlug(s.slug)}
            onMouseLeave={() => setActiveSlug((cur) => (cur === s.slug ? null : cur))}
            onFocus={() => setActiveSlug(s.slug)}
            onBlur={() => setActiveSlug((cur) => (cur === s.slug ? null : cur))}
          />
        ))}
      </svg>

      {active && (
        <div
          class="pointer-events-none absolute z-10 max-w-[200px] border border-line bg-ink-950 px-3 py-2 text-xs"
          style={{
            left: `${(xPos(active.ratings.avgSpectrum) / WIDTH) * 100}%`,
            top: `${(yPos(active.ratings.avgQuality) / HEIGHT) * 100}%`,
            transform: "translate(-50%, -120%)",
          }}
        >
          <p class="font-display text-lg uppercase leading-none text-cream-100">{active.title}</p>
          <p class="text-cream-100">{active.artist}</p>
          <p class="mt-1 text-cream-100">
            quality {active.ratings.avgQuality.toFixed(1)} · {active.ratings.avgSpectrum}/100 velvet
          </p>
        </div>
      )}

      <details class="mt-4">
        <summary class="cursor-pointer text-xs text-cream-100 underline">view as table</summary>
        <div class="mt-2 overflow-x-auto">
          <table class="w-full text-xs text-cream-100">
            <thead>
              <tr>
                <th scope="col" class="py-1 pr-3 text-left font-semibold">song</th>
                <th scope="col" class="py-1 pr-3 text-left font-semibold">concept</th>
                <th scope="col" class="py-1 pr-3 text-left font-semibold">quality</th>
                <th scope="col" class="py-1 text-left font-semibold">spectrum</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((s) => (
                <tr key={s.slug} class="border-t border-line/30">
                  <td class="py-1 pr-3">{s.title}</td>
                  <td class="py-1 pr-3">{CONCEPT_COLOR[s.concept].label.toLowerCase()}</td>
                  <td class="py-1 pr-3">{s.ratings.avgQuality.toFixed(1)}</td>
                  <td class="py-1">{s.ratings.avgSpectrum}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
