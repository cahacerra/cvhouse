import { createClient } from "@/lib/supabase/server";
import type { GiftWithCategory, ReservationWithGift } from "@/lib/types";

/** Admin-only reads. Called from Server Components already behind the
 * middleware's auth + admins-table check, and additionally protected by
 * RLS itself (the queries simply return nothing for a non-admin session). */

export async function getAllGiftsAdmin(): Promise<GiftWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gifts")
    .select("*, category:categories(*)")
    .order("display_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as unknown as GiftWithCategory[];
}

export async function getReservationsAdmin(): Promise<ReservationWithGift[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*, gift:gifts(id, name, price, store_name)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as unknown as ReservationWithGift[];
}

export interface AdminStats {
  totalGifts: number;
  availableGifts: number;
  chosenGifts: number;
  confirmedGuests: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const gifts = await getAllGiftsAdmin();
  const activeGifts = gifts.filter((g) => g.status === "active");
  const availableGifts = activeGifts.filter(
    (g) => g.quantity_reserved < g.quantity_total,
  ).length;
  const chosenGifts = activeGifts.filter(
    (g) => g.quantity_reserved >= g.quantity_total,
  ).length;

  const supabase = await createClient();
  const { count } = await supabase
    .from("reservations")
    .select("guest_name", { count: "exact", head: true })
    .eq("status", "confirmed");

  return {
    totalGifts: gifts.length,
    availableGifts,
    chosenGifts,
    confirmedGuests: count ?? 0,
  };
}
