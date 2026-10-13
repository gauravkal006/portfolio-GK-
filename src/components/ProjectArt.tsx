import type { ProjectCategory, ProjectMotif } from "../data/projects";

const tint: Record<ProjectCategory, string> = {
  "Full stack": "#5ee0ff",
  "AI & ML": "#9d8cff",
  "Web experience": "#c8ff5f",
};

type Props = { motif: ProjectMotif; category: ProjectCategory; name: string };

/**
 * Lightweight, illustrative cover art for a project (inline SVG, no image requests).
 * Purely decorative: the card's heading and description carry the meaning.
 */
export function ProjectArt({ motif, category, name }: Props) {
  const c = tint[category];
  const id = name.replace(/\W+/g, "-").toLowerCase();
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="55%" r="65%">
          <stop offset="0" stopColor={c} stopOpacity="0.16" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#fff" fillOpacity="0.07" />
        </pattern>
      </defs>
      <rect width="400" height="225" fill="#0d0f13" />
      <rect width="400" height="225" fill={`url(#${id}-dots)`} />
      <rect width="400" height="225" fill={`url(#${id}-glow)`} />
      <g fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {motifs[motif](c)}
      </g>
    </svg>
  );
}

const soft = (c: string, o = 0.12) => ({ fill: c, fillOpacity: o });

const motifs: Record<ProjectMotif, (c: string) => React.ReactNode> = {
  cloud: (c) => (
    <>
      <path d="M150 112a34 34 0 0 1 64-16 26 26 0 0 1 40 22 22 22 0 0 1-4 44H156a26 26 0 0 1-6-50z" {...soft(c, 0.08)} />
      <path d="M200 150v-40m-14 14 14-14 14 14" strokeWidth="2" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${96 + i * 76} 178)`} strokeOpacity={0.55}>
          <rect width="56" height="22" rx="5" />
          <path d="M10 11h22" strokeOpacity="0.6" />
        </g>
      ))}
    </>
  ),
  documents: (c) => (
    <>
      <rect x="128" y="52" width="104" height="132" rx="8" strokeOpacity="0.35" transform="rotate(-6 180 118)" />
      <rect x="160" y="44" width="104" height="132" rx="8" {...soft(c, 0.06)} />
      {[70, 84, 98, 126, 140].map((y, i) => (
        <path key={y} d={`M176 ${y}h${i === 1 ? 52 : 72}`} strokeOpacity={i === 3 ? 1 : 0.4} strokeWidth={i === 3 ? 6 : 1.5} />
      ))}
      <circle cx="270" cy="150" r="20" {...soft(c, 0.1)} strokeWidth="2" />
      <path d="m284 164 18 18" strokeWidth="3" />
    </>
  ),
  shield: (c) => (
    <>
      <rect x="104" y="58" width="150" height="108" rx="8" strokeOpacity="0.4" />
      <path d="M122 82h70M122 98h100M122 114h56" strokeOpacity="0.35" />
      <circle cx="214" cy="140" r="12" strokeOpacity="0.5" />
      <path d="M268 64l40 14v30c0 28-18 44-40 52-22-8-40-24-40-52V78z" {...soft(c, 0.1)} strokeWidth="2" />
      <path d="m254 110 10 10 20-22" strokeWidth="2.5" />
    </>
  ),
  vision: (c) => (
    <>
      <circle cx="140" cy="128" r="30" strokeOpacity="0.35" />
      <circle cx="226" cy="118" r="26" strokeOpacity="0.35" />
      <circle cx="296" cy="134" r="22" strokeOpacity="0.35" />
      <rect x="104" y="92" width="72" height="72" rx="3" strokeDasharray="5 4" />
      <rect x="194" y="86" width="64" height="64" rx="3" />
      <rect x="194" y="70" width="56" height="16" rx="3" {...soft(c, 0.5)} stroke="none" />
      <circle cx="236" cy="128" r="6" {...soft(c, 0.5)} />
    </>
  ),
  exam: (c) => (
    <>
      <rect x="110" y="48" width="180" height="120" rx="10" strokeOpacity="0.45" />
      <circle cx="200" cy="98" r="22" {...soft(c, 0.08)} />
      <path d="M164 152c6-18 20-26 36-26s30 8 36 26" />
      <path d="M126 64h22v22M274 64h-22v22M126 152h22v-22M274 152h-22v-22" strokeWidth="2" strokeOpacity="0.7" />
      <circle cx="276" cy="186" r="5" fill={c} stroke="none" />
      <path d="M190 186h76" strokeOpacity="0.4" />
    </>
  ),
  finance: (c) => (
    <>
      <path d="M96 176h220" strokeOpacity="0.3" />
      {[40, 70, 52, 96, 82, 118].map((h, i) => (
        <rect key={i} x={112 + i * 34} y={176 - h} width="20" height={h} rx="3" {...soft(c, i === 5 ? 0.35 : 0.08)} strokeOpacity={i === 5 ? 1 : 0.45} />
      ))}
      <path d="M116 128l34-22 34 12 34-34 34 10 34-30" strokeWidth="2" />
    </>
  ),
  commerce: (c) => (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${104 + i * 68} 60)`}>
          <rect width="56" height="70" rx="6" strokeOpacity="0.45" />
          <path d="M12 86h32M12 98h20" strokeOpacity="0.35" />
        </g>
      ))}
      <path d="M300 92h10l12 52h-48l-6-32h50" strokeWidth="2" />
      <circle cx="282" cy="154" r="4" fill={c} stroke="none" />
      <circle cx="312" cy="154" r="4" fill={c} stroke="none" />
    </>
  ),
  weather: (c) => (
    <>
      <circle cx="178" cy="92" r="26" {...soft(c, 0.12)} strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M178 52v-10" transform={`rotate(${a} 178 92)`} strokeOpacity="0.6" />
      ))}
      <path d="M190 150a24 24 0 0 1 44-14 20 20 0 0 1 30 18 16 16 0 0 1-4 32h-66a20 20 0 0 1-4-36z" fill="#0d0f13" strokeWidth="2" />
      <path d="M104 196h56M240 196h56" strokeOpacity="0.3" />
    </>
  ),
  motion: (c) => (
    <>
      <path d="M40 190C120 170 150 110 220 104s120 30 160 4" strokeOpacity="0.35" strokeWidth="18" />
      <path d="M40 190C120 170 150 110 220 104s120 30 160 4" strokeDasharray="8 10" strokeOpacity="0.8" />
      <g transform="rotate(-8 220 98)">
        <rect x="196" y="86" width="50" height="22" rx="7" {...soft(c, 0.3)} strokeWidth="2" />
        <path d="M206 86l8-10h20l8 10" />
      </g>
      <path d="M160 92h20M150 102h22M164 112h14" strokeOpacity="0.5" />
    </>
  ),
  ar: (c) => (
    <>
      <path d="M200 52a10 10 0 1 1 8 10v8l58 34H134l58-34" strokeWidth="2" />
      <path d="M150 104l14 76h72l14-76" {...soft(c, 0.08)} strokeOpacity="0.6" />
      {[120, 140, 160].map((y) => (
        <path key={y} d={`M118 ${y}h164`} strokeOpacity="0.25" strokeDasharray="3 6" />
      ))}
      <path d="M104 60v-14h14M296 60v-14h-14M104 170v14h14M296 170v14h-14" strokeWidth="2" strokeOpacity="0.7" />
    </>
  ),
};
