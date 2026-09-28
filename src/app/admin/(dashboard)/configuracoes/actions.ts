"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SITE_PHOTO_KEYS, type SitePhotoKey } from "@/lib/types";

export type SettingsFormState = { error: string | null; success?: boolean };

export async function updateEventSettings(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const couple_names = String(formData.get("couple_names") ?? "").trim();
  const event_name = String(formData.get("event_name") ?? "").trim();
  const opening_title = String(formData.get("opening_title") ?? "").trim();
  const opening_subtitle = String(formData.get("opening_subtitle") ?? "").trim();
  const event_date = String(formData.get("event_date") ?? "").trim() || null;
  const event_time = String(formData.get("event_time") ?? "").trim() || null;
  const location_name = String(formData.get("location_name") ?? "").trim() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const maps_url = String(formData.get("maps_url") ?? "").trim() || null;
  const instagram = String(formData.get("instagram") ?? "").trim() || null;
  const final_message = String(formData.get("final_message") ?? "").trim() || null;

  if (!couple_names) return { error: "Preencha o nome do casal." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("event_settings")
    .update({
      couple_names,
      event_name,
      opening_title,
      opening_subtitle,
      event_date,
      event_time,
      location_name,
      address,
      maps_url,
      instagram,
      final_message,
    })
    .eq("id", 1);

  if (error) return { error: "Não foi possível salvar as configurações." };

  revalidatePath("/", "layout");
  revalidatePath("/presentes");
  revalidatePath("/admin/configuracoes");

  return { error: null, success: true };
}

export async function updateSitePhoto(formData: FormData) {
  const key = String(formData.get("key") ?? "") as SitePhotoKey;
  if (!SITE_PHOTO_KEYS.includes(key)) return;

  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const alt_text = String(formData.get("alt_text") ?? "").trim() || null;

  const supabase = await createClient();
  await supabase
    .from("site_photos")
    .update({ image_url, alt_text })
    .eq("key", key);

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracoes");
}
