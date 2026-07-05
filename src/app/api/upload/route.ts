import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Client-side (direct browser → Vercel Blob) uploads.
// This bypasses the ~4.5MB serverless request-body limit, so admins can upload
// many large photos. This route only issues a short-lived upload token after
// checking the admin is authenticated; the file bytes never pass through here.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAuthenticated())) {
          throw new Error("Unauthorised");
        }
        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB per image
          addRandomSuffix: true,
        };
      },
      // Fires via webhook after each upload completes (not on localhost).
      onUploadCompleted: async () => {
        // No-op: images are attached to a car when the admin saves the form.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Upload failed" },
      { status: 400 },
    );
  }
}
