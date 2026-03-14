"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scrolls window to top on every route change.
 * Placed in root layout so all pages start at the top.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
