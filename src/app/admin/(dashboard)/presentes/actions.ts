"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/format";
import type { GiftStatus } from "@/lib/types";

export type GiftFormState = { error: string | null };

function parseGiftForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "") || null;
  const price = Number(formData.get("price") ?? 0);
  const store_name = String(formData.get("store_name") ?? "").trim();
  const product_url = String(formData.get("product_url") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const quantity_total = Math.max(1, Number(formData.get("quantity_total") ?? 1));
  const featured = formData.get("featured") === "on";
  const display_order = Number(formData.get("display_order") ?? 0);
  const status = (String(formData.get("status") ?? "active")) as GiftStatus;
  const is_test = formData.get("is_test") === "on";

  return {
    name,
    description: description || null,
    category_id,
    price: Number.isFinite(price) ? price : 0,
    store_name: store_name || null,
    product_url: product_url || null,
    image_url: image_url || null,
    quantity_total,
    featured,
    display_order: Number.isFinite(display_order) ? display_order : 0,
    status,
    is_test,
  };
}

export async function createGift(
  _prevState: GiftFormState,
  formData: FormData,
): Promise<GiftFormState> {
  const values = parseGiftForm(formData);
  if (!values.name) return { error: "Dê um nome ao presente." };

  const supabase = await createClient();
  const { error } = await supabase.from("gifts").insert(values);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
  revalidatePath("/");
  redirect("/admin/presentes");
}

export async function updateGift(
  giftId: string,
  _prevState: GiftFormState,
  formData: FormData,
): Promise<GiftFormState> {
  const values = parseGiftForm(formData);
  if (!values.name) return { error: "Dê um nome ao presente." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("gifts")
    .update(values)
    .eq("id", giftId);

  if (error) return { error: "Não foi possível salvar. Tente novamente." };

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
  revalidatePath("/");
  redirect("/admin/presentes");
}

export async function deleteGift(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("gifts").delete().eq("id", id);

  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
  revalidatePath("/");
}

export async function resetGiftAvailability(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.rpc("admin_reset_gift_availability", { p_gift_id: id });

  revalidatePath("/admin/presentes");
  revalidatePath("/admin/reservas");
  revalidatePath("/presentes");
  revalidatePath("/");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const display_order = Number(formData.get("display_order") ?? 0);

  const supabase = await createClient();
  await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    display_order: Number.isFinite(display_order) ? display_order : 0,
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const display_order = Number(formData.get("display_order") ?? 0);
  if (!id || !name) return;

  const supabase = await createClient();
  await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(name),
      display_order: Number.isFinite(display_order) ? display_order : 0,
    })
    .eq("id", id);

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);

  revalidatePath("/admin/categorias");
  revalidatePath("/admin/presentes");
  revalidatePath("/presentes");
}
