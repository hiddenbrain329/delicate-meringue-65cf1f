import type { Concept } from "../data/songs";

// Validated categorical palette (see project notes) — Red / Velvet / Hybrid,
// each pair passes CVD all-pairs separation + contrast checks against the
// cream (light) and deep-velvet (dark) chart surfaces used across the site.
export const CONCEPT_COLOR: Record<Concept, { light: string; dark: string; label: string }> = {
  red: { light: "#d81b60", dark: "#f0518c", label: "Red" },
  velvet: { light: "#7b3f9e", dark: "#a878d4", label: "Velvet" },
  hybrid: { light: "#a8891f", dark: "#b8892f", label: "Red × Velvet" },
};

export function spectrumToPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}
