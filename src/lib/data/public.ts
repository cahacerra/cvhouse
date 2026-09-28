import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  EventSettings,
  GiftWithCategory,
  SitePhoto,
  SitePhotoKey,
} from "@/lib/types";
import { SITE_PHOTO_KEYS } from "@/lib/types";

/**
 * All public-facing reads. Every function fails soft (returns an empty /
 * null value instead of throwing) so the site renders gracefully before
 * Supabase is connected, before any content is configured, or if the
 * network briefly hiccups — a guest should never see a crashed page.
 */

export async function getEventSettings(): Promise<EventSettings | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getSitePhotos(): Promise<Record<SitePhotoKey, SitePhoto | null>> {
  const fallback = Object.fromEntries(
    SITE_PHOTO_KEYS.map((key) => [key, null]),
  ) as Record<SitePhotoKey, SitePhoto | null>;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_photos").select("*");
    if (error || !data) return fallback;
    for (const photo of data as SitePhoto[]) {
      fallback[photo.key] = photo;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getActiveGifts(): Promise<GiftWithCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gifts")
      .select("*, category:categories(*)")
      .eq("status", "active")
      .order("display_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as unknown as GiftWithCategory[];
  } catch {
    return [];
  }
}
