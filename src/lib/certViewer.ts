import { useSyncExternalStore } from "react";
import type { CertificateImage } from "../data/experience";

/** Which certificate (if any) is open in the full-size viewer. Shared across sections. */
let current: CertificateImage | null = null;
let opener: HTMLElement | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((fn) => fn());

export function openCertificate(cert: CertificateImage, from?: HTMLElement | null) {
  opener = from ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  current = cert;
  emit();
}

export function closeCertificate() {
  current = null;
  emit();
  opener?.focus({ preventScroll: true });
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

export function useOpenCertificate() {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
