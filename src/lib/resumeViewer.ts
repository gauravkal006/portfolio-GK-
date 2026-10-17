import { useSyncExternalStore, type MouseEvent } from "react";

/** Open/closed state of the on-page résumé viewer, shared by every "View résumé" control. */
let open = false;
let opener: HTMLElement | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function openResume(from?: HTMLElement | null) {
  opener = from ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  open = true;
  emit();
}

export function closeResume() {
  open = false;
  emit();
  opener?.focus({ preventScroll: true });
}

/**
 * Click handler for a "View résumé" link: opens the viewer on the page, but lets modified
 * clicks (Ctrl/Cmd/Shift/middle) fall through to the link's normal new-tab behaviour.
 */
export function viewResumeClick(event: MouseEvent<HTMLElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openResume(event.currentTarget);
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

export function useResumeOpen() {
  return useSyncExternalStore(subscribe, () => open, () => false);
}
