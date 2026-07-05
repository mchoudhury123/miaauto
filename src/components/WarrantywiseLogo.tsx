"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Warrantywise partner logo. Drop the real logo in `public/warrantywise.png`
 * (a transparent PNG/SVG works best) and it appears automatically; until then a
 * clean text lock-up is shown as a fallback.
 */
export default function WarrantywiseLogo({
  className,
}: {
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <span
        className={cn(
          "font-display text-2xl font-semibold tracking-tight text-ink-950",
          className,
        )}
      >
        Warranty<span className="text-green-600">wise</span>
      </span>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/warrantywise.png"
      alt="Warrantywise"
      onError={() => setErrored(true)}
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
