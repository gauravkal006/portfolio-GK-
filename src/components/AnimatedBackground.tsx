/** Fixed ambient layer: masked grid and two slow-drifting gradient orbs (transform-only animation). */
export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div
        className="bg-orb top-[-18rem] right-[-12rem] size-[44rem] [animation:drift-a_22s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgb(94 224 255 / 0.10), transparent 62%)" }}
      />
      <div
        className="bg-orb top-[30vh] left-[-20rem] size-[40rem] [animation:drift-b_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgb(157 140 255 / 0.07), transparent 62%)" }}
      />
    </div>
  );
}
