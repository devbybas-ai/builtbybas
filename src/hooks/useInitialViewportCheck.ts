"use client";

import { useState, useEffect, type RefObject } from "react";

/**
 * iOS Safari fix: IntersectionObserver may not fire for elements
 * already in viewport on mount (e.g. during Next.js client-side navigation).
 * Uses requestAnimationFrame + getBoundingClientRect to detect initial visibility.
 */
export function useInitialViewportCheck(ref: RefObject<HTMLElement | null>): boolean {
  const [mountVisible, setMountVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setMountVisible(true);
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [ref]);

  return mountVisible;
}
