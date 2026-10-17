/*
  The site's visual signature: a mid-century sunburst, plus a small set of geometric glyphs
  used as legend markers. All decorative (aria-hidden) and drawn with currentColor or tokens.
*/

const round = (n: number) => Math.round(n * 100) / 100;

/** Alternating wedges radiating from the centre of a 200×200 box. */
export function sunburstPath(rays = 24, r = 100, cx = 100, cy = 100) {
  const step = (Math.PI * 2) / rays;
  let d = "";
  for (let i = 0; i < rays; i++) {
    const a0 = i * step;
    const a1 = a0 + step / 2;
    d += `M${cx} ${cy}L${round(cx + r * Math.cos(a0))} ${round(cy + r * Math.sin(a0))}L${round(cx + r * Math.cos(a1))} ${round(cy + r * Math.sin(a1))}Z`;
  }
  return d;
}

type SunburstProps = { className?: string; rays?: number; spin?: boolean; core?: boolean };

export function Sunburst({ className = "", rays = 24, spin = false, core = true }: SunburstProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <path d={sunburstPath(rays)} fill="currentColor" className={spin ? "sun-spin" : undefined} />
      {core && <circle cx="100" cy="100" r="34" fill="var(--color-accent)" />}
    </svg>
  );
}

export type GlyphShape = "circle" | "half" | "square" | "triangle" | "arch" | "quarter";

const glyphColor: Record<GlyphShape, string> = {
  circle: "var(--color-accent)",
  half: "var(--color-olive)",
  square: "var(--color-ink)",
  triangle: "var(--color-mustard)",
  arch: "var(--color-slate)",
  quarter: "var(--color-accent)",
};

/** Small solid shape used as a category marker, like the key on a printed map. */
export function Glyph({ shape, className = "size-3.5" }: { shape: GlyphShape; className?: string }) {
  const fill = glyphColor[shape];
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" focusable="false">
      {shape === "circle" && <circle cx="8" cy="8" r="7" fill={fill} />}
      {shape === "half" && <path d="M1 12a7 7 0 0 1 14 0z" fill={fill} />}
      {shape === "square" && <rect x="2" y="2" width="12" height="12" fill={fill} />}
      {shape === "triangle" && <path d="M8 1.5 15 14.5H1z" fill={fill} />}
      {shape === "arch" && <path d="M2 15V8a6 6 0 0 1 12 0v7z" fill={fill} />}
      {shape === "quarter" && <path d="M1 15V1a14 14 0 0 1 14 14z" fill={fill} />}
    </svg>
  );
}
