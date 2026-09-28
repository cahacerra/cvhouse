import { notFound } from "next/navigation";
import { GiftForm } from "@/components/admin/GiftForm";
import { updateGift } from "@/app/admin/(dashboard)/presentes/actions";
import { getCategories } from "@/lib/data/public";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Editar presente — Painel Catarina & Vitor" };

export default async function EditarPresentePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: gift }, categories] = await Promise.all([
    supabase.from("gifts").select("*").eq("id", id).maybeSingle(),
    getCategories(),
  ]);

  if (!gift) notFound();

  const boundAction = updateGift.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">
          Editar presente
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{gift.name}</p>
      </div>

      <GiftForm categories={categories} gift={gift} action={boundAction} />
    </div>
  );
}
