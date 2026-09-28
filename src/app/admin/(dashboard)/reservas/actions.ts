"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function cancelReservation(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.rpc("admin_cancel_reservation", { p_reservation_id: id });

  revalidatePath("/admin/reservas");
  revalidatePath("/admin/presentes");
  revalidatePath("/admin");
  revalidatePath("/presentes");
  revalidatePath("/");
}
