"use client";

import { useRef, useState } from "react";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { createClient } from "@/lib/supabase/client";

/**
 * Downscales large photos client-side before upload (max 1920px on the
 * longest side, re-encoded as JPEG) so guests never wait on multi-megabyte
 * originals and Next.js's image optimizer never chokes on them.
 */
async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const maxDim = 1920;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85),
  );
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

export function ImageUploadField({
  bucket,
  name,
  defaultValue,
  label,
}: {
  bucket: "gift-images" | "site-photos";
  name: string;
  defaultValue?: string | null;
  label: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const compressed = await compressImage(file);
      const supabase = createClient();
      const ext = compressed.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext ?? "jpg"}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, compressed, { upsert: false });

      if (uploadError) {
        setError("Não foi possível enviar a imagem.");
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setUrl(data.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink">{label}</p>
      <EditorialImage
        src={url || null}
        alt={label}
        label="Nenhuma imagem enviada"
        className="relative aspect-[4/3] w-full max-w-xs rounded-sm"
      />
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink/40 hover:text-ink disabled:opacity-50"
        >
          {uploading ? "Enviando…" : "Enviar imagem"}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-sm text-ink-faint underline underline-offset-4 hover:text-ink"
          >
            Remover
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <p className="text-xs text-ink-faint">
        Ou cole a URL de uma imagem já publicada:
      </p>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="rounded-sm border border-line bg-card px-4 py-2 text-sm text-ink outline-none focus:border-accent"
      />
    </div>
  );
}
