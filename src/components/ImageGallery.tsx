"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CarImage as CarImageType } from "@/lib/types";

export default function ImageGallery({
  images,
  alt,
}: {
  images: CarImageType[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl bg-ink-800 text-ink-500">
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="h-10 w-10" />
          <span className="text-sm">No images available</span>
        </div>
      </div>
    );
  }

  const go = (dir: 1 | -1) =>
    setActive((a) => (a + dir + images.length) % images.length);

  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-ink-900">
        <Image
          key={images[active].id}
          src={images[active].url}
          alt={images[active].alt || alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover animate-fade-in-fast"
        />
        <button
          onClick={() => setLightbox(true)}
          className="absolute right-3 top-3 rounded-lg bg-ink-900/60 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
          aria-label="Expand image"
        >
          <Expand className="h-5 w-5" />
        </button>

        {images.length > 1 && (
          <>
            <GalleryNav side="left" onClick={() => go(-1)} />
            <GalleryNav side="right" onClick={() => go(1)} />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink-900/70 px-3 py-1 text-xs font-medium text-white">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg ring-2 transition",
                i === active
                  ? "ring-gold-500"
                  : "ring-transparent hover:ring-ink-200",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${alt} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute right-4 top-4 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative h-full max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active].url}
              alt={images[active].alt || alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {images.length > 1 && (
              <>
                <GalleryNav side="left" onClick={() => go(-1)} />
                <GalleryNav side="right" onClick={() => go(1)} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GalleryNav({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 rounded-full bg-ink-900/60 p-2 text-white backdrop-blur transition hover:bg-ink-900",
        side === "left" ? "left-3" : "right-3",
      )}
      aria-label={side === "left" ? "Previous image" : "Next image"}
    >
      {side === "left" ? (
        <ChevronLeft className="h-6 w-6" />
      ) : (
        <ChevronRight className="h-6 w-6" />
      )}
    </button>
  );
}
