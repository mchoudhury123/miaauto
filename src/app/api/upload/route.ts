import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

// POST /api/upload — multipart form with one or more "files" (admin only).
// Stores to Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production);
// otherwise falls back to /public/uploads for zero-config local dev.
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const files = formData
      .getAll("files")
      .filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate up front.
    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}` },
          { status: 415 },
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: `${file.name} is larger than 8MB` },
          { status: 413 },
        );
      }
    }

    const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const urls: string[] = [];

    if (useBlob) {
      // Production / cloud storage.
      for (const file of files) {
        const ext = safeExt(file.name);
        const key = `cars/${Date.now()}-${rand()}.${ext}`;
        const blob = await put(key, file, {
          access: "public",
          contentType: file.type,
        });
        urls.push(blob.url);
      }
    } else {
      // Local dev fallback → /public/uploads.
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      for (const file of files) {
        const bytes = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${rand()}.${safeExt(file.name)}`;
        await writeFile(path.join(uploadDir, filename), bytes);
        urls.push(`/uploads/${filename}`);
      }
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("POST /api/upload failed", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

function safeExt(name: string): string {
  const ext = (name.split(".").pop() || "jpg").toLowerCase();
  return /^(jpe?g|png|webp|avif)$/.test(ext) ? ext : "jpg";
}

function rand(): string {
  return Math.random().toString(36).slice(2, 10);
}
