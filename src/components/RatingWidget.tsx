import { useState } from "preact/hooks";

interface Props {
  songTitle: string;
}

function spectrumLabel(v: number) {
  if (v <= 15) return "Full Red";
  if (v <= 40) return "Leaning Red";
  if (v <= 60) return "Balanced";
  if (v <= 85) return "Leaning Velvet";
  return "Full Velvet";
}

export default function RatingWidget({ songTitle }: Props) {
  const [quality, setQuality] = useState<number | null>(null);
  const [spectrum, setSpectrum] = useState(50);
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit() {
    if (quality === null) {
      setMessage("Pick a quality score first.");
      return;
    }
    setMessage(
      "This is a preview — sign in and save your vote once accounts launch in Phase 2. Your picks above weren't lost, they just aren't stored yet."
    );
  }

  return (
    <div class="rounded-2xl border border-white/10 bg-velvet-900/60 p-5 sm:p-6">
      <div class="flex items-center justify-between gap-3">
        <h3 class="font-display text-lg font-semibold text-cream-50">Rate {songTitle}</h3>
        <span class="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-medium text-cream-100/60">Preview — sign-in coming soon</span>
      </div>

      <fieldset class="mt-5">
        <legend class="text-sm font-medium text-cream-100/80">Quality score</legend>
        <p class="text-xs text-cream-100/45 mb-2">1 = worst, 10 = best</p>
        <div class="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Quality score, 1 to 10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={quality === n}
              onClick={() => setQuality(n)}
              class={
                "h-9 w-9 rounded-lg text-sm font-semibold transition-colors " +
                (quality === n ? "bg-red-500 text-cream-50" : "bg-white/5 text-cream-100/70 hover:bg-white/10")
              }
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <div class="mt-6">
        <label htmlFor="spectrum-slider" class="text-sm font-medium text-cream-100/80">
          Velvety-ness spectrum
        </label>
        <p class="text-xs text-cream-100/45 mb-2">0 = bright, poppy "Red" · 100 = mature, elegant "Velvet"</p>
        <input
          id="spectrum-slider"
          type="range"
          min={0}
          max={100}
          value={spectrum}
          onInput={(e) => setSpectrum(Number((e.target as HTMLInputElement).value))}
          class="w-full accent-[#a878d4]"
          style={{
            background: "linear-gradient(90deg, #e0364f 0%, #f6d6d2 22%, #c07fc0 55%, #5c2a63 100%)",
            height: "8px",
            borderRadius: "999px",
            appearance: "auto",
          }}
          aria-valuetext={`${spectrum} — ${spectrumLabel(spectrum)}`}
        />
        <div class="mt-1.5 flex justify-between text-xs text-cream-100/50">
          <span>Red</span>
          <span class="font-semibold text-cream-50">
            {spectrum} · {spectrumLabel(spectrum)}
          </span>
          <span>Velvet</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        class="mt-6 w-full rounded-full bg-gradient-to-r from-red-500 to-velvet-700 px-4 py-2.5 text-sm font-semibold text-cream-50 hover:opacity-90 focus-visible:opacity-90"
      >
        Save rating
      </button>

      {message && (
        <p role="status" class="mt-3 text-sm text-cream-100/70">
          {message}
        </p>
      )}
    </div>
  );
}
