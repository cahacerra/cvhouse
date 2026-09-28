import { GiftForm } from "@/components/admin/GiftForm";
import { createGift } from "@/app/admin/(dashboard)/presentes/actions";
import { getCategories } from "@/lib/data/public";

export const metadata = { title: "Novo presente — Painel Catarina & Vitor" };

export default async function NovoPresentePage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-3xl text-ink">Novo presente</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Preencha os detalhes do presente para adicioná-lo à lista pública.
        </p>
      </div>

      <GiftForm categories={categories} action={createGift} />
    </div>
  );
}
