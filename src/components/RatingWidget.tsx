import { useState } from "preact/hooks";

interface Props {
  songTitle: string;
}

function spectrumLabel(v: number) {
  if (v <= 15) return "full red";
  if (v <= 40) return "leaning red";
  if (v <= 60) return "balanced";
  if (v <= 85) return "leaning velvet";
  return "full velvet";
}

export default function RatingWidget({ songTitle }: Props) {
  const [quality, setQuality] = useState<number | null>(null);
  const [spectrum, setSpectrum] = useState(50);
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit() {
    if (quality === null) {
      setMessage("pick a quality score first.");
      return;
    }
    // Honest stub: nothing is persisted until Phase 3's rating API exists.
    setMessage(
      "this is a preview — sign in and save your vote once accounts launch in phase 2. your picks above weren't lost, they just aren't stored yet."
    );
  }

  return (
    <div class="chart-panel p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 class="font-display text-3xl uppercase leading-none text-cream-100">rate {songTitle}</h3>
        <span class="sticker" style={{ "--sticker-bg": "var(--m-yellow)", "--tilt": "3deg" }}>
          preview
        </span>
      </div>
      <p class="mt-2 text-xs text-cream-100">sign-in coming soon</p>

      <fieldset class="mt-5">
        <legend class="text-sm font-semibold text-cream-100">quality score</legend>
        <p class="mb-2 text-xs text-cream-100">1 = worst, 10 = best</p>
        <div class="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Quality score, 1 to 10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={quality === n}
              onClick={() => setQuality(n)}
              class={
                "h-10 w-10 border border-line font-display text-xl " +
                (quality === n ? "bg-cream-100 text-ink-950" : "bg-transparent text-cream-100 hover:bg-cream-100/20")
              }
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <div class="mt-6">
        <label htmlFor="spectrum-slider" class="text-sm font-semibold text-cream-100">
          velvety-ness spectrum
        </label>
        <p class="mb-3 text-xs text-cream-100">0 = bright, poppy "red" · 100 = mature, elegant "velvet"</p>
        <input
          id="spectrum-slider"
          type="range"
          min={0}
          max={100}
          value={spectrum}
          onInput={(e) => setSpectrum(Number((e.target as HTMLInputElement).value))}
          class="spectrum"
          aria-valuetext={`${spectrum} — ${spectrumLabel(spectrum)}`}
        />
        <div class="mt-2 flex justify-between text-xs text-cream-100">
          <span>red</span>
          <span class="pill">
            {spectrum} · {spectrumLabel(spectrum)}
          </span>
          <span>velvet</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        class="mt-6 w-full bg-red-500 px-4 py-2 font-display text-2xl uppercase text-cream-100 hover:bg-cream-100 hover:text-ink-950 focus-visible:bg-cream-100 focus-visible:text-ink-950"
      >
        save rating
      </button>

      {message && (
        <p role="status" class="mt-3 border border-dashed border-line p-3 text-sm text-cream-100">
          {message}
        </p>
      )}
    </div>
  );
}
