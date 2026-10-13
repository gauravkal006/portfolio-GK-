import type { ReactNode } from "react";

// Syntax-highlighted snapshot of verified profile facts.
const S = ({ c, children }: { c: string; children: ReactNode }) => <span className={c}>{children}</span>;
const str = "text-lime/90";
const key = "text-ink";
const pun = "text-subtle";
const codeLines: ReactNode[] = [
  <S c="italic text-subtle">// building for the bright side</S>,
  <><S c="text-accent-2">const</S> <S c="text-accent">gaurav</S> <S c={pun}>=</S> <S c={pun}>{"{"}</S></>,
  <>&nbsp;&nbsp;<S c={key}>role</S><S c={pun}>:</S> <S c={str}>"Full-Stack Developer"</S><S c={pun}>,</S></>,
  <>&nbsp;&nbsp;<S c={key}>studying</S><S c={pun}>:</S> <S c={str}>"B.Tech CSE @ PRMITR"</S><S c={pun}>,</S></>,
  <>&nbsp;&nbsp;<S c={key}>based</S><S c={pun}>:</S> <S c={str}>"Amravati, IN"</S><S c={pun}>,</S></>,
  <>&nbsp;&nbsp;<S c={key}>stack</S><S c={pun}>: [</S><S c={str}>"Java"</S><S c={pun}>,</S> <S c={str}>"Spring Boot"</S><S c={pun}>,</S> <S c={str}>"React"</S><S c={pun}>],</S></>,
  <>&nbsp;&nbsp;<S c={key}>exploring</S><S c={pun}>: [</S><S c={str}>"RAG"</S><S c={pun}>,</S> <S c={str}>"OCR"</S><S c={pun}>,</S> <S c={str}>"Azure"</S><S c={pun}>],</S></>,
  <>&nbsp;&nbsp;<S c={key}>recent</S><S c={pun}>: [</S><S c={str}>"Validify"</S><S c={pun}>,</S> <S c={str}>"DocBlendAI"</S><S c={pun}>],</S></>,
  <S c={pun}>{"};"}</S>,
];

/** Decorative editor window summarising the profile; lines carry [data-stagger] for the scroll reveal. */
export function CodeCard() {
  return (
    <div aria-hidden="true" className="panel overflow-hidden shadow-[0_40px_120px_-40px_rgb(94_224_255/0.25)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 rounded-md bg-white/[0.04] px-2.5 py-1 font-mono text-[0.72rem] text-muted">gaurav.ts</span>
      </div>
      <pre data-stagger className="overflow-hidden px-4 py-5 font-mono text-[clamp(0.6rem,2.9vw,0.84rem)] leading-[1.9] sm:px-5">
        {codeLines.map((line, i) => (
          <div key={i} className="flex whitespace-pre">
            <span className="mr-4 hidden w-4 shrink-0 text-right text-subtle/60 select-none sm:inline-block">{i + 1}</span>
            <span className="min-w-0">{line}</span>
          </div>
        ))}
      </pre>
      <div className="flex items-center border-t border-line px-4 py-2 font-mono text-[0.68rem] text-subtle">
        <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-lime" /> main</span>
      </div>
    </div>
  );
}
