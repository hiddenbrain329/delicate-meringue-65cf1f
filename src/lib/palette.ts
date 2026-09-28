import type { Concept } from "../data/songs";

// Concept colors now point at the member-accent CSS variables in
// src/styles/theme.css (the only file with hex values). Charts sit on a black
// panel in both worlds, so light and dark resolve to the same variable.
// NOTE: the previous palette was validated with validate_palette.js; this one
// has NOT been re-validated. Pink/purple can sit close under some color-vision
// deficiencies, so charts also encode concept by marker shape (CONCEPT_SHAPE).
export const CONCEPT_COLOR: Record<Concept, { light: string; dark: string; label: string }> = {
  red: { light: "var(--m-pink)", dark: "var(--m-pink)", label: "Red" },
  velvet: { light: "var(--m-purple)", dark: "var(--m-purple)", label: "Velvet" },
  hybrid: { light: "var(--m-yellow)", dark: "var(--m-yellow)", label: "Red × Velvet" },
};

export type Shape = "circle" | "square" | "diamond";
export const CONCEPT_SHAPE: Record<Concept, Shape> = {
  red: "circle",
  velvet: "square",
  hybrid: "diamond",
};

export function spectrumToPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}
