"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { updateSitePhoto } from "@/app/admin/(dashboard)/configuracoes/actions";
import type { SitePhoto, SitePhotoKey } from "@/lib/types";

const LABELS: Record<SitePhotoKey, string> = {
  hero: "Foto de abertura (topo do site)",
  story: "Foto da seção “Onde a nossa história mora”",
  couple_1: "Foto do casal 1",
  couple_2: "Foto do casal 2",
  home_detail_1: "Detalhe da casa 1",
  home_detail_2: "Detalhe da casa 2",
  closing: "Foto de encerramento",
};

export function PhotoManager({
  photos,
}: {
  photos: Record<SitePhotoKey, SitePhoto | null>;
}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(LABELS) as SitePhotoKey[]).map((key) => (
        <form
          key={key}
          action={updateSitePhoto}
          className="flex flex-col gap-3 rounded-sm border border-line-soft bg-card p-5"
        >
          <input type="hidden" name="key" value={key} />
          <ImageUploadField
            bucket="site-photos"
            name="image_url"
            defaultValue={photos[key]?.image_url}
            label={LABELS[key]}
          />
          <input
            name="alt_text"
            defaultValue={photos[key]?.alt_text ?? ""}
            placeholder="Descrição da foto (acessibilidade)"
            className="rounded-sm border border-line bg-card px-3 py-2 text-sm text-ink outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="self-start rounded-full bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-accent-dark"
          >
            Salvar foto
          </button>
        </form>
      ))}
    </div>
  );
}
