"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Star, X, Loader2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormImage {
  url: string;
  isMain: boolean;
  alt?: string | null;
}

export default function ImageUploader({
  images,
  onChange,
}: {
  images: FormImage[];
  onChange: (imgs: FormImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      const newImgs: FormImage[] = data.urls.map((url: string) => ({
        url,
        isMain: false,
      }));
      const merged = [...images, ...newImgs];
      // Ensure one main image.
      if (!merged.some((i) => i.isMain) && merged.length > 0)
        merged[0].isMain = true;
      onChange(merged);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function setMain(idx: number) {
    onChange(images.map((img, i) => ({ ...img, isMain: i === idx })));
  }

  function remove(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    if (next.length > 0 && !next.some((i) => i.isMain)) next[0].isMain = true;
    onChange(next);
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 px-6 py-8 text-center transition hover:border-gold-400 hover:bg-gold-50/40 disabled:opacity-60"
      >
        {uploading ? (
          <Loader2 className="h-7 w-7 animate-spin text-gold-600" />
        ) : (
          <UploadCloud className="h-7 w-7 text-ink-400" />
        )}
        <span className="text-sm font-semibold text-ink-700">
          {uploading ? "Uploading…" : "Click to upload images"}
        </span>
        <span className="text-xs text-ink-400">
          JPG, PNG, WEBP or AVIF — up to 8MB each
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <>
          <p className="mt-4 text-xs text-ink-400">
            Drag to reorder. Click the star to set the main image (shown first
            on listings).
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img, idx) => (
              <div
                key={img.url}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, idx);
                  setDragIndex(null);
                }}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-xl border bg-ink-900",
                  img.isMain ? "border-gold-500 ring-2 ring-gold-500" : "border-ink-200",
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Image ${idx + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <div className="absolute left-1 top-1 rounded bg-ink-900/60 p-1 text-white/70">
                  <GripVertical className="h-3.5 w-3.5" />
                </div>
                {img.isMain && (
                  <span className="absolute bottom-1 left-1 rounded bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold text-ink-900">
                    MAIN
                  </span>
                )}
                <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setMain(idx)}
                    className="rounded bg-ink-900/70 p-1.5 text-white hover:bg-gold-500 hover:text-ink-900"
                    aria-label="Set as main image"
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        img.isMain && "fill-current",
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="rounded bg-ink-900/70 p-1.5 text-white hover:bg-red-500"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
