"use client";

import { useEffect, useRef } from "react";

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
  clearAfterMs?: number;
  className?: string;
}

/**
 * Announces content to screen readers. Use for turn changes, roll results, and game events.
 */
export function LiveRegion({
  message,
  politeness = "polite",
  clearAfterMs,
  className = "",
}: LiveRegionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!message) return;
    if (clearAfterMs && ref.current) {
      const id = setTimeout(() => {
        if (ref.current) ref.current.textContent = "";
      }, clearAfterMs);
      return () => clearTimeout(id);
    }
  }, [message, clearAfterMs]);

  return (
    <div
      ref={ref}
      role="status"
      aria-live={politeness}
      aria-atomic
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
}
