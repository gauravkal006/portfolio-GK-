import { useSyncExternalStore } from "react";

/**
 * First-visit intro state. The loading screen plays once per browser session (about one second);
 * it is skipped on later visits in the same session and for reduced-motion users. Hero animations
 * wait for `finishIntro()` so they play as the curtain lifts, not behind it.
 */
const KEY = "intro-seen";

function shouldPlay() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

export const introPlays = shouldPlay();
let done = !introPlays;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage unavailable: the intro may simply play again next visit */
  }
  listeners.forEach((fn) => fn());
}

/** Run `fn` once the intro has finished (immediately if there is none). Returns an unsubscribe. */
export function onIntroDone(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

export function useIntroDone() {
  return useSyncExternalStore(subscribe, () => done, () => true);
}
