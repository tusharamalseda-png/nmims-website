import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/client";
import { media } from "../db/schema";
import { getAdminSession } from "../auth/session";
import { supabaseAdmin } from "../supabase/admin-client";
import { logActivity } from "../activity/log";

const BUCKET = "media";

function generateSlug() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

// Only these are accepted, verified by the real byte signature at the start
// of the file — never by the filename or the browser-supplied contentType,
// both of which an uploader fully controls. SVG is deliberately excluded:
// it can carry <script> and would execute if opened directly.
const ALLOWED_FILE_SIGNATURES: { mimeType: string; ext: string; matches: (b: Uint8Array) => boolean }[] = [
  { mimeType: "image/jpeg", ext: "jpg", matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    mimeType: "image/png",
    ext: "png",
    matches: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    mimeType: "image/webp",
    ext: "webp",
    matches: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  { mimeType: "application/pdf", ext: "pdf", matches: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
];

async function detectFileType(file: File) {
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return ALLOWED_FILE_SIGNATURES.find((sig) => sig.matches(header)) ?? null;
}

export const listMediaFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  if (!session.data.userId) throw new Error("Not authenticated.");
  return db.select().from(media).orderBy(desc(media.uploadedAt));
});

export const uploadMediaFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => data)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const file = data.get("file");
    const folder = (data.get("folder") as string) || "uncategorized";
    const altText = (data.get("altText") as string) || null;
    const title = (data.get("title") as string) || null;
    const caption = (data.get("caption") as string) || null;

    if (!(file instanceof File)) throw new Error("No file provided.");

    const detected = await detectFileType(file);
    if (!detected) throw new Error("Unsupported file. Only JPG, PNG, WebP, and PDF files are allowed.");
    const { mimeType, ext } = detected;

    // Retry on the rare slug collision.
    let slug = generateSlug();
    for (let attempt = 0; attempt < 5; attempt++) {
      const [existing] = await db.select({ id: media.id }).from(media).where(eq(media.slug, slug)).limit(1);
      if (!existing) break;
      slug = generateSlug();
    }

    const storagePath = `${folder}/${slug}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(storagePath, file, {
      contentType: mimeType,
    });
    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const fileType = mimeType === "application/pdf" ? "pdf" : "image";

    const [row] = await db
      .insert(media)
      .values({
        slug,
        fileUrl: `/media/${slug}`,
        storagePath,
        fileName: file.name,
        mimeType,
        fileType,
        fileSize: file.size,
        altText,
        title,
        caption,
        folder,
      })
      .returning();

    logActivity({ userId: session.data.userId, action: "created", entity: "media", entityId: row.id, details: { fileName: file.name, fileType } });
    return row;
  });

const updateMediaSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  caption: z.string().nullable(),
  altText: z.string().nullable(),
  folder: z.string(),
});

export const updateMediaFn = createServerFn({ method: "POST" })
  .inputValidator(updateMediaSchema)
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    await db
      .update(media)
      .set({ title: data.title, caption: data.caption, altText: data.altText, folder: data.folder })
      .where(eq(media.id, data.id));

    logActivity({ userId: session.data.userId, action: "updated", entity: "media", entityId: data.id });
    return { success: true };
  });

export const deleteMediaFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const session = await getAdminSession();
    if (!session.data.userId) throw new Error("Not authenticated.");

    const [row] = await db.select().from(media).where(eq(media.id, data.id)).limit(1);
    if (!row) return { success: true };

    await supabaseAdmin.storage.from(BUCKET).remove([row.storagePath]);
    await db.delete(media).where(eq(media.id, data.id));
    logActivity({ userId: session.data.userId, action: "deleted", entity: "media", entityId: data.id, details: { fileName: row.fileName } });
    return { success: true };
  });
